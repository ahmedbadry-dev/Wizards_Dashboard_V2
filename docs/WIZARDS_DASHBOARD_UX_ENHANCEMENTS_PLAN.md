# Wizards Dashboard — UX Enhancements Plan for Codex

## Purpose

Add the following six improvements to the existing mobile-first refactor without rebuilding the project or changing its API contract:

1. Real filter and sort.
2. Clear search.
3. Retry error state.
4. Result count.
5. Accessibility polish.
6. Simple drawer and bottom-sheet animations.

Repository: `https://github.com/ahmedbadry-dev/Wizards_Dashboard_V2`

Read `docs/WIZARDS_DASHBOARD_REFACTOR_PLAN.md` and `docs/wizarding-design-system.css` before editing. This enhancement plan extends the main refactor plan; it does not replace it.

## Scope rules

- Keep React, TypeScript, Vite, Tailwind CSS v4, TanStack Query, and Recharts.
- Preserve the current Wizard World API request and 400ms debounced server search.
- Preserve `PAGE_SIZE = 4` on mobile, tablet, and desktop.
- Do not add Redux, Zustand, a table library, a UI framework, or an animation library.
- Use CSS transitions and one small reusable presence hook for exit animations.
- Keep components and hooks easy to explain at a junior interview.
- Do not mutate API arrays while sorting.
- Do not add fake API fields or pretend that edit/filter operations are persisted to a server.
- Run `npm run build` and `npm run lint` after each phase.

## Final data pipeline

There must be one clear pipeline inside the wizard-registry feature:

```text
useWizards(searchValue)
        ↓
API/search results
        ↓
filterAndSortWizards(wizards, filters)
        ↓
processedWizards
        ↓
usePagination(processedWizards, PAGE_SIZE)
        ↓
visibleItems
        ↓
Desktop table or responsive wizard cards
```

Search remains server-driven through `useWizards`. Elixir filtering and sorting are client-side transformations of the returned search results.

The table and cards must receive the same `visibleItems`. Never create separate pagination state for the two layouts.

## Suggested files

Use the existing structure and add only files with a clear responsibility:

```text
src/
  components/
    ui/
      SearchInput.tsx
      Pagination.tsx
      Modal.tsx
  features/
    wizard-table/
      components/
        WizardsTable.tsx
        WizardTableToolbar.tsx
        WizardFilterPanel.tsx
        WizardListState.tsx
      hooks/
        useWizards.ts
      types/
        wizardFilters.ts
      utils/
        filterAndSortWizards.ts
  hooks/
    usePresence.ts
```

Do not create a file merely to hold one line. If the main refactor plan has already introduced equivalent files, extend those files instead of creating duplicates.

## Phase 1 — Define filter and sort behavior

### Types

Create simple string-union types:

```ts
export type ElixirFilter = "all" | "with-elixirs" | "without-elixirs";

export type WizardSort =
  | "default"
  | "name-asc"
  | "name-desc"
  | "elixirs-desc"
  | "elixirs-asc";

export type WizardFilters = {
  elixirFilter: ElixirFilter;
  sort: WizardSort;
};
```

Export a default value:

```ts
export const DEFAULT_WIZARD_FILTERS: WizardFilters = {
  elixirFilter: "all",
  sort: "default",
};
```

The `default` sort option is important because it preserves the API order until the user explicitly chooses a sort.

### Pure transformation utility

Create `filterAndSortWizards(wizards, filters)` as a pure function.

Rules:

- `all`: keep every returned wizard.
- `with-elixirs`: keep wizards with at least one elixir.
- `without-elixirs`: keep wizards with no elixirs.
- `default`: preserve incoming order.
- `name-asc` and `name-desc`: compare normalized display names with `localeCompare`.
- `elixirs-desc` and `elixirs-asc`: compare `wizard.elixirs?.length ?? 0`.
- Always copy before sorting: use `[...filteredWizards].sort(...)`.
- Reuse the shared wizard display-name formatter created by the main refactor.
- Use stable, predictable fallbacks for null names.

### State ownership

Keep filter state in `WizardsTable.tsx`:

```ts
const [filters, setFilters] = useState(DEFAULT_WIZARD_FILTERS);

const processedWizards = useMemo(
  () => filterAndSortWizards(wizards, filters),
  [wizards, filters],
);

const pagination = usePagination(processedWizards, PAGE_SIZE);
```

Do not place filters in global state. A custom `useWizardFilters` hook is unnecessary unless the component becomes difficult to read.

Whenever the user changes a filter or sort option, reset pagination to page 1 in the same handler:

```ts
const handleFiltersChange = (nextFilters: WizardFilters) => {
  setFilters(nextFilters);
  setCurrentPage(1);
};
```

### Acceptance criteria

- Filter and sort combinations work together.
- Sorting does not mutate the array cached by TanStack Query.
- Changing a filter or sort resets to page 1.
- Search, filters, sort, and pagination work as one pipeline.
- Table and card presentation always show the same four records.

## Phase 2 — Build the real filter and sort UI

### Filter trigger

Update the current Filter button in `WizardTableToolbar.tsx`:

- `type="button"`.
- Minimum 44px mobile touch target.
- `aria-expanded={isFilterOpen}`.
- `aria-controls="wizard-filter-panel"`.
- Clear accessible name such as `Filter and sort wizards`.
- Show an active-count badge when the selection differs from defaults.

Calculate active count as:

- `+1` when `elixirFilter !== "all"`.
- `+1` when `sort !== "default"`.

### Filter panel content

Create one reusable `WizardFilterPanel` containing two semantic fieldsets.

Fieldset 1 — Elixir filter:

- All Wizards.
- With Elixirs.
- Without Elixirs.

Fieldset 2 — Sort by:

- Default Order.
- Name A–Z.
- Name Z–A.
- Most Elixirs.
- Least Elixirs.

Use native radio inputs. Visually style them to match the design system, but do not replace them with inaccessible clickable `<div>` elements.

Include:

- `Reset` button that restores `DEFAULT_WIZARD_FILTERS`.
- `Done` button on the mobile sheet.
- Close icon button with an accessible label if required by the chosen layout.

Filtering and sorting may update immediately when a radio option changes. The mobile `Done` button only closes the panel; it does not need separate draft state.

### Responsive presentation

- Mobile: panel appears as a small bottom sheet with a backdrop and rounded top corners.
- Tablet/desktop: panel appears as a popover anchored to the Filter button.
- Reuse the same `WizardFilterPanel` content in both presentations if two shells are needed.
- Clicking outside closes it.
- Escape closes it.
- Opening moves focus to the first useful control.
- Closing restores focus to the Filter trigger.
- Do not use the wizard-details 70dvh sheet height for this small panel; size it to content with a safe `max-height` and internal scroll only when required.

### Acceptance criteria

- The Filter button is no longer decorative.
- Every option is usable with keyboard, mouse, and touch.
- Active-filter count is correct.
- Reset returns results and sort order to defaults.
- Panel fits at 320px without horizontal overflow.

## Phase 3 — Add clear search and result count

### Clear search

Enhance `SearchInput.tsx` without creating a wizard-specific generic component.

Required behavior:

- Show a clear icon button only when the controlled value is non-empty.
- Accessible label: `Clear wizard search` when used by this feature.
- Clicking Clear:
  - sets search to an empty string;
  - resets pagination to page 1;
  - returns focus to the search input.
- Keep the search icon and clear icon from overlapping the input text.
- Maintain a 44px touch target on mobile.
- Do not send an extra direct API request from the clear button; let the existing controlled value and query hook handle it.

Use either an internal input ref or a forwarded ref. Choose the simplest implementation that fits the existing component.

### Result count

Add a result summary near the toolbar or pagination.

Display rules:

- No active filter: `24 wizards found`.
- Active filter: `12 of 24 wizards match the filters`.
- Paginated summary: `Showing 1–4 of 12`.
- While background refetching: append or separately show `Updating…` without replacing current results.

Counts mean:

- Base count: `wizards.length`, which is the current API/search result count.
- Processed count: `processedWizards.length`, after local filter/sort.
- Page range: derived from `pageStartIndex` and `pageEndIndex`.

Accessibility:

- Put changing result information in one restrained `aria-live="polite"` status.
- Avoid multiple live regions announcing the same count.
- Set `aria-busy={isFetching}` on the registry results container.

### Acceptance criteria

- Clear Search works before and after debounce completes.
- Focus returns to the search field after clearing.
- Counts are correct for search only, filters only, and combined search/filter states.
- Count does not say `1–0` for empty data.
- Background fetching keeps existing results visible.

## Phase 4 — Add a useful retry error state

### Query hook

Expose TanStack Query's `refetch` from `useWizards`:

```ts
const {
  data: wizards = [],
  error,
  isError,
  isFetching,
  isLoading,
  refetch,
} = useQuery(...);
```

Return `refetch` with the other hook values. Do not move the query implementation into the component.

### Error presentation

Create or extend `WizardListState` to render a consistent responsive state for both cards and table.

The error state should contain:

- Short heading: `Unable to load wizard records`.
- Helpful description without exposing technical stack traces.
- `Try Again` button.
- Optional compact error icon from the existing icon set.

Retry behavior:

```ts
const handleRetry = () => {
  void refetch();
};
```

- Disable the button while a retry is in progress.
- Change its label to `Retrying…` while fetching from an error state.
- Keep keyboard focus visible.
- Do not reload the whole browser page.

Differentiate empty states:

- API/search returned nothing: `No wizard records found.`
- Local filters removed all results: `No wizards match the selected filters.` with a `Clear filters` action.

### Acceptance criteria

- Retry calls the existing query again.
- The button cannot fire repeated overlapping retries.
- Error, empty-search, and empty-filter states have correct copy and actions.
- State presentation works in mobile cards and desktop table layouts.

## Phase 5 — Accessibility polish

Apply these improvements across the feature and application shell.

### Page structure

- Add a `Skip to main content` link that becomes visible on focus.
- Give the main content `id="main-content"` and use the semantic `<main>` element.
- Keep one `<h1>` for the dashboard page.
- Preserve logical heading order inside cards and modal content.

### Buttons and controls

- Every icon-only button must have an `aria-label`.
- Explicitly set `type="button"` unless a button submits a form.
- Use at least 44×44px touch targets for mobile navigation, clear, filter, view, close, previous, and next controls.
- Add a consistent `focus-visible` ring using the lavender primary token.
- Do not communicate selected/disabled/error state using color alone.

### Search, filters, results, and pagination

- Give the search field a visible or screen-reader label.
- Use `<fieldset>` and `<legend>` for filter and sort radio groups.
- Use `aria-current="page"` for the active numbered page.
- Add page-specific accessible labels to numbered pagination buttons.
- Use `aria-disabled` only when native `disabled` is unavailable; prefer native disabled buttons.
- Ensure hidden desktop/mobile representations are truly removed from the accessibility tree using responsive `display: none`, not opacity.
- Make the `+N more` elixir tooltip available on focus as well as hover.

### Drawer, filter sheet, and details modal

- Escape closes the current overlay.
- Backdrop click closes it; interaction inside does not.
- Lock document body scrolling while an overlay is open.
- Move initial focus to a safe control.
- Restore focus to the original trigger after close.
- Preserve `role="dialog"`, `aria-modal`, and `aria-labelledby` where appropriate.
- Avoid opening two overlays simultaneously.

### Images and live states

- Use meaningful alt text for the wizard profile image, or empty alt only if it is genuinely decorative.
- Mark skeleton decoration as `aria-hidden="true"`.
- Use one polite live region for result/refetch status.
- Error text should be associated with the results region.

### Acceptance criteria

- The main flow is usable using only Tab, Shift+Tab, Enter, Space, and Escape.
- Focus never disappears behind an overlay.
- Focus returns to the opening control after close.
- Screen readers receive useful labels without duplicate announcements.
- Color contrast remains readable against the dark design tokens.

## Phase 6 — Add simple drawer and bottom-sheet animations

Use CSS transitions only. Do not add Framer Motion or another animation package.

### Presence hook

The current code conditionally returns `null` immediately when an overlay closes, which prevents exit transitions. Create a small `usePresence` hook:

- When `isOpen` becomes true, render immediately.
- When `isOpen` becomes false, keep rendering for the exit duration.
- After the timeout, unmount.
- Clear pending timeouts during cleanup.
- Default duration: approximately 250ms.
- Return only the minimum values the components need, such as `shouldRender`.

Keep this hook around 20–30 lines and document why it exists. Do not turn it into a general animation framework.

### Drawer animation

- Closed panel: `translateX(-100%)`.
- Open panel: `translateX(0)`.
- Backdrop: opacity 0 → 1.
- Duration: 200–250ms.
- Easing: simple ease-out when opening and ease-in when closing.
- Keep the drawer mounted through the exit transition using `usePresence`.
- Do not animate width, height, or layout properties.

### Wizard details bottom sheet

Mobile/tablet:

- Closed: `translateY(100%)` with a small opacity change.
- Open: `translateY(0)` and full opacity.
- Backdrop: opacity 0 → 1.
- Duration: approximately 250ms.

Desktop:

- Use a subtle opacity and scale transition such as 98% → 100%.
- Do not slide the desktop modal from the bottom.

### Filter sheet/popover

- Mobile filter sheet may reuse the bottom-sheet transition.
- Desktop filter popover should use a subtle opacity/translate transition.
- Avoid bouncy or decorative motion.

### Reduced motion

Respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  /* remove or nearly eliminate non-essential transition durations */
}
```

Tailwind `motion-reduce:transition-none` utilities are also acceptable.

The presence timeout must still allow clean unmounting when reduced motion is enabled. Do not leave invisible overlays mounted and focusable.

### Acceptance criteria

- Entry and exit animations both play.
- No overlay flashes at the wrong position on first render.
- No invisible backdrop blocks the page after close.
- Rapid open/close actions do not leave stale timers or stuck overlays.
- Reduced-motion users receive immediate or nearly immediate state changes.

## Phase 7 — Integration cleanup

1. Keep `WizardsTable.tsx` as the feature orchestrator, not a large presentation component.
2. Ensure toolbar, result state, pagination, table, and cards receive explicit props.
3. Avoid deriving the filtered list in multiple components.
4. Remove dead Filter button markup and any duplicate result count.
5. Remove stale classes and unused imports.
6. Do not duplicate bottom-sheet content; reuse content with a responsive shell.
7. Keep filter labels/options in a small typed constant array if it improves readability.
8. Update `README.md` to mention working filter/sort, clear search, retry, accessibility, and reduced-motion support.

Suggested commit sequence:

```text
feat(wizard-registry): add client-side filter and sort
feat(wizard-registry): add clear search and result summary
feat(wizard-registry): add retryable error and filtered empty states
fix(a11y): improve dashboard keyboard and screen-reader support
style(motion): animate drawer and responsive sheets
docs: document registry UX enhancements
```

Commit messages are suggestions; keep each commit focused and buildable.

## Verification matrix

### Functional cases

Test each case:

1. Empty search + default filters.
2. Search by first name.
3. Search by last name.
4. Multi-word search.
5. Search followed by Clear Search.
6. With Elixirs filter.
7. Without Elixirs filter.
8. Every sort option.
9. Combined search + filter + sort.
10. Filter producing zero records.
11. Search producing zero records.
12. More than one page of results.
13. Filter change while on a later page.
14. Failed request followed by successful retry.
15. Fast repeated drawer/modal/filter open and close.

### Responsive cases

Test at:

- 320px.
- 375px.
- 390px.
- 640px.
- 768px.
- 1024px.
- 1280px.
- 1440px.

Verify:

- no horizontal page overflow;
- filter sheet/popover remains inside the viewport;
- search text and clear button do not overlap;
- result count wraps cleanly;
- mobile pagination fits at 320px;
- drawer and sheet exit animations finish cleanly;
- keyboard focus is visible;
- the desktop table still matches Figma.

### Commands

Run at the end:

```bash
npm run build
npm run lint
```

Do not consider the work complete if either command fails or if the browser console contains React warnings.

## Definition of done

This enhancement is complete when:

- Filter and Sort change real displayed results.
- Clear Search resets the query, page, and input focus.
- Retry uses TanStack Query `refetch` without a page reload.
- Counts accurately describe base, filtered, and paginated results.
- Mobile cards and desktop table share one processed and paginated list.
- Drawer, filter sheet, and wizard details sheet animate in and out.
- Reduced-motion preference is respected.
- Core keyboard and screen-reader behavior works.
- Existing API/search logic remains intact.
- Build and lint pass.
- The implementation remains straightforward enough for the developer to explain line by line in a junior frontend interview.

## Instruction to Codex

Before editing, inspect the current repository because the main mobile-first plan may already have changed some file names or responsibilities. Reuse equivalent components instead of creating duplicates.

Implement this plan phase by phase. At the start of each phase, state the files you will change. At the end of each phase, run build and lint, summarize what changed, and do not continue if there is an unresolved failure.

