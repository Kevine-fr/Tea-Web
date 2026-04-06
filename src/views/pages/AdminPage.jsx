import { useState, useEffect, useCallback } from 'react'
import { adminApi } from '../../api/admin.js'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import toast from 'react-hot-toast'

const TABS = ['Dashboard', 'Tickets & Gains', 'Utilisateurs & droits']

/* ─── Modal générique ──────────────────────────────────────── */
function Modal({ title, fields, onClose, onSubmit, submitLabel = 'Mettre à jour' }) {
  const [vals, setVals] = useState(
    Object.fromEntries(fields.map(f => [f.name, f.defaultValue ?? '']))
  )
  const set = (k, v) => setVals(p => ({ ...p, [k]: v }))

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <h3>{title}</h3>
        {fields.map(f => (
          <div className="form-field" key={f.name}>
            <label>{f.label}</label>
            {f.type === 'select' ? (
              <select value={vals[f.name]} onChange={e => set(f.name, e.target.value)}
                style={{ borderRadius: 'var(--radius-pill)' }}>
                {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            ) : (
              <input type={f.type || 'text'} value={vals[f.name]}
                onChange={e => set(f.name, e.target.value)}
                placeholder={f.placeholder || f.label} />
            )}
          </div>
        ))}
        <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
          <button className="btn btn-orange" style={{ width: '100%' }}
            onClick={() => onSubmit(vals)}>
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Dashboard ─────────────────────────────────────────────── */
function DashboardTab({ stats }) {
  const dist   = stats?.prize_distribution || []
  const alerts = stats?.low_stock_alerts   || []
  const tpd    = stats?.tickets_per_day    || []
  const COLORS  = ['#1a3c2e', '#e8431a', '#c9a84c', '#4a8c60', '#e2d9c8']
  const maxCount = Math.max(...tpd.map(d => d.count), 1)

  return (
    <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.5rem', alignItems: 'start' }}>
      <div>
        {/* Donut répartition gains */}
        <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.1rem' }}>Répartition des gains</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div style={{ width: 160, height: 160, flexShrink: 0 }}>
              <svg viewBox="0 0 36 36" style={{ width: 160, height: 160, transform: 'rotate(-90deg)' }}>
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f0ebe0" strokeWidth="3.8" />
                {dist.length === 0
                  ? <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2d9c8" strokeWidth="3.8" />
                  : (() => {
                      const total = dist.reduce((s, d) => s + d.count, 0)
                      let offset = 0
                      return dist.map((d, i) => {
                        const dash = (d.count / total) * 100
                        const el = (
                          <circle key={d.prize_id} cx="18" cy="18" r="15.9" fill="none"
                            stroke={COLORS[i % COLORS.length]} strokeWidth="3.8"
                            strokeDasharray={`${dash} ${100 - dash}`}
                            strokeDashoffset={-offset} />
                        )
                        offset += dash
                        return el
                      })
                    })()
                }
              </svg>
            </div>
            <div>
              {dist.length === 0
                ? <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Aucune donnée</p>
                : dist.map((d, i) => (
                    <div key={d.prize_id} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem', fontSize: '0.88rem' }}>
                      <span style={{ width: 12, height: 12, borderRadius: '50%', background: COLORS[i % COLORS.length], display: 'inline-block', flexShrink: 0 }} />
                      <span>{d.prize_name} — {d.count}</span>
                    </div>
                  ))
              }
            </div>
          </div>
        </div>

        {/* Barres tickets/jour */}
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.1rem' }}>Courbes : Tickets utilisés par jour</h3>
          {tpd.length === 0
            ? <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}>Aucune donnée</p>
            : (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem', height: 120, paddingBottom: '0.5rem', borderBottom: '1px solid var(--cream-border)', overflowX: 'auto' }}>
                {tpd.map((d, i) => (
                  <div key={i} style={{ flex: '0 0 auto', minWidth: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{d.count}</span>
                    <div style={{ width: '100%', background: 'var(--green-dark)', borderRadius: '4px 4px 0 0', height: `${Math.max((d.count / maxCount) * 100, 4)}px` }} />
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {new Date(d.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            )
          }
        </div>
      </div>

      {/* Alertes + résumé */}
      <div>
        <div style={{ background: 'var(--green-dark)', color: 'white', borderRadius: 'var(--radius-sm)', padding: '0.85rem 1.25rem', marginBottom: '1rem', fontWeight: 700, textAlign: 'center' }}>
          Alertes
        </div>
        {alerts.length === 0
          ? <div className="card" style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>Aucune alerte</div>
          : alerts.map(p => (
              <div key={p.id} className="card" style={{ padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
                <span style={{ color: 'var(--orange)', fontSize: '1.1rem' }}>⚠</span>
                <span style={{ fontSize: '0.85rem' }}>Stock <strong>{p.name}</strong> faible ({p.stock} restants)</span>
              </div>
            ))
        }

        {/* Stats rapides */}
        <div className="card" style={{ padding: '1rem', marginTop: '1rem' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 700 }}>RÉSUMÉ</p>
          {[
            ['Total participations', stats?.total_participations ?? '—'],
            ['Gagnants',             stats?.total_winners        ?? '—'],
            ['Réclamations',         stats?.total_redemptions    ?? '—'],
            ['En attente',           stats?.pending_redemptions  ?? '—'],
          ].map(([label, val]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.3rem 0', borderBottom: '1px solid var(--cream-border)' }}>
              <span style={{ color: 'var(--text-muted)' }}>{label}</span>
              <span style={{ fontWeight: 700 }}>{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Tickets & Gains ──────────────────────────────────────── */
function TicketsTab({ participations, onRefresh }) {
  const [modal, setModal] = useState(null)  // { p, mode: 'update'|'create' }

  const STATUS_LABELS = {
    pending:   'En préparation',
    approved:  'Disponible en boutique',
    completed: 'Remis',
    rejected:  'Refusé',
  }
  const STATUS_CLS = {
    pending:   's-prep',
    approved:  's-won',
    completed: 's-done',
    rejected:  's-lost',
  }
  const STATUS_OPTS = [
    { value: 'pending',   label: 'En préparation' },
    { value: 'approved',  label: 'Disponible en boutique' },
    { value: 'completed', label: 'Remis' },
    { value: 'rejected',  label: 'Refusé' },
  ]

  // Seules les participations gagnantes
  const winners = participations.filter(p => p.prize_id != null)

  function fmtDate(iso) {
    return iso ? new Date(iso).toLocaleDateString('fr-FR') : '—'
  }

  async function handleUpdate(vals) {
    try {
      await adminApi.updateRedemption(modal.p.redemption.id, vals.status)
      toast.success('Statut mis à jour.')
      setModal(null)
      onRefresh()
    } catch {
      toast.error('Erreur lors de la mise à jour.')
    }
  }

  async function handleCreate(vals) {
    // Créer une redemption pour cette participation
    try {
      await import('../../api/client.js').then(m =>
        m.default.post('redemptions', {
          participation_id: modal.p.id,
          method: vals.method,
        })
      )
      // Si statut != pending, mettre à jour immédiatement après création
      toast.success('Réclamation créée.')
      setModal(null)
      onRefresh()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur.')
    }
  }

  const exportCSV = () => {
    const rows = [['N° Ticket', 'Nom', 'Prénom', 'Mail', 'Lot', 'Date expiration', 'Statut']]
    winners.forEach(p => {
      rows.push([
        p.ticket_code?.code ?? '',
        p.user?.last_name   ?? '', p.user?.first_name ?? '',
        p.user?.email       ?? '',
        p.prize?.name       ?? '',
        fmtDate(p.expiry_date),
        p.redemption ? (STATUS_LABELS[p.redemption.status] ?? p.redemption.status) : 'En préparation',
      ])
    })
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = 'gains.csv'; a.click()
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.3rem' }}>Suivi des gains</h2>

      {winners.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          Aucune participation gagnante enregistrée.
        </div>
      ) : (
        <div className="card" style={{ overflow: 'auto' }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>N° Ticket</th><th>Nom</th><th>Prénom</th><th>Mail</th>
                <th>Lot</th><th>Date expiration</th><th>Statut</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {winners.map(p => {
                const status = p.redemption?.status
                const statusLabel = status ? STATUS_LABELS[status] : 'En préparation'
                const statusCls   = status ? STATUS_CLS[status]   : 's-prep'
                const isExpired   = p.expiry_date && new Date(p.expiry_date) < new Date()

                return (
                  <tr key={p.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>
                      {p.ticket_code?.code ?? '—'}
                    </td>
                    <td>{p.user?.last_name  ?? '—'}</td>
                    <td>{p.user?.first_name ?? '—'}</td>
                    <td style={{ fontSize: '0.83rem' }}>{p.user?.email ?? '—'}</td>
                    <td>{p.prize?.name ?? '—'}</td>
                    <td style={{ color: isExpired ? 'var(--error)' : undefined }}>
                      {fmtDate(p.expiry_date)}
                      {isExpired && <span style={{ fontSize: '0.7rem', marginLeft: '0.3rem', fontWeight: 700 }}>EXPIRÉ</span>}
                    </td>
                    <td>
                      <span className={`status ${statusCls}`}>{statusLabel}</span>
                    </td>
                    <td>
                      {p.redemption ? (
                        /* Réclamation existante → mettre à jour statut */
                        <button className="btn btn-orange"
                          style={{ padding: '0.3rem 0.85rem', fontSize: '0.78rem' }}
                          onClick={() => setModal({ p, mode: 'update' })}>
                          MAJ
                        </button>
                      ) : (
                        /* Pas encore de réclamation → en créer une */
                        <button className="btn btn-green"
                          style={{ padding: '0.3rem 0.85rem', fontSize: '0.78rem' }}
                          onClick={() => setModal({ p, mode: 'create' })}>
                          Créer
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal MAJ statut */}
      {modal?.mode === 'update' && (
        <Modal
          title="Mettre à jour le statut du lot"
          fields={[
            { name: 'lot',    label: 'Lot',    defaultValue: modal.p.prize?.name ?? '' },
            { name: 'status', label: 'Statut', type: 'select',
              defaultValue: modal.p.redemption?.status ?? 'pending',
              options: STATUS_OPTS },
          ]}
          onClose={() => setModal(null)}
          onSubmit={handleUpdate}
          submitLabel="Mettre à jour"
        />
      )}

      {/* Modal création réclamation */}
      {modal?.mode === 'create' && (
        <Modal
          title="Créer une réclamation"
          fields={[
            { name: 'lot',    label: 'Lot',    defaultValue: modal.p.prize?.name ?? '' },
            { name: 'method', label: 'Méthode de retrait', type: 'select', defaultValue: 'store',
              options: [
                { value: 'store',  label: 'En boutique' },
                { value: 'mail',   label: 'Par courrier' },
                { value: 'online', label: 'En ligne' },
              ]
            },
          ]}
          onClose={() => setModal(null)}
          onSubmit={handleCreate}
          submitLabel="Créer la réclamation"
        />
      )}
    </div>
  )
}

/* ─── Utilisateurs & droits ────────────────────────────────── */
function UsersTab({ users, onRefresh }) {
  const [modal, setModal] = useState(null)

  const ROLE_LABELS = { admin: 'Admin', employee: 'Éditeur', user: 'Utilisateur' }
  const ROLE_OPTS   = [
    { value: 'user',     label: 'Utilisateur' },
    { value: 'employee', label: 'Éditeur' },
    { value: 'admin',    label: 'Admin' },
  ]

  async function handleUpdate(vals) {
    try {
      await adminApi.updateUser(modal.id, {
        first_name: vals.first_name,
        last_name:  vals.last_name,
        email:      vals.email,
        role:       vals.role,
        ...(vals.password ? { password: vals.password } : {}),
      })
      toast.success('Utilisateur mis à jour.')
      setModal(null); onRefresh()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur.')
    }
  }

  async function handleAdd(vals) {
    try {
      await adminApi.createUser({
        first_name: vals.first_name,
        last_name:  vals.last_name,
        email:      vals.email,
        role:       vals.role,
        password:   vals.password || 'Password@1234',
      })
      toast.success('Utilisateur ajouté.')
      setModal(null); onRefresh()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur.')
    }
  }

  async function handleDelete(u) {
    if (!confirm(`Supprimer ${u.first_name} ${u.last_name} ?`)) return
    try {
      await adminApi.deleteUser(u.id)
      toast.success('Utilisateur supprimé.')
      onRefresh()
    } catch { toast.error('Erreur.') }
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.3rem' }}>Utilisateurs & droits</h2>
        <button className="btn btn-orange" style={{ fontSize: '0.88rem' }}
          onClick={() => setModal('add')}>
          Ajouter un utilisateur
        </button>
      </div>

      {users.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Aucun utilisateur.</div>
      ) : (
        <div className="card" style={{ overflow: 'auto' }}>
          <table className="tbl">
            <thead>
              <tr><th>Nom</th><th>Prénom</th><th>Mail</th><th>Droit</th><th>Action</th></tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.last_name  ?? '—'}</td>
                  <td>{u.first_name ?? '—'}</td>
                  <td style={{ fontSize: '0.85rem' }}>{u.email}</td>
                  <td>
                    <span className={`status ${u.role === 'admin' ? 's-done' : u.role === 'employee' ? 's-won' : 's-lost'}`}>
                      {ROLE_LABELS[u.role] ?? u.role}
                    </span>
                  </td>
                  <td style={{ display: 'flex', gap: '0.4rem' }}>
                    <button className="btn btn-orange"
                      style={{ padding: '0.3rem 0.85rem', fontSize: '0.78rem' }}
                      onClick={() => setModal(u)}>
                      MAJ
                    </button>
                    <button className="btn btn-outline"
                      style={{ padding: '0.3rem 0.85rem', fontSize: '0.78rem', color: 'var(--error)', borderColor: 'var(--error)' }}
                      onClick={() => handleDelete(u)}>
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && modal !== 'add' && (
        <Modal title="Mettre à jour l'utilisateur"
          fields={[
            { name: 'last_name',  label: 'Nom',    defaultValue: modal.last_name  || '' },
            { name: 'first_name', label: 'Prénom', defaultValue: modal.first_name || '' },
            { name: 'email',      label: 'Mail',   type: 'email', defaultValue: modal.email || '' },
            { name: 'role',       label: 'Rôle',   type: 'select', defaultValue: modal.role || 'user', options: ROLE_OPTS },
            { name: 'password',   label: 'Nouveau mot de passe (optionnel)', type: 'password', defaultValue: '' },
          ]}
          onClose={() => setModal(null)}
          onSubmit={handleUpdate}
          submitLabel="Mettre à jour"
        />
      )}

      {modal === 'add' && (
        <Modal title="Ajout utilisateur"
          fields={[
            { name: 'last_name',  label: 'Nom' },
            { name: 'first_name', label: 'Prénom' },
            { name: 'email',      label: 'Mail', type: 'email' },
            { name: 'password',   label: 'Mot de passe', type: 'password' },
            { name: 'role',       label: 'Rôle', type: 'select', defaultValue: 'user', options: ROLE_OPTS },
          ]}
          onClose={() => setModal(null)}
          onSubmit={handleAdd}
          submitLabel="Ajouter l'utilisateur"
        />
      )}
    </div>
  )
}

/* ─── Page Admin principale ────────────────────────────────── */
export default function AdminPage() {
  const [tab, setTab]             = useState(0)
  const [stats, setStats]         = useState(null)
  const [participations, setPartic] = useState([])
  const [users, setUsers]         = useState([])
  const [search, setSearch]       = useState('')
  const [loading, setLoading]     = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [s, p, u] = await Promise.allSettled([
        adminApi.stats(),
        // Toutes les participations avec user + prize + ticket + redemption
        adminApi.participations({ per_page: 200 }),
        adminApi.users(),
      ])
      if (s.status === 'fulfilled') setStats(s.value)
      if (p.status === 'fulfilled') setPartic(p.value.data ?? [])
      if (u.status === 'fulfilled') setUsers(u.value.data ?? [])
    } catch {}
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const q = search.toLowerCase()

  const filteredPartic = participations.filter(p => {
    if (!q) return true
    return (p.ticket_code?.code || '').toLowerCase().includes(q)
        || (p.user?.last_name   || '').toLowerCase().includes(q)
        || (p.user?.first_name  || '').toLowerCase().includes(q)
        || (p.user?.email       || '').toLowerCase().includes(q)
  })

  const filteredUsers = users.filter(u => {
    if (!q) return true
    return (u.last_name  || '').toLowerCase().includes(q)
        || (u.first_name || '').toLowerCase().includes(q)
        || (u.email      || '').toLowerCase().includes(q)
  })

  return (
    <div className="admin-wrap">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <img src="/images/Footer/img_01.png" alt="Thé Tip Top"
            style={{ width: 100, margin: '0 auto', filter: 'brightness(1.1)' }}
            onError={e => { e.target.style.display = 'none' }} />
        </div>
        {TABS.map((t, i) => (
          <button key={t} className={`admin-nav-item ${tab === i ? 'active' : ''}`}
            onClick={() => setTab(i)}>
            {t}
          </button>
        ))}
      </aside>

      {/* Main */}
      <div className="admin-main">
        <div className="admin-topbar">
          <div className="admin-search-wrap">
            <span className="admin-search-icon">🔍</span>
            <input className="admin-search"
              placeholder="Rechercher : N° Ticket, Nom, Prénom..."
              value={search}
              onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="btn btn-orange"
            style={{ fontSize: '0.85rem', padding: '0.55rem 1.25rem' }}
            onClick={load}>
            Rechercher
          </button>
          <button className="btn btn-orange"
            style={{ fontSize: '0.85rem', padding: '0.55rem 1.25rem' }}
            onClick={() => {
              // Export CSV selon l'onglet actif
              if (tab === 1) {
                const rows = [['N° Ticket','Nom','Prénom','Mail','Lot','Expiration','Statut']]
                filteredPartic.filter(p => p.prize_id).forEach(p => {
                  rows.push([
                    p.ticket_code?.code ?? '',
                    p.user?.last_name ?? '', p.user?.first_name ?? '',
                    p.user?.email ?? '',
                    p.prize?.name ?? '',
                    p.expiry_date ? new Date(p.expiry_date).toLocaleDateString('fr-FR') : '',
                    p.redemption?.status ?? 'pending',
                  ])
                })
                const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n')
                const a = document.createElement('a')
                a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
                a.download = 'gains.csv'; a.click()
              }
            }}>
            Exporter CSV
          </button>
        </div>

        {loading ? <LoadingSpinner /> : (
          <>
            {tab === 0 && <DashboardTab stats={stats} />}
            {tab === 1 && <TicketsTab   participations={filteredPartic} onRefresh={load} />}
            {tab === 2 && <UsersTab     users={filteredUsers}           onRefresh={load} />}
          </>
        )}
      </div>
    </div>
  )
}
