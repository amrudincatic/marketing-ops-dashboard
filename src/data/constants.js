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
