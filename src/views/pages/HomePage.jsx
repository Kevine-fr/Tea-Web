// src/views/pages/HomePage.jsx

import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import AnimatedLeaves from '../components/AnimatedLeaves.jsx'

const CSS = `
@keyframes fadeInLeft  { from{opacity:0;transform:translateX(-40px)} to{opacity:1;transform:none} }
@keyframes fadeInRight { from{opacity:0;transform:translateX(50px)}  to{opacity:1;transform:none} }
@keyframes fadeInDown  { from{opacity:0;transform:translateY(-24px) rotate(-5deg)} to{opacity:1;transform:rotate(-5deg)} }
@keyframes fadeInUp    { from{opacity:0;transform:translateY(28px)}  to{opacity:1;transform:none} }
@keyframes fadeInUpSoft {
  from {
    opacity: 0;
    transform: translateY(28px);
  }
  to {
    opacity: 0.5;   /* ← IMPORTANT */
    transform: translateY(0);
  }
}
`

function useReveal(t = 0.04) {
  const [vis, setVis] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVis(true)
          obs.disconnect()
        }
      },
      { threshold: t }
    )

    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [t])

  return [ref, vis]
}

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return width
}

function StepCard({ n, img, label, visible, delay, isMobile }) {
  return (
    <div
      style={{
        position: 'relative',
        paddingTop: 22,
        width: isMobile ? '100%' : 220,
        maxWidth: isMobile ? 320 : 220,
        flexShrink: 0,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity .55s ease ${delay}s, transform .55s ease ${delay}s`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 18,
          zIndex: 3,
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: '#1a3c2e',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: '1rem',
          boxShadow: '0 3px 12px rgba(0,0,0,.4)',
          border: '2px solid rgba(255,255,255,.2)',
        }}
      >
        {n}
      </div>

      <div
        style={{
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 8px 28px rgba(0,0,0,.30)',
        }}
      >
        <div
          style={{
            background: '#EEE1CE',
            padding: isMobile ? '1.5rem 1rem 1.2rem' : '1.75rem 1rem 1.4rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src={img}
            alt={label}
            style={{
              width: isMobile ? 56 : 68,
              height: isMobile ? 56 : 68,
              objectFit: 'contain',
              display: 'block',
            }}
          />
        </div>

        <div
          style={{
            background: '#1a3c2e',
            padding: '0.85rem 0.75rem',
            textAlign: 'center',
          }}
        >
          <span
            style={{
              color: '#fff',
              fontWeight: 700,
              fontSize: isMobile ? '0.95rem' : '0.9rem',
              lineHeight: 1.3,
              fontFamily: "'Lato', sans-serif",
              display: 'block',
            }}
          >
            {label}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  const tagRef = useRef(null)
  const badgeRef = useRef(null)
  const descRef = useRef(null)
  const ticketRef = useRef(null)
  const btnRef = useRef(null)
  const cupRef = useRef(null)
  const tinRef = useRef(null)
  const steamRef = useRef(null)

  const [stepsRef, stepsVis] = useReveal(0.04)
  const width = useWindowWidth()

  const isTablet = width <= 1100
  const isMobile = width <= 768
  const isSmallMobile = width <= 480

  useEffect(() => {
    const seq = [
      { el: tagRef.current, anim: 'fadeInLeft  .55s ease .08s both' },
      { el: badgeRef.current, anim: 'fadeInLeft  .55s ease .24s both' },
      { el: descRef.current, anim: 'fadeInLeft  .55s ease .40s both' },
      { el: ticketRef.current, anim: 'fadeInDown  .65s ease .55s both' },
      { el: btnRef.current, anim: 'fadeInUp    .50s ease .75s both' },
      { el: cupRef.current, anim: 'fadeInRight .75s ease .18s both' },
      { el: tinRef.current, anim: 'fadeInRight .75s ease .36s both' },
      { el: steamRef.current, anim: 'fadeInUpSoft .8s ease 1.1s both' },    ]

    seq.forEach(({ el, anim }) => {
      if (el) el.style.animation = anim
    })
  }, [])

  return (
    <Layout>
      <style>{CSS}</style>

      <div>
        <section
          style={{
            flex: '1.6',
            position: 'relative',
            background: '#f5f0e8',
            overflow: 'hidden',
          }}
        >
          <AnimatedLeaves />

          <img
            src="/images/Accueil/img_09.png"
            alt=""
            style={{
              position: 'absolute',
              right: '0%',
              top: '-30%',
              width: isMobile ? '50%' : 'auto',
              zIndex: 1,
              transform: 'rotate(90deg)',
              pointerEvents: 'none',
            }}
          />

          <img
            src="/images/Accueil/img_09.png"
            alt=""
            style={{
              position: 'absolute',
              right: isMobile ? '0%' : '15%',
              bottom: '-30%',
              width: isMobile ? '50%' : 'auto',
              zIndex: 1,
              transform: 'rotate(90deg)',
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              zIndex: 2,
              padding: isMobile ? '2rem 1.25rem' : '3.5rem 2rem',
              margin: isMobile ? '1.25rem 1rem 0 1rem' : isTablet ? '2rem 2rem 0 2rem' : '3rem 4rem 0 4rem',
              position: 'relative',
              borderRadius: 24,
              background: '#EEE1CE',
              border: '1px solid #e2d9c8',
              boxShadow: '0 6px 40px rgba(0,0,0,.08)',
              overflow: 'visible',
              display: 'grid',
              gridTemplateColumns: isTablet ? '1fr' : '38% 62%',
              gap: isTablet ? '2rem' : 0,
            }}
          >
            <div style={{ position: 'relative', zIndex: 2 }}>
              <p
                ref={tagRef}
                style={{
                  fontSize: isMobile ? '1rem' : isTablet ? '1.2rem' : '1.5rem',
                  fontWeight: 700,
                  letterSpacing: isMobile ? '0.08em' : '0.18em',
                  textTransform: 'uppercase',
                  color: '#6b6b6b',
                  marginBottom: '0.85rem',
                  opacity: 0,
                }}
              >
                PARTICIPEZ AU JEU-CONCOURS
              </p>

              <div
                ref={badgeRef}
                style={{
                  display: 'inline-block',
                  background: '#1a3c2e',
                  borderRadius: 8,
                  padding: isMobile ? '0.45rem 1.2rem' : '0.5rem 1.75rem',
                  marginBottom: '1.1rem',
                  opacity: 0,
                }}
              >
                <span
                  style={{
                    fontFamily: "'Dancing Script', cursive",
                    fontSize: isMobile ? '2rem' : '2.5rem',
                    color: '#fff',
                    fontWeight: 600,
                  }}
                >
                  Thé Tip Top
                </span>
              </div>

              <p
                ref={descRef}
                style={{
                  fontSize: isMobile ? '1rem' : isTablet ? '1.05rem' : '1.2rem',
                  lineHeight: 1.8,
                  color: '#4a4a4a',
                  opacity: 0,
                  maxWidth: isTablet ? '100%' : '90%',
                }}
              >
                Célébrez l'ouverture de notre 10ème boutique à Nice avec notre jeu-concours
                qui est 100% gagnant et voir une chance de gagner des cadeaux et lots de thé
                bio artisanaux.
              </p>
            </div>

            <div
              style={{
                position: isTablet ? 'relative' : 'absolute',
                left: isTablet ? 'auto' : '55%',
                top: isTablet ? 'auto' : '35%',
                transform: isTablet ? 'none' : 'translate(-50%, -50%)',
                zIndex: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.25rem',
                width: isTablet ? '100%' : 'auto',
                marginTop: isTablet ? '1rem' : 0,
              }}
            >
              <div
                ref={ticketRef}
                style={{
                  width: isMobile ? '100%' : isTablet ? '70%' : '95%',
                  maxWidth: isMobile ? 340 : 520,
                  transform: 'rotate(-5deg)',
                  filter: 'drop-shadow(0 8px 20px rgba(0,0,0,.18))',
                  opacity: 0,
                }}
              >
                <div style={{ position: 'relative' }}>
                  <img
                    src="/images/Accueil/img_06.png"
                    alt=""
                    style={{
                      width: '100%',
                      display: 'block',
                      borderRadius: 8,
                      transform: 'rotate(175deg)',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%) rotate(-5deg)',
                      textAlign: 'center',
                      width: '72%',
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 700,
                        fontSize: isMobile ? '1.2rem' : '1.8rem',
                        color: '#1a1a1a',
                        marginBottom: '0.2rem',
                        lineHeight: 1.3,
                      }}
                    >
                      Tirage au sort final :
                    </p>
                    <p
                      style={{
                        fontFamily: "'Dancing Script', cursive",
                        fontSize: isMobile ? '1.6rem' : '2.2rem',
                        color: '#e8431a',
                        fontWeight: 700,
                        lineHeight: 1.15,
                      }}
                    >
                      1 AN de thé offert
                    </p>
                    <div
                      style={{
                        width: '55%',
                        height: 1,
                        background: 'rgba(170,130,40,.5)',
                        margin: '0.25rem auto',
                      }}
                    />
                    <p
                      style={{
                        fontSize: isMobile ? '0.85rem' : '1rem',
                        color: '#666',
                        lineHeight: 1.5,
                      }}
                    >
                      Jeu limité dans le temps.
                      <br />
                      Voir modalité en magasin et sur le site
                    </p>
                  </div>
                </div>
              </div>

              <div ref={btnRef} style={{ opacity: 0 }}>
                <Link
                  to="/register"
                  style={{
                    display: 'inline-block',
                    background: '#e8431a',
                    color: '#fff',
                    borderRadius: 50,
                    padding: isMobile ? '0.8rem 2rem' : '0.9rem 2.5rem',
                    fontSize: isMobile ? '0.95rem' : '1.05rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    boxShadow: '0 4px 16px rgba(232,67,26,.35)',
                    fontFamily: "'Lato', sans-serif",
                  }}
                >
                  Jouer maintenant
                </Link>
              </div>
            </div>

            {!isTablet && (
              <>
                <img
                  ref={steamRef} 
                  src="/images/Accueil/img_10.png"
                  alt=""
                  style={{
                    position: 'absolute',
                    bottom: '50%',
                    right: '13%',
                    width: '11.5%',
                    opacity: 0,
                    zIndex: 6,
                  }}
                />

                <img
                  ref={cupRef}
                  src="/images/Accueil/img_02.png"
                  alt=""
                  style={{
                    position: 'absolute',
                    bottom: '0%',
                    right: '7.5%',
                    height: '70%',
                    width: 'auto',
                    zIndex: 5,
                    opacity: 0,
                  }}
                />

                <img
                  ref={tinRef}
                  src="/images/Accueil/img_01.png"
                  alt=""
                  style={{
                    position: 'absolute',
                    top: '0%',
                    right: '0%',
                    height: '100%',
                    width: 'auto',
                    zIndex: 4,
                    opacity: 0,
                  }}
                />
              </>
            )}
          </div>

          <div
            ref={stepsRef}
            style={{
              position: 'relative',
              zIndex: 2,
              margin: isMobile ? '1.5rem 1rem 0 1rem' : isTablet ? '2rem 2rem 0 2rem' : '0 4rem',
              display: 'flex',
              alignItems: isTablet ? 'stretch' : 'center',
              justifyContent: isTablet ? 'center' : 'flex-start',
              flexWrap: 'wrap',
              gap: isMobile ? '1.25rem' : '3rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: isMobile ? 'center' : 'flex-start',
                gap: isMobile ? '0.5rem' : '1rem',
                width: isTablet ? '100%' : 'auto',
                flexWrap: isSmallMobile ? 'wrap' : 'nowrap',
              }}
            >
              <div
                style={{
                  height: isMobile ? 180 : 265,
                  position: 'relative',
                  flexShrink: 0,
                  opacity: stepsVis ? 1 : 0,
                  transform: stepsVis ? 'scale(1)' : 'scale(0.78)',
                  transition: 'opacity .55s ease, transform .55s ease',
                }}
              >
                <img
                  src="/images/Accueil/img_05.png"
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />

                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Playfair Display',serif",
                      fontStyle: 'italic',
                      color: '#fff',
                      fontSize: isMobile ? '1.45rem' : '2.2rem',
                      lineHeight: 1,
                    }}
                  >
                    100%
                  </span>
                  <span
                    style={{
                      fontFamily: "'Playfair Display',serif",
                      fontStyle: 'italic',
                      color: '#fff',
                      fontSize: isMobile ? '1.45rem' : '2.2rem',
                    }}
                  >
                    Gagnant
                  </span>
                </div>
              </div>

              <div
                style={{
                  padding: isMobile ? '0.8rem 1rem' : '1rem',
                  backgroundColor: '#EEE1CE',
                  borderTopRightRadius: '25px',
                  borderBottomRightRadius: '0px',
                  borderBottomLeftRadius: '0px',
                  borderTopLeftRadius: '25px',
                  width: isSmallMobile ? '100%' : 'auto',
                  textAlign: isSmallMobile ? 'center' : 'left',
                }}
              >
                <h2
                  style={{
                    fontFamily: "'Playfair Display',serif",
                    color: '#1a3c2e',
                    fontSize: isMobile ? '1.2rem' : '1.55rem',
                    margin: 0,
                    whiteSpace: isSmallMobile ? 'normal' : 'nowrap',
                    opacity: stepsVis ? 1 : 0,
                    transform: stepsVis ? 'none' : 'translateX(-20px)',
                    transition: 'opacity .55s ease .14s, transform .55s ease .14s',
                  }}
                >
                  Comment ça marche ?
                </h2>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: isMobile ? '1rem' : '1.5rem',
                justifyContent: 'center',
                flex: 1,
                width: isTablet ? '100%' : 'auto',
              }}
            >
              <StepCard
                n={1}
                img="/images/Accueil/img_08.png"
                label="Récupère ton ticket"
                visible={stepsVis}
                delay={0.28}
                isMobile={isMobile}
              />
              <StepCard
                n={2}
                img="/images/Accueil/img_07.png"
                label="Saisis ton code"
                visible={stepsVis}
                delay={0.44}
                isMobile={isMobile}
              />
              <StepCard
                n={3}
                img="/images/Accueil/img_04.png"
                label="Découvre ton lot"
                visible={stepsVis}
                delay={0.60}
                isMobile={isMobile}
              />
            </div>
          </div>
        </section>
      </div>
    </Layout>
  )
}