import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import PageBanner from '../components/PageBanner.jsx'

/* ─── Hook scroll-reveal ──────────────────────────────────── */
function useReveal(threshold = 0.15) {
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

/* ─── Hook tilt 3D sur hover ──────────────────────────────── */
function useTilt() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      const x = ((e.clientX - r.left) / r.width  - 0.5) * 14
      const y = ((e.clientY - r.top)  / r.height - 0.5) * -14
      el.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${y}deg) translateY(-8px) scale(1.02)`
    }
    const onLeave = () => {
      el.style.transform = ''
    }
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [])
  return ref
}

/* ─── Particules flottantes ───────────────────────────────── */
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left:  `${5 + (i * 5.5) % 90}%`,
  size:  4 + (i % 5),
  dur:   6 + (i % 7),
  delay: (i * 0.7) % 8,
  opacity: 0.06 + (i % 4) * 0.03,
}))

/* ─── Données statiques des 5 lots ───────────────────────── */
const PRIZES = [
  {
    img:   '/images/Gain/img_01.png',
    title: 'Lot 1 – Infuseur à thé',
    lines: [
      "Ce lot comprend un infuseur à thé réutilisable, pensé pour accompagner la dégustation des thés et infusions Thé Tip Top au quotidien.",
      "Pratique et simple d'utilisation, il permet de profiter pleinement des arômes des mélanges bio et artisanaux de la marque.",
    ],
  },
  {
    img:   '/images/Gain/img_02.png',
    title: 'Lot 2 – Thé ou infusion (100 g)',
    lines: [
      "Ce lot offre une boîte de 100 g de thé ou d'infusion sélectionnée parmi les gammes emblématiques de Thé Tip Top.",
      "Il permet de découvrir des recettes naturelles, issues d'un savoir-faire artisanal, alliant plaisir de dégustation et bien-être.",
    ],
  },
  {
    img:   '/images/Gain/img_03.png',
    title: 'Lot 3 – Coffret découverte',
    lines: [
      "Ce lot correspond à un coffret découverte regroupant plusieurs références de thés et d'infusions Thé Tip Top.",
      "Il a été conçu pour proposer une expérience complète de dégustation et mettre en valeur la diversité des créations de la marque.",
    ],
  },
  {
    img:   '/images/Gain/img_05.png',
    title: 'Lot 4 – Coffret découverte (39 €)',
    lines: [
      "Ce lot correspond à un coffret découverte d'une valeur de 39 €, réunissant une sélection raffinée de thés et d'infusions Thé Tip Top.",
      "Il a été imaginé pour offrir un moment de dégustation complet, à travers plusieurs références emblématiques de la marque, aux saveurs bio, artisanales et élégantes.",
    ],
  },
  {
    img:   '/images/Gain/img_06.png',
    title: 'Lot 5 – Coffret premium (69 €)',
    lines: [
      "Ce lot correspond à un coffret découverte premium d'une valeur de 69 €, composé d'un assortiment plus généreux de thés et d'infusions Thé Tip Top.",
      "Pensé comme une expérience de dégustation haut de gamme, il met à l'honneur la richesse, la finesse et le savoir-faire artisanal de la marque à travers une sélection d'exception.",
    ],
  },
]

/* ─── Styles ─────────────────────────────────────────────── */
const STYLES = `

  /* ── Keyframes ── */
  @keyframes particleRise {
    0%   { transform: translateY(0)   rotate(0deg);   opacity: 0; }
    10%  { opacity: 1; }
    90%  { opacity: 1; }
    100% { transform: translateY(-90vh) rotate(360deg); opacity: 0; }
  }
  @keyframes floatBadge {
    0%, 100% { transform: translateX(-50%) translateY(0px); }
    50%       { transform: translateX(-50%) translateY(-7px); }
  }
  @keyframes shimmerBtn {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes pulseRing {
    0%   { box-shadow: 0 0 0 0   rgba(200,100,40,.4); }
    70%  { box-shadow: 0 0 0 14px rgba(200,100,40,0); }
    100% { box-shadow: 0 0 0 0   rgba(200,100,40,0); }
  }
  @keyframes lineGrow {
    from { width: 0; opacity: 0; }
    to   { width: 72px; opacity: 1; }
  }
  @keyframes badgePop {
    0%   { transform: scale(0) rotate(-20deg); opacity: 0; }
    70%  { transform: scale(1.15) rotate(4deg); }
    100% { transform: scale(1) rotate(0deg); opacity: 1; }
  }
  @keyframes avatarShine {
    0%   { box-shadow: 0 0 0 3px transparent; }
    50%  { box-shadow: 0 0 0 5px rgba(106,143,90,.35); }
    100% { box-shadow: 0 0 0 3px transparent; }
  }
  @keyframes borderGlow {
    0%, 100% { border-color: var(--cream-border); }
    50%       { border-color: rgba(106,143,90,.5); }
  }
  @keyframes countUp {
    from { opacity: 0; transform: scale(0.4); }
    to   { opacity: 1; transform: scale(1); }
  }

  /* ── Particules de fond ── */
  .gain-particle {
    position: absolute;
    border-radius: 50%;
    background: var(--orange, #c8723a);
    pointer-events: none;
    animation: particleRise linear infinite;
  }

  /* ── Grille : 3 + 2 parfaitement centrée ── */
  .gain-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 1.75rem;
    align-items: stretch;
    margin-bottom: 3.5rem;
  }
  /* Rangée 1 : lots 1-3 → chacun sur 2 colonnes */
  .gain-grid .prize-card-wrapper:nth-child(-n+3) {
    grid-column: span 2;
  }
  /* Rangée 2 : lots 4-5 → chacun sur 3 colonnes (centré) */
  .gain-grid .prize-card-wrapper:nth-child(n+4) {
    grid-column: span 3;
  }

  /* ── Card wrapper ── */
  .prize-card-wrapper {
    position: relative;
    padding-top: 58px;
    transition: transform .4s cubic-bezier(.22,.68,0,1.2), box-shadow .4s ease;
    will-change: transform;
  }

  /* ── Card inner : hauteur uniforme par rangée garantie ── */
  .prize-card-inner {
    background: white;
    border-radius: 18px;
    padding: 3.2rem 1.75rem 2rem;
    border: 1.5px solid var(--cream-border);
    box-shadow: 0 4px 16px rgba(0,0,0,.06), 0 1px 4px rgba(0,0,0,.04);
    height: 100%;
    box-sizing: border-box;
    transition: box-shadow .4s ease, border-color .4s ease;
    display: flex;
    flex-direction: column;
    /* Animation de bordure subtile en continu */
    animation: borderGlow 5s ease-in-out infinite;
  }
  .prize-card-wrapper:hover .prize-card-inner {
    box-shadow: 0 20px 50px rgba(0,0,0,.12), 0 6px 16px rgba(0,0,0,.07);
    border-color: var(--green-mid, #6a8f5a);
    animation: none;
  }

  /* ── Avatar flottant ── */
  .prize-avatar {
    position: absolute;
    top: 0; left: 50%;
    transform: translateX(-50%);
    width: 108px; height: 108px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid var(--cream-border);
    background: var(--cream);
    z-index: 2;
    box-shadow: 0 4px 14px rgba(0,0,0,.10);
    transition: border-color .3s ease, box-shadow .3s ease;
    animation: avatarShine 4s ease-in-out infinite;
  }
  .prize-card-wrapper:hover .prize-avatar {
    border-color: var(--green-mid, #6a8f5a);
    animation: floatBadge 2.6s ease-in-out infinite;
  }
  .prize-avatar img {
    width: 100%; height: 100%; object-fit: cover;
    transition: transform .5s cubic-bezier(.22,.68,0,1.3);
  }
  .prize-card-wrapper:hover .prize-avatar img { transform: scale(1.1); }

  /* ── Badge numéro ── */
  .prize-number {
    position: absolute;
    top: 0.85rem; right: 0.85rem;
    width: 30px; height: 30px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--green-mid, #6a8f5a), #4a7040);
    color: white;
    font-size: 0.72rem; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    opacity: 0;
    animation: none;
    box-shadow: 0 2px 8px rgba(74,112,64,.4);
  }
  .prize-card-wrapper:hover .prize-number {
    animation: badgePop .4s cubic-bezier(.22,.68,0,1.4) forwards;
  }

  /* ── Titre centré dans la carte ── */
  .prize-card-title {
    text-align: center;
    font-size: 1.05rem;
    font-weight: 700;
    margin-bottom: 1rem;
    line-height: 1.35;
    color: var(--text-dark, #2a2a2a);
    flex-shrink: 0;
  }

  /* ── Texte justifié, hauteur équilibrée ── */
  .prize-card-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 0.65rem;
  }
  .prize-card-body p {
    font-size: 0.875rem;
    color: var(--text-muted);
    line-height: 1.8;
    text-align: justify;
    hyphens: auto;
    margin: 0;
  }

  /* ── Séparateur animé ── */
  .section-underline {
    display: block;
    height: 3px; width: 72px;
    border-radius: 4px;
    background: linear-gradient(90deg, var(--orange, #c8723a), #e89060);
    margin: 0.6rem auto 0;
    animation: lineGrow .7s cubic-bezier(.22,.68,0,1.1) forwards;
  }

  /* ── Bouton CTA ── */
  .btn-shimmer {
    position: relative;
    overflow: hidden;
    transition: transform .25s ease, box-shadow .25s ease;
  }
  .btn-shimmer::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.28), transparent);
    background-size: 200% 100%;
    opacity: 0; transition: opacity .2s;
  }
  .btn-shimmer:hover::after { opacity: 1; animation: shimmerBtn 1s linear infinite; }
  .btn-shimmer:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(200,100,40,.35);
    animation: pulseRing 1.4s ease-out infinite;
  }

  /* ── Décos fond ── */
  .gain-deco-circle {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
  }

  /* ── Layout interne ── */
  .gain-inner {
    position: relative;
    z-index: 1;
    padding: 0 6rem;
    max-width: 1300px;
    margin: 0 auto;
  }

  /* ── Responsive ── */
  @media (max-width: 1100px) {
    .gain-inner { padding: 0 2.5rem; }
    .gain-grid  { grid-template-columns: repeat(2, 1fr); gap: 1.25rem; }
    .gain-grid .prize-card-wrapper:nth-child(-n+3),
    .gain-grid .prize-card-wrapper:nth-child(n+4) { grid-column: span 1; }
  }
  @media (max-width: 640px) {
    .gain-inner { padding: 0 1rem; }
    .gain-grid  { grid-template-columns: 1fr; }
    .gain-grid .prize-card-wrapper:nth-child(-n+3),
    .gain-grid .prize-card-wrapper:nth-child(n+4) { grid-column: span 1; }
    .prize-card-inner { padding: 3rem 1.25rem 1.5rem; }
  }

  /* ── Respect du mouvement réduit ── */
  @media (prefers-reduced-motion: reduce) {
    .gain-particle,
    .prize-card-inner,
    .prize-avatar,
    .btn-shimmer { animation: none !important; }
    .prize-card-wrapper { transition: none !important; }
  }
`

/* ─── Composant carte ─────────────────────────────────────── */
function PrizeCard({ prize, index, delay = 0 }) {
  const [ref, vis] = useReveal()
  const tiltRef = useTilt()

  /* Combine les deux refs */
  const setRef = (el) => {
    ref.current = el
    tiltRef.current = el
  }

  return (
    <div
      ref={setRef}
      className="prize-card-wrapper"
      style={{
        opacity:    vis ? 1 : 0,
        transform:  vis ? 'translateY(0)' : 'translateY(52px)',
        transition: `opacity .65s ease ${delay}s, transform .75s cubic-bezier(.22,.68,0,1.1) ${delay}s`,
      }}
    >
      {/* Avatar flottant */}
      <div className="prize-avatar">
        <img src={prize.img} alt={prize.title} onError={e => { e.target.style.display = 'none' }} />
      </div>

      <div className="prize-card-inner">
        {/* Numéro de lot */}
        <span className="prize-number">{index + 1}</span>

        {/* Titre centré */}
        <h3 className="prize-card-title">{prize.title}</h3>

        {/* Texte justifié + hauteur uniforme via flex */}
        <div className="prize-card-body">
          {prize.lines.map((l, i) => <p key={i}>{l}</p>)}
        </div>
      </div>
    </div>
  )
}

/* ─── Page principale ─────────────────────────────────────── */
export default function GainPage() {
  const [titleRef, titleVis] = useReveal()
  const [btnRef,   btnVis]   = useReveal()

  useEffect(() => {
    const id = '__gain-styles__'
    if (!document.getElementById(id)) {
      const el = document.createElement('style')
      el.id = id
      el.textContent = STYLES
      document.head.appendChild(el)
    }
  }, [])

  return (
    <Layout>
      <PageBanner title="Lot à gagner" />

      <section style={{
        position: 'relative',
        background: 'var(--cream)',
        padding: '4rem 1.5rem 5.5rem',
        overflow: 'hidden',
      }}>

        {/* Particules flottantes */}
        {PARTICLES.map(p => (
          <div
            key={p.id}
            className="gain-particle"
            style={{
              left:            p.left,
              bottom:          '-20px',
              width:           `${p.size}px`,
              height:          `${p.size}px`,
              opacity:         p.opacity,
              animationDuration:  `${p.dur}s`,
              animationDelay:     `${p.delay}s`,
            }}
          />
        ))}

        {/* Cercles décoratifs de fond */}
        <div className="gain-deco-circle" style={{
          width: 480, height: 480, top: -160, right: -120,
          background: 'radial-gradient(circle, rgba(80,120,60,.08) 0%, transparent 70%)',
        }} />
        <div className="gain-deco-circle" style={{
          width: 340, height: 340, bottom: -100, left: -100,
          background: 'radial-gradient(circle, rgba(200,100,40,.07) 0%, transparent 70%)',
        }} />
        <div className="gain-deco-circle" style={{
          width: 200, height: 200, top: '40%', left: '10%',
          background: 'radial-gradient(circle, rgba(106,143,90,.05) 0%, transparent 70%)',
        }} />

        <div className="gain-inner">

          {/* ── Titre de section ── */}
          <div
            ref={titleRef}
            style={{
              opacity:    titleVis ? 1 : 0,
              transform:  titleVis ? 'translateY(0)' : 'translateY(32px)',
              transition: 'opacity .65s ease, transform .65s cubic-bezier(.22,.68,0,1.1)',
              textAlign: 'center',
              marginBottom: '0.5rem',
            }}
          >
            <h2 style={{ margin: 0 }}>Découvrir les gains</h2>
            {titleVis && <span className="section-underline" />}
          </div>

          {/* ── Chapeau centré ── */}
          <p style={{
            opacity:    titleVis ? 1 : 0,
            transition: 'opacity .65s ease .3s',
            textAlign: 'center',
            color: 'var(--text-muted)',
            margin: '1.25rem auto 3.5rem',
            maxWidth: '680px',
            lineHeight: 1.85,
            fontSize: '0.92rem',
          }}>
            Découvrez les lots et coffrets de thés mis en jeu&nbsp;: une sélection de cadeaux
            bio et artisanaux, pensés pour prolonger l'expérience Thé Tip Top.
            Les modalités d'attribution et de remise des gains (boutique ou en ligne)
            sont précisées dans le règlement.
          </p>

          {/* ── Grille 3 + 2 ── */}
          <div className="gain-grid">
            {PRIZES.map((p, i) => (
              <PrizeCard
                key={i}
                prize={p}
                index={i}
                delay={i * 0.13}
              />
            ))}
          </div>

          {/* ── Bouton CTA ── */}
          <div
            ref={btnRef}
            style={{
              textAlign: 'center',
              opacity:    btnVis ? 1 : 0,
              transform:  btnVis ? 'translateY(0)' : 'translateY(24px)',
              transition: 'opacity .55s ease .1s, transform .55s cubic-bezier(.22,.68,0,1.1) .1s',
            }}
          >
            <Link
              to="/register"
              className="btn btn-orange btn-shimmer"
              style={{ fontSize: '0.95rem', padding: '0.9rem 2.75rem' }}
            >
              Participer au Jeu-Concours
            </Link>
          </div>

        </div>
      </section>
    </Layout>
  )
}