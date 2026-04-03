import AnimatedLeaves from './AnimatedLeaves.jsx'

export default function PageBanner({ title }) {
  return (
    <div className="page-banner">
      {/* Feuilles animées en fond */}
      <AnimatedLeaves />

      {/* Contenu */}
      <div className="page-banner-content">
        {/* Feuille dorée gauche */}
        <img
          src="/images/Jeu/img_02.png"
          alt=""
          style={{ width: 48, height: 'auto', opacity: 0.85 }}
        />

        {/* Badge titre */}
        <div className="page-banner-badge">{title}</div>

        {/* Feuille dorée droite (miroir) */}
        <img
          src="/images/Jeu/img_02.png"
          alt=""
          style={{ width: 48, height: 'auto', opacity: 0.85, transform: 'scaleX(-1)' }}
        />
      </div>
    </div>
  )
}
