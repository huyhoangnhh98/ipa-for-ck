#!/usr/bin/env node

import { program } from 'commander';
import { init } from '../lib/commands/init.js';
import { updateCli } from '../lib/commands/update-cli.js';
import { config } from '../lib/commands/config.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf8'));

program
  .name('ipa-ck')
  .description('IPA template CLI - Initialize and manage IPA documentation workflow')
  .version(pkg.version);

program
  .command('init')
  .description('Initialize or update IPA template (auto-detects mode)')
  .option('--dry-run', 'Show what would be done without making changes')
  .action(init);

program
  .command('update-cli')
  .description('Show instructions to update CLI')
  .action(updateCli);

program
  .command('config')
  .description('View or modify configuration')
  .option('--list', 'List all configuration')
  .option('--get <key>', 'Get specific config value')
  .option('--set <key_value...>', 'Set config value (key value)')
  .action(config);

program.parse();
