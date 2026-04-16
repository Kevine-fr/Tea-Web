// src/views/components/AdminGamePeriodTab.jsx
import { useState, useEffect } from 'react'
import { adminApi } from '../../api/admin.js'
import AdminModal from './AdminModal.jsx'
import toast from 'react-hot-toast'

const CSS = `
  @keyframes gpCardIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
  @keyframes gpPulse   { 0%,100%{box-shadow:0 0 0 0 rgba(106,143,90,.4)} 70%{box-shadow:0 0 0 10px rgba(106,143,90,0)} }
  @keyframes gpSpin    { from{transform:rotate(0)} to{transform:rotate(360deg)} }

  .gp-wrap { padding:2rem; max-width:640px; margin:0 auto; }
  .gp-card {
    background:#fff; border-radius:16px;
    border:1.5px solid var(--cream-border,#e4d9cc);
    box-shadow:0 4px 20px rgba(0,0,0,.07);
    padding:2rem;
    animation:gpCardIn .4s cubic-bezier(.22,.68,0,1.1) both;
  }
  .gp-header {
    display:flex; align-items:center; gap:.75rem;
    margin-bottom:1.75rem;
  }
  .gp-header-icon { font-size:1.6rem; }
  .gp-title {
    font-family:'Playfair Display',Georgia,serif;
    font-size:1.15rem; font-weight:700;
    color:var(--green-dark,#1a3c2e); margin:0;
  }
  .gp-subtitle { font-size:.8rem; color:var(--text-muted,#888); margin:.15rem 0 0; }

  /* Badge statut */
  .gp-status {
    display:inline-flex; align-items:center; gap:.4rem;
    padding:.3rem .75rem; border-radius:999px;
    font-size:.72rem; font-weight:700; letter-spacing:.04em;
    margin-bottom:1.5rem;
  }
  .gp-status.active   { background:#e8f5e3; color:#3a7040; border:1px solid rgba(106,143,90,.3); animation:gpPulse 2s ease-in-out infinite; }
  .gp-status.inactive { background:#fff8f0; color:#c8723a; border:1px solid rgba(200,114,58,.25); }
  .gp-status.none     { background:#f5f5f5; color:#888;    border:1px solid #e0e0e0; }

  /* Infos dates */
  .gp-dates { display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1.75rem; }
  .gp-date-block {
    background:var(--cream,#faf7f2);
    border:1px solid var(--cream-border,#e4d9cc);
    border-radius:12px; padding:1rem;
  }
  .gp-date-label { font-size:.65rem; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:var(--text-muted,#888); margin-bottom:.35rem; }
  .gp-date-value { font-size:.92rem; font-weight:700; color:var(--green-dark,#1a3c2e); }
  .gp-date-sub   { font-size:.72rem; color:var(--text-muted,#888); margin-top:.2rem; }

  /* Countdown inline */
  .gp-countdown {
    background:linear-gradient(135deg,rgba(26,60,46,.04),rgba(106,143,90,.06));
    border:1px solid rgba(106,143,90,.2);
    border-radius:12px; padding:1rem;
    text-align:center; margin-bottom:1.75rem;
  }
  .gp-countdown-label { font-size:.7rem; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:var(--text-muted); margin-bottom:.5rem; }
  .gp-countdown-val   { font-size:1.25rem; font-weight:800; color:var(--green-dark,#1a3c2e); font-variant-numeric:tabular-nums; }

  /* Actions */
  .gp-actions { display:flex; gap:.75rem; flex-wrap:wrap; }
  .gp-btn {
    flex:1; min-width:100px;
    padding:.7rem 1.25rem; border-radius:999px;
    font-family:'Lato',sans-serif; font-size:.85rem; font-weight:700;
    cursor:pointer; border:none; transition:all .2s ease;
    display:flex; align-items:center; justify-content:center; gap:.4rem;
  }
  .gp-btn-create  { background:var(--green-dark,#1a3c2e); color:#fff; }
  .gp-btn-create:hover  { background:#2a5c3e; transform:translateY(-1px); box-shadow:0 4px 14px rgba(26,60,46,.3); }
  .gp-btn-edit    { background:var(--cream,#faf7f2); color:var(--green-dark,#1a3c2e); border:1.5px solid var(--cream-border,#e4d9cc); }
  .gp-btn-edit:hover    { background:#f0ebe3; transform:translateY(-1px); }
  .gp-btn-delete  { background:#fef2f2; color:#dc2626; border:1.5px solid #fecaca; }
  .gp-btn-delete:hover  { background:#fee2e2; transform:translateY(-1px); }
  .gp-btn:disabled { opacity:.5; cursor:not-allowed; transform:none !important; }

  /* Empty */
  .gp-empty {
    text-align:center; padding:2.5rem 1rem;
    color:var(--text-muted,#888); font-size:.92rem;
  }
  .gp-empty-icon { font-size:2.5rem; margin-bottom:.75rem; }

  /* Loader */
  .gp-spin { animation:gpSpin .7s linear infinite; display:inline-block; }

  @media(max-width:480px) {
    .gp-wrap { padding:1rem; }
    .gp-card { padding:1.25rem; }
    .gp-dates { grid-template-columns:1fr; }
    .gp-actions { flex-direction:column; }
  }
`

function fmtDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('fr-FR', {
    day:'2-digit', month:'long', year:'numeric',
    hour:'2-digit', minute:'2-digit',
  })
}

function fmtRemaining(secs) {
  if (secs <= 0) return 'Terminé'
  const d = Math.floor(secs / 86400)
  const h = Math.floor((secs % 86400) / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60
  const parts = []
  if (d > 0) parts.push(`${d}j`)
  if (h > 0) parts.push(`${h}h`)
  if (m > 0) parts.push(`${m}m`)
  parts.push(`${s}s`)
  return parts.join(' ')
}

export default function AdminGamePeriodTab() {
  const [period,   setPeriod]   = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [modal,    setModal]    = useState(null) // 'create' | 'edit' | 'delete'
  const [tick,     setTick]     = useState(0)

  // Tick toutes les secondes pour le countdown inline
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000)
    return () => clearInterval(id)
  }, [])

  async function load() {
    setLoading(true)
    try {
      const data = await adminApi.gamePeriod()
      setPeriod(data ?? null)
    } catch (e) {
      if (e.response?.status === 404) setPeriod(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleCreate(vals) {
    try {
      await adminApi.createGamePeriod({ starts_at: vals.starts_at, ends_at: vals.ends_at })
      toast.success('Période de jeu créée !')
      setModal(null)
      load()
    } catch (e) {
      toast.error(e.response?.data?.message || 'Erreur lors de la création.')
      throw e
    }
  }

  async function handleEdit(vals) {
    try {
      await adminApi.updateGamePeriod({ starts_at: vals.starts_at, ends_at: vals.ends_at })
      toast.success('Période de jeu mise à jour !')
      setModal(null)
      load()
    } catch (e) {
      toast.error(e.response?.data?.message || 'Erreur lors de la mise à jour.')
      throw e
    }
  }

  async function handleDelete() {
    try {
      await adminApi.deleteGamePeriod()
      toast.success('Période de jeu supprimée.')
      setModal(null)
      setPeriod(null)
    } catch (e) {
      toast.error(e.response?.data?.message || 'Erreur lors de la suppression.')
      throw e
    }
  }

  const remainingSecs = period
    ? Math.max(0, Math.floor((new Date(period.ends_at) - Date.now()) / 1000))
    : 0

  const isActive = period
    ? (Date.now() >= new Date(period.starts_at) && Date.now() <= new Date(period.ends_at))
    : false

  const periodFields = [
    {
      name: 'starts_at', label: 'Date de début', type: 'datetime-local',
      defaultValue: period?.starts_at
        ? new Date(period.starts_at).toISOString().slice(0, 16)
        : '',
    },
    {
      name: 'ends_at', label: 'Date de fin', type: 'datetime-local',
      defaultValue: period?.ends_at
        ? new Date(period.ends_at).toISOString().slice(0, 16)
        : '',
    },
  ]

  return (
    <>
      <style>{CSS}</style>
      <div className="gp-wrap">
        <div className="gp-card">

          <div className="gp-header">
            <span className="gp-header-icon">📅</span>
            <div>
              <h3 className="gp-title">Période de jeu</h3>
              <p className="gp-subtitle">Définissez la fenêtre temporelle du jeu-concours</p>
            </div>
          </div>

          {loading ? (
            <div className="gp-empty">
              <div className="gp-spin" style={{ fontSize:'1.5rem' }}>⏳</div>
              <p style={{ marginTop:'.75rem' }}>Chargement…</p>
            </div>
          ) : !period ? (
            <>
              <div className="gp-empty">
                <div className="gp-empty-icon">🗓️</div>
                <p>Aucune période de jeu configurée.</p>
                <p style={{ fontSize:'.8rem', marginTop:'.25rem' }}>Créez-en une pour activer le compte à rebours.</p>
              </div>
              <div className="gp-actions" style={{ marginTop:'1.25rem' }}>
                <button className="gp-btn gp-btn-create" onClick={() => setModal('create')}>
                  ➕ Créer la période
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Statut */}
              <div>
                <span className={`gp-status ${isActive ? 'active' : remainingSecs > 0 ? 'inactive' : 'none'}`}>
                  {isActive ? '🟢 En cours' : remainingSecs > 0 ? '🟡 À venir' : '🔴 Terminée'}
                </span>
              </div>

              {/* Dates */}
              <div className="gp-dates">
                <div className="gp-date-block">
                  <div className="gp-date-label">🚀 Début</div>
                  <div className="gp-date-value">{fmtDate(period.starts_at)}</div>
                </div>
                <div className="gp-date-block">
                  <div className="gp-date-label">🏁 Fin</div>
                  <div className="gp-date-value">{fmtDate(period.ends_at)}</div>
                </div>
              </div>

              {/* Countdown inline */}
              {(isActive || remainingSecs > 0) && (
                <div className="gp-countdown">
                  <div className="gp-countdown-label">
                    {isActive ? 'Temps restant' : 'Commence dans'}
                  </div>
                  <div className="gp-countdown-val">
                    {isActive
                      ? fmtRemaining(remainingSecs)
                      : fmtRemaining(Math.max(0, Math.floor((new Date(period.starts_at) - Date.now()) / 1000)))
                    }
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="gp-actions">
                <button className="gp-btn gp-btn-edit"   onClick={() => setModal('edit')}>
                  ✏️ Modifier
                </button>
                <button className="gp-btn gp-btn-delete" onClick={() => setModal('delete')}>
                  🗑️ Supprimer
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal créer */}
      {modal === 'create' && (
        <AdminModal
          title="Créer la période de jeu"
          fields={periodFields}
          onClose={() => setModal(null)}
          onSubmit={handleCreate}
          submitLabel="Créer la période"
        />
      )}

      {/* Modal modifier */}
      {modal === 'edit' && (
        <AdminModal
          title="Modifier la période de jeu"
          fields={periodFields}
          onClose={() => setModal(null)}
          onSubmit={handleEdit}
          submitLabel="Enregistrer"
        />
      )}

      {/* Modal supprimer */}
      {modal === 'delete' && (
        <AdminModal
          title="Supprimer la période de jeu ?"
          fields={[]}
          onClose={() => setModal(null)}
          onSubmit={handleDelete}
          submitLabel="Supprimer définitivement"
          submitVariant="red"
        >
          <p style={{ color:'var(--text-muted)', fontSize:'.88rem', textAlign:'center', margin:'0 0 1rem' }}>
            Cette action est irréversible. Le compte à rebours sera désactivé pour tous les visiteurs.
          </p>
        </AdminModal>
      )}
    </>
  )
}