// src/views/pages/HomePage.jsx

import { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import AnimatedLeaves from '../components/AnimatedLeaves.jsx'

/* ─── Particules de fond ──────────────────────────────────── */
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i, left: `${4 + (i * 5.2) % 92}%`,
  size: 3 + (i % 5), dur: 8 + (i % 7),
  delay: (i * 0.65) % 10, opacity: 0.05 + (i % 4) * 0.02,
}))

/* ─── Sparkles fixes ──────────────────────────────────────── */
const SPARKS = [
  { left: '8%',  top: '20%', s: 8,  dur: '3.6s', del: '0.2s' },
  { left: '90%', top: '12%', s: 6,  dur: '4.5s', del: '1.1s' },
  { left: '20%', top: '80%', s: 9,  dur: '3.9s', del: '0.8s' },
  { left: '82%', top: '72%', s: 7,  dur: '5.2s', del: '2.0s' },
  { left: '52%', top: '6%',  s: 6,  dur: '4.1s', del: '1.6s' },
  { left: '5%',  top: '55%', s: 5,  dur: '3.3s', del: '3.0s' },
]

const CSS = `
/* ─── Entrées ────────────────────────────────────────────── */
@keyframes fadeInLeft  { from{opacity:0;transform:translateX(-40px) scale(.97)} to{opacity:1;transform:none} }
@keyframes fadeInRight { from{opacity:0;transform:translateX(50px)  scale(.97)} to{opacity:1;transform:none} }
@keyframes fadeInDown  { from{opacity:0;transform:translateY(-24px) rotate(-5deg)} to{opacity:1;transform:rotate(-5deg)} }
@keyframes fadeInUp    { from{opacity:0;transform:translateY(28px)}  to{opacity:1;transform:none} }
@keyframes fadeInUpSoft {
  from { opacity:0; transform:translateY(28px); }
  to   { opacity:0.5; transform:translateY(0); }
}

/* ─── Idle loops ─────────────────────────────────────────── */
@keyframes cupFloat {
  0%,100% { transform: translateY(0px); }
  50%      { transform: translateY(-9px); }
}
@keyframes tinSway {
  0%,100% { transform: rotate(0deg) translateY(0px); }
  25%      { transform: rotate(1.4deg) translateY(-3px); }
  75%      { transform: rotate(-1.4deg) translateY(-2px); }
}
@keyframes steamDrift {
  0%,100% { transform: translateY(0) scaleX(1);       opacity:0.50; }
  33%      { transform: translateY(-7px) scaleX(1.06); opacity:0.62; }
  66%      { transform: translateY(-3px) scaleX(0.94); opacity:0.44; }
}
@keyframes ticketFloat {
  0%,100% { transform: rotate(-5deg) translateY(0px); }
  50%      { transform: rotate(-5deg) translateY(-7px); }
}
@keyframes leafRotate {
  from { transform: rotate(90deg); }
  to   { transform: rotate(450deg); }
}
@keyframes badgePulse {
  0%,100% { box-shadow: 0 0 0 0    rgba(26,60,46,0); }
  50%      { box-shadow: 0 0 18px 4px rgba(26,60,46,.18); }
}
@keyframes hundredPulse {
  0%,100% { transform: scale(1); }
  50%      { transform: scale(1.04); }
}

/* ─── Particules / Sparkles ──────────────────────────────── */
@keyframes particleRise {
  0%   { transform:translateY(0) rotate(0deg);   opacity:0; }
  8%   { opacity:1; }
  92%  { opacity:1; }
  100% { transform:translateY(-90vh) rotate(360deg); opacity:0; }
}
@keyframes sparkle {
  0%,100% { opacity:0; transform:scale(0)   rotate(0deg);   }
  40%      { opacity:1; transform:scale(1)   rotate(180deg); }
  70%      { opacity:.6; transform:scale(.7) rotate(270deg); }
}

/* ─── Hero card shimmer ───────────────────────────────────── */
@keyframes heroShimmerSweep {
  0%   { transform:translateX(-140%) skewX(-14deg); }
  100% { transform:translateX(240%)  skewX(-14deg); }
}
@keyframes heroCardHue {
  0%,100% { background-color: #EEE1CE; }
  50%      { background-color: #E8D8BC; }
}

/* ─── Bouton CTA ─────────────────────────────────────────── */
@keyframes homeShimmer {
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
}
@keyframes homePulseRing {
  0%   { box-shadow: 0 4px 16px rgba(232,67,26,.35), 0 0 0 0    rgba(232,67,26,.4); }
  70%  { box-shadow: 0 4px 16px rgba(232,67,26,.35), 0 0 0 14px rgba(232,67,26,0); }
  100% { box-shadow: 0 4px 16px rgba(232,67,26,.35), 0 0 0 0    rgba(232,67,26,0); }
}
@keyframes ripple {
  from { transform:scale(0); opacity:.4; }
  to   { transform:scale(5); opacity:0; }
}

/* ─── Step cards ─────────────────────────────────────────── */
@keyframes numberBounce {
  0%,100% { transform: scale(1) translateY(0); }
  40%      { transform: scale(1.25) translateY(-4px); }
  60%      { transform: scale(0.95) translateY(1px); }
}
@keyframes stepImgSpin {
  0%   { transform: rotate(0deg)  scale(1); }
  25%  { transform: rotate(6deg)  scale(1.08); }
  75%  { transform: rotate(-6deg) scale(1.08); }
  100% { transform: rotate(0deg)  scale(1); }
}
@keyframes tagGlow {
  0%,100% { opacity:1; text-shadow:none; }
  50%      { opacity:1; text-shadow:0 0 12px rgba(107,107,107,.3); }
}

/* ─── Déco tournante ─────────────────────────────────────── */
@keyframes decoSpin  { from{transform:rotate(0deg)}   to{transform:rotate(360deg)} }
@keyframes decoSpinR { from{transform:rotate(0deg)}   to{transform:rotate(-360deg)} }

/* ═══ CLASSES IDLE ═══════════════════════════════════════ */
.cup-idle    { animation: cupFloat    3.2s ease-in-out infinite !important; }
.tin-idle    { animation: tinSway     4.5s ease-in-out infinite !important; }
.steam-idle  { animation: steamDrift  2.8s ease-in-out infinite !important; }
.ticket-idle { animation: ticketFloat 3.8s ease-in-out infinite !important; }
.badge-idle  { animation: badgePulse  3s   ease-in-out infinite !important; }

/* ─── Hover — Tag ── */
.home-tag:hover { animation: tagGlow 1.2s ease-in-out infinite !important; cursor:default; }

/* ─── Hover — Badge vert ── */
.home-badge { transition: transform .25s ease; }
.home-badge:hover { transform: scale(1.03) !important; }

/* ─── Hover — images ── */
.home-cup:hover {
  animation: cupFloat 1.2s ease-in-out infinite !important;
  filter: drop-shadow(0 16px 28px rgba(0,0,0,.28)) !important;
}
.home-tin:hover {
  animation: tinSway 1s ease-in-out infinite !important;
  filter: drop-shadow(0 14px 24px rgba(0,0,0,.22)) !important;
}
.home-ticket:hover {
  animation: ticketFloat 1s ease-in-out infinite !important;
  filter: drop-shadow(0 14px 28px rgba(0,0,0,.28)) !important;
}

/* ─── Hover — Feuilles de fond ── */
.home-leaf { transition: opacity .3s ease; }
.home-leaf:hover {
  animation: leafRotate 8s linear infinite !important;
  opacity: 0.18 !important;
}

/* ─── Bouton CTA ── */
.home-cta-btn {
  position: relative; overflow: hidden;
  transition: transform .2s ease !important;
}
.home-cta-btn .home-ripple {
  position: absolute; border-radius: 50%;
  width: 20px; height: 20px;
  background: rgba(255,255,255,.45);
  transform: scale(0);
  animation: ripple .7s linear;
  pointer-events: none;
}
.home-cta-btn::after {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.28), transparent);
  background-size: 200% 100%;
  border-radius: 50px; opacity: 0; transition: opacity .2s;
}
.home-cta-btn:hover {
  transform: translateY(-3px) !important;
  animation: homePulseRing 1.4s ease-out infinite !important;
}
.home-cta-btn:hover::after { opacity:1; animation: homeShimmer 1s linear infinite; }
.home-cta-btn:active { transform: translateY(-1px) !important; }

/* ─── "100% Gagnant" ── */
.home-hundred { animation: hundredPulse 3s ease-in-out infinite; }
.home-hundred:hover { animation: hundredPulse .8s ease-in-out infinite !important; }

/* ─── Underline "Comment ça marche?" ── */
.home-how-title { position:relative; display:inline-block; }
.home-how-title::after {
  content:''; position:absolute; bottom:-3px; left:0;
  width:0; height:2px; background:#1a3c2e; border-radius:2px;
  transition: width .3s ease;
}
.home-how-title:hover::after { width:100%; }

/* ─── Step cards ── */
.step-card-wrapper { cursor:default; }
.step-card-inner {
  transition: transform .35s cubic-bezier(.22,.68,0,1.2), box-shadow .35s ease;
}
.step-card-wrapper:hover .step-card-inner {
  transform: translateY(-10px);
  box-shadow: 0 24px 48px rgba(0,0,0,.30) !important;
}
.step-card-wrapper:hover .step-number {
  animation: numberBounce .5s cubic-bezier(.22,.68,0,1.4) both;
}
.step-card-wrapper:hover .step-img {
  animation: stepImgSpin .6s ease both;
}
.step-card-wrapper:hover .step-label {
  letter-spacing: 0.04em;
  transition: letter-spacing .3s ease;
}

/* ─── Sparkles & Particules ── */
.home-spark {
  position:absolute; pointer-events:none; z-index:1;
  animation: sparkle ease-in-out infinite;
}
.home-spark::before, .home-spark::after {
  content:''; position:absolute;
  background: rgba(180,100,40,.45); border-radius:1px;
}
.home-spark::before { width:2px; height:10px; top:-5px; left:0; }
.home-spark::after  { width:10px; height:2px; top:0; left:-5px; }

.home-particle {
  position:absolute; border-radius:50%;
  background:rgba(200,114,58,.6); pointer-events:none;
  animation: particleRise linear infinite;
}

/* ─── Hero card shimmer continu ── */
.hero-shimmer {
  position:absolute; inset:0; border-radius:24px;
  overflow:hidden; pointer-events:none; z-index:1;
}
.hero-shimmer::after {
  content:'';
  position:absolute; top:0; left:0;
  width:30%; height:100%;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.12),transparent);
  animation: heroShimmerSweep 5s ease-in-out 2s infinite;
}
`

function startIdleAfterEntry(el, idleClass, entryDurationMs, finalStyles = {}) {
  if (!el) return
  const timer = setTimeout(() => {
    Object.assign(el.style, finalStyles)
    el.style.animation = ''
    if (idleClass) el.classList.add(idleClass)
  }, entryDurationMs)
  return () => clearTimeout(timer)
}

function useReveal(t = 0.04) {
  const [vis, setVis] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect() } },
      { threshold: t }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [t])
  return [ref, vis]
}

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth)
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return width
}

/* ─── Tilt 3D sur les step cards ─────────────────────────── */
function StepCard({ n, img, label, visible, delay, isMobile }) {
  const wrapRef = useRef(null)

  useEffect(() => {
    const el = wrapRef.current
    if (!el || isMobile) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const inner = el.querySelector('.step-card-inner')
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      const x = ((e.clientX - r.left) / r.width  - 0.5) * 16
      const y = ((e.clientY - r.top)  / r.height - 0.5) * -16
      inner.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${y}deg) translateY(-10px) scale(1.02)`
    }
    const onLeave = () => { inner.style.transform = '' }
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [isMobile])

  return (
    <div ref={wrapRef} className="step-card-wrapper" style={{
      position: 'relative', paddingTop: 22,
      width: isMobile ? '100%' : 350,
      maxWidth: isMobile ? 320 : 350,
      flexShrink: 0,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(40px)',
      transition: `opacity .55s ease ${delay}s, transform .6s cubic-bezier(.22,.68,0,1.1) ${delay}s`,
    }}>
      <div className="step-number" style={{
        position: 'absolute', top: 0, left: 18, zIndex: 3,
        width: 40, height: 40, borderRadius: '50%',
        background: '#1a3c2e', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 700, fontSize: '1rem',
        boxShadow: '0 3px 12px rgba(0,0,0,.4)',
        border: '2px solid rgba(255,255,255,.2)',
      }}>
        {n}
      </div>
      <div className="step-card-inner" style={{
        borderRadius: 16, overflow: 'hidden',
        boxShadow: '0 8px 28px rgba(0,0,0,.30)',
        willChange: 'transform',
      }}>
        <div style={{
          background: '#EEE1CE',
          padding: isMobile ? '1.5rem 1rem 1.2rem' : '0rem 1rem 0rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <img className="step-img" src={img} alt={label} style={{
            width: isMobile ? 56 : 150, height: isMobile ? 56 : 150,
            objectFit: 'contain', display: 'block',
          }} />
        </div>
        <div style={{ background: '#1a3c2e', padding: '0.85rem 0.75rem', textAlign: 'center' }}>
          <span className="step-label" style={{
            color: '#fff', fontWeight: 700,
            fontSize: isMobile ? '0.95rem' : '0.9rem',
            lineHeight: 1.3, fontFamily: "'Lato', sans-serif", display: 'block',
          }}>
            {label}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  const tagRef    = useRef(null)
  const badgeRef  = useRef(null)
  const descRef   = useRef(null)
  const ticketRef = useRef(null)
  const btnRef    = useRef(null)
  const cupRef    = useRef(null)
  const tinRef    = useRef(null)
  const steamRef  = useRef(null)
  const heroRef   = useRef(null)

  const [stepsRef, stepsVis] = useReveal(0.04)
  const width = useWindowWidth()

  const isTablet      = width <= 1100
  const isMobile      = width <= 768
  const isSmallMobile = width <= 480

  /* ── Animations d'entrée + passage idle ── */
  useEffect(() => {
    const seq = [
      { el: tagRef.current,    anim: 'fadeInLeft   .55s ease .08s both' },
      { el: badgeRef.current,  anim: 'fadeInLeft   .55s ease .24s both' },
      { el: descRef.current,   anim: 'fadeInLeft   .55s ease .40s both' },
      { el: ticketRef.current, anim: 'fadeInDown   .65s ease .55s both' },
      { el: btnRef.current,    anim: 'fadeInUp     .50s ease .75s both' },
      { el: cupRef.current,    anim: 'fadeInRight  .75s ease .18s both' },
      { el: tinRef.current,    anim: 'fadeInRight  .75s ease .36s both' },
      { el: steamRef.current,  anim: 'fadeInUpSoft .80s ease 1.1s both' },
    ]
    seq.forEach(({ el, anim }) => { if (el) el.style.animation = anim })

    const cleanups = [
      startIdleAfterEntry(cupRef.current,    'cup-idle',    1100, { opacity:'1', transform:'none' }),
      startIdleAfterEntry(tinRef.current,    'tin-idle',    1300, { opacity:'1', transform:'none' }),
      startIdleAfterEntry(steamRef.current,  'steam-idle',  2100, { opacity:'0.5', transform:'none' }),
      startIdleAfterEntry(ticketRef.current, 'ticket-idle', 1400, { opacity:'1', transform:'rotate(-5deg)' }),
      startIdleAfterEntry(tagRef.current,    null,           800,  { opacity:'1', transform:'none' }),
    ]
    return () => cleanups.forEach(c => c?.())
  }, [])

  /* ── Parallaxe souris sur les images flottantes ── */
  useEffect(() => {
    if (isTablet) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const onMouseMove = (e) => {
      const cx = window.innerWidth  / 2
      const cy = window.innerHeight / 2
      const dx = (e.clientX - cx) / cx
      const dy = (e.clientY - cy) / cy

      if (cupRef.current?.classList.contains('cup-idle')) {
        cupRef.current.style.transform = `translateY(${dy * -10}px) translateX(${dx * 6}px)`
      }
      if (tinRef.current?.classList.contains('tin-idle')) {
        tinRef.current.style.transform = `translateY(${dy * -6}px) translateX(${dx * 4}px) rotate(${dx * 1}deg)`
      }
      if (steamRef.current?.classList.contains('steam-idle')) {
        steamRef.current.style.transform = `translateY(${dy * -14}px) translateX(${dx * 8}px)`
      }
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [isTablet])

  /* ── Ripple sur le bouton CTA ── */
  const addRipple = useCallback((e) => {
    const btn = e.currentTarget
    const r = btn.getBoundingClientRect()
    const span = document.createElement('span')
    span.className = 'home-ripple'
    span.style.left = `${e.clientX - r.left - 10}px`
    span.style.top  = `${e.clientY - r.top  - 10}px`
    btn.appendChild(span)
    span.addEventListener('animationend', () => span.remove())
  }, [])

  return (
    <Layout>
      <style>{CSS}</style>

      <div>
        <section style={{
          flex: '1.6', position: 'relative',
          background: '#f5f0e8', overflow: 'hidden',
        }}>
          <AnimatedLeaves />

          {/* Particules montantes */}
          {PARTICLES.map(p => (
            <div key={p.id} className="home-particle" style={{
              left: p.left, bottom: '-10px',
              width: `${p.size}px`, height: `${p.size}px`,
              opacity: p.opacity,
              animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s`,
            }} />
          ))}

          {/* Sparkles */}
          {SPARKS.map((s, i) => (
            <span key={i} className="home-spark" style={{
              left: s.left, top: s.top,
              width: `${s.s}px`, height: `${s.s}px`,
              animationDuration: s.dur, animationDelay: s.del,
            }} />
          ))}

          {/* Cercles déco tournants */}
          <div style={{
            position:'absolute', borderRadius:'50%', pointerEvents:'none',
            width:500, height:500, top:-200, left:-150, zIndex:0,
            border:'1.5px dashed rgba(26,60,46,.07)',
            animation:'decoSpin 40s linear infinite',
          }} />
          <div style={{
            position:'absolute', borderRadius:'50%', pointerEvents:'none',
            width:300, height:300, bottom:-80, right:-80, zIndex:0,
            border:'1.5px dashed rgba(200,100,40,.07)',
            animation:'decoSpinR 30s linear infinite',
          }} />

          <img className="home-leaf" src="/images/Accueil/img_09.png" alt="" style={{
            position:'absolute', right:'5%', top:'-30%',
            width: isMobile ? '50%' : 'auto',
            zIndex:1, transform:'rotate(90deg)', pointerEvents:'none',
          }} />
          <img className="home-leaf" src="/images/Accueil/img_09.png" alt="" style={{
            position:'absolute', right: isMobile ? '5%' : '20%', bottom:'-30%',
            width: isMobile ? '50%' : 'auto',
            zIndex:1, transform:'rotate(90deg)', pointerEvents:'none',
          }} />

          {/* ════ HERO CARD ════ */}
          <div
            ref={heroRef}
            style={{
              zIndex:2,
              padding: isMobile ? '2rem 1.25rem' : '3.5rem 2rem',
              margin: isMobile
                ? '1.25rem 1rem 0 1rem'
                : isTablet
                  ? '2rem 2rem 0 2rem'
                  : '3rem 10rem 0 10rem',
              position:'relative', borderRadius:24,
              background:'#EEE1CE', border:'1px solid #e2d9c8',
              boxShadow:'0 6px 40px rgba(0,0,0,.08)', overflow:'visible',
              display:'grid',
              gridTemplateColumns: isTablet ? '1fr' : '38% 62%',
              gap: isTablet ? '2rem' : 0,
              animation:'heroCardHue 10s ease-in-out 3s infinite',
            }}
          >
            {/* Shimmer sweep sur le hero */}
            <div className="hero-shimmer" />

            {/* ── Colonne gauche : texte ── */}
            <div style={{ position:'relative', zIndex:2 }}>
              <p ref={tagRef} className="home-tag" style={{
                fontSize: isMobile ? '1rem' : isTablet ? '1.2rem' : '1.5rem',
                fontWeight:700, letterSpacing: isMobile ? '0.08em' : '0.18em',
                textTransform:'uppercase', color:'#6b6b6b',
                marginBottom:'0.85rem', opacity:0,
              }}>
                PARTICIPEZ AU JEU-CONCOURS
              </p>

              <div ref={badgeRef} className="home-badge" style={{
                position:'relative',
                display:'inline-flex', alignItems:'center', justifyContent:'center',
                marginBottom: isMobile ? '1.4rem' : '1.2rem',
                opacity:0,
                padding: isMobile ? '0.55rem 2.8rem' : '0.65rem 3.5rem',
                minHeight: isMobile ? 52 : 60,
              }}>
                <img src="/images/Accueil/img_03.png" alt="" style={{
                  position:'absolute', top:'50%', left:'50%',
                  transform:'translate(-50%, -50%) rotate(90deg) scaleY(-1)',
                  height: isMobile ? '260px' : '360px',
                  width:'auto', zIndex:0, pointerEvents:'none', userSelect:'none',
                }} />
                <span style={{
                  position:'relative', zIndex:1,
                  fontFamily:"'Dancing Script', cursive",
                  fontSize: isMobile ? '2.1rem' : '2.6rem',
                  color:'#fff', fontWeight:600,
                  whiteSpace:'nowrap',
                  textShadow:'0 1px 4px rgba(0,0,0,.18)', lineHeight:1,
                }}>
                  Thé Tip Top
                </span>
              </div>

              <p ref={descRef} style={{
                fontSize: isMobile ? '1rem' : isTablet ? '1.05rem' : '1.2rem',
                lineHeight:1.8, color:'#4a4a4a', opacity:0,
                maxWidth: isTablet ? '100%' : '90%',
              }}>
                Célébrez l'ouverture de notre 10ème boutique à Nice avec notre jeu-concours
                qui est 100% gagnant et voir une chance de gagner des cadeaux et lots de thé
                bio artisanaux.
              </p>
            </div>

            {/* ── Colonne droite : ticket + CTA ── */}
            <div style={{
              position: isTablet ? 'relative' : 'absolute',
              left:      isTablet ? 'auto' : '50%',
              top:       isTablet ? 'auto' : '35%',
              transform: isTablet ? 'none' : 'translate(-50%, -50%)',
              zIndex:8,
              display:'flex', flexDirection:'column',
              alignItems:'center', gap:'1.25rem',
              width:     isTablet ? '100%' : 'auto',
              marginTop: isTablet ? '1rem' : 0,
            }}>
              <div ref={ticketRef} className="home-ticket" style={{
                width: isMobile ? '100%' : isTablet ? '70%' : '95%',
                maxWidth: isMobile ? 340 : 520,
                transform:'rotate(-5deg)',
                filter:'drop-shadow(0 8px 20px rgba(0,0,0,.18))',
                opacity:0,
              }}>
                <div style={{ position:'relative' }}>
                  <img src="/images/Accueil/img_06.png" alt="" style={{
                    width:'100%', display:'block', borderRadius:8,
                    transform:'rotate(175deg)',
                  }} />
                  <div style={{
                    position:'absolute', top:'50%', left:'50%',
                    transform:'translate(-50%, -50%) rotate(-5deg)',
                    textAlign:'center', width:'72%',
                  }}>
                    <p style={{
                      fontFamily:"'Playfair Display', serif", fontWeight:700,
                      fontSize: isMobile ? '1.2rem' : '1.8rem',
                      color:'#1a1a1a', marginBottom:'0.2rem', lineHeight:1.3,
                    }}>Tirage au sort final :</p>
                    <p style={{
                      fontFamily:"'Dancing Script', cursive",
                      fontSize: isMobile ? '1.6rem' : '2.2rem',
                      color:'#e8431a', fontWeight:700, lineHeight:1.15,
                    }}>1 AN de thé offert</p>
                    <div style={{ width:'55%', height:1, background:'rgba(170,130,40,.5)', margin:'0.25rem auto' }} />
                    <p style={{ fontSize: isMobile ? '0.85rem' : '1rem', color:'#666', lineHeight:1.5 }}>
                      Jeu limité dans le temps.<br />Voir modalité en magasin et sur le site
                    </p>
                  </div>
                </div>
              </div>

              <div ref={btnRef} style={{ opacity:0 }}>
                <Link
                  to="/register"
                  className="home-cta-btn"
                  onClick={addRipple}
                  style={{
                    display:'inline-block',
                    background:'#e8431a', color:'#fff',
                    borderRadius:50,
                    padding: isMobile ? '0.8rem 2rem' : '0.9rem 2.5rem',
                    fontSize: isMobile ? '0.95rem' : '1.05rem',
                    fontWeight:700, textDecoration:'none',
                    boxShadow:'0 4px 16px rgba(232,67,26,.35)',
                    fontFamily:"'Lato', sans-serif",
                  }}
                >
                  Jouer maintenant
                </Link>
              </div>
            </div>

            {/* ── Images flottantes — desktop uniquement ── */}
            {!isTablet && (
              <>
                <img ref={steamRef} className="home-steam" src="/images/Accueil/img_10.png" alt="" style={{
                  position:'absolute', bottom:'50%', right:'14.5%',
                  width:'11.5%', opacity:0, zIndex:6,
                }} />
                <img ref={cupRef} className="home-cup" src="/images/Accueil/img_02.png" alt="" style={{
                  position:'absolute', bottom:'0%', right:'7.5%',
                  height:'70%', width:'auto', zIndex:5, opacity:0,
                }} />
                <img ref={tinRef} className="home-tin" src="/images/Accueil/img_01.png" alt="" style={{
                  position:'absolute', top:'0%', right:'0%',
                  height:'100%', width:'auto', zIndex:4, opacity:0,
                }} />
              </>
            )}
          </div>

          {/* ════ SECTION STEPS ════ */}
          <div ref={stepsRef} style={{
            position:'relative', zIndex:2,
            margin: isMobile ? '1.5rem 1rem 0 1rem' : isTablet ? '2rem 2rem 0 2rem' : '0 8rem',
            display:'flex',
            alignItems: isTablet ? 'stretch' : 'center',
            justifyContent: isTablet ? 'center' : 'flex-start',
            flexWrap:'wrap',
            gap: isMobile ? '1.25rem' : '3rem',
          }}>
            <div style={{
              display:'flex', alignItems:'center',
              justifyContent: isMobile ? 'center' : 'flex-start',
              width: isTablet ? '100%' : 'auto',
              flexWrap: isSmallMobile ? 'wrap' : 'nowrap',
            }}>
              <div className="home-hundred" style={{
                height: isMobile ? 180 : 265,
                position:'relative', flexShrink:0,
                opacity: stepsVis ? 1 : 0,
                transform: stepsVis ? 'scale(1)' : 'scale(0.78)',
                transition:'opacity .55s ease, transform .6s cubic-bezier(.22,.68,0,1.2)',
              }}>
                <img src="/images/Accueil/img_05.png" alt="" style={{ width:'100%', height:'100%', objectFit:'contain' }} />
                <div style={{
                  position:'absolute', inset:0,
                  display:'flex', flexDirection:'column',
                  alignItems:'center', justifyContent:'center',
                }}>
                  <span style={{
                    fontFamily:"'Playfair Display',serif", fontStyle:'italic',
                    color:'#fff', fontSize: isMobile ? '1.45rem' : '2.2rem', lineHeight:1,
                  }}>100%</span>
                  <span style={{
                    fontFamily:"'Playfair Display',serif", fontStyle:'italic',
                    color:'#fff', fontSize: isMobile ? '1.45rem' : '2.2rem',
                  }}>Gagnant</span>
                </div>
              </div>

              <div style={{
                padding: isMobile ? '0.8rem 1rem' : '1rem',
                backgroundColor:'#EEE1CE',
                borderTopRightRadius:'25px', borderBottomRightRadius:'25px',
                width: isSmallMobile ? '100%' : 'auto',
                textAlign: isSmallMobile ? 'center' : 'left',
              }}>
                <h2 className="home-how-title" style={{
                  fontFamily:"'Playfair Display',serif", color:'#1a3c2e',
                  fontSize: isMobile ? '1.2rem' : '1.55rem', margin:0,
                  whiteSpace: isSmallMobile ? 'normal' : 'nowrap',
                  opacity: stepsVis ? 1 : 0,
                  transform: stepsVis ? 'none' : 'translateX(-20px)',
                  transition:'opacity .55s ease .14s, transform .6s cubic-bezier(.22,.68,0,1.1) .14s',
                }}>
                  Comment ça marche ?
                </h2>
              </div>
            </div>

            <div style={{
              display:'flex', flexWrap:'wrap',
              gap: isMobile ? '1rem' : '1.5rem',
              justifyContent:'center',
              flex:1, width: isTablet ? '100%' : 'auto',
            }}>
              <StepCard n={1} img="/images/Accueil/img_08.png" label="Récupère ton ticket" visible={stepsVis} delay={0.28} isMobile={isMobile} />
              <StepCard n={2} img="/images/Accueil/img_07.png" label="Saisis ton code"      visible={stepsVis} delay={0.44} isMobile={isMobile} />
              <StepCard n={3} img="/images/Accueil/img_04.png" label="Découvre ton lot"     visible={stepsVis} delay={0.60} isMobile={isMobile} />
            </div>
          </div>

        </section>
      </div>
    </Layout>
  )
}