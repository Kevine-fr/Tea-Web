import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { participationsApi } from '../../api/participations.js'
import Layout from '../components/Layout.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import toast from 'react-hot-toast'

const STATUS_MAP = {
  pending:   { label: 'En attente',  cls: 'badge-pending' },
  approved:  { label: 'Approuvé',    cls: 'badge-green'   },
  rejected:  { label: 'Refusé',      cls: 'badge-error'   },
  completed: { label: 'Complété',    cls: 'badge-green'   },
}

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const [participations, setParticipations] = useState([])
  const [loading, setLoading]               = useState(true)
  const [ticketCode, setTicketCode]         = useState('')
  const [submitting, setSubmitting]         = useState(false)
  const [redeemingId, setRedeemingId]       = useState(null)

  useEffect(() => { fetchParticipations() }, [])

  async function fetchParticipations() {
    try {
      const data = await participationsApi.mine()
      setParticipations(data.data ?? data ?? [])
    } catch {
      toast.error('Impossible de charger vos participations.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmitTicket(e) {
    e.preventDefault()
    const code = ticketCode.trim().toUpperCase()
    if (!code || code.length < 6) {
      toast.error('Code invalide — vérifiez votre ticket.')
      return
    }
    setSubmitting(true)
    try {
      const res = await participationsApi.submit({ ticket_code: code })
      const won = res.data?.has_won ?? res.has_won
      const prize = res.data?.prize?.name ?? res.prize?.name

      if (won && prize) {
        toast.success(`🎉 Félicitations ! Vous avez gagné : ${prize}`, { duration: 6000 })
      } else {
        toast('Participation enregistrée. Meilleure chance la prochaine fois !', { icon: '🍵' })
      }
      setTicketCode('')
      fetchParticipations()
    } catch (err) {
      const msg = err.response?.data?.message || 'Code invalide ou déjà utilisé.'
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleRedeem(participationId) {
    setRedeemingId(participationId)
    try {
      await participationsApi.redeem({ participation_id: participationId, method: 'online' })
      toast.success('Demande de rachat envoyée !')
      fetchParticipations()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la demande.')
    } finally {
      setRedeemingId(null)
    }
  }

  const totalWins = participations.filter(p => p.has_won).length

  return (
    <Layout>
      <div style={{ background: 'var(--cream)', minHeight: '80vh', padding: '3rem 0' }}>
        <div className="container">

          {/* ── Header ─────────────────────────────────────────────── */}
          <div style={{
            background: 'var(--green-dark)',
            borderRadius: 'var(--radius)',
            padding: '2rem 2.5rem',
            color: 'white',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Espace participant</p>
              <h2 style={{ color: 'white', margin: 0 }}>
                Bonjour,{' '}
                <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>
                  {user?.first_name || user?.email || 'vous'} 👋
                </em>
              </h2>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              {[
                { val: participations.length, label: 'Participations' },
                { val: totalWins,             label: 'Lots gagnés' },
              ].map(({ val, label }) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--gold)', fontWeight: 700 }}>{val}</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Saisir un ticket ────────────────────────────────────── */}
          <div className="card" style={{ marginBottom: '2rem', padding: '2rem' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>🎫 Entrer un code ticket</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
              Trouvez le code à 8 caractères sur votre ticket de caisse Thé Tip Top.
            </p>
            <form onSubmit={handleSubmitTicket} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <input
                type="text"
                value={ticketCode}
                onChange={e => setTicketCode(e.target.value.toUpperCase())}
                placeholder="EX : TT-A1B2C3"
                maxLength={12}
                style={{
                  flex: 1,
                  minWidth: 200,
                  padding: '0.75rem 1rem',
                  border: '1.5px solid var(--cream-border)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '1rem',
                  fontFamily: 'monospace',
                  letterSpacing: '0.1em',
                  outline: 'none',
                  textTransform: 'uppercase',
                }}
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting || !ticketCode.trim()}
                style={{ padding: '0.75rem 2rem' }}
              >
                {submitting ? 'Vérification…' : 'Valider le ticket'}
              </button>
            </form>
          </div>

          {/* ── Mes participations ──────────────────────────────────── */}
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>📋 Mes participations</h3>

            {loading ? (
              <LoadingSpinner />
            ) : participations.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍵</div>
                <p>Aucune participation pour l'instant.</p>
                <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Entrez votre premier code ci-dessus !</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {participations.map(p => (
                  <div key={p.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem 1.25rem',
                    background: p.has_won ? 'rgba(212,180,74,.06)' : 'var(--cream)',
                    border: `1px solid ${p.has_won ? 'rgba(212,180,74,.3)' : 'var(--cream-border)'}`,
                    borderRadius: 'var(--radius-sm)',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                  }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', fontFamily: 'monospace' }}>
                        {p.ticket_code?.code ?? '—'}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                        {new Date(p.participation_date).toLocaleDateString('fr-FR', {
                          day: '2-digit', month: 'long', year: 'numeric',
                        })}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {p.has_won ? (
                        <>
                          <span style={{ fontWeight: 600, color: 'var(--gold-dark)', fontSize: '0.9rem' }}>
                            🏆 {p.prize?.name ?? 'Lot gagné'}
                          </span>
                          {!p.redemption && (
                            <button
                              className="btn btn-gold"
                              style={{ padding: '0.35rem 0.9rem', fontSize: '0.8rem' }}
                              onClick={() => handleRedeem(p.id)}
                              disabled={redeemingId === p.id}
                            >
                              {redeemingId === p.id ? '…' : 'Réclamer'}
                            </button>
                          )}
                          {p.redemption && (
                            <span className={`badge ${STATUS_MAP[p.redemption.status]?.cls}`}>
                              {STATUS_MAP[p.redemption.status]?.label}
                            </span>
                          )}
                        </>
                      ) : (
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          Pas de lot cette fois
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
