# Wizarding Registry Dashboard

A small React dashboard for showing wizard registry data.

The project was built from the provided design and uses the Wizard World API for the table data.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Recharts
- TanStack Query

## Features

- Mobile-first dashboard layout with a 64px topbar
- Drawer navigation below `xl` and a 256px permanent sidebar at `xl`
- KPI cards using static data from the design
- Registry activity chart
- Wizards by specialty chart
- Wizards table using real API data at desktop widths
- Paginated wizard cards below `xl`
- Search by wizard name
- 400ms debounce before sending search request
- Client side pagination with 4 records per page on every viewport
- Loading, error, and empty states
- Responsive wizard details modal that becomes a 70dvh bottom sheet on phones
- Handles missing first name or last name

## API

The app uses:

```txt
https://wizard-world-api.herokuapp.com/Wizards
```

For search, it sends query params like:

```txt
?FirstName=Harry
?LastName=Potter
```

## How To Run

Install dependencies:

```bash
npm install
```

Run the project:

```bash
npm run dev
```

Build the project:

```bash
npm run build
```

Run lint:

```bash
npm run lint
```

## Notes

- The API returns all wizards at once, so pagination is handled on the client side.
- When the search value changes, the page resets back to page 1.
- The same paginated records are used for the mobile/tablet cards and the desktop table.
- Mobile pagination shows Previous, Page X of Y, and Next; numbered page controls appear from tablet widths.
- The permanent sidebar and desktop table start at Tailwind's `xl` breakpoint so 1024px screens keep enough content width.
- The modal and drawer both close with Escape and backdrop clicks, and body scrolling is locked while either is open.
- If a wizard has no first name or last name, the UI shows a fallback value instead of breaking.
- Responsive review targeted 320px, 375px, 390px, 640px, 768px, 1024px, 1280px, and 1440px widths.

## What I Would Improve With More Time

- Add tests for search and pagination.
- Add visual regression screenshots against the Figma frames.
- Add a real filter instead of only the filter button UI.
