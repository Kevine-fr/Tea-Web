// src/views/pages/CguPage.jsx

import { useEffect, useRef, useState } from 'react'
import Layout from '../components/Layout.jsx'
import PageBanner from '../components/PageBanner.jsx'
import CountdownBanner from '../components/CountdownBanner.jsx'

const CSS = `
@keyframes accIn  { from { opacity:0; transform: translateY(18px) } to { opacity:1; transform: none } }
@keyframes accOpen { from { opacity:0; max-height:0 } to { opacity:1; max-height: 300px } }
`

function useReveal() {
  const [vis, setVis] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect() } },
      { threshold: 0.05 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return [ref, vis]
}

const ARTICLES = [
  { title: 'Article 1 — Objet du jeu-concours', body: "Le jeu-concours Thé Tip Top est organisé à l'occasion de l'ouverture de la 10ème boutique à Nice. Il est ouvert à toute personne physique majeure résidant en France métropolitaine, à l'exclusion des employés et de leurs proches." },
  { title: 'Article 2 — Modalités de participation', body: "Pour participer, le joueur doit effectuer un achat supérieur à 49 € dans une boutique Thé Tip Top participante, créer un compte sur le site officiel et saisir le code unique figurant sur son ticket de caisse." },
  { title: 'Article 3 — Déroulement du jeu-concours', body: "Le jeu se déroule du 1er janvier 2026 au 31 décembre 2026. 100 % des codes sont gagnants et donnent droit à un lot parmi la sélection définie. Les gains doivent être réclamés dans les 60 jours suivant la participation." },
  { title: 'Article 4 — Données personnelles : collecte et utilisation', body: "Les données collectées lors de l'inscription sont utilisées uniquement pour la gestion du jeu-concours et l'attribution des gains. Elles ne sont ni vendues ni cédées à des tiers, conformément au RGPD." },
  { title: 'Article 5 — Propriété intellectuelle', body: "L'ensemble des éléments du site (visuels, textes, logo, interface) sont la propriété exclusive de Thé Tip Top et sont protégés par le droit d'auteur. Toute reproduction sans autorisation est interdite." },
  { title: 'Article 6 — Limitation de responsabilité', body: "Thé Tip Top ne saurait être tenu responsable des dysfonctionnements techniques empêchant la participation, ni des erreurs de saisie du participant." },
  { title: 'Article 7 — Mise à jour des conditions', body: "Thé Tip Top se réserve le droit de modifier les présentes CGU à tout moment. Les participants seront informés de toute modification substantielle par e-mail ou via le site." },
]

function AccItem({ title, body, delay }) {
  const [open, setOpen] = useState(false)
  const [ref, vis] = useReveal()
  return (
    <div ref={ref} className="acc-item" style={{
      opacity: vis ? 1 : 0,
      transform: vis ? 'translateY(0)' : 'translateY(18px)',
      transition: `opacity .45s ease ${delay}s, transform .45s ease ${delay}s`,
    }}>
      <div className="acc-head" onClick={() => setOpen(!open)}>
        <span>{title}</span>
        <span style={{
          fontSize: '1.3rem', fontWeight: 300, color: 'var(--text-muted)', lineHeight: 1,
          transition: 'transform .25s ease',
          display: 'inline-block',
          transform: open ? 'rotate(45deg)' : 'none',
        }}>+</span>
      </div>
      {open && (
        <div className="acc-body" style={{ animation: 'accOpen .3s ease both' }}>
          {body}
        </div>
      )}
    </div>
  )
}

export default function CguPage() {
  const titleRef = useRef(null)
  const descRef  = useRef(null)
  useEffect(() => {
    if (titleRef.current) titleRef.current.style.animation = 'accIn .55s ease .1s both'
    if (descRef.current)  descRef.current.style.animation  = 'accIn .55s ease .25s both'
  }, [])

  return (
    <Layout>
      <style>{CSS}</style>
      <PageBanner title="CGU" />
              <CountdownBanner />
      <section style={{ position: 'relative', background: 'var(--cream)', padding: '3rem 1.5rem 4rem', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 820, margin: '0 auto' }}>
          <h2 ref={titleRef} style={{ textAlign: 'center', marginBottom: '0.75rem', opacity: 0 }}>
            Règles d'utilisation du site Thé Tip Top
          </h2>
          <p ref={descRef} style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.8, fontSize: '0.92rem', opacity: 0 }}>
            Ces conditions expliquent les règles d'accès et d'utilisation du site Thé Tip Top (compte, participation, contenus) et les bonnes pratiques à respecter.
          </p>
          {ARTICLES.map((a, i) => (
            <AccItem key={i} title={a.title} body={a.body} delay={Math.min(i * 0.07, 0.5)} />
          ))}
        </div>
      </section>
    </Layout>
  )
}