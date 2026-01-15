import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs-extra';
import { join } from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEST_DIR = join(__dirname, '../.test-project');
const CLI_PATH = join(__dirname, '../bin/ipa-ck.js');

function runCli(args, cwd = TEST_DIR, version = '1.0.0') {
  return execSync(`node ${CLI_PATH} ${args}`, {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, FORCE_COLOR: '0', IPA_CK_VERSION: version },
  });
}

beforeEach(async () => {
  await fs.ensureDir(TEST_DIR);
});

afterEach(async () => {
  await fs.remove(TEST_DIR);
});

describe('ipa-ck init', () => {
  it('initializes template in empty directory', async () => {
    runCli('init');

    expect(await fs.pathExists(join(TEST_DIR, '.claude'))).toBe(true);
    expect(await fs.pathExists(join(TEST_DIR, '.ipa-ck.json'))).toBe(true);
  });

  it('auto-updates with backup when already initialized', async () => {
    // First init
    runCli('init');

    // Second init = update with backup
    runCli('init');

    // Backup should exist
    const backupDir = join(TEST_DIR, '.ipa-ck', 'backup');
    expect(await fs.pathExists(backupDir)).toBe(true);

    // Config should have last-updated
    const config = await fs.readJson(join(TEST_DIR, '.ipa-ck.json'));
    expect(config['last-updated']).toBeDefined();
  });
});

describe('ipa-ck config', () => {
  it('lists configuration', async () => {
    runCli('init');

    const output = runCli('config --list');
    expect(output).toContain('template-version');
  });

  it('gets specific value', async () => {
    runCli('init');

    const output = runCli('config --get template-version');
    expect(output.trim()).toBe('1.0.0');
  });
});

describe('ipa-ck update-cli', () => {
  it('shows update instructions', () => {
    const output = runCli('update-cli', __dirname);
    expect(output).toContain('npm update -g ipa-ck');
  });
});
