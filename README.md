# ipa-ck

CLI tool for IPA (Information-technology Promotion Agency, Japan) template management with Claude Code.

## What is IPA Template?

IPA template provides a structured documentation workflow for software development:

- **Lean Analysis**: MVP validation, user research, usage analytics
- **IPA Docs**: SRD (Requirements), UI_SPEC, API_SPEC, DB_DESIGN
- **Validation Gates**: Checkpoints before proceeding to next phase
- **Planning**: Phase-based implementation with multi-model support

## Installation

### npm (Recommended)

```bash
npm install -g @huyhoangnhh98/ipa-ck
```

### From Source

```bash
git clone https://github.com/huyhoangnhh98/ipa-template.git
cd ipa-template
npm install
npm link
```

### Verify Installation

```bash
ipa-ck --version
ipa-ck --help
```

## Quick Start

```bash
cd my-project
ipa-ck init          # Select version → Configure paths → Initialize

# Update template (same command!)
ipa-ck init          # Auto-detects: creates backup → updates
```

## Custom Paths

IPA-CK detects custom paths from `.ck.json` (ClaudeKit config):

**Priority:**
1. Project `.ck.json` (in project root)
2. Global `~/.claude/.ck.json`
3. Defaults (`docs/`, `plans/`)

**Example `.ck.json`:**
```json
{
  "paths": {
    "ck-docs": "ck-docs",
    "ck-plans": "ck-plans"
  }
}
```

During `ipa-ck init`, all template files will use your custom paths instead of `docs/` and `plans/`.

## Workflow Overview

### New Project (Lean + IPA)

```
┌─────────────────────────────────────────────────────────────┐
│ 1. LEAN ANALYSIS                                            │
├─────────────────────────────────────────────────────────────┤
│ /lean:user-research → docs/USER_RESEARCH.md (optional)     │
│ /lean [idea]        → MVP Analysis + Phase Breakdown        │
│                     → GATE 1: Validate scope & interviews   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. IPA SPECIFICATION                                        │
├─────────────────────────────────────────────────────────────┤
│ /ipa:spec           → docs/SRD.md + docs/UI_SPEC.md        │
│                     → GATE 2: Stakeholder review            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. DESIGN & PROTOTYPING                                     │
├─────────────────────────────────────────────────────────────┤
│ /ipa:design         → prototypes/html-mockups/              │
│                     → GATE 3: User testing (5+ users)       │
│ /ipa:mockup-analyze → docs/UI_DESIGN_SPEC.md (AI vision)   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. DETAIL DESIGN                                            │
├─────────────────────────────────────────────────────────────┤
│ /ipa:detail         → docs/API_SPEC.md + docs/DB_DESIGN.md │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. IMPLEMENTATION                                           │
├─────────────────────────────────────────────────────────────┤
│ /plan               → plans/{date}-{slug}/                  │
│ /code               → Implementation                        │
│ /ipa-docs:sync      → Sync docs with code                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. POST-LAUNCH                                              │
├─────────────────────────────────────────────────────────────┤
│ /lean:analyze-usage → plans/reports/usage-analysis-*.md    │
│ /lean [improvement] → Next iteration                        │
└─────────────────────────────────────────────────────────────┘
```

### Existing Project (No Docs)

```bash
/ipa:init           # Extract IPA docs from existing codebase
/lean [feature]     # Analyze for improvements
/plan → /code       # Implement
```

### External SRS Import

```bash
/ipa:import @external-srs.md    # Convert external SRS to IPA format
```

## Slash Commands

### Lean Commands

| Command | Output | Description |
|---------|--------|-------------|
| `/lean:user-research` | docs/USER_RESEARCH.md | User personas & journey maps |
| `/lean [idea]` | MVP Analysis | **GATE 1**: Lean analysis + phases |
| `/lean:analyze-usage` | plans/reports/usage-*.md | Post-launch analytics |

### IPA Commands

| Command | Output | Description |
|---------|--------|-------------|
| `/ipa:spec` | SRD.md + UI_SPEC.md | **GATE 2**: Requirements + UI |
| `/ipa:design` | prototypes/html-mockups/ | **GATE 3**: HTML mockups |
| `/ipa:detail` | API_SPEC.md + DB_DESIGN.md | Detail design |
| `/ipa:mockup-analyze` | UI_DESIGN_SPEC.md | Extract specs from mockups |
| `/ipa:init` | All docs | Extract from existing code |
| `/ipa:import` | IPA docs | Import external SRS |
| `/ipa:validate` | Report | Validate docs consistency |

### IPA Docs Commands

| Command | Output | Description |
|---------|--------|-------------|
| `/ipa-docs:sync` | Updated docs | Sync docs with implementation |
| `/ipa-docs:split` | Modular folders | Split large docs (>500 lines) |

### Plan Commands

| Command | When to Use |
|---------|-------------|
| `/plan` | Default entry (auto-selects fast/hard) |
| `/plan:fast` | Simple, well-understood task |
| `/plan:hard` | Complex, needs research |
| `/plan:parallel` | FE/BE split, multi-model |

## Validation Gates

| Gate | After | Criteria |
|------|-------|----------|
| GATE 1 | `/lean` | 3+ user interviews, scope ≤ 3 phases |
| GATE 2 | `/ipa:spec` | Stakeholder review, priorities confirmed |
| GATE 3 | `/ipa:design` | 5+ user testing, issues addressed |

## CLI Commands

### `ipa-ck init`

Initialize or update IPA template.

```bash
ipa-ck init              # Interactive: version + paths
ipa-ck init --dry-run    # Preview changes
ipa-ck init --force      # Override existing files
```

**Behavior:**
- **First time**: Initialize template, create `.ipa-ck.json`
- **Already initialized**: Backup → Update template

Backups: `.ipa-ck/backup/` (last 3 kept)

### `ipa-ck update-cli`

Show instructions to update CLI.

### `ipa-ck config`

View or modify configuration.

```bash
ipa-ck config --list                         # Show all
ipa-ck config --get template-version         # Get value
ipa-ck config --set template-version 1.2.0   # Set value
```

## Configuration

### Project Config (`.ipa-ck.json`)

```json
{
  "template-version": "1.2.0",
  "cli-version": "1.1.0",
  "initialized-at": "2026-01-18T10:30:00Z",
  "paths": {
    "docs": "docs",
    "plans": "plans"
  }
}
```

### ClaudeKit Config (`.ck.json`)

```json
{
  "paths": {
    "ck-docs": "ck-docs",
    "ck-plans": "ck-plans"
  }
}
```

## Template Versions

| Version | Features |
|---------|----------|
| 1.2.0 | Custom paths, `/ipa:import`, `/ipa-docs:split`, modular docs |
| 1.1.0 | Prefix support, IPA-WORKFLOW.md, optimized CLAUDE.md |
| 1.0.0 | Skills-based architecture, validation gates |

## Template Contents

After initialization:

```
project/
├── .claude/
│   ├── skills/
│   │   ├── ipa-planner/          # IPA-aware planning
│   │   ├── ipa-docs/             # Docs sync
│   │   ├── ipa-validator/        # Validation
│   │   ├── lean-analyst/         # Lean analysis
│   │   └── ipa-context-aware-planning/
│   ├── commands/
│   │   ├── ipa/                  # /ipa:* commands
│   │   ├── ipa-docs/             # /ipa-docs:* commands
│   │   └── lean.md               # /lean commands
│   └── workflows/
│       └── multi-model-task-distribution.md
├── CLAUDE.md                     # AI guidance
├── IPA-WORKFLOW.md               # Visual workflow guide
└── .ipa-ck.json                  # Config
```

## Requirements

- Node.js >= 18
- Claude Code CLI

## License

MIT
