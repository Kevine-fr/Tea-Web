import { Link } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import TeaLogo from '../components/TeaLogo.jsx'

const STEPS = [
  { num: '01', icon: '🛍️', title: 'Achetez',      desc: 'Effectuez un achat dans l\'une de nos 5 boutiques Thé Tip Top partout en France.' },
  { num: '02', icon: '🎫', title: 'Récupérez',    desc: 'Obtenez votre code unique à 8 caractères inscrit sur votre ticket de caisse.' },
  { num: '03', icon: '✨', title: 'Participez',   desc: 'Saisissez votre code sur notre site et découvrez immédiatement si vous avez gagné.' },
  { num: '04', icon: '🎁', title: 'Réclamez',     desc: 'Réclamez votre lot en boutique, par courrier ou directement en ligne.' },
]

const PRIZES_PREVIEW = [
  { emoji: '🫖', name: 'Infuseur à thé',      prob: '60%', color: '#52b788' },
  { emoji: '🍃', name: 'Boîte de 100g',       prob: '20%', color: '#d4b44a' },
  { emoji: '🎀', name: 'Coffret découverte',  prob: '15%', color: '#e9c46a' },
  { emoji: '💰', name: 'Remise 50%',          prob: '4%',  color: '#2d6a4f' },
  { emoji: '👑', name: 'An de thé offert',    prob: '1%',  color: '#b8962e' },
]

export default function HomePage() {
  return (
    <Layout>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, var(--green-dark) 0%, #2d5a3d 100%)',
        color: 'white',
        padding: '6rem 0 5rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Cercles décoratifs */}
        <div style={{
          position: 'absolute', top: '-100px', right: '-100px',
          width: 400, height: 400,
          borderRadius: '50%',
          background: 'rgba(212,180,74,.1)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-80px', left: '-80px',
          width: 300, height: 300,
          borderRadius: '50%',
          background: 'rgba(82,183,136,.1)',
          pointerEvents: 'none',
        }} />

        <div className="container fade-in-up" style={{ textAlign: 'center', position: 'relative' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <TeaLogo size={80} />
          </div>
          <div style={{
            display: 'inline-block',
            background: 'rgba(212,180,74,.2)',
            border: '1px solid rgba(212,180,74,.4)',
            color: 'var(--gold)',
            borderRadius: '20px',
            padding: '0.3rem 1rem',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: '1.5rem',
          }}>
            Jeu-Concours 2026
          </div>
          <h1 style={{ color: 'white', marginBottom: '1.25rem', maxWidth: 700, margin: '0 auto 1.25rem' }}>
            Gagnez avec <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Thé Tip Top</em>
          </h1>
          <p className="delay-1 fade-in-up" style={{
            fontSize: '1.15rem',
            color: 'rgba(255,255,255,0.78)',
            maxWidth: 560,
            margin: '0 auto 2.5rem',
            lineHeight: 1.7,
          }}>
            Participez à notre grand jeu-concours et tentez de remporter de magnifiques lots parmi notre collection de thés d'exception.
          </p>
          <div className="delay-2 fade-in-up" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-gold" style={{ fontSize: '1rem', padding: '0.85rem 2rem' }}>
              🎫 Participer maintenant
            </Link>
            <Link to="/jeu" className="btn btn-outline-white" style={{ fontSize: '1rem', padding: '0.85rem 2rem' }}>
              En savoir plus
            </Link>
          </div>

          {/* Stats */}
          <div className="delay-3 fade-in-up" style={{
            display: 'flex',
            gap: '2.5rem',
            justifyContent: 'center',
            marginTop: '3.5rem',
            flexWrap: 'wrap',
          }}>
            {[
              { val: '100%', label: 'Gagnant(s) assuré(s)' },
              { val: '5',    label: 'Boutiques partenaires' },
              { val: '50K',  label: 'Tickets en jeu' },
            ].map(({ val, label }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 700, color: 'var(--gold)' }}>{val}</div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comment participer ──────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--cream)' }}>
        <div className="container">
          <div className="section-title">
            <span />
            <h2>Comment participer ?</h2>
            <p>4 étapes simples pour tenter votre chance</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem',
          }}>
            {STEPS.map(({ num, icon, title, desc }) => (
              <div key={num} className="card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: 'rgba(45,106,79,.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  margin: '0 auto 1rem',
                }}>
                  {icon}
                </div>
                <div style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '0.75rem',
                  color: 'var(--gold)',
                  letterSpacing: '0.15em',
                  marginBottom: '0.25rem',
                }}>
                  ÉTAPE {num}
                </div>
                <h4 style={{ marginBottom: '0.5rem', color: 'var(--green-dark)' }}>{title}</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Aperçu des lots ─────────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--green-dark)' }}>
        <div className="container">
          <div className="section-title">
            <span style={{ background: 'var(--gold)' }} />
            <h2 style={{ color: 'white' }}>Vos lots à gagner</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>Chaque ticket est forcément gagnant</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '1rem',
            marginBottom: '2.5rem',
          }}>
            {PRIZES_PREVIEW.map(({ emoji, name, prob, color }) => (
              <div key={name} style={{
                background: 'rgba(255,255,255,.05)',
                border: '1px solid rgba(255,255,255,.1)',
                borderRadius: 'var(--radius)',
                padding: '1.5rem 1rem',
                textAlign: 'center',
                transition: 'var(--transition)',
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.6rem' }}>{emoji}</div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'white', marginBottom: '0.25rem' }}>{name}</div>
                <div style={{
                  display: 'inline-block',
                  background: `${color}30`,
                  color: color,
                  borderRadius: '12px',
                  padding: '0.15rem 0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}>
                  {prob}
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to="/gains" className="btn btn-gold">
              Voir tous les lots →
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA final ───────────────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--cream-dark)', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: 600 }}>
          <TeaLogo size={60} />
          <h2 style={{ marginTop: '1rem', marginBottom: '0.75rem' }}>Prêt à tenter votre chance ?</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Créez votre compte gratuitement et commencez à jouer dès aujourd'hui.
          </p>
          <Link to="/register" className="btn btn-primary" style={{ fontSize: '1rem', padding: '0.85rem 2.5rem' }}>
            Créer mon compte
          </Link>
        </div>
      </section>
    </Layout>
  )
}
