// src/views/pages/JeuPage.jsx

import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import PageBanner from '../components/PageBanner.jsx'

const CSS = `
@keyframes jeuImgIn  { from { opacity:0; transform: translateX(-45px) scale(0.97) } to { opacity:1; transform: none } }
@keyframes jeuTextIn { from { opacity:0; transform: translateX( 35px) } to { opacity:1; transform: none } }
@keyframes jeuLineIn { from { opacity:0; transform: translateY(12px) } to { opacity:1; transform: none } }
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
        <div className="container jeu-grid" style={{
          position: 'relative', zIndex: 1,
          display: 'grid',
          gridTemplateColumns: '420px 1fr',
          gap: '3.5rem',
          alignItems: 'center',
          maxWidth: 1000,
        }}>
          <div ref={imgRef} className="jeu-img-col" style={{ opacity: 0 }}>
            <img
              src="/images/Jeu/img_01.png"
              alt="Boutique Thé Tip Top"
              style={{ width: '100%', borderRadius: 18, objectFit: 'cover', boxShadow: 'var(--shadow-md)' }}
            />
          </div>

          <div>
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
              <Link to="/gains" className="btn btn-orange" style={{ fontSize: '0.95rem' }}>
                Lots à gagner
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}