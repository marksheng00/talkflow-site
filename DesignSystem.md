# Talkflo Design System (Pragmatic)

This document captures the current design language and the enforceable rules used across the site. It is intended to keep the UI consistent, predictable, and easy to evolve.

## Core Principles
- **Semantic consistency:** Same purpose = same visual treatment.
- **Hierarchy clarity:** Bigger/stronger elements have larger radius, stronger contrast, and larger type.
- **Tokenized decisions:** Use a small set of approved tokens (radius, spacing, typography, colors).
- **Motion discipline:** Subtle, purposeful transitions only.

## Radius System (Enforced)
We only use **four** radius sizes:
- **Pill / Circle:** `rounded-full`  
  Use only for avatars, dots, circular icons, glowing blobs.
- **Small:** `rounded-lg`  
  Use for badges, chips, tiny tags (height ≤ 24px).
- **Default:** `rounded-2xl`  
  Use for buttons, inputs, tabs, list items, toolbars, modals.
- **Large:** `rounded-3xl`  
  Use for large cards, hero blocks, CTA containers.

No other `rounded-*` values are allowed.

## Button System
Primary styles are centralized in `buttonStyles`:
- File: `src/components/ui/Button.tsx`
- Default size: `md` (`h-12`)
- Default radius: `rounded-2xl`

Variants:
- `primary`: white background, black text, glow shadow
- `secondary`: subtle translucent, white text
- `ghost`: minimal, text emphasis
- `outline`: border only
- `gradient`: emerald → cyan, black text
- `danger` / `warning` / `info` / `accent`: semantic actions

Rules:
- Use `buttonStyles` for all buttons unless there is a strong reason not to.
- Button text color should never be overridden to white on a white/bright background.

## Cards & Containers
Cards use `cardStyles`:
- File: `src/components/ui/Card.tsx`
- Default radius: `rounded-3xl`
- Default variant: `subtle`

Rules:
- Large sections/CTAs use `rounded-3xl`.
- Small meta cards or widgets can use `rounded-2xl`.

## Inputs & Forms
Inputs use `Field`, `Input`, `Textarea`:
- File: `src/components/ui/Field.tsx`
- Default radius: `rounded-2xl`
- Variants: `glass`, `transparent`, `admin`

Rules:
- All text inputs should use the shared components.
- Admin inputs use `variant="admin"` to preserve darker appearance.

## Tabs / Toggles
Tabs use `Tabs`:
- File: `src/components/ui/Tabs.tsx`
- Buttons are always `rounded-2xl`.

## Badges & Tags
Use `Badge` or `badgeStyles`:
- File: `src/components/ui/Badge.tsx`
- Small labels (<= 24px height) use `rounded-lg` and `size="xs"`/`"sm"`

## Typography Hierarchy (Marketing)
Use typography tokens from `globals.css`:
- `typo-hero`, `typo-h1`, `typo-h2`, `typo-h3`, `typo-h4`
- `typo-title`, `typo-title-sm`
- `typo-subtitle-lg`
- `typo-body`, `typo-body-strong`, `typo-body-lg`, `typo-body-lg-strong`, `typo-body-sm`, `typo-body-sm-strong`, `typo-footnote`
- `typo-label`, `typo-caption`, `typo-caption-xs`
- `typo-badge-xs`, `typo-badge-sm`, `typo-badge-md`, `typo-badge-lg`
- `typo-tab`, `typo-mono`, `typo-stat`, `typo-stat-lg`
- `typo-symbol`, `typo-symbol-lg`, `typo-flag`, `typo-flag-button`, `typo-flag-responsive`
- `typo-button-sm`, `typo-button-sm-medium`, `typo-button-md`, `typo-button-md-medium`, `typo-button-lg`, `typo-button-lg-medium`, `typo-button-xl`, `typo-button-xl-medium`

Rules:
- Typography must use `typo-*` tokens (no raw `text-*` size or `font-*` weight classes on components).
- H1/H2 use `font-heading` via tokens.
- Long body copy uses `text-neutral-400` or `text-slate-300`.

## Semantic Structure (SEO)
Rules:
- **One H1 per page.** Use it only for the primary page title.
- **H2 for major sections**, **H3 for sub-sections**.
- **UI labels / captions are not headings** (use `<p>`/`<span>` with `typo-label` or `typo-caption`).
- **Card titles in lists use H3** (avoid multiple H2s in repeated lists).
- **Modals use H2/H3**; never H1.

## Spacing System (Marketing)
Consistent layout classes in `globals.css`:
- `section-block`, `section-shell`, `section-stack`, `section-heading`
- Prefer `gap-grid`, `gap-grid-lg`, `stack-base`, `stack-loose`

Rules:
- Use section utilities instead of custom spacing whenever possible.

## Motion & Interaction
- Hover: subtle scale (≤ 1.02) and brightness or shadow change.
- Active: slight scale down (e.g., `active:scale-95`).
- No aggressive animations unless tied to hero sections.

## Exceptions
Exceptions must be intentional and documented in code comments or PR notes.  
If a component needs an unconventional radius or style, update this doc before merging.
