# Marketing Ops Dashboard: Design Spec

Date: 2026-07-18
Status: Approved
Author: Amrudin Catic (with Claude Code)

## 1. Purpose

A single-page marketing ops command center, built as a proof-of-work portfolio
piece. A visitor opens it and immediately reads a real, full-funnel marketing
operations dashboard for a fictional but realistic B2B company. It is paired
with a documented analytics tracking plan so it demonstrates ops thinking, not
only charting. Keep it focused and small.

The detail that proves it is engineered, not faked: the date-range and channel
filters recompute every number, chart, and table on screen.

## 2. Success criteria

- A viewer with no setup can open a live link and understand the marketing
  picture in under 30 seconds.
- Changing the date range or channel filter updates every KPI, chart, funnel
  stage, and table row consistently.
- The analytics tracking plan reads like something a marketing engineer would
  hand to a data team, and its metric definitions match the dashboard math.
- The synthwave aesthetic is bold but the dashboard stays readable as a real
  tool.
- Runs locally with `npm install && npm run dev`, and deploys to GitHub Pages.

## 3. Data model (realistic mock)

A seeded, deterministic 90-day daily dataset so charts are stable across
reloads.

- Dimensions: date, channel.
- Channels: Google Ads, Meta, LinkedIn, Organic Search (SEO), Email.
- Stored metrics per row: spend, impressions, clicks, leads, mql, sql,
  customers, revenue.
- Derived metrics (computed, never stored): CTR, CPC, CPL, CVR, ROAS, CAC, and
  blended totals across channels.
- Funnel path: Visitors, Leads, MQL, SQL, Customers, with the conversion rate
  between each stage.

The dataset is produced by a seed script into `src/data/mockData.json`. It is
served through `src/data/dataService.js`, whose `getMarketingData()` returns a
promise with a short delay, so the app reads as if it fetches from an API.

## 4. Layout (top to bottom)

- Header: wordmark (working name "SIGNAL"), date-range selector, channel
  multi-select, and a "last synced" timestamp.
- KPI row: six stat tiles (Spend, Leads, CPL, ROAS, Revenue, CAC). Each shows a
  value, a delta versus the previous equivalent period, and a sparkline.
- Funnel: a staged funnel visualization with counts and stage-to-stage
  conversion rates.
- Trend chart: a main time series with a metric toggle (spend vs revenue, or
  leads over time), drawn with a neon glow line or area.
- Channel performance: a bar chart (ROAS or spend by channel) plus a
  channel-mix donut.
- Data table: a per-channel breakdown with sortable columns (spend, leads, CPL,
  ROAS). This is the ops detail layer.
- Footer: a "data simulated" note, a link to the tracking-plan docs, and a
  built-by credit.

Every KPI, chart, funnel stage, and table row recomputes when filters change.

## 5. Component architecture

Stack: React + Vite + Recharts.

- `App`: owns filter state (dateRange, selectedChannels), loads data through the
  data layer, and feeds children.
- `src/data/`:
  - `mockData.json`: generated dataset.
  - `dataService.js`: async getter that simulates an API fetch.
  - `metrics.js`: pure functions (aggregate, deriveKpis, buildFunnel, byChannel,
    sparklineSeries). Pure and unit-testable.
- `src/components/`: `Header`, `FilterBar`, `KpiTile`, `KpiRow`, `Funnel`,
  `TrendChart`, `ChannelChart`, `ChannelMix`, `DataTable`, `Footer`.
- Derived data via `useMemo`. Plain React state, no global store (YAGNI).

## 6. Analytics tracking plan

Lives in `docs/analytics/`.

- `tracking-plan.md`: the event taxonomy. Events include page_view, cta_click,
  form_start, form_submit, lead_created, demo_requested, and purchase. Each has
  a trigger, properties, and the funnel stage it maps to.
- `datalayer-schema.md`: the GTM dataLayer object shape with example pushes.
- `metric-definitions.md`: the exact definition and formula for every KPI (CPL,
  ROAS, CAC, MQL to SQL rate). This is the same math `metrics.js` implements, so
  the docs and the code agree.
- `ga4-setup.md`: a GA4 and GTM setup checklist (custom events, conversions, and
  UTM conventions).

## 7. Aesthetic

80s synthwave, delivered through the frontend-design skill: a deep purple to
near-black background, neon magenta and cyan, a sunset-gradient accent, a
grid-horizon motif, glow on numbers and chart lines, a retro display plus
monospace type pairing, and a subtle scanline or grain. Contrast stays readable
so it works as a real tool, not only a poster.

## 8. Testing and verification

- Vitest unit tests on `metrics.js`: aggregation totals, CPL/ROAS/CAC math,
  funnel conversion rates, and channel filtering.
- A render smoke test for `App`.
- Visual verification of the running dashboard before the work is called done.

## 9. Deploy and repository

- Vite build with `base` configured for GitHub Pages.
- A GitHub Actions workflow that builds and deploys to Pages on push to main.
- A README with a screenshot, the live link, a short "what this demonstrates"
  section, and local run instructions.
- CLAUDE.md and progress.md kept current throughout.

## 10. Out of scope (YAGNI)

- No backend, no real authentication, no real GA property or API keys.
- No routing or multi-page views (single page only).
- No database or CMS.

## 11. Project rules (from CLAUDE.md)

- No em-dashes and no en-dashes anywhere, in code, docs, commits, or chat.
- Log every meaningful step in progress.md.
- Keep it small.
