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
    else if (metric === 'cac') value = safeDiv(t.spend, t.customers)
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
