import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { participationsApi } from '../../api/participations.js'
import Layout from '../components/Layout.jsx'
import PageBanner from '../components/PageBanner.jsx'
import AnimatedLeaves from '../components/AnimatedLeaves.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import toast from 'react-hot-toast'

export default function DashboardPage() {
  const { user } = useAuth()
  const [participations, setParticipations] = useState([])
  const [loading, setLoading]               = useState(true)
  const [code, setCode]                     = useState('')
  const [submitting, setSubmitting]         = useState(false)

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    try {
      const res = await participationsApi.mine()
      setParticipations(res.data ?? [])
    } catch { toast.error('Impossible de charger vos participations.') }
    finally  { setLoading(false) }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const c = code.trim()
    if (!c) return
    setSubmitting(true)
    try {
      const res = await participationsApi.submit(c)
      const won = res.data?.prize_id != null
      if (won) toast.success('🎉 Félicitations ! Vous avez gagné !', { duration: 6000 })
      else     toast('Participation enregistrée. Bonne chance !', { icon: '🍵' })
      setCode('')
      fetchAll()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Code invalide ou déjà utilisé.')
    } finally { setSubmitting(false) }
  }

  return (
    <Layout>
      <PageBanner title="Tableau de bord" />

      <div style={{ position: 'relative', background: 'var(--cream)', padding: '2.5rem 1.5rem 4rem', overflow: 'hidden' }}>
        <AnimatedLeaves />

        <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: 980 }}>

          {/* ── Saisie code ── */}
          <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
            Saisir mon code de participation
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '200px 1fr',
            gap: '1.5rem',
            alignItems: 'center',
            marginBottom: '3rem',
          }}>
            {/* Logo card */}
            <div className="card" style={{
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 160,
            }}>
              <img src="/images/Header/img_01.png" alt="logo"
                style={{ width: 110, height: 'auto' }}
                onError={e => { e.target.style.display = 'none' }} />
            </div>

            {/* Code form */}
            <div className="card" style={{ padding: '2rem' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                Entrez votre N° de ticket
              </p>
              <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  placeholder="Code ticket.."
                  maxLength={15}
                  style={{
                    flex: 1, minWidth: 200,
                    padding: '0.75rem 1.25rem',
                    border: '1.5px solid var(--cream-border)',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.95rem', fontFamily: 'monospace',
                    letterSpacing: '0.08em', outline: 'none',
                  }}
                />
                <button type="submit" className="btn btn-orange"
                  disabled={submitting || !code.trim()}
                  style={{ padding: '0.75rem 2.5rem', fontSize: '0.95rem', whiteSpace: 'nowrap' }}>
                  {submitting ? '…' : 'Valider'}
                </button>
              </form>
            </div>
          </div>

          {/* ── Mes participations ── */}
          <div style={{ background: 'var(--cream-card)', borderRadius: 20, padding: '2.5rem' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
              Mes participations au jeu-concours
            </h2>

            {loading ? <LoadingSpinner /> : participations.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Aucune participation pour l'instant.</p>
                <p style={{ fontSize: '0.85rem' }}>Entrez votre premier code ci-dessus !</p>
              </div>
            ) : (
              <div className="card" style={{ overflow: 'auto' }}>
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>N° Ticket</th>
                      <th>Résultat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participations.map(p => (
                      <tr key={p.id}>
                        <td style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '0.95rem' }}>
                          {p.ticket_code_id ?? p.id?.slice(0, 8) ?? '—'}
                        </td>
                        <td>
                          {p.prize_id
                            ? <span className="status s-won">Gagné</span>
                            : <span className="status s-lost">Non gagné</span>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div style={{ textAlign: 'center', marginTop: '1.75rem' }}>
              <Link to="/mes-gains" className="btn btn-green" style={{ fontSize: '0.92rem' }}>
                Voir le suivi de mes gains →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
