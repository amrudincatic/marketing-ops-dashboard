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
