// src/views/pages/JeuPage.jsx

import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import PageBanner from '../components/PageBanner.jsx'
import CountdownBanner from '../components/CountdownBanner.jsx'

/* ─── Particules de fond ──────────────────────────────────── */
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id:      i,
  left:    `${4 + (i * 4.8) % 92}%`,
  size:    3 + (i % 5),
  dur:     7 + (i % 6),
  delay:   (i * 0.65) % 9,
  opacity: 0.05 + (i % 4) * 0.025,
}))

/* ─── Sparkles fixes ──────────────────────────────────────── */
const SPARKS = [
  { left: '8%',  top: '18%', s: 8,  dur: '3.4s', del: '0s'   },
  { left: '92%', top: '12%', s: 6,  dur: '4.2s', del: '1.1s' },
  { left: '15%', top: '75%', s: 10, dur: '3.9s', del: '0.5s' },
  { left: '85%', top: '68%', s: 7,  dur: '5.1s', del: '2.0s' },
  { left: '50%', top: '8%',  s: 6,  dur: '4.0s', del: '1.6s' },
]

const CSS = `
  /* ══════════════════════════════════
     ENTRÉES
  ══════════════════════════════════ */
  @keyframes jeuImgIn {
    from { opacity:0; transform: translateX(-50px) scale(0.95) rotate(-1deg); }
    to   { opacity:1; transform: none; }
  }
  @keyframes jeuTextIn {
    from { opacity:0; transform: translateX(40px); }
    to   { opacity:1; transform: none; }
  }
  @keyframes jeuLineIn {
    from { opacity:0; transform: translateY(16px); }
    to   { opacity:1; transform: none; }
  }
  @keyframes underlineGrow {
    from { width: 0; opacity: 0; }
    to   { width: 72px; opacity: 1; }
  }

  /* ══════════════════════════════════
     IDLE CONTINUS
  ══════════════════════════════════ */
  @keyframes particleRise {
    0%   { transform: translateY(0)     rotate(0deg);   opacity:0; }
    8%   { opacity:1; }
    92%  { opacity:1; }
    100% { transform: translateY(-88vh) rotate(360deg); opacity:0; }
  }
  @keyframes imgFloat {
    0%, 100% { transform: translateY(0)    rotate(0deg)   scale(1); }
    50%       { transform: translateY(-7px) rotate(0.4deg) scale(1.008); }
  }
  @keyframes sectionHue {
    0%, 100% { background-color: var(--cream); }
    50%       { background-color: #e8d9c2; }
  }
  @keyframes sparkle {
    0%, 100% { opacity:0; transform: scale(0)   rotate(0deg); }
    40%       { opacity:1; transform: scale(1)   rotate(180deg); }
    70%       { opacity:.6; transform: scale(.7) rotate(270deg); }
  }
  @keyframes decoOrbit {
    from { transform: rotate(0deg)   translateX(8px) rotate(0deg); }
    to   { transform: rotate(360deg) translateX(8px) rotate(-360deg); }
  }
  @keyframes shimmerSweep {
    0%   { transform: translateX(-130%) skewX(-12deg); }
    100% { transform: translateX(230%)  skewX(-12deg); }
  }

  /* ══════════════════════════════════
     INTERACTIONS
  ══════════════════════════════════ */
  @keyframes jeuShimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes jeuPulseRing {
    0%   { box-shadow: 0 0 0 0    rgba(200,100,40,.38); }
    70%  { box-shadow: 0 0 0 14px rgba(200,100,40,0); }
    100% { box-shadow: 0 0 0 0    rgba(200,100,40,0); }
  }

  /* ══════════════════════════════════
     IMAGE
  ══════════════════════════════════ */
  .jeu-img-col {
    position: relative;
  }
  .jeu-img-col img {
    transition: transform .45s cubic-bezier(.25,.46,.45,.94), box-shadow .45s ease;
    will-change: transform;
  }
  .jeu-img-col:hover img {
    transform: scale(1.03) translateY(-5px) !important;
    box-shadow: 0 28px 60px rgba(0,0,0,.20) !important;
  }

  /* Shimmer sur image */
  .jeu-img-col::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 18px;
    overflow: hidden;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.15), transparent);
    background-size: 200% 100%;
    opacity: 0;
    transition: opacity .3s;
    pointer-events: none;
  }
  .jeu-img-col:hover::after {
    opacity: 1;
    animation: shimmerSweep 1.4s ease-in-out infinite;
  }

  /* ══════════════════════════════════
     TEXTE
  ══════════════════════════════════ */
  .jeu-text-block p {
    transition: color .3s ease, transform .3s ease;
  }
  .jeu-text-block p:hover {
    color: var(--text-dark, #2a2a2a);
    transform: translateX(3px);
  }

  /* Trait animé sous le h2 */
  .jeu-underline {
    display: block;
    height: 3px; width: 72px;
    border-radius: 4px;
    background: linear-gradient(90deg, var(--orange, #c8723a), #e89060);
    margin: 0.55rem 0 1.5rem;
    animation: underlineGrow .7s cubic-bezier(.22,.68,0,1.1) .55s both;
  }

  /* ══════════════════════════════════
     BOUTON
  ══════════════════════════════════ */
  .jeu-btn {
    position: relative;
    overflow: hidden;
    transition: transform .25s ease, box-shadow .25s ease;
  }
  .jeu-btn::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.28), transparent);
    background-size: 200% 100%;
    opacity: 0; transition: opacity .2s;
  }
  .jeu-btn:hover {
    transform: translateY(-3px);
    animation: jeuPulseRing 1.4s ease-out infinite;
  }
  .jeu-btn:hover::after { opacity:1; animation: jeuShimmer 1s linear infinite; }
  .jeu-btn:active { transform: translateY(-1px); }

  /* ══════════════════════════════════
     SPARKLES
  ══════════════════════════════════ */
  .jeu-spark {
    position: absolute; pointer-events: none; z-index: 1;
    animation: sparkle ease-in-out infinite;
  }
  .jeu-spark::before, .jeu-spark::after {
    content: ''; position: absolute;
    background: rgba(180,100,40,.45); border-radius: 1px;
  }
  .jeu-spark::before { width:2px; height:10px; top:-5px; left:0; }
  .jeu-spark::after  { width:10px; height:2px; top:0; left:-5px; }

  /* Particule de fond */
  .jeu-particle {
    position: absolute;
    border-radius: 50%;
    background: var(--orange, #c8723a);
    pointer-events: none;
    animation: particleRise linear infinite;
  }

  /* ══════════════════════════════════
     LAYOUT
  ══════════════════════════════════ */
  .jeu-section {
    position: relative;
    background: var(--cream);
    padding: 4rem 1.5rem 5rem;
    overflow: hidden;
    animation: sectionHue 10s ease-in-out 2s infinite;
  }

  .jeu-inner {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: row;
    gap: 4rem;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 6rem;
  }

  /* Largeur de la colonne image en desktop (remplace le style inline) */
  .jeu-img-col {
    width: 440px;
    flex-shrink: 0;
  }

  /* ══════════════════════════════════
     RESPONSIVE — VERTICAL sur mobile
  ══════════════════════════════════ */
  @media (max-width: 1024px) {
    .jeu-inner { padding: 0 2.5rem; gap: 3rem; }
    .jeu-img-col { width: 380px; }
  }

  /* Tablette & mobile : colonne, image EN HAUT, jamais cachée */
  @media (max-width: 768px) {
    .jeu-inner {
      flex-direction: column !important;
      padding: 0 1.5rem;
      gap: 2.5rem;
      align-items: center;
    }
    .jeu-img-col {
      width: 100% !important;
      max-width: 480px;
      flex-shrink: 0;
    }
    .jeu-img-col img { border-radius: 14px !important; }
    .jeu-text-block  { width: 100%; }
    .jeu-underline   { margin: 0.55rem auto 1.5rem; }
    .jeu-text-block h2,
    .jeu-text-block p { text-align: center !important; }
    .jeu-text-block p:hover { transform: none; }
    .jeu-btn-wrap { text-align: center; }
  }

  @media (max-width: 480px) {
    .jeu-inner { padding: 0 1rem; gap: 2rem; }
    .jeu-section { padding: 2.5rem 1rem 4rem; }
    .jeu-img-col { max-width: 100%; }
  }

  /* ══════════════════════════════════
     MOUVEMENT RÉDUIT
  ══════════════════════════════════ */
  @media (prefers-reduced-motion: reduce) {
    .jeu-particle, .jeu-spark,
    .jeu-section, .jeu-img-float { animation: none !important; }
  }
`

export default function JeuPage() {
  const imgRef  = useRef(null)
  const imgWrap = useRef(null)
  const h2Ref   = useRef(null)
  const p1Ref   = useRef(null)
  const p2Ref   = useRef(null)
  const p3Ref   = useRef(null)
  const p4Ref   = useRef(null)
  const btnRef  = useRef(null)

  /* ── Animations d'entrée ── */
  useEffect(() => {
    const items = [
      [imgRef,  'jeuImgIn  .75s cubic-bezier(.22,.68,0,1.1) .15s both'],
      [h2Ref,   'jeuTextIn .65s ease .35s both'],
      [p1Ref,   'jeuLineIn .55s ease .50s both'],
      [p2Ref,   'jeuLineIn .55s ease .63s both'],
      [p3Ref,   'jeuLineIn .55s ease .76s both'],
      [p4Ref,   'jeuLineIn .55s ease .89s both'],
      [btnRef,  'jeuLineIn .55s ease 1.00s both'],
    ]
    items.forEach(([ref, anim]) => {
      if (ref.current) ref.current.style.animation = anim
    })
  }, [])

  /* ── Tilt 3D sur l'image ── */
  useEffect(() => {
    const el = imgWrap.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      const x = ((e.clientX - r.left) / r.width  - 0.5) * 12
      const y = ((e.clientY - r.top)  / r.height - 0.5) * -12
      el.querySelector('img').style.transform =
        `perspective(700px) rotateY(${x}deg) rotateX(${y}deg) scale(1.03) translateY(-4px)`
    }
    const onLeave = () => {
      el.querySelector('img').style.transform = ''
    }
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  /* ── Parallaxe image au scroll ── */
  useEffect(() => {
    const el = imgWrap.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const onScroll = () => {
      const rect  = el.getBoundingClientRect()
      const ratio = (window.innerHeight / 2 - rect.top) / window.innerHeight
      el.style.transform = `translateY(${ratio * -18}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <Layout>
      <style>{CSS}</style>
      <PageBanner title="Jeu-concours" />
              <CountdownBanner />

      <section className="jeu-section">

        {/* Particules montantes */}
        {PARTICLES.map(p => (
          <div key={p.id} className="jeu-particle" style={{
            left:               p.left,
            bottom:             '-12px',
            width:              `${p.size}px`,
            height:             `${p.size}px`,
            opacity:            p.opacity,
            animationDuration:  `${p.dur}s`,
            animationDelay:     `${p.delay}s`,
          }} />
        ))}

        {/* Sparkles */}
        {SPARKS.map((s, i) => (
          <span key={i} className="jeu-spark" style={{
            left:              s.left,
            top:               s.top,
            width:             `${s.s}px`,
            height:            `${s.s}px`,
            animationDuration: s.dur,
            animationDelay:    s.del,
          }} />
        ))}

        {/* Cercles décoratifs de fond */}
        <div style={{
          position:'absolute', borderRadius:'50%', pointerEvents:'none',
          width:500, height:500, top:-180, right:-120,
          background:'radial-gradient(circle, rgba(80,120,60,.08) 0%, transparent 70%)',
        }} />
        <div style={{
          position:'absolute', borderRadius:'50%', pointerEvents:'none',
          width:320, height:320, bottom:-100, left:-80,
          background:'radial-gradient(circle, rgba(200,100,40,.07) 0%, transparent 70%)',
        }} />
        <div style={{
          position:'absolute', borderRadius:'50%', pointerEvents:'none',
          width:180, height:180, top:'45%', left:'42%',
          background:'radial-gradient(circle, rgba(106,143,90,.05) 0%, transparent 70%)',
        }} />

        <div className="jeu-inner">

          {/* ── Colonne image ── */}
          <div
            ref={(el) => { imgRef.current = el; imgWrap.current = el }}
            className="jeu-img-col"
            style={{ opacity:0 }}
          >
            {/* Halo derrière l'image */}
            <div style={{
              position:'absolute', inset:'-12px',
              borderRadius:28,
              background:'radial-gradient(circle, rgba(200,114,58,.12) 0%, transparent 70%)',
              animation:'decoOrbit 12s linear infinite',
              pointerEvents:'none',
            }} />

            <img
              src="/images/Jeu/img_01.png"
              alt="Boutique Thé Tip Top"
              className="jeu-img-float"
              style={{
                width:'100%',
                borderRadius:18,
                objectFit:'cover',
                boxShadow:'0 12px 36px rgba(0,0,0,.13)',
                display:'block',
                position:'relative',
                animation:'imgFloat 5s ease-in-out 1.2s infinite',
              }}
            />
          </div>

          {/* ── Colonne texte ── */}
          <div className="jeu-text-block" style={{ flex:1 }}>

            <h2 ref={h2Ref} style={{ marginBottom:'0.2rem', opacity:0 }}>
              Présentation du jeu
            </h2>
            <span className="jeu-underline" />

            <p ref={p1Ref} style={{
              color:'var(--text-muted)', lineHeight:1.85,
              marginBottom:'1rem', fontSize:'0.93rem',
              textAlign:'justify', opacity:0,
            }}>
              À l'occasion de l'ouverture de notre 10ème boutique à Nice, nous organisons un
              grand jeu-concours exclusif pour remercier nos fidèles clients et faire découvrir
              nos créations de thés bio et artisanaux. Chaque achat supérieur à 49&nbsp;€ donne
              accès à un code unique permettant de participer au jeu.
            </p>

            <p ref={p2Ref} style={{
              color:'var(--text-muted)', lineHeight:1.85,
              marginBottom:'1rem', fontSize:'0.93rem',
              textAlign:'justify', opacity:0,
            }}>
              100&nbsp;% des participations sont gagnantes et offrent la possibilité de remporter
              des infuseurs, des thés signature, des coffrets découverte ou des lots premium.
              La participation est simple, rapide et sécurisée, directement depuis ce site dédié,
              dans le respect des données personnelles et de la réglementation en vigueur.
            </p>

            <p ref={p3Ref} style={{
              color:'var(--text-muted)', lineHeight:1.85,
              marginBottom:'1rem', fontSize:'0.93rem',
              textAlign:'justify', opacity:0,
            }}>
              À l'issue du jeu-concours, un grand tirage au sort sera organisé et le gagnant
              remportera un an de thé gratuit.
            </p>

            <p ref={p4Ref} style={{
              color:'var(--text-muted)', lineHeight:1.85,
              marginBottom:'2.25rem', fontSize:'0.93rem',
              fontStyle:'italic', opacity:0,
            }}>
              Participez dès maintenant pour gagner des cadeaux thé de luxe&nbsp;!
            </p>

            <div ref={btnRef} className="jeu-btn-wrap" style={{ opacity:0 }}>
              <Link
                to="/gains"
                className="btn btn-orange jeu-btn"
                style={{ fontSize:'0.95rem', padding:'0.85rem 2.5rem' }}
              >
                Lots à gagner
              </Link>
            </div>
          </div>

        </div>
      </section>
    </Layout>
  )
}