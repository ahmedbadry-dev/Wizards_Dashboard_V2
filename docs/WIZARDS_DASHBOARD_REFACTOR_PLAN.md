# Wizards Dashboard — Mobile-First Refactor Plan for Codex

## Role and objective

Refactor the existing repository instead of rebuilding it:

- Repository: https://github.com/ahmedbadry-dev/Wizards_Dashboard
- Desktop Figma frame: https://www.figma.com/design/69uUOvS7bqCBfr9uPMYIjY/Frontend-wizards-task--Copy-?node-id=11-2
- Wizard details Figma frame: https://www.figma.com/design/69uUOvS7bqCBfr9uPMYIjY/Frontend-wizards-task--Copy-?node-id=9-2932

The result must preserve the Figma desktop appearance at 1280px while becoming a polished mobile-first application for mobile, tablet, laptop, and desktop widths.

Do not rewrite the application from scratch. Preserve the working data-fetching, search, debounce, pagination, and wizard-selection logic unless a small change is necessary to connect the new presentation components.

Keep the solution appropriate for a junior frontend interview: clean React composition, small reusable components, clear names, ordinary hooks, and Tailwind CSS v4. Do not introduce an unnecessarily abstract architecture.

## Non-negotiable constraints

1. Keep the current stack: React, TypeScript, Vite, Tailwind CSS v4, TanStack Query, and Recharts.
2. Do not add a global state manager, CSS-in-JS library, UI component framework, form library, animation library, or table library.
3. Preserve the current Wizard World API integration and the 400ms debounced search behavior.
4. Preserve client-side pagination with `PAGE_SIZE = 4` on every viewport.
5. Use the same paginated `visibleItems` for the desktop table and mobile/tablet cards.
6. Use existing icons and image assets. Do not redraw or replace the Figma icons.
7. Make the source easy to explain in an interview. Prefer component composition and small data arrays over complex design patterns.
8. Soft limit: aim for fewer than 150–180 lines per component. Hard limit: do not create a 300-line component.
9. Do not mix feature logic into generic UI primitives.
10. Run `npm run build` and `npm run lint` after every major phase.

## Baseline audit already completed

The reviewed `main` branch at commit `73b570d` builds and lints successfully.

### Keep largely unchanged

- `src/features/wizard-table/services/wizardApi.ts`
  - Fetches all wizards when search is empty.
  - Searches first and last names when search is present.
  - Handles multi-part names and merges results by ID.
- `src/features/wizard-table/hooks/useDebouncedValue.ts`
- `src/features/wizard-table/hooks/useWizards.ts`
- `src/hooks/usePagination.ts`
- `src/features/wizard-table/types/wizard.ts`

Small naming or typing cleanups are allowed, but do not redesign this logic.

### Problems to fix

- `src/index.css` uses token names whose meaning conflicts with the Figma design. For example, the existing `primary` is gold, while the new semantic `primary` is lavender.
- Typography utilities are mostly desktop-oriented and are inconsistently combined with raw pixel classes.
- `DashboardLayout.tsx` uses one layout for all widths and does not match the exact 64px topbar / 256px sidebar desktop shell.
- `Sidebar.tsx` and `MobileSidebarDrawer.tsx` duplicate navigation data and markup.
- The mobile drawer unmounts immediately, so it cannot have a clean exit transition.
- `Topbar.tsx` contains the undefined class `text-registry-soft`.
- KPI and chart grids jump directly to desktop-style layouts without a deliberate tablet layout.
- `DashboardChartsSkeleton.tsx` is always `grid-cols-3`, which can overflow narrow screens.
- Chart dimensions, margins, bar width, and donut radii are fixed and can clip or look oversized on mobile.
- `WizardsTable.tsx` handles narrow screens by preserving a wide `min-w-215` table and horizontal scrolling.
- Two pagination implementations exist: `src/components/ui/Pagination.tsx` and `src/features/wizard-table/components/Pagination.tsx`.
- The numbered pagination can overflow on a small phone.
- `Modal.tsx` is always a centered desktop dialog.
- `WizardDetailsModal.tsx` has desktop-sized spacing, avatar dimensions, header layout, and nested scrolling on mobile.
- Wizard display-name, ID, and fallback formatting are spread across table and modal components.
- Raw Figma colors still exist inside Recharts props instead of using design tokens.

## Responsive strategy

Use Tailwind's default breakpoints with these responsibilities:

| Range | Layout behavior |
| --- | --- |
| `< 640px` | Single-column mobile layout, one wizard card per row, compact pagination, bottom-sheet modal, drawer navigation. |
| `640–1023px` | Tablet spacing, two-column card grids where useful, bottom-sheet/large-sheet modal, drawer navigation. |
| `1024–1279px` | Wide tablet/small laptop: three KPI cards and split charts when space allows, two-column wizard cards, drawer navigation. |
| `>= 1280px` | Figma desktop shell: fixed 256px sidebar, 64px topbar, desktop table, centered desktop modal. |

Use `xl` rather than `lg` as the point where the permanent sidebar and five-column table appear. At 1024px, a 256px sidebar plus 80px content padding leaves too little space for the table, so that width should still use the drawer and card presentation.

Test these exact viewport widths:

- 320px
- 375px
- 390px
- 640px
- 768px
- 1024px
- 1280px
- 1440px

No viewport may have horizontal page scrolling.

## Design-system tokens

Replace the current ambiguous tokens in `src/index.css` with the following semantic Tailwind v4 theme.

### Colors

| Token | Value | Intended use |
| --- | --- | --- |
| `canvas` | `#051424` | Page background and deepest panels. |
| `surface` | `#0D1C2D` | Navigation and modal background. |
| `surface-raised` | `#1C2B3C` | Secondary panels, rows, and elixir items. |
| `surface-input` | `#273647` | Search and input backgrounds. |
| `border` | `#494454` | Neutral borders and dividers. |
| `heading` | `#D4E4FA` | Headings and important values. |
| `body` | `#CBC3D7` | Normal readable copy. |
| `body-muted` | `#BCC7DE` | Secondary copy where contrast remains sufficient. |
| `primary` | `#D0BCFF` | Lavender CTA, selected page, important wizard values. |
| `primary-ink` | `#3C0091` | Text placed on the lavender primary background. |
| `accent` | `#FFB95F` | Gold highlights and positive trend copy. |
| `accent-strong` | `#EE9800` | Active navigation tint or stronger gold state. |
| `danger` | `#FFB4AB` | Pending/error emphasis. |
| `disabled` | `#6B7280` | Disabled and genuinely low-priority content only. |

Important migration rule: do not perform a blind search/replace because the old `primary` means gold. Migrate one component at a time based on intent.

Suggested old-to-new intent mapping:

| Existing class/token | New semantic meaning |
| --- | --- |
| `bg-bg` | `bg-canvas` |
| `bg-card` | Usually `bg-canvas/80` or the reusable glass-card recipe. |
| `bg-card-light` | `bg-surface-raised` |
| `text-text` | `text-heading` for strong copy or `text-body` for normal copy. |
| `text-secondary-light` | Usually `text-body`. |
| `text-secondary-soft` | `text-primary`. |
| `text-primary` | Usually `text-accent` because the old primary is gold. |
| `text-primary-dark` | `text-accent-strong`. |
| `text-secondary-dark` | `text-primary-ink`. |
| `text-muted` | Choose `text-body/60`, `text-body-muted`, or `text-disabled` based on actual importance. |

### Typography

- Font family: Manrope, weights 400, 500, 600, 700, and 800.
- Page title:
  - mobile: 30px / 36px, weight 700, tracking -0.5px.
  - tablet: 36px / 40px.
  - desktop: 40px / 48px, tracking -1px.
- Page description:
  - mobile: 14px / 24px.
  - tablet: 16px / 24px.
  - desktop: 18px / 28px.
- Section title:
  - mobile: 20px / 28px.
  - desktop: 24px / 32px.
- KPI value:
  - mobile: 28px / 36px.
  - desktop: 32px / 40px.
- KPI eyebrow/label: 14px / 20px, weight 600, uppercase, tracking 1.4px.
- Table/card body copy: 14px / 20px.
- Small metadata: 12px / 16px.

Create a small number of meaningful component recipes such as `.page-title`, `.page-description`, `.section-title`, `.kpi-label`, and `.kpi-value`. Do not create a custom class for every single Tailwind declaration.

### Spacing and shape

- Topbar height: 64px.
- Permanent desktop sidebar width: 256px.
- Main horizontal padding: 16px mobile, 24px tablet, 40px desktop.
- Main vertical start padding: 24px mobile, 40px desktop.
- Main section gap: 32px mobile, 48px desktop.
- Normal component gaps: 8px, 12px, 16px, and 24px.
- Controls: 8px radius.
- Cards: 12px radius.
- Desktop modal: 16px radius.
- Mobile bottom sheet: 24px top-left and top-right radius; square bottom corners.

### Effects

- Cards: 6px backdrop blur and `0 25px 50px -12px rgb(0 0 0 / 25%)`.
- Topbar: 12px backdrop blur and a subtle lavender glow.
- Sidebar: 20px backdrop blur and a very subtle lavender shadow.
- Primary buttons: existing lavender two-layer shadow from the Figma frame.

## Target component structure

Keep the current feature-based layout and make only useful extractions:

```text
src/
  components/
    layout/
      DashboardLayout.tsx
      Topbar.tsx
      Sidebar.tsx
      MobileSidebarDrawer.tsx
      SidebarContent.tsx          # shared navigation markup
    ui/
      Badge.tsx
      Button.tsx
      Card.tsx
      Modal.tsx                   # responsive dialog/bottom sheet shell
      Pagination.tsx              # the only pagination component
      SearchInput.tsx
  features/
    dashboard/components/
      DashboardHeader.tsx
      KpiCard.tsx
      KpiCards.tsx
      charts/...
    wizard-table/
      components/
        WizardsTable.tsx          # feature orchestrator
        WizardDesktopTable.tsx
        WizardTableHeader.tsx
        WizardTableRow.tsx
        WizardCardList.tsx
        WizardCard.tsx
        WizardListState.tsx       # shared loading/error/empty region if useful
        WizardTableToolbar.tsx
        WizardDetailsModal.tsx
        WizardProfileSummary.tsx
        WizardDetailsGrid.tsx
        WizardElixirList.tsx
      hooks/...
      services/...
      types/...
      utils/wizardFormatters.ts
```

This structure is a guide, not a requirement to create empty or one-line files. Only extract a component when it owns a real visual or logical responsibility.

## Phase 1 — Establish a safe baseline

1. Create a new refactor branch.
2. Run:
   - `npm ci`
   - `npm run build`
   - `npm run lint`
3. Capture baseline screenshots at 390px, 768px, 1024px, and 1280px if browser tooling is available.
4. Record current functional behavior:
   - initial fetch;
   - search debounce;
   - first-name search;
   - last-name search;
   - multi-part search;
   - page changes;
   - page reset after search;
   - modal open/close;
   - missing-name fallback.
5. Do not change functionality during this phase.

Exit criteria: the original code still builds and lints, and baseline behavior is understood.

## Phase 2 — Replace the design-token foundation

1. Refactor `src/index.css` to use the semantic tokens listed above.
2. Keep `@import "tailwindcss"` and the existing Manrope font loading unless there is a project-specific reason to change it.
3. Add the spacing, radii, blur, and shadow tokens.
4. Add only the shared typography/component recipes that are repeated across several files.
5. Update `:root`, `body`, focus states, box sizing, and the themed scrollbar.
6. Add a visible, consistent `focus-visible` ring based on `primary`.
7. Migrate generic UI primitives first:
   - `Card.tsx`
   - `Button.tsx`
   - `Badge.tsx`
   - `SearchInput.tsx`
   - `Modal.tsx`
   - `Pagination.tsx`
8. Then migrate feature components one group at a time.
9. Use `rg` to find and remove stale token names only after the migration is complete.

Exit criteria:

- No ambiguous old theme tokens remain in JSX.
- No undefined design classes such as `text-registry-soft` remain.
- Raw hex values are removed from JSX wherever a CSS variable can be used.
- Build and lint pass.

## Phase 3 — Refactor the application shell and navigation

1. Make the app shell mobile-first.
2. Keep the 64px topbar on every width.
3. Use a drawer below `xl` and the 256px permanent sidebar at `xl` and above.
4. Extract duplicated navigation/logo/footer markup into `SidebarContent.tsx` and reuse it in both sidebar shells.
5. Store icon component references in the navigation array, then render them; do not store duplicated pre-rendered JSX with styling differences.
6. Use strict equality (`===`) for active navigation checks.
7. The mobile drawer should:
   - open from the left;
   - be `min(320px, 85vw)` or equivalent;
   - begin below or correctly account for the 64px topbar;
   - show a backdrop;
   - close on backdrop click, close button, navigation selection, and Escape;
   - prevent body scrolling while open;
   - preserve a CSS transition for both entry and exit rather than immediately unmounting.
8. The permanent desktop sidebar should match the Figma width, background, border, spacing, and active item.
9. Make main content fluid below `xl`. At `xl`, account for the 256px sidebar and preserve the Figma 40px content padding.
10. Remove outer `max-w-7xl m-auto` behavior if it prevents the 1280px frame from matching Figma. If content is constrained on very wide screens, constrain an inner content wrapper without moving the sidebar.

Exit criteria:

- No navigation markup is duplicated.
- The drawer works with mouse and keyboard.
- The page never horizontally scrolls.
- At 1280px, topbar/sidebar/content geometry matches Figma.

## Phase 4 — Responsive page header, KPI cards, and charts

### Header

1. Replace raw responsive typography in `DashboardHeader.tsx` with the new semantic recipes.
2. Use the specified mobile/tablet/desktop title and description sizes.

### KPI cards

1. Extract a small `KpiCard` component with props for label, value, status text, icon, and tone.
2. Render `KpiCards` from a simple local data array.
3. Grid behavior:
   - one column on mobile;
   - two columns on tablet;
   - allow the third card to span the tablet row if that produces a more balanced layout;
   - three equal columns at `lg`/`xl` where room allows.
4. Use responsive card padding: 16px mobile, 24px desktop.
5. Preserve Figma colors for lavender value, gold value/trend, and danger value.

### Charts

1. Make `DashboardCharts.tsx` one column on mobile and a 2:1 arrangement on wide screens.
2. Make `DashboardChartsSkeleton.tsx` use the exact same responsive grid as the real charts.
3. Reduce card padding and chart height on mobile while preserving the 398px desktop target.
4. In `RegistryActivityChart.tsx`:
   - reduce fixed left/right chart margins on mobile;
   - reduce `barSize` on mobile or let Recharts calculate a safe width;
   - keep labels readable without horizontal overflow;
   - use CSS variables for strokes/fills.
5. In `SpecialtyDonutChart.tsx`:
   - use percentage-based `innerRadius` and `outerRadius` or responsive numeric values;
   - keep the total label centered;
   - prevent legend labels from forcing overflow.
6. Do not add a window-resize hook merely to style the charts unless Recharts genuinely requires it. Prefer fluid containers and percentage dimensions.

Exit criteria:

- KPI and charts look intentional at every test width.
- Real and skeleton layouts do not jump between different grid structures.
- No chart is clipped at 320px.

## Phase 5 — Replace the mobile table with wizard cards

Keep the table for the Figma desktop width, but do not use horizontal table scrolling as the primary mobile solution.

### Component responsibilities

- `WizardsTable.tsx`:
  - owns search state;
  - calls `useWizards`;
  - calls `usePagination` once;
  - owns selected wizard state;
  - passes the same `visibleItems` to both representations.
- `WizardDesktopTable.tsx`:
  - visible at `xl` and above;
  - renders the semantic table, header, rows, and desktop skeleton.
- `WizardCardList.tsx`:
  - visible below `xl`;
  - renders one column on mobile and two columns when space allows.
- `WizardCard.tsx`:
  - renders one wizard with a clear name, short ID, elixir summary, and an accessible view-details button.

### Recommended mobile card design

Each card should contain:

1. Header row:
   - full display name with fallback;
   - eye/details icon button with at least a 44px touch target.
2. Small registry ID below the name, truncated visually but available via `title` or accessible text.
3. Divider.
4. Two compact label/value rows:
   - First name.
   - Last name.
5. Elixir area:
   - show up to two badges;
   - show `+N more` if needed;
   - if no elixirs, show `None registered`.
6. Entire card should not be clickable if it also contains a nested action button. Keep the explicit View Details button to avoid ambiguous interaction.

### Loading, error, and empty states

1. Create card skeletons below `xl` and table-row skeletons at `xl`.
2. Reuse the same error and empty-state copy in both layouts.
3. During background refetch, keep current results visible and show a small `Updating…` status rather than replacing content with skeletons.

### Pagination decision

Keep pagination on mobile with four cards per page.

Reasons:

- It preserves the current proven `usePagination` logic.
- Search and page-reset behavior remain consistent across devices.
- It avoids a long list and does not introduce infinite-scroll complexity.
- It is easy to explain during a junior interview.

Responsive pagination UI:

- Mobile: `Previous`, `Page X of Y`, and `Next`. Hide individual numbered page buttons.
- Tablet: show a small range of page numbers if they fit.
- Desktop: preserve the first/last page and ellipsis behavior.
- Keep disabled controls visible but clearly disabled.
- Add accessible labels such as `Go to previous page` and `Go to page 3`.
- The record summary may move above the buttons on mobile instead of being hidden.

Remove the duplicate feature pagination component after the shared UI pagination supports the required behavior.

Exit criteria:

- Mobile/tablet use cards with no horizontal table scroll.
- Desktop uses the Figma table.
- Pagination, search, selection, empty, error, loading, and refetch behavior are identical across representations.

## Phase 6 — Convert wizard details into a responsive bottom sheet

Enhance the existing generic `Modal.tsx`; do not build an unrelated second modal system.

### Mobile and tablet behavior

1. Backdrop fills the viewport.
2. Panel is attached to the bottom edge.
3. Width is 100%.
4. Maximum height is `70dvh` on phones. A slightly larger limit may be used on tablets if visually necessary.
5. Only top-left and top-right corners are rounded to 24px.
6. Add a small decorative sheet handle.
7. Header and footer remain visible; only the body scrolls.
8. Footer includes `padding-bottom: max(16px, env(safe-area-inset-bottom))`.
9. The panel should animate with a simple transform/opacity transition. Do not implement drag-to-dismiss.

### Desktop behavior

At `xl` and above:

- center the modal;
- use the Figma maximum width of 896px;
- use a maximum height around 90dvh;
- restore 16px rounding on all corners;
- use the exact desktop spacing from the Figma frame.

### Content restructuring

1. Mobile header:
   - stack or safely wrap member label, wizard name, and registry ID;
   - avoid the current competing left/right blocks at 320px.
2. Profile:
   - use a smaller mobile crest/avatar around 112–128px;
   - use the larger Figma size on desktop.
3. Details:
   - one column on mobile;
   - two columns from a safe tablet width;
   - labels smaller/muted, values readable and allowed to wrap.
4. Elixirs:
   - full-width stacked items;
   - 44px minimum touch target for any action;
   - truncate long names visually while preserving the full value in accessible text/title.
5. Footer:
   - full-width or clearly sized primary action on very narrow phones;
   - normal right-aligned actions on larger screens.

### Dialog behavior and accessibility

1. Preserve the portal.
2. Preserve Escape-to-close.
3. Close on backdrop click, but not when interacting inside the panel.
4. Lock body scroll while open and restore it on close.
5. Restore focus to the trigger after closing.
6. Move initial focus to the close button or another safe control.
7. Keep `role="dialog"`, `aria-modal="true"`, and `aria-labelledby`.
8. Give the wizard profile image a useful alt based on the wizard display name, unless it is intentionally decorative.

Keep focus handling understandable. Do not hand-build a large focus-trap framework for this interview task.

Exit criteria:

- The modal is a 70dvh bottom sheet on phones and the Figma dialog on desktop.
- Content remains usable at 320px and with long names/elixir names.
- There is no nested whole-modal scroll container fighting the body scroll area.

## Phase 7 — Small, targeted clean-code refactor

1. Add `wizardFormatters.ts` for repeated pure formatting only:
   - `getWizardNameParts(wizard)`;
   - `getWizardDisplayName(wizard)`;
   - `formatWizardId(id)`;
   - `createRegistryId(wizard)` if still needed.
2. Reuse these functions in desktop row, mobile card, and details modal.
3. Keep `WizardsTable.tsx` as an orchestration component rather than a presentation dump.
4. Remove the duplicate pagination implementation.
5. Remove dead imports, dead classes, commented-out arrays, and accidental spacing.
6. Normalize formatting and use strict equality.
7. Do not create generic abstractions used only once unless they make a large component materially easier to read.
8. Do not move static chart data into a global store or remote service.
9. Keep props explicit and local. Avoid premature context providers.

Exit criteria:

- Each file has one clear responsibility.
- No major markup is duplicated.
- Components are easy to explain without advanced architectural vocabulary.

## Phase 8 — Verification and final polish

### Automated checks

Run:

```bash
npm run build
npm run lint
```

Do not add a large testing stack solely for this refactor. If the project already gains test tooling separately, prioritize tests for `usePagination`, wizard formatters, and search behavior.

### Functional regression checklist

- Initial wizard fetch succeeds.
- Empty search still returns all wizards.
- Search remains debounced by 400ms.
- First-name and last-name searches work.
- Multi-word searches work.
- Search changes reset pagination to page 1.
- Page count and safe current page remain correct when result count shrinks.
- Mobile cards and desktop rows open the same wizard details.
- Closing the modal clears selection and restores focus.
- Null first or last names use the existing safe fallback behavior.
- Zero, one, two, and many elixirs render safely.
- Loading, refetching, error, and empty states work in both card and table presentations.

### Responsive visual checklist

At every target width:

- no horizontal page overflow;
- no clipped heading, chart, card, tooltip, pagination, or modal content;
- no text smaller than the defined mobile metadata size;
- 44px minimum touch targets for primary mobile interactions;
- consistent 16/24/40px page padding by breakpoint;
- consistent vertical rhythm;
- drawer does not cover content after closing;
- body does not scroll behind an open drawer or modal;
- long names and IDs do not break the layout.

At 1280px specifically compare against both Figma frames:

- topbar height and styling;
- sidebar width and vertical position;
- 40px main padding;
- 48px section spacing;
- three KPI card widths and 24px gaps;
- 2:1 chart arrangement and heights;
- table typography, row height, borders, and pagination;
- modal width, radii, grid proportions, spacing, and colors.

### Final cleanup

1. Search for old token names and unexplained arbitrary colors.
2. Search for duplicated sidebar/table/modal markup.
3. Confirm every icon button has an accessible name.
4. Confirm no warnings appear in the browser console.
5. Update `README.md` with:
   - mobile-first behavior;
   - card/table switch;
   - responsive bottom sheet;
   - viewport testing notes;
   - unchanged API/search behavior.

## Required final report from Codex

When implementation is complete, report:

1. The files changed, grouped by design system, layout, dashboard, wizard registry, and modal.
2. Which existing logic was preserved unchanged.
3. The chosen breakpoints and why the permanent sidebar/table begin at `xl`.
4. How mobile pagination works.
5. How focus, Escape, backdrop click, and body-scroll locking work in the drawer and modal.
6. Results of `npm run build` and `npm run lint`.
7. Any remaining visual difference from Figma and the reason.

## Definition of done

The refactor is complete only when:

- desktop at 1280px is visually faithful to Figma;
- mobile and tablet layouts are intentional rather than compressed desktop layouts;
- the desktop table becomes paginated cards below `xl`;
- wizard details become a 70dvh mobile bottom sheet;
- navigation becomes a reusable, accessible drawer below `xl`;
- the semantic design tokens are used consistently;
- working API/search/pagination logic is preserved;
- build and lint pass;
- no file becomes an oversized all-in-one component;
- the implementation remains straightforward enough for a junior developer to explain line by line.
