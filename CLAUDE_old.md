# CLAUDE.md - IPA Project Template

AI-facing guidance for Claude Code with IPA (Japan Standard) documentation workflow.

---

## IPA DOCUMENTATION WORKFLOW

This project uses IPA (Information-technology Promotion Agency, Japan) standards for documentation.

### Documentation Flow

**New Project (Lean + IPA + DA):**
```
User Research (optional)
    ↓
/ipa:user-research → docs/USER_RESEARCH.md
    ↓
Idea + User Insights
    ↓
/lean [idea] → MVP Requirements (data-informed)
    ↓
/ipa:srd [MVP] → docs/SRD.md
    ↓
/ipa:bd → docs/UI_SPEC.md (with design rationale from research)
    ↓
/ipa:dd → docs/API_SPEC.md, docs/DB_DESIGN.md
    ↓
/ipa:design → prototypes/html-mockups/
    ↓
/ipa:mockup-analyze → docs/UI_DESIGN_SPEC.md
    ↓
/plan → /code → /docs:sync
    ↓
Launch MVP
    ↓
/ipa:analyze-usage → Usage insights
    ↓
/lean [improvement] → Next iteration
```

**Existing Project (Feature Improvement):**
```
Existing Codebase with docs
         ↓
    /lean [feature] → Analyze & suggest improvements
         ↓
    /plan [feature] → Implementation tasks
         ↓
    /code → /docs:sync
```

**Existing Project (No docs):**
```
Existing Codebase (no docs)
         ↓
    /ipa:init → Extract IPA docs from code
         ↓
    /lean [feature] → Analyze for improvements
         ↓
    /plan → /code → /docs:sync
```

### Slash Commands

| Command | Output | Description |
|---------|--------|-------------|
| `/lean` | MVP/Feature analysis | **Lean analysis: MVP definition or feature improvement** |
| `/ipa:user-research` | docs/USER_RESEARCH.md | User personas & journey maps (before /lean) |
| `/ipa:init` | All docs | Extract IPA docs from existing codebase |
| `/ipa:srd` | docs/SRD.md | System Requirement Definition (15 sections) |
| `/ipa:bd` | docs/UI_SPEC.md | Basic Design (screens, flows, design rationale) |
| `/ipa:dd` | docs/API_SPEC.md, docs/DB_DESIGN.md | Detail Design (API, DB) |
| `/ipa:design` | prototypes/html-mockups/ | Generate HTML mockups from UI_SPEC |
| `/ipa:mockup-analyze` | docs/UI_DESIGN_SPEC.md | Extract design specs from mockups (AI vision) |
| `/ipa:all` | All above | Generate all IPA docs in sequence |
| `/ipa:validate` | Validation report | Validate IPA docs consistency & traceability |
| `/ipa:analyze-usage` | plans/reports/usage-analysis-*.md | Post-launch usage analytics |
| `/docs:sync` | Update docs/ | Sync docs with actual implementation |

---

## TASK DISTRIBUTION PROTOCOL

**CRITICAL:** When running ANY `/plan*` command in this project, you MUST:
1. ✅ Read `.claude/workflows/multi-model-task-distribution.md` first
2. ✅ Run PRE-EXECUTION VALIDATION CHECKPOINT (new in v6.1)
3. ✅ Detect project type and create task files accordingly
4. ✅ If UI layer exists, ensure docs/UI_DESIGN_SPEC.md exists (run /ipa:mockup-analyze if not)
5. ✅ Follow the workflow's output structure exactly

### Phase-First Structure (MANDATORY - Project Override)

**ALL project types** in this project use nested phase folders:

```
plans/{date}-{slug}/
├── plan.md                      # Overview: goals, phases, dependencies
├── phase-01-{name}/
│   ├── core.md                  # Business logic, processing (replaces BE.md)
│   ├── ui.md                    # User interface, presentation (replaces FE.md)
│   ├── data.md                  # Data storage, pipelines, transformations
│   ├── infra.md                 # Infrastructure, deployment, cloud config
│   ├── svc-{service}.md         # Microservices (per service)
│   └── tasks.md                 # Generic fallback (simple/mixed projects)
├── phase-02-{name}/
│   └── ...
└── phase-NN-{name}/
```

**Layer Naming Pattern:** `{layer}-{context}.md` (e.g., `core-cloud.md`, `ui-mobile.md`)

**Base Layers (6 total):**

| Layer | Purpose |
|-------|---------|
| `core` | Business logic, processing, algorithms |
| `ui` | User interface, presentation |
| `data` | Data storage, pipelines, transformations |
| `infra` | Infrastructure, deployment, cloud config |
| `svc` | Service-specific (microservices) |
| `tasks` | Generic fallback (simple/mixed projects) |

**Execution Rules:**
- **Strict Sequential:** Phase N+1 can ONLY start after Phase N is fully completed
- **Within-Phase Order:** data → core → ui → infra
- **docs:sync:** HUMAN REVIEW REQUIRED - NEVER auto-sync, always ask user

**Note:** "Parallel" in project types refers to within-phase execution only (e.g., core.md and ui.md can run simultaneously within Phase 01). Phases themselves are always strictly sequential.

### Project Type Detection (MANDATORY)

```
┌─────────────────────────────────────────────────────────────┐
│ DETECT PROJECT TYPE BEFORE CREATING PLAN                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Check codebase structure:                                   │
│                                                             │
│ apps/FE/ + apps/BE/ exists?                                │
│   YES → Create core.md + ui.md (data → core → ui)          │
│   NO ↓                                                      │
│                                                             │
│ Multiple services (./svc-*, ./service-*)?                  │
│   YES → Create svc-{name}.md per service (Parallel)        │
│   NO ↓                                                      │
│                                                             │
│ Desktop App (UI + Core logic)?                             │
│   YES → Create core.md + ui.md (data → core → ui)          │
│   NO ↓                                                      │
│                                                             │
│ ML/Data patterns (notebooks, pipelines, models)?           │
│   YES → Create data.md + core-ml.md (data → core)          │
│   NO ↓                                                      │
│                                                             │
│ Chatbot/RAG project?                                        │
│   YES → Create data.md + core.md + ui.md (data → core → ui)│
│   NO → Create tasks.md in phase-XX/ (Sequential, default)  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Task File Output by Project Type

| Project Type | Task Files | Workflow |
|--------------|------------|----------|
| **Web App (FE/BE)** | `core.md` + `ui.md` | data → core → ui |
| **Microservices** | `svc-{name}.md` per service | Parallel → core-gateway |
| **Desktop App** | `core.md` + `ui.md` | data → core → ui |
| **ML/Data** | `data.md` + `core-ml.md` | data → core |
| **Chatbot/RAG** | `data.md` + `core.md` + `ui.md` | data → core → ui |
| **Monorepo/CLI/MCP/Library** | `tasks.md` | Sequential |

### Plan Commands

| Command | Description | When to Use |
|---------|-------------|-------------|
| `/plan` | Router chính, tự chọn fast/hard | Entry point mặc định |
| `/plan:fast` | Analyze only, không research | Task đơn giản, đã hiểu rõ |
| `/plan:hard` | Research + analyze chi tiết | Task phức tạp, cần tìm hiểu |
| `/plan:parallel` | Phases chạy song song | FE/BE split, multi-model |
| `/plan:two` | 2 approaches với trade-offs | Cần so sánh options |
| `/plan:validate` | Interview xác nhận decisions | Post-plan QA |
| `/plan:cro` | Conversion Rate Optimization | Marketing/landing pages |
| `/skill:plan` | Plan tạo agent skill mới | Skill development |

### Model Assignment (if multi-model)

| Task Type | Model | Reason |
|-----------|-------|--------|
| core API/Logic | Opus, Sonnet, GLM | Strong reasoning |
| data Pipelines | Opus, Sonnet | Data processing |
| ui Components | Gemini-Pro-3 | Visual understanding |
| infra DevOps | Opus, Sonnet | Infrastructure |

### Task Template (from workflow)

```markdown
### Task [N]: [Task Name] [S/M/L]

**Refs:** (Single source of truth - NO duplication)
- 📋 API: docs/API_SPEC.md#section
- 📋 UI: docs/UI_SPEC.md#screen

**Files:** (exclusive ownership)
- `path/to/file.ts`

**Dependencies:**
- ⏳ WAIT: Task X (must complete first)
- 🔗 SYNC: Task Y (needs alignment)

**Acceptance:**
- [ ] Matches contract in docs/
- [ ] Tests pass
```

---

## DOCS STRUCTURE

### IPA Docs (Generated)

| Doc | Source | Updated When |
|-----|--------|--------------|
| `docs/SRD.md` | /ipa:srd | Initial, rarely changes |
| `docs/UI_SPEC.md` | /ipa:bd | Before FE implementation |
| `docs/API_SPEC.md` | /ipa:dd | After BE implementation |
| `docs/DB_DESIGN.md` | /ipa:dd | After BE implementation |
| `docs/tech-stack.md` | Manual | Initial setup |

### Docs Sync Rule

**HUMAN REVIEW REQUIRED - NEVER auto-sync docs**

```
After /code layer complete:
       ↓
User verifies implementation ✓
       ↓
AskUserQuestion: "Ready to sync docs?"
       ↓
YES → /docs:sync (API_SPEC, DB_DESIGN, UI_SPEC)
NO → Continue without sync
```

---

## DEVELOPMENT PRINCIPLES

Always honor:
- **YAGNI** (You Aren't Gonna Need It)
- **KISS** (Keep It Simple, Stupid)
- **DRY** (Don't Repeat Yourself)

---

## QUALITY GATES

- [ ] Docs generated via /ipa:* commands
- [ ] /ipa:validate passes (no errors)
- [ ] Plan refs docs/ (DRY - no duplication)
- [ ] Code matches docs/INTERFACE_SPEC.md contract
- [ ] /docs:sync after implementation

---

## CONTEXT-AWARE PLANNING

When planning UI implementation, use `@path` syntax to pass design context:

```bash
/plan:hard implement login @prototypes/html-mockups/login
```

The `context-aware-planning` skill will:
1. Detect tech-stack from `.claude/tech-stack.md`
2. Parse HTML/CSS/JS from @path references
3. Extract: Tailwind config, CSS classes, SVGs, navigation flow
4. Transform code for target framework (className vs class, icon imports)
5. Generate phase files with FULL code snippets (100% design match)

**Syntax:**
- `@folder` → Include entire folder: `@prototypes/html-mockups`
- `@file` → Include single file: `@docs/UI_SPEC.md`
- Multiple refs: `@docs/design @docs/api-specs`

See: `.claude/skills/context-aware-planning/SKILL.md`

---

## EXTENDING THE TEMPLATE

### Adding Project-Specific Skills

This template includes only **workflow skills** (ipa-validator, lean-analyst). Projects can add their own skills when needed.

**When to add custom skills:**
- Project uses a library extensively with specific conventions
- Team has patterns that need documenting for AI agents
- Complex domain logic requires specialized guidance

**How to add:**
```bash
mkdir -p .claude/skills/{skill-name}
# Create SKILL.md with:
# - When to activate
# - Key patterns/conventions
# - Code examples
```

**For library documentation:**
- Use `/docs-seeker {library}` for latest docs (recommended)
- Create `docs/libraries/{lib}.md` only for project-specific patterns

### Adding Project-Specific Commands

```bash
mkdir -p .claude/commands/{category}
# Create {command}.md with:
# - description: Short description
# - argument-hint: Expected arguments
# - Command workflow
```

---

## REFERENCES

- Task Distribution: `.claude/workflows/multi-model-task-distribution.md`
- Agents: `.claude/agents/` (planner.md, docs-manager.md)
- Skills: `.claude/skills/` (context-aware-planning, ipa-validator, lean-analyst)
- Commands: `.claude/commands/` (ipa/, docs/, lean.md)