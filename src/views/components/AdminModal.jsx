// src/views/admin/AdminModal.jsx
import { useState, useEffect, useRef } from 'react'

const CSS = `
@keyframes modalIn   { from{opacity:0;transform:scale(.93) translateY(14px)} to{opacity:1;transform:none} }
@keyframes overlayIn { from{opacity:0} to{opacity:1} }
@keyframes modalSpinner { from{transform:rotate(0)} to{transform:rotate(360deg)} }
.adm-modal-overlay { animation:overlayIn .18s ease both; }
.adm-modal-box     { animation:modalIn .22s cubic-bezier(.34,1.3,.64,1) both; }
.adm-modal-title {
  font-family:'Playfair Display', Georgia, serif !important;
  font-size:1.15rem; font-weight:700; color:var(--green-dark);
  margin:0; text-align:center;
}
.adm-modal-close {
  background:none; border:none; font-size:1.4rem; cursor:pointer;
  color:var(--text-muted); line-height:1; padding:.2rem;
  transition:color .2s ease;
}
.adm-modal-close:hover { color:var(--text-dark); }
.adm-modal-spinner {
  width:16px; height:16px; border-radius:50%;
  border:2px solid rgba(255,255,255,.35);
  border-top-color:#fff;
  animation:modalSpinner .65s linear infinite;
  display:inline-block; flex-shrink:0;
}
`

export default function AdminModal({
  title,
  fields        = [],
  onClose,
  onSubmit,
  submitLabel   = 'Confirmer',
  submitVariant = 'orange',   // 'orange' | 'red'
  children,
}) {
  const [vals, setVals]         = useState(
    Object.fromEntries(fields.map(f => [f.name, f.defaultValue ?? '']))
  )
  const [submitting, setSubmit] = useState(false)
  const set      = (k, v) => setVals(p => ({ ...p, [k]: v }))
  const firstRef = useRef(null)

  useEffect(() => {
    firstRef.current?.focus()
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    const h = e => { if (e.key === 'Escape' && !submitting) onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose, submitting])

  async function handleSubmit() {
    if (submitting) return
    setSubmit(true)
    try { await onSubmit(vals) }
    finally { setSubmit(false) }
  }

  const isRed = submitVariant === 'red'

  return (
    <>
      <style>{CSS}</style>
      <div className="modal-overlay adm-modal-overlay"
        onClick={() => !submitting && onClose()}
        role="dialog" aria-modal="true">

        <div className="modal-box adm-modal-box"
          onClick={e => e.stopPropagation()}
          style={{ maxWidth:450, padding:'2rem' }}>

          {/* Header */}
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'1rem', marginBottom:'1.5rem' }}>
            <h3 className="adm-modal-title">{title}</h3>
            <button className="adm-modal-close" onClick={() => !submitting && onClose()} aria-label="Fermer">×</button>
          </div>

          {/* Champs */}
          {fields.map((f, i) => (
            <div className="form-field" key={f.name}>
              {f.label && <label>{f.label}</label>}
              {f.type === 'select' ? (
                <select ref={i === 0 ? firstRef : null} value={vals[f.name]}
                  onChange={e => set(f.name, e.target.value)}
                  disabled={submitting}
                  style={{ borderRadius:'var(--radius-pill)' }}>
                  {(f.options || []).map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              ) : f.type === 'textarea' ? (
                <textarea ref={i === 0 ? firstRef : null} rows={3}
                  value={vals[f.name]} onChange={e => set(f.name, e.target.value)}
                  placeholder={f.placeholder || f.label} disabled={submitting} />
              ) : (
                <input ref={i === 0 ? firstRef : null}
                  type={f.type || 'text'} value={vals[f.name]}
                  onChange={e => set(f.name, e.target.value)}
                  placeholder={f.placeholder || f.label}
                  min={f.min} max={f.max} disabled={submitting} />
              )}
            </div>
          ))}

          {/* Slot libre */}
          {children}

          {/* CTA */}
          {onSubmit && (
            <button
              className={`btn ${isRed ? 'btn-outline' : 'btn-orange'}`}
              style={{
                width:'100%', marginTop:'.5rem', padding:'.8rem',
                fontFamily:"'Lato', sans-serif",
                display:'flex', alignItems:'center', justifyContent:'center', gap:'.5rem',
                opacity: submitting ? .8 : 1,
                cursor: submitting ? 'not-allowed' : 'pointer',
                ...(isRed ? { color:'var(--error)', borderColor:'var(--error)' } : {}),
              }}
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting
                ? <><span className="adm-modal-spinner" /> Chargement…</>
                : submitLabel
              }
            </button>
          )}
        </div>
      </div>
    </>
  )
}