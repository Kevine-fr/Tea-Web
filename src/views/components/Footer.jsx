// src/views/components/Footer.jsx

import { useEffect } from 'react'
import { Link } from 'react-router-dom'

const STYLES = `
  @keyframes footerLogoIn {
    from { opacity: 0; transform: translateX(-24px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes footerTaglineIn {
    from { opacity: 0; transform: translateX(-16px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes footerColIn {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes footerCopyIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes logoBreath {
    0%, 100% { transform: scale(1); }
    50%       { transform: scale(1.025); }
  }

  .footer-logo {
    animation: footerLogoIn .6s ease both;
    transition: transform .3s ease;
  }
  .footer-logo:hover {
    animation: logoBreath 2.8s ease-in-out infinite !important;
  }
  .footer-tagline {
    animation: footerTaglineIn .55s ease .12s both;
  }
  .footer-sub {
    animation: footerTaglineIn .5s ease .22s both;
  }
  .footer-col {
    animation: footerColIn .55s ease both;
  }
  .footer-col:nth-child(1) { animation-delay: .15s; }
  .footer-col:nth-child(2) { animation-delay: .25s; }
  .footer-col:nth-child(3) { animation-delay: .35s; }

  .footer-link {
    position: relative;
    display: block;
    text-decoration: none;
    transition: color .2s ease;
  }
  .footer-link::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0;
    width: 0; height: 1px;
    background: white;
    transition: width .25s ease;
  }
  .footer-link:hover::after { width: 100%; }

  .footer-social-link {
    text-decoration: none;
    transition: color .2s ease, transform .25s ease;
    display: flex; align-items: center; gap: .75rem;
  }
  .footer-social-link:hover {
    color: white !important;
    transform: translateX(5px);
  }
  .footer-social-icon {
    transition: transform .25s ease;
    flex-shrink: 0;
  }
  .footer-social-link:hover .footer-social-icon {
    transform: scale(1.2);
  }
  .footer-copy {
    animation: footerCopyIn .5s ease .45s both;
  }

  /* ── Responsive ── */
  .footer-hero   { display: flex; align-items: center; padding: 0 4rem; }
  .footer-grid   { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 2rem; padding: 0 10rem; }
  .footer-bottom { padding: 0.75rem 4rem 1.5rem; text-align: right; }

  /* Tablette */
  @media (max-width: 1100px) {
    .footer-hero  { padding: 0 2rem; }
    .footer-grid  { padding: 0 2rem; gap: 1.5rem; }
    .footer-bottom { padding: 0.75rem 2rem 1.5rem; }
  }

  /* Mobile */
  @media (max-width: 768px) {
    .footer-hero {
      flex-direction: column;
      align-items: flex-start;
      padding: 1.5rem 1.5rem 0;
      gap: 0.75rem;
    }
    .footer-logo-img {
      height: 140px !important;
    }
    .footer-grid {
      grid-template-columns: 1fr !important;
      padding: 1rem 1.5rem !important;
      gap: 1.5rem;
    }
    .footer-bottom {
      padding: 0.75rem 1.5rem 1.5rem !important;
      text-align: center !important;
    }
  }

  /* Petit mobile */
  @media (max-width: 480px) {
    .footer-hero { padding: 1.25rem 1rem 0; }
    .footer-grid { padding: 1rem !important; }
    .footer-bottom { padding: 0.75rem 1rem 1.5rem !important; }
  }
`

const SOCIAL = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/share/1CSNz14N8x/?mibextid=wwXIfr',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/the.tip.top.nice?igsh=MWZrZjM0ZzdsYnhkag%3D%3D&utm_source=qr',
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
    href: 'https://www.tiktok.com/@the.tip.top.nice',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
      </svg>
    ),
  },
]

export default function Footer() {
  useEffect(() => {
    const id = '__footer-styles__'
    if (!document.getElementById(id)) {
      const el = document.createElement('style')
      el.id = id
      el.textContent = STYLES
      document.head.appendChild(el)
    }
  }, [])

  return (
    <footer style={{ background: '#1a3c2e', color: 'rgba(255,255,255,.75)' }}>

      {/* ── Logo + Tagline ── */}
      <div className="footer-hero">
        <Link to="/">
          <img
            src="/images/Footer/img_01.png"
            alt="Thé Tip Top"
            className="footer-logo footer-logo-img"
            style={{ height: 260, width: 'auto', flexShrink: 0 }}
            onError={e => { e.target.style.display = 'none' }}
          />
        </Link>
        <div>
          <p className="footer-tagline" style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 700,
            fontSize: '1.55rem',
            color: 'white',
            lineHeight: 1.35,
            marginBottom: '0.5rem',
          }}>
            Maison française de thés<br />biologiques et artisanaux.
          </p>
          <p className="footer-sub" style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,.55)' }}>
            Créations signatures, infusions bien-être et thés premium.
          </p>
        </div>
      </div>

      {/* ── 3 colonnes ── */}
      <div className="footer-grid">
        <div className="footer-col">
          <h4 style={{ color: 'white', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
            Jeu-concours
          </h4>
          {[
            { to: '/jeu',     label: 'Présentation du jeu' },
            { to: '/gains',   label: 'Lots à gagner' },
            { to: '/contact', label: 'Nous Contacter' },
          ].map(({ to, label }) => (
            <Link key={to} to={to}
              className="footer-link"
              style={{ padding: '0.2rem 0', fontSize: '0.88rem', color: 'rgba(255,255,255,.6)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'white'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,.6)'}>
              {label}
            </Link>
          ))}
        </div>

        <div className="footer-col">
          <h4 style={{ color: 'white', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
            Informations légales
          </h4>
          {[
            { to: '/politique', label: 'Politique de confidentialité' },
            { to: '/cgu',       label: 'CGU' },
          ].map(({ to, label }) => (
            <Link key={to} to={to}
              className="footer-link"
              style={{ padding: '0.2rem 0', fontSize: '0.88rem', color: 'rgba(255,255,255,.6)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'white'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,.6)'}>
              {label}
            </Link>
          ))}
        </div>

        <div className="footer-col">
          <h4 style={{ color: 'white', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
            Suivez-nous !
          </h4>
          {SOCIAL.map(({ label, href, icon }) => (
            <a key={label} href={href}
              className="footer-social-link"
              style={{ padding: '0.3rem 0', fontSize: '0.88rem', color: 'rgba(255,255,255,.6)' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'white' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,.6)' }}>
              <span className="footer-social-icon">{icon}</span>
              {label}
            </a>
          ))}
        </div>
      </div>

      {/* ── Copyright ── */}
      <div className="footer-copy footer-bottom" style={{
        fontSize: '0.82rem',
        color: 'rgba(255,255,255,.35)',
      }}>
        © {new Date().getFullYear()} – Thé Tip Top. Tous droits réservés.
      </div>
    </footer>
  )
}