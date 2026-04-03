import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import PageBanner from '../components/PageBanner.jsx'
import AnimatedLeaves from '../components/AnimatedLeaves.jsx'
import client from '../../api/client.js'

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
const STATIC = [
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

function PrizeCard({ prize, delay = 0 }) {
  const [ref, vis] = useReveal()
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? 'translateY(0)' : 'translateY(40px)',
      transition: `opacity .6s ease ${delay}s, transform .6s ease ${delay}s`,
      position: 'relative',
      paddingTop: 55,
    }}>
      {/* Image circulaire qui dépasse en haut */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 100, height: 100,
        borderRadius: '50%',
        overflow: 'hidden',
        border: '3px solid var(--cream-border)',
        background: 'var(--cream)',
        zIndex: 2,
        boxShadow: 'var(--shadow-sm)',
      }}>
        <img
          src={prize.img}
          alt={prize.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={e => { e.target.style.display = 'none' }}
        />
      </div>

      {/* Carte */}
      <div style={{
        background: 'white',
        borderRadius: 16,
        padding: '3rem 1.5rem 1.75rem',
        border: '1px solid var(--cream-border)',
        boxShadow: 'var(--shadow-sm)',
        height: '100%',
      }}>
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
  const [prizes, setPrizes] = useState(STATIC)
  const [titleRef, titleVis] = useReveal()
  const [btnRef, btnVis]     = useReveal()

  useEffect(() => {
    client.get('prizes').then(r => {
      const api = r.data?.data ?? r.data ?? []
      if (Array.isArray(api) && api.length > 0) {
        // Limiter à 3 lots max, utiliser les images statiques
        const mapped = api.slice(0, 3).map((p, i) => ({
          img:   STATIC[i]?.img || '/images/Gain/img_01.png',
          title: p.name,
          lines: [p.description || STATIC[i]?.lines[0] || ''],
        }))
        setPrizes(mapped)
      }
    }).catch(() => {})
  }, [])

  return (
    <Layout>
      <PageBanner title="Lot à gagner" />

      <section style={{ position: 'relative', background: 'var(--cream)', padding: '3.5rem 1.5rem 5rem', overflow: 'hidden' }}>
        <AnimatedLeaves />

        <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: 1060 }}>

          {/* Titre */}
          <div ref={titleRef} style={{
            opacity: titleVis ? 1 : 0,
            transform: titleVis ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity .6s ease, transform .6s ease',
            textAlign: 'center', marginBottom: '0.75rem',
          }}>
            <h2>Découvrir les gains</h2>
          </div>
          <div style={{
            opacity: titleVis ? 1 : 0,
            transition: 'opacity .6s ease .15s',
            textAlign: 'center', color: 'var(--text-muted)',
            maxWidth: 820, margin: '0 auto 3.5rem',
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
            {prizes.map((p, i) => (
              <PrizeCard key={i} prize={p} delay={i * 0.15} />
            ))}
          </div>

          {/* CTA */}
          <div ref={btnRef} style={{
            textAlign: 'center',
            opacity: btnVis ? 1 : 0,
            transform: btnVis ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity .5s ease, transform .5s ease',
          }}>
            <Link to="/register" className="btn btn-orange" style={{ fontSize: '0.95rem', padding: '0.85rem 2.5rem' }}>
              Participer au Jeu-Concours
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}
