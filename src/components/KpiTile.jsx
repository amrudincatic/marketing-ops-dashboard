import { useEffect, useRef, useState } from 'react'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { formatValue, formatPct } from '../data/format.js'
import { pctChange } from '../data/metrics.js'

function useCountUp(target) {
  const [value, setValue] = useState(target)
  const from = useRef(target)
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) { setValue(target); return }
    const start = performance.now()
    const dur = 500
    const a = from.current
    let raf
    const tick = (t) => {
      const p = Math.min(1, (t - start) / dur)
      setValue(a + (target - a) * (1 - Math.pow(1 - p, 3)))
      if (p < 1) raf = requestAnimationFrame(tick)
      else from.current = target
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target])
  return value
}

export default function KpiTile({ def, value, prevValue, series }) {
  const shown = useCountUp(value)
  const change = pctChange(value, prevValue)
  const improved = def.betterWhenLower ? change < 0 : change > 0
  const deltaClass = def.neutral ? 'kpi__delta--neutral' : improved ? 'kpi__delta--good' : 'kpi__delta--bad'
  const data = series.map((v, i) => ({ i, v }))
  return (
    <div className="kpi panel scanlines">
      <div className="kpi__label">{def.label}</div>
      <div className="kpi__value glow-text">{formatValue(shown, def.format)}</div>
      {!def.neutral && (
        <div className={'kpi__delta ' + deltaClass}>{formatPct(change)} vs prev</div>
      )}
      {def.neutral && <div className="kpi__delta kpi__delta--neutral">{formatPct(change)} vs prev</div>}
      <div className="kpi__spark">
        <ResponsiveContainer width="100%" height={34}>
          <LineChart data={data}>
            <Line type="monotone" dataKey="v" stroke="var(--cyan)" strokeWidth={1.5} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
