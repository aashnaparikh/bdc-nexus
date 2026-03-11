import { useState } from 'react'
import { createTransaction } from '../api/transactionApi'

const REGIONS  = ['North America', 'Europe', 'Asia Pacific', 'Latin America']
const SEGMENTS = ['Enterprise', 'Mid-Market', 'SMB']

const INIT = { transactionDate: '', revenue: '', customerSegment: SEGMENTS[0], region: REGIONS[0] }

export default function TransactionForm({ onSuccess }) {
  const [form, setForm]         = useState(INIT)
  const [status, setStatus]     = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!form.transactionDate || !form.revenue) {
      setStatus({ type: 'error', message: 'DATE AND REVENUE ARE REQUIRED.' })
      return
    }
    if (isNaN(parseFloat(form.revenue)) || parseFloat(form.revenue) <= 0) {
      setStatus({ type: 'error', message: 'REVENUE MUST BE A POSITIVE NUMBER.' })
      return
    }
    setSubmitting(true)
    setStatus(null)
    try {
      await createTransaction({
        transactionDate:  form.transactionDate,
        revenue:          parseFloat(form.revenue),
        customerSegment:  form.customerSegment,
        region:           form.region,
      })
      setStatus({ type: 'success', message: 'TRANSACTION INGESTED SUCCESSFULLY.' })
      setForm(INIT)
      setTimeout(() => {
        if (onSuccess) onSuccess()
      }, 1500)
    } catch (err) {
      setStatus({ type: 'error', message: `SUBMISSION FAILED: ${err.message}` })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ maxWidth: '560px' }}>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--cyan)', letterSpacing: '0.15em' }}>
            NEW RECORD
          </span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        </div>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '28px', color: 'var(--text-primary)', marginBottom: '8px' }}>
          Ingest Transaction
        </h2>
        <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          Submit a new sales record into the BDC-Nexus analytics engine. Data is immediately reflected in regional revenue analysis.
        </p>
      </div>

      {/* Form card */}
      <div className="card" style={{ padding: '32px', position: 'relative', overflow: 'hidden' }}>
        <div className="accent-line" />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Transaction Date */}
          <FormField label="Transaction Date" required hint="YYYY-MM-DD">
            <input
              type="date"
              className="form-input"
              value={form.transactionDate}
              onChange={(e) => setForm({ ...form, transactionDate: e.target.value })}
              max={new Date().toISOString().split('T')[0]}
              style={{ colorScheme: 'dark' }}
            />
          </FormField>

          {/* Revenue */}
          <FormField label="Revenue (USD)" required hint="NUMERIC · POSITIVE">
            <input
              type="number"
              className="form-input"
              value={form.revenue}
              onChange={(e) => setForm({ ...form, revenue: e.target.value })}
              placeholder="e.g. 45200.00"
              min="0"
              step="0.01"
            />
          </FormField>

          {/* Region */}
          <FormField label="Region" hint="GEOGRAPHIC SEGMENT">
            <select
              className="form-input"
              value={form.region}
              onChange={(e) => setForm({ ...form, region: e.target.value })}
            >
              {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </FormField>

          {/* Customer Segment */}
          <FormField label="Customer Segment" hint="MARKET TIER">
            <select
              className="form-input"
              value={form.customerSegment}
              onChange={(e) => setForm({ ...form, customerSegment: e.target.value })}
            >
              {SEGMENTS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </FormField>

          {/* Status */}
          {status && (
            <div style={{
              background: status.type === 'success' ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
              border: `1px solid ${status.type === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
              borderRadius: '8px',
              padding: '12px 16px',
              fontFamily: 'DM Mono, monospace',
              fontSize: '12px',
              color: status.type === 'success' ? 'var(--green)' : 'var(--red)',
              letterSpacing: '0.04em',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}>
              <span>{status.type === 'success' ? '✓' : '✗'}</span>
              {status.message}
            </div>
          )}

          {/* Submit */}
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? 'PROCESSING...' : 'SUBMIT TRANSACTION'}
          </button>

        </div>
      </div>

      {/* Footer note */}
      <div style={{ marginTop: '16px', fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--text-dim)', letterSpacing: '0.06em' }}>
        DATA IS INGESTED INTO POSTGRESQL AND IMMEDIATELY AVAILABLE FOR REGRESSION ANALYSIS.
      </div>
    </div>
  )
}

function FormField({ label, required, hint, children }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <label style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          {label}{required && <span style={{ color: 'var(--cyan)', marginLeft: '4px' }}>*</span>}
        </label>
        {hint && (
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'var(--text-dim)', letterSpacing: '0.08em' }}>
            {hint}
          </span>
        )}
      </div>
      {children}
    </div>
  )
}
