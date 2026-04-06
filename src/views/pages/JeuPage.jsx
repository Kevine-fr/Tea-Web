// src/views/pages/JeuPage.jsx

import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import PageBanner from '../components/PageBanner.jsx'

const CSS = `
@keyframes jeuImgIn  { from { opacity:0; transform: translateX(-45px) scale(0.97) } to { opacity:1; transform: none } }
@keyframes jeuTextIn { from { opacity:0; transform: translateX( 35px) } to { opacity:1; transform: none } }
@keyframes jeuLineIn { from { opacity:0; transform: translateY(12px) } to { opacity:1; transform: none } }

@keyframes jeuImgHoverShine {
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
}
@keyframes jeuShimmer {
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
}
@keyframes jeuPulseRing {
  0%   { box-shadow: 0 0 0 0   rgba(200,100,40,.38); }
  70%  { box-shadow: 0 0 0 12px rgba(200,100,40,0); }
  100% { box-shadow: 0 0 0 0   rgba(200,100,40,0); }
}

/* ── Image hover lift ── */
.jeu-img-col img {
  transition: transform .4s cubic-bezier(.25,.46,.45,.94), box-shadow .4s ease;
}
.jeu-img-col:hover img {
  transform: scale(1.025) translateY(-4px);
  box-shadow: 0 20px 48px rgba(0,0,0,.18) !important;
}

/* ── Paragraphes hover subtil ── */
.jeu-text-block p {
  transition: color .25s ease;
}
.jeu-text-block p:hover {
  color: var(--text-dark, #2a2a2a);
}

/* ── Bouton shimmer + pulse ── */
.jeu-btn {
  position: relative;
  overflow: hidden;
  transition: transform .2s ease, box-shadow .2s ease;
}
.jeu-btn::after {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.28), transparent);
  background-size: 200% 100%;
  opacity: 0;
  transition: opacity .2s;
}
.jeu-btn:hover {
  transform: translateY(-3px);
  animation: jeuPulseRing 1.4s ease-out infinite;
}
.jeu-btn:hover::after {
  opacity: 1;
  animation: jeuShimmer 1s linear infinite;
}
.jeu-btn:active {
  transform: translateY(-1px);
}

/* ── Layout responsive ── */
.jeu-inner {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 3.5rem;
  align-items: center;
  padding: 0 8rem;
}
@media (max-width: 1024px) {
  .jeu-inner { padding: 0 3rem; gap: 2.5rem; }
}
@media (max-width: 768px) {
  .jeu-inner {
    flex-direction: column;
    padding: 0 1.5rem;
    gap: 2rem;
  }
  .jeu-img-col {
    width: 100% !important;
    max-width: 420px;
    margin: 0 auto;
  }
}
@media (max-width: 480px) {
  .jeu-inner { padding: 0 1rem; }
}
`

export default function JeuPage() {
  const imgRef  = useRef(null)
  const h2Ref   = useRef(null)
  const p1Ref   = useRef(null)
  const p2Ref   = useRef(null)
  const p3Ref   = useRef(null)
  const p4Ref   = useRef(null)
  const btnRef  = useRef(null)

  useEffect(() => {
    if (imgRef.current)  imgRef.current.style.animation  = 'jeuImgIn  .7s cubic-bezier(.25,.46,.45,.94) .15s both'
    if (h2Ref.current)   h2Ref.current.style.animation   = 'jeuTextIn .6s ease .30s both'
    if (p1Ref.current)   p1Ref.current.style.animation   = 'jeuLineIn .5s ease .45s both'
    if (p2Ref.current)   p2Ref.current.style.animation   = 'jeuLineIn .5s ease .58s both'
    if (p3Ref.current)   p3Ref.current.style.animation   = 'jeuLineIn .5s ease .71s both'
    if (p4Ref.current)   p4Ref.current.style.animation   = 'jeuLineIn .5s ease .84s both'
    if (btnRef.current)  btnRef.current.style.animation  = 'jeuLineIn .5s ease .95s both'
  }, [])

  return (
    <Layout>
      <style>{CSS}</style>
      <PageBanner title="Jeu-concours" />

      <section style={{ position: 'relative', background: 'var(--cream)', padding: '3.5rem 1.5rem 4.5rem', overflow: 'hidden' }}>
        <div className="jeu-inner">
          <div ref={imgRef} className="jeu-img-col" style={{ opacity: 0, flexShrink: 0, width: 420 }}>
            <img
              src="/images/Jeu/img_01.png"
              alt="Boutique Thé Tip Top"
              style={{ width: '100%', borderRadius: 18, objectFit: 'cover', boxShadow: 'var(--shadow-md)' }}
            />
          </div>

          <div className="jeu-text-block">
            <h2 ref={h2Ref} style={{ marginBottom: '1.25rem', opacity: 0 }}>Présentation du jeu</h2>

            <p ref={p1Ref} style={{ color: 'var(--text-muted)', lineHeight: 1.85, marginBottom: '1rem', fontSize: '0.93rem', textAlign: 'justify', opacity: 0 }}>
              À l'occasion de l'ouverture de notre 10ème boutique à Nice, nous organisons un grand jeu-concours exclusif pour remercier nos fidèles clients et faire découvrir nos créations de thés bio et artisanaux. Chaque achat supérieur à 49 € donne accès à un code unique permettant de participer au jeu.
            </p>
            <p ref={p2Ref} style={{ color: 'var(--text-muted)', lineHeight: 1.85, marginBottom: '1rem', fontSize: '0.93rem', textAlign: 'justify', opacity: 0 }}>
              100 % des participations sont gagnantes et offrent la possibilité de remporter des infuseurs, des thés signature, des coffrets découverte ou des lots premium. La participation est simple, rapide et sécurisée, directement depuis ce site dédié, dans le respect des données personnelles et de la réglementation en vigueur.
            </p>
            <p ref={p3Ref} style={{ color: 'var(--text-muted)', lineHeight: 1.85, marginBottom: '1rem', fontSize: '0.93rem', textAlign: 'justify', opacity: 0 }}>
              À l'issue du jeu-concours, un grand tirage au sort sera organisé et le gagnant remportera un an de thé gratuit.
            </p>
            <p ref={p4Ref} style={{ color: 'var(--text-muted)', lineHeight: 1.85, marginBottom: '2rem', fontSize: '0.93rem', opacity: 0 }}>
              Participez dès maintenant pour gagner des cadeaux thé de luxe !
            </p>
            <div ref={btnRef} style={{ opacity: 0 }}>
              <Link to="/gains" className="btn btn-orange jeu-btn" style={{ fontSize: '0.95rem' }}>
                Lots à gagner
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
