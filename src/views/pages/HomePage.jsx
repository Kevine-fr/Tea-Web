import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import AnimatedLeaves from '../components/AnimatedLeaves.jsx'

/* ═══════════════════════════════════════════════════════
   Hook IntersectionObserver — déclenche une animation
   quand l'élément entre dans le viewport
═══════════════════════════════════════════════════════ */
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

/* ─── Animation CSS globale ──────────────────────────── */
const GLOBAL_CSS = `
@keyframes fadeInLeft  { from { opacity:0; transform:translateX(-40px) } to { opacity:1; transform:none } }
@keyframes fadeInRight { from { opacity:0; transform:translateX( 40px) } to { opacity:1; transform:none } }
@keyframes fadeInDown  { from { opacity:0; transform:translateY(-25px) } to { opacity:1; transform:none } }
@keyframes fadeInUp    { from { opacity:0; transform:translateY( 30px) } to { opacity:1; transform:none } }
@keyframes fadeIn      { from { opacity:0 }                              to { opacity:1 } }
@keyframes scaleIn     { from { opacity:0; transform:scale(.85) }        to { opacity:1; transform:scale(1) } }
`

/* ─── Carte d'étape (2 tons) ─────────────────────────── */
function StepCard({ n, img, label, delay }) {
  const [ref, vis] = useReveal(0.2)
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? 'translateY(0)' : 'translateY(40px)',
      transition: `opacity .6s ease ${delay}s, transform .6s ease ${delay}s`,
      borderRadius: 16,
      overflow: 'hidden',
      boxShadow: 'var(--shadow-md)',
      display: 'flex',
      flexDirection: 'column',
      width: 190,
      flexShrink: 0,
    }}>
      {/* Haut crème — numéro + icône */}
      <div style={{ background: 'var(--cream)', padding: '1.25rem 1rem 1rem', textAlign: 'center' }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'var(--green-dark)', color: 'white',
          fontSize: '0.95rem', fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 0.85rem',
        }}>
          {n}
        </div>
        <img src={img} alt={label}
          style={{ width: 60, height: 60, objectFit: 'contain', display: 'block', margin: '0 auto' }} />
      </div>
      {/* Bas vert foncé — label blanc */}
      <div style={{
        background: 'var(--green-dark)',
        color: 'white',
        padding: '0.75rem 1rem',
        textAlign: 'center',
        fontWeight: 700,
        fontSize: '0.85rem',
        lineHeight: 1.3,
      }}>
        {label}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   Page principale
═══════════════════════════════════════════════════════ */
export default function HomePage() {
  /* Refs pour les animations séquentielles du hero */
  const tagRef     = useRef(null)
  const titleRef   = useRef(null)
  const badgeRef   = useRef(null)
  const descRef    = useRef(null)
  const btnRef     = useRef(null)
  const imgRef     = useRef(null)
  const cardRef    = useRef(null)

  /* Sections scroll-reveal */
  const [stepsRef,  stepsVis]  = useReveal(0.1)
  const [infoRef,   infoVis]   = useReveal(0.15)

  /* Animation séquentielle du hero au chargement */
  useEffect(() => {
    const items = [
      { el: tagRef.current,   anim: 'fadeInLeft  .6s ease  .1s both' },
      { el: badgeRef.current,  anim: 'fadeInLeft  .6s ease  .3s both' },
      { el: descRef.current,   anim: 'fadeInLeft  .6s ease  .5s both' },
      { el: btnRef.current,    anim: 'fadeInUp    .6s ease  .7s both' },
      { el: imgRef.current,    anim: 'fadeInRight .7s ease  .2s both' },
      { el: cardRef.current,   anim: 'fadeInDown  .6s ease  .8s both' },
    ]
    items.forEach(({ el, anim }) => {
      if (el) el.style.animation = anim
    })
  }, [])

  return (
    <Layout>
      <style>{GLOBAL_CSS}</style>

      {/* ══ HERO ════════════════════════════════════════════ */}
      <section style={{
        position: 'relative',
        background: 'var(--cream)',
        padding: '2rem 1.5rem 0',
        overflow: 'hidden',
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
      }}>
        <AnimatedLeaves />

        <div className="container" style={{ position: 'relative', zIndex: 1, width: '100%' }}>
          {/* Grande carte hero */}
          <div style={{
            background: 'var(--cream-light)',
            borderRadius: 20,
            padding: '2.5rem 3rem',
            display: 'grid',
            gridTemplateColumns: '1fr 380px',
            gap: '2rem',
            alignItems: 'center',
            maxWidth: 1000,
            margin: '0 auto',
            border: '1px solid var(--cream-border)',
            boxShadow: 'var(--shadow-md)',
            position: 'relative',
            overflow: 'visible',
          }}>

            {/* ── Colonne gauche ── */}
            <div>
              {/* Tag */}
              <p ref={tagRef} style={{
                fontSize: '0.72rem', fontWeight: 700,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                color: 'var(--text-muted)', marginBottom: '0.75rem',
                opacity: 0,
              }}>
                PARTICIPEZ AU JEU-CONCOURS
              </p>

              {/* Badge vert script */}
              <div ref={badgeRef} style={{ opacity: 0, marginBottom: '1.25rem', display: 'inline-block' }}>
                <div style={{
                  background: 'var(--green-dark)',
                  display: 'inline-flex', alignItems: 'center',
                  padding: '0.5rem 1.5rem', borderRadius: 6,
                }}>
                  <span style={{ fontFamily: 'var(--font-script)', fontSize: '1.75rem', color: 'white', fontWeight: 600 }}>
                    Thé Tip Top
                  </span>
                </div>
              </div>

              {/* Description */}
              <p ref={descRef} style={{
                fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.8,
                maxWidth: 420, marginBottom: '1.75rem', opacity: 0,
              }}>
                Célébrez l'ouverture de notre 10ème boutique à Nice avec notre jeu-concours
                qui est 100% gagnant et voir une chance de gagner des cadeaux et lots de thé bio artisanaux.
              </p>

              {/* Bouton */}
              <div ref={btnRef} style={{ opacity: 0 }}>
                <Link to="/register" className="btn btn-orange" style={{ fontSize: '1rem', padding: '0.85rem 2rem' }}>
                  Jouer maintenant
                </Link>
              </div>
            </div>

            {/* ── Colonne droite (images) ── */}
            <div className="hero-img-col" style={{ position: 'relative', minHeight: 280 }}>
              {/* Boîte de thé principale */}
              <div ref={imgRef} style={{ opacity: 0, textAlign: 'center' }}>
                <img
                  src="/images/Accueil/img_01.png"
                  alt="Thé Tip Top"
                  style={{ width: 200, height: 'auto', objectFit: 'contain', display: 'inline-block' }}
                />
              </div>

              {/* Carte flottante "Tirage au sort" */}
              <div ref={cardRef} style={{
                position: 'absolute', top: -15, right: -20,
                background: 'white', borderRadius: 12,
                padding: '1rem 1.25rem',
                boxShadow: 'var(--shadow-md)',
                maxWidth: 190,
                border: '1px solid var(--cream-border)',
                opacity: 0,
              }}>
                <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                  Tirage au sort final :
                </p>
                <p style={{ fontFamily: 'var(--font-script)', fontSize: '1.1rem', color: 'var(--orange)', fontWeight: 700, lineHeight: 1.2 }}>
                  1 AN de thé offert
                </p>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.4rem', lineHeight: 1.45 }}>
                  Jeu limité dans le temps.<br />
                  Voir modalité en magasin et sur le site
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ COMMENT ÇA MARCHE ═══════════════════════════════ */}
      <section style={{
        position: 'relative',
        background: 'var(--green-dark)',
        padding: '3.5rem 1.5rem 4rem',
        overflow: 'hidden',
      }}>
        {/* Grande feuille en texture de fond */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', opacity: 0.25, pointerEvents: 'none' }}>
          <img src="/images/Accueil/img_09.png" alt="" style={{ position: 'absolute', bottom: -60, left: '30%', width: 420, transform: 'rotate(-10deg)' }} />
          <img src="/images/Accueil/img_09.png" alt="" style={{ position: 'absolute', top: -40, right: '10%', width: 300, transform: 'rotate(15deg) scaleX(-1)' }} />
        </div>

        <div ref={stepsRef} className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
            {/* Badge 100% gagnant */}
            <div style={{
              opacity: stepsVis ? 1 : 0,
              transform: stepsVis ? 'scale(1)' : 'scale(.8)',
              transition: 'opacity .6s ease, transform .6s ease',
              position: 'relative', width: 130, height: 130, flexShrink: 0,
            }}>
              <img src="/images/Accueil/img_05.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 700, color: 'white', fontStyle: 'italic', lineHeight: 1 }}>100%</span>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', color: 'white', fontStyle: 'italic' }}>Gagnant</span>
              </div>
            </div>

            {/* Texte */}
            <h2 style={{
              color: 'white', fontSize: '1.5rem', whiteSpace: 'nowrap',
              opacity: stepsVis ? 1 : 0,
              transform: stepsVis ? 'translateX(0)' : 'translateX(-20px)',
              transition: 'opacity .6s ease .15s, transform .6s ease .15s',
            }}>
              Comment ça marche ?
            </h2>

            {/* 3 cartes étapes */}
            <StepCard n="1" img="/images/Accueil/img_08.png" label="Récupère ton ticket" delay={stepsVis ? 0.3 : 99} />
            <StepCard n="2" img="/images/Accueil/img_07.png" label="Saisis ton code"      delay={stepsVis ? 0.5 : 99} />
            <StepCard n="3" img="/images/Accueil/img_04.png" label="Découvre ton lot"     delay={stepsVis ? 0.7 : 99} />
          </div>
        </div>
      </section>

      {/* ══ GRAND JEU-CONCOURS ══════════════════════════════ */}
      <section style={{ background: 'var(--cream)', padding: '5rem 1.5rem' }}>
        <div ref={infoRef} className="container" style={{ maxWidth: 780, textAlign: 'center' }}>
          <h2 style={{
            marginBottom: '1.25rem',
            opacity: infoVis ? 1 : 0,
            transform: infoVis ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity .6s ease, transform .6s ease',
          }}>
            Grand jeu-concours
          </h2>
          <p style={{
            color: 'var(--text-muted)', lineHeight: 1.85, marginBottom: '1rem', fontSize: '0.95rem',
            opacity: infoVis ? 1 : 0,
            transform: infoVis ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity .6s ease .15s, transform .6s ease .15s',
          }}>
            À l'occasion de l'ouverture de la 10e boutique Thé Tip Top à Nice, la marque organise
            un grand jeu-concours exclusif destiné à faire découvrir son univers et ses créations.
          </p>
          <p style={{
            color: 'var(--text-muted)', lineHeight: 1.85, marginBottom: '2.5rem', fontSize: '0.95rem',
            opacity: infoVis ? 1 : 0,
            transform: infoVis ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity .6s ease .3s, transform .6s ease .3s',
          }}>
            Chaque client ayant effectué un achat supérieur à 49 € reçoit un code unique à 10 caractères
            lui permettant de participer en ligne. 100 % des participations sont gagnantes et donnent
            accès à un lot à retirer en boutique ou en ligne, selon les modalités prévues par le règlement.
          </p>
          <div style={{
            opacity: infoVis ? 1 : 0,
            transform: infoVis ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity .6s ease .45s, transform .6s ease .45s',
          }}>
            <Link to="/jeu" className="btn btn-orange" style={{ fontSize: '0.95rem' }}>
              En savoir plus
            </Link>
          </div>
        </div>
      </section>

    </Layout>
  )
}
