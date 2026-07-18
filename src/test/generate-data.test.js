import { generateDataset } from '../../scripts/generate-data.mjs'
import { CHANNELS } from '../data/constants.js'
import committed from '../data/mockData.json'

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

test('committed mockData.json matches a fresh generateDataset()', () => {
  expect(committed).toEqual(generateDataset())
})
