export default function ForecastPanel({ forecast, loading }) {
  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {[75, 100, 50].map((w, i) => (
        <div key={i} style={{
          height: i === 1 ? '48px' : '16px',
          width: `${w}%`,
          background: 'var(--border)',
          borderRadius: '4px',
          animation: 'shimmerLoad 1.5s ease infinite',
        }} />
      ))}
      <style>{`@keyframes shimmerLoad { 0%,100%{opacity:0.4} 50%{opacity:0.8} }`}</style>
    </div>
  )

  if (!forecast) return (
    <div style={{ textAlign: 'center', padding: '32px 0' }}>
      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
        INSUFFICIENT DATA
      </div>
    </div>
  )

  const isUpward = forecast.trend === 'UPWARD'
  const trendColor = isUpward ? 'var(--green)' : 'var(--red)'
  const trendBg    = isUpward ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)'
  const trendBorder= isUpward ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'
  const trendArrow = isUpward ? '↑' : '↓'

  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0
  }).format(forecast.predictedRevenue)

  const slope = new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0, signDisplay: 'always'
  }).format(forecast.regressionSlope)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Header */}
      <div>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '18px', color: 'var(--text-primary)', marginBottom: '4px' }}>
          Next Month
        </div>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
          REVENUE FORECAST
        </div>
      </div>

      {/* Big number */}
      <div>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '8px' }}>
          PREDICTED
        </div>
        <div style={{
          fontFamily: 'Syne, sans-serif',
          fontWeight: 800,
          fontSize: '32px',
          color: 'var(--indigo)',
          lineHeight: 1,
          textShadow: '0 0 32px rgba(99,102,241,0.4)',
        }}>
          {formatted}
        </div>
      </div>

      {/* Trend badge */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        background: trendBg,
        border: `1px solid ${trendBorder}`,
        borderRadius: '6px',
        padding: '8px 14px',
        width: 'fit-content',
      }}>
        <span style={{ fontSize: '18px', color: trendColor, fontWeight: 700 }}>{trendArrow}</span>
        <div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: trendColor, letterSpacing: '0.1em', fontWeight: 500 }}>
            {forecast.trend} TREND
          </div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: trendColor, fontWeight: 500 }}>
            {slope} / mo
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--border)' }} />

      {/* Stats */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {[
          { label: 'DATA POINTS', value: `${forecast.dataPointsUsed} MONTHS` },
          { label: 'ALGORITHM',   value: 'OLS REGRESSION' },
        ].map(({ label, value }) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
              {label}
            </span>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--text-primary)', letterSpacing: '0.06em' }}>
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Fine print */}
      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'var(--text-muted)', lineHeight: 1.6, borderTop: '1px solid var(--border)', paddingTop: '16px', letterSpacing: '0.04em' }}>
        FORECAST GENERATED VIA ORDINARY LEAST SQUARES LINEAR REGRESSION ON AGGREGATED MONTHLY REVENUE.
      </div>
    </div>
  )
}
