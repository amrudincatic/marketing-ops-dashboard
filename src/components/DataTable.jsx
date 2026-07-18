import { useState } from 'react'
import './DataTable.css'
import { formatValue } from '../data/format.js'
import { CHANNEL_COLORS } from '../data/constants.js'

const COLS = [
  { key: 'channel', label: 'Channel', format: null },
  { key: 'spend', label: 'Spend', format: 'currency' },
  { key: 'leads', label: 'Leads', format: 'number' },
  { key: 'cpl', label: 'CPL', format: 'currency' },
  { key: 'roas', label: 'ROAS', format: 'x' },
  { key: 'revenue', label: 'Revenue', format: 'currency' },
]

export default function DataTable({ channelRows }) {
  const [sort, setSort] = useState({ key: 'spend', dir: -1 })
  const rows = [...channelRows].sort((a, b) => {
    if (sort.key === 'channel') return a.channel.localeCompare(b.channel) * sort.dir
    return (a[sort.key] - b[sort.key]) * sort.dir
  })
  const onSort = (key) => setSort((s) => (s.key === key ? { key, dir: -s.dir } : { key, dir: -1 }))
  return (
    <section className="panel">
      <h2 className="panel__title">Channel breakdown</h2>
      <table className="dtable">
        <thead>
          <tr>
            {COLS.map((c) => (
              <th key={c.key} onClick={() => onSort(c.key)} className={sort.key === c.key ? 'is-sorted' : ''}>
                {c.label}{sort.key === c.key ? (sort.dir === -1 ? ' v' : ' ^') : ''}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.channel}>
              {COLS.map((c) => (
                <td key={c.key}>
                  {c.key === 'channel' ? (
                    <span><span className="dtable__dot" style={{ background: CHANNEL_COLORS[r.channel] }} />{r.channel}</span>
                  ) : formatValue(r[c.key], c.format)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
