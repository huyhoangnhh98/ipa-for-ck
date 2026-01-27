---
description: Generate UI prototypes from UI_SPEC (pure implementation, no design research)
argument-hint: "[optional: style-preset or screen-fix]"
---

## ARCHITECTURE NOTE (v1.2.1)

**Design research moved to `/ipa:spec`**

This command is now **pure implementation**:
- NO URL/image reference input (handled in `/ipa:spec`)
- Reads Design System from `docs/UI_SPEC.md` (populated by `/ipa:spec`)
- Focus: Generate HTML prototypes matching design tokens

**Workflow:**
```
/ipa:spec @url or @image  →  docs/UI_SPEC.md (with Design System)
                               ↓
/ipa:design               →  prototypes/ (implements Design System)
```

---

## MANDATORY Checklist (MUST verify before completing)

**CRITICAL - Every HTML file MUST have:**
- [ ] `<body class="cjx-{stage}">` where stage = onboarding|usage|retention|discovery
- [ ] CJX comment header at top of file
- [ ] styles.css uses EXACT tokens from UI_SPEC Design System
- [ ] All screens from UI_SPEC generated (count must match)
- [ ] README.md has FR mapping table
- [ ] **REAL SVG charts** - NO placeholder text like "[Chart: ...]" or "(Implement with...)"
- [ ] Charts must use actual SVG `<circle>`, `<path>`, `<polyline>` elements with real data visualization

**DO NOT mark task complete until ALL checkboxes verified.**

---

## CRITICAL: Chart Implementation Requirements

**NEVER use placeholder text for charts.** Generate REAL SVG visualizations:

### Line Chart Example (Cost Trend)
```html
<svg class="line-chart" viewBox="0 0 800 300" preserveAspectRatio="xMidYMid meet">
  <!-- Grid lines -->
  <g class="grid">
    <line x1="50" y1="250" x2="750" y2="250" stroke="#e0e0e0"/>
    <line x1="50" y1="200" x2="750" y2="200" stroke="#e0e0e0" stroke-dasharray="4"/>
    <line x1="50" y1="150" x2="750" y2="150" stroke="#e0e0e0" stroke-dasharray="4"/>
    <line x1="50" y1="100" x2="750" y2="100" stroke="#e0e0e0" stroke-dasharray="4"/>
  </g>
  <!-- Data line -->
  <polyline
    fill="none"
    stroke="#1976d2"
    stroke-width="3"
    points="100,220 200,200 300,180 400,150 500,160 600,120 700,100"
  />
  <!-- Data points -->
  <g class="data-points">
    <circle cx="100" cy="220" r="6" fill="#1976d2"/>
    <circle cx="200" cy="200" r="6" fill="#1976d2"/>
    <circle cx="300" cy="180" r="6" fill="#1976d2"/>
    <circle cx="400" cy="150" r="6" fill="#1976d2"/>
    <circle cx="500" cy="160" r="6" fill="#1976d2"/>
    <circle cx="600" cy="120" r="6" fill="#1976d2"/>
    <circle cx="700" cy="100" r="6" fill="#1976d2"/>
  </g>
</svg>
```

### Donut/Pie Chart Example (Service Breakdown)
```html
<svg class="donut-chart" viewBox="0 0 200 200">
  <!-- Background circle -->
  <circle cx="100" cy="100" r="80" fill="none" stroke="#e0e0e0" stroke-width="30"/>
  <!-- Data segments (stroke-dasharray = segment size, remaining) -->
  <circle cx="100" cy="100" r="80" fill="none" stroke="#1976d2" stroke-width="30"
          stroke-dasharray="150 350" transform="rotate(-90 100 100)"/>
  <circle cx="100" cy="100" r="80" fill="none" stroke="#2e7d32" stroke-width="30"
          stroke-dasharray="100 400" stroke-dashoffset="-150" transform="rotate(-90 100 100)"/>
  <circle cx="100" cy="100" r="80" fill="none" stroke="#ed6c02" stroke-width="30"
          stroke-dasharray="80 420" stroke-dashoffset="-250" transform="rotate(-90 100 100)"/>
  <circle cx="100" cy="100" r="80" fill="none" stroke="#9c27b0" stroke-width="30"
          stroke-dasharray="70 430" stroke-dashoffset="-330" transform="rotate(-90 100 100)"/>
  <!-- Center text -->
  <text x="100" y="95" text-anchor="middle" font-size="12" fill="#666">Total</text>
  <text x="100" y="115" text-anchor="middle" font-size="18" font-weight="bold" fill="#333">$45,872</text>
</svg>
```

### Bar Chart Example (Region Breakdown)
```html
<svg class="bar-chart" viewBox="0 0 400 200">
  <g class="bars">
    <rect x="30" y="30" width="60" height="120" fill="#1976d2" rx="4"/>
    <rect x="110" y="60" width="60" height="90" fill="#42a5f5" rx="4"/>
    <rect x="190" y="90" width="60" height="60" fill="#64b5f6" rx="4"/>
    <rect x="270" y="110" width="60" height="40" fill="#90caf9" rx="4"/>
  </g>
  <g class="labels" font-size="11" fill="#666">
    <text x="60" y="170" text-anchor="middle">us-east-1</text>
    <text x="140" y="170" text-anchor="middle">us-west-2</text>
    <text x="220" y="170" text-anchor="middle">eu-west-1</text>
    <text x="300" y="170" text-anchor="middle">ap-northeast</text>
  </g>
</svg>
```

### Progress Bar Example (Provider Distribution)
```html
<div class="progress-bar-container">
  <div class="provider-row">
    <span class="provider-badge aws">A</span>
    <span class="provider-name">AWS</span>
    <div class="progress-bar">
      <div class="progress-fill" style="width: 62%; background: #ff9900;"></div>
    </div>
    <span class="provider-value">$28,420 (62%)</span>
  </div>
  <div class="provider-row">
    <span class="provider-badge azure">Az</span>
    <span class="provider-name">Azure</span>
    <div class="progress-bar">
      <div class="progress-fill" style="width: 26%; background: #0078d4;"></div>
    </div>
    <span class="provider-value">$12,150 (26%)</span>
  </div>
  <div class="provider-row">
    <span class="provider-badge gcp">G</span>
    <span class="provider-name">GCP</span>
    <div class="progress-bar">
      <div class="progress-fill" style="width: 12%; background: #4285f4;"></div>
    </div>
    <span class="provider-value">$5,302 (12%)</span>
  </div>
</div>
```

**IMPORTANT:** Every dashboard/analytics screen MUST use real SVG charts, NOT placeholder text.

---

## UNIFIED LAYOUT STANDARDS (MANDATORY)

**Class Naming Convention:**

| Purpose | Class Name | CSS |
|---------|------------|-----|
| App wrapper | `app-layout` | `display: flex; min-height: 100vh` |
| Main content | `main-content` | `flex: 1; margin-left: var(--sidebar-width)` |
| Left sidebar | `sidebar` | Add `hide-mobile` for responsive |
| KPI cards grid | `kpi-grid` | `grid-template-columns: repeat(4, 1fr)` |
| Chart container | `chart-card` | Standard card styling |
| Data table | `table-container` | Overflow handling |

**Region Explorer Pattern (S-12 Resources):**
```
CORRECT:
+--------+------------------------------+
| NAV    | [Region Explorer] [Global]   |
|        |------------------------------|
|        | 🇺🇸 US East | 🇺🇸 US West | 🇪🇺 EU |
|        |------------------------------|
|        | Resources for selected region|
+--------+------------------------------+

WRONG (DO NOT USE):
Sidebar list with regions as nested menu items
```

**Region Card Pattern:**
```html
<div class="region-grid">
  <div class="region-card" data-region="us-east-1">
    <span class="region-flag">🇺🇸</span>
    <span class="region-name">US East</span>
    <span class="region-count">24 resources</span>
  </div>
  <!-- More cards... -->
</div>
```

**Responsive Pattern:**
```html
<nav class="sidebar hide-mobile">...</nav>
```
```css
@media (max-width: 767px) {
  .hide-mobile { display: none; }
  .main-content { margin-left: 0; }
}
```

---

## CJX ANIMATIONS (MANDATORY)

**Every screen MUST have entrance animations based on CJX stage:**

```css
/* CJX Stage Animations */
.cjx-onboarding [data-cjx-entrance] {
  animation: fadeInUp 0.6s ease-out;
}

.cjx-usage [data-cjx-entrance] {
  animation: fadeIn 0.3s ease;
}

.cjx-retention [data-cjx-entrance] {
  animation: fadeIn 0.4s ease;
}

.cjx-discovery [data-cjx-entrance] {
  animation: fadeInUp 0.8s ease-out;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

**Add `data-cjx-entrance` to:**
- Login card
- Dashboard KPI grid
- Form cards
- Table containers
- Modal content

---

## COMPONENT STANDARDS (MANDATORY)

### Status Badge
Use for connection status, sync status, health indicators:
```html
<span class="status-badge success">Connected</span>
<span class="status-badge error">Disconnected</span>
<span class="status-badge warning">Pending</span>
```

```css
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: 500;
}
.status-badge.success { background: rgba(46,125,50,0.1); color: var(--color-success); }
.status-badge.error { background: rgba(211,47,47,0.1); color: var(--color-error); }
.status-badge.warning { background: rgba(237,108,2,0.1); color: var(--color-warning); }
```

### Toggle Group
For AI/Default toggle, view mode toggle:
```html
<div class="toggle-group">
  <button class="toggle-btn active">Default</button>
  <button class="toggle-btn">AI</button>
</div>
```

```css
.toggle-group {
  display: flex;
  background: var(--color-grey-100);
  border-radius: var(--radius-full);
  padding: 4px;
}
.toggle-btn {
  padding: 8px 16px;
  border: none;
  background: transparent;
  border-radius: var(--radius-full);
  cursor: pointer;
}
.toggle-btn.active {
  background: white;
  box-shadow: var(--shadow-sm);
  color: var(--color-primary);
}
```

### Form Row
For two-column form layouts:
```html
<div class="form-row">
  <div class="form-field">...</div>
  <div class="form-field">...</div>
</div>
```

```css
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}
@media (max-width: 767px) {
  .form-row { grid-template-columns: 1fr; }
}
```

---

## LOGIN SCREEN ENHANCEMENT (S-01)

**Background:** Use gradient for visual appeal
```css
.login-page {
  background: linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 50%, var(--color-primary-light) 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

**Card:** Add entrance animation
```html
<div class="login-card" data-cjx-entrance>
  <!-- Login form content -->
</div>
```

```css
.login-card {
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: var(--space-8);
  animation: fadeInUp 0.6s ease-out;
}
```

---

## Purpose

Generate **production-ready HTML/CSS/JS prototypes** from `docs/UI_SPEC.md`.

**Key Features:**
- CJX-driven design (emotions → UI decisions)
- Uses Design System from UI_SPEC (populated by /ipa:spec)
- UI/UX Pro Max skill integration

Output: `prototypes/` (HTML, CSS, JS, icons)

---

## Required Skills (Priority Order)

1. **`ui-ux-pro-max`** - Design intelligence database (ALWAYS ACTIVATE FIRST)
2. **`frontend-design`** - Component implementation

---

## Flags

- `--fast`: Skip GATE 3 prompt (not recommended for new projects)

---

## Input

**Required:**
- `docs/UI_SPEC.md` (must exist from /ipa:spec, includes Design System + CJX)

**Optional Arguments:**
- **Style preset**: Override style (e.g., `minimalist`, `glassmorphism`)
- **Screen fix**: Fix specific screen (e.g., `S-01 "make header sticky"`)

---

## CJX → Design Mapping

Read CJX from UI_SPEC.md and apply to design decisions:

```
┌─────────────────────────────────────────────────────────────┐
│ CJX-DRIVEN DESIGN                                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ JOURNEY STAGE → DESIGN PATTERN                              │
│                                                             │
│ Discovery (Curious)                                         │
│   → Bold hero, trust signals, clear value prop              │
│   → Primary CTA prominent, social proof visible             │
│   → Animation: subtle entrance, draw attention              │
│                                                             │
│ Onboarding (Hesitant)                                       │
│   → Progress indicator, minimal fields                      │
│   → Reassuring copy, easy exit option                       │
│   → Animation: encouraging micro-interactions               │
│                                                             │
│ Usage (Engaged)                                             │
│   → Clean dashboard, quick actions                          │
│   → Data visualization, status feedback                     │
│   → Animation: smooth transitions, success celebrations     │
│                                                             │
│ Retention (Satisfied/Frustrated)                            │
│   → Help accessible, feedback channels                      │
│   → Achievement badges, usage stats                         │
│   → Animation: reward animations, gentle nudges             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Emotion → Visual Mapping

| User Emotion | Color Tone | Typography | Spacing | Animation |
|--------------|------------|------------|---------|-----------|
| Curious | Vibrant, inviting | Bold headlines | Generous | Entrance effects |
| Hesitant | Calm, trustworthy | Clear, readable | Comfortable | Subtle guides |
| Confused | Simple, focused | Large, clear | Lots of whitespace | Directional cues |
| Frustrated | Neutral, calming | Easy to scan | Minimal clutter | Soothing transitions |
| Satisfied | Warm, celebratory | Friendly | Balanced | Success feedback |
| Engaged | Energetic, focused | Efficient | Compact but clear | Quick responses |

---

## Skill Activation

This command activates the **ui-ux-promax** skill with VividKit principles.

### Design Intelligence (from VividKit)

```
┌─────────────────────────────────────────────────────────────┐
│ AI DESIGN DATABASE (50+ Styles, 21+ Palettes, 50+ Fonts)   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 1. ANALYZE INPUT                                            │
│    - Read docs/UI_SPEC.md (screens, design system)          │
│    - Apply Design System from /ipa:spec                     │
│    - Extract: colors, typography, spacing, patterns         │
│                                                             │
│ 2. MATCH DESIGN PATTERNS                                    │
│    - Industry context (SaaS, E-commerce, Dashboard, etc.)   │
│    - UI style (minimalist, glassmorphism, etc.)             │
│    - Component library (cards, forms, navigation)           │
│                                                             │
│ 3. GENERATE PRODUCTION CODE                                 │
│    - HTML5 semantic structure                               │
│    - CSS with design tokens                                 │
│    - Responsive breakpoints                                 │
│    - Interaction states                                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Mandatory Execution Steps

### Step 0: Design Intelligence Gathering (BEFORE ANY DESIGN)

**ALWAYS run these searches first** based on UI_SPEC context:

```bash
# Product type from UI_SPEC (SaaS, E-commerce, Dashboard, etc.)
python3 $HOME/.claude/skills/ui-ux-pro-max/scripts/search.py "<product-type>" --domain product

# Style from reference or preset (minimalist, modern, etc.)
python3 $HOME/.claude/skills/ui-ux-pro-max/scripts/search.py "<style-keywords>" --domain style

# Typography mood (professional, playful, elegant, etc.)
python3 $HOME/.claude/skills/ui-ux-pro-max/scripts/search.py "<mood>" --domain typography

# Industry colors (fintech, healthcare, saas, etc.)
python3 $HOME/.claude/skills/ui-ux-pro-max/scripts/search.py "<industry>" --domain color
```

### Step 1: Research Phase

Use `researcher` subagent to research:
- Design style and trends matching product type
- Font pairing recommendations for target audience
- Color psychology aligned with CJX emotions
- Spacing and layout patterns for app type
- Micro-interaction patterns per CJX journey stage

### Step 2: Design Implementation

Use `ui-ux-designer` subagent to:
- Apply research findings to each screen
- Ensure CJX mapping consistency (emotions → visuals)
- Create micro-interactions per journey stage
- Validate accessibility (WCAG AA, contrast ≥4.5:1)
- Generate responsive breakpoints (mobile, tablet, desktop)

---

## Accessibility Requirements

All generated mockups must meet:
- WCAG AA compliance
- Contrast ratio ≥4.5:1 for text
- Focus states for interactive elements
- Responsive breakpoints:
  - Mobile: 320px-767px
  - Tablet: 768px-1023px
  - Desktop: 1024px+

---

## Complete Design Workflow

```
┌─────────────────────────────────────────────────────────────┐
│ /ipa:design [style-preset]                                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ STEP 1: Read UI_SPEC.md                                     │
│   ├── CJX: Personas, Journey Map, Touchpoints              │
│   ├── Design System: Colors, Typography, Spacing           │
│   │   (populated by /ipa:spec from reference)              │
│   └── Screens: Layout, Components, States                  │
│                                                             │
│ STEP 2: Apply Style Preset (if provided)                    │
│   ├── Merge preset patterns with UI_SPEC Design System     │
│   └── Keep color palette from UI_SPEC                      │
│                                                             │
│ STEP 3: CJX → Design Decisions                              │
│   ├── Map screens to journey stages                         │
│   ├── Apply emotion-based styling                           │
│   └── Add appropriate micro-interactions                    │
│                                                             │
│ STEP 4: Generate Prototypes                                 │
│   ├── styles.css (design system + CJX variables)           │
│   ├── components.css (reusable patterns)                   │
│   ├── interactions.js (CJX-driven animations)              │
│   └── s{N}-{screen}.html (per screen)                      │
│                                                             │
│ STEP 5: Validate Quality                                    │
│   ├── CJX body class check (MANDATORY)                      │
│   ├── Real SVG charts (NO placeholders)                     │
│   ├── Accessibility (WCAG AA)                               │
│   └── Responsive breakpoints                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Implementation Workflow

### Read Design System from UI_SPEC.md

```
/ipa:design
         ↓
┌─────────────────────────────────────────┐
│ 1. Read docs/UI_SPEC.md Design System   │
│    - Color palette (from /ipa:spec)     │
│    - Typography (from /ipa:spec)        │
│    - Component patterns                 │
│ 2. Apply tokens to styles.css           │
│ 3. Generate HTML prototypes             │
│ 4. Validate CJX body classes            │
└─────────────────────────────────────────┘
```

### With Style Preset Override

```
/ipa:design minimalist
         ↓
┌─────────────────────────────────────────┐
│ 1. Read docs/UI_SPEC.md                 │
│ 2. Apply minimalist style patterns      │
│ 3. Merge with UI_SPEC color palette     │
│ 4. Generate HTML prototypes             │
└─────────────────────────────────────────┘
```

---

## Style Presets

| Preset | Description | Best For |
|--------|-------------|----------|
| `minimalist` | Clean, whitespace, subtle | SaaS, Productivity |
| `modern` | Sharp, bold, vibrant | Tech, Startup |
| `glassmorphism` | Blur, transparency, depth | Premium, Luxury |
| `claymorphism` | Soft 3D, playful shadows | Consumer, Lifestyle |
| `brutalist` | Raw, bold typography | Creative, Portfolio |
| `corporate` | Professional, trustworthy | Enterprise, B2B |
| `dashboard` | Data-dense, functional | Admin, Analytics |
| `e-commerce` | Product-focused, CTA heavy | Retail, Marketplace |
| `mobile-first` | Touch-friendly, thumb zones | Mobile apps |
| `dark` | Dark theme, accent colors | Dev tools, Gaming |

**Usage:**
```bash
/ipa:design minimalist
/ipa:design glassmorphism
```

---

## Output Structure

```
prototypes/
├── README.md              # Index + CJX mapping
├── styles.css             # Design system + CJX tokens
├── components.css         # Reusable component styles
├── interactions.js        # CJX-driven animations/micro-interactions
├── icons/                 # Icon assets
│   └── {palette}/
├── s1-{screen}.html       # Screen with CJX stage comment
├── s2-{screen}.html
└── ...
```

### Screen File Structure (COPY EXACTLY)

**CRITICAL:** Each HTML file MUST include CJX context and body class:

```html
<!--
  Screen: S-01 Login
  CJX Stage: Onboarding
  User Emotion: Hesitant → Confident
  Design Focus: Trust signals, minimal friction
-->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login</title>
  <link rel="stylesheet" href="styles.css">
  <link rel="stylesheet" href="components.css">
</head>
<body class="cjx-onboarding">
  <!-- CJX: Reassuring header with trust signals -->
  <header>...</header>

  <!-- CJX: Minimal form, progress indicator -->
  <main>...</main>

  <script src="interactions.js"></script>
</body>
</html>
```

**Body Class Mapping:**
| CJX Stage | Body Class |
|-----------|------------|
| Discovery | `cjx-discovery` |
| Onboarding | `cjx-onboarding` |
| Usage | `cjx-usage` |
| Retention | `cjx-retention` |

### interactions.js (CJX-Driven)

```javascript
// CJX Micro-interactions
const cjxInteractions = {
  // Discovery stage: Entrance animations
  discovery: {
    heroEntrance: 'fadeInUp 0.6s ease-out',
    ctaPulse: 'pulse 2s infinite'
  },

  // Onboarding stage: Encouraging feedback
  onboarding: {
    inputFocus: 'borderGlow 0.3s ease',
    progressStep: 'slideRight 0.4s ease',
    successCheck: 'bounceIn 0.5s ease'
  },

  // Usage stage: Smooth efficiency
  usage: {
    tabSwitch: 'fadeSwitch 0.2s ease',
    dataLoad: 'shimmer 1.5s infinite',
    actionComplete: 'successPop 0.3s ease'
  }
};
```

### styles.css (Generated)

```css
/* Design System - Generated from UI_SPEC + Reference */
:root {
  /* Colors (extracted from reference or UI_SPEC) */
  --color-primary: #6366f1;
  --color-primary-hover: #4f46e5;
  --color-secondary: #ec4899;
  --color-background: #ffffff;
  --color-surface: #f8fafc;
  --color-text: #1e293b;
  --color-text-muted: #64748b;
  --color-border: #e2e8f0;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;

  /* Typography */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;

  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;

  /* Effects */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-full: 9999px;
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
  --transition: 150ms ease;
}
```

---

## Quality Gates (Auto-Validated)

Every mockup passes these checks:

| Category | Checks |
|----------|--------|
| **Visual** | Colors from palette, typography scale, spacing rhythm |
| **UX** | Hover states, focus states, transitions 150-300ms |
| **A11Y** | Contrast ≥4.5:1, alt text, keyboard navigable |
| **Responsive** | Mobile (320px+), Tablet (768px+), Desktop (1024px+) |
| **Performance** | Optimized images, minimal CSS, no layout shift |

---

## Usage Examples

```bash
# Generate from UI_SPEC Design System (default)
/ipa:design

# Use style preset override
/ipa:design dashboard
/ipa:design minimalist

# Fix specific screen
/ipa:design S-01 "make header sticky with blur backdrop"
/ipa:design S-03 "fix mobile layout, stack columns"
```

**Note:** For design reference (URL/image), use `/ipa:spec @url` or `/ipa:spec @image` first.
This populates UI_SPEC.md Design System which `/ipa:design` then implements.

---

## Iteration Commands

After initial generation, iterate with specific feedback:

```bash
# Fix specific screen
/ipa:design S-01 "make header sticky with blur backdrop"

# Adjust colors
/ipa:design "use darker primary color, more contrast"

# Fix responsiveness
/ipa:design S-03 "fix mobile layout, stack columns"

# Add component
/ipa:design S-02 "add loading skeleton for table"
```

---

## Integration with IPA Workflow

```
/ipa:spec @ref-url   → docs/UI_SPEC.md (design system extracted from ref)
         ↓
/ipa:design          → prototypes/ (HTML mockups implementing Design System)
         ↓
Review in browser (open .html files)
         ↓
Iterate: /ipa:design S-xx "fix..."
         ↓
/plan → FE tasks reference prototypes/
         ↓
/code → Implementation matches prototypes
```

---

## App-Specific Templates

| App Type | Preset | Key Screens |
|----------|--------|-------------|
| **SaaS Dashboard** | `dashboard` | Login, Dashboard, Settings, Billing |
| **E-commerce** | `e-commerce` | Home, Product, Cart, Checkout |
| **Mobile App** | `mobile-first` | Onboarding, Home, Profile, Settings |
| **Landing Page** | `modern` | Hero, Features, Pricing, CTA |
| **Admin Panel** | `corporate` | Login, Table View, Form, Analytics |
| **Social App** | `minimalist` | Feed, Profile, Messages, Notifications |

---

## Tips for Best Results

### Before Running

1. **Complete UI_SPEC.md** with screens and components
2. **Provide reference in /ipa:spec** - URL or image reduces ambiguity significantly
3. **Specify app type** - Helps select appropriate patterns

### Minimize Iterations

| Common Issue | Prevention |
|--------------|------------|
| Wrong colors | Provide reference URL in /ipa:spec first |
| Layout off | Specify app type (dashboard, e-commerce, etc.) |
| Missing states | UI_SPEC should list all component states |
| Not responsive | Always test mobile view before iterating |

---

## 🚦 GATE 3: Design Validation

Before proceeding to `/ipa:detail`:

- [ ] User testing completed with 5+ users
- [ ] Usability issues logged
- [ ] Critical issues addressed in mockups
- [ ] Design matches MVP scope (no gold plating)

**Next:** `/ipa:detail`

## Validation Report

After generation:

```markdown
## Design Generation Report

### Design System Source
- From: docs/UI_SPEC.md
- Reference analyzed in: /ipa:spec phase

### CJX Mapping
| Screen | CJX Stage | User Emotion | Design Applied |
|--------|-----------|--------------|----------------|
| S-01: Login | Onboarding | Hesitant | Trust signals, minimal form |
| S-02: Dashboard | Usage | Engaged | Quick actions, data viz |
| S-03: Settings | Retention | Satisfied | Easy navigation, help access |

### Screens Generated
| Screen | File | CJX Stage | Body Class | Charts |
|--------|------|-----------|------------|--------|
| S-01: Login | s01-login.html | Onboarding | cjx-onboarding | N/A |
| S-02: Dashboard | s02-dashboard.html | Usage | cjx-usage | Real SVG ✅ |
| S-03: Settings | s03-settings.html | Retention | cjx-retention | N/A |

### Quality Checks
- [x] CJX body classes on ALL screens
- [x] CJX comment headers present
- [x] Real SVG charts (NO placeholders)
- [x] Color palette from UI_SPEC applied
- [x] Typography consistent
- [x] Responsive (3 breakpoints)
- [x] Hover/focus states
- [x] Contrast ratio ≥ 4.5:1
- [x] CJX animations with `data-cjx-entrance`
- [x] Status badges present (where applicable)
- [x] Layout uses `app-layout`, `main-content` classes
- [x] S-12 uses grid cards (NOT sidebar list)

### Files Created
- prototypes/styles.css (with CJX tokens from UI_SPEC)
- prototypes/components.css
- prototypes/interactions.js (CJX animations)
- prototypes/s01-login.html
- prototypes/s02-dashboard.html
- prototypes/s03-settings.html
```

---

**IMPORTANT:**
- Requires `docs/UI_SPEC.md` to exist (with Design System from /ipa:spec)
- Generates HTML mockups only, not production code
- Use /code for actual implementation
