import { useEffect, useMemo, useState } from 'react'
import { getMarketingData } from './data/dataService.js'
import {
  dateBounds, filterRows, sumMetrics, deriveKpis, buildFunnel,
  byChannel, dailySeries, previousRange,
} from './data/metrics.js'
import Header from './components/Header.jsx'
import KpiRow from './components/KpiRow.jsx'
import Funnel from './components/Funnel.jsx'
import TrendChart from './components/TrendChart.jsx'
import ChannelChart from './components/ChannelChart.jsx'
import ChannelMix from './components/ChannelMix.jsx'
import DataTable from './components/DataTable.jsx'
import Footer from './components/Footer.jsx'
import { KPI_DEFS } from './data/constants.js'

const DEFAULT_WINDOW = 30

export default function App() {
  const [data, setData] = useState(null)
  const [filters, setFilters] = useState(null)
  const [metric, setMetric] = useState('spend')

  useEffect(() => {
    getMarketingData().then((d) => {
      setData(d)
      const b = dateBounds(d.rows)
      const start = new Date(b.max + 'T00:00:00Z')
      start.setUTCDate(start.getUTCDate() - (DEFAULT_WINDOW - 1))
      setFilters({ start: start.toISOString().slice(0, 10), end: b.max, channels: [] })
    })
  }, [])

  const view = useMemo(() => {
    if (!data || !filters) return null
    const rows = filterRows(data.rows, filters)
    const prev = filterRows(data.rows, { ...previousRange(filters), channels: filters.channels })
    const kpis = deriveKpis(sumMetrics(rows))
    const prevKpis = deriveKpis(sumMetrics(prev))
    const series = Object.fromEntries(
      KPI_DEFS.map((d) => [d.key, dailySeries(rows, d.seriesMetric).map((p) => p.value)]),
    )
    return {
      kpis, prevKpis, series,
      funnel: buildFunnel(sumMetrics(rows)),
      channelRows: byChannel(rows),
      trend: dailySeries(rows, metric),
    }
  }, [data, filters, metric])

  if (!data || !filters || !view) {
    return <main className="app" data-testid="app-root"><p className="panel__title">Syncing signal...</p></main>
  }

  return (
    <main className="app" data-testid="app-root">
      <Header
        generatedAt={data.generatedAt}
        filters={filters}
        bounds={dateBounds(data.rows)}
        onChange={setFilters}
      />
      <KpiRow kpis={view.kpis} prevKpis={view.prevKpis} series={view.series} />
      <div className="grid-2">
        <Funnel funnel={view.funnel} />
        <TrendChart series={view.trend} metric={metric} onMetric={setMetric} />
      </div>
      <div className="grid-2">
        <ChannelChart channelRows={view.channelRows} />
        <ChannelMix channelRows={view.channelRows} />
      </div>
      <DataTable channelRows={view.channelRows} />
      <Footer />
    </main>
  )
}
