import React from 'react'

export default function LandingPage({ onOpenDashboard, onOpenDocs }) {
  const Icons = {
    TrendingUp: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>,
    Lightning: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>,
    Shield: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>,
    Database: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>,
    BarChart: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>,
    Cpu: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
  }

  return (
    <div className="fade-in" style={{ paddingBottom: '64px', width: '100vw', marginLeft: 'calc(-50vw + 50%)', overflowX: 'hidden' }}>
      {/* ── Hero Section ── */}
      <section style={{ 
        position: 'relative', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '140px 24px',
        textAlign: 'center'
      }}>
        {/* Decorative Grid Glows */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '800px', height: '800px',
          background: 'radial-gradient(circle, rgba(0,200,255,0.06) 0%, transparent 60%)',
          pointerEvents: 'none', zIndex: 0
        }} />

        {/* Concentric circles */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '600px', height: '600px', border: '1px solid rgba(0,200,255,0.04)', borderRadius: '50%', zIndex: 0
        }} />
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '900px', height: '900px', border: '1px solid rgba(0,200,255,0.03)', borderRadius: '50%', zIndex: 0
        }} />

        <div style={{ zIndex: 1, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Tag Pill */}
          <div style={{ 
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '8px 20px', background: 'rgba(0,200,255,0.05)',
            border: '1px solid rgba(0,200,255,0.15)', borderRadius: '999px',
            marginBottom: '40px'
          }}>
            <div className="pulse-dot" style={{ width: '6px', height: '6px' }} />
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
              PREDICTIVE ANALYTICS ENGINE · <span style={{ color: 'var(--cyan)' }}>LIVE</span>
            </span>
          </div>

          {/* Title */}
          <h1 style={{ 
            fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(64px, 10vw, 110px)', 
            letterSpacing: '-0.02em', margin: '0 0 32px 0', lineHeight: 1, textShadow: '0 0 40px rgba(0,200,255,0.1)'
          }}>
            BDC<span style={{ color: 'var(--cyan)' }}>-</span>NEXUS
          </h1>

          {/* Subtitle */}
          <p style={{ 
            fontFamily: 'Outfit, sans-serif', fontSize: '20px', color: 'var(--text-muted)', 
            maxWidth: '680px', margin: '0 auto 64px auto', lineHeight: 1.6
          }}>
            SAP Business Data Cloud regression engine that transforms raw transaction data into <span style={{ color: 'var(--cyan)', fontWeight: 500 }}>actionable forecasts</span>.
          </p>

          {/* Metrics */}
          <div className="stagger" style={{ display: 'flex', gap: 'clamp(32px, 8vw, 80px)', justifyContent: 'center', marginBottom: '64px' }}>
            <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '40px', color: 'var(--text-primary)', fontWeight: 400 }}>99.7<span style={{ color: 'var(--text-muted)' }}>%</span></span>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--text-dim)', letterSpacing: '0.15em' }}>UPTIME</span>
            </div>
            <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '40px', color: 'var(--text-primary)', fontWeight: 400 }}>&lt;50<span style={{ color: 'var(--text-muted)' }}>ms</span></span>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--text-dim)', letterSpacing: '0.15em' }}>LATENCY</span>
            </div>
            <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '40px', color: 'var(--text-primary)', fontWeight: 400 }}>10M<span style={{ color: 'var(--text-muted)' }}>+</span></span>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--text-dim)', letterSpacing: '0.15em' }}>PREDICTIONS/DAY</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
            <button onClick={onOpenDashboard} style={{ 
              background: 'var(--cyan)', color: '#060B18', 
              padding: '16px 36px', borderRadius: '8px', 
              fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '14px',
              border: 'none', cursor: 'pointer',
              boxShadow: '0 0 32px rgba(0,200,255,0.4)',
              transition: 'all 0.2s', letterSpacing: '0.04em'
            }}
            onMouseOver={(e) => Object.assign(e.currentTarget.style, { boxShadow: '0 0 40px rgba(0,200,255,0.6)', transform: 'translateY(-1px)' })}
            onMouseOut={(e) => Object.assign(e.currentTarget.style, { boxShadow: '0 0 32px rgba(0,200,255,0.4)', transform: 'translateY(0)' })}
            >
              OPEN DASHBOARD
            </button>
            <button
              onClick={onOpenDocs}
              style={{
              background: 'transparent', color: 'var(--cyan)',
              padding: '16px 36px', borderRadius: '8px',
              fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '14px',
              border: '1px solid rgba(0,200,255,0.2)', cursor: 'pointer',
              transition: 'all 0.2s', letterSpacing: '0.04em'
            }}
            onMouseOver={(e) => Object.assign(e.currentTarget.style, { background: 'rgba(0,200,255,0.05)', borderColor: 'rgba(0,200,255,0.4)' })}
            onMouseOut={(e) => Object.assign(e.currentTarget.style, { background: 'transparent', borderColor: 'rgba(0,200,255,0.2)' })}
            >
              VIEW DOCUMENTATION
            </button>
          </div>
        </div>
      </section>

      {/* ── Capabilities Ribbon ── */}
      <div style={{ 
        borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', 
        padding: '32px 24px', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 'clamp(40px, 8vw, 120px)',
        background: 'rgba(0,200,255,0.015)', backdropFilter: 'blur(4px)'
      }}>
        {[
          { label: 'ACTIVE MODELS', val: '24', color: 'var(--cyan)' },
          { label: 'DATA SOURCES', val: '128', color: 'var(--cyan)' },
          { label: 'AVG. R²', val: '0.94', color: 'var(--cyan)' },
          { label: 'UPTIME', val: '99.97%', color: 'var(--cyan)' },
        ].map((stat, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '28px', fontWeight: 700, color: stat.color }}>{stat.val}</span>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>{stat.label}</span>
          </div>
        ))}
      </div>

      {/* ── Capabilities Grid ── */}
      <section style={{ padding: '100px 24px', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: 'var(--cyan)', letterSpacing: '0.15em', marginBottom: '16px', textTransform: 'uppercase' }}>
          CAPABILITIES
        </p>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '48px', marginBottom: '20px', color: 'var(--text-primary)' }}>
          Built for Scale
        </h2>
        <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '18px', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 80px auto', lineHeight: 1.6 }}>
          Every component engineered for enterprise workloads and real-time decision making.
        </p>

        <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', textAlign: 'left' }}>
          {[
            { icon: <Icons.TrendingUp />, title: 'OLS Regression', desc: 'Ordinary Least Squares engine with real-time coefficient updates and confidence intervals.' },
            { icon: <Icons.Lightning />, title: 'Real-Time Ingest', desc: 'Sub-50ms transaction ingestion pipeline with automatic validation and normalization.' },
            { icon: <Icons.Shield />, title: 'Enterprise Grade', desc: 'SOC 2 compliant infrastructure with end-to-end encryption and audit logging.' },
            { icon: <Icons.Database />, title: 'SAP Integration', desc: 'Native BDC connector with bi-directional sync and schema auto-discovery.' },
            { icon: <Icons.BarChart />, title: 'Live Dashboards', desc: 'Interactive visualizations with drill-down analytics and exportable reports.' },
            { icon: <Icons.Cpu />, title: 'Edge Compute', desc: 'Distributed prediction nodes deployed at the edge for minimal latency.' },
          ].map((item, idx) => (
            <div key={idx} className="card fade-in" style={{ padding: '36px', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ 
                width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0,200,255,0.08)', border: '1px solid rgba(0,200,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cyan)', marginBottom: '24px'
              }}>
                {item.icon}
              </div>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '20px', marginBottom: '16px', color: 'var(--text-primary)' }}>{item.title}</h3>
              <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.6, flex: 1 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
