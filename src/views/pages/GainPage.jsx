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

/* ─── Données statiques des 3 lots ───────────────────────── */
const PRIZES = [
  {
    img:   '/images/Gain/img_01.png',
    title: 'Lot 1 - Infuseur à thé',
    lines: [
      "Ce lot comprend un infuseur à thé réutilisable, pensé pour accompagner la dégustation des thés et infusions Thé Tip Top au quotidien.",
      "Pratique et simple d'utilisation, il permet de profiter pleinement des arômes des mélanges bio et artisanaux de la marque.",
    ],
  },
  {
    img:   '/images/Gain/img_02.png',
    title: 'Lot 2 - Thé ou infusion (100 g)',
    lines: [
      "Ce lot offre une boîte de 100 g de thé ou d'infusion sélectionnée parmi les gammes emblématiques de Thé Tip Top.",
      "Il permet de découvrir des recettes naturelles, issues d'un savoir-faire artisanal, alliant plaisir de dégustation et bien-être.",
    ],
  },
  {
    img:   '/images/Gain/img_03.png',
    title: 'Lot 3 - Coffret découverte',
    lines: [
      "Ce lot correspond à un coffret découverte regroupant plusieurs références de thés et d'infusions Thé Tip Top.",
      "Il a été conçu pour proposer une expérience complète de dégustation et mettre en valeur la diversité des créations de la marque.",
    ],
  },
]

/* ─── Styles d'animation ─────────────────────────────────── */
const STYLES = `
  @keyframes floatBadge {
    0%, 100% { transform: translateX(-50%) translateY(0px); }
    50%       { transform: translateX(-50%) translateY(-6px); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes pulse-ring {
    0%   { box-shadow: 0 0 0 0   rgba(200,100,40,.35); }
    70%  { box-shadow: 0 0 0 12px rgba(200,100,40,0); }
    100% { box-shadow: 0 0 0 0   rgba(200,100,40,0); }
  }
  @keyframes lineGrow {
    from { width: 0; }
    to   { width: 56px; }
  }

  .prize-card-wrapper {
    position: relative;
    padding-top: 55px;
    transition: transform .35s cubic-bezier(.22,.68,0,1.2);
  }
  .prize-card-wrapper:hover { transform: translateY(-8px); }

  .prize-card-inner {
    background: white;
    border-radius: 16px;
    padding: 3rem 1.5rem 1.75rem;
    border: 1px solid var(--cream-border);
    box-shadow: var(--shadow-sm);
    height: 100%;
    transition: box-shadow .35s ease, border-color .35s ease;
    position: relative;
    overflow: hidden;
  }
  .prize-card-wrapper:hover .prize-card-inner {
    box-shadow: 0 16px 40px rgba(0,0,0,.10), 0 4px 12px rgba(0,0,0,.06);
    border-color: var(--green-mid, #6a8f5a);
  }

  .prize-avatar {
    position: absolute;
    top: 0; left: 50%;
    transform: translateX(-50%);
    width: 100px; height: 100px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid var(--cream-border);
    background: var(--cream);
    z-index: 2;
    box-shadow: var(--shadow-sm);
    transition: transform .35s cubic-bezier(.22,.68,0,1.4), border-color .3s ease;
  }
  .prize-card-wrapper:hover .prize-avatar {
    transform: translateX(-50%) scale(1.1);
    border-color: var(--green-mid, #6a8f5a);
    animation: floatBadge 2.8s ease-in-out infinite;
  }
  .prize-avatar img {
    width: 100%; height: 100%; object-fit: cover;
    transition: transform .4s ease;
  }
  .prize-card-wrapper:hover .prize-avatar img { transform: scale(1.08); }

  .prize-number {
    position: absolute;
    top: 1rem; right: 1rem;
    width: 28px; height: 28px;
    border-radius: 50%;
    background: var(--green-mid, #6a8f5a);
    color: white;
    font-size: 0.72rem; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    opacity: 0; transform: scale(0.6);
    transition: opacity .3s ease, transform .4s cubic-bezier(.22,.68,0,1.4);
  }
  .prize-card-wrapper:hover .prize-number { opacity: 1; transform: scale(1); }

  .btn-shimmer { position: relative; overflow: hidden; }
  .btn-shimmer::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.25), transparent);
    background-size: 200% 100%;
    opacity: 0; transition: opacity .2s;
  }
  .btn-shimmer:hover::after { opacity: 1; animation: shimmer 1s linear infinite; }
  .btn-shimmer:hover { animation: pulse-ring 1.4s ease-out infinite; }

  .gain-deco-circle { position: absolute; border-radius: 50%; pointer-events: none; }
  .section-underline {
    display: block; height: 3px; width: 56px;
    border-radius: 4px; background: var(--orange, #c8723a);
    margin: 0.6rem auto 0;
    animation: lineGrow .6s ease forwards;
  }
`

function PrizeCard({ prize, index, delay = 0 }) {
  const [ref, vis] = useReveal()
  return (
    <div
      ref={ref}
      className="prize-card-wrapper"
      style={{
        opacity:    vis ? 1 : 0,
        transform:  vis ? 'translateY(0)' : 'translateY(48px)',
        transition: `opacity .6s ease ${delay}s, transform .7s cubic-bezier(.22,.68,0,1.1) ${delay}s`,
      }}
    >
      <div className="prize-avatar">
        <img src={prize.img} alt={prize.title} onError={e => { e.target.style.display = 'none' }} />
      </div>

      <div className="prize-card-inner">
        <span className="prize-number">{index + 1}</span>
        <h3 style={{ textAlign: 'center', fontSize: '1.05rem', marginBottom: '0.9rem', lineHeight: 1.35 }}>
          {prize.title}
        </h3>
        {prize.lines.map((l, i) => (
          <p key={i} style={{
            fontSize: '0.86rem', color: 'var(--text-muted)',
            lineHeight: 1.75, textAlign: 'justify',
            marginBottom: i < prize.lines.length - 1 ? '0.75rem' : 0,
          }}>{l}</p>
        ))}
      </div>
    </div>
  )
}

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

      <section style={{ position: 'relative', background: 'var(--cream)', padding: '3.5rem 1.5rem 5rem', overflow: 'hidden' }}>

        {/* Décorations fond */}
        <div className="gain-deco-circle" style={{
          width: 420, height: 420, top: -140, right: -100,
          background: 'radial-gradient(circle, rgba(80,120,60,.07) 0%, transparent 70%)',
        }} />
        <div className="gain-deco-circle" style={{
          width: 300, height: 300, bottom: -80, left: -80,
          background: 'radial-gradient(circle, rgba(200,100,40,.06) 0%, transparent 70%)',
        }} />

        <div style={{ position: 'relative', zIndex: 1, padding: "0 8rem"}}>

          {/* Titre */}
          <div ref={titleRef} style={{
            opacity:    titleVis ? 1 : 0,
            transform:  titleVis ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity .6s ease, transform .6s ease',
            textAlign: 'center', marginBottom: '0.5rem',
          }}>
            <h2>Découvrir les gains</h2>
            {titleVis && <span className="section-underline" />}
          </div>

          <div style={{
            opacity:    titleVis ? 1 : 0,
            transition: 'opacity .6s ease .25s',
            textAlign: 'center', color: 'var(--text-muted)',
            margin: '1rem 0 3.5rem',
            lineHeight: 1.8, fontSize: '0.92rem',
          }}>
            Découvrez les lots et coffrets de thés mis en jeu : une sélection de cadeaux bio et artisanaux,
            pensés pour prolonger l'expérience Thé Tip Top. Les modalités d'attribution et de remise des gains
            (boutique ou en ligne) sont précisées dans le règlement.
          </div>

          {/* Grille 3 lots */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            alignItems: 'start',
            marginBottom: '3rem',
          }}>
            {PRIZES.map((p, i) => (
              <PrizeCard key={i} prize={p} index={i} delay={i * 0.15} />
            ))}
          </div>

          {/* CTA */}
          <div ref={btnRef} style={{
            textAlign: 'center',
            opacity:    btnVis ? 1 : 0,
            transform:  btnVis ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity .5s ease .1s, transform .5s ease .1s',
          }}>
            <Link to="/register" className="btn btn-orange btn-shimmer"
              style={{ fontSize: '0.95rem', padding: '0.85rem 2.5rem' }}>
              Participer au Jeu-Concours
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}