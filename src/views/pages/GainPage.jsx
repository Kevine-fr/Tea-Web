import { Link } from 'react-router-dom'
import Layout from '../components/Layout.jsx'

const PRIZES = [
  {
    emoji: '🫖',
    name: 'Infuseur à thé',
    probability: '60 %',
    description: 'Un infuseur en inox de qualité supérieure pour préparer vos thés à la perfection.',
    value: '~15€',
    color: '#52b788',
  },
  {
    emoji: '🍃',
    name: 'Boîte de thé 100g',
    probability: '20 %',
    description: 'Une boîte de 100g d\'un de nos thés signatures, au choix parmi notre collection.',
    value: '~20€',
    color: '#d4b44a',
  },
  {
    emoji: '🎀',
    name: 'Coffret découverte',
    probability: '15 %',
    description: 'Un coffret de 5 variétés de thés pour explorer notre gamme premium.',
    value: '~45€',
    color: '#e9c46a',
  },
  {
    emoji: '💰',
    name: 'Remise de 50%',
    probability: '4 %',
    description: 'Une remise de 50% sur votre prochain achat en boutique ou en ligne.',
    value: 'Valeur variable',
    color: '#2d6a4f',
  },
  {
    emoji: '👑',
    name: 'Thé à volonté 1 an',
    probability: '1 %',
    description: 'Un an de thé offert — recevez chaque mois une sélection de nos meilleurs crus.',
    value: '~360€',
    color: '#b8962e',
  },
]

export default function GainPage() {
  const totalProb = PRIZES.reduce((s, p) => s + parseFloat(p.probability), 0)

  return (
    <Layout>
      <div className="page-hero">
        <div className="container">
          <h1>Les Lots à Gagner</h1>
          <p>100% des participants remportent un lot — à vous de jouer !</p>
        </div>
      </div>

      {/* Intro */}
      <section className="section-sm" style={{ background: 'var(--cream)' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: 600 }}>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.75, color: 'var(--text-muted)' }}>
            Chaque ticket Thé Tip Top est un ticket gagnant. Les lots ont été pensés 
            pour vous faire découvrir ou redécouvrir l'univers de nos thés d'exception.
          </p>
        </div>
      </section>

      {/* Grille des lots */}
      <section className="section" style={{ background: 'var(--cream-dark)', paddingTop: '1rem' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}>
            {PRIZES.map(({ emoji, name, probability, description, value, color }) => (
              <div key={name} className="card" style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}>
                {/* Accent couleur */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0,
                  height: 4,
                  background: color,
                  borderRadius: 'var(--radius) var(--radius) 0 0',
                }} />

                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '2.5rem' }}>{emoji}</div>
                  <span style={{
                    background: `${color}20`,
                    color: color,
                    borderRadius: '20px',
                    padding: '0.2rem 0.7rem',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                  }}>
                    {probability}
                  </span>
                </div>

                <h3 style={{ marginBottom: '0.6rem', fontSize: '1.15rem' }}>{name}</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: '1rem' }}>
                  {description}
                </p>
                <div style={{
                  borderTop: '1px solid var(--cream-border)',
                  paddingTop: '0.75rem',
                  fontSize: '0.82rem',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}>
                  <span>Valeur estimée</span>
                  <strong style={{ color: 'var(--green-dark)' }}>{value}</strong>
                </div>
              </div>
            ))}
          </div>

          {/* Infos probabilités */}
          <div className="card" style={{ marginTop: '2.5rem', padding: '1.5rem 2rem' }}>
            <h4 style={{ marginBottom: '1.25rem' }}>Répartition des lots</h4>
            {PRIZES.map(({ name, probability, color }) => {
              const pct = parseFloat(probability)
              return (
                <div key={name} style={{ marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                    <span>{name}</span>
                    <strong>{probability}</strong>
                  </div>
                  <div style={{ background: 'var(--cream-dark)', borderRadius: 4, height: 8, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${pct}%`,
                      background: color,
                      borderRadius: 4,
                      transition: 'width 1s ease',
                    }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--green-dark)', padding: '4rem 0', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ color: 'white', marginBottom: '0.75rem' }}>Lequel allez-vous gagner ?</h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', marginBottom: '2rem' }}>
            Il n'y a qu'une façon de le savoir — entrez votre code !
          </p>
          <Link to="/register" className="btn btn-gold" style={{ fontSize: '1rem', padding: '0.85rem 2.5rem' }}>
            Tenter ma chance →
          </Link>
        </div>
      </section>
    </Layout>
  )
}
