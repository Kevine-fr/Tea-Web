import { useEffect } from 'react'
import AnimatedLeaves from './AnimatedLeaves.jsx'

/* ─── Styles d'animation ─────────────────────────────────── */
const STYLES = `
  @keyframes bannerFadeDown {
    from { opacity: 0; transform: translateY(-18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes leafSwingL {
    0%   { opacity: 0; transform: scaleX(-1) translateX(-20px) rotate(-8deg); }
    60%  { transform: scaleX(-1) translateX(4px) rotate(2deg); }
    100% { opacity: 0.85; transform: scaleX(-1) translateX(0) rotate(0deg); }
  }
  @keyframes leafSwingR {
    0%   { opacity: 0; transform: translateX(20px) rotate(8deg); }
    60%  { transform: translateX(-4px) rotate(-2deg); }
    100% { opacity: 0.85; transform: translateX(0) rotate(0deg); }
  }
  @keyframes badgeSlideUp {
    from { opacity: 0; transform: translateY(12px) scale(.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes leafFloat {
    0%, 100% { transform: scaleX(-1) translateY(0px) rotate(0deg); }
    50%       { transform: scaleX(-1) translateY(-5px) rotate(-2deg); }
  }
  @keyframes leafFloatR {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50%       { transform: translateY(-5px) rotate(2deg); }
  }

  /* ── Conteneur banner ── */
  .page-banner-content {
    animation: bannerFadeDown .5s cubic-bezier(.22,.68,0,1.1) both;
  }

  /* ── Feuille gauche ── */
  .banner-leaf-left {
    animation: leafSwingL .65s cubic-bezier(.22,.68,0,1.1) .1s both;
  }
  .banner-leaf-left:hover {
    animation: leafFloat 2.6s ease-in-out infinite !important;
  }

  /* ── Feuille droite ── */
  .banner-leaf-right {
    animation: leafSwingR .65s cubic-bezier(.22,.68,0,1.1) .1s both;
  }
  .banner-leaf-right:hover {
    animation: leafFloatR 2.6s ease-in-out infinite !important;
  }

  /* ── Badge titre ── */
  .page-banner-badge {
    animation: badgeSlideUp .5s ease .15s both;
  }
`

export default function PageBanner({ title }) {
  useEffect(() => {
    const id = '__banner-styles__'
    if (!document.getElementById(id)) {
      const el = document.createElement('style')
      el.id = id
      el.textContent = STYLES
      document.head.appendChild(el)
    }
  }, [])

  return (
    <div className="page-banner">
      <AnimatedLeaves />

      <div
        className="page-banner-content"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#EEE1CE',
          width: '100%',
          padding: '0.5rem 10rem',
          margin: '0 8rem',
          borderRadius: '25px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.12)',
        }}
      >
        {/* Feuille gauche */}
        <img
          src="/images/Jeu/img_02.png"
          alt=""
          className="banner-leaf-left"
          style={{ width: '10%', opacity: 0.85, transform: 'scaleX(-1)' }}
        />

        {/* Badge titre */}
        <div className="page-banner-badge">{title}</div>

        {/* Feuille droite */}
        <img
          src="/images/Jeu/img_02.png"
          alt=""
          className="banner-leaf-right"
          style={{ width: '10%', opacity: 0.85 }}
        />
      </div>
    </div>
  )
}