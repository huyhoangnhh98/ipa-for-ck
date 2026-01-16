# ipa-ck

CLI tool for IPA (Information-technology Promotion Agency) template management.

## Installation

```bash
npm install -g @huyhoangnhh98/ipa-ckipa-ck
```

## Quick Start

```bash
cd my-project
ipa-ck init          # Select version → Initialize template

# Update template (same command!)
ipa-ck init          # Auto-detects: creates backup → updates
```

## Commands

### `ipa-ck init`

Initialize or update IPA template (auto-detects mode).

```bash
ipa-ck init              # Interactive version picker
ipa-ck init --dry-run    # Preview changes
```

**Behavior:**
- **First time**: Initializes template, creates `.ipa-ck.json`
- **Already initialized**: Creates backup → Updates template

Backups saved to `.ipa-ck/backup/` (last 3 kept).

### `ipa-ck update-cli`

Show instructions to update the CLI tool.

### `ipa-ck config`

View or modify project configuration.

```bash
ipa-ck config --list                         # Show all
ipa-ck config --get template-version         # Get value
ipa-ck config --set template-version 3.1.0   # Set value
```

## Configuration

Project config stored in `.ipa-ck.json`:

```json
{
  "template-version": "1.0.0",
  "cli-version": "1.0.0",
  "initialized-at": "2026-01-15T10:30:00Z",
  "last-updated": "2026-01-15T12:00:00Z"
}
```

## Requirements

- Node.js >= 18

## License

MIT
