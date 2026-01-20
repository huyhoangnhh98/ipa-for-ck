/**
 * Initialize or update IPA template
 * Single command for both init and update workflows
 */

import fs from 'fs-extra';
import { join } from 'path';
import { logger } from '../utils/logger.js';
import { pickVersion } from '../utils/version-picker.js';
import { copyTemplate, createBackup, cleanOldBackups } from '../utils/file-operations.js';
import { promptPaths, DEFAULTS } from '../utils/path-config.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createInterface } from 'readline';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONFIG_FILE = '.ipa-ck.json';

/**
 * Prompt user for confirmation
 * @param {string} message - Question to ask
 * @returns {Promise<boolean>} True if user confirms
 */
async function promptConfirm(message) {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(`${message} (y/N): `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

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

    // Prompt for paths (detect from .ck.json or use defaults)
    const paths = await promptPaths(cwd);

    // Dry run mode
    if (options.dryRun) {
      const action = isUpdate ? 'update' : 'initialize';
      logger.info(`[DRY RUN] Would ${action} template v${version}`);
      logger.info(`Paths: docs=${paths.docs}/, plans=${paths.plans}/`);
      console.log('Files to copy:');
      await copyTemplate(version, cwd, { dryRun: true, force: options.force, paths });
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
    const { copied, conflicts } = await copyTemplate(version, cwd, { force: options.force, paths });

    // Show conflict warnings
    const skippedConflicts = conflicts.filter(c => c.action === 'skipped');
    const overwrittenConflicts = conflicts.filter(c => c.action === 'overwritten');

    if (skippedConflicts.length > 0) {
      logger.warn(`\n⚠️  ${skippedConflicts.length} existing item(s) preserved (not overwritten):`);
      skippedConflicts.forEach(c => logger.warn(`   • ${c.path}`));
      logger.info('   Use --force to override (will backup first)\n');
    }

    if (overwrittenConflicts.length > 0) {
      logger.info(`\n📝 ${overwrittenConflicts.length} item(s) overwritten (backed up):`);
      overwrittenConflicts.forEach(c => logger.dim(`   • ${c.path}`));
    }

    // Create/update config file
    const cliPkg = await fs.readJson(join(__dirname, '../../package.json'));

    const config = {
      'template-version': version,
      'cli-version': cliPkg.version,
      'initialized-at': isUpdate ? (await fs.readJson(configPath))['initialized-at'] : new Date().toISOString(),
      ...(isUpdate && { 'last-updated': new Date().toISOString() }),
      paths: {
        docs: paths.docs,
        plans: paths.plans,
      },
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

    // Show paths info
    if (paths.docs !== DEFAULTS.docs || paths.plans !== DEFAULTS.plans) {
      logger.info(`📁 Custom paths: docs=${paths.docs}/, plans=${paths.plans}/`);
    }

    if (copied.length > 0) {
      logger.dim(`Copied: ${copied.join(', ')}`);
    }

  } catch (error) {
    logger.error(error.message);
    process.exit(1);
  }
}

