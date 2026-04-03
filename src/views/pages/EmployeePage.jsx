import { useState, useEffect } from 'react'
import { employeeApi } from '../../api/admin.js'
import Layout from '../components/Layout.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import toast from 'react-hot-toast'

export default function EmployeePage() {
  const [redemptions, setRedemptions] = useState([])
  const [loading, setLoading]         = useState(true)
  const [filter, setFilter]           = useState('pending')

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      const data = await employeeApi.redemptions()
      setRedemptions(data.data ?? data ?? [])
    } catch {
      toast.error('Impossible de charger les demandes.')
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdate(id, status) {
    try {
      await employeeApi.updateRedemption(id, { status })
      toast.success(status === 'completed' ? 'Lot remis au client ✓' : 'Demande mise à jour.')
      load()
    } catch {
      toast.error('Erreur lors de la mise à jour.')
    }
  }

  const filtered = filter === 'all' ? redemptions : redemptions.filter(r => r.status === filter)

  return (
    <Layout>
      <div style={{ background: 'var(--cream)', minHeight: '80vh' }}>

        {/* Header */}
        <div style={{ background: 'var(--green-dark)', padding: '2rem 0', marginBottom: '2rem' }}>
          <div className="container">
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Espace employé</p>
            <h2 style={{ color: 'white', margin: 0 }}>Gestion des remises de lots</h2>
          </div>
        </div>

        <div className="container" style={{ paddingBottom: '3rem' }}>
          {/* Filtres */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            {[
              { val: 'pending',   label: 'En attente' },
              { val: 'approved',  label: 'Approuvés' },
              { val: 'completed', label: 'Complétés' },
              { val: 'all',       label: 'Tous' },
            ].map(({ val, label }) => (
              <button
                key={val}
                onClick={() => setFilter(val)}
                className="btn"
                style={{
                  padding: '0.4rem 1rem',
                  fontSize: '0.85rem',
                  background: filter === val ? 'var(--green-mid)' : 'white',
                  color: filter === val ? 'white' : 'var(--text-muted)',
                  border: '1.5px solid',
                  borderColor: filter === val ? 'var(--green-mid)' : 'var(--cream-border)',
                }}
              >
                {label}
                {val !== 'all' && (
                  <span style={{
                    marginLeft: '0.4rem',
                    background: filter === val ? 'rgba(255,255,255,0.2)' : 'var(--cream-dark)',
                    borderRadius: '10px',
                    padding: '0.05rem 0.45rem',
                    fontSize: '0.75rem',
                  }}>
                    {redemptions.filter(r => r.status === val).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Liste */}
          {loading ? <LoadingSpinner /> : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎁</div>
              <p>Aucune demande dans cette catégorie.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {filtered.map(r => (
                <div key={r.id} className="card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '1rem' }}>
                          {r.participation?.user?.email ?? r.participation?.user?.first_name ?? '—'}
                        </span>
                        <span className={`badge badge-${
                          r.status === 'pending'   ? 'pending' :
                          r.status === 'completed' ? 'green' : 'error'
                        }`}>
                          {{
                            pending:   '⏳ En attente',
                            approved:  '✓ Approuvé',
                            completed: '✅ Complété',
                            rejected:  '✕ Refusé',
                          }[r.status] ?? r.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        🏆 {r.participation?.prize?.name ?? 'Lot non précisé'}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        Méthode : <strong>{r.method}</strong> · Demandé le {new Date(r.requested_at).toLocaleDateString('fr-FR')}
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      {r.status === 'approved' && (
                        <button
                          className="btn btn-primary"
                          style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem' }}
                          onClick={() => handleUpdate(r.id, 'completed')}
                        >
                          ✅ Marquer remis
                        </button>
                      )}
                      {r.status === 'pending' && (
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          En attente d'approbation admin
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
