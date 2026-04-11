import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { participationsApi } from '../../api/participations.js'
import Layout from '../components/Layout.jsx'
import PageBanner from '../components/PageBanner.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import toast from 'react-hot-toast'

/* ─── Confetti canvas helper ─────────────────────────────── */
function useConfetti() {
  const canvasRef = useRef(null)
  const animRef   = useRef(null)
  const particles = useRef([])

  function createCanvas() {
    if (canvasRef.current) return
    const c = document.createElement('canvas')
    c.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999;'
    document.body.appendChild(c)
    canvasRef.current = c
  }

  const fire = useCallback(() => {
    createCanvas()
    const canvas = canvasRef.current
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight
    const ctx     = canvas.getContext('2d')

    const COLORS = ['#f7c948','#e84393','#3ecf8e','#c8723a','#6a8f5a','#a855f7','#38bdf8','#f97316']
    const SHAPES = ['circle', 'rect', 'triangle']

    // Générer 160 particules depuis plusieurs points
    particles.current = []
    const origins = [
      { x: 0,                  vy: -18, vx: 14  },
      { x: canvas.width,       vy: -18, vx: -14 },
      { x: canvas.width * .5,  vy: -22, vx: 0   },
    ]
    origins.forEach(o => {
      for (let i = 0; i < 55; i++) {
        particles.current.push({
          x:     o.x,
          y:     canvas.height * .35,
          vx:    o.vx + (Math.random() - .5) * 18,
          vy:    o.vy + (Math.random() - .5) * 12,
          size:  Math.random() * 9 + 4,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
          rot:   Math.random() * Math.PI * 2,
          drot:  (Math.random() - .5) * 0.22,
          alpha: 1,
          gravity: 0.45 + Math.random() * 0.2,
          drag:    0.97,
        })
      }
    })

    cancelAnimationFrame(animRef.current)

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.current = particles.current.filter(p => p.alpha > 0.02)

      particles.current.forEach(p => {
        p.x  += p.vx
        p.y  += p.vy
        p.vy += p.gravity
        p.vx *= p.drag
        p.vy *= p.drag
        p.rot += p.drot
        p.alpha -= 0.012

        ctx.save()
        ctx.globalAlpha = Math.max(0, p.alpha)
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.fillStyle = p.color

        if (p.shape === 'circle') {
          ctx.beginPath()
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
          ctx.fill()
        } else if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
        } else {
          ctx.beginPath()
          ctx.moveTo(0, -p.size / 2)
          ctx.lineTo(p.size / 2, p.size / 2)
          ctx.lineTo(-p.size / 2, p.size / 2)
          ctx.closePath()
          ctx.fill()
        }

        ctx.restore()
      })

      if (particles.current.length > 0) {
        animRef.current = requestAnimationFrame(draw)
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }

    animRef.current = requestAnimationFrame(draw)
  }, [])

  useEffect(() => () => {
    cancelAnimationFrame(animRef.current)
    canvasRef.current?.remove()
  }, [])

  return fire
}

/* ─── Styles ─────────────────────────────────────────────── */
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
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes pulse-ring {
    0%   { box-shadow: 0 0 0 0   rgba(200,100,40,.4); }
    70%  { box-shadow: 0 0 0 12px rgba(200,100,40,0); }
    100% { box-shadow: 0 0 0 0   rgba(200,100,40,0); }
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

  /* ── Flash ligne après réclamation ── */
  @keyframes rowFlash {
    0%   { background: rgba(106,143,90,.28); transform: scale(1.01); }
    50%  { background: rgba(106,143,90,.12); transform: scale(1); }
    100% { background: transparent; }
  }

  /* ── Bouton Réclamer : halo animé + shimmer ── */
  @keyframes claimPulse {
    0%   { box-shadow: 0 0 0 0 rgba(200,100,40,.55), 0 4px 18px rgba(200,100,40,.35); }
    70%  { box-shadow: 0 0 0 9px rgba(200,100,40,0),  0 4px 18px rgba(200,100,40,.35); }
    100% { box-shadow: 0 0 0 0 rgba(200,100,40,0),  0 4px 18px rgba(200,100,40,.35); }
  }
  @keyframes claimShimmer {
    0%   { background-position: -220% center; }
    100% { background-position:  220% center; }
  }
  @keyframes claimWiggle {
    0%, 100% { transform: rotate(0deg) scale(1); }
    15%       { transform: rotate(-6deg) scale(1.07); }
    30%       { transform: rotate(5deg) scale(1.07); }
    45%       { transform: rotate(-3deg) scale(1.05); }
    60%       { transform: rotate(2deg) scale(1.02); }
  }
  @keyframes claimGlow {
    0%, 100% { opacity: .55; }
    50%       { opacity: 1; }
  }

  .dash-title      { animation: slideUp .5s ease both; }
  .dash-logo-card  { animation: slideInLeft .55s ease .1s both; }
  .dash-logo-card img { animation: logoBreath 3.5s ease-in-out infinite; }
  .dash-code-card  { animation: slideInRight .55s ease .15s both; }

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

  .dash-btn-validate {
    position: relative; overflow: hidden;
    transition: transform .2s ease, box-shadow .2s ease;
  }
  .dash-btn-validate:not(:disabled):hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(200,100,40,.3);
    animation: pulse-ring 1.4s ease-out infinite;
  }
  .dash-btn-validate:not(:disabled):active { transform: translateY(0); }
  .dash-btn-validate::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.25), transparent);
    background-size: 200% 100%; opacity: 0; transition: opacity .2s;
  }
  .dash-btn-validate:not(:disabled):hover::after { opacity: 1; animation: shimmer 1s linear infinite; }

  .dash-participations { animation: slideUp .55s ease .25s both; }
  .dash-section-underline {
    display: block; height: 2px; width: 48px;
    background: var(--orange, #c8723a);
    border-radius: 4px; margin: 0.4rem auto 1.5rem;
    animation: lineGrow .5s ease .35s both;
  }

  .dash-tbl-row {
    animation: rowIn .4s ease both;
    transition: background .2s ease, opacity .3s ease;
  }
  .s-won { animation: winBadge .4s ease both; }

  .row-claiming     { opacity: .5; pointer-events: none; }
  .row-just-claimed { animation: rowFlash .85s ease forwards !important; }

  .dash-empty-icon {
    display: block; font-size: 2.4rem; margin-bottom: 0.75rem;
    animation: emptyFloat 3s ease-in-out infinite;
  }
  .dash-btn-gains {
    transition: transform .2s ease, box-shadow .2s ease, background .2s ease;
  }
  .dash-btn-gains:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(80,120,60,.25); }

  /* ─── Bouton Réclamer stylé jeu-concours ─── */
  .btn-claim-fancy {
    position: relative;
    display: inline-flex; align-items: center; gap: .4rem;
    padding: .32rem 1rem;
    font-size: .8rem; font-weight: 800; letter-spacing: .03em;
    border-radius: var(--radius-pill, 999px);
    border: none; cursor: pointer; overflow: hidden;
    color: #fff;
    background: linear-gradient(115deg, #e07020 0%, #c8723a 40%, #e8943a 70%, #c8723a 100%);
    background-size: 220% 100%;
    animation: claimPulse 2s ease-in-out infinite, claimShimmer 2.8s linear infinite;
    transition: transform .18s ease, filter .18s ease;
    white-space: nowrap;
    text-shadow: 0 1px 3px rgba(0,0,0,.25);
  }
  /* Halo derrière */
  .btn-claim-fancy::before {
    content: '';
    position: absolute; inset: -3px;
    border-radius: inherit;
    background: linear-gradient(115deg, #f7c948, #e84393, #3ecf8e, #f7c948);
    background-size: 300% 300%;
    z-index: -1; opacity: 0;
    animation: claimGlow 2.2s ease-in-out infinite;
    filter: blur(6px);
    transition: opacity .3s;
  }
  .btn-claim-fancy:hover::before { opacity: .7; }
  .btn-claim-fancy:hover {
    transform: translateY(-2px) scale(1.06);
    filter: brightness(1.08);
  }
  .btn-claim-fancy:active { transform: scale(.97); }
  .btn-claim-fancy:disabled {
    opacity: .55; cursor: not-allowed;
    animation: none;
    filter: grayscale(.4);
  }
  /* Emoji qui gigote */
  .btn-claim-fancy .claim-emoji {
    display: inline-block;
    animation: claimWiggle 1.8s ease-in-out infinite;
  }

  .dash-deco  { position: absolute; border-radius: 50%; pointer-events: none; }
  .dash-inner { position: relative; z-index: 1; padding: 0 8rem; }
  @media (max-width: 1024px) { .dash-inner { padding: 0 3rem; } }
  @media (max-width: 640px)  { .dash-inner { padding: 0 1rem; } }

  .dash-code-grid {
    display: grid; grid-template-columns: 200px 1fr;
    gap: 1.5rem; align-items: center; margin-bottom: 3rem;
  }
  @media (max-width: 640px) {
    .dash-code-grid { grid-template-columns: 1fr; }
    .dash-logo-card { display: none; }
  }
  @media (max-width: 480px) {
    .dash-participations { padding: 1.5rem 1rem !important; }
    .tbl { min-width: 320px; }
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
  const { user }                            = useAuth()
  const [participations, setParticipations] = useState([])
  const [loading, setLoading]               = useState(true)
  const [code, setCode]                     = useState('')
  const [submitting, setSubmitting]         = useState(false)
  const [claimingId, setClaimingId]         = useState(null)
  const [flashId, setFlashId]               = useState(null)
  const [btnRef, btnVis]                    = useReveal()
  const fireConfetti                        = useConfetti()

  useEffect(() => {
    const id = '__dash-styles__'
    if (!document.getElementById(id)) {
      const el = document.createElement('style')
      el.id = id; el.textContent = STYLES
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
      if (won) {
        // Confetti immédiat + toast festif
        fireConfetti()
        setTimeout(fireConfetti, 600) // 2e salve
        toast.success('🎉 Félicitations ! Vous avez gagné !', { duration: 7000, style: { fontWeight: 700, fontSize: '1rem' } })
      } else {
        toast('Participation enregistrée. Bonne chance !', { icon: '🍵' })
      }
      setCode('')
      fetchAll()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Code invalide ou déjà utilisé.')
    } finally { setSubmitting(false) }
  }

  async function handleClaim(participationId) {
    setClaimingId(participationId)
    try {
      await participationsApi.redeem(participationId, 'store')
      setFlashId(participationId)
      toast.success('Réclamation envoyée ! Vous allez recevoir un e-mail. 🎁')
      setTimeout(() => { setFlashId(null); fetchAll() }, 900)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la réclamation.')
    } finally {
      setClaimingId(null)
    }
  }

  return (
    <Layout>
      <PageBanner title="Tableau de bord" />

      <div style={{ position: 'relative', background: 'var(--cream)', padding: '2.5rem 1.5rem 4rem', overflow: 'hidden' }}>

        <div className="dash-deco" style={{
          width: 380, height: 380, top: -120, right: -100,
          background: 'radial-gradient(circle, rgba(106,143,90,.07) 0%, transparent 70%)',
        }} />
        <div className="dash-deco" style={{
          width: 260, height: 260, bottom: -60, left: -60,
          background: 'radial-gradient(circle, rgba(200,100,40,.06) 0%, transparent 70%)',
        }} />

        <div className="dash-inner">

          <h2 className="dash-title" style={{ textAlign: 'center', marginBottom: '2rem' }}>
            Saisir mon code de participation
          </h2>

          <div className="dash-code-grid">
            <div className="card dash-logo-card" style={{
              padding: '1.5rem', display: 'flex',
              alignItems: 'center', justifyContent: 'center', minHeight: 160,
            }}>
              <img src="/images/Header/img_01.png" alt="logo"
                style={{ width: 110, height: 'auto' }}
                onError={e => { e.target.style.display = 'none' }} />
            </div>

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
                    flex: 1, minWidth: 160,
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

          {/* Participations */}
          <div className="dash-participations" style={{
            background: 'var(--cream-card)', borderRadius: 20, padding: '2.5rem',
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
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participations.map((p, i) => {
                      const hasWon     = p.prize_id != null
                      const redeemed   = !!p.redemption
                      const isClaiming = claimingId === p.id
                      const isFlashing = flashId    === p.id

                      return (
                        <tr
                          key={p.id}
                          className={[
                            'dash-tbl-row',
                            isClaiming ? 'row-claiming'     : '',
                            isFlashing ? 'row-just-claimed' : '',
                          ].filter(Boolean).join(' ')}
                          style={{ animationDelay: `${i * 0.06}s` }}
                        >
                          <td style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '0.95rem' }}>
                            {p.ticket_code?.code ?? p.id?.slice(0, 8) ?? '—'}
                          </td>
                          <td>
                            {hasWon
                              ? <span className="status s-won">
                                  {isClaiming ? '⏳ Envoi…' : 'Gagné 🎉'}
                                </span>
                              : <span className="status s-lost">Non gagné</span>
                            }
                          </td>
                          <td>
                            {hasWon && !redeemed ? (
                              <button
                                className="btn-claim-fancy"
                                disabled={isClaiming}
                                onClick={() => handleClaim(p.id)}
                              >
                                <span className="claim-emoji">{isClaiming ? '⏳' : '🎁'}</span>
                                {isClaiming ? 'Envoi…' : 'Réclamer'}
                              </button>
                            ) : hasWon && redeemed ? (
                              <span style={{ fontSize: '.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                Réclamé ✓
                              </span>
                            ) : (
                              <span style={{ color: 'var(--text-muted)', fontSize: '.8rem' }}>—</span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <div ref={btnRef} style={{
              textAlign: 'center', marginTop: '1.75rem',
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