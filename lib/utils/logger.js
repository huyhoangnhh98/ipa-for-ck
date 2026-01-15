/**
 * Logger utility with colored output
 * Provides consistent logging across CLI commands
 */

import chalk from 'chalk';

export const logger = {
  info: (msg) => console.log(chalk.blue('ℹ'), msg),
  success: (msg) => console.log(chalk.green('✓'), msg),
  warn: (msg) => console.log(chalk.yellow('⚠'), msg),
  error: (msg) => console.log(chalk.red('✗'), msg),
  dim: (msg) => console.log(chalk.dim(msg)),
};
