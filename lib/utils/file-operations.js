/**
 * File operations utility
 * Handles template copying, backup, and cleanup
 */

import fs from 'fs-extra';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { processClaudeMd } from './claude-md-merge.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Files/folders that are part of template (will be copied/backed up)
// CLAUDE.md is handled separately with merge logic
const TEMPLATE_FILES = [
  '.claude',
  'README.md',
];

// All template files including CLAUDE.md (for backup)
const ALL_TEMPLATE_FILES = [
  '.claude',
  'CLAUDE.md',
  'README.md',
];

/**
 * Validate version string format (semver: X.Y.Z)
 * @param {string} version - Version to validate
 * @returns {boolean} True if valid semver format
 */
function isValidVersion(version) {
  // Only allow semver format: digits.digits.digits
  return /^\d+\.\d+\.\d+$/.test(version);
}

/**
 * Get absolute path to bundled template version
 * @param {string} version - Template version (e.g., "1.0.0")
 * @returns {string} Absolute path to template directory
 * @throws {Error} If version format is invalid (security: prevents path traversal)
 */
export function getTemplatePath(version) {
  if (!isValidVersion(version)) {
    throw new Error(`Invalid version format: ${version}. Expected X.Y.Z`);
  }
  return join(__dirname, `../templates/v${version}`);
}

/**
 * Copy template files to target directory
 * @param {string} version - Template version to copy
 * @param {string} targetDir - Target directory (usually cwd)
 * @param {object} options - { dryRun, force }
 * @returns {Promise<string[]>} List of copied files
 */
export async function copyTemplate(version, targetDir, options = {}) {
  const templateDir = getTemplatePath(version);
  const copied = [];

  for (const file of TEMPLATE_FILES) {
    const src = join(templateDir, file);
    const dest = join(targetDir, file);

    // Check if source exists in template
    if (!await fs.pathExists(src)) {
      continue;
    }

    // Check if destination exists and not forcing
    if (await fs.pathExists(dest) && !options.force) {
      if (options.dryRun) {
        console.log(`  [SKIP] ${file} (exists)`);
      }
      continue;
    }

    if (options.dryRun) {
      console.log(`  [COPY] ${file}`);
      copied.push(file);
      continue;
    }

    await fs.copy(src, dest, { overwrite: true });
    copied.push(file);
  }

  // Handle CLAUDE.md separately with merge logic
  const claudeMdSrc = join(templateDir, 'CLAUDE.md');
  const claudeMdDest = join(targetDir, 'CLAUDE.md');

  if (await fs.pathExists(claudeMdSrc)) {
    const result = await processClaudeMd(claudeMdDest, claudeMdSrc, { dryRun: options.dryRun });

    if (options.dryRun) {
      console.log(`  [${result.action.toUpperCase()}] CLAUDE.md`);
    }

    if (result.action !== 'skipped') {
      copied.push('CLAUDE.md');
    }
  }

  return copied;
}

/**
 * Create timestamped backup of template files
 * @param {string} targetDir - Directory to backup from
 * @returns {Promise<string>} Path to backup directory
 */
export async function createBackup(targetDir) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = join(targetDir, '.ipa-ck', 'backup', timestamp);

  await fs.ensureDir(backupDir);

  for (const file of ALL_TEMPLATE_FILES) {
    const src = join(targetDir, file);
    if (await fs.pathExists(src)) {
      const dest = join(backupDir, file);
      await fs.copy(src, dest);
    }
  }

  return backupDir;
}

/**
 * Clean old backups, keeping only specified count
 * @param {string} targetDir - Project directory
 * @param {number} keepCount - Number of backups to keep (default 3)
 */
export async function cleanOldBackups(targetDir, keepCount = 3) {
  const backupRoot = join(targetDir, '.ipa-ck', 'backup');

  if (!await fs.pathExists(backupRoot)) return;

  const backups = await fs.readdir(backupRoot);
  const sorted = backups.sort().reverse(); // Newest first (ISO timestamp)

  // Remove old backups beyond keepCount
  for (let i = keepCount; i < sorted.length; i++) {
    await fs.remove(join(backupRoot, sorted[i]));
  }
}
