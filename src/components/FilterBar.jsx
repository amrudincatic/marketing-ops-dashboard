import { CHANNELS } from '../data/constants.js'

const PRESETS = [
  { label: '7D', days: 7 },
  { label: '30D', days: 30 },
  { label: '90D', days: 90 },
]

function shiftBack(endIso, days) {
  const d = new Date(endIso + 'T00:00:00Z')
  d.setUTCDate(d.getUTCDate() - (days - 1))
  return d.toISOString().slice(0, 10)
}

export default function FilterBar({ filters, bounds, onChange }) {
  const setPreset = (days) => onChange({ ...filters, start: shiftBack(bounds.max, days), end: bounds.max })
  const toggleChannel = (ch) => {
    const set = new Set(filters.channels)
    set.has(ch) ? set.delete(ch) : set.add(ch)
    onChange({ ...filters, channels: [...set] })
  }
  return (
    <div className="filterbar">
      <div className="filterbar__presets" role="group" aria-label="Date range">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            className={'chip' + (filters.start === shiftBack(bounds.max, p.days) ? ' chip--on' : '')}
            onClick={() => setPreset(p.days)}
          >{p.label}</button>
        ))}
      </div>
      <div className="filterbar__channels" role="group" aria-label="Channels">
        {CHANNELS.map((ch) => (
          <button
            key={ch}
            className={'chip' + (filters.channels.length === 0 || filters.channels.includes(ch) ? ' chip--on' : '')}
            onClick={() => toggleChannel(ch)}
          >{ch}</button>
        ))}
      </div>
    </div>
  )
}
