import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs-extra';
import { join } from 'path';
import { copyTemplate, createBackup, cleanOldBackups, getTemplatePath } from '../lib/utils/file-operations.js';

const TEST_DIR = join(process.cwd(), '.test-temp');

beforeEach(async () => {
  await fs.ensureDir(TEST_DIR);
});

afterEach(async () => {
  await fs.remove(TEST_DIR);
});

describe('getTemplatePath', () => {
  it('returns correct path for valid version', () => {
    const path = getTemplatePath('1.0.0');
    expect(path).toContain('templates/v1.0.0');
  });

  it('throws on invalid version format', () => {
    expect(() => getTemplatePath('../etc/passwd')).toThrow('Invalid version format');
    expect(() => getTemplatePath('abc')).toThrow('Invalid version format');
  });
});

describe('copyTemplate', () => {
  it('copies template files to target', async () => {
    await copyTemplate('1.0.0', TEST_DIR, { force: true });

    expect(await fs.pathExists(join(TEST_DIR, '.claude'))).toBe(true);
    expect(await fs.pathExists(join(TEST_DIR, 'CLAUDE.md'))).toBe(true);
  });

  it('respects dry-run option', async () => {
    await copyTemplate('1.0.0', TEST_DIR, { dryRun: true });

    expect(await fs.pathExists(join(TEST_DIR, '.claude'))).toBe(false);
  });
});

describe('createBackup', () => {
  it('creates timestamped backup', async () => {
    // Setup: create files to backup
    await fs.ensureDir(join(TEST_DIR, '.claude'));
    await fs.writeFile(join(TEST_DIR, 'CLAUDE.md'), 'test');

    const backupPath = await createBackup(TEST_DIR);

    expect(backupPath).toContain('.ipa-ck/backup/');
    expect(await fs.pathExists(join(backupPath, 'CLAUDE.md'))).toBe(true);
  });
});

describe('cleanOldBackups', () => {
  it('keeps only specified number of backups', async () => {
    const backupRoot = join(TEST_DIR, '.ipa-ck', 'backup');

    // Create 5 backup folders
    for (let i = 1; i <= 5; i++) {
      await fs.ensureDir(join(backupRoot, `2026-01-0${i}`));
    }

    await cleanOldBackups(TEST_DIR, 3);

    const remaining = await fs.readdir(backupRoot);
    expect(remaining.length).toBe(3);
  });
});
