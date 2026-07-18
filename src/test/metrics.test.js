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
