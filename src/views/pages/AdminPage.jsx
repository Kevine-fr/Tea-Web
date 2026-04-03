import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { adminApi } from '../../api/admin.js'
import Layout from '../components/Layout.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import toast from 'react-hot-toast'

const TABS = ['Tableau de bord', 'Participations', 'Utilisateurs', 'Rachat de lots']

export default function AdminPage() {
  const { logout } = useAuth()
  const [activeTab, setActiveTab] = useState(0)
  const [stats, setStats]         = useState(null)
  const [participations, setParticipations] = useState([])
  const [users, setUsers]         = useState([])
  const [redemptions, setRedemptions] = useState([])
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    loadAll()
  }, [])

  async function loadAll() {
    setLoading(true)
    try {
      const [s, p, u, r] = await Promise.allSettled([
        adminApi.stats(),
        adminApi.participations(),
        adminApi.users(),
        adminApi.redemptions(),
      ])
      if (s.status === 'fulfilled') setStats(s.value.data ?? s.value)
      if (p.status === 'fulfilled') setParticipations(p.value.data ?? p.value ?? [])
      if (u.status === 'fulfilled') setUsers(u.value.data ?? u.value ?? [])
      if (r.status === 'fulfilled') setRedemptions(r.value.data ?? r.value ?? [])
    } catch { /* errors handled by client interceptor */ }
    finally { setLoading(false) }
  }

  async function handleRedemption(id, status) {
    try {
      await adminApi.updateRedemption(id, { status })
      toast.success(`Demande ${status === 'approved' ? 'approuvée' : 'refusée'}.`)
      const updated = await adminApi.redemptions()
      setRedemptions(updated.data ?? updated ?? [])
    } catch {
      toast.error('Erreur lors de la mise à jour.')
    }
  }

  return (
    <Layout>
      <div style={{ background: 'var(--cream)', minHeight: '80vh' }}>

        {/* ── Header ─────────────────────────────────────────────── */}
        <div style={{ background: 'var(--green-dark)', padding: '2rem 0' }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Administration</p>
              <h2 style={{ color: 'white', margin: 0 }}>Tableau de bord</h2>
            </div>
            <button onClick={logout} style={{
              background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.2)',
              color: 'rgba(255,255,255,.7)', padding: '0.5rem 1.2rem', borderRadius: '6px',
              cursor: 'pointer', fontSize: '0.85rem',
            }}>
              Déconnexion
            </button>
          </div>
        </div>

        {/* ── Tabs ───────────────────────────────────────────────── */}
        <div style={{ background: 'white', borderBottom: '1px solid var(--cream-border)' }}>
          <div className="container" style={{ display: 'flex', gap: 0 }}>
            {TABS.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                style={{
                  padding: '1rem 1.5rem',
                  border: 'none',
                  background: 'none',
                  fontSize: '0.9rem',
                  fontWeight: activeTab === i ? 700 : 400,
                  color: activeTab === i ? 'var(--green-mid)' : 'var(--text-muted)',
                  borderBottom: activeTab === i ? '2px solid var(--green-mid)' : '2px solid transparent',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                  whiteSpace: 'nowrap',
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* ── Content ────────────────────────────────────────────── */}
        <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
          {loading ? <LoadingSpinner /> : (
            <>
              {/* ── Stats ────────────────────────────────── */}
              {activeTab === 0 && (
                <div>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1.25rem',
                    marginBottom: '2rem',
                  }}>
                    {[
                      { icon: '🎫', label: 'Participations totales', val: stats?.total_participations ?? participations.length },
                      { icon: '🏆', label: 'Lots gagnés',            val: stats?.total_wins          ?? participations.filter(p => p.has_won).length },
                      { icon: '👥', label: 'Utilisateurs inscrits',  val: stats?.total_users         ?? users.length },
                      { icon: '🔄', label: 'Rachats en attente',     val: stats?.pending_redemptions ?? redemptions.filter(r => r.status === 'pending').length },
                    ].map(({ icon, label, val }) => (
                      <div key={label} className="card" style={{ textAlign: 'center', padding: '1.75rem' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{icon}</div>
                        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 700, color: 'var(--green-dark)' }}>{val}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Taux de gains */}
                  {stats?.win_rate !== undefined && (
                    <div className="card" style={{ padding: '1.5rem' }}>
                      <h4 style={{ marginBottom: '1rem' }}>Taux de participation</h4>
                      <div style={{ background: 'var(--cream-dark)', borderRadius: '6px', height: 12, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${Math.min(stats.win_rate, 100)}%`,
                          background: 'var(--green-mid)',
                          borderRadius: '6px',
                          transition: 'width 1s ease',
                        }} />
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                        {stats.win_rate}% des tickets ont été joués
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* ── Participations ───────────────────────── */}
              {activeTab === 1 && (
                <DataTable
                  data={participations}
                  columns={[
                    { key: 'ticket_code.code',    label: 'Code ticket', render: p => <code>{p.ticket_code?.code ?? '—'}</code> },
                    { key: 'user.email',           label: 'Utilisateur', render: p => <span style={{ fontSize: '0.85rem' }}>{p.user?.email ?? '—'}</span> },
                    { key: 'participation_date',   label: 'Date',        render: p => new Date(p.participation_date).toLocaleDateString('fr-FR') },
                    { key: 'has_won',              label: 'Résultat',    render: p => p.has_won
                      ? <span className="badge badge-gold">🏆 Gagné</span>
                      : <span className="badge" style={{ background: 'var(--cream-dark)', color: 'var(--text-muted)' }}>Perdu</span>
                    },
                    { key: 'prize.name',           label: 'Lot',         render: p => p.prize?.name ?? '—' },
                  ]}
                  emptyMsg="Aucune participation enregistrée."
                />
              )}

              {/* ── Utilisateurs ─────────────────────────── */}
              {activeTab === 2 && (
                <DataTable
                  data={users}
                  columns={[
                    { key: 'email',      label: 'E-mail',        render: u => u.email },
                    { key: 'first_name', label: 'Prénom',        render: u => u.first_name ?? '—' },
                    { key: 'last_name',  label: 'Nom',           render: u => u.last_name  ?? '—' },
                    { key: 'role.name',  label: 'Rôle',          render: u => <span className="badge badge-green">{u.role?.name ?? 'user'}</span> },
                    { key: 'created_at', label: 'Inscrit le',    render: u => new Date(u.created_at).toLocaleDateString('fr-FR') },
                  ]}
                  emptyMsg="Aucun utilisateur."
                />
              )}

              {/* ── Rachats ──────────────────────────────── */}
              {activeTab === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {redemptions.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', padding: '2rem', textAlign: 'center' }}>Aucune demande de rachat.</p>
                  ) : redemptions.map(r => (
                    <div key={r.id} className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                          {r.participation?.user?.email ?? '—'}
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                          Lot : {r.participation?.prize?.name ?? '—'} · Méthode : {r.method} · {new Date(r.requested_at).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span className={`badge badge-${r.status === 'pending' ? 'pending' : r.status === 'approved' ? 'green' : 'error'}`}>
                          {r.status === 'pending' ? 'En attente' : r.status === 'approved' ? 'Approuvé' : 'Refusé'}
                        </span>
                        {r.status === 'pending' && (
                          <>
                            <button className="btn btn-primary" style={{ padding: '0.35rem 0.9rem', fontSize: '0.8rem' }}
                              onClick={() => handleRedemption(r.id, 'approved')}>✓ Approuver</button>
                            <button className="btn" style={{ padding: '0.35rem 0.9rem', fontSize: '0.8rem', background: 'rgba(192,57,43,.1)', color: 'var(--error)', border: '1px solid rgba(192,57,43,.2)' }}
                              onClick={() => handleRedemption(r.id, 'rejected')}>✕ Refuser</button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  )
}

// ── Composant table réutilisable ───────────────────────────────────────────────
function DataTable({ data, columns, emptyMsg }) {
  if (data.length === 0) {
    return <p style={{ color: 'var(--text-muted)', padding: '2rem', textAlign: 'center' }}>{emptyMsg}</p>
  }
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
        <thead>
          <tr style={{ background: 'var(--cream-dark)' }}>
            {columns.map(c => (
              <th key={c.key} style={{
                padding: '0.75rem 1rem', textAlign: 'left',
                fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.05em',
                textTransform: 'uppercase', color: 'var(--green-dark)',
                borderBottom: '2px solid var(--cream-border)',
              }}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={row.id ?? i} style={{ borderBottom: '1px solid var(--cream-border)', background: i % 2 === 0 ? 'white' : 'var(--cream)' }}>
              {columns.map(c => (
                <td key={c.key} style={{ padding: '0.75rem 1rem', verticalAlign: 'middle' }}>
                  {c.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
