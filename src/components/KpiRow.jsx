import KpiTile from './KpiTile.jsx'
import { KPI_DEFS } from '../data/constants.js'
import './KpiTile.css'

export default function KpiRow({ kpis, prevKpis, series }) {
  return (
    <section className="kpi-row">
      {KPI_DEFS.map((def) => (
        <KpiTile key={def.key} def={def} value={kpis[def.key]} prevValue={prevKpis[def.key]} series={series[def.key]} />
      ))}
    </section>
  )
}
