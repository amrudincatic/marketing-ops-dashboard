import { render, screen } from '@testing-library/react'
import App from '../App.jsx'

test('App renders KPI labels after data loads', async () => {
  render(<App />)
  const matches = await screen.findAllByText(/Spend/i, {}, { timeout: 2000 })
  expect(matches.length).toBeGreaterThan(0)
})
