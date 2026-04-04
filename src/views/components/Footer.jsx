// src/views/components/Footer.jsx

import { Link } from 'react-router-dom'

const SOCIAL = [
  {
    label: 'Facebook',
    href: '#',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: '#',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    label: 'Tik-Tok',
    href: '#',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
      </svg>
    ),
  },
]

export default function Footer() {
  return (
    <footer style={{ background: '#1a3c2e', color: 'rgba(255,255,255,.75)' }}>

      {/* ── Logo + Tagline ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0rem 4rem 0',
      }}>
        <img
          src="/images/Footer/img_01.png"
          alt="Thé Tip Top"
          style={{ height: 260, width: 'auto', flexShrink: 0 }}
          onError={e => { e.target.style.display = 'none' }}
        />
        <div>
          <p style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 700,
            fontSize: '1.55rem',
            color: 'white',
            lineHeight: 1.35,
            marginBottom: '0.5rem',
          }}>
            Maison française de thés<br />biologiques et artisanaux.
          </p>
          <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,.55)' }}>
            Créations signatures, infusions bien-être et thés premium.
          </p>
        </div>
      </div>

      {/* ── 3 colonnes ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '2rem',
        padding: '0 10rem',
      }}>
        {/* Jeu-concours */}
        <div>
          <h4 style={{ color: 'white', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
            Jeu-consours
          </h4>
          {[
            { to: '/jeu',     label: 'Présentation du jeu' },
            { to: '/gains',   label: 'Lots à gagner' },
            { to: '/contact', label: 'Nous Contacter' },
          ].map(({ to, label }) => (
            <Link key={to} to={to} style={{ display: 'block', padding: '0.2rem 0', fontSize: '0.88rem', color: 'rgba(255,255,255,.6)' }}
              onMouseEnter={e => e.target.style.color = 'white'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,.6)'}>
              {label}
            </Link>
          ))}
        </div>

        {/* Informations légales */}
        <div>
          <h4 style={{ color: 'white', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
            Informations légales
          </h4>
          {[
            { to: '/politique', label: 'Politique de confidentialité' },
            { to: '/cgu',       label: 'CGU' },
          ].map(({ to, label }) => (
            <Link key={to} to={to} style={{ display: 'block', padding: '0.2rem 0', fontSize: '0.88rem', color: 'rgba(255,255,255,.6)' }}
              onMouseEnter={e => e.target.style.color = 'white'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,.6)'}>
              {label}
            </Link>
          ))}
        </div>

        {/* Suivez-nous */}
        <div>
          <h4 style={{ color: 'white', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
            Suivez-nous !
          </h4>
          {SOCIAL.map(({ label, href, icon }) => (
            <a key={label} href={href} style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.3rem 0', fontSize: '0.88rem',
              color: 'rgba(255,255,255,.6)', textDecoration: 'none',
            }}
              onMouseEnter={e => { e.currentTarget.style.color = 'white' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,.6)' }}>
              {icon}
              {label}
            </a>
          ))}
        </div>
      </div>

      {/* ── Copyright ── */}
      <div style={{ padding: '0.75rem 4rem 1.5rem', textAlign: 'right', fontSize: '0.82rem', color: 'rgba(255,255,255,.35)' }}>
        © {new Date().getFullYear()} – Thé Tip Top. Tous droits réservés.
      </div>

      <style>{`
        @media (max-width: 768px) {
          footer > div:first-child { padding: 1.5rem !important; gap: 1.5rem !important; }
          footer > div:nth-child(2) { grid-template-columns: 1fr !important; padding: 1rem 1.5rem !important; }
          footer > div:last-child { padding: 0.75rem 1.5rem 1.5rem !important; text-align: center !important; }
        }
      `}</style>
    </footer>
  )
}