import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, LabelList
} from 'recharts'

const REGION_COLORS = {
  'North America': '#00C8FF',
  'Europe':        '#6366F1',
  'Asia Pacific':  '#10B981',
  'Latin America': '#F59E0B',
}
const FALLBACK = ['#00C8FF', '#6366F1', '#10B981', '#F59E0B']

const compact = (v) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1
  }).format(v)

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  const color = REGION_COLORS[label] || FALLBACK[0]
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: `1px solid ${color}40`,
      borderRadius: '8px',
      padding: '12px 16px',
      boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 16px ${color}20`,
    }}>
      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px', letterSpacing: '0.08em' }}>
        {label.toUpperCase()}
      </div>
      <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '20px', color }}>
        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(payload[0].value)}
      </div>
    </div>
  )
}

export default function RevenueChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 16, left: 16, bottom: 60 }} barCategoryGap="35%">
        <CartesianGrid
          strokeDasharray="0"
          stroke="rgba(0,200,255,0.06)"
          vertical={false}
        />
        <XAxis
          dataKey="region"
          tick={{ fontSize: 11, fill: '#4E6480', fontFamily: 'DM Mono, monospace', letterSpacing: '0.04em' }}
          angle={-20}
          textAnchor="end"
          interval={0}
          tickLine={false}
          axisLine={{ stroke: 'rgba(0,200,255,0.12)' }}
        />
        <YAxis
          tickFormatter={compact}
          tick={{ fontSize: 10, fill: '#4E6480', fontFamily: 'DM Mono, monospace' }}
          tickLine={false}
          axisLine={false}
          width={68}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,200,255,0.04)' }} />
        <Bar dataKey="revenue" radius={[6, 6, 0, 0]} maxBarSize={72}>
          {data.map((entry, i) => {
            const color = REGION_COLORS[entry.region] || FALLBACK[i % FALLBACK.length]
            return (
              <Cell
                key={`cell-${i}`}
                fill={`url(#grad-${i})`}
              />
            )
          })}
          <LabelList
            dataKey="revenue"
            position="top"
            formatter={compact}
            style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', fill: 'var(--text-muted)', fontWeight: 500 }}
          />
        </Bar>
        {/* Gradient defs */}
        <defs>
          {data.map((entry, i) => {
            const color = REGION_COLORS[entry.region] || FALLBACK[i % FALLBACK.length]
            return (
              <linearGradient key={i} id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor={color} stopOpacity={0.9} />
                <stop offset="100%" stopColor={color} stopOpacity={0.4} />
              </linearGradient>
            )
          })}
        </defs>
      </BarChart>
    </ResponsiveContainer>
  )
}
