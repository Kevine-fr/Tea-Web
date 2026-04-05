import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { participationsApi } from '../../api/participations.js'
import Layout from '../components/Layout.jsx'
import PageBanner from '../components/PageBanner.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import toast from 'react-hot-toast'

/* ─── Styles d'animation ─────────────────────────────────── */
const STYLES = `
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-24px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(24px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes pulse-ring {
    0%   { box-shadow: 0 0 0 0   rgba(200,100,40,.35); }
    70%  { box-shadow: 0 0 0 10px rgba(200,100,40,0); }
    100% { box-shadow: 0 0 0 0   rgba(200,100,40,0); }
  }
  @keyframes codeWiggle {
    0%, 100% { transform: rotate(0deg); }
    25%       { transform: rotate(-2deg); }
    75%       { transform: rotate(2deg); }
  }
  @keyframes rowIn {
    from { opacity: 0; transform: translateX(-12px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes winBadge {
    0%   { transform: scale(0.7); opacity: 0; }
    60%  { transform: scale(1.12); }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes emptyFloat {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-6px); }
  }
  @keyframes logoBreath {
    0%, 100% { transform: scale(1); }
    50%       { transform: scale(1.04); }
  }
  @keyframes lineGrow {
    from { width: 0; }
    to   { width: 48px; }
  }

  /* ── Titre principal ── */
  .dash-title {
    animation: slideUp .5s ease both;
  }

  /* ── Section code ── */
  .dash-logo-card {
    animation: slideInLeft .55s ease .1s both;
  }
  .dash-logo-card img {
    animation: logoBreath 3.5s ease-in-out infinite;
  }
  .dash-code-card {
    animation: slideInRight .55s ease .15s both;
  }

  /* ── Input code ── */
  .dash-code-input {
    transition: border-color .25s ease, box-shadow .25s ease, background .25s ease;
    background: white;
  }
  .dash-code-input:focus {
    outline: none;
    border-color: var(--green-mid, #6a8f5a) !important;
    box-shadow: 0 0 0 3px rgba(106,143,90,.15);
    background: #fafffe;
  }
  .dash-code-input:not(:placeholder-shown) {
    border-color: var(--orange, #c8723a);
    letter-spacing: 0.12em;
  }

  /* ── Bouton valider ── */
  .dash-btn-validate {
    position: relative;
    overflow: hidden;
    transition: transform .2s ease, box-shadow .2s ease;
  }
  .dash-btn-validate:not(:disabled):hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(200,100,40,.3);
    animation: pulse-ring 1.4s ease-out infinite;
  }
  .dash-btn-validate:not(:disabled):active {
    transform: translateY(0);
  }
  .dash-btn-validate::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.25), transparent);
    background-size: 200% 100%;
    opacity: 0;
    transition: opacity .2s;
  }
  .dash-btn-validate:not(:disabled):hover::after {
    opacity: 1;
    animation: shimmer 1s linear infinite;
  }

  /* ── Section participations ── */
  .dash-participations {
    animation: slideUp .55s ease .25s both;
  }

  /* ── Sous-titre avec underline ── */
  .dash-section-underline {
    display: block;
    height: 2px;
    width: 48px;
    background: var(--orange, #c8723a);
    border-radius: 4px;
    margin: 0.4rem auto 1.5rem;
    animation: lineGrow .5s ease .35s both;
  }

  /* ── Lignes tableau ── */
  .dash-tbl-row {
    animation: rowIn .4s ease both;
  }

  /* ── Badges statut ── */
  .s-won  { animation: winBadge .4s ease both; }

  /* ── État vide ── */
  .dash-empty-icon {
    display: block;
    font-size: 2.4rem;
    margin-bottom: 0.75rem;
    animation: emptyFloat 3s ease-in-out infinite;
  }

  /* ── Bouton voir gains ── */
  .dash-btn-gains {
    transition: transform .2s ease, box-shadow .2s ease, background .2s ease;
  }
  .dash-btn-gains:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(80,120,60,.25);
  }

  /* ── Déco fond ── */
  .dash-deco {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
  }
`

function useReveal(threshold = 0.12) {
  const [vis, setVis] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect() } },
      { threshold }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return [ref, vis]
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [participations, setParticipations] = useState([])
  const [loading, setLoading]               = useState(true)
  const [code, setCode]                     = useState('')
  const [submitting, setSubmitting]         = useState(false)
  const [btnRef, btnVis]                    = useReveal()

  /* Inject styles once */
  useEffect(() => {
    const id = '__dash-styles__'
    if (!document.getElementById(id)) {
      const el = document.createElement('style')
      el.id = id
      el.textContent = STYLES
      document.head.appendChild(el)
    }
  }, [])

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

        {/* ── Décorations fond ── */}
        <div className="dash-deco" style={{
          width: 380, height: 380,
          top: -120, right: -100,
          background: 'radial-gradient(circle, rgba(106,143,90,.07) 0%, transparent 70%)',
        }} />
        <div className="dash-deco" style={{
          width: 260, height: 260,
          bottom: -60, left: -60,
          background: 'radial-gradient(circle, rgba(200,100,40,.06) 0%, transparent 70%)',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: 980 }}>

          {/* ── Titre ── */}
          <h2 className="dash-title" style={{ textAlign: 'center', marginBottom: '2rem' }}>
            Saisir mon code de participation
          </h2>

          {/* ── Saisie code ── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '200px 1fr',
            gap: '1.5rem',
            alignItems: 'center',
            marginBottom: '3rem',
          }}>
            {/* Logo card */}
            <div className="card dash-logo-card" style={{
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
            <div className="card dash-code-card" style={{ padding: '2rem' }}>
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
                  className="dash-code-input"
                  style={{
                    flex: 1, minWidth: 200,
                    padding: '0.75rem 1.25rem',
                    border: '1.5px solid var(--cream-border)',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.95rem', fontFamily: 'monospace',
                    letterSpacing: '0.08em',
                  }}
                />
                <button
                  type="submit"
                  className="btn btn-orange dash-btn-validate"
                  disabled={submitting || !code.trim()}
                  style={{ padding: '0.75rem 2.5rem', fontSize: '0.95rem', whiteSpace: 'nowrap' }}
                >
                  {submitting ? '…' : 'Valider'}
                </button>
              </form>
            </div>
          </div>

          {/* ── Mes participations ── */}
          <div className="dash-participations" style={{
            background: 'var(--cream-card)',
            borderRadius: 20,
            padding: '2.5rem',
          }}>
            <h2 style={{ textAlign: 'center', marginBottom: 0 }}>
              Mes participations au jeu-concours
            </h2>
            <span className="dash-section-underline" />

            {loading ? (
              <LoadingSpinner />
            ) : participations.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                <span className="dash-empty-icon">🍵</span>
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
                    {participations.map((p, i) => (
                      <tr
                        key={p.id}
                        className="dash-tbl-row"
                        style={{ animationDelay: `${i * 0.06}s` }}
                      >
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

            <div ref={btnRef} style={{
              textAlign: 'center',
              marginTop: '1.75rem',
              opacity:   btnVis ? 1 : 0,
              transform: btnVis ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity .4s ease, transform .4s ease',
            }}>
              <Link to="/mes-gains" className="btn btn-green dash-btn-gains"
                style={{ fontSize: '0.92rem' }}>
                Voir le suivi de mes gains →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}