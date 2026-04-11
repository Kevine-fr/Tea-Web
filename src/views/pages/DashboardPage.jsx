import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { participationsApi } from '../../api/participations.js'
import Layout from '../components/Layout.jsx'
import PageBanner from '../components/PageBanner.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import toast from 'react-hot-toast'

/* ─── Confetti hook (canvas, zéro dépendance) ───────────── */
function useConfetti() {
  const canvasRef = useRef(null)
  const animRef   = useRef(null)
  const parts     = useRef([])
  const COLORS    = ['#f7c948','#e84393','#3ecf8e','#c8723a','#6a8f5a','#a855f7','#38bdf8','#f97316']
  const SHAPES    = ['circle','rect','triangle']

  function ensureCanvas() {
    if (canvasRef.current) return
    const c = document.createElement('canvas')
    c.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:99999;'
    document.body.appendChild(c)
    canvasRef.current = c
  }

  const fire = useCallback((ox = null) => {
    ensureCanvas()
    const cv = canvasRef.current
    cv.width = window.innerWidth; cv.height = window.innerHeight
    const ctx = cv.getContext('2d')

    const origins = ox != null
      ? [{ x: ox, vy: -20, vx: 0 }]
      : [
          { x: 0,            vy: -18, vx: 13  },
          { x: cv.width,     vy: -18, vx: -13 },
          { x: cv.width*.5,  vy: -22, vx: 0   },
        ]

    origins.forEach(o => {
      for (let i = 0; i < 55; i++) {
        parts.current.push({
          x: o.x, y: cv.height * .4,
          vx: o.vx + (Math.random()-.5)*18,
          vy: o.vy + (Math.random()-.5)*11,
          size: Math.random()*9+4,
          color: COLORS[Math.floor(Math.random()*COLORS.length)],
          shape: SHAPES[Math.floor(Math.random()*SHAPES.length)],
          rot: Math.random()*Math.PI*2, drot: (Math.random()-.5)*.22,
          alpha: 1, gravity: .43+Math.random()*.2, drag: .97,
        })
      }
    })

    cancelAnimationFrame(animRef.current)
    function draw() {
      ctx.clearRect(0,0,cv.width,cv.height)
      parts.current = parts.current.filter(p => p.alpha > .02)
      parts.current.forEach(p => {
        p.x+=p.vx; p.y+=p.vy; p.vy+=p.gravity; p.vx*=p.drag; p.vy*=p.drag
        p.rot+=p.drot; p.alpha-=.012
        ctx.save(); ctx.globalAlpha=Math.max(0,p.alpha)
        ctx.translate(p.x,p.y); ctx.rotate(p.rot); ctx.fillStyle=p.color
        if(p.shape==='circle'){ctx.beginPath();ctx.arc(0,0,p.size/2,0,Math.PI*2);ctx.fill()}
        else if(p.shape==='rect'){ctx.fillRect(-p.size/2,-p.size/4,p.size,p.size/2)}
        else{ctx.beginPath();ctx.moveTo(0,-p.size/2);ctx.lineTo(p.size/2,p.size/2);ctx.lineTo(-p.size/2,p.size/2);ctx.closePath();ctx.fill()}
        ctx.restore()
      })
      if(parts.current.length>0) animRef.current = requestAnimationFrame(draw)
      else ctx.clearRect(0,0,cv.width,cv.height)
    }
    animRef.current = requestAnimationFrame(draw)
  }, [])

  useEffect(() => () => { cancelAnimationFrame(animRef.current); canvasRef.current?.remove() }, [])
  return fire
}

/* ─── Win Overlay ────────────────────────────────────────── */
const WIN_STYLES = `
  @keyframes woOverlayIn { from{opacity:0} to{opacity:1} }
  @keyframes woCardPop {
    0%  {transform:scale(.35) rotate(-10deg);opacity:0}
    55% {transform:scale(1.07) rotate(1.5deg)}
    75% {transform:scale(.97)}
    100%{transform:scale(1) rotate(0deg);opacity:1}
  }
  @keyframes woShimmer  { 0%{background-position:-220% center} 100%{background-position:220% center} }
  @keyframes woBtnGlow  { 0%,100%{box-shadow:0 0 0 0 rgba(247,201,72,.55),0 6px 24px rgba(247,201,72,.3)} 70%{box-shadow:0 0 0 11px rgba(247,201,72,0),0 6px 24px rgba(247,201,72,.4)} }
  @keyframes woFloat    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
  @keyframes woRing     { 0%{transform:scale(.85);opacity:.6} 100%{transform:scale(1.65);opacity:0} }
  @keyframes woStarPop  { 0%{transform:scale(0) rotate(-30deg);opacity:0} 60%{transform:scale(1.15) rotate(5deg)} 100%{transform:scale(1) rotate(0);opacity:1} }
  @keyframes woSpin     { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes woPrize    { 0%{opacity:0;transform:scale(.75) translateY(12px)} 100%{opacity:1;transform:scale(1) translateY(0)} }
  @keyframes woSparkle  { 0%{transform:scale(0) rotate(0deg);opacity:1} 100%{transform:scale(1.6) rotate(180deg);opacity:0} }
  @keyframes woPulseLabel { 0%,100%{opacity:.85} 50%{opacity:1} }

  .wo-overlay {
    position:fixed;inset:0;z-index:10000;
    background:rgba(8,6,18,.88);
    display:flex;align-items:center;justify-content:center;
    animation:woOverlayIn .3s ease both;
    backdrop-filter:blur(4px);
    padding:1rem;
  }

  .wo-ring {
    position:fixed;border-radius:50%;border-style:solid;border-color:rgba(247,201,72,.3);
    pointer-events:none;
    animation:woRing 2.4s ease-out infinite;
  }

  .wo-card {
    position:relative;z-index:2;
    background:linear-gradient(160deg,#1a1230 0%,#0d1928 100%);
    border:1.5px solid rgba(247,201,72,.3);
    border-radius:28px;
    padding:2.5rem 2.2rem 2rem;
    max-width:390px;width:100%;text-align:center;
    animation:woCardPop .72s cubic-bezier(.34,1.56,.64,1) .1s both;
    overflow:visible;
  }

  .wo-orbit {
    position:absolute;top:50%;left:50%;
    width:280px;height:280px;margin:-140px 0 0 -140px;
    animation:woSpin 9s linear infinite;pointer-events:none;
  }
  .wo-dot { position:absolute;border-radius:50%;background:#f7c948; }

  .wo-corner-star { position:absolute;animation:woStarPop .5s cubic-bezier(.34,1.56,.64,1) both; }

  .wo-trophy-wrap {
    position:relative;display:inline-block;
    margin-bottom:1.15rem;
    animation:woFloat 2.8s ease-in-out infinite;
  }
  .wo-trophy-bg {
    width:94px;height:94px;border-radius:50%;
    background:radial-gradient(circle at 38% 35%,#f7c948,#d96010);
    display:flex;align-items:center;justify-content:center;
    font-size:44px;margin:0 auto;
    box-shadow:0 0 0 9px rgba(247,201,72,.1),0 0 0 20px rgba(247,201,72,.06);
  }
  .wo-sparkle { position:absolute;pointer-events:none;animation:woSparkle 1.5s ease-out infinite; }

  .wo-label {
    font-size:.68rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;
    color:#f7c948;margin-bottom:.45rem;
    animation:woPulseLabel 2s ease-in-out infinite;
  }
  .wo-title {
    font-size:1.95rem;font-weight:800;line-height:1.15;margin-bottom:.3rem;
    background:linear-gradient(90deg,#f7c948,#fffbe0,#f7c948,#e8943a,#f7c948);
    background-size:220% auto;
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
    animation:woShimmer 2s linear infinite;
  }
  .wo-ribbon {
    display:inline-block;
    background:linear-gradient(90deg,#c96010,#f7c948,#c96010);
    border-radius:20px;padding:.28rem 1.1rem;
    font-size:.72rem;font-weight:700;color:#1a0600;letter-spacing:.05em;
    margin-bottom:1.3rem;
  }

  .wo-prize-box {
    background:rgba(247,201,72,.07);
    border:1px solid rgba(247,201,72,.18);
    border-radius:16px;padding:1.1rem 1.25rem;
    margin-bottom:1.5rem;
    animation:woPrize .65s cubic-bezier(.34,1.56,.64,1) .75s both;
  }
  .wo-prize-lbl { font-size:.65rem;color:rgba(255,255,255,.4);letter-spacing:.12em;text-transform:uppercase;margin-bottom:.35rem; }
  .wo-prize-name { font-size:1.15rem;font-weight:700;color:#fff;line-height:1.3; }
  .wo-prize-ticket { font-size:.7rem;color:rgba(255,255,255,.35);margin-top:.3rem;font-family:monospace;letter-spacing:.1em; }

  .wo-btn-cta {
    display:block;width:100%;padding:.88rem;border:none;border-radius:999px;cursor:pointer;
    background:linear-gradient(90deg,#f7c948 0%,#e07020 50%,#f7c948 100%);background-size:200% 100%;
    font-size:1rem;font-weight:800;color:#1a0600;letter-spacing:.03em;
    animation:woBtnGlow 1.8s ease-in-out infinite, woShimmer 2.2s linear infinite;
    margin-bottom:.7rem;transition:transform .18s ease,filter .18s ease;
  }
  .wo-btn-cta:hover   { transform:translateY(-2px) scale(1.02);filter:brightness(1.07); }
  .wo-btn-cta:active  { transform:scale(.97); }
  .wo-btn-cta:disabled{ opacity:.6;cursor:not-allowed;animation:none; }

  .wo-btn-later {
    background:none;border:none;cursor:pointer;
    color:rgba(255,255,255,.32);font-size:.78rem;padding:.3rem;
    transition:color .2s;
  }
  .wo-btn-later:hover { color:rgba(255,255,255,.6); }
`

function StarSVG({ size = 24, color = '#f7c948' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <polygon points="12,2 15,9 22,9 16,14 18,21 12,17 6,21 8,14 2,9 9,9" fill={color} />
    </svg>
  )
}

function SparkSVG({ size = 14, color = '#f7c948' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16">
      <polygon points="8,0 10,6 16,6 11,10 13,16 8,12 3,16 5,10 0,6 6,6" fill={color} />
    </svg>
  )
}

function WinOverlay({ prize, ticketCode, onClaim, onClose, claiming }) {
  const fireConfetti = useConfetti()

  useEffect(() => {
    // Injection style
    const id = '__wo-styles__'
    if (!document.getElementById(id)) {
      const el = document.createElement('style'); el.id = id; el.textContent = WIN_STYLES
      document.head.appendChild(el)
    }
    // Salves de confetti
    fireConfetti(); setTimeout(() => fireConfetti(), 650); setTimeout(() => fireConfetti(), 1300)
    // Bloquer le scroll
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div className="wo-overlay">

      {/* Anneaux concentriques */}
      {[300, 440, 580].map((s, i) => (
        <div key={i} className="wo-ring" style={{ width: s, height: s, borderWidth: 1.5, animationDelay: `${i * .55}s` }} />
      ))}

      <div className="wo-card">

        {/* Orbite tournante */}
        <div className="wo-orbit">
          {[
            { top:  '0%',  left: '50%', s: 6, o: .7 },
            { top: '50%',  right: '0%', s: 5, o: .5 },
            { bottom: '0%',left: '50%', s: 7, o: .65 },
            { top: '50%',  left: '0%', s: 4, o: .5 },
            { top: '20%',  right: '8%', s: 4, o: .4 },
            { bottom: '20%',left: '8%', s: 3, o: .35 },
          ].map((d, i) => (
            <div key={i} className="wo-dot" style={{ width: d.s, height: d.s, opacity: d.o, ...d }} />
          ))}
        </div>

        {/* Étoiles coins */}
        <div className="wo-corner-star" style={{ top: -14, left: -14, animationDelay: '.1s' }}><StarSVG size={28} /></div>
        <div className="wo-corner-star" style={{ top: -14, right: -14, animationDelay: '.2s' }}><StarSVG size={28} /></div>
        <div className="wo-corner-star" style={{ bottom: -12, left: -12, animationDelay: '.3s' }}><StarSVG size={20} color="#e8943a" /></div>
        <div className="wo-corner-star" style={{ bottom: -12, right: -12, animationDelay: '.4s' }}><StarSVG size={20} color="#e8943a" /></div>

        {/* Trophée */}
        <div className="wo-trophy-wrap">
          <div className="wo-trophy-bg">🏆</div>
          <div className="wo-sparkle" style={{ top: -8, left:  6, animationDelay: '0s'  }}><SparkSVG size={15} /></div>
          <div className="wo-sparkle" style={{ top:  6, right: -8, animationDelay: '.5s' }}><SparkSVG size={12} color="#fff5b8" /></div>
          <div className="wo-sparkle" style={{ bottom: -4, left: -6, animationDelay: '.9s' }}><SparkSVG size={10} color="#e8943a" /></div>
        </div>

        <div className="wo-label">✦ Ticket gagnant ✦</div>
        <div className="wo-title">Vous avez gagné !</div>
        <div className="wo-ribbon">🎊 Félicitations 🎊</div>

        {/* Lot */}
        <div className="wo-prize-box">
          <div className="wo-prize-lbl">Votre lot</div>
          <div className="wo-prize-name">{prize?.name ?? 'Votre lot 🍵'}</div>
          {ticketCode && (
            <div className="wo-prize-ticket">N° ticket : {ticketCode}</div>
          )}
        </div>

        <button className="wo-btn-cta" disabled={claiming} onClick={onClaim}>
          {claiming ? '⏳ Envoi en cours…' : '🎁 Réclamer mon lot maintenant'}
        </button>
        <button className="wo-btn-later" onClick={onClose}>
          Réclamer plus tard
        </button>
      </div>
    </div>
  )
}

/* ─── Styles page dashboard ──────────────────────────────── */
const STYLES = `
  @keyframes slideUp    { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:none} }
  @keyframes slideInLeft  { from{opacity:0;transform:translateX(-24px)} to{opacity:1;transform:none} }
  @keyframes slideInRight { from{opacity:0;transform:translateX(24px)}  to{opacity:1;transform:none} }
  @keyframes shimmer    { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes pulseRing  { 0%{box-shadow:0 0 0 0 rgba(200,100,40,.4)} 70%{box-shadow:0 0 0 12px rgba(200,100,40,0)} 100%{box-shadow:0 0 0 0 rgba(200,100,40,0)} }
  @keyframes rowIn      { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:none} }
  @keyframes winBadge   { 0%{transform:scale(.7);opacity:0} 60%{transform:scale(1.12)} 100%{transform:scale(1);opacity:1} }
  @keyframes emptyFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
  @keyframes logoBreath { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }
  @keyframes lineGrow   { from{width:0} to{width:48px} }
  @keyframes rowFlash   { 0%{background:rgba(106,143,90,.28);transform:scale(1.01)} 50%{background:rgba(106,143,90,.12);transform:scale(1)} 100%{background:transparent} }
  @keyframes claimPulse { 0%,100%{box-shadow:0 0 0 0 rgba(200,100,40,.55),0 4px 18px rgba(200,100,40,.35)} 70%{box-shadow:0 0 0 9px rgba(200,100,40,0),0 4px 18px rgba(200,100,40,.35)} }
  @keyframes claimShimmer { 0%{background-position:-220% center} 100%{background-position:220% center} }
  @keyframes claimWiggle { 0%,100%{transform:rotate(0deg) scale(1)} 15%{transform:rotate(-6deg) scale(1.07)} 30%{transform:rotate(5deg) scale(1.07)} 45%{transform:rotate(-3deg) scale(1.05)} 60%{transform:rotate(2deg) scale(1.02)} }
  @keyframes claimGlow  { 0%,100%{opacity:.55} 50%{opacity:1} }

  .dash-title     { animation:slideUp .5s ease both; }
  .dash-logo-card { animation:slideInLeft .55s ease .1s both; }
  .dash-logo-card img { animation:logoBreath 3.5s ease-in-out infinite; }
  .dash-code-card { animation:slideInRight .55s ease .15s both; }

  .dash-code-input { transition:border-color .25s,box-shadow .25s,background .25s; background:white; }
  .dash-code-input:focus { outline:none; border-color:var(--green-mid,#6a8f5a)!important; box-shadow:0 0 0 3px rgba(106,143,90,.15); background:#fafffe; }
  .dash-code-input:not(:placeholder-shown) { border-color:var(--orange,#c8723a); letter-spacing:.12em; }

  .dash-btn-validate { position:relative;overflow:hidden;transition:transform .2s,box-shadow .2s; }
  .dash-btn-validate:not(:disabled):hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(200,100,40,.3); animation:pulseRing 1.4s ease-out infinite; }
  .dash-btn-validate:not(:disabled):active { transform:translateY(0); }
  .dash-btn-validate::after { content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,.25),transparent);background-size:200% 100%;opacity:0;transition:opacity .2s; }
  .dash-btn-validate:not(:disabled):hover::after { opacity:1;animation:shimmer 1s linear infinite; }

  .dash-participations { animation:slideUp .55s ease .25s both; }
  .dash-section-underline { display:block;height:2px;width:48px;background:var(--orange,#c8723a);border-radius:4px;margin:.4rem auto 1.5rem;animation:lineGrow .5s ease .35s both; }

  .dash-tbl-row { animation:rowIn .4s ease both; transition:background .2s,opacity .3s; }
  .s-won { animation:winBadge .4s ease both; }
  .row-claiming     { opacity:.5;pointer-events:none; }
  .row-just-claimed { animation:rowFlash .85s ease forwards!important; }

  .dash-empty-icon { display:block;font-size:2.4rem;margin-bottom:.75rem;animation:emptyFloat 3s ease-in-out infinite; }
  .dash-btn-gains  { transition:transform .2s,box-shadow .2s,background .2s; }
  .dash-btn-gains:hover { transform:translateY(-2px);box-shadow:0 8px 20px rgba(80,120,60,.25); }

  .btn-claim-fancy {
    position:relative;display:inline-flex;align-items:center;gap:.4rem;
    padding:.32rem 1rem;font-size:.8rem;font-weight:800;letter-spacing:.03em;
    border-radius:var(--radius-pill,999px);border:none;cursor:pointer;overflow:hidden;
    color:#fff;
    background:linear-gradient(115deg,#e07020 0%,#c8723a 40%,#e8943a 70%,#c8723a 100%);
    background-size:220% 100%;
    animation:claimPulse 2s ease-in-out infinite, claimShimmer 2.8s linear infinite;
    transition:transform .18s,filter .18s;white-space:nowrap;
    text-shadow:0 1px 3px rgba(0,0,0,.25);
  }
  .btn-claim-fancy::before {
    content:'';position:absolute;inset:-3px;border-radius:inherit;
    background:linear-gradient(115deg,#f7c948,#e84393,#3ecf8e,#f7c948);background-size:300% 300%;
    z-index:-1;opacity:0;animation:claimGlow 2.2s ease-in-out infinite;filter:blur(6px);transition:opacity .3s;
  }
  .btn-claim-fancy:hover::before { opacity:.7; }
  .btn-claim-fancy:hover  { transform:translateY(-2px) scale(1.06);filter:brightness(1.08); }
  .btn-claim-fancy:active { transform:scale(.97); }
  .btn-claim-fancy:disabled { opacity:.55;cursor:not-allowed;animation:none;filter:grayscale(.4); }
  .btn-claim-fancy .claim-emoji { display:inline-block;animation:claimWiggle 1.8s ease-in-out infinite; }

  .dash-deco  { position:absolute;border-radius:50%;pointer-events:none; }
  .dash-inner { position:relative;z-index:1;padding:0 8rem; }
  @media(max-width:1024px){ .dash-inner{padding:0 3rem} }
  @media(max-width:640px) { .dash-inner{padding:0 1rem} }
  .dash-code-grid { display:grid;grid-template-columns:200px 1fr;gap:1.5rem;align-items:center;margin-bottom:3rem; }
  @media(max-width:640px){ .dash-code-grid{grid-template-columns:1fr} .dash-logo-card{display:none} }
  @media(max-width:480px){ .dash-participations{padding:1.5rem 1rem!important} .tbl{min-width:320px} }
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

  // ── Win overlay state ──
  const [winData, setWinData] = useState(null)   // { prize, ticketCode, participationId }
  const [winClaiming, setWinClaiming] = useState(false)

  useEffect(() => {
    const id = '__dash-styles__'
    if (!document.getElementById(id)) {
      const el = document.createElement('style'); el.id = id; el.textContent = STYLES
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
    const c = code.trim(); if (!c) return
    setSubmitting(true)
    try {
      const res = await participationsApi.submit(c)
      const participation = res.data
      const won = participation?.prize_id != null

      setCode('')
      await fetchAll()

      if (won) {
        // Ouvrir l'overlay avec les données du lot
        setWinData({
          prize:           participation.prize ?? null,
          ticketCode:      participation.ticket_code?.code ?? c,
          participationId: participation.id,
        })
      } else {
        toast('Participation enregistrée. Bonne chance !', { icon: '🍵' })
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Code invalide ou déjà utilisé.')
    } finally { setSubmitting(false) }
  }

  // Réclamation depuis l'overlay
  async function handleWinClaim() {
    if (!winData) return
    setWinClaiming(true)
    try {
      await participationsApi.redeem(winData.participationId, 'store')
      toast.success('Réclamation envoyée ! Vous allez recevoir un e-mail. 🎁')
      setWinData(null)
      fetchAll()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la réclamation.')
    } finally { setWinClaiming(false) }
  }

  // Réclamation depuis le tableau
  async function handleClaim(participationId) {
    setClaimingId(participationId)
    try {
      await participationsApi.redeem(participationId, 'store')
      setFlashId(participationId)
      toast.success('Réclamation envoyée ! Vous allez recevoir un e-mail. 🎁')
      setTimeout(() => { setFlashId(null); fetchAll() }, 900)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la réclamation.')
    } finally { setClaimingId(null) }
  }

  return (
    <Layout>
      <PageBanner title="Tableau de bord" />

      {/* ── Win overlay ── */}
      {winData && (
        <WinOverlay
          prize={winData.prize}
          ticketCode={winData.ticketCode}
          claiming={winClaiming}
          onClaim={handleWinClaim}
          onClose={() => setWinData(null)}
        />
      )}

      <div style={{ position:'relative', background:'var(--cream)', padding:'2.5rem 1.5rem 4rem', overflow:'hidden' }}>

        <div className="dash-deco" style={{ width:380,height:380,top:-120,right:-100,background:'radial-gradient(circle,rgba(106,143,90,.07) 0%,transparent 70%)' }} />
        <div className="dash-deco" style={{ width:260,height:260,bottom:-60,left:-60,background:'radial-gradient(circle,rgba(200,100,40,.06) 0%,transparent 70%)' }} />

        <div className="dash-inner">

          <h2 className="dash-title" style={{ textAlign:'center', marginBottom:'2rem' }}>
            Saisir mon code de participation
          </h2>

          <div className="dash-code-grid">
            <div className="card dash-logo-card" style={{ padding:'1.5rem',display:'flex',alignItems:'center',justifyContent:'center',minHeight:160 }}>
              <img src="/images/Header/img_01.png" alt="logo" style={{ width:110,height:'auto' }}
                onError={e => { e.target.style.display='none' }} />
            </div>

            <div className="card dash-code-card" style={{ padding:'2rem' }}>
              <p style={{ fontSize:'.9rem',color:'var(--text-muted)',marginBottom:'.75rem' }}>
                Entrez votre N° de ticket
              </p>
              <form onSubmit={handleSubmit} style={{ display:'flex',gap:'.75rem',flexWrap:'wrap' }}>
                <input
                  type="text" value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  placeholder="Code ticket.." maxLength={15}
                  className="dash-code-input"
                  style={{ flex:1,minWidth:160,padding:'.75rem 1.25rem',border:'1.5px solid var(--cream-border)',borderRadius:'var(--radius-pill)',fontSize:'.95rem',fontFamily:'monospace',letterSpacing:'.08em' }}
                />
                <button type="submit" className="btn btn-orange dash-btn-validate"
                  disabled={submitting || !code.trim()}
                  style={{ padding:'.75rem 2.5rem',fontSize:'.95rem',whiteSpace:'nowrap' }}>
                  {submitting ? '…' : 'Valider'}
                </button>
              </form>
            </div>
          </div>

          {/* Tableau participations */}
          <div className="dash-participations" style={{ background:'var(--cream-card)',borderRadius:20,padding:'2.5rem' }}>
            <h2 style={{ textAlign:'center',marginBottom:0 }}>Mes participations au jeu-concours</h2>
            <span className="dash-section-underline" />

            {loading ? <LoadingSpinner /> : participations.length === 0 ? (
              <div style={{ textAlign:'center',padding:'3rem',color:'var(--text-muted)' }}>
                <span className="dash-empty-icon">🍵</span>
                <p style={{ fontSize:'1rem',marginBottom:'.5rem' }}>Aucune participation pour l'instant.</p>
                <p style={{ fontSize:'.85rem' }}>Entrez votre premier code ci-dessus !</p>
              </div>
            ) : (
              <div className="card" style={{ overflow:'auto' }}>
                <table className="tbl">
                  <thead>
                    <tr><th>N° Ticket</th><th>Résultat</th><th>Action</th></tr>
                  </thead>
                  <tbody>
                    {participations.map((p, i) => {
                      const hasWon     = p.prize_id != null
                      const redeemed   = !!p.redemption
                      const isClaiming = claimingId === p.id
                      const isFlashing = flashId    === p.id
                      return (
                        <tr key={p.id}
                          className={['dash-tbl-row', isClaiming?'row-claiming':'', isFlashing?'row-just-claimed':''].filter(Boolean).join(' ')}
                          style={{ animationDelay:`${i*.06}s` }}>
                          <td style={{ fontFamily:'monospace',fontWeight:600,fontSize:'.95rem' }}>
                            {p.ticket_code?.code ?? p.id?.slice(0,8) ?? '—'}
                          </td>
                          <td>
                            {hasWon
                              ? <span className="status s-won">{isClaiming ? '⏳ Envoi…' : 'Gagné 🎉'}</span>
                              : <span className="status s-lost">Non gagné</span>
                            }
                          </td>
                          <td>
                            {hasWon && !redeemed ? (
                              <button className="btn-claim-fancy" disabled={isClaiming} onClick={() => handleClaim(p.id)}>
                                <span className="claim-emoji">{isClaiming ? '⏳' : '🎁'}</span>
                                {isClaiming ? 'Envoi…' : 'Réclamer'}
                              </button>
                            ) : hasWon && redeemed ? (
                              <span style={{ fontSize:'.78rem',color:'var(--text-muted)',fontStyle:'italic' }}>Réclamé ✓</span>
                            ) : (
                              <span style={{ color:'var(--text-muted)',fontSize:'.8rem' }}>—</span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <div ref={btnRef} style={{ textAlign:'center',marginTop:'1.75rem',opacity:btnVis?1:0,transform:btnVis?'translateY(0)':'translateY(16px)',transition:'opacity .4s,transform .4s' }}>
              <Link to="/mes-gains" className="btn btn-green dash-btn-gains" style={{ fontSize:'.92rem' }}>
                Voir le suivi de mes gains →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}