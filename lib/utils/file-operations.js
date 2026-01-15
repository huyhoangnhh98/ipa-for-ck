/**
 * File operations utility
 * Handles template copying, backup, and cleanup
 * 
 * Smart Merge Logic:
 * - .claude folder is merged (not overwritten)
 * - User's existing skills/commands/agents are preserved
 * - Only new template items are copied
 * - Conflicts can be forced with --force flag
 */

import fs from 'fs-extra';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { processClaudeMd } from './claude-md-merge.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Subdirectories in .claude that should be merged (not overwritten)
const CLAUDE_MERGE_DIRS = ['skills', 'commands', 'workflows'];

// Files/folders that are part of template (will be copied/backed up)
// CLAUDE.md and .claude are handled separately with merge logic
const TEMPLATE_FILES = [
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
 * Merge .claude folder with smart conflict handling
 * @param {string} templateClaudeDir - Template .claude directory
 * @param {string} targetClaudeDir - Target .claude directory
 * @param {object} options - { dryRun, force }
 * @returns {Promise<{copied: string[], conflicts: {path: string, action: string}[]}>}
 */
export async function mergeClaudeFolder(templateClaudeDir, targetClaudeDir, options = {}) {
  const copied = [];
  const conflicts = [];

  // Ensure target .claude exists
  if (!options.dryRun) {
    await fs.ensureDir(targetClaudeDir);
  }

  for (const subdir of CLAUDE_MERGE_DIRS) {
    const templateSubdir = join(templateClaudeDir, subdir);
    const targetSubdir = join(targetClaudeDir, subdir);

    // Skip if template doesn't have this subdir
    if (!await fs.pathExists(templateSubdir)) {
      continue;
    }

    // Ensure target subdir exists
    if (!options.dryRun) {
      await fs.ensureDir(targetSubdir);
    }

    // Get all items in template subdir
    const templateItems = await fs.readdir(templateSubdir);

    for (const item of templateItems) {
      const templateItemPath = join(templateSubdir, item);
      const targetItemPath = join(targetSubdir, item);
      const itemRelPath = `.claude/${subdir}/${item}`;

      // Check if item already exists in target
      if (await fs.pathExists(targetItemPath)) {
        if (options.force) {
          // Force: override with backup (backup handled by caller)
          conflicts.push({ path: itemRelPath, action: 'overwritten' });
          if (!options.dryRun) {
            await fs.copy(templateItemPath, targetItemPath, { overwrite: true });
          }
        } else {
          // No force: skip and warn
          conflicts.push({ path: itemRelPath, action: 'skipped' });
        }
      } else {
        // No conflict: copy new item
        if (!options.dryRun) {
          await fs.copy(templateItemPath, targetItemPath);
        }
        copied.push(itemRelPath);
      }
    }
  }

  // Copy any other files in .claude root (not in merge dirs)
  if (await fs.pathExists(templateClaudeDir)) {
    const rootItems = await fs.readdir(templateClaudeDir);
    for (const item of rootItems) {
      if (CLAUDE_MERGE_DIRS.includes(item)) continue; // Already handled above

      const templateItemPath = join(templateClaudeDir, item);
      const targetItemPath = join(targetClaudeDir, item);
      const stat = await fs.stat(templateItemPath);

      if (stat.isFile()) {
        const itemRelPath = `.claude/${item}`;
        if (await fs.pathExists(targetItemPath)) {
          if (options.force) {
            conflicts.push({ path: itemRelPath, action: 'overwritten' });
            if (!options.dryRun) {
              await fs.copy(templateItemPath, targetItemPath, { overwrite: true });
            }
          } else {
            conflicts.push({ path: itemRelPath, action: 'skipped' });
          }
        } else {
          if (!options.dryRun) {
            await fs.copy(templateItemPath, targetItemPath);
          }
          copied.push(itemRelPath);
        }
      }
    }
  }

  return { copied, conflicts };
}

/**
 * Copy template files to target directory
 * @param {string} version - Template version to copy
 * @param {string} targetDir - Target directory (usually cwd)
 * @param {object} options - { dryRun, force }
 * @returns {Promise<{copied: string[], conflicts: {path: string, action: string}[]}>}
 */
export async function copyTemplate(version, targetDir, options = {}) {
  const templateDir = getTemplatePath(version);
  const copied = [];
  const conflicts = [];

  // Handle regular template files (README.md, etc.)
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
      conflicts.push({ path: file, action: 'skipped' });
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

  // Handle .claude folder with smart merge
  const templateClaudeDir = join(templateDir, '.claude');
  const targetClaudeDir = join(targetDir, '.claude');

  if (await fs.pathExists(templateClaudeDir)) {
    const mergeResult = await mergeClaudeFolder(templateClaudeDir, targetClaudeDir, options);
    copied.push(...mergeResult.copied);
    conflicts.push(...mergeResult.conflicts);

    if (options.dryRun) {
      for (const item of mergeResult.copied) {
        console.log(`  [COPY] ${item}`);
      }
      for (const conflict of mergeResult.conflicts) {
        console.log(`  [${conflict.action.toUpperCase()}] ${conflict.path}`);
      }
    }
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

  return { copied, conflicts };
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

