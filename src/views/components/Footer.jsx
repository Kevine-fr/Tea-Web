// src/views/components/Footer.jsx

import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

/* ─── Bulles blanches ─────────────────────────────────────── */
const BUBBLES = Array.from({ length: 22 }, (_, i) => ({
  id:      i,
  left:    `${3 + (i * 4.4) % 94}%`,
  size:    4 + (i % 7),
  dur:     7 + (i % 8),
  delay:   (i * 0.55) % 10,
  opacity: 0.04 + (i % 5) * 0.018,
}))

/* ─── Sparkles ────────────────────────────────────────────── */
const SPARKS = [
  { left: '7%',  top: '25%', s: 7,  dur: '3.8s', del: '0s'   },
  { left: '93%', top: '18%', s: 5,  dur: '4.5s', del: '1.2s' },
  { left: '15%', top: '70%', s: 8,  dur: '3.6s', del: '0.7s' },
  { left: '85%', top: '65%', s: 6,  dur: '5.0s', del: '2.1s' },
  { left: '50%', top: '10%', s: 5,  dur: '4.2s', del: '1.6s' },
  { left: '30%', top: '85%', s: 6,  dur: '3.4s', del: '2.8s' },
]

const STYLES = `
  /* ══════════════════════════════════
     ENTRÉES
  ══════════════════════════════════ */
  @keyframes footerLogoIn {
    from { opacity:0; transform:translateX(-28px) scale(.95); }
    to   { opacity:1; transform:none; }
  }
  @keyframes footerTaglineIn {
    from { opacity:0; transform:translateX(-16px); }
    to   { opacity:1; transform:none; }
  }
  @keyframes footerColIn {
    from { opacity:0; transform:translateY(22px); }
    to   { opacity:1; transform:none; }
  }
  @keyframes footerCopyIn {
    from { opacity:0; transform:translateY(8px); }
    to   { opacity:1; transform:none; }
  }
  @keyframes underlineGrow {
    from { width:0; opacity:0; }
    to   { width:100%; opacity:1; }
  }

  /* ══════════════════════════════════
     IDLE CONTINUS
  ══════════════════════════════════ */
  @keyframes bubbleRise {
    0%   { transform:translateY(0) translateX(0)     scale(1);    opacity:0; }
    8%   { opacity:1; }
    50%  { transform:translateY(-45vh) translateX(6px)  scale(1.08); }
    92%  { opacity:1; }
    100% { transform:translateY(-90vh) translateX(-4px) scale(0.9); opacity:0; }
  }
  @keyframes sparkle {
    0%,100% { opacity:0; transform:scale(0)   rotate(0deg);   }
    40%      { opacity:1; transform:scale(1)   rotate(180deg); }
    70%      { opacity:.5; transform:scale(.7) rotate(270deg); }
  }
  @keyframes logoBreath {
    0%,100% { transform:translateY(0) scale(1);     filter:brightness(1.15); }
    50%      { transform:translateY(-5px) scale(1.02); filter:brightness(1.25); }
  }
  @keyframes logoFloat {
    0%,100% { transform:translateY(0); }
    50%      { transform:translateY(-5px); }
  }
  @keyframes headingGlow {
    0%,100% { text-shadow:none; color:white; }
    50%      { text-shadow:0 0 14px rgba(255,255,255,.3); color:white; }
  }
  @keyframes socialIconOrbit {
    0%,100% { transform:scale(1) rotate(0deg); }
    25%      { transform:scale(1.1) rotate(-8deg); }
    75%      { transform:scale(1.1) rotate(8deg); }
  }
  @keyframes decoSpin {
    from { transform:rotate(0deg); }
    to   { transform:rotate(360deg); }
  }
  @keyframes decoSpinR {
    from { transform:rotate(0deg); }
    to   { transform:rotate(-360deg); }
  }
  @keyframes shimmerSweep {
    0%   { transform:translateX(-140%) skewX(-14deg); }
    100% { transform:translateX(260%)  skewX(-14deg); }
  }
  @keyframes dividerGrow {
    from { width:0; opacity:0; }
    to   { width:100%; opacity:.15; }
  }

  /* ══════════════════════════════════
     LOGO
  ══════════════════════════════════ */
  .footer-logo {
    animation: footerLogoIn .65s cubic-bezier(.22,.68,0,1.1) both;
    transition: transform .35s ease, filter .35s ease;
    display:block;
  }
  .footer-logo-idle { animation: logoFloat 4s ease-in-out infinite !important; }
  .footer-logo:hover {
    animation: logoBreath 2.6s ease-in-out infinite !important;
  }

  /* Shimmer sur logo au hover */
  .footer-logo-wrap {
    position:relative; display:inline-block;
    overflow:hidden; border-radius:8px;
  }
  .footer-logo-wrap::after {
    content:'';
    position:absolute; inset:0;
    background:linear-gradient(90deg,transparent,rgba(255,255,255,.15),transparent);
    opacity:0; transition:opacity .3s;
    pointer-events:none;
  }
  .footer-logo-wrap:hover::after {
    opacity:1;
    animation:shimmerSweep 1.5s ease-in-out infinite;
  }

  /* ══════════════════════════════════
     TAGLINE
  ══════════════════════════════════ */
  .footer-tagline { animation:footerTaglineIn .6s cubic-bezier(.22,.68,0,1.1) .12s both; }
  .footer-sub     { animation:footerTaglineIn .55s ease .24s both; }

  /* ══════════════════════════════════
     COLONNES
  ══════════════════════════════════ */
  .footer-col { animation:footerColIn .55s cubic-bezier(.22,.68,0,1.1) both; }
  .footer-col:nth-child(1) { animation-delay:.15s; }
  .footer-col:nth-child(2) { animation-delay:.26s; }
  .footer-col:nth-child(3) { animation-delay:.37s; }

  /* Headings colonnes : glow pulsé */
  .footer-col-title {
    color:white; font-size:.85rem; font-weight:700;
    letter-spacing:.06em; margin-bottom:.75rem;
    animation:headingGlow 4s ease-in-out infinite;
  }
  .footer-col:nth-child(2) .footer-col-title { animation-delay:1.3s; }
  .footer-col:nth-child(3) .footer-col-title { animation-delay:2.6s; }

  /* ══════════════════════════════════
     LIENS
  ══════════════════════════════════ */
  .footer-link {
    position:relative; display:block;
    text-decoration:none;
    transition:color .2s ease, transform .2s ease, padding-left .2s ease;
  }
  .footer-link::after {
    content:'';
    position:absolute; bottom:0; left:0;
    width:0; height:1px; background:white;
    transition:width .28s ease;
  }
  .footer-link:hover {
    color:white !important;
    transform:translateX(4px);
    padding-left:2px;
  }
  .footer-link:hover::after { width:100%; }

  /* ══════════════════════════════════
     LIENS SOCIAUX
  ══════════════════════════════════ */
  .footer-social-link {
    text-decoration:none;
    transition:color .2s ease, transform .25s cubic-bezier(.22,.68,0,1.4);
    display:flex; align-items:center; gap:.75rem;
    position:relative;
  }
  .footer-social-link::before {
    content:'';
    position:absolute; left:-8px; top:50%;
    width:4px; height:4px; border-radius:50%;
    background:rgba(255,255,255,.4);
    transform:translateY(-50%) scale(0);
    transition:transform .25s ease, opacity .25s ease;
  }
  .footer-social-link:hover {
    color:white !important;
    transform:translateX(7px);
  }
  .footer-social-link:hover::before { transform:translateY(-50%) scale(1); }

  .footer-social-icon {
    flex-shrink:0;
    transition:transform .3s cubic-bezier(.22,.68,0,1.4);
  }
  .footer-social-link:hover .footer-social-icon {
    animation:socialIconOrbit .6s ease both;
  }

  /* ══════════════════════════════════
     COPYRIGHT
  ══════════════════════════════════ */
  .footer-copy { animation:footerCopyIn .5s ease .45s both; }

  /* ══════════════════════════════════
     BULLES BLANCHES
  ══════════════════════════════════ */
  .footer-bubble {
    position:absolute; border-radius:50%;
    background:rgba(255,255,255,1);
    pointer-events:none; z-index:0;
    animation:bubbleRise linear infinite;
  }

  /* ══════════════════════════════════
     SPARKLES
  ══════════════════════════════════ */
  .footer-spark {
    position:absolute; pointer-events:none; z-index:1;
    animation:sparkle ease-in-out infinite;
  }
  .footer-spark::before, .footer-spark::after {
    content:''; position:absolute;
    background:rgba(255,255,255,.35); border-radius:1px;
  }
  .footer-spark::before { width:2px; height:9px; top:-4px; left:0; }
  .footer-spark::after  { width:9px; height:2px; top:0; left:-4px; }

  /* ══════════════════════════════════
     DÉCO TOURNANTE
  ══════════════════════════════════ */
  .footer-deco {
    position:absolute; border-radius:50%;
    pointer-events:none; z-index:0;
  }

  /* ══════════════════════════════════
     SÉPARATEUR ANIMÉ
  ══════════════════════════════════ */
  .footer-divider {
    height:1px; background:rgba(255,255,255,.15);
    margin:0 4rem;
    animation:dividerGrow .8s ease .4s both;
  }

  /* ══════════════════════════════════
     LAYOUT — identique à l'original
  ══════════════════════════════════ */
  .footer-hero   { display:flex; align-items:center; padding:0 4rem; }
  .footer-grid   { display:grid; grid-template-columns:1fr 1fr 1fr; gap:2rem; padding:0 10rem; }
  .footer-bottom { padding:.75rem 4rem 1.5rem; text-align:right; }

  @media(max-width:1100px) {
    .footer-hero   { padding:1.5rem 2rem 0; flex-direction:column; align-items:center; text-align:center; gap:.75rem; }
    .footer-grid   { padding:0 2rem; gap:1.5rem; text-align:center; }
    .footer-col    { display:flex; flex-direction:column; align-items:center; }
    .footer-social-link { justify-content:center; }
    .footer-bottom { padding:.75rem 2rem 1.5rem; text-align:center; }
    .footer-link::after { left:50%; transform:translateX(-50%); }
    .footer-link:hover  { transform:none; }
    .footer-divider { margin:0 2rem; }
  }
  @media(max-width:768px) {
    .footer-hero { flex-direction:column; align-items:center; padding:1.5rem 1.5rem 0; gap:.75rem; text-align:center; }
    .footer-logo-img { height:140px !important; }
    .footer-grid { grid-template-columns:1fr !important; padding:1rem 1.5rem !important; gap:1.5rem; text-align:center; }
    .footer-col  { display:flex; flex-direction:column; align-items:center; }
    .footer-social-link { justify-content:center; }
    .footer-bottom { padding:.75rem 1.5rem 1.5rem !important; text-align:center !important; }
    .footer-divider { margin:0 1.5rem; }
  }
  @media(max-width:480px) {
    .footer-hero   { padding:1.25rem 1rem 0; }
    .footer-grid   { padding:1rem !important; }
    .footer-bottom { padding:.75rem 1rem 1.5rem !important; }
    .footer-divider { margin:0 1rem; }
  }

  /* Réduit-mouvement */
  @media(prefers-reduced-motion:reduce) {
    .footer-bubble, .footer-spark,
    .footer-logo, .footer-logo-idle,
    .footer-col-title { animation:none !important; }
    .footer-link:hover, .footer-social-link:hover { transform:none !important; }
  }
`

const SOCIAL = [
  {
    label: 'Facebook',
    href:  'https://www.facebook.com/share/1CSNz14N8x/?mibextid=wwXIfr',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href:  'https://www.instagram.com/the.tip.top.nice?igsh=MWZrZjM0ZzdsYnhkag%3D%3D&utm_source=qr',
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
    href:  'https://www.tiktok.com/@the.tip.top.nice',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
      </svg>
    ),
  },
]

export default function Footer() {
  const logoRef = useRef(null)

  /* Injection CSS */
  useEffect(() => {
    const id = '__footer-styles__'
    if (!document.getElementById(id)) {
      const el = document.createElement('style')
      el.id = id; el.textContent = STYLES
      document.head.appendChild(el)
    }
  }, [])

  /* Logo : passage en idle float après l'entrée */
  useEffect(() => {
    const el = logoRef.current
    if (!el) return
    const t = setTimeout(() => {
      el.style.animation = ''
      el.classList.add('footer-logo-idle')
    }, 750)
    return () => clearTimeout(t)
  }, [])

  return (
    <footer style={{ background:'#1a3c2e', color:'rgba(255,255,255,.75)', position:'relative', overflow:'hidden' }}>

      {/* ── Bulles blanches montantes ── */}
      {BUBBLES.map(b => (
        <div key={b.id} className="footer-bubble" style={{
          left:               b.left,
          bottom:             '-10px',
          width:              `${b.size}px`,
          height:             `${b.size}px`,
          opacity:            b.opacity,
          animationDuration:  `${b.dur}s`,
          animationDelay:     `${b.delay}s`,
        }} />
      ))}

      {/* ── Sparkles ── */}
      {SPARKS.map((s, i) => (
        <span key={i} className="footer-spark" style={{
          left:              s.left,
          top:               s.top,
          width:             `${s.s}px`,
          height:            `${s.s}px`,
          animationDuration: s.dur,
          animationDelay:    s.del,
        }} />
      ))}

      {/* ── Cercles déco tournants ── */}
      <div className="footer-deco" style={{
        width:460, height:460, top:-180, right:-130,
        border:'1.5px dashed rgba(255,255,255,.05)',
        animation:'decoSpin 45s linear infinite',
      }} />
      <div className="footer-deco" style={{
        width:280, height:280, bottom:-100, left:-80,
        border:'1.5px dashed rgba(255,255,255,.05)',
        animation:'decoSpinR 34s linear infinite',
      }} />
      <div className="footer-deco" style={{
        width:160, height:160, top:'40%', left:'46%',
        border:'1px dashed rgba(255,255,255,.04)',
        animation:'decoSpin 22s linear infinite',
      }} />

      {/* ── Logo + Tagline ── */}
      <div className="footer-hero" style={{ position:'relative', zIndex:1 }}>
        <Link to="/" className="footer-logo-wrap">
          <img
            ref={logoRef}
            src="/images/Footer/img_01.png"
            alt="Thé Tip Top"
            className="footer-logo footer-logo-img"
            style={{ height:260, width:'auto', flexShrink:0 }}
            onError={e => { e.target.style.display = 'none' }}
          />
        </Link>
        <div>
          <p className="footer-tagline" style={{
            fontFamily:'var(--font-serif)',
            fontWeight:700,
            fontSize:'1.55rem',
            color:'white',
            lineHeight:1.35,
            marginBottom:'0.5rem',
          }}>
            Maison française de thés<br />biologiques et artisanaux.
          </p>
          <p className="footer-sub" style={{ fontSize:'0.9rem', color:'rgba(255,255,255,.55)' }}>
            Créations signatures, infusions bien-être et thés premium.
          </p>
        </div>
      </div>

      {/* ── Séparateur animé ── */}
      <div className="footer-divider" style={{ margin:'1.25rem 4rem' }} />

      {/* ── 3 colonnes ── */}
      <div className="footer-grid" style={{ position:'relative', zIndex:1, paddingTop:'1.5rem', paddingBottom:'1.5rem' }}>

        <div className="footer-col">
          <h4 className="footer-col-title">Jeu-concours</h4>
          {[
            { to:'/jeu',     label:'Présentation du jeu' },
            { to:'/gains',   label:'Lots à gagner' },
            { to:'/contact', label:'Nous Contacter' },
          ].map(({ to, label }) => (
            <Link key={to} to={to}
              className="footer-link"
              style={{ padding:'0.2rem 0', fontSize:'0.88rem', color:'rgba(255,255,255,.6)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'white'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,.6)'}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="footer-col">
          <h4 className="footer-col-title">Informations légales</h4>
          {[
            { to:'/politique', label:'Politique de confidentialité' },
            { to:'/cgu',       label:'CGU' },
          ].map(({ to, label }) => (
            <Link key={to} to={to}
              className="footer-link"
              style={{ padding:'0.2rem 0', fontSize:'0.88rem', color:'rgba(255,255,255,.6)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'white'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,.6)'}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="footer-col">
          <h4 className="footer-col-title">Suivez-nous !</h4>
          {SOCIAL.map(({ label, href, icon }) => (
            <a key={label} href={href}
              className="footer-social-link"
              style={{ padding:'0.3rem 0', fontSize:'0.88rem', color:'rgba(255,255,255,.6)' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'white' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,.6)' }}
            >
              <span className="footer-social-icon">{icon}</span>
              {label}
            </a>
          ))}
        </div>

      </div>

      {/* ── Séparateur bas ── */}
      <div className="footer-divider" />

      {/* ── Copyright ── */}
      <div className="footer-copy footer-bottom" style={{
        position:'relative', zIndex:1,
        fontSize:'0.82rem',
        color:'rgba(255,255,255,.35)',
      }}>
        © {new Date().getFullYear()} – Thé Tip Top. Tous droits réservés.
      </div>

    </footer>
  )
}