import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import './TrendChart.css'

const METRICS = [
  { key: 'spend', label: 'Spend' },
  { key: 'revenue', label: 'Revenue' },
  { key: 'leads', label: 'Leads' },
]

export default function TrendChart({ series, metric, onMetric }) {
  return (
    <section className="panel">
      <div className="trend__head">
        <h2 className="panel__title">Trend</h2>
        <div className="trend__toggle" role="group" aria-label="Trend metric">
          {METRICS.map((m) => (
            <button key={m.key} className={'chip' + (m.key === metric ? ' chip--on' : '')} onClick={() => onMetric(m.key)}>{m.label}</button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={series} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--magenta)" stopOpacity={0.5} />
              <stop offset="100%" stopColor="var(--magenta)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--grid)" vertical={false} />
          <XAxis dataKey="date" tick={{ fill: 'var(--muted)', fontSize: 10, fontFamily: 'var(--font-mono)' }} tickFormatter={(d) => d.slice(5)} minTickGap={28} />
          <YAxis tick={{ fill: 'var(--muted)', fontSize: 10, fontFamily: 'var(--font-mono)' }} width={44} />
          <Tooltip contentStyle={{ background: 'var(--panel)', border: '1px solid var(--grid)', fontFamily: 'var(--font-mono)', fontSize: 12 }} labelStyle={{ color: 'var(--muted)' }} />
          <Area type="monotone" dataKey="value" stroke="var(--magenta)" strokeWidth={2} fill="url(#trendFill)" isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </section>
  )
}
