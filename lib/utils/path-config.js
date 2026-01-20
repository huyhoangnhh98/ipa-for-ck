/**
 * Path configuration utility
 * Handles detection and customization of docs/plans paths
 *
 * Priority (highest to lowest):
 * 1. User input (if customized during init)
 * 2. Project .ck.json (cwd/.ck.json)
 * 3. Global ~/.claude/.ck.json
 * 4. Defaults (docs/, plans/)
 */

import fs from 'fs-extra';
import { join } from 'path';
import { homedir } from 'os';
import inquirer from 'inquirer';

const CK_CONFIG_FILE = '.ck.json';
const GLOBAL_CLAUDE_DIR = join(homedir(), '.claude');
const DEFAULTS = {
  docs: 'docs',
  plans: 'plans',
};

/**
 * Detect paths from .ck.json (project-level first, then global)
 * @param {string} cwd - Current working directory
 * @returns {Promise<{docs: string, plans: string, source: string}>}
 */
export async function detectPaths(cwd) {
  // 1. Check project-level .ck.json
  const projectConfigPath = join(cwd, CK_CONFIG_FILE);
  if (await fs.pathExists(projectConfigPath)) {
    try {
      const config = await fs.readJson(projectConfigPath);
      const paths = config.paths || {};
      if (paths['ck-docs'] || paths['ck-plans']) {
        return {
          docs: paths['ck-docs'] || DEFAULTS.docs,
          plans: paths['ck-plans'] || DEFAULTS.plans,
          source: 'project .ck.json',
        };
      }
    } catch {
      // Invalid JSON, continue to next
    }
  }

  // 2. Check global ~/.claude/.ck.json
  const globalConfigPath = join(GLOBAL_CLAUDE_DIR, CK_CONFIG_FILE);
  if (await fs.pathExists(globalConfigPath)) {
    try {
      const config = await fs.readJson(globalConfigPath);
      const paths = config.paths || {};
      if (paths['ck-docs'] || paths['ck-plans']) {
        return {
          docs: paths['ck-docs'] || DEFAULTS.docs,
          plans: paths['ck-plans'] || DEFAULTS.plans,
          source: 'global ~/.claude/.ck.json',
        };
      }
    } catch {
      // Invalid JSON, continue to defaults
    }
  }

  // 3. Defaults
  return {
    docs: DEFAULTS.docs,
    plans: DEFAULTS.plans,
    source: 'default',
  };
}

/**
 * Check all available path sources
 * @param {string} cwd - Current working directory
 * @returns {Promise<{project: object|null, global: object|null, default: object}>}
 */
async function getAllPathSources(cwd) {
  const sources = {
    project: null,
    global: null,
    default: { docs: DEFAULTS.docs, plans: DEFAULTS.plans },
  };

  // Check project-level .ck.json
  const projectConfigPath = join(cwd, CK_CONFIG_FILE);
  if (await fs.pathExists(projectConfigPath)) {
    try {
      const config = await fs.readJson(projectConfigPath);
      const paths = config.paths || {};
      if (paths['ck-docs'] || paths['ck-plans']) {
        sources.project = {
          docs: paths['ck-docs'] || DEFAULTS.docs,
          plans: paths['ck-plans'] || DEFAULTS.plans,
        };
      }
    } catch {
      // Invalid JSON
    }
  }

  // Check global ~/.claude/.ck.json
  const globalConfigPath = join(GLOBAL_CLAUDE_DIR, CK_CONFIG_FILE);
  if (await fs.pathExists(globalConfigPath)) {
    try {
      const config = await fs.readJson(globalConfigPath);
      const paths = config.paths || {};
      if (paths['ck-docs'] || paths['ck-plans']) {
        sources.global = {
          docs: paths['ck-docs'] || DEFAULTS.docs,
          plans: paths['ck-plans'] || DEFAULTS.plans,
        };
      }
    } catch {
      // Invalid JSON
    }
  }

  return sources;
}

/**
 * Prompt user to select path source or customize
 * @param {string} cwd - Current working directory
 * @returns {Promise<{docs: string, plans: string}>}
 */
export async function promptPaths(cwd) {
  const sources = await getAllPathSources(cwd);

  // For testing: use detected paths (priority: project > global > default)
  if (process.env.IPA_CK_SKIP_PATH_PROMPT) {
    if (sources.project) return sources.project;
    if (sources.global) return sources.global;
    return sources.default;
  }

  console.log('');
  console.log('📁 Select docs/plans paths:');
  console.log('');

  // Build choices based on available sources
  const choices = [];

  // Default option
  choices.push({
    name: `Default (docs/, plans/)`,
    value: 'default',
  });

  // Project .ck.json option (if exists)
  if (sources.project) {
    choices.push({
      name: `Project .ck.json (${sources.project.docs}/, ${sources.project.plans}/)`,
      value: 'project',
    });
  }

  // Global ~/.claude/.ck.json option (if exists)
  if (sources.global) {
    choices.push({
      name: `Global ~/.claude/.ck.json (${sources.global.docs}/, ${sources.global.plans}/)`,
      value: 'global',
    });
  }

  // Custom option
  choices.push({
    name: 'Custom (enter manually)',
    value: 'custom',
  });

  // Determine default selection (priority: project > global > default)
  let defaultChoice = 'default';
  if (sources.project) defaultChoice = 'project';
  else if (sources.global) defaultChoice = 'global';

  const { pathSource } = await inquirer.prompt([
    {
      type: 'list',
      name: 'pathSource',
      message: 'Path source:',
      choices,
      default: defaultChoice,
    },
  ]);

  // Return based on selection
  if (pathSource === 'default') {
    return sources.default;
  }

  if (pathSource === 'project') {
    return sources.project;
  }

  if (pathSource === 'global') {
    return sources.global;
  }

  // Custom: prompt for paths
  const { docsPath, plansPath } = await inquirer.prompt([
    {
      type: 'input',
      name: 'docsPath',
      message: 'Docs path:',
      default: sources.project?.docs || sources.global?.docs || DEFAULTS.docs,
      validate: (input) => {
        if (!input || input.trim() === '') {
          return 'Path cannot be empty';
        }
        return true;
      },
    },
    {
      type: 'input',
      name: 'plansPath',
      message: 'Plans path:',
      default: sources.project?.plans || sources.global?.plans || DEFAULTS.plans,
      validate: (input) => {
        if (!input || input.trim() === '') {
          return 'Path cannot be empty';
        }
        return true;
      },
    },
  ]);

  return {
    docs: docsPath.replace(/\/+$/, ''), // Remove trailing slash
    plans: plansPath.replace(/\/+$/, ''),
  };
}

/**
 * Replace path placeholders in file content
 * @param {string} content - File content
 * @param {object} paths - { docs, plans }
 * @returns {string} Content with replaced paths
 */
export function replacePathsInContent(content, paths) {
  if (paths.docs === DEFAULTS.docs && paths.plans === DEFAULTS.plans) {
    // No replacement needed for defaults
    return content;
  }

  let result = content;

  // Replace docs/ references
  // Only replace when docs/ is standalone path (not part of ipa-docs/, my-docs/, etc.)
  // Match: start of line, after space, (, [, {, ", ', `, /, or >
  if (paths.docs !== DEFAULTS.docs) {
    result = result.replace(/(^|[\s(\[{/"'`/>])docs\//gm, `$1${paths.docs}/`);
  }

  // Replace plans/ references (same logic)
  if (paths.plans !== DEFAULTS.plans) {
    result = result.replace(/(^|[\s(\[{/"'`/>])plans\//gm, `$1${paths.plans}/`);
  }

  return result;
}

export { DEFAULTS };
