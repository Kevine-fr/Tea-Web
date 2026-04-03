import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{ background: 'var(--green-dark)', color: 'rgba(255,255,255,.75)', padding: '3.5rem 0 0' }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr 1fr',
          gap: '3rem',
          paddingBottom: '2.5rem',
          borderBottom: '1px solid rgba(255,255,255,.1)',
        }}>

          {/* ── Brand ── */}
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <img
                src="/images/Footer/img_01.png"
                alt="Thé Tip Top"
                style={{ height: 100, width: 'auto' }}
                onError={e => { e.target.style.display = 'none' }}
              />
            </div>
            <p style={{ fontWeight: 700, fontSize: '1.05rem', color: 'white', lineHeight: 1.4, marginBottom: '0.4rem' }}>
              Maison française de thés<br />biologiques et artisanaux.
            </p>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,.55)' }}>
              Créations signatures, infusions bien-être et thés premium.
            </p>
          </div>

          {/* ── Jeu ── */}
          <div>
            <h4 style={{ color: 'white', fontFamily: 'var(--font-body)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.1rem' }}>
              Jeu-concours
            </h4>
            {[
              { to: '/jeu',     label: 'Présentation du jeu' },
              { to: '/gains',   label: 'Lots à gagner' },
              { to: '/contact', label: 'Nous Contacter' },
            ].map(({ to, label }) => (
              <Link key={to} to={to}
                style={{ display: 'block', padding: '0.3rem 0', fontSize: '0.88rem', color: 'rgba(255,255,255,.6)', transition: 'var(--tr)' }}
                onMouseEnter={e => e.target.style.color = 'white'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,.6)'}>
                {label}
              </Link>
            ))}
          </div>

          {/* ── Légal + Réseaux ── */}
          <div>
            <h4 style={{ color: 'white', fontFamily: 'var(--font-body)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.1rem' }}>
              Informations légales
            </h4>
            <Link to="/politique"
              style={{ display: 'block', padding: '0.3rem 0', fontSize: '0.88rem', color: 'rgba(255,255,255,.6)' }}>
              Politique de confidentialité
            </Link>
            <Link to="/cgu"
              style={{ display: 'block', padding: '0.3rem 0', fontSize: '0.88rem', color: 'rgba(255,255,255,.6)' }}>
              CGU
            </Link>

            <h4 style={{ color: 'white', fontFamily: 'var(--font-body)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '1.5rem', marginBottom: '1rem' }}>
              Suivez-nous !
            </h4>
            {[
              { label: 'Facebook',  letter: 'f' },
              { label: 'Instagram', letter: '◎' },
              { label: 'Tik-Tok',   letter: '♪' },
            ].map(({ label, letter }) => (
              <a key={label} href="#"
                style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.25rem 0', fontSize: '0.88rem', color: 'rgba(255,255,255,.6)' }}>
                <span style={{ width: 22, textAlign: 'center', fontSize: '0.78rem' }}>{letter}</span>
                {label}
              </a>
            ))}
          </div>
        </div>

        <div style={{ padding: '1.25rem 0', textAlign: 'right', fontSize: '0.8rem', color: 'rgba(255,255,255,.3)' }}>
          © {new Date().getFullYear()} – Thé Tip Top. Tous droits réservés.
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        @media(max-width:768px){
          footer .container > div:first-child {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </footer>
  )
}
