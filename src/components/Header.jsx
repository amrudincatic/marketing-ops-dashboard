import FilterBar from './FilterBar.jsx'
import './Header.css'

export default function Header({ generatedAt, filters, bounds, onChange }) {
  const synced = new Date(generatedAt).toISOString().slice(0, 16).replace('T', ' ')
  return (
    <header className="header panel scanlines">
      <div className="header__brand">
        <span className="header__wordmark">SIGNAL</span>
        <span className="header__sub">// MARKETING OPS</span>
      </div>
      <FilterBar filters={filters} bounds={bounds} onChange={onChange} />
      <div className="header__sync" aria-label="Last synced">
        <span className="header__dot" /> SYNCED {synced} UTC
      </div>
    </header>
  )
}
