# Implementation Plan - Internationalization (i18n) Support

This plan outlines the steps to add multi-language support to the TalkFlow website using `next-intl`. We will support English (default), Chinese, Spanish, and Japanese.

## Phase 1: Setup & Configuration
- [ ] Install `next-intl` dependency
- [ ] Create `src/i18n.ts` for server-side request configuration
- [ ] Create `src/middleware.ts` to handle locale detection and redirection
- [ ] Update `next.config.mjs` to include the i18n plugin
- [ ] Create `src/navigation.ts` for type-safe navigation wrappers

## Phase 2: Content Structure
- [ ] Create `messages/` directory at project root
- [ ] Create `messages/en.json` (English - Source)
- [ ] Create `messages/zh.json` (Chinese)
- [ ] Create `messages/es.json` (Spanish)
- [ ] Create `messages/ja.json` (Japanese)
- [ ] Move initial hardcoded text from `HomePage` to `en.json` as a test case

## Phase 3: Architecture Refactor (The "Big Move")
- [ ] Create `src/app/[locale]` directory
- [ ] Move the following into `src/app/[locale]/`:
    - `page.tsx` (Home)
    - `layout.tsx` (Root Layout -> Locale Layout)
    - `(marketing)` folder
    - `login` folder
- [ ] **Keep** the following in `src/app/` (Root):
    - `api/`
    - `globals.css`
    - `favicon.ico`
    - `robots.ts`
    - `sitemap.ts`
- [ ] Create a simpler root `src/app/layout.tsx` (optional) or let middleware handle the redirect from root `/`. *Decision: We will rely on middleware to redirect `/` to `/en`, so root layout is technically not needed for the page render, but Next.js requires a root layout. Usually, we keep the main logic in `[locale]/layout.tsx`.*

## Phase 4: Code Integration
- [ ] Update `src/app/[locale]/layout.tsx`:
    - Accept `params: { locale }`
    - Configure `NextIntlClientProvider`
    - Validate locale against supported list
- [ ] Update `src/app/[locale]/page.tsx` to use `useTranslations`
- [ ] Verify build and dev server

## Phase 5: Component Updates
- [ ] Update `Navbar` links to use `Link` from `src/navigation.ts` (automatically handles `/en`, `/zh` prefixes)
- [ ] Update `Footer` links
- [ ] (Iterative) Extract strings from other components into JSON files

## Proposed File Structure
```
src/
  app/
    [locale]/
      (marketing)/
      login/
      layout.tsx   <-- The main layout
      page.tsx
    api/
    globals.css
  i18n.ts
  middleware.ts
  navigation.ts
messages/
  en.json
  zh.json
  ...
next.config.mjs
```
