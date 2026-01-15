/**
 * Initialize or update IPA template
 * Single command for both init and update workflows
 */

import fs from 'fs-extra';
import { join } from 'path';
import { logger } from '../utils/logger.js';
import { pickVersion } from '../utils/version-picker.js';
import { copyTemplate, createBackup, cleanOldBackups } from '../utils/file-operations.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONFIG_FILE = '.ipa-ck.json';

export async function init(options) {
  const cwd = process.cwd();
  const configPath = join(cwd, CONFIG_FILE);
  const isUpdate = await fs.pathExists(configPath);

  try {
    // Get current version if updating
    let currentVersion = null;
    if (isUpdate) {
      const config = await fs.readJson(configPath);
      currentVersion = config['template-version'];
    }

    // Pick version (always interactive)
    const version = await pickVersion();

    // Dry run mode
    if (options.dryRun) {
      const action = isUpdate ? 'update' : 'initialize';
      logger.info(`[DRY RUN] Would ${action} template v${version}`);
      console.log('Files to copy:');
      await copyTemplate(version, cwd, { dryRun: true, force: true });
      return;
    }

    // If updating, create backup first
    if (isUpdate) {
      logger.info('Creating backup...');
      const backupPath = await createBackup(cwd);
      await cleanOldBackups(cwd, 3);
      logger.dim(`Backup: ${backupPath}`);
    }

    // Copy template files
    const action = isUpdate ? 'Updating' : 'Initializing';
    logger.info(`${action} template v${version}...`);
    const copied = await copyTemplate(version, cwd, { force: true });

    // Create/update config file
    const cliPkg = await fs.readJson(join(__dirname, '../../package.json'));

    const config = {
      'template-version': version,
      'cli-version': cliPkg.version,
      'initialized-at': isUpdate ? (await fs.readJson(configPath))['initialized-at'] : new Date().toISOString(),
      ...(isUpdate && { 'last-updated': new Date().toISOString() }),
    };

    await fs.writeJson(configPath, config, { spaces: 2 });

    // Success message
    if (isUpdate && currentVersion !== version) {
      logger.success(`Template updated v${currentVersion} → v${version}`);
    } else if (isUpdate) {
      logger.success(`Template refreshed v${version}`);
    } else {
      logger.success(`Template v${version} initialized`);
    }
    logger.dim(`Copied: ${copied.join(', ')}`);

  } catch (error) {
    logger.error(error.message);
    process.exit(1);
  }
}
