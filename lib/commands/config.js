/**
 * View or modify project configuration
 * Reads/writes .ipa-ck.json file
 */

import fs from 'fs-extra';
import { join } from 'path';
import { logger } from '../utils/logger.js';

const CONFIG_FILE = '.ipa-ck.json';

// Whitelist of allowed config keys (security: prevents arbitrary key injection)
const ALLOWED_KEYS = new Set([
  'template-version',
  'initialized-at',
  'cli-version',
  'last-updated'
]);

export async function config(options) {
  const cwd = process.cwd();
  const configPath = join(cwd, CONFIG_FILE);

  // Check if project is initialized
  if (!await fs.pathExists(configPath)) {
    logger.error('Not an IPA project. Run: ipa-ck init');
    process.exit(1);
  }

  try {
    const configData = await fs.readJson(configPath);

    // --list: Show all config
    if (options.list || (!options.get && !options.set)) {
      console.log('');
      console.log('IPA-CK Configuration:');
      console.log('');
      for (const [key, value] of Object.entries(configData)) {
        console.log(`  ${key}: ${value}`);
      }
      console.log('');
      return;
    }

    // --get <key>: Get specific value
    if (options.get) {
      const value = configData[options.get];
      if (value === undefined) {
        logger.error(`Key not found: ${options.get}`);
        process.exit(1);
      }
      console.log(value);
      return;
    }

    // --set <key> <value>: Set value
    if (options.set && options.set.length >= 2) {
      const [key, ...valueParts] = options.set;
      const value = valueParts.join(' ');

      // Security: Only allow whitelisted keys
      if (!ALLOWED_KEYS.has(key)) {
        logger.error(`Invalid key: ${key}`);
        logger.info(`Allowed keys: ${[...ALLOWED_KEYS].join(', ')}`);
        process.exit(1);
      }

      configData[key] = value;
      await fs.writeJson(configPath, configData, { spaces: 2 });
      logger.success(`Set ${key} = ${value}`);
      return;
    }

    // Default: show list
    console.log('');
    console.log('IPA-CK Configuration:');
    console.log('');
    for (const [key, value] of Object.entries(configData)) {
      console.log(`  ${key}: ${value}`);
    }
    console.log('');

  } catch (error) {
    logger.error(error.message);
    process.exit(1);
  }
}
