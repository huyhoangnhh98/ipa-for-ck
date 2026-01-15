/**
 * CLAUDE.md merge utility
 * Merges IPA template content into existing CLAUDE.md without overwriting
 */

import fs from 'fs-extra';

// Unique marker to identify IPA section
const IPA_SECTION_START = '<!-- IPA-TEMPLATE-START -->';
const IPA_SECTION_END = '<!-- IPA-TEMPLATE-END -->';

/**
 * Check if CLAUDE.md already has IPA content
 * @param {string} content - Existing CLAUDE.md content
 * @returns {boolean}
 */
export function hasIpaContent(content) {
  return content.includes(IPA_SECTION_START) ||
         content.includes('## IPA DOCUMENTATION WORKFLOW');
}

/**
 * Wrap IPA template content with markers
 * @param {string} ipaContent - Raw IPA template content
 * @returns {string} - Wrapped content
 */
export function wrapIpaContent(ipaContent) {
  // Remove the first line (title) since it will be integrated
  const lines = ipaContent.split('\n');
  const contentWithoutTitle = lines.slice(1).join('\n').trim();

  return `${IPA_SECTION_START}
<!-- DO NOT EDIT THIS SECTION - Managed by ipa-ck -->

${contentWithoutTitle}

${IPA_SECTION_END}`;
}

/**
 * Extract IPA section from existing content
 * @param {string} content - Existing CLAUDE.md content
 * @returns {string|null} - IPA section or null
 */
export function extractIpaSection(content) {
  const startIdx = content.indexOf(IPA_SECTION_START);
  const endIdx = content.indexOf(IPA_SECTION_END);

  if (startIdx === -1 || endIdx === -1) return null;

  return content.substring(startIdx, endIdx + IPA_SECTION_END.length);
}

/**
 * Merge IPA template into existing CLAUDE.md
 * @param {string} existingContent - Existing CLAUDE.md content
 * @param {string} ipaTemplateContent - IPA template content
 * @returns {string} - Merged content
 */
export function mergeClaudeMd(existingContent, ipaTemplateContent) {
  const wrappedIpa = wrapIpaContent(ipaTemplateContent);

  // Case 1: Already has IPA markers - replace the section
  if (existingContent.includes(IPA_SECTION_START)) {
    const startIdx = existingContent.indexOf(IPA_SECTION_START);
    const endIdx = existingContent.indexOf(IPA_SECTION_END) + IPA_SECTION_END.length;

    return existingContent.substring(0, startIdx) +
           wrappedIpa +
           existingContent.substring(endIdx);
  }

  // Case 2: Has IPA content but no markers (legacy) - append at end
  if (hasIpaContent(existingContent)) {
    // Don't duplicate, just add markers info
    return existingContent + `

---

${wrappedIpa}`;
  }

  // Case 3: No IPA content - append at end
  return existingContent.trim() + `

---

${wrappedIpa}`;
}

/**
 * Process CLAUDE.md file - merge or create
 * @param {string} targetPath - Path to target CLAUDE.md
 * @param {string} templatePath - Path to IPA template CLAUDE.md
 * @param {object} options - Options
 * @returns {Promise<{action: string, message: string}>}
 */
export async function processClaudeMd(targetPath, templatePath, options = {}) {
  const ipaContent = await fs.readFile(templatePath, 'utf8');
  const targetExists = await fs.pathExists(targetPath);

  if (!targetExists) {
    // No existing file - create with wrapped content
    const wrapped = `# CLAUDE.md

${wrapIpaContent(ipaContent)}`;

    if (!options.dryRun) {
      await fs.writeFile(targetPath, wrapped);
    }
    return { action: 'created', message: 'CLAUDE.md created with IPA template' };
  }

  const existingContent = await fs.readFile(targetPath, 'utf8');

  // Check if update needed
  if (existingContent.includes(IPA_SECTION_START)) {
    const currentIpa = extractIpaSection(existingContent);
    const newWrapped = wrapIpaContent(ipaContent);

    if (currentIpa === newWrapped) {
      return { action: 'skipped', message: 'CLAUDE.md already up-to-date' };
    }
  }

  // Merge content
  const merged = mergeClaudeMd(existingContent, ipaContent);

  if (!options.dryRun) {
    await fs.writeFile(targetPath, merged);
  }

  return { action: 'merged', message: 'CLAUDE.md updated with IPA template' };
}
