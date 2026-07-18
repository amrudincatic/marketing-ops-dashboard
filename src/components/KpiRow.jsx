import { KPI_DEFS } from '../data/constants.js'

// Stub for Wave 2: renders KPI labels so the app shows real data shape.
// The full KpiRow (sparklines, deltas, formatting) arrives in a later wave.
export default function KpiRow() {
  return (
    <section className="panel">
      <h2 className="panel__title">KpiRow</h2>
      {KPI_DEFS.map((def) => (
        <p key={def.key} className="panel__title">{def.label}</p>
      ))}
    </section>
  )
}
