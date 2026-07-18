import { render, screen } from '@testing-library/react'
import App from '../App.jsx'

test('App renders a root region', () => {
  render(<App />)
  expect(screen.getByTestId('app-root')).toBeInTheDocument()
})
