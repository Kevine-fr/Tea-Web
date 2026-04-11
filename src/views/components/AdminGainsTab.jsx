// src/views/admin/AdminGainsTab.jsx
import { useState, useEffect } from 'react'
import { adminApi } from '../../api/admin.js'
import AdminModal from './AdminModal.jsx'
import { SklTable } from './AdminSkeleton.jsx'
import toast from 'react-hot-toast'

const CSS = `
@keyframes rowIn { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:none} }
.gains-row { animation:rowIn .35s ease both; }
.gains-row:hover td { background:var(--cream) !important; }
.gains-filter-bar { display:flex; gap:.5rem; flex-wrap:wrap; margin-bottom:1.25rem; }
.gains-fbtn {
  padding:.3rem 1rem; border-radius:var(--radius-pill); border:1.5px solid var(--cream-border);
  font-family:'Lato',sans-serif; font-size:.8rem; font-weight:700;
  cursor:pointer; background:#fff; transition:all .2s ease;
}
.gains-fbtn.active { background:var(--green-dark); color:#fff; border-color:var(--green-dark); }
.gains-fbtn:hover:not(.active) { background:var(--cream); }
.gains-section-title { font-family:'Playfair Display',Georgia,serif; font-size:1.15rem; font-weight:700; color:var(--green-dark); margin:0; }
`

const STATUS_META = {
  pending:   { label: 'En préparation',         cls: 's-prep' },
  approved:  { label: 'Disponible en boutique', cls: 's-won'  },
  completed: { label: 'Remis',                  cls: 's-done' },
  rejected:  { label: 'Refusé',                 cls: 's-lost' },
}

// Toutes les valeurs de statut sélectionnables depuis l'admin
const STATUS_OPTS = [
  { value: 'pending',   label: 'En préparation' },
  { value: 'approved',  label: 'Disponible en boutique' },
  { value: 'completed', label: 'Remis' },
  { value: 'rejected',  label: 'Refusé' },
]

const FILTERS = [
  { key: 'all',       label: 'Tous' },
  { key: 'none',      label: 'Sans réclamation' },
  { key: 'pending',   label: 'En préparation' },
  { key: 'approved',  label: 'Disponible' },
  { key: 'completed', label: 'Remis' },
  { key: 'rejected',  label: 'Refusé' },
]

const fmtDate = iso => iso ? new Date(iso).toLocaleDateString('fr-FR') : '—'

export default function AdminGainsTab({ search = '' }) {
  const [participations, setParticipations] = useState([])
  const [loading, setLoading]               = useState(true)
  const [statusFilter, setStatusFilter]     = useState('all')
  const [modal, setModal]                   = useState(null) // { type, data }
  const [page, setPage]                     = useState(1)
  const [meta, setMeta]                     = useState({})

  async function load(p = 1) {
    setLoading(true)
    try {
      const res = await adminApi.participations({ per_page: 30, winner: 1, page: p, search: search || undefined })
      setParticipations(res.data ?? [])
      setMeta(res.meta ?? {})
    } catch { toast.error('Impossible de charger les participations.') }
    finally { setLoading(false) }
  }

  useEffect(() => { load(1) }, [search])

  const filtered = participations.filter(p => {
    if (statusFilter === 'all')  return true
    if (statusFilter === 'none') return !p.redemption
    return p.redemption?.status === statusFilter
  })

  // ── Gérer la réclamation (création ou mise à jour de statut) ──
  // L'admin choisit le statut voulu directement.
  // Si pas de réclamation → on la crée avec method='store' et le statut choisi.
  // Si réclamation existante → on met à jour le statut.
  async function handleManageStatus(vals) {
    const { data } = modal

    try {
      if (!data.redemption) {
        // Création : method par défaut 'store' (géré côté serveur), + statut voulu
        const client = (await import('../../api/client.js')).default
        await client.post('redemptions', {
          participation_id: data.id,
          // method non envoyé → serveur applique 'store' par défaut
          status: vals.status,
        })
        toast.success('Réclamation créée.')
      } else {
        // Mise à jour du statut
        await adminApi.updateRedemption(data.redemption.id, vals.status)
        toast.success('Statut mis à jour.')
      }
      setModal(null)
      load(page)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur.')
    }
  }

  // ── Suppression réclamation ───────────────────────────────────
  async function handleDeleteRedemption() {
    try {
      await adminApi.deleteRedemption(modal.data.redemption.id)
      toast.success('Réclamation supprimée.')
      setModal(null); load(page)
    } catch (err) { toast.error(err.response?.data?.message || 'Erreur.') }
  }

  // ── Suppression participation (+ ticket + stock restaurés) ────
  async function handleDeleteParticipation() {
    try {
      await adminApi.deleteParticipation(modal.data.id)
      toast.success('Participation supprimée — ticket et stock restaurés.')
      setModal(null); load(page)
    } catch (err) { toast.error(err.response?.data?.message || 'Erreur.') }
  }

  // ── Export CSV ────────────────────────────────────────────────
  function exportCSV() {
    const rows = [['N° Ticket', 'Nom', 'Prénom', 'Mail', 'Lot', 'Statut']]
    filtered.forEach(p => rows.push([
      p.ticket_code?.code ?? '',
      p.user?.last_name   ?? '', p.user?.first_name ?? '',
      p.user?.email       ?? '',
      p.prize?.name       ?? '',
      p.redemption
        ? (STATUS_META[p.redemption.status]?.label ?? p.redemption.status)
        : 'Sans réclamation',
    ]))
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = 'gains.csv'; a.click()
  }

  return (
    <>
      <style>{CSS}</style>
      <div style={{ padding: '1.75rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '.75rem' }}>
          <h2 className="gains-section-title">Gains & réclamations</h2>
          <button className="btn btn-outline" style={{ fontSize: '.82rem', padding: '.45rem 1.1rem' }} onClick={exportCSV}>
            ↓ Exporter CSV
          </button>
        </div>

        {/* Filtres */}
        <div className="gains-filter-bar">
          {FILTERS.map(f => (
            <button key={f.key} className={`gains-fbtn ${statusFilter === f.key ? 'active' : ''}`}
              onClick={() => setStatusFilter(f.key)}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Tableau */}
        {loading
          ? <SklTable cols={5} rows={7} headers={['N° Ticket', 'Participant', 'Lot', 'Statut', 'Actions']} />
          : filtered.length === 0
            ? (
              <div style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '.75rem', opacity: .4 }}>🎁</div>
                Aucune participation gagnante.
              </div>
            ) : (
              <div className="card" style={{ overflow: 'auto' }}>
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>N° Ticket</th>
                      <th>Participant</th>
                      <th>Lot</th>
                      <th>Statut</th>
                      <th style={{ minWidth: 130 }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((p, i) => {
                      const s   = STATUS_META[p.redemption?.status] ?? null
                      const noR = !p.redemption
                      return (
                        <tr key={p.id} className="gains-row" style={{ animationDelay: `${i * .04}s` }}>
                          <td style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '.88rem', color: 'var(--green-dark)' }}>
                            {p.ticket_code?.code ?? '—'}
                          </td>
                          <td>
                            <div style={{ fontWeight: 600, fontSize: '.88rem' }}>
                              {p.user?.first_name} {p.user?.last_name}
                            </div>
                            <div style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>{p.user?.email}</div>
                          </td>
                          <td style={{ fontSize: '.88rem' }}>{p.prize?.name ?? '—'}</td>
                          <td>
                            {noR
                              ? <span style={{ fontSize: '.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Sans réclamation</span>
                              : <span className={`status ${s?.cls ?? 's-prep'}`}>{s?.label ?? p.redemption.status}</span>
                            }
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '.3rem', flexWrap: 'wrap' }}>
                              {/* Bouton unique : choisir / modifier le statut */}
                              <button
                                className={noR ? 'btn btn-green' : 'btn btn-orange'}
                                style={{ padding: '.28rem .75rem', fontSize: '.78rem' }}
                                onClick={() => setModal({ type: 'status', data: p })}
                              >
                                {noR ? '+ Statut' : 'Statut'}
                              </button>

                              {/* Supprimer réclamation (bloqué si 'completed') */}
                              {!noR && p.redemption.status !== 'completed' && (
                                <button className="btn btn-outline"
                                  style={{ padding: '.28rem .6rem', fontSize: '.78rem', color: 'var(--error)', borderColor: 'var(--error)' }}
                                  title="Supprimer la réclamation"
                                  onClick={() => setModal({ type: 'delRedemption', data: p })}>
                                  🗑
                                </button>
                              )}

                              {/* Supprimer participation */}
                              <button className="btn btn-outline"
                                style={{ padding: '.28rem .6rem', fontSize: '.78rem', color: 'var(--error)', borderColor: 'var(--error)' }}
                                title="Supprimer la participation"
                                onClick={() => setModal({ type: 'delParticipation', data: p })}>
                                🗑
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )
        }

        {/* Pagination */}
        {meta.last_page > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '.5rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
            {page > 1 && (
              <button className="btn btn-outline" style={{ padding: '.3rem .9rem', fontSize: '.8rem' }}
                onClick={() => { const p = page - 1; setPage(p); load(p) }}>← Préc.</button>
            )}
            <span style={{ padding: '.3rem .9rem', fontSize: '.85rem', color: 'var(--text-muted)' }}>
              {meta.current_page} / {meta.last_page}
            </span>
            {page < meta.last_page && (
              <button className="btn btn-outline" style={{ padding: '.3rem .9rem', fontSize: '.8rem' }}
                onClick={() => { const p = page + 1; setPage(p); load(p) }}>Suiv. →</button>
            )}
          </div>
        )}
      </div>

      {/* ── Modal unique : choisir/modifier le statut ─────────── */}
      {modal?.type === 'status' && (() => {
        const { data } = modal
        const hasR    = !!data.redemption
        const current = data.redemption?.status ?? 'pending'
        return (
          <AdminModal
            title={`${hasR ? 'Modifier le statut' : 'Créer la réclamation'} — ${data.prize?.name ?? 'lot'}`}
            fields={[
              {
                name: 'status',
                label: 'Statut de la réclamation',
                type: 'select',
                defaultValue: current,
                options: STATUS_OPTS,
              },
            ]}
            onClose={() => setModal(null)}
            onSubmit={handleManageStatus}
            submitLabel={hasR ? 'Mettre à jour' : 'Créer'}
          >
            {/* Info : la méthode est toujours "en boutique" par défaut */}
            {!hasR && (
              <p style={{ fontSize: '.8rem', color: 'var(--text-muted)', marginBottom: '.75rem', display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                <span>🏪</span>
                Retrait en boutique par défaut.
              </p>
            )}
          </AdminModal>
        )
      })()}

      {/* ── Modal supprimer réclamation ───────────────────────── */}
      {modal?.type === 'delRedemption' && (
        <AdminModal
          title="Supprimer la réclamation ?"
          onClose={() => setModal(null)}
          onSubmit={handleDeleteRedemption}
          submitLabel="🗑 Supprimer"
          submitVariant="red"
        >
          <p style={{ fontSize: '.88rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Réclamation de <strong>{modal.data.user?.first_name} {modal.data.user?.last_name}</strong> supprimée définitivement.
          </p>
        </AdminModal>
      )}

      {/* ── Modal supprimer participation ─────────────────────── */}
      {modal?.type === 'delParticipation' && (
        <AdminModal
          title="Supprimer la participation ?"
          onClose={() => setModal(null)}
          onSubmit={handleDeleteParticipation}
          submitLabel="🗑 Supprimer"
          submitVariant="red"
        >
          <p style={{ fontSize: '.88rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Participation de <strong>{modal.data.user?.first_name} {modal.data.user?.last_name}</strong> supprimée.
            Le ticket et le stock du lot seront restaurés.
          </p>
        </AdminModal>
      )}
    </>
  )
}