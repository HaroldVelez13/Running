# StrideMetrics — Running Analytics Dashboard

A single-page running analytics dashboard with activity tracking, goal management, and data visualizations.

Built with vanilla JS, HTML, and CSS — no frameworks, no build step, no dependencies.

## Quick Start

```bash
npm run dev
```

Opens at [http://localhost:3000](http://localhost:3000)

Includes: Dashboard (`/`), Activities (`/activities.html`), Goals (`/goals.html`).

## Features

- **Dashboard** — weekly stats, heart rate chart, pace trend, distance breakdown, recent activities table
- **Activities** — searchable, filterable activity log with per-run detail
- **Goals** — monthly/quarterly/all-time goal tracking with progress bars
- **Dark theme** — glass sidebar, neon lime/cyan accents, custom scrollbar
- **Accessible** — WCAG 2.2 AA compliant (focus-visible, aria labels, skip link, live regions)
- **SEO** — meta tags, JSON-LD structured data, sitemap.xml, robots.txt

## Project Structure

```
├── server.js          Static file server (Node http)
├── index.html         Dashboard
├── activities.html    Activity log
├── goals.html         Goal tracking
├── styles.css         All styling
├── app.js             Dashboard logic
├── activities.js      Activities logic
├── goals.js           Goals logic
├── sitemap.xml        SEO sitemap
├── robots.txt         SEO robots
└── running-dashboard-video/
    ├── index.html     10s PulseRun promo (HyperFrames)
    └── package.json   pnpm scripts (preview/render/lint)
```

## PulseRun Promo Video

A 10-second product video for StrideMetrics, built with HyperFrames:

```
cd running-dashboard-video
pnpm install
pnpm preview   # dev server with hot reload
pnpm render    # export as MP4
pnpm lint      # validate composition
```

Features 4 scenes, blur crossfade transitions, GSAP timeline animations, and metric card reveals.
