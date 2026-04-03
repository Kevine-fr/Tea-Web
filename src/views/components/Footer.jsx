import { Link } from 'react-router-dom'
import TeaLogo from './TeaLogo.jsx'

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--green-dark)',
      color: 'rgba(255,255,255,0.75)',
      padding: '4rem 0 0',
      marginTop: 'auto',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '3rem',
          paddingBottom: '3rem',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}>

          {/* ── Brand ──────────────────────────────────────────────── */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <TeaLogo size={48} />
              <div>
                <div style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold)', fontSize: '1.05rem', fontStyle: 'italic' }}>
                  Thé Tip Top
                </div>
                <div style={{ fontSize: '0.65rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>
                  Maison française de thés
                </div>
              </div>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.7 }}>
              Créations signatures, infusions bien-être et thés biologiques artisanaux.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              {['f', '📷', '♪'].map((icon, i) => (
                <a key={i} href="#" style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  color: 'rgba(255,255,255,0.6)',
                  transition: 'var(--transition)',
                }}>
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* ── Jeu ────────────────────────────────────────────────── */}
          <div>
            <h4 style={{ color: 'var(--gold)', fontFamily: 'var(--font-serif)', fontSize: '1rem', marginBottom: '1.25rem' }}>
              Jeu-concours
            </h4>
            {[
              { to: '/jeu',     label: 'Présentation du jeu' },
              { to: '/gains',   label: 'Lots à gagner' },
              { to: '/contact', label: 'Nous contacter' },
            ].map(({ to, label }) => (
              <Link key={to} to={to} style={{
                display: 'block',
                padding: '0.35rem 0',
                fontSize: '0.88rem',
                color: 'rgba(255,255,255,0.65)',
                transition: 'var(--transition)',
              }}>
                {label}
              </Link>
            ))}
          </div>

          {/* ── Légal ──────────────────────────────────────────────── */}
          <div>
            <h4 style={{ color: 'var(--gold)', fontFamily: 'var(--font-serif)', fontSize: '1rem', marginBottom: '1.25rem' }}>
              Informations légales
            </h4>
            {[
              { to: '/politique', label: 'Politique de confidentialité' },
              { to: '/cgv',       label: 'CGV' },
              { to: '/cgu',       label: 'CGU' },
            ].map(({ to, label }) => (
              <Link key={to} to={to} style={{
                display: 'block',
                padding: '0.35rem 0',
                fontSize: '0.88rem',
                color: 'rgba(255,255,255,0.65)',
                transition: 'var(--transition)',
              }}>
                {label}
              </Link>
            ))}
          </div>

          {/* ── Contact ────────────────────────────────────────────── */}
          <div>
            <h4 style={{ color: 'var(--gold)', fontFamily: 'var(--font-serif)', fontSize: '1rem', marginBottom: '1.25rem' }}>
              Suivez-nous
            </h4>
            {[
              { icon: 'f',  label: 'Facebook',  href: '#' },
              { icon: '📷', label: 'Instagram', href: '#' },
              { icon: '♪',  label: 'TikTok',    href: '#' },
            ].map(({ icon, label, href }) => (
              <a key={label} href={href} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.35rem 0',
                fontSize: '0.88rem',
                color: 'rgba(255,255,255,0.65)',
              }}>
                <span style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                }}>
                  {icon}
                </span>
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* ── Bottom ─────────────────────────────────────────────────── */}
        <div style={{
          padding: '1.25rem 0',
          textAlign: 'center',
          fontSize: '0.8rem',
          color: 'rgba(255,255,255,0.35)',
        }}>
          © {new Date().getFullYear()} – Thé Tip Top. Tous droits réservés.
        </div>
      </div>
    </footer>
  )
}
