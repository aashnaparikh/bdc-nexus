import { useState, useEffect, useCallback, useRef } from 'react'

// ── Constants ────────────────────────────────────────────────────────────────

const BASE_URL = 'http://localhost:8080'

const METHOD_META = {
  get:    { color: '#818CF8', bg: '#6366F1', tint: 'rgba(99,102,241,0.1)',   glow: 'rgba(99,102,241,0.4)'  },
  post:   { color: '#34D399', bg: '#10B981', tint: 'rgba(16,185,129,0.1)',   glow: 'rgba(16,185,129,0.4)'  },
  put:    { color: '#FCD34D', bg: '#F59E0B', tint: 'rgba(245,158,11,0.1)',   glow: 'rgba(245,158,11,0.4)'  },
  delete: { color: '#F87171', bg: '#EF4444', tint: 'rgba(239,68,68,0.1)',    glow: 'rgba(239,68,68,0.4)'   },
}

const GLOBAL_STYLES = `
  @keyframes spin    { to { transform: rotate(360deg); } }
  @keyframes fadeUp  { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:none; } }
  @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
  @keyframes pulse   { 0%,100% { opacity:1; } 50% { opacity:.4; } }
  @keyframes scanline {
    0%   { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }
  @keyframes ripple {
    0%   { transform: scale(0); opacity:.4; }
    100% { transform: scale(4); opacity:0; }
  }
  @keyframes slideIn { from { opacity:0; transform:translateX(-8px); } to { opacity:1; transform:none; } }
  @keyframes statusPop { 0% { transform:scale(.85); opacity:0; } 60% { transform:scale(1.1); } 100% { transform:scale(1); opacity:1; } }

  .ep-btn { transition: all .15s !important; }
  .ep-btn:hover { background: rgba(0,200,255,0.07) !important; }
  .ep-btn.active { background: rgba(0,200,255,0.1) !important; border-left-color: #00C8FF !important; }

  .param-input { transition: border-color .15s, box-shadow .15s; }
  .param-input:focus { border-color: rgba(0,200,255,.5) !important; box-shadow: 0 0 0 3px rgba(0,200,255,.08) !important; outline:none; }

  .exec-btn { position:relative; overflow:hidden; transition: all .2s !important; }
  .exec-btn:hover:not(:disabled) { transform: translateY(-1px) !important; box-shadow: 0 4px 20px rgba(0,200,255,.35) !important; }
  .exec-btn:active:not(:disabled) { transform: translateY(0) !important; }

  .ripple-el { position:absolute; border-radius:50%; background:rgba(255,255,255,.3); animation: ripple .5s linear; pointer-events:none; }

  .tab-btn { transition: all .15s !important; }
  .tab-btn:hover { color: #E2EAF4 !important; }

  .history-item { transition: all .12s !important; }
  .history-item:hover { background: rgba(0,200,255,0.05) !important; }

  .copy-btn { transition: all .15s !important; }
  .copy-btn:hover { background: rgba(0,200,255,0.12) !important; border-color: rgba(0,200,255,.4) !important; }

  .endpoint-card { transition: all .18s !important; }
  .endpoint-card:hover { transform: translateX(2px); }
`

// ── Small helpers ────────────────────────────────────────────────────────────

function MethodBadge({ method, size = 'sm' }) {
  const m = METHOD_META[method] || METHOD_META.get
  const pad = size === 'lg' ? '4px 12px' : '2px 7px'
  const fs  = size === 'lg' ? '12px' : '10px'
  return (
    <span style={{
      background: m.bg, color: '#060B18',
      fontFamily: 'DM Mono, monospace', fontSize: fs, fontWeight: 700,
      padding: pad, borderRadius: '4px', textTransform: 'uppercase',
      letterSpacing: '0.06em', flexShrink: 0, display: 'inline-block',
    }}>
      {method}
    </span>
  )
}

function Toast({ msg, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 1400); return () => clearTimeout(t) }, [onDone])
  return (
    <div style={{
      position: 'fixed', bottom: '28px', right: '28px', zIndex: 9999,
      background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)',
      borderRadius: '8px', padding: '10px 18px',
      fontFamily: 'Syne, sans-serif', fontSize: '12px', fontWeight: 700,
      color: '#34D399', letterSpacing: '0.06em',
      animation: 'fadeUp .2s ease', backdropFilter: 'blur(12px)',
      boxShadow: '0 4px 24px rgba(16,185,129,0.2)',
    }}>
      ✓ {msg}
    </div>
  )
}

function CopyBtn({ text, label = 'COPY', onCopied }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      onCopied?.(`Copied ${label.toLowerCase()}`)
      setTimeout(() => setCopied(false), 1400)
    })
  }
  return (
    <button className="copy-btn" onClick={copy} style={{
      background: copied ? 'rgba(16,185,129,.15)' : 'rgba(0,200,255,.06)',
      border: `1px solid ${copied ? 'rgba(16,185,129,.5)' : 'rgba(0,200,255,.2)'}`,
      color: copied ? '#34D399' : '#00C8FF',
      fontFamily: 'Syne, sans-serif', fontSize: '10px', fontWeight: 700,
      padding: '4px 10px', borderRadius: '5px', cursor: 'pointer',
      letterSpacing: '0.06em',
    }}>
      {copied ? '✓ COPIED' : label}
    </button>
  )
}

function StatusBadge({ code }) {
  const ok  = String(code).startsWith('2')
  const err = String(code).startsWith('4') || String(code).startsWith('5')
  const color = ok ? '#34D399' : err ? '#F87171' : '#FCD34D'
  return (
    <span style={{
      background: `${color}22`, border: `1px solid ${color}55`,
      color, fontFamily: 'DM Mono, monospace', fontSize: '13px', fontWeight: 700,
      padding: '3px 10px', borderRadius: '5px',
      animation: 'statusPop .3s ease',
    }}>
      {code}
    </span>
  )
}

// ── JSON syntax highlighter ──────────────────────────────────────────────────

function JsonView({ data }) {
  const raw = typeof data === 'string' ? data : JSON.stringify(data, null, 2)
  const html = raw.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    m => {
      if (/^"/.test(m)) return /:$/.test(m)
        ? `<span style="color:#93C5FD">${m}</span>`
        : `<span style="color:#86EFAC">${m}</span>`
      if (/true|false/.test(m)) return `<span style="color:#FCA5A5">${m}</span>`
      if (/null/.test(m))       return `<span style="color:#9CA3AF">${m}</span>`
      return `<span style="color:#FCD34D">${m}</span>`
    }
  )
  return (
    <pre style={{
      background: '#020810', border: '1px solid rgba(0,200,255,.1)',
      borderRadius: '8px', padding: '16px 18px', margin: 0,
      fontFamily: 'DM Mono, monospace', fontSize: '12px', lineHeight: '1.7',
      color: '#94A3B8', overflowX: 'auto', overflowY: 'auto',
      maxHeight: '380px',
    }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

// ── Overview grid (shown when no endpoint selected) ──────────────────────────

function Overview({ endpoints, onSelect }) {
  const grouped = {}
  endpoints.forEach(ep => {
    const t = ep.tags[0] || 'default'
    if (!grouped[t]) grouped[t] = []
    grouped[t].push(ep)
  })

  return (
    <div style={{ padding: '0 2px', animation: 'fadeUp .25s ease' }}>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.12em', marginBottom: '6px' }}>
          QUICK START
        </div>
        <p style={{ margin: 0, fontFamily: 'Outfit, sans-serif', fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          Select an endpoint from the sidebar or click any card below to explore, test, and copy requests.
        </p>
      </div>

      {Object.entries(grouped).map(([tag, eps]) => (
        <div key={tag} style={{ marginBottom: '28px' }}>
          <div style={{
            fontFamily: 'Syne, sans-serif', fontSize: '11px', fontWeight: 700,
            color: 'var(--text-dim)', letterSpacing: '0.12em', textTransform: 'uppercase',
            marginBottom: '12px', paddingBottom: '8px',
            borderBottom: '1px solid var(--border)',
          }}>
            {tag}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '10px' }}>
            {eps.map(ep => {
              const m = METHOD_META[ep.method] || METHOD_META.get
              return (
                <button
                  key={ep.operationId}
                  className="endpoint-card"
                  onClick={() => onSelect(ep)}
                  style={{
                    background: m.tint, border: `1px solid ${m.color}33`,
                    borderRadius: '10px', padding: '14px 16px',
                    textAlign: 'left', cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', gap: '8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MethodBadge method={ep.method} />
                    <span style={{
                      fontFamily: 'DM Mono, monospace', fontSize: '12px',
                      color: m.color, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {ep.path}
                    </span>
                  </div>
                  {ep.summary && (
                    <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                      {ep.summary}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Endpoint detail panel ────────────────────────────────────────────────────

function EndpointDetail({ endpoint, onToast }) {
  const [params, setParams]     = useState({})
  const [body, setBody]         = useState('')
  const [tab, setTab]           = useState('params')
  const [resp, setResp]         = useState(null)
  const [loading, setLoading]   = useState(false)
  const [elapsed, setElapsed]   = useState(null)
  const execRef                 = useRef(null)

  const m = METHOD_META[endpoint.method] || METHOD_META.get

  useEffect(() => {
    setParams({})
    setBody(endpoint.requestBodyExample || '')
    setResp(null)
    setElapsed(null)
    const first = endpoint.parameters?.length ? 'params' : endpoint.requestBody ? 'body' : 'responses'
    setTab(first)
  }, [endpoint.operationId])

  // Cmd+Enter to execute
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') execRef.current?.()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const buildUrl = useCallback(() => {
    let url = BASE_URL + endpoint.path
    const qp = []
    ;(endpoint.parameters || []).forEach(p => {
      const v = params[p.name] || ''
      if (!v) return
      if (p.in === 'path') url = url.replace(`{${p.name}}`, encodeURIComponent(v))
      else if (p.in === 'query') qp.push(`${p.name}=${encodeURIComponent(v)}`)
    })
    if (qp.length) url += '?' + qp.join('&')
    return url
  }, [endpoint, params])

  const buildCurl = () => {
    let cmd = `curl -X ${endpoint.method.toUpperCase()} "${buildUrl()}" \\\n  -H "Content-Type: application/json"`
    if (body && ['post','put'].includes(endpoint.method)) cmd += ` \\\n  -d '${body}'`
    return cmd
  }

  const addRipple = (e) => {
    const btn = e.currentTarget
    const r = document.createElement('span')
    const d = Math.max(btn.clientWidth, btn.clientHeight)
    const rect = btn.getBoundingClientRect()
    r.className = 'ripple-el'
    r.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX-rect.left-d/2}px;top:${e.clientY-rect.top-d/2}px`
    btn.appendChild(r)
    setTimeout(() => r.remove(), 500)
  }

  const execute = useCallback(async (e) => {
    if (e) addRipple(e)
    setLoading(true)
    setResp(null)
    const t0 = performance.now()
    try {
      const opts = { method: endpoint.method.toUpperCase(), headers: { 'Content-Type': 'application/json' } }
      if (body && ['post','put'].includes(endpoint.method)) opts.body = body
      const res = await fetch(buildUrl(), opts)
      const text = await res.text()
      let data; try { data = JSON.parse(text) } catch { data = text }
      setElapsed(Math.round(performance.now() - t0))
      setResp({ status: res.status, ok: res.ok, data })
    } catch (err) {
      setElapsed(Math.round(performance.now() - t0))
      setResp({ status: 0, ok: false, data: { error: err.message } })
    }
    setLoading(false)
  }, [endpoint, buildUrl, body])

  execRef.current = execute

  const tabs = []
  if (endpoint.parameters?.length) tabs.push('params')
  if (endpoint.requestBody)        tabs.push('body')
  tabs.push('responses')

  const liveUrl = buildUrl()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', animation: 'fadeUp .2s ease' }}>

      {/* ── Header card ── */}
      <div style={{
        background: m.tint,
        border: `1px solid ${m.color}55`,
        borderRadius: '14px', padding: '22px 24px',
        boxShadow: `0 0 40px ${m.glow}18`,
        position: 'relative', overflow: 'hidden',
      }}>
        {/* subtle glow top-right */}
        <div style={{
          position: 'absolute', top: '-40px', right: '-40px',
          width: '140px', height: '140px', borderRadius: '50%',
          background: `radial-gradient(circle, ${m.color}22 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px', flexWrap: 'wrap' }}>
          <MethodBadge method={endpoint.method} size="lg" />
          <code style={{
            fontFamily: 'DM Mono, monospace', fontSize: '17px',
            color: m.color, letterSpacing: '0.02em', fontWeight: 500,
          }}>
            {endpoint.path}
          </code>
          <CopyBtn text={endpoint.path} label="PATH" onCopied={onToast} />
        </div>

        {endpoint.summary && (
          <p style={{ margin: 0, fontFamily: 'Outfit, sans-serif', fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.5, opacity: .85 }}>
            {endpoint.summary}
          </p>
        )}

        {endpoint.tags?.length > 0 && (
          <div style={{ marginTop: '10px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {endpoint.tags.map(t => (
              <span key={t} style={{
                background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.08)',
                borderRadius: '4px', padding: '2px 8px',
                fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'var(--text-muted)',
                letterSpacing: '0.08em', textTransform: 'uppercase',
              }}>
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Tabs ── */}
      {tabs.length > 0 && (
        <div>
          <div style={{ display: 'flex', gap: '2px', borderBottom: '1px solid var(--border)', marginBottom: '16px' }}>
            {tabs.map(t => (
              <button key={t} className="tab-btn" onClick={() => setTab(t)} style={{
                background: 'transparent', border: 'none',
                borderBottom: tab === t ? `2px solid ${m.color}` : '2px solid transparent',
                color: tab === t ? m.color : 'var(--text-muted)',
                fontFamily: 'Syne, sans-serif', fontSize: '11px', fontWeight: 700,
                padding: '8px 16px', cursor: 'pointer',
                letterSpacing: '0.08em', textTransform: 'uppercase',
                marginBottom: '-1px',
              }}>
                {t === 'params' ? `Parameters (${endpoint.parameters.length})` : t === 'body' ? 'Request Body' : 'Responses'}
              </button>
            ))}
          </div>

          {/* Parameters */}
          {tab === 'params' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', animation: 'fadeIn .15s' }}>
              {endpoint.parameters.map(p => (
                <div key={p.name} style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: '10px', padding: '14px 16px',
                  display: 'grid', gridTemplateColumns: '200px 1fr', gap: '16px', alignItems: 'start',
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '13px', color: '#7DD3FC', fontWeight: 500 }}>{p.name}</span>
                      {p.required && <span style={{ color: '#F87171', fontSize: '10px', fontFamily: 'DM Mono, monospace', fontWeight: 700 }}>required</span>}
                    </div>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      <span style={{
                        background: 'rgba(78,100,128,.25)', color: 'var(--text-muted)',
                        fontFamily: 'DM Mono, monospace', fontSize: '10px',
                        padding: '1px 6px', borderRadius: '3px',
                      }}>{p.in}</span>
                      {p.schema?.type && (
                        <span style={{
                          background: 'rgba(252,211,77,.1)', color: '#FCD34D',
                          fontFamily: 'DM Mono, monospace', fontSize: '10px',
                          padding: '1px 6px', borderRadius: '3px',
                        }}>{p.schema.type}</span>
                      )}
                    </div>
                    {p.description && (
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.5 }}>{p.description}</span>
                    )}
                  </div>
                  <input
                    className="param-input"
                    type="text"
                    placeholder={p.example != null ? String(p.example) : `Enter ${p.name}…`}
                    value={params[p.name] || ''}
                    onChange={e => setParams(v => ({ ...v, [p.name]: e.target.value }))}
                    style={{
                      background: 'rgba(0,200,255,.04)', border: '1px solid rgba(0,200,255,.15)',
                      color: 'var(--text-primary)', borderRadius: '7px',
                      fontFamily: 'DM Mono, monospace', fontSize: '12px',
                      padding: '9px 12px', width: '100%',
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Body */}
          {tab === 'body' && (
            <div style={{ animation: 'fadeIn .15s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
                  application/json
                </span>
                <CopyBtn text={body} label="COPY JSON" onCopied={onToast} />
              </div>
              <textarea
                value={body}
                onChange={e => setBody(e.target.value)}
                rows={10}
                className="param-input"
                style={{
                  width: '100%', background: '#020810',
                  border: '1px solid rgba(0,200,255,.15)', borderRadius: '8px',
                  color: '#86EFAC', fontFamily: 'DM Mono, monospace', fontSize: '12px',
                  padding: '14px', resize: 'vertical', lineHeight: '1.6',
                }}
              />
            </div>
          )}

          {/* Responses */}
          {tab === 'responses' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', animation: 'fadeIn .15s' }}>
              {Object.entries(endpoint.responses || {}).map(([code, r]) => (
                <div key={code} style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: '8px', padding: '12px 16px',
                  display: 'flex', alignItems: 'flex-start', gap: '12px',
                }}>
                  <StatusBadge code={code} />
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>{r.description}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Execute panel ── */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: '14px', padding: '20px 24px',
      }}>
        {/* Live URL bar */}
        <div style={{
          background: '#020810', border: '1px solid rgba(0,200,255,.1)',
          borderRadius: '8px', padding: '10px 14px', marginBottom: '14px',
          display: 'flex', alignItems: 'center', gap: '10px', overflowX: 'auto',
        }}>
          <span style={{
            color: m.color, fontFamily: 'DM Mono, monospace', fontSize: '10px',
            fontWeight: 700, textTransform: 'uppercase', flexShrink: 0,
          }}>
            {endpoint.method}
          </span>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
            {liveUrl}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            className="exec-btn"
            onClick={execute}
            disabled={loading}
            style={{
              background: loading ? 'rgba(0,200,255,.06)' : `linear-gradient(135deg, #00C8FF, #0090C8)`,
              color: loading ? 'var(--cyan)' : '#060B18',
              border: loading ? '1px solid rgba(0,200,255,.3)' : 'none',
              fontFamily: 'Syne, sans-serif', fontSize: '12px', fontWeight: 800,
              padding: '10px 24px', borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              letterSpacing: '0.08em', textTransform: 'uppercase',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}
          >
            {loading ? (
              <>
                <span style={{ width: '10px', height: '10px', border: '2px solid rgba(0,200,255,.3)', borderTopColor: 'var(--cyan)', borderRadius: '50%', display: 'inline-block', animation: 'spin .7s linear infinite' }} />
                SENDING…
              </>
            ) : <>▶ EXECUTE</>}
          </button>
          <CopyBtn text={buildCurl()} label="CURL" onCopied={onToast} />
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'var(--text-dim)', marginLeft: 'auto' }}>
            ⌘↵ to run
          </span>
        </div>
      </div>

      {/* ── Response ── */}
      {resp && (
        <div style={{
          background: 'var(--bg-card)',
          border: `1px solid ${resp.ok ? 'rgba(16,185,129,.35)' : 'rgba(239,68,68,.35)'}`,
          borderRadius: '14px', overflow: 'hidden',
          animation: 'fadeUp .25s ease',
          boxShadow: `0 0 32px ${resp.ok ? 'rgba(16,185,129,.08)' : 'rgba(239,68,68,.08)'}`,
        }}>
          {/* Response header bar */}
          <div style={{
            padding: '12px 20px',
            background: resp.ok ? 'rgba(16,185,129,.07)' : 'rgba(239,68,68,.07)',
            borderBottom: `1px solid ${resp.ok ? 'rgba(16,185,129,.2)' : 'rgba(239,68,68,.2)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <StatusBadge code={resp.status || 'ERR'} />
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <span style={{
                  fontFamily: 'DM Mono, monospace', fontSize: '11px',
                  color: elapsed < 200 ? '#34D399' : elapsed < 600 ? '#FCD34D' : '#F87171',
                  fontWeight: 700,
                }}>
                  {elapsed}ms
                </span>
                {/* Speed bar */}
                <div style={{ width: '60px', height: '3px', background: 'rgba(255,255,255,.06)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: '2px',
                    width: `${Math.min(100, (elapsed / 1000) * 100)}%`,
                    background: elapsed < 200 ? '#34D399' : elapsed < 600 ? '#FCD34D' : '#F87171',
                    transition: 'width .3s ease',
                  }} />
                </div>
              </div>
            </div>
            <CopyBtn text={JSON.stringify(resp.data, null, 2)} label="RESPONSE" onCopied={onToast} />
          </div>

          <div style={{ padding: '16px 20px' }}>
            <JsonView data={resp.data} />
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main ─────────────────────────────────────────────────────────────────────

export default function ApiDocs() {
  const [spec, setSpec]           = useState(null)
  const [endpoints, setEndpoints] = useState([])
  const [selected, setSelected]   = useState(null)
  const [search, setSearch]       = useState('')
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)
  const [toast, setToast]         = useState(null)
  const [history, setHistory]     = useState([])   // {method, path, status, elapsed}

  const parseSpec = useCallback((data) => {
    const list = []
    if (!data.paths) return list
    Object.entries(data.paths).forEach(([path, methods]) => {
      Object.entries(methods).forEach(([method, op]) => {
        if (!['get','post','put','delete','patch'].includes(method)) return
        let requestBodyExample = ''
        const rb = op.requestBody?.content?.['application/json']
        if (rb?.schema?.properties) {
          const ex = {}
          Object.entries(rb.schema.properties).forEach(([k, v]) => {
            ex[k] = v.example ?? (v.type === 'integer' || v.type === 'number' ? 0 : v.type === 'boolean' ? false : '')
          })
          requestBodyExample = JSON.stringify(ex, null, 2)
        }
        list.push({
          path, method,
          operationId: op.operationId || `${method}-${path}`,
          summary: op.summary || '',
          description: op.description || '',
          tags: op.tags || ['default'],
          parameters: (op.parameters || []).map(p => ({ ...p, schema: p.schema || {} })),
          requestBody: op.requestBody || null,
          requestBodyExample,
          responses: op.responses ? Object.fromEntries(
            Object.entries(op.responses).map(([code, r]) => [code, {
              description: r.description || '',
              schema: r.content?.['application/json']?.schema || null,
            }])
          ) : {},
        })
      })
    })
    return list
  }, [])

  useEffect(() => {
    fetch(`${BASE_URL}/api-docs`)
      .then(r => r.json())
      .then(data => {
        setSpec(data)
        const parsed = parseSpec(data)
        setEndpoints(parsed)
        setLoading(false)
      })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [parseSpec])

  const handleSelect = (ep) => {
    setSelected(ep)
  }

  const handleToast = (msg) => {
    setToast(msg)
  }

  const filtered = endpoints.filter(ep => {
    if (!search) return true
    const q = search.toLowerCase()
    return ep.path.toLowerCase().includes(q) || ep.summary.toLowerCase().includes(q) || ep.method.includes(q)
  })

  const grouped = {}
  filtered.forEach(ep => {
    const t = ep.tags[0] || 'default'
    if (!grouped[t]) grouped[t] = []
    grouped[t].push(ep)
  })

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '16px' }}>
      <div style={{ width: '36px', height: '36px', border: '3px solid rgba(0,200,255,.12)', borderTopColor: 'var(--cyan)', borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
      <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: 'var(--text-muted)', animation: 'pulse 1.5s ease infinite' }}>LOADING API SPEC…</span>
    </div>
  )

  if (error) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '12px', textAlign: 'center', padding: '32px' }}>
      <div style={{ fontSize: '40px', lineHeight: 1 }}>⚠</div>
      <p style={{ margin: 0, fontFamily: 'Syne, sans-serif', fontSize: '16px', color: 'var(--red)', fontWeight: 700 }}>Failed to load API spec</p>
      <p style={{ margin: 0, fontFamily: 'Outfit, sans-serif', fontSize: '13px', color: 'var(--text-muted)' }}>Make sure the backend is running on <code style={{ color: 'var(--cyan)' }}>{BASE_URL}</code></p>
      <p style={{ margin: 0, fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--text-dim)' }}>{error}</p>
    </div>
  )

  const methodCounts = {}
  endpoints.forEach(e => { methodCounts[e.method] = (methodCounts[e.method] || 0) + 1 })

  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}

      <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 56px - 53px)' }}>

        {/* ── Page header ── */}
        <div style={{
          padding: '24px 32px 20px',
          borderBottom: '1px solid var(--border)',
          background: 'linear-gradient(180deg, rgba(0,200,255,.03) 0%, transparent 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px',
        }}>
          <div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'var(--text-dim)', letterSpacing: '0.14em', marginBottom: '5px' }}>
              API REFERENCE · {spec?.info?.version || 'v1.0.0'}
            </div>
            <h1 style={{ margin: 0, fontFamily: 'Syne, sans-serif', fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
              {spec?.info?.title || 'BDC-Nexus API'}
            </h1>
          </div>

          {/* Method stat pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {Object.entries(methodCounts).map(([method, count]) => {
              const meta = METHOD_META[method] || METHOD_META.get
              return (
                <div key={method} style={{
                  background: meta.tint, border: `1px solid ${meta.color}44`,
                  borderRadius: '8px', padding: '6px 14px',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                  <MethodBadge method={method} />
                  <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '15px', fontWeight: 800, color: meta.color }}>{count}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Body ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', flex: 1 }}>

          {/* ── Sidebar ── */}
          <div style={{
            borderRight: '1px solid var(--border)',
            display: 'flex', flexDirection: 'column',
            position: 'sticky', top: '56px',
            maxHeight: 'calc(100vh - 56px - 53px)',
            overflowY: 'auto',
          }}>

            {/* Search */}
            <div style={{ padding: '14px 12px 8px', position: 'sticky', top: 0, background: 'var(--bg-base)', zIndex: 10, borderBottom: '1px solid var(--border)' }}>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)', fontSize: '14px', pointerEvents: 'none' }}>⌕</span>
                <input
                  type="text"
                  placeholder="Filter endpoints…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="param-input"
                  style={{
                    width: '100%', background: 'rgba(0,200,255,.04)',
                    border: '1px solid rgba(0,200,255,.12)', borderRadius: '7px',
                    color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif', fontSize: '12px',
                    padding: '7px 10px 7px 30px',
                  }}
                />
              </div>
            </div>

            {/* Endpoint list */}
            <div style={{ flex: 1, padding: '8px 0' }}>
              {Object.entries(grouped).map(([tag, eps]) => (
                <div key={tag}>
                  <div style={{
                    padding: '8px 14px 4px',
                    fontFamily: 'Syne, sans-serif', fontSize: '9px', fontWeight: 700,
                    color: 'var(--text-dim)', letterSpacing: '0.14em', textTransform: 'uppercase',
                  }}>
                    {tag}
                  </div>
                  {eps.map(ep => {
                    const meta = METHOD_META[ep.method] || METHOD_META.get
                    const active = selected?.operationId === ep.operationId
                    return (
                      <button
                        key={ep.operationId}
                        className={`ep-btn endpoint-card ${active ? 'active' : ''}`}
                        onClick={() => handleSelect(ep)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '8px',
                          width: '100%', background: active ? 'rgba(0,200,255,.08)' : 'transparent',
                          border: 'none', borderLeft: `3px solid ${active ? '#00C8FF' : 'transparent'}`,
                          padding: '8px 12px 8px 10px', cursor: 'pointer', textAlign: 'left',
                        }}
                      >
                        <MethodBadge method={ep.method} />
                        <div style={{ overflow: 'hidden', minWidth: 0 }}>
                          <div style={{
                            fontFamily: 'DM Mono, monospace', fontSize: '11px',
                            color: active ? 'var(--text-primary)' : 'var(--text-muted)',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          }}>
                            {ep.path.replace('/api/', '')}
                          </div>
                          {ep.summary && (
                            <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '10px', color: 'var(--text-dim)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px' }}>
                              {ep.summary}
                            </div>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              ))}

              {filtered.length === 0 && (
                <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-dim)', fontFamily: 'DM Mono, monospace', fontSize: '11px' }}>
                  No matches for "{search}"
                </div>
              )}
            </div>

            {/* Base URL footer */}
            <div style={{
              padding: '10px 12px', borderTop: '1px solid var(--border)',
              background: 'rgba(0,200,255,.02)',
            }}>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: 'var(--text-dim)', letterSpacing: '0.1em', marginBottom: '3px' }}>BASE URL</div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--cyan)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {BASE_URL}
              </div>
            </div>
          </div>

          {/* ── Main panel ── */}
          <div style={{ padding: '28px 32px', overflowY: 'auto' }}>
            {selected
              ? <EndpointDetail key={selected.operationId} endpoint={selected} onToast={handleToast} />
              : <Overview endpoints={endpoints} onSelect={handleSelect} />
            }
          </div>
        </div>
      </div>
    </>
  )
}
