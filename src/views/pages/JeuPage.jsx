import { Link } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import PageBanner from '../components/PageBanner.jsx'
import AnimatedLeaves from '../components/AnimatedLeaves.jsx'

export default function JeuPage() {
  return (
    <Layout>
      <PageBanner title="Jeu-concours" />

      <section style={{ position: 'relative', background: 'var(--cream)', padding: '3.5rem 1.5rem 4.5rem', overflow: 'hidden' }}>
        <div className="container jeu-grid" style={{
          position: 'relative', zIndex: 1,
          display: 'grid',
          gridTemplateColumns: '420px 1fr',
          gap: '3.5rem',
          alignItems: 'center',
          maxWidth: 1000,
        }}>
          <div className="jeu-img-col">
            <img
              src="/images/Jeu/img_01.png"
              alt="Boutique Thé Tip Top"
              style={{ width: '100%', borderRadius: 18, objectFit: 'cover', boxShadow: 'var(--shadow-md)' }}
            />
          </div>

          <div>
            <h2 style={{ marginBottom: '1.25rem' }}>Présentation du jeu</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.85, marginBottom: '1rem', fontSize: '0.93rem', textAlign: 'justify' }}>
              À l'occasion de l'ouverture de notre 10ème boutique à Nice, nous organisons un grand jeu-concours exclusif pour remercier nos fidèles clients et faire découvrir nos créations de thés bio et artisanaux. Chaque achat supérieur à 49 € donne accès à un code unique permettant de participer au jeu.
            </p>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.85, marginBottom: '1rem', fontSize: '0.93rem', textAlign: 'justify' }}>
              100 % des participations sont gagnantes et offrent la possibilité de remporter des infuseurs, des thés signature, des coffrets découverte ou des lots premium. La participation est simple, rapide et sécurisée, directement depuis ce site dédié, dans le respect des données personnelles et de la réglementation en vigueur.
            </p>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.85, marginBottom: '1rem', fontSize: '0.93rem', textAlign: 'justify' }}>
              À l'issue du jeu-concours, un grand tirage au sort sera organisé et le gagnant remportera un an de thé gratuit.
            </p>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.85, marginBottom: '2rem', fontSize: '0.93rem' }}>
              Participez dès maintenant pour gagner des cadeaux thé de luxe !
            </p>
            <Link to="/gains" className="btn btn-orange" style={{ fontSize: '0.95rem' }}>
              Lots à gagner
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}
