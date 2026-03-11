import { useState } from 'react'
import Dashboard from './components/Dashboard.jsx'
import TransactionForm from './components/TransactionForm.jsx'
import LandingPage from './components/LandingPage.jsx'
import ApiDocs from './components/ApiDocs.jsx'

const TABS = [
  { id: 'dashboard', label: 'Analytics', icon: '⬡' },
  { id: 'ingest',    label: 'Ingest',    icon: '⊕' },
  { id: 'docs',      label: 'API Docs',  icon: '</>' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('landing')
  const [refreshKey, setRefreshKey] = useState(0)

  const handleTransactionSuccess = () => {
    setRefreshKey((k) => k + 1)
    setActiveTab('dashboard')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* ── Shell Header ── */}
      <header style={{
        background: 'var(--shell-bg)',
        borderBottom: '1px solid var(--border)',
        padding: '0 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '56px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(12px)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '32px', height: '32px',
            background: 'linear-gradient(135deg, var(--cyan), #0066AA)',
            borderRadius: '6px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 12px rgba(0,200,255,0.4)',
            fontFamily: 'Syne, sans-serif',
            fontWeight: 800,
            fontSize: '13px',
            color: '#060B18',
            letterSpacing: '-0.5px',
          }}>BN</div>
          <div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '16px', letterSpacing: '0.02em', color: 'var(--text-primary)' }}>
              BDC<span style={{ color: 'var(--cyan)' }}>·</span>NEXUS
            </div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
              PREDICTIVE ANALYTICS
            </div>
          </div>
        </div>

        {/* Nav tabs */}
        {activeTab !== 'landing' && (
          <nav style={{ display: 'flex', gap: '4px' }}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? 'rgba(0,200,255,0.1)' : 'transparent',
                border: activeTab === tab.id ? '1px solid var(--border-bright)' : '1px solid transparent',
                borderRadius: '6px',
                padding: '6px 16px',
                color: activeTab === tab.id ? 'var(--cyan)' : 'var(--text-muted)',
                fontFamily: 'Syne, sans-serif',
                fontWeight: 600,
                fontSize: '13px',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ fontSize: '14px' }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
          </nav>
        )}

        {/* Status indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="pulse-dot" />
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--text-muted)' }}>
            LIVE · v1.0.0
          </span>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main style={{
        flex: 1,
        padding: activeTab === 'landing' || activeTab === 'docs' ? '0' : '32px',
        maxWidth: activeTab === 'landing' || activeTab === 'docs' ? 'none' : '1400px',
        width: '100%',
        margin: '0 auto'
      }}>
        {activeTab === 'landing'   && <LandingPage onOpenDashboard={() => setActiveTab('dashboard')} onOpenDocs={() => setActiveTab('docs')} />}
        {activeTab === 'dashboard' && <Dashboard key={refreshKey} />}
        {activeTab === 'ingest'    && <TransactionForm onSuccess={handleTransactionSuccess} />}
        {activeTab === 'docs'      && <ApiDocs />}
      </main>

      {/* ── Footer ── */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '16px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--text-dim)' }}>
          BDC·NEXUS — SAP BUSINESS DATA CLOUD
        </span>
        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--text-dim)' }}>
          OLS REGRESSION ENGINE
        </span>
      </footer>
    </div>
  )
}
