import { render, screen, fireEvent } from '@testing-library/react'
import Header from '../components/Header.jsx'
import { formatValue, formatPct } from '../data/format.js'
import KpiTile from '../components/KpiTile.jsx'
import Funnel from '../components/Funnel.jsx'
import DataTable from '../components/DataTable.jsx'

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

test('formatValue formats by type', () => {
  expect(formatValue(1234.6, 'currency')).toBe('$1,235')
  expect(formatValue(3.456, 'x')).toBe('3.46x')
  expect(formatValue(0.1234, 'pct')).toBe('12.3%')
})

test('formatPct signs positive change', () => {
  expect(formatPct(0.25)).toBe('+25.0%')
  expect(formatPct(-0.1)).toBe('-10.0%')
})

const spark = [1, 2, 3]

test('KpiTile marks a lower-is-better metric good when its value drops', () => {
  const def = { key: 'cpl', label: 'CPL', format: 'currency', betterWhenLower: true, seriesMetric: 'cpl' }
  const { container } = render(<KpiTile def={def} value={80} prevValue={100} series={spark} />)
  expect(container.querySelector('.kpi__delta--good')).toBeInTheDocument()
  expect(container.querySelector('.kpi__delta--bad')).toBeNull()
})

test('KpiTile marks a lower-is-better metric bad when its value rises', () => {
  const def = { key: 'cpl', label: 'CPL', format: 'currency', betterWhenLower: true, seriesMetric: 'cpl' }
  const { container } = render(<KpiTile def={def} value={120} prevValue={100} series={spark} />)
  expect(container.querySelector('.kpi__delta--bad')).toBeInTheDocument()
})

test('KpiTile renders a neutral delta for a neutral metric', () => {
  const def = { key: 'spend', label: 'Spend', format: 'currency', betterWhenLower: false, seriesMetric: 'spend', neutral: true }
  const { container } = render(<KpiTile def={def} value={120} prevValue={100} series={spark} />)
  expect(container.querySelector('.kpi__delta--neutral')).toBeInTheDocument()
  expect(container.querySelector('.kpi__delta--good')).toBeNull()
})

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

test('DataTable renders a row per channel', () => {
  const channelRows = [
    { channel: 'Google Ads', spend: 100, leads: 10, cpl: 10, roas: 4, revenue: 400 },
    { channel: 'Email', spend: 10, leads: 5, cpl: 2, roas: 6, revenue: 60 },
  ]
  render(<DataTable channelRows={channelRows} />)
  expect(screen.getByText('Google Ads')).toBeInTheDocument()
  expect(screen.getByText('Email')).toBeInTheDocument()
})
