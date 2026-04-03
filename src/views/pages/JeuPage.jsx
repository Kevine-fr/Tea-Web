import { Link } from 'react-router-dom'
import Layout from '../components/Layout.jsx'

const RULES = [
  'Jeu ouvert à toute personne physique majeure résidant en France métropolitaine.',
  'Durée du jeu : du 1er janvier 2026 au 31 décembre 2026.',
  'Chaque code peut être utilisé une seule fois.',
  'Un participant peut jouer plusieurs fois avec des codes différents.',
  'Les lots doivent être réclamés dans un délai de 60 jours après la participation.',
  'Thé Tip Top se réserve le droit de modifier les modalités du jeu à tout moment.',
]

const STEPS = [
  {
    num: '01', icon: '🛍️',
    title: 'Achetez en boutique',
    desc: 'Réalisez un achat dans l\'une de nos 5 boutiques Thé Tip Top. Le ticket de caisse constitue votre bon de participation.',
  },
  {
    num: '02', icon: '🔍',
    title: 'Trouvez votre code',
    desc: 'Votre code de participation unique à 8 caractères est imprimé en bas de votre ticket de caisse.',
  },
  {
    num: '03', icon: '💻',
    title: 'Saisissez en ligne',
    desc: 'Créez votre compte sur notre site, rendez-vous dans votre espace et entrez votre code pour découvrir votre lot.',
  },
  {
    num: '04', icon: '🎁',
    title: 'Réclamez votre lot',
    desc: 'Récupérez votre gain en boutique, par courrier ou directement en ligne selon votre préférence.',
  },
]

export default function JeuPage() {
  return (
    <Layout>
      <div className="page-hero">
        <div className="container">
          <h1>Le Jeu-Concours Thé Tip Top</h1>
          <p>Tout savoir sur notre grand jeu promotionnel 2026</p>
        </div>
      </div>

      {/* Présentation */}
      <section className="section" style={{ background: 'var(--cream)' }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <div className="section-title">
            <span />
            <h2>À propos du jeu</h2>
          </div>
          <div className="card" style={{ padding: '2.5rem', lineHeight: 1.8 }}>
            <p style={{ marginBottom: '1rem' }}>
              Pour fêter ses <strong>10 ans</strong>, Thé Tip Top organise un grand jeu-concours inédit. 
              Notre objectif : offrir à <strong>100% de nos participants</strong> la chance de remporter 
              l'un de nos lots parmi une sélection exceptionnelle de produits.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              Nous avons commandé <strong>50 000 tickets</strong> répartis dans nos 5 boutiques à travers 
              la France. Chaque ticket contient un code unique vous donnant accès à notre plateforme 
              de participation en ligne.
            </p>
            <p>
              Infuseurs, coffrets découverte, thés premium ou remises exceptionnelles — 
              les lots ont été sélectionnés pour célébrer l'art du thé et notre philosophie 
              d'une consommation responsable et gourmande.
            </p>
          </div>
        </div>
      </section>

      {/* Étapes */}
      <section className="section" style={{ background: 'var(--cream-dark)' }}>
        <div className="container">
          <div className="section-title">
            <span />
            <h2>Comment participer</h2>
            <p>4 étapes simples pour tenter votre chance</p>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem',
          }}>
            {STEPS.map(({ num, icon, title, desc }) => (
              <div key={num} style={{
                background: 'white',
                borderRadius: 'var(--radius)',
                padding: '2rem',
                position: 'relative',
                boxShadow: 'var(--shadow-sm)',
              }}>
                <div style={{
                  position: 'absolute', top: '1.25rem', right: '1.25rem',
                  fontFamily: 'var(--font-serif)', fontSize: '2.5rem',
                  fontWeight: 700, color: 'var(--cream-dark)',
                }}>
                  {num}
                </div>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{icon}</div>
                <h4 style={{ marginBottom: '0.5rem' }}>{title}</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Règlement */}
      <section className="section" style={{ background: 'var(--cream)' }}>
        <div className="container" style={{ maxWidth: 700 }}>
          <div className="section-title">
            <span />
            <h2>Règlement du jeu</h2>
          </div>
          <div className="card" style={{ padding: '2rem' }}>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {RULES.map((rule, i) => (
                <li key={i} style={{
                  display: 'flex',
                  gap: '0.75rem',
                  padding: '0.85rem 0',
                  borderBottom: i < RULES.length - 1 ? '1px solid var(--cream-border)' : 'none',
                  fontSize: '0.9rem',
                  color: 'var(--text-dark)',
                  lineHeight: 1.6,
                }}>
                  <span style={{ color: 'var(--green-mid)', fontWeight: 700, flexShrink: 0 }}>✓</span>
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--green-dark)', padding: '4rem 0', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ color: 'white', marginBottom: '0.75rem' }}>Prêt à jouer ?</h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', marginBottom: '2rem' }}>
            Créez votre compte et entrez votre premier code ticket.
          </p>
          <Link to="/register" className="btn btn-gold" style={{ fontSize: '1rem', padding: '0.85rem 2.5rem' }}>
            Participer maintenant →
          </Link>
        </div>
      </section>
    </Layout>
  )
}
