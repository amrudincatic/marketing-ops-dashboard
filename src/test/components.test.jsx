import { render, screen, fireEvent } from '@testing-library/react'
import Header from '../components/Header.jsx'
import { formatValue, formatPct } from '../data/format.js'

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
