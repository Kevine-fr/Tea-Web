import { useState } from 'react'
import Layout from '../components/Layout.jsx'
import PageBanner from '../components/PageBanner.jsx'
import AnimatedLeaves from '../components/AnimatedLeaves.jsx'

const ARTICLES = [
  { title: 'Article 1 — Objet du jeu-concours', body: "Le jeu-concours Thé Tip Top est organisé à l'occasion de l'ouverture de la 10ème boutique à Nice. Il est ouvert à toute personne physique majeure résidant en France métropolitaine, à l'exclusion des employés et de leurs proches." },
  { title: 'Article 2 — Modalités de participation', body: "Pour participer, le joueur doit effectuer un achat supérieur à 49 € dans une boutique Thé Tip Top participante, créer un compte sur le site officiel et saisir le code unique figurant sur son ticket de caisse." },
  { title: 'Article 3 — Déroulement du jeu-concours', body: "Le jeu se déroule du 1er janvier 2026 au 31 décembre 2026. 100 % des codes sont gagnants et donnent droit à un lot parmi la sélection définie. Les gains doivent être réclamés dans les 60 jours suivant la participation." },
  { title: 'Article 4 — Données personnelles : collecte et utilisation', body: "Les données collectées lors de l'inscription sont utilisées uniquement pour la gestion du jeu-concours et l'attribution des gains. Elles ne sont ni vendues ni cédées à des tiers, conformément au RGPD." },
  { title: 'Article 5 — Propriété intellectuelle', body: "L'ensemble des éléments du site (visuels, textes, logo, interface) sont la propriété exclusive de Thé Tip Top et sont protégés par le droit d'auteur. Toute reproduction sans autorisation est interdite." },
  { title: 'Article 6 — Limitation de responsabilité', body: "Thé Tip Top ne saurait être tenu responsable des dysfonctionnements techniques empêchant la participation, ni des erreurs de saisie du participant." },
  { title: 'Article 7 — Mise à jour des conditions', body: "Thé Tip Top se réserve le droit de modifier les présentes CGU à tout moment. Les participants seront informés de toute modification substantielle par e-mail ou via le site." },
]

export default function CguPage() {
  const [open, setOpen] = useState(null)
  return (
    <Layout>
      <PageBanner title="Conditions générales d'utilisation" />
      <section style={{ position: 'relative', background: 'var(--cream)', padding: '3rem 1.5rem 4rem', overflow: 'hidden' }}>
        <AnimatedLeaves />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 820, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '0.75rem' }}>Règles d'utilisation du site Thé Tip Top</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.8, fontSize: '0.92rem' }}>
            Ces conditions expliquent les règles d'accès et d'utilisation du site Thé Tip Top (compte, participation, contenus) et les bonnes pratiques à respecter.
          </p>
          {ARTICLES.map((a, i) => (
            <div key={i} className="acc-item">
              <div className="acc-head" onClick={() => setOpen(open === i ? null : i)}>
                <span>{a.title}</span>
                <span style={{ fontSize: '1.3rem', fontWeight: 300, color: 'var(--text-muted)', lineHeight: 1 }}>{open === i ? '−' : '+'}</span>
              </div>
              {open === i && <div className="acc-body">{a.body}</div>}
            </div>
          ))}
        </div>
      </section>
    </Layout>
  )
}
