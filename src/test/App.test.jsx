import { render, screen } from '@testing-library/react'
import App from '../App.jsx'

test('App renders KPI labels after data loads', async () => {
  render(<App />)
  expect(await screen.findByText(/Spend/i, {}, { timeout: 2000 })).toBeInTheDocument()
})
