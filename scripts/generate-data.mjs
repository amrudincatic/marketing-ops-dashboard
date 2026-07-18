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
