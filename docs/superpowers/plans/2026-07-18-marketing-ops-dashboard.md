# Marketing Ops Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page, filterable full-funnel marketing ops dashboard (React + Vite + Recharts) in an 80s "mission-control" synthwave skin, paired with an analytics tracking plan, deployable to GitHub Pages as a proof-of-work piece.

**Architecture:** A seeded 90-day mock dataset is served through an async data-service module so the app reads as API-backed. Pure functions in `metrics.js` do all aggregation and KPI math (the tested core). `App` holds filter state and derives everything via `useMemo`, feeding presentational components. Styling is a synthwave design-token system in CSS variables.

**Tech Stack:** React 18, Vite, Recharts, Vitest + React Testing Library, plain CSS with custom properties. Fonts from Google Fonts (Michroma, Chakra Petch, JetBrains Mono).

## Global Constraints

- No em-dashes and no en-dashes anywhere: code, comments, docs, commit messages. Use hyphens, commas, colons, or parentheses.
- Log every meaningful step in `progress.md` (newest at the bottom).
- Keep it small. YAGNI. No backend, no routing, no global store, no real auth.
- Dataset is deterministic and seeded. Anchor end date is fixed at `2026-06-30` so data never depends on run time.
- Channels (exact strings, order matters): `Google Ads`, `Meta`, `LinkedIn`, `Organic Search`, `Email`.
- Row fields (exact keys): `date`, `channel`, `spend`, `impressions`, `clicks`, `visitors`, `leads`, `mql`, `sql`, `customers`, `revenue`.
- Design tokens are the single source of truth for color and type. No hardcoded hex outside `tokens.css`.
- Node 18+ and npm.

---

## File Structure

```
marketing-ops-dashboard/
  index.html                      # Vite entry, font links
  package.json
  vite.config.js                  # base for GitHub Pages
  vitest.config.js                # or test block in vite.config
  scripts/
    generate-data.mjs             # seeded dataset generator -> src/data/mockData.json
  src/
    main.jsx                      # React mount
    App.jsx                       # filter state, data load, layout, useMemo derivations
    data/
      mockData.json               # generated, committed
      dataService.js              # getMarketingData(): async, simulated fetch
      metrics.js                  # pure functions: filter, aggregate, KPIs, funnel, byChannel, sparkline, deltas
      constants.js                # CHANNELS, KPI_DEFS, CHANNEL_COLORS
    components/
      Header.jsx                  # wordmark, sync timestamp, holds FilterBar
      FilterBar.jsx               # date-range + channel multi-select
      KpiRow.jsx                  # maps KPI_DEFS to KpiTile
      KpiTile.jsx                 # CRT readout: value, delta, sparkline
      Funnel.jsx                  # staged funnel with step rates
      TrendChart.jsx              # time series + metric toggle
      ChannelChart.jsx            # bar chart by channel
      ChannelMix.jsx              # donut of spend share
      DataTable.jsx               # sortable per-channel table
      Footer.jsx                  # simulated-data note, docs link, credit
    styles/
      tokens.css                  # design tokens (color, type, glow)
      base.css                    # reset, layout grid, panel/scanline utilities
    test/
      metrics.test.js
      generate-data.test.js
      dataService.test.js
      App.test.jsx
      components.test.jsx
  docs/
    analytics/
      tracking-plan.md
      datalayer-schema.md
      metric-definitions.md
      ga4-setup.md
  .github/workflows/deploy.yml    # build + deploy to Pages
  README.md
```

---

### Task 1: Project scaffold and tooling

**Files:**
- Create: `package.json`, `vite.config.js`, `index.html`, `src/main.jsx`, `src/App.jsx` (placeholder), `.gitignore`
- Test: `src/test/App.test.jsx` (smoke)

**Interfaces:**
- Consumes: nothing.
- Produces: a running Vite React app, `npm test` wired to Vitest, `App` default export.

- [ ] **Step 1: Create package.json**

```json
{
  "name": "marketing-ops-dashboard",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "gen:data": "node scripts/generate-data.mjs"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "recharts": "^2.12.7"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.4.6",
    "@testing-library/react": "^16.0.0",
    "@vitejs/plugin-react": "^4.3.1",
    "jsdom": "^24.1.0",
    "vite": "^5.3.3",
    "vitest": "^2.0.2"
  }
}
```

- [ ] **Step 2: Create vite.config.js (Vite + React + Vitest + Pages base)**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base is set for GitHub Pages project sites. Override at build time with
// VITE_BASE if the repo name differs.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || '/marketing-ops-dashboard/',
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
  },
})
```

- [ ] **Step 3: Create test setup and index.html**

`src/test/setup.js`:

```js
import '@testing-library/jest-dom'
```

`index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SIGNAL // Marketing Ops</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Michroma&family=Chakra+Petch:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 4: Create main.jsx and placeholder App.jsx**

`src/main.jsx`:

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/tokens.css'
import './styles/base.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

`src/App.jsx` (placeholder, replaced in Task 6):

```jsx
export default function App() {
  return <main data-testid="app-root">SIGNAL</main>
}
```

Create empty `src/styles/tokens.css` and `src/styles/base.css` so imports resolve (filled in Task 5).

`.gitignore`:

```
node_modules
dist
.DS_Store
```

- [ ] **Step 5: Write the smoke test**

`src/test/App.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react'
import App from '../App.jsx'

test('App renders a root region', () => {
  render(<App />)
  expect(screen.getByTestId('app-root')).toBeInTheDocument()
})
```

- [ ] **Step 6: Install, run tests, verify dev server**

Run: `npm install && npm test`
Expected: 1 passing test.
Run: `npm run dev` and confirm the page shows "SIGNAL" with no console errors, then stop it.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: scaffold Vite React app with Vitest"
```

---

### Task 2: Constants and mock data generator

**Files:**
- Create: `src/data/constants.js`, `scripts/generate-data.mjs`, `src/data/mockData.json` (generated)
- Test: `src/test/generate-data.test.js`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `constants.js`: `export const CHANNELS` (string[5]), `export const CHANNEL_COLORS` (map channel to hex), `export const KPI_DEFS` (array, see Task 8), `export const ANCHOR_END_DATE = '2026-06-30'`, `export const DAYS = 90`.
  - `mockData.json`: `{ generatedAt: string, channels: string[], rows: Row[] }` where a Row has the exact fields listed in Global Constraints.

- [ ] **Step 1: Create constants.js**

```js
export const CHANNELS = ['Google Ads', 'Meta', 'LinkedIn', 'Organic Search', 'Email']

export const CHANNEL_COLORS = {
  'Google Ads': '#FF2E97',
  Meta: '#21E6FF',
  LinkedIn: '#A96BFF',
  'Organic Search': '#2BF5B0',
  Email: '#FFB020',
}

export const ANCHOR_END_DATE = '2026-06-30'
export const DAYS = 90
```

- [ ] **Step 2: Write the failing generator test**

`src/test/generate-data.test.js`:

```js
import { generateDataset } from '../../scripts/generate-data.mjs'
import { CHANNELS } from '../data/constants.js'

test('generates 90 days for every channel with valid rows', () => {
  const ds = generateDataset()
  expect(ds.channels).toEqual(CHANNELS)
  expect(ds.rows).toHaveLength(90 * CHANNELS.length)
  for (const r of ds.rows) {
    expect(CHANNELS).toContain(r.channel)
    expect(r.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    for (const k of ['spend', 'impressions', 'clicks', 'visitors', 'leads', 'mql', 'sql', 'customers', 'revenue']) {
      expect(typeof r[k]).toBe('number')
      expect(r[k]).toBeGreaterThanOrEqual(0)
    }
    // funnel is monotonic non-increasing after visitors
    expect(r.leads).toBeLessThanOrEqual(r.visitors)
    expect(r.mql).toBeLessThanOrEqual(r.leads)
    expect(r.sql).toBeLessThanOrEqual(r.mql)
    expect(r.customers).toBeLessThanOrEqual(r.sql)
  }
})

test('is deterministic across runs', () => {
  expect(generateDataset()).toEqual(generateDataset())
})
```

- [ ] **Step 3: Run to verify it fails**

Run: `npx vitest run src/test/generate-data.test.js`
Expected: FAIL, cannot find `generateDataset`.

- [ ] **Step 4: Implement the generator**

`scripts/generate-data.mjs`:

```js
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { CHANNELS, ANCHOR_END_DATE, DAYS } from '../src/data/constants.js'

// Deterministic PRNG (mulberry32) so the dataset is identical every run.
function mulberry32(seed) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Per-channel baseline daily spend and funnel efficiency.
const PROFILE = {
  'Google Ads': { spend: 1400, cpc: 3.1, ctr: 0.045, leadRate: 0.09, roas: 3.6 },
  Meta: { spend: 900, cpc: 1.4, ctr: 0.02, leadRate: 0.06, roas: 2.7 },
  LinkedIn: { spend: 700, cpc: 8.5, ctr: 0.006, leadRate: 0.12, roas: 2.2 },
  'Organic Search': { spend: 120, cpc: 0.0, ctr: 0.0, leadRate: 0.05, roas: 9.0 },
  Email: { spend: 60, cpc: 0.0, ctr: 0.0, leadRate: 0.14, roas: 6.5 },
}

function isoDaysAgo(endIso, offset) {
  const d = new Date(endIso + 'T00:00:00Z')
  d.setUTCDate(d.getUTCDate() - offset)
  return d.toISOString().slice(0, 10)
}

export function generateDataset() {
  const rand = mulberry32(1985)
  const rows = []
  for (let i = DAYS - 1; i >= 0; i--) {
    const date = isoDaysAgo(ANCHOR_END_DATE, i)
    const dow = new Date(date + 'T00:00:00Z').getUTCDay()
    const weekendDip = dow === 0 || dow === 6 ? 0.7 : 1
    const trend = 1 + ((DAYS - 1 - i) / DAYS) * 0.35 // gentle 35% growth over window
    for (const channel of CHANNELS) {
      const p = PROFILE[channel]
      const noise = 0.85 + rand() * 0.3
      const factor = weekendDip * trend * noise
      const spend = Math.round(p.spend * factor)

      let visitors, clicks, impressions
      if (p.cpc > 0) {
        clicks = Math.max(1, Math.round(spend / p.cpc))
        impressions = Math.round(clicks / p.ctr)
        visitors = clicks
      } else {
        // organic and email: model sessions directly, spend is tooling cost
        const base = channel === 'Organic Search' ? 1600 : 900
        visitors = Math.max(1, Math.round(base * factor))
        clicks = visitors
        impressions = Math.round(visitors / 0.35)
      }

      const leads = Math.max(0, Math.round(visitors * p.leadRate * (0.9 + rand() * 0.2)))
      const mql = Math.round(leads * (0.55 + rand() * 0.1))
      const sql = Math.round(mql * (0.5 + rand() * 0.1))
      const customers = Math.round(sql * (0.28 + rand() * 0.08))
      const revenue = Math.round(spend * p.roas * (0.85 + rand() * 0.3))

      rows.push({ date, channel, spend, impressions, clicks, visitors, leads, mql, sql, customers, revenue })
    }
  }
  return { generatedAt: ANCHOR_END_DATE + 'T06:00:00Z', channels: CHANNELS, rows }
}

// When run directly, write the JSON file.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const out = join(dirname(fileURLToPath(import.meta.url)), '../src/data/mockData.json')
  writeFileSync(out, JSON.stringify(generateDataset(), null, 2))
  console.log('wrote', out)
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/test/generate-data.test.js`
Expected: PASS (2 tests).

- [ ] **Step 6: Generate the committed data file**

Run: `npm run gen:data`
Expected: prints "wrote .../src/data/mockData.json".

- [ ] **Step 7: Commit**

```bash
git add src/data/constants.js scripts/generate-data.mjs src/data/mockData.json src/test/generate-data.test.js
git commit -m "feat: seeded 90-day marketing mock dataset generator"
```

---

### Task 3: Metrics module (pure functions, the tested core)

**Files:**
- Create: `src/data/metrics.js`
- Test: `src/test/metrics.test.js`

**Interfaces:**
- Consumes: `Row[]` from `mockData.json`, `CHANNELS` from `constants.js`.
- Produces (exact signatures, later tasks depend on these):
  - `dateBounds(rows) -> { min: string, max: string }`
  - `filterRows(rows, { start, end, channels }) -> Row[]` (inclusive dates; `channels` undefined or empty means all)
  - `sumMetrics(rows) -> { spend, impressions, clicks, visitors, leads, mql, sql, customers, revenue }`
  - `deriveKpis(totals) -> { spend, leads, revenue, cpl, roas, cac, ctr, cpc, cvr }`
  - `buildFunnel(totals) -> [{ stage, count, stepRate, pctOfTop }]` stages Visitors, Leads, MQL, SQL, Customers
  - `byChannel(rows) -> [{ channel, ...totals, ...kpis }]` ordered by `CHANNELS`
  - `dailySeries(rows, metric) -> [{ date, value }]` where metric is a raw row key OR one of `cpl`, `roas`
  - `previousRange({ start, end }) -> { start, end }` equal-length window immediately before
  - `pctChange(current, previous) -> number` (0 when previous is 0)

- [ ] **Step 1: Write the failing metrics tests**

`src/test/metrics.test.js`:

```js
import {
  dateBounds, filterRows, sumMetrics, deriveKpis, buildFunnel,
  byChannel, dailySeries, previousRange, pctChange,
} from '../data/metrics.js'

const rows = [
  { date: '2026-06-01', channel: 'Google Ads', spend: 100, impressions: 1000, clicks: 50, visitors: 50, leads: 10, mql: 6, sql: 3, customers: 1, revenue: 400 },
  { date: '2026-06-01', channel: 'Email', spend: 0, impressions: 200, clicks: 80, visitors: 80, leads: 20, mql: 10, sql: 5, customers: 2, revenue: 300 },
  { date: '2026-06-02', channel: 'Google Ads', spend: 100, impressions: 1000, clicks: 50, visitors: 50, leads: 10, mql: 4, sql: 2, customers: 1, revenue: 200 },
]

test('dateBounds returns min and max', () => {
  expect(dateBounds(rows)).toEqual({ min: '2026-06-01', max: '2026-06-02' })
})

test('filterRows filters by date and channel inclusively', () => {
  expect(filterRows(rows, { start: '2026-06-01', end: '2026-06-01' })).toHaveLength(2)
  expect(filterRows(rows, { start: '2026-06-01', end: '2026-06-02', channels: ['Google Ads'] })).toHaveLength(2)
})

test('sumMetrics adds every numeric field', () => {
  const t = sumMetrics(rows)
  expect(t.spend).toBe(200)
  expect(t.leads).toBe(40)
  expect(t.revenue).toBe(900)
  expect(t.customers).toBe(4)
})

test('deriveKpis computes CPL, ROAS, CAC', () => {
  const k = deriveKpis(sumMetrics(rows))
  expect(k.cpl).toBeCloseTo(200 / 40) // spend / leads
  expect(k.roas).toBeCloseTo(900 / 200) // revenue / spend
  expect(k.cac).toBeCloseTo(200 / 4) // spend / customers
})

test('deriveKpis handles divide-by-zero as 0', () => {
  const k = deriveKpis(sumMetrics([]))
  expect(k.cpl).toBe(0)
  expect(k.roas).toBe(0)
})

test('buildFunnel returns stages with step rates', () => {
  const f = buildFunnel(sumMetrics(rows))
  expect(f.map((s) => s.stage)).toEqual(['Visitors', 'Leads', 'MQL', 'SQL', 'Customers'])
  expect(f[0].count).toBe(180) // visitors
  expect(f[1].count).toBe(40) // leads
  expect(f[1].stepRate).toBeCloseTo(40 / 180)
  expect(f[0].pctOfTop).toBe(1)
})

test('byChannel groups and orders by CHANNELS', () => {
  const bc = byChannel(rows)
  const ga = bc.find((c) => c.channel === 'Google Ads')
  expect(ga.spend).toBe(200)
  expect(ga.cpl).toBeCloseTo(200 / 20)
})

test('dailySeries supports raw and derived metrics', () => {
  expect(dailySeries(rows, 'spend')).toEqual([
    { date: '2026-06-01', value: 100 },
    { date: '2026-06-02', value: 100 },
  ])
  const roas = dailySeries(rows, 'roas')
  expect(roas[0].value).toBeCloseTo(700 / 100) // day 1 revenue 700 / spend 100
})

test('previousRange returns the equal-length preceding window', () => {
  expect(previousRange({ start: '2026-06-10', end: '2026-06-19' })).toEqual({
    start: '2026-05-31', end: '2026-06-09',
  })
})

test('pctChange guards zero', () => {
  expect(pctChange(150, 100)).toBeCloseTo(0.5)
  expect(pctChange(100, 0)).toBe(0)
})
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run src/test/metrics.test.js`
Expected: FAIL, module not found.

- [ ] **Step 3: Implement metrics.js**

```js
import { CHANNELS } from './constants.js'

const RAW_KEYS = ['spend', 'impressions', 'clicks', 'visitors', 'leads', 'mql', 'sql', 'customers', 'revenue']
const safeDiv = (a, b) => (b ? a / b : 0)

export function dateBounds(rows) {
  const dates = rows.map((r) => r.date).sort()
  return { min: dates[0], max: dates[dates.length - 1] }
}

export function filterRows(rows, { start, end, channels } = {}) {
  const useChannels = channels && channels.length ? new Set(channels) : null
  return rows.filter((r) => {
    if (start && r.date < start) return false
    if (end && r.date > end) return false
    if (useChannels && !useChannels.has(r.channel)) return false
    return true
  })
}

export function sumMetrics(rows) {
  const t = Object.fromEntries(RAW_KEYS.map((k) => [k, 0]))
  for (const r of rows) for (const k of RAW_KEYS) t[k] += r[k]
  return t
}

export function deriveKpis(t) {
  return {
    spend: t.spend,
    leads: t.leads,
    revenue: t.revenue,
    cpl: safeDiv(t.spend, t.leads),
    roas: safeDiv(t.revenue, t.spend),
    cac: safeDiv(t.spend, t.customers),
    ctr: safeDiv(t.clicks, t.impressions),
    cpc: safeDiv(t.spend, t.clicks),
    cvr: safeDiv(t.leads, t.visitors),
  }
}

export function buildFunnel(t) {
  const stages = [
    ['Visitors', t.visitors],
    ['Leads', t.leads],
    ['MQL', t.mql],
    ['SQL', t.sql],
    ['Customers', t.customers],
  ]
  const top = t.visitors || 0
  return stages.map(([stage, count], i) => ({
    stage,
    count,
    pctOfTop: safeDiv(count, top),
    stepRate: i === 0 ? 1 : safeDiv(count, stages[i - 1][1]),
  }))
}

export function byChannel(rows) {
  return CHANNELS.map((channel) => {
    const totals = sumMetrics(rows.filter((r) => r.channel === channel))
    return { channel, ...totals, ...deriveKpis(totals) }
  })
}

export function dailySeries(rows, metric) {
  const byDate = new Map()
  for (const r of rows) {
    if (!byDate.has(r.date)) byDate.set(r.date, sumMetrics([]))
    const acc = byDate.get(r.date)
    for (const k of RAW_KEYS) acc[k] += r[k]
  }
  return [...byDate.keys()].sort().map((date) => {
    const t = byDate.get(date)
    let value
    if (metric === 'cpl') value = safeDiv(t.spend, t.leads)
    else if (metric === 'roas') value = safeDiv(t.revenue, t.spend)
    else value = t[metric]
    return { date, value }
  })
}

export function previousRange({ start, end }) {
  const s = new Date(start + 'T00:00:00Z')
  const e = new Date(end + 'T00:00:00Z')
  const days = Math.round((e - s) / 86400000) + 1
  const prevEnd = new Date(s)
  prevEnd.setUTCDate(prevEnd.getUTCDate() - 1)
  const prevStart = new Date(prevEnd)
  prevStart.setUTCDate(prevStart.getUTCDate() - (days - 1))
  return { start: prevStart.toISOString().slice(0, 10), end: prevEnd.toISOString().slice(0, 10) }
}

export function pctChange(current, previous) {
  return previous ? (current - previous) / previous : 0
}
```

- [ ] **Step 4: Run tests to verify pass**

Run: `npx vitest run src/test/metrics.test.js`
Expected: PASS (all tests).

- [ ] **Step 5: Commit**

```bash
git add src/data/metrics.js src/test/metrics.test.js
git commit -m "feat: pure metrics module with KPI, funnel, and channel math"
```

---

### Task 4: Data service (simulated async fetch)

**Files:**
- Create: `src/data/dataService.js`
- Test: `src/test/dataService.test.js`

**Interfaces:**
- Consumes: `mockData.json`.
- Produces: `getMarketingData() -> Promise<{ generatedAt, channels, rows }>`.

- [ ] **Step 1: Write failing test**

`src/test/dataService.test.js`:

```js
import { getMarketingData } from '../data/dataService.js'
import { CHANNELS } from '../data/constants.js'

test('getMarketingData resolves to the dataset', async () => {
  const data = await getMarketingData()
  expect(data.channels).toEqual(CHANNELS)
  expect(Array.isArray(data.rows)).toBe(true)
  expect(data.rows.length).toBeGreaterThan(0)
})
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run src/test/dataService.test.js`
Expected: FAIL, module not found.

- [ ] **Step 3: Implement dataService.js**

```js
import dataset from './mockData.json'

// Simulates an API call so the app reads as data-fetched rather than hardcoded.
export function getMarketingData({ delayMs = 350 } = {}) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(dataset), delayMs)
  })
}
```

- [ ] **Step 4: Run to verify pass**

Run: `npx vitest run src/test/dataService.test.js`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/data/dataService.js src/test/dataService.test.js
git commit -m "feat: async data service simulating an API fetch"
```

---

### Task 5: Design tokens and base styles (synthwave mission-control skin)

**Files:**
- Create/replace: `src/styles/tokens.css`, `src/styles/base.css`

**Interfaces:**
- Produces: CSS custom properties and utility classes (`.panel`, `.panel__title`, `.grid`, `.glow-text`, `.scanlines`) used by every component.

- [ ] **Step 1: Write tokens.css**

```css
:root {
  /* surfaces */
  --void: #0b0713;
  --panel: #150c24;
  --panel-2: #1c1030;
  --grid: #2a1b44;

  /* neon accents */
  --magenta: #ff2e97;
  --cyan: #21e6ff;
  --violet: #a96bff;
  --mint: #2bf5b0;
  --amber: #ffb020;

  /* semantic */
  --good: var(--mint);
  --bad: #ff4d6d;
  --neutral: #8b7fb0;

  /* text */
  --ink: #eae6ff;
  --muted: #9a8ec2;

  /* type */
  --font-display: 'Michroma', sans-serif;
  --font-ui: 'Chakra Petch', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* effects */
  --glow-magenta: 0 0 12px rgba(255, 46, 151, 0.55);
  --glow-cyan: 0 0 12px rgba(33, 230, 255, 0.5);
  --radius: 10px;
  --hairline: 1px solid var(--grid);
}
```

- [ ] **Step 2: Write base.css (reset, layout, panels, atmosphere)**

```css
* { box-sizing: border-box; }
html, body, #root { margin: 0; height: 100%; }

body {
  background:
    radial-gradient(1200px 500px at 50% -10%, rgba(255, 46, 151, 0.12), transparent 60%),
    var(--void);
  color: var(--ink);
  font-family: var(--font-ui);
  -webkit-font-smoothing: antialiased;
}

.app {
  max-width: 1220px;
  margin: 0 auto;
  padding: 24px 20px 48px;
  display: grid;
  gap: 16px;
}

/* mission-control layout: two-column mid section that stacks on mobile */
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@media (max-width: 860px) { .grid-2 { grid-template-columns: 1fr; } }

.panel {
  background: linear-gradient(180deg, var(--panel-2), var(--panel));
  border: var(--hairline);
  border-radius: var(--radius);
  padding: 16px;
  position: relative;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.02);
}
.panel__title {
  font-family: var(--font-ui);
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-size: 12px;
  color: var(--muted);
  margin: 0 0 12px;
}

.glow-text { text-shadow: var(--glow-magenta); }

/* faint CRT scanlines, used sparingly on readouts */
.scanlines::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  background: repeating-linear-gradient(
    0deg, rgba(255, 255, 255, 0.03) 0 1px, transparent 1px 3px
  );
  opacity: 0.4;
}

@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}

:focus-visible { outline: 2px solid var(--cyan); outline-offset: 2px; }
```

- [ ] **Step 3: Verify visually**

Run: `npm run dev`, confirm dark purple background with a magenta glow at the top, no console errors. Stop the server.

- [ ] **Step 4: Commit**

```bash
git add src/styles/tokens.css src/styles/base.css
git commit -m "style: synthwave mission-control design tokens and base styles"
```

---

### Task 6: App shell, data loading, and derived state

**Files:**
- Replace: `src/App.jsx`
- Test: update `src/test/App.test.jsx`

**Interfaces:**
- Consumes: `getMarketingData`, all of `metrics.js`, `constants.js`, and the components from Tasks 7-13. During this task, render placeholders for not-yet-built components so the app compiles; each later task swaps its real component in.
- Produces: the `App` layout and the props contract every child consumes:
  - `Header({ generatedAt, filters, bounds, onChange })`
  - `KpiRow({ kpis, prevKpis, series })` where `series` is `{ [kpiKey]: number[] }`
  - `Funnel({ funnel })`
  - `TrendChart({ series, metric, onMetric })`
  - `ChannelChart({ channelRows })`, `ChannelMix({ channelRows })`, `DataTable({ channelRows })`
  - `Footer()`

- [ ] **Step 1: Implement App.jsx**

```jsx
import { useEffect, useMemo, useState } from 'react'
import { getMarketingData } from './data/dataService.js'
import {
  dateBounds, filterRows, sumMetrics, deriveKpis, buildFunnel,
  byChannel, dailySeries, previousRange,
} from './data/metrics.js'
import Header from './components/Header.jsx'
import KpiRow from './components/KpiRow.jsx'
import Funnel from './components/Funnel.jsx'
import TrendChart from './components/TrendChart.jsx'
import ChannelChart from './components/ChannelChart.jsx'
import ChannelMix from './components/ChannelMix.jsx'
import DataTable from './components/DataTable.jsx'
import Footer from './components/Footer.jsx'
import { KPI_DEFS } from './data/constants.js'

const DEFAULT_WINDOW = 30

export default function App() {
  const [data, setData] = useState(null)
  const [filters, setFilters] = useState(null)
  const [metric, setMetric] = useState('spend')

  useEffect(() => {
    getMarketingData().then((d) => {
      setData(d)
      const b = dateBounds(d.rows)
      const start = new Date(b.max + 'T00:00:00Z')
      start.setUTCDate(start.getUTCDate() - (DEFAULT_WINDOW - 1))
      setFilters({ start: start.toISOString().slice(0, 10), end: b.max, channels: [] })
    })
  }, [])

  const view = useMemo(() => {
    if (!data || !filters) return null
    const rows = filterRows(data.rows, filters)
    const prev = filterRows(data.rows, { ...previousRange(filters), channels: filters.channels })
    const kpis = deriveKpis(sumMetrics(rows))
    const prevKpis = deriveKpis(sumMetrics(prev))
    const series = Object.fromEntries(
      KPI_DEFS.map((d) => [d.key, dailySeries(rows, d.seriesMetric).map((p) => p.value)]),
    )
    return {
      kpis, prevKpis, series,
      funnel: buildFunnel(sumMetrics(rows)),
      channelRows: byChannel(rows),
      trend: dailySeries(rows, metric),
    }
  }, [data, filters, metric])

  if (!data || !filters || !view) {
    return <main className="app" data-testid="app-root"><p className="panel__title">Syncing signal...</p></main>
  }

  return (
    <main className="app" data-testid="app-root">
      <Header
        generatedAt={data.generatedAt}
        filters={filters}
        bounds={dateBounds(data.rows)}
        onChange={setFilters}
      />
      <KpiRow kpis={view.kpis} prevKpis={view.prevKpis} series={view.series} />
      <div className="grid-2">
        <Funnel funnel={view.funnel} />
        <TrendChart series={view.trend} metric={metric} onMetric={setMetric} />
      </div>
      <div className="grid-2">
        <ChannelChart channelRows={view.channelRows} />
        <ChannelMix channelRows={view.channelRows} />
      </div>
      <DataTable channelRows={view.channelRows} />
      <Footer />
    </main>
  )
}
```

- [ ] **Step 2: Add KPI_DEFS to constants.js**

Append to `src/data/constants.js`:

```js
// key: kpi field in deriveKpis; label: display; format: 'currency'|'number'|'x'|'pct';
// betterWhenLower: delta color direction; seriesMetric: which dailySeries to sparkline.
export const KPI_DEFS = [
  { key: 'spend', label: 'Spend', format: 'currency', betterWhenLower: false, seriesMetric: 'spend', neutral: true },
  { key: 'leads', label: 'Leads', format: 'number', betterWhenLower: false, seriesMetric: 'leads' },
  { key: 'cpl', label: 'CPL', format: 'currency', betterWhenLower: true, seriesMetric: 'cpl' },
  { key: 'roas', label: 'ROAS', format: 'x', betterWhenLower: false, seriesMetric: 'roas' },
  { key: 'revenue', label: 'Revenue', format: 'currency', betterWhenLower: false, seriesMetric: 'revenue' },
  { key: 'cac', label: 'CAC', format: 'currency', betterWhenLower: true, seriesMetric: 'roas' },
]
```

- [ ] **Step 3: Create minimal stub components so the app compiles**

For each of `Header, KpiRow, Funnel, TrendChart, ChannelChart, ChannelMix, DataTable, Footer`, create `src/components/<Name>.jsx` returning a labeled placeholder panel. Example `src/components/Footer.jsx`:

```jsx
export default function Footer() {
  return <footer className="panel__title">data simulated</footer>
}
```

Create the other seven the same way (a `<section className="panel">` with the component name in a `.panel__title`). These are replaced in Tasks 7-13.

- [ ] **Step 4: Update the smoke test to wait for load**

`src/test/App.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react'
import App from '../App.jsx'

test('App renders KPI labels after data loads', async () => {
  render(<App />)
  expect(await screen.findByText(/Spend/i, {}, { timeout: 2000 })).toBeInTheDocument()
})
```

- [ ] **Step 5: Run tests, verify pass, check dev**

Run: `npm test`
Expected: all suites pass.
Run: `npm run dev`, confirm the layout renders panels and KPI labels after a brief sync. Stop the server.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: app shell with data loading, filters, and derived state"
```

---

### Task 7: Header and FilterBar

**Files:**
- Replace: `src/components/Header.jsx`
- Create: `src/components/FilterBar.jsx`, `src/components/Header.css`
- Test: `src/test/components.test.jsx`

**Interfaces:**
- Consumes: `Header({ generatedAt, filters, bounds, onChange })`.
- Produces: FilterBar controls that call `onChange(nextFilters)`. Presets update `filters.start/end`; channel toggles update `filters.channels` (empty array = all).

- [ ] **Step 1: Write FilterBar.jsx**

```jsx
import { CHANNELS } from '../data/constants.js'

const PRESETS = [
  { label: '7D', days: 7 },
  { label: '30D', days: 30 },
  { label: '90D', days: 90 },
]

function shiftBack(endIso, days) {
  const d = new Date(endIso + 'T00:00:00Z')
  d.setUTCDate(d.getUTCDate() - (days - 1))
  return d.toISOString().slice(0, 10)
}

export default function FilterBar({ filters, bounds, onChange }) {
  const setPreset = (days) => onChange({ ...filters, start: shiftBack(bounds.max, days), end: bounds.max })
  const toggleChannel = (ch) => {
    const set = new Set(filters.channels)
    set.has(ch) ? set.delete(ch) : set.add(ch)
    onChange({ ...filters, channels: [...set] })
  }
  return (
    <div className="filterbar">
      <div className="filterbar__presets" role="group" aria-label="Date range">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            className={'chip' + (filters.start === shiftBack(bounds.max, p.days) ? ' chip--on' : '')}
            onClick={() => setPreset(p.days)}
          >{p.label}</button>
        ))}
      </div>
      <div className="filterbar__channels" role="group" aria-label="Channels">
        {CHANNELS.map((ch) => (
          <button
            key={ch}
            className={'chip' + (filters.channels.length === 0 || filters.channels.includes(ch) ? ' chip--on' : '')}
            onClick={() => toggleChannel(ch)}
          >{ch}</button>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Write Header.jsx**

```jsx
import FilterBar from './FilterBar.jsx'
import './Header.css'

export default function Header({ generatedAt, filters, bounds, onChange }) {
  const synced = new Date(generatedAt).toISOString().slice(0, 16).replace('T', ' ')
  return (
    <header className="header panel scanlines">
      <div className="header__brand">
        <span className="header__wordmark">SIGNAL</span>
        <span className="header__sub">// MARKETING OPS</span>
      </div>
      <FilterBar filters={filters} bounds={bounds} onChange={onChange} />
      <div className="header__sync" aria-label="Last synced">
        <span className="header__dot" /> SYNCED {synced} UTC
      </div>
    </header>
  )
}
```

- [ ] **Step 3: Write Header.css**

```css
.header { display: flex; flex-wrap: wrap; gap: 14px; align-items: center; justify-content: space-between; }
.header__wordmark { font-family: var(--font-display); font-size: 22px; color: var(--ink); text-shadow: var(--glow-magenta); letter-spacing: 0.06em; }
.header__sub { font-family: var(--font-mono); font-size: 12px; color: var(--muted); margin-left: 10px; }
.header__sync { font-family: var(--font-mono); font-size: 11px; color: var(--muted); display: flex; align-items: center; gap: 6px; }
.header__dot { width: 8px; height: 8px; border-radius: 50%; background: var(--mint); box-shadow: 0 0 8px var(--mint); }
.filterbar { display: flex; flex-wrap: wrap; gap: 16px; }
.filterbar__presets, .filterbar__channels { display: flex; gap: 6px; flex-wrap: wrap; }
.chip { font-family: var(--font-mono); font-size: 11px; color: var(--muted); background: transparent; border: var(--hairline); border-radius: 999px; padding: 5px 10px; cursor: pointer; transition: all 0.15s; }
.chip--on { color: var(--void); background: var(--cyan); border-color: var(--cyan); box-shadow: var(--glow-cyan); }
```

- [ ] **Step 4: Write the FilterBar interaction test**

`src/test/components.test.jsx`:

```jsx
import { render, screen, fireEvent } from '@testing-library/react'
import Header from '../components/Header.jsx'

const base = {
  generatedAt: '2026-06-30T06:00:00Z',
  bounds: { min: '2026-04-02', max: '2026-06-30' },
  filters: { start: '2026-06-01', end: '2026-06-30', channels: [] },
}

test('toggling a channel calls onChange with that channel', () => {
  const onChange = vi.fn()
  render(<Header {...base} onChange={onChange} />)
  fireEvent.click(screen.getByText('LinkedIn'))
  expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ channels: ['LinkedIn'] }))
})
```

- [ ] **Step 5: Run tests, verify pass, check dev**

Run: `npm test`
Expected: pass. Run `npm run dev`, confirm presets and channel chips toggle and the dashboard numbers change. Stop server.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: header with date-range presets and channel filter"
```

---

### Task 8: KpiTile and KpiRow (the signature CRT readouts)

**Files:**
- Replace: `src/components/KpiRow.jsx`
- Create: `src/components/KpiTile.jsx`, `src/components/KpiTile.css`, `src/data/format.js`
- Test: add cases to `src/test/components.test.jsx`

**Interfaces:**
- Consumes: `KpiRow({ kpis, prevKpis, series })`, `KPI_DEFS`, `CHANNEL_COLORS`.
- Produces: `formatValue(value, format) -> string` in `format.js`; a KpiTile that shows label, formatted value (count-up on change), delta with correct color, and a sparkline.

- [ ] **Step 1: Create format.js**

```js
export function formatValue(value, format) {
  if (format === 'currency') return '$' + Math.round(value).toLocaleString('en-US')
  if (format === 'number') return Math.round(value).toLocaleString('en-US')
  if (format === 'x') return value.toFixed(2) + 'x'
  if (format === 'pct') return (value * 100).toFixed(1) + '%'
  return String(value)
}

export function formatPct(fraction) {
  const sign = fraction > 0 ? '+' : ''
  return sign + (fraction * 100).toFixed(1) + '%'
}
```

- [ ] **Step 2: Write KpiTile.jsx (with count-up and reduced-motion guard)**

```jsx
import { useEffect, useRef, useState } from 'react'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { formatValue, formatPct } from '../data/format.js'
import { pctChange } from '../data/metrics.js'

function useCountUp(target) {
  const [value, setValue] = useState(target)
  const from = useRef(target)
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) { setValue(target); return }
    const start = performance.now()
    const dur = 500
    const a = from.current
    let raf
    const tick = (t) => {
      const p = Math.min(1, (t - start) / dur)
      setValue(a + (target - a) * (1 - Math.pow(1 - p, 3)))
      if (p < 1) raf = requestAnimationFrame(tick)
      else from.current = target
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target])
  return value
}

export default function KpiTile({ def, value, prevValue, series }) {
  const shown = useCountUp(value)
  const change = pctChange(value, prevValue)
  const improved = def.betterWhenLower ? change < 0 : change > 0
  const deltaClass = def.neutral ? 'kpi__delta--neutral' : improved ? 'kpi__delta--good' : 'kpi__delta--bad'
  const data = series.map((v, i) => ({ i, v }))
  return (
    <div className="kpi panel scanlines">
      <div className="kpi__label">{def.label}</div>
      <div className="kpi__value glow-text">{formatValue(shown, def.format)}</div>
      {!def.neutral && (
        <div className={'kpi__delta ' + deltaClass}>{formatPct(change)} vs prev</div>
      )}
      {def.neutral && <div className="kpi__delta kpi__delta--neutral">{formatPct(change)} vs prev</div>}
      <div className="kpi__spark">
        <ResponsiveContainer width="100%" height={34}>
          <LineChart data={data}>
            <Line type="monotone" dataKey="v" stroke="var(--cyan)" strokeWidth={1.5} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Write KpiRow.jsx**

```jsx
import KpiTile from './KpiTile.jsx'
import { KPI_DEFS } from '../data/constants.js'

export default function KpiRow({ kpis, prevKpis, series }) {
  return (
    <section className="kpi-row">
      {KPI_DEFS.map((def) => (
        <KpiTile key={def.key} def={def} value={kpis[def.key]} prevValue={prevKpis[def.key]} series={series[def.key]} />
      ))}
    </section>
  )
}
```

- [ ] **Step 4: Write KpiTile.css**

```css
.kpi-row { display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; }
@media (max-width: 900px) { .kpi-row { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 520px) { .kpi-row { grid-template-columns: repeat(2, 1fr); } }
.kpi { padding: 14px; }
.kpi__label { font-family: var(--font-ui); font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); }
.kpi__value { font-family: var(--font-mono); font-weight: 700; font-size: 26px; margin: 6px 0 2px; font-variant-numeric: tabular-nums; }
.kpi__delta { font-family: var(--font-mono); font-size: 11px; }
.kpi__delta--good { color: var(--good); }
.kpi__delta--bad { color: var(--bad); }
.kpi__delta--neutral { color: var(--muted); }
.kpi__spark { margin-top: 8px; }
```

Import it at the top of `KpiRow.jsx`: `import './KpiTile.css'`.

- [ ] **Step 5: Write formatting tests**

Add to `src/test/components.test.jsx`:

```jsx
import { formatValue, formatPct } from '../data/format.js'

test('formatValue formats by type', () => {
  expect(formatValue(1234.6, 'currency')).toBe('$1,235')
  expect(formatValue(3.456, 'x')).toBe('3.46x')
  expect(formatValue(0.1234, 'pct')).toBe('12.3%')
})

test('formatPct signs positive change', () => {
  expect(formatPct(0.25)).toBe('+25.0%')
  expect(formatPct(-0.1)).toBe('-10.0%')
})
```

- [ ] **Step 6: Run tests, verify pass, check dev**

Run: `npm test` (expect pass). Run `npm run dev`, confirm KPI tiles glow, deltas are colored (CPL/CAC green when they drop), sparklines render, and values count up when you change the range. Stop server.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: glowing CRT KPI tiles with count-up, deltas, and sparklines"
```

---

### Task 9: Funnel

**Files:**
- Replace: `src/components/Funnel.jsx`
- Create: `src/components/Funnel.css`
- Test: add a case to `src/test/components.test.jsx`

**Interfaces:**
- Consumes: `Funnel({ funnel })` where funnel is the array from `buildFunnel`.

- [ ] **Step 1: Write Funnel.jsx**

```jsx
import './Funnel.css'
import { formatValue } from '../data/format.js'

export default function Funnel({ funnel }) {
  return (
    <section className="panel">
      <h2 className="panel__title">Funnel</h2>
      <div className="funnel">
        {funnel.map((s) => (
          <div className="funnel__row" key={s.stage}>
            <span className="funnel__stage">{s.stage}</span>
            <div className="funnel__bar-track">
              <div className="funnel__bar" style={{ width: Math.max(4, s.pctOfTop * 100) + '%' }} />
            </div>
            <span className="funnel__count">{formatValue(s.count, 'number')}</span>
            <span className="funnel__rate">{(s.stepRate * 100).toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Write Funnel.css**

```css
.funnel { display: grid; gap: 10px; }
.funnel__row { display: grid; grid-template-columns: 84px 1fr 64px 52px; align-items: center; gap: 10px; }
.funnel__stage { font-family: var(--font-ui); font-size: 12px; color: var(--ink); }
.funnel__bar-track { height: 16px; background: var(--void); border: var(--hairline); border-radius: 6px; overflow: hidden; }
.funnel__bar { height: 100%; background: linear-gradient(90deg, var(--magenta), var(--violet)); box-shadow: var(--glow-magenta); }
.funnel__count { font-family: var(--font-mono); font-size: 12px; text-align: right; color: var(--ink); }
.funnel__rate { font-family: var(--font-mono); font-size: 11px; text-align: right; color: var(--cyan); }
```

- [ ] **Step 3: Test**

Add to `src/test/components.test.jsx`:

```jsx
import Funnel from '../components/Funnel.jsx'

test('Funnel renders every stage with its count', () => {
  const funnel = [
    { stage: 'Visitors', count: 1000, pctOfTop: 1, stepRate: 1 },
    { stage: 'Leads', count: 100, pctOfTop: 0.1, stepRate: 0.1 },
    { stage: 'MQL', count: 60, pctOfTop: 0.06, stepRate: 0.6 },
    { stage: 'SQL', count: 30, pctOfTop: 0.03, stepRate: 0.5 },
    { stage: 'Customers', count: 9, pctOfTop: 0.009, stepRate: 0.3 },
  ]
  render(<Funnel funnel={funnel} />)
  expect(screen.getByText('Visitors')).toBeInTheDocument()
  expect(screen.getByText('1,000')).toBeInTheDocument()
})
```

- [ ] **Step 4: Run, verify, commit**

Run: `npm test` (pass), quick `npm run dev` visual check.

```bash
git add -A
git commit -m "feat: funnel panel with stage counts and step rates"
```

---

### Task 10: TrendChart

**Files:**
- Replace: `src/components/TrendChart.jsx`
- Create: `src/components/TrendChart.css`

**Interfaces:**
- Consumes: `TrendChart({ series, metric, onMetric })` where `series` is `[{ date, value }]` and metric is one of `spend`, `revenue`, `leads`.

- [ ] **Step 1: Write TrendChart.jsx (neon glow area via SVG gradient and filter)**

```jsx
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import './TrendChart.css'

const METRICS = [
  { key: 'spend', label: 'Spend' },
  { key: 'revenue', label: 'Revenue' },
  { key: 'leads', label: 'Leads' },
]

export default function TrendChart({ series, metric, onMetric }) {
  return (
    <section className="panel">
      <div className="trend__head">
        <h2 className="panel__title">Trend</h2>
        <div className="trend__toggle" role="group" aria-label="Trend metric">
          {METRICS.map((m) => (
            <button key={m.key} className={'chip' + (m.key === metric ? ' chip--on' : '')} onClick={() => onMetric(m.key)}>{m.label}</button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={series} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--magenta)" stopOpacity={0.5} />
              <stop offset="100%" stopColor="var(--magenta)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--grid)" vertical={false} />
          <XAxis dataKey="date" tick={{ fill: 'var(--muted)', fontSize: 10, fontFamily: 'var(--font-mono)' }} tickFormatter={(d) => d.slice(5)} minTickGap={28} />
          <YAxis tick={{ fill: 'var(--muted)', fontSize: 10, fontFamily: 'var(--font-mono)' }} width={44} />
          <Tooltip contentStyle={{ background: 'var(--panel)', border: '1px solid var(--grid)', fontFamily: 'var(--font-mono)', fontSize: 12 }} labelStyle={{ color: 'var(--muted)' }} />
          <Area type="monotone" dataKey="value" stroke="var(--magenta)" strokeWidth={2} fill="url(#trendFill)" isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </section>
  )
}
```

- [ ] **Step 2: Write TrendChart.css**

```css
.trend__head { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.trend__toggle { display: flex; gap: 6px; }
```

- [ ] **Step 3: Verify and commit**

Run: `npm run dev`, confirm the area chart renders with a magenta glow fill and the toggle switches the metric. Stop server.

```bash
git add -A
git commit -m "feat: trend area chart with metric toggle"
```

---

### Task 11: ChannelChart and ChannelMix

**Files:**
- Replace: `src/components/ChannelChart.jsx`, `src/components/ChannelMix.jsx`

**Interfaces:**
- Consumes: `ChannelChart({ channelRows })`, `ChannelMix({ channelRows })` where channelRows is the array from `byChannel`, plus `CHANNEL_COLORS`.

- [ ] **Step 1: Write ChannelChart.jsx (ROAS by channel bars, each channel its own neon)**

```jsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts'
import { CHANNEL_COLORS } from '../data/constants.js'

export default function ChannelChart({ channelRows }) {
  const data = channelRows.map((c) => ({ channel: c.channel, roas: Number(c.roas.toFixed(2)) }))
  return (
    <section className="panel">
      <h2 className="panel__title">ROAS by channel</h2>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="var(--grid)" vertical={false} />
          <XAxis dataKey="channel" tick={{ fill: 'var(--muted)', fontSize: 9, fontFamily: 'var(--font-mono)' }} interval={0} />
          <YAxis tick={{ fill: 'var(--muted)', fontSize: 10, fontFamily: 'var(--font-mono)' }} width={30} />
          <Tooltip cursor={{ fill: 'rgba(255,255,255,0.04)' }} contentStyle={{ background: 'var(--panel)', border: '1px solid var(--grid)', fontFamily: 'var(--font-mono)', fontSize: 12 }} />
          <Bar dataKey="roas" radius={[4, 4, 0, 0]} isAnimationActive={false}>
            {data.map((d) => (<Cell key={d.channel} fill={CHANNEL_COLORS[d.channel]} />))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </section>
  )
}
```

- [ ] **Step 2: Write ChannelMix.jsx (spend share donut)**

```jsx
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { CHANNEL_COLORS } from '../data/constants.js'

export default function ChannelMix({ channelRows }) {
  const data = channelRows.map((c) => ({ name: c.channel, value: c.spend }))
  return (
    <section className="panel">
      <h2 className="panel__title">Spend mix</h2>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2} stroke="var(--void)">
            {data.map((d) => (<Cell key={d.name} fill={CHANNEL_COLORS[d.name]} />))}
          </Pie>
          <Tooltip contentStyle={{ background: 'var(--panel)', border: '1px solid var(--grid)', fontFamily: 'var(--font-mono)', fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </section>
  )
}
```

- [ ] **Step 3: Verify and commit**

Run: `npm run dev`, confirm bars and donut use the per-channel neon colors and update with filters. Stop server.

```bash
git add -A
git commit -m "feat: channel ROAS bars and spend-mix donut"
```

---

### Task 12: DataTable (sortable per-channel breakdown)

**Files:**
- Replace: `src/components/DataTable.jsx`
- Create: `src/components/DataTable.css`
- Test: add a case to `src/test/components.test.jsx`

**Interfaces:**
- Consumes: `DataTable({ channelRows })`.

- [ ] **Step 1: Write DataTable.jsx**

```jsx
import { useState } from 'react'
import './DataTable.css'
import { formatValue } from '../data/format.js'
import { CHANNEL_COLORS } from '../data/constants.js'

const COLS = [
  { key: 'channel', label: 'Channel', format: null },
  { key: 'spend', label: 'Spend', format: 'currency' },
  { key: 'leads', label: 'Leads', format: 'number' },
  { key: 'cpl', label: 'CPL', format: 'currency' },
  { key: 'roas', label: 'ROAS', format: 'x' },
  { key: 'revenue', label: 'Revenue', format: 'currency' },
]

export default function DataTable({ channelRows }) {
  const [sort, setSort] = useState({ key: 'spend', dir: -1 })
  const rows = [...channelRows].sort((a, b) => {
    if (sort.key === 'channel') return a.channel.localeCompare(b.channel) * sort.dir
    return (a[sort.key] - b[sort.key]) * sort.dir
  })
  const onSort = (key) => setSort((s) => (s.key === key ? { key, dir: -s.dir } : { key, dir: -1 }))
  return (
    <section className="panel">
      <h2 className="panel__title">Channel breakdown</h2>
      <table className="dtable">
        <thead>
          <tr>
            {COLS.map((c) => (
              <th key={c.key} onClick={() => onSort(c.key)} className={sort.key === c.key ? 'is-sorted' : ''}>
                {c.label}{sort.key === c.key ? (sort.dir === -1 ? ' v' : ' ^') : ''}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.channel}>
              {COLS.map((c) => (
                <td key={c.key}>
                  {c.key === 'channel' ? (
                    <span><span className="dtable__dot" style={{ background: CHANNEL_COLORS[r.channel] }} />{r.channel}</span>
                  ) : formatValue(r[c.key], c.format)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
```

- [ ] **Step 2: Write DataTable.css**

```css
.dtable { width: 100%; border-collapse: collapse; font-family: var(--font-mono); font-size: 12px; }
.dtable th { text-align: right; color: var(--muted); font-weight: 500; padding: 8px 10px; border-bottom: var(--hairline); cursor: pointer; user-select: none; letter-spacing: 0.04em; }
.dtable th:first-child, .dtable td:first-child { text-align: left; }
.dtable th.is-sorted { color: var(--cyan); }
.dtable td { text-align: right; padding: 9px 10px; border-bottom: 1px solid rgba(42, 27, 68, 0.5); color: var(--ink); }
.dtable__dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 8px; vertical-align: middle; }
```

- [ ] **Step 3: Test sorting**

Add to `src/test/components.test.jsx`:

```jsx
import DataTable from '../components/DataTable.jsx'

test('DataTable renders a row per channel', () => {
  const channelRows = [
    { channel: 'Google Ads', spend: 100, leads: 10, cpl: 10, roas: 4, revenue: 400 },
    { channel: 'Email', spend: 10, leads: 5, cpl: 2, roas: 6, revenue: 60 },
  ]
  render(<DataTable channelRows={channelRows} />)
  expect(screen.getByText('Google Ads')).toBeInTheDocument()
  expect(screen.getByText('Email')).toBeInTheDocument()
})
```

- [ ] **Step 4: Run, verify, commit**

Run: `npm test` (pass), `npm run dev` and confirm clicking headers re-sorts. Stop server.

```bash
git add -A
git commit -m "feat: sortable per-channel data table"
```

---

### Task 13: Footer

**Files:**
- Replace: `src/components/Footer.jsx`

**Interfaces:**
- Consumes: `Footer()`.

- [ ] **Step 1: Write Footer.jsx**

```jsx
export default function Footer() {
  return (
    <footer className="footer panel">
      <span>Data is simulated for demonstration.</span>
      <a href="docs/analytics/tracking-plan.md">Tracking plan</a>
      <span>Built by Amrudin Catic</span>
    </footer>
  )
}
```

Add to `base.css`:

```css
.footer { display: flex; flex-wrap: wrap; gap: 16px; justify-content: space-between; font-family: var(--font-mono); font-size: 11px; color: var(--muted); }
.footer a { color: var(--cyan); text-decoration: none; }
.footer a:hover { text-decoration: underline; }
```

- [ ] **Step 2: Run, verify, commit**

Run: `npm test` (all pass), `npm run dev` full visual pass. Stop server.

```bash
git add -A
git commit -m "feat: footer with simulated-data note and docs link"
```

---

### Task 14: Analytics tracking plan (the ops half)

**Files:**
- Create: `docs/analytics/tracking-plan.md`, `docs/analytics/datalayer-schema.md`, `docs/analytics/metric-definitions.md`, `docs/analytics/ga4-setup.md`

**Interfaces:** none (documentation). `metric-definitions.md` must match `metrics.js` formulas exactly.

- [ ] **Step 1: Write tracking-plan.md**

Event taxonomy table with columns: Event name, Trigger, Key properties, Funnel stage. Include these events: `page_view` (Visitors), `cta_click` (Visitors), `form_start` (Visitors), `form_submit` (Leads), `lead_created` (Leads), `mql_qualified` (MQL), `sql_accepted` (SQL), `demo_requested` (SQL), `purchase` (Customers). For each, list realistic properties (for example `purchase`: `value`, `currency`, `plan`, `channel`, `utm_source`). Add a short intro paragraph explaining naming convention (snake_case, object_action) and that every event carries `channel` and UTM fields.

- [ ] **Step 2: Write datalayer-schema.md**

Show the GTM `dataLayer` object shape and 2 example pushes as JSON code blocks (a `form_submit` and a `purchase`), including a `user` object, an `event` field, and an `attribution` object (utm_source, utm_medium, utm_campaign, channel). Note which GTM variables and triggers map to each.

- [ ] **Step 3: Write metric-definitions.md**

One row per KPI with the exact formula, matching `metrics.js`:
- Spend = sum(spend)
- Leads = sum(leads)
- Revenue = sum(revenue)
- CPL = Spend / Leads
- ROAS = Revenue / Spend
- CAC = Spend / Customers
- CTR = Clicks / Impressions
- CPC = Spend / Clicks
- Lead CVR = Leads / Visitors
- Funnel step rate = stage count / previous stage count

Add a one-line note: divide-by-zero yields 0.

- [ ] **Step 4: Write ga4-setup.md**

A checklist: create GA4 property, install via GTM, define custom events, mark `lead_created`, `demo_requested`, `purchase` as conversions/key events, configure UTM conventions, set up channel grouping, and connect to the dashboard export. Keep it practical and short.

- [ ] **Step 5: Commit**

```bash
git add docs/analytics
git commit -m "docs: analytics tracking plan, dataLayer schema, and metric definitions"
```

---

### Task 15: README, deploy workflow, and final verification

**Files:**
- Create: `README.md`, `.github/workflows/deploy.yml`
- Modify: `progress.md`

**Interfaces:** none.

- [ ] **Step 1: Write the GitHub Actions deploy workflow**

`.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm test
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Write README.md**

Include: title and one-line pitch, a "What this demonstrates" section (marketing ops thinking, full-funnel analytics, interactive data engineering, tracking-plan design), a screenshot placeholder (`docs/screenshot.png`), a live-link line, local run steps (`npm install`, `npm run gen:data`, `npm run dev`, `npm test`), a link to `docs/analytics/`, and a "Data is simulated" note. No em-dashes.

- [ ] **Step 3: Full verification pass**

Run: `npm test` (all suites pass).
Run: `npm run build` (builds with no errors).
Run: `npm run preview`, open the served URL, confirm: KPIs glow and count up on filter change, presets and channel chips recompute everything, funnel and charts update, table sorts, no console errors, and it degrades cleanly on a narrow (mobile) width. Take `docs/screenshot.png`.

- [ ] **Step 4: Update progress.md**

Append a dated entry summarizing the implementation and the live link.

- [ ] **Step 5: Commit**

```bash
git add README.md .github/workflows/deploy.yml progress.md docs/screenshot.png
git commit -m "chore: README, Pages deploy workflow, and final verification"
```

---

## Self-Review

**Spec coverage:** Every spec section maps to a task. Purpose/success criteria (Tasks 6-13 interactivity, Task 15 verification), data model (Task 2), data service (Task 4), layout (Tasks 6-13), component architecture (Tasks 3-13), analytics tracking plan (Task 14), aesthetic (Task 5 tokens applied throughout), testing (Tasks 2-12), deploy/repo (Task 15), out-of-scope respected (no backend, routing, or store anywhere).

**Placeholder scan:** No TBD/TODO. Component stubs in Task 6 are explicitly temporary and each is replaced by a named later task. Doc tasks specify exact content (events, formulas), not "write docs."

**Type consistency:** Row fields, `CHANNELS`, `KPI_DEFS` (with `key`, `format`, `betterWhenLower`, `seriesMetric`, `neutral`), and the function signatures in `metrics.js` are used consistently across App and components. `formatValue(value, format)` and `pctChange(current, previous)` signatures match every call site.
