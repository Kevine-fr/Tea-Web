import { Link } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import AnimatedLeaves from '../components/AnimatedLeaves.jsx'

export default function NotFoundPage() {
  return (
    <Layout>
      <div style={{
        position: 'relative',
        background: 'var(--cream)',
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        overflow: 'hidden',
      }}>
        <AnimatedLeaves />
        <div className="card fade-up" style={{
          padding: 'clamp(1.5rem, 5vw, 3.5rem) clamp(1.25rem, 5vw, 3rem)',
          maxWidth: 620,
          width: '100%',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
          borderRadius: 20,
        }}>
          <p style={{
            fontWeight: 700,
            fontSize: '0.9rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: '0.6rem',
          }}>
            Oups... 404
          </p>
          <h2 style={{ marginBottom: '1.75rem', lineHeight: 1.35, fontSize: 'clamp(1.2rem, 3vw, 1.8rem)' }}>
            Cette page s'est évaporée comme une infusion trop chaude
          </h2>
          <img
            src="/images/404/img_01.png"
            alt="404 tea"
            style={{ width: 'clamp(100px, 30vw, 170px)', margin: '0 auto 1.5rem', objectFit: 'contain' }}
            onError={e => { e.target.style.display = 'none' }}
          />
          <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '0.92rem' }}>
            On te ramène à la bonne tasse..
          </p>
          <Link to="/" className="btn btn-orange" style={{ padding: '0.85rem 2.5rem', fontSize: '0.95rem' }}>
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </Layout>
  )
}
