import AnimatedLeaves from './AnimatedLeaves.jsx'

export default function PageBanner({ title }) {
  return (
    <div className="page-banner">
      {/* Feuilles animées en fond */}
      <AnimatedLeaves />

      {/* Contenu */}
      <div className="page-banner-content"
        style={{
          display: 'flex',                 
          justifyContent: 'space-between', 
          alignItems: 'center',
          backgroundColor: '#EEE1CE',
          width: "100%",
          padding: "0.5rem 10rem",
          margin: "0 8rem",
          borderRadius: "25px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.12)"
        }}
      >
        {/* Feuille dorée gauche */}
        <img
          src="/images/Jeu/img_02.png"
          alt=""
          style={{ width: "10%", opacity: 0.85 , transform: 'scaleX(-1)' }}
        />

        {/* Badge titre */}
        <div className="page-banner-badge">{title}</div>

        {/* Feuille dorée droite (miroir) */}
        <img
          src="/images/Jeu/img_02.png"
          alt=""
          style={{ width: "10%", opacity: 0.85 }}
        />
      </div>
    </div>
  )
}
