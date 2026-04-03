import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { adminApi } from '../../api/admin.js'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import toast from 'react-hot-toast'

const TABS = ['Dashboard', 'Tickets & Gains', 'Utilisateurs & droits']

/* ─── Modal générique ──────────────────────────────────── */
function Modal({ title, fields, onClose, onSubmit, submitLabel = 'Mettre à jour' }) {
  const [vals, setVals] = useState(
    Object.fromEntries(fields.map(f => [f.name, f.defaultValue || '']))
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
                onChange={e => set(f.name, e.target.value)} placeholder={f.placeholder || f.label} />
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

/* ─── Dashboard tab ────────────────────────────────────── */
function DashboardTab({ stats, participations }) {
  const won   = (participations || []).filter(p => p.prize_id).length
  const total = (participations || []).length

  const prizes = {}
  ;(participations || []).forEach(p => {
    if (p.prize?.name) prizes[p.prize.name] = (prizes[p.prize.name] || 0) + 1
  })
  const prizeNames  = Object.keys(prizes)
  const prizeColors = ['#1a3c2e', '#f0ebe0', '#e8431a']

  return (
    <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.5rem', alignItems: 'start' }}>
      <div>
        {/* Donut chart */}
        <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.1rem' }}>Répartition des gains</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div style={{ position: 'relative', width: 160, height: 160, flexShrink: 0 }}>
              <svg viewBox="0 0 36 36" style={{ width: 160, height: 160, transform: 'rotate(-90deg)' }}>
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f0ebe0" strokeWidth="3.8" />
                {prizeNames.length === 0 ? (
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2d9c8" strokeWidth="3.8" />
                ) : (() => {
                  let offset = 0
                  return prizeNames.map((name, i) => {
                    const pct = Math.round((prizes[name] / total) * 100)
                    const dash = (pct / 100) * 100
                    const el = (
                      <circle key={name} cx="18" cy="18" r="15.9" fill="none"
                        stroke={prizeColors[i % prizeColors.length]} strokeWidth="3.8"
                        strokeDasharray={`${dash} ${100 - dash}`}
                        strokeDashoffset={-offset} />
                    )
                    offset += dash
                    return el
                  })
                })()}
              </svg>
            </div>
            <div>
              {prizeNames.map((name, i) => (
                <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem', fontSize: '0.88rem' }}>
                  <span style={{ width: 12, height: 12, borderRadius: '50%', background: prizeColors[i % prizeColors.length], display: 'inline-block', flexShrink: 0 }} />
                  <span>{name}</span>
                </div>
              ))}
              {prizeNames.length === 0 && (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Aucune donnée</p>
              )}
            </div>
          </div>
        </div>

        {/* Bar chart */}
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.1rem' }}>Courbes : Tickets utilisés par jour</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1.5rem', height: 120, paddingBottom: '0.5rem', borderBottom: '1px solid var(--cream-border)' }}>
            {[30, 50, 45, 60].map((h, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{h}</span>
                <div style={{ width: '100%', background: 'var(--green-dark)', borderRadius: '4px 4px 0 0', height: `${(h / 60) * 100}px` }} />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{`0${i+1}/04`}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alertes */}
      <div>
        <div style={{ background: 'var(--green-dark)', color: 'white', borderRadius: 'var(--radius-sm)', padding: '0.85rem 1.25rem', marginBottom: '1rem', fontWeight: 700, textAlign: 'center' }}>
          Alertes
        </div>
        {stats?.low_stock_prizes?.length > 0 ? stats.low_stock_prizes.map(p => (
          <div key={p.id} className="card" style={{ padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
            <span style={{ color: 'var(--orange)', fontSize: '1.1rem' }}>⚠</span>
            <span style={{ fontSize: '0.85rem' }}>Stock {p.name} faible</span>
          </div>
        )) : (
          <div className="card" style={{ padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ color: 'var(--orange)', fontSize: '1.1rem' }}>⚠</span>
            <span style={{ fontSize: '0.85rem' }}>Stock lot 2 faible</span>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Tickets & Gains tab ──────────────────────────────── */
function TicketsTab({ participations, onRefresh }) {
  const [modal, setModal]   = useState(null)  // { id, prize, status }
  const [search, setSearch] = useState('')

  const filtered = (participations || []).filter(p => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      (p.ticket_code_id || '').toLowerCase().includes(q) ||
      (p.user?.last_name  || '').toLowerCase().includes(q) ||
      (p.user?.first_name || '').toLowerCase().includes(q) ||
      (p.user?.email      || '').toLowerCase().includes(q)
    )
  })

  async function handleUpdate(vals) {
    try {
      await adminApi.updateRedemption(modal.redemptionId, vals.status)
      toast.success('Statut mis à jour.')
      setModal(null)
      onRefresh()
    } catch {
      toast.error('Erreur lors de la mise à jour.')
    }
  }

  const exportCSV = () => {
    const rows = [['N° Ticket', 'Nom', 'Prénom', 'Mail', 'Lot', 'Statut']]
    filtered.forEach(p => {
      rows.push([
        p.ticket_code_id ?? '',
        p.user?.last_name ?? '', p.user?.first_name ?? '',
        p.user?.email ?? '',
        p.prize?.name ?? '',
        p.redemption?.status ?? '',
      ])
    })
    const csv = rows.map(r => r.join(',')).join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = 'gains.csv'
    a.click()
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.3rem' }}>Suivi de mes gains</h2>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          Aucune participation trouvée.
        </div>
      ) : (
        <div className="card" style={{ overflow: 'auto' }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>N° Ticket</th><th>Nom</th><th>Prénom</th><th>Mail</th>
                <th>Lot</th><th>Date limite</th><th>Statut</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const deadline = p.participation_date
                  ? new Date(new Date(p.participation_date).getTime() + 60*24*60*60*1000).toLocaleDateString('fr-FR')
                  : '—'
                const status = p.redemption?.status
                const statusLabel = {
                  pending: 'En attente', approved: 'Disponible en boutique',
                  completed: 'Remis', rejected: 'Refusé',
                }[status] || (p.prize_id ? 'En préparation' : '—')

                return (
                  <tr key={p.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{p.ticket_code_id ?? '—'}</td>
                    <td>{p.user?.last_name  ?? '—'}</td>
                    <td>{p.user?.first_name ?? '—'}</td>
                    <td style={{ fontSize: '0.83rem' }}>{p.user?.email ?? '—'}</td>
                    <td>{p.prize?.name ?? '—'}</td>
                    <td>{deadline}</td>
                    <td>{statusLabel}</td>
                    <td>
                      {p.redemption && (
                        <button className="btn btn-orange"
                          style={{ padding: '0.3rem 0.85rem', fontSize: '0.78rem' }}
                          onClick={() => setModal({ id: p.id, redemptionId: p.redemption.id, prize: p.prize?.name, status: p.redemption.status })}>
                          MAJ
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

      {modal && (
        <Modal
          title="Mettre à jour le statut du lot"
          fields={[
            { name: 'lot',    label: 'Lot',    defaultValue: modal.prize ?? '' },
            { name: 'status', label: 'Statut', type: 'select', defaultValue: modal.status,
              options: [
                { value: 'pending',   label: 'En attente' },
                { value: 'approved',  label: 'Disponible en boutique' },
                { value: 'completed', label: 'Remis' },
                { value: 'rejected',  label: 'Refusé' },
              ]
            },
          ]}
          onClose={() => setModal(null)}
          onSubmit={handleUpdate}
          submitLabel="Mettre à jour"
        />
      )}
    </div>
  )
}

/* ─── Users tab ────────────────────────────────────────── */
function UsersTab({ users, onRefresh }) {
  const [modal, setModal]  = useState(null)  // null | 'add' | user object
  const [search, setSearch] = useState('')

  const filtered = (users || []).filter(u => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      (u.last_name  || '').toLowerCase().includes(q) ||
      (u.first_name || '').toLowerCase().includes(q) ||
      (u.email      || '').toLowerCase().includes(q)
    )
  })

  async function handleUpdate(vals) {
    try {
      // PUT /admin/users/{id} — endpoint à adapter selon votre API
      await import('../../api/client.js').then(m =>
        m.default.put(`admin/users/${modal.id}`, vals)
      )
      toast.success('Utilisateur mis à jour.')
      setModal(null)
      onRefresh()
    } catch {
      toast.error('Erreur lors de la mise à jour.')
    }
  }

  async function handleAdd(vals) {
    try {
      await import('../../api/client.js').then(m =>
        m.default.post('admin/users', vals)
      )
      toast.success('Utilisateur ajouté.')
      setModal(null)
      onRefresh()
    } catch {
      toast.error('Erreur lors de l\'ajout.')
    }
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

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Aucun utilisateur.</div>
      ) : (
        <div className="card" style={{ overflow: 'auto' }}>
          <table className="tbl">
            <thead>
              <tr><th>Nom</th><th>Prénom</th><th>Mail</th><th>Droit</th><th>Action</th></tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td>{u.last_name  ?? '—'}</td>
                  <td>{u.first_name ?? '—'}</td>
                  <td style={{ fontSize: '0.85rem' }}>{u.email}</td>
                  <td>
                    <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>
                      {{ admin: 'Admin', employee: 'Editeur', user: 'Utilisateur' }[u.role] || u.role}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-orange"
                      style={{ padding: '0.3rem 0.85rem', fontSize: '0.78rem' }}
                      onClick={() => setModal(u)}>
                      MAJ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Update modal */}
      {modal && modal !== 'add' && (
        <Modal
          title="Mettre à jour l'utilisateur"
          fields={[
            { name: 'last_name',  label: 'Nom',    defaultValue: modal.last_name  || '' },
            { name: 'first_name', label: 'Prenom', defaultValue: modal.first_name || '' },
            { name: 'email',      label: 'Mail',   defaultValue: modal.email      || '', type: 'email' },
            { name: 'role',       label: 'Role',   type: 'select', defaultValue: modal.role || 'user',
              options: [
                { value: 'user', label: 'Utilisateur' },
                { value: 'employee', label: 'Editeur' },
                { value: 'admin', label: 'Admin' },
              ]
            },
          ]}
          onClose={() => setModal(null)}
          onSubmit={handleUpdate}
          submitLabel="Mettre à jour"
        />
      )}

      {/* Add modal */}
      {modal === 'add' && (
        <Modal
          title="Ajout utilisateur"
          fields={[
            { name: 'last_name',  label: 'Nom' },
            { name: 'first_name', label: 'Prenom' },
            { name: 'email',      label: 'Mail', type: 'email' },
            { name: 'role',       label: 'Role', type: 'select', defaultValue: 'user',
              options: [
                { value: 'user', label: 'Utilisateur' },
                { value: 'employee', label: 'Editeur' },
                { value: 'admin', label: 'Admin' },
              ]
            },
          ]}
          onClose={() => setModal(null)}
          onSubmit={handleAdd}
          submitLabel="Ajouter l'utilisateur"
        />
      )}
    </div>
  )
}

/* ─── Page principale Admin ────────────────────────────── */
export default function AdminPage() {
  const { user, logout } = useAuth()
  const [tab, setTab]               = useState(0)
  const [stats, setStats]           = useState(null)
  const [participations, setPartic] = useState([])
  const [users, setUsers]           = useState([])
  const [search, setSearch]         = useState('')
  const [loading, setLoading]       = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [s, p, u] = await Promise.allSettled([
        adminApi.stats(),
        adminApi.participations(),
        import('../../api/client.js').then(m => m.default.get('admin/users').then(r => r.data)),
      ])
      if (s.status === 'fulfilled') setStats(s.value)
      if (p.status === 'fulfilled') setPartic(p.value.data ?? p.value ?? [])
      if (u.status === 'fulfilled') setUsers(u.value.data ?? u.value ?? [])
    } catch {}
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  return (
    <div className="admin-wrap">
      {/* ── Sidebar ───────────────────────────────────── */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <img src="/images/Footer/img_01.png" alt="Thé Tip Top"
            style={{ width: 100, margin: '0 auto', filter: 'brightness(1.1)' }} />
        </div>
        {TABS.map((t, i) => (
          <button key={t} className={`admin-nav-item ${tab === i ? 'active' : ''}`}
            onClick={() => setTab(i)}>
            {t}
          </button>
        ))}
      </aside>

      {/* ── Main ──────────────────────────────────────── */}
      <div className="admin-main">
        {/* Topbar */}
        <div className="admin-topbar">
          <div className="admin-search-wrap">
            <span className="admin-search-icon">🔍</span>
            <input
              className="admin-search"
              placeholder="Rechercher : N° Ticket, Nom, Prénom..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="btn btn-orange" style={{ fontSize: '0.85rem', padding: '0.55rem 1.25rem' }}
            onClick={() => {}}>
            Rechercher
          </button>
          <button className="btn btn-orange" style={{ fontSize: '0.85rem', padding: '0.55rem 1.25rem' }}>
            Exporter CSV
          </button>
        </div>

        {/* Content */}
        {loading ? <LoadingSpinner /> : (
          <>
            {tab === 0 && <DashboardTab stats={stats} participations={participations} />}
            {tab === 1 && <TicketsTab   participations={participations.filter(p => {
              if (!search) return true
              const q = search.toLowerCase()
              return (p.ticket_code_id||'').toLowerCase().includes(q) ||
                     (p.user?.last_name||'').toLowerCase().includes(q) ||
                     (p.user?.email||'').toLowerCase().includes(q)
            })} onRefresh={load} />}
            {tab === 2 && <UsersTab users={users.filter(u => {
              if (!search) return true
              const q = search.toLowerCase()
              return (u.last_name||'').toLowerCase().includes(q) ||
                     (u.email||'').toLowerCase().includes(q)
            })} onRefresh={load} />}
          </>
        )}
      </div>
    </div>
  )
}
