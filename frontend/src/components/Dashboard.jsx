import { useEffect, useState, useCallback } from 'react'
import RevenueChart from './RevenueChart'
import ForecastPanel from './ForecastPanel'
import { fetchRevenueByRegion, fetchForecast, fetchTransactions } from '../api/transactionApi'

export default function Dashboard() {
  const [regionData, setRegionData]   = useState([])
  const [forecast, setForecast]       = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)

  const loadData = useCallback(() => {
    setLoading(true)
    setError(null)
    Promise.all([fetchRevenueByRegion(), fetchForecast(), fetchTransactions()])
      .then(([regions, forecastData, txList]) => {
        const chartData = Object.entries(regions)
          .map(([region, revenue]) => ({ region, revenue: Number(revenue) }))
          .sort((a, b) => b.revenue - a.revenue)
        setRegionData(chartData)
        setForecast(forecastData)
        setTransactions(txList)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const totalRevenue = regionData.reduce((sum, d) => sum + d.revenue, 0)
  const topRegion    = regionData[0]?.region ?? '—'
  const txCount      = transactions.length

  const fmt = (v) => new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1
  }).format(v)

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: '16px' }}>
      <div style={{
        width: '40px', height: '40px',
        border: '2px solid var(--border)',
        borderTop: '2px solid var(--cyan)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
        LOADING ANALYTICS...
      </span>
    </div>
  )

  if (error) return (
    <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', padding: '32px', textAlign: 'center' }}>
      <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: 700, color: '#EF4444', marginBottom: '8px' }}>SYSTEM ERROR</div>
      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px' }}>{error}</div>
      <button onClick={loadData} style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', color: '#EF4444', borderRadius: '6px', padding: '8px 20px', cursor: 'pointer', fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '13px' }}>
        RETRY
      </button>
    </div>
  )

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* ── Section label ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--cyan)', letterSpacing: '0.15em' }}>
          01 / OVERVIEW
        </span>
        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
      </div>

      {/* ── KPI Cards ── */}
      <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <KpiCard
          label="Total Revenue"
          value={fmt(totalRevenue)}
          sub="All regions combined"
          accent="var(--cyan)"
          icon="◈"
        />
        <KpiCard
          label="Transactions"
          value={txCount.toLocaleString()}
          sub="Total records ingested"
          accent="var(--indigo)"
          icon="◉"
        />
        <KpiCard
          label="Top Region"
          value={topRegion}
          sub={`${regionData[0] ? fmt(regionData[0].revenue) : '—'} revenue`}
          accent="var(--amber)"
          icon="◎"
        />
      </div>

      {/* ── Section label ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--cyan)', letterSpacing: '0.15em' }}>
          02 / ANALYTICS
        </span>
        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
      </div>

      {/* ── Chart + Forecast ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '16px' }}>

        {/* Revenue Chart */}
        <div className="card" style={{ padding: '28px', position: 'relative', overflow: 'hidden' }}>
          <div className="accent-line" />
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '18px', color: 'var(--text-primary)' }}>
                Revenue by Region
              </div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', letterSpacing: '0.08em' }}>
                HISTORICAL ACTUALS
              </div>
            </div>
            <span style={{
              fontFamily: 'DM Mono, monospace', fontSize: '10px',
              color: 'var(--cyan)', background: 'var(--cyan-dim)',
              border: '1px solid var(--border-bright)',
              borderRadius: '4px', padding: '4px 10px', letterSpacing: '0.08em'
            }}>
              {regionData.length} REGIONS
            </span>
          </div>
          {regionData.length > 0
            ? <RevenueChart data={regionData} />
            : <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '48px 0', fontFamily: 'DM Mono, monospace', fontSize: '12px' }}>NO DATA AVAILABLE</div>
          }
        </div>

        {/* Forecast Panel */}
        <div className="card" style={{ padding: '28px', position: 'relative', overflow: 'hidden' }}>
          <div className="accent-line" style={{ background: 'linear-gradient(90deg, transparent, var(--indigo), transparent)' }} />
          <ForecastPanel forecast={forecast} loading={false} />
        </div>
      </div>

      {/* ── Section label ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--cyan)', letterSpacing: '0.15em' }}>
          03 / TRANSACTIONS
        </span>
        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        {transactions.length > 10 && (
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--text-muted)' }}>
            SHOWING 10 / {transactions.length}
          </span>
        )}
      </div>

      {/* ── Transaction Table ── */}
      <div className="card" style={{ overflow: 'hidden', position: 'relative' }}>
        <div className="accent-line" style={{ background: 'linear-gradient(90deg, transparent, var(--amber), transparent)' }} />
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={{ textAlign: 'left', padding: '16px 20px' }}>ID</th>
                <th style={{ textAlign: 'left', padding: '16px 20px' }}>Date</th>
                <th style={{ textAlign: 'left', padding: '16px 20px' }}>Revenue</th>
                <th style={{ textAlign: 'left', padding: '16px 20px' }}>Segment</th>
                <th style={{ textAlign: 'left', padding: '16px 20px' }}>Region</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 10).map((tx) => (
                <tr key={tx.id} style={{ transition: 'background 0.15s' }}>
                  <td style={{ padding: '12px 20px', fontFamily: 'DM Mono, monospace', fontSize: '12px', color: 'var(--text-muted)' }}>
                    #{String(tx.id).padStart(4, '0')}
                  </td>
                  <td style={{ padding: '12px 20px', fontFamily: 'DM Mono, monospace', fontSize: '12px', color: 'var(--text-primary)' }}>
                    {tx.transactionDate}
                  </td>
                  <td style={{ padding: '12px 20px', fontFamily: 'DM Mono, monospace', fontSize: '13px', fontWeight: 500, color: 'var(--cyan)' }}>
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(tx.revenue)}
                  </td>
                  <td style={{ padding: '12px 20px' }}>
                    <SegmentBadge segment={tx.customerSegment} />
                  </td>
                  <td style={{ padding: '12px 20px', fontSize: '13px', color: 'var(--text-primary)' }}>
                    {tx.region}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}

function KpiCard({ label, value, sub, accent, icon }) {
  return (
    <div className="card fade-in" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
      {/* Glow blob */}
      <div style={{
        position: 'absolute', top: '-20px', right: '-20px',
        width: '80px', height: '80px',
        background: accent,
        borderRadius: '50%',
        opacity: 0.06,
        filter: 'blur(20px)',
        pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          {label}
        </span>
        <span style={{ fontSize: '18px', color: accent, opacity: 0.8 }}>{icon}</span>
      </div>

      <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '28px', color: accent, lineHeight: 1, marginBottom: '8px' }}>
        {value}
      </div>

      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--text-muted)' }}>
        {sub}
      </div>
    </div>
  )
}

function SegmentBadge({ segment }) {
  const styles = {
    Enterprise:   { color: '#60A5FA', background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.25)' },
    'Mid-Market': { color: '#A78BFA', background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.25)' },
    SMB:          { color: '#34D399', background: 'rgba(52,211,153,0.1)',  border: '1px solid rgba(52,211,153,0.25)'  }
  }
  const s = styles[segment] || { color: 'var(--text-muted)', background: 'var(--cyan-dim)', border: '1px solid var(--border)' }
  return (
    <span className="badge" style={s}>{segment}</span>
  )
}
