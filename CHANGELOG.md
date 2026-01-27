# Changelog

All notable changes to IPA-CK template.

Format based on [Keep a Changelog](https://keepachangelog.com/).

## [1.3.0] - 2026-01-27

### Added
- **Skills-only architecture** for Claude Code 2.x+ (no commands folder)
- Version picker with warning indicator for incompatible versions
- Architecture metadata field in versions.json
- **19 new skills** converted from slash commands:
  - IPA workflow: `ipa-all`, `ipa-bd`, `ipa-dd`, `ipa-design`, `ipa-detail`, `ipa-fast`, `ipa-help`, `ipa-import`, `ipa-init`, `ipa-mockup-analyze`, `ipa-spec`, `ipa-srd`, `ipa-start`, `ipa-validate`
  - Docs: `ipa-docs-split`, `ipa-docs-sync`
  - Lean: `lean`, `lean-analyze-usage`, `lean-user-research`

### Changed
- `pickVersion()` now returns `{version, versionInfo}` object instead of string
- Init command displays warning messages for versions with requirements

### Removed
- `.claude/commands/` folder (all commands converted to skills)

## [1.2.1] - 2026-01-25

### Added
- Slash commands in `.claude/commands/` for backward compatibility
- Commands-with-skills hybrid architecture
- Command folders: `ipa/`, `ipa-docs/`, `lean/`

### Changed
- Template structure to support both skills and commands

## [1.2.0] - 2026-01-18

### Added
- Custom paths support via `.ck.json` config file
- Import external SRS functionality
- Modular documentation structure

## [1.1.0] - 2026-01-17

### Added
- Prefix support for commands
- `IPA-WORKFLOW.md` workflow documentation

### Changed
- Optimized `CLAUDE.md` structure

## [1.0.0] - 2026-01-15

### Added
- Initial release
- Skills-based architecture foundation with 5 core skills:
  - `ipa-context-aware-planning`
  - `ipa-docs`
  - `ipa-planner`
  - `ipa-validator`
  - `lean-analyst`
- Validation gates (GATE 1, 2, 3)
- IPA documentation workflow (`/ipa:spec`, `/ipa:design`, `/ipa:detail`)
- Slash commands: `docs/`, `ipa/`, `lean/`, `lean.md`
