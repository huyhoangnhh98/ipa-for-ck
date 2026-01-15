/**
 * Show instructions to update CLI
 * Prints npm update command for user to run
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { logger } from '../utils/logger.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function updateCli() {
  const pkg = JSON.parse(readFileSync(join(__dirname, '../../package.json'), 'utf8'));

  console.log('');
  logger.info(`Current CLI version: v${pkg.version}`);
  console.log('');
  console.log('To update the CLI, run:');
  console.log('');
  console.log('  npm update -g ipa-ck');
  console.log('');
  logger.dim('This will fetch the latest version from npm registry.');
}
