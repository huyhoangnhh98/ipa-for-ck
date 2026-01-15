/**
 * Version picker utility
 * Interactive prompt for template versions
 */

import inquirer from 'inquirer';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Get available template versions from versions.json
 */
export function getAvailableVersions() {
  const versionsPath = join(__dirname, '../templates/versions.json');
  const data = JSON.parse(readFileSync(versionsPath, 'utf8'));
  return data;
}

/**
 * Pick a template version interactively
 * @returns {Promise<string>} Selected version
 */
export async function pickVersion() {
  const { versions, latest } = getAvailableVersions();

  // For testing: allow bypassing interactive prompt
  if (process.env.IPA_CK_VERSION) {
    const testVersion = process.env.IPA_CK_VERSION;
    const found = versions.find(v => v.version === testVersion);
    if (!found) {
      throw new Error(`Version ${testVersion} not available.`);
    }
    return testVersion;
  }

  const choices = versions.map(v => ({
    name: `v${v.version}${v.version === latest ? ' (latest)' : ''}${v.recommended ? ' ★' : ''} - ${v.notes}`,
    value: v.version,
  }));

  const { version } = await inquirer.prompt([
    {
      type: 'list',
      name: 'version',
      message: 'Select template version:',
      choices,
      default: latest,
    },
  ]);

  return version;
}
