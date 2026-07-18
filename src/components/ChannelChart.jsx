import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts'
import { CHANNEL_COLORS } from '../data/constants.js'

export default function ChannelChart({ channelRows }) {
  const data = channelRows.map((c) => ({ channel: c.channel, roas: Number(c.roas.toFixed(2)) }))
  return (
    <section className="panel">
      <h2 className="panel__title">ROAS by channel</h2>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="var(--grid)" vertical={false} />
          <XAxis dataKey="channel" tick={{ fill: 'var(--muted)', fontSize: 9, fontFamily: 'var(--font-mono)' }} interval={0} />
          <YAxis tick={{ fill: 'var(--muted)', fontSize: 10, fontFamily: 'var(--font-mono)' }} width={30} />
          <Tooltip cursor={{ fill: 'rgba(255,255,255,0.04)' }} contentStyle={{ background: 'var(--panel)', border: '1px solid var(--grid)', fontFamily: 'var(--font-mono)', fontSize: 12 }} />
          <Bar dataKey="roas" radius={[4, 4, 0, 0]} isAnimationActive={false}>
            {data.map((d) => (<Cell key={d.channel} fill={CHANNEL_COLORS[d.channel]} />))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </section>
  )
}
