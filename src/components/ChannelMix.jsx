import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { CHANNEL_COLORS } from '../data/constants.js'

export default function ChannelMix({ channelRows }) {
  const data = channelRows.map((c) => ({ name: c.channel, value: c.spend }))
  return (
    <section className="panel">
      <h2 className="panel__title">Spend mix</h2>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2} stroke="var(--void)">
            {data.map((d) => (<Cell key={d.name} fill={CHANNEL_COLORS[d.name]} />))}
          </Pie>
          <Tooltip contentStyle={{ background: 'var(--panel)', border: '1px solid var(--grid)', fontFamily: 'var(--font-mono)', fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </section>
  )
}
