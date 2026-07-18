import './Funnel.css'
import { formatValue } from '../data/format.js'

export default function Funnel({ funnel }) {
  return (
    <section className="panel">
      <h2 className="panel__title">Funnel</h2>
      <div className="funnel">
        {funnel.map((s) => (
          <div className="funnel__row" key={s.stage}>
            <span className="funnel__stage">{s.stage}</span>
            <div className="funnel__bar-track">
              <div className="funnel__bar" style={{ width: Math.max(4, s.pctOfTop * 100) + '%' }} />
            </div>
            <span className="funnel__count">{formatValue(s.count, 'number')}</span>
            <span className="funnel__rate">{(s.stepRate * 100).toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </section>
  )
}
