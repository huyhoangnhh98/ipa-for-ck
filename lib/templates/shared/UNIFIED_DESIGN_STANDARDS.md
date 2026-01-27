# Unified Design Standards

Version: 1.0.0
Last Updated: 2026-01-25

This document defines the unified design standards for IPA templates. Both v1.2.1 and v1.3.0 MUST follow these standards to produce consistent HTML mockups.

---

## Class Naming Convention (MANDATORY)

| Purpose | Class Name | CSS |
|---------|------------|-----|
| App wrapper | `app-layout` | `display: flex; min-height: 100vh` |
| Main content | `main-content` | `flex: 1; margin-left: var(--sidebar-width)` |
| Left sidebar | `sidebar` | Add `hide-mobile` for responsive |
| KPI cards grid | `kpi-grid` | `grid-template-columns: repeat(4, 1fr)` |
| Chart container | `chart-card` | Standard card styling |
| Data table | `table-container` | Overflow handling |
| Status indicator | `status-badge` | Variants: success, error, warning |
| Toggle group | `toggle-group` | Pill-style toggle |
| Form grid | `form-row` | `1fr 1fr` grid |
| Modal | `modal`, `modal-lg` | Centered overlay |

**DO NOT USE:** `app-container`, `main-area`, `dashboard-layout`, `optimization-kpis`

---

## Layout Patterns

### Region Explorer Pattern (S-12 Resources)

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

- MUST use grid cards layout
- MUST include emoji flags for regions
- NEVER use sidebar list for regions
- Grid: `repeat(4, 1fr)` desktop, `repeat(2, 1fr)` tablet, `1fr` mobile

### Dashboard Pattern

- 3-column: sidebar (260px) + content (flex) + region-sidebar (280px)
- Charts: trend chart 2fr, breakdown 1fr
- KPIs: 4-column grid

### Form/CRUD Pattern

- Table with actions column
- Modal for create/edit
- Status badges for connection state

---

## Animation Standards (CJX)

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

---

## Component Standards

### Status Badge

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

### Region Card

```css
.region-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-4);
}
.region-card {
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}
.region-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}
.region-flag { font-size: 24px; margin-bottom: var(--spacing-xs); }
```

---

## Responsive Pattern

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

## Validation Checklist

After generating mockups, verify:

- [ ] CJX body classes on ALL screens (14/14)
- [ ] Layout uses `app-layout`, `main-content` classes
- [ ] S-12 uses grid cards (NOT sidebar list)
- [ ] CJX animations with `data-cjx-entrance`
- [ ] Status badges present (where applicable)
- [ ] Real SVG charts (NO placeholders)
- [ ] Responsive breakpoints working
- [ ] `hide-mobile` pattern on sidebar
