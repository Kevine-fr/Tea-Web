import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import toast from 'react-hot-toast'

const STYLES = `
  /* ── Keyframes d'entrée ── */
  @keyframes navbarSlideDown {
    from { opacity: 0; transform: translateY(-100%); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes navLogoIn {
    from { opacity: 0; transform: scale(.82) translateY(-6px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes navLinkIn {
    from { opacity: 0; transform: translateY(-10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes drawerSlideDown {
    from { opacity: 0; transform: translateY(-12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes dropdownIn {
    from { opacity: 0; transform: translateY(-8px) scale(.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* ── Animations au repos (idle) ── */

  /* Logo : flottement doux */
  @keyframes logoFloat {
    0%, 100% { transform: translateY(0px) scale(1); }
    40%       { transform: translateY(-3px) scale(1.012); }
    70%       { transform: translateY(-1.5px) scale(1.006); }
  }
  /* Logo hover */
  @keyframes logoBreath {
    0%, 100% { transform: scale(1); }
    50%       { transform: scale(1.06); }
  }

  /* Barre de nav : shimmer border-bottom */
  @keyframes navShimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }

  /* Liens nav : micro-bounce subtil */
  @keyframes linkIdle {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-1.5px); }
  }

  /* Bouton user : halo pulsé */
  @keyframes userBtnPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(26,60,46,0); }
    50%       { box-shadow: 0 0 0 5px rgba(26,60,46,0.07); }
  }

  /* Burger : oscillation douce */
  @keyframes burgerWiggle {
    0%, 85%, 100% { transform: rotate(0deg); }
    90%            { transform: rotate(6deg); }
    95%            { transform: rotate(-4deg); }
  }

  /* Chevron : respiration */
  @keyframes chevronBreathe {
    0%, 100% { opacity: 1; }
    50%       { opacity: .45; }
  }

  /* Icône user : rotation lente */
  @keyframes userIconSpin {
    0%   { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Drawer : items ondulation décalée */
  @keyframes drawerItemFloat {
    0%, 100% { transform: translateX(0); }
    50%       { transform: translateX(3px); }
  }

  /* ── Application des idle ── */
  .navbar-bar {
    animation: navbarSlideDown .45s cubic-bezier(.22,.68,0,1.1) both;
  }
  /* Shimmer sur le border-bottom */
  .navbar-bar::after {
    content: '';
    display: block;
    height: 1.5px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(26,60,46,.18) 30%,
      rgba(26,60,46,.38) 50%,
      rgba(26,60,46,.18) 70%,
      transparent 100%
    );
    background-size: 400px 100%;
    animation: navShimmer 4s linear infinite;
  }

  /* Logo flottant au repos */
  .navbar-logo img {
    animation: navLogoIn .5s cubic-bezier(.22,.68,0,1.2) .1s both,
               logoFloat 4.5s ease-in-out 1s infinite;
    transition: transform .3s ease;
  }
  .navbar-logo:hover img {
    animation: logoBreath 2s ease-in-out infinite !important;
  }

  /* Liens : entrée + micro-bounce décalé */
  .nav-link-item { animation: navLinkIn .4s ease both; }
  .nav-link-item:nth-child(1) {
    animation-delay: .08s;
  }
  .nav-link-item:nth-child(2) {
    animation-delay: .14s;
  }
  .nav-link-item:nth-child(3) {
    animation-delay: .20s;
  }

  /* Idle bounce décalé par lien (après l'entrée) */
  .nav-link-item:nth-child(1) .nav-link-animated { animation: linkIdle 5s ease-in-out 1.5s infinite; }
  .nav-link-item:nth-child(2) .nav-link-animated { animation: linkIdle 5s ease-in-out 2.1s infinite; }
  .nav-link-item:nth-child(3) .nav-link-animated { animation: linkIdle 5s ease-in-out 2.7s infinite; }
  /* Arrêt sur hover */
  .nav-link-item .nav-link-animated:hover { animation: none !important; }

  .nav-link-animated { position: relative; display: inline-block; }
  .nav-link-animated::after {
    content: ''; position: absolute;
    bottom: -2px; left: 0; width: 0; height: 2px;
    background: var(--green-dark); border-radius: 2px;
    transition: width .22s ease;
  }
  .nav-link-animated:not([data-active="true"]):hover::after { width: 100%; }

  /* ── Bouton user ── */
  .nav-user-btn {
    display: flex; align-items: center; gap: .45rem;
    padding: .32rem .75rem .32rem .42rem;
    border-radius: var(--radius-pill, 999px);
    border: 1.5px solid var(--cream-border, #e4d9cc);
    background: #fff; cursor: pointer;
    transition: border-color .2s ease, box-shadow .2s ease, background .2s ease;
    font-family: var(--font-body); font-size: .88rem; font-weight: 500;
    color: var(--text-dark, #2a2a2a);
    white-space: nowrap;
    animation: userBtnPulse 3.5s ease-in-out 2s infinite;
  }
  .nav-user-btn:hover, .nav-user-btn.open {
    border-color: var(--green-dark, #1a3c2e);
    box-shadow: 0 2px 12px rgba(26,60,46,.1);
    background: var(--cream, #faf7f2);
    animation: none;
  }

  .nav-user-icon {
    width: 26px; height: 26px; border-radius: 50%;
    background: linear-gradient(135deg, var(--green-dark, #1a3c2e), #3a7c5e);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  /* Rotation lente de l'icône personne au repos */
  .nav-user-icon svg {
    animation: userIconSpin 12s linear infinite;
  }
  .nav-user-btn:hover .nav-user-icon svg,
  .nav-user-btn.open  .nav-user-icon svg {
    animation: none;
  }

  .nav-chevron {
    font-size: .65rem; color: var(--text-muted, #888);
    transition: transform .22s ease;
    animation: chevronBreathe 2.8s ease-in-out 1s infinite;
  }
  .nav-chevron.open {
    transform: rotate(180deg);
    animation: none;
  }

  /* ── Dropdown ── */
  .nav-dropdown {
    position: absolute; top: calc(100% + 8px); right: 0;
    min-width: 220px;
    background: #fff;
    border: 1px solid var(--cream-border, #e4d9cc);
    border-radius: 16px;
    box-shadow: 0 12px 40px rgba(0,0,0,.12);
    overflow: hidden;
    z-index: 500;
    animation: dropdownIn .22s cubic-bezier(.34,1.56,.64,1) both;
  }
  .nav-dd-header {
    padding: .85rem 1.1rem .7rem;
    border-bottom: 1px solid var(--cream-border, #e4d9cc);
    background: var(--cream, #faf7f2);
  }
  .nav-dd-name  { font-size: .88rem; font-weight: 700; color: var(--green-dark, #1a3c2e); margin: 0; }
  .nav-dd-email { font-size: .72rem; color: var(--text-muted, #888); margin: 0; }

  .nav-dd-item {
    display: flex; align-items: center; gap: .75rem;
    padding: .7rem 1.1rem;
    font-size: .88rem; font-weight: 500;
    color: var(--text-dark, #2a2a2a);
    text-decoration: none; cursor: pointer;
    transition: background .18s ease, color .18s ease;
    border: none; background: none; width: 100%; text-align: left;
    font-family: var(--font-body);
  }
  .nav-dd-item:hover { background: var(--cream, #faf7f2); color: var(--green-dark, #1a3c2e); }
  .nav-dd-item.active { color: var(--green-dark, #1a3c2e); font-weight: 700; }

  .nav-dd-icon {
    width: 32px; height: 32px; border-radius: 10px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 15px;
    background: var(--cream, #faf7f2);
    transition: background .18s ease;
  }
  .nav-dd-item:hover .nav-dd-icon { background: #fff; }
  .nav-dd-sep { height: 1px; background: var(--cream-border, #e4d9cc); margin: .3rem 0; }
  .nav-dd-logout { color: #dc2626 !important; }
  .nav-dd-logout .nav-dd-icon { background: #fef2f2; }
  .nav-dd-logout:hover { background: #fef2f2 !important; }

  /* ── Burger ── */
  .burger-btn {
    transition: color .2s ease;
    animation: burgerWiggle 6s ease-in-out 3s infinite;
  }
  .burger-btn:hover {
    animation: none;
    transform: scale(1.15);
  }

  /* ── Drawer mobile : items flottants décalés ── */
  .navbar-drawer { animation: drawerSlideDown .3s ease both; }
  .drawer-link-idle-1 { animation: drawerItemFloat 4s ease-in-out 0.5s infinite; }
  .drawer-link-idle-2 { animation: drawerItemFloat 4s ease-in-out 1.0s infinite; }
  .drawer-link-idle-3 { animation: drawerItemFloat 4s ease-in-out 1.5s infinite; }
  .drawer-link-idle-4 { animation: drawerItemFloat 4s ease-in-out 2.0s infinite; }

  /* ── Responsive ── */
  .hide-mobile { display: flex !important; }
  .burger-btn  { display: none !important; }

  @media (max-width: 1100px) {
    .navbar-inner    { padding: 0 2rem !important; }
    .nav-links-left  { gap: 2rem !important; }
    .nav-links-right { gap: 2rem !important; }
  }

  /* Tablette & mobile : logo centré */
  @media (max-width: 768px) {
    .hide-mobile  { display: none !important; }
    .burger-btn   { display: flex !important; align-items: center; justify-content: center; }
    .navbar-inner { padding: 0 1.25rem !important; position: relative; }

    /* Logo centré absolument */
    .navbar-logo {
      position: absolute !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      margin: 0 !important;
    }
    /* Le burger se positionne à droite grâce au margin-left: auto sur navbar-inner flex */
    .burger-btn { margin-left: auto; }
  }
`

const lnk = ({ isActive }) => ({
  fontFamily: 'var(--font-body)', fontSize: '0.92rem',
  fontWeight: isActive ? 700 : 400,
  color: isActive ? 'var(--green-dark)' : 'var(--text-dark)',
  padding: '0.2rem 0',
  borderBottom: isActive ? '2px solid var(--green-dark)' : '2px solid transparent',
  transition: 'var(--tr)', whiteSpace: 'nowrap',
})

function PersonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4"/>
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>
  )
}

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen]     = useState(false)
  const [ddOpen, setDdOpen] = useState(false)
  const ddRef = useRef(null)

  useEffect(() => {
    const id = '__navbar-styles__'
    if (!document.getElementById(id)) {
      const el = document.createElement('style'); el.id = id; el.textContent = STYLES
      document.head.appendChild(el)
    }
  }, [])

  useEffect(() => {
    function onClickOutside(e) {
      if (ddRef.current && !ddRef.current.contains(e.target)) setDdOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  async function handleLogout() {
    setDdOpen(false); setOpen(false)
    await logout()
    toast.success('À bientôt !')
    navigate('/')
  }

  function ddNav(to) { setDdOpen(false); navigate(to) }

  const userMenuItems = isAdmin
    ? [
        { icon: '🛡️', label: 'Administration', to: '/admin' },
        { icon: '👤', label: 'Mon profil',      to: '/profil' },
      ]
    : [
        { icon: '🏠', label: 'Mon espace',   to: '/dashboard' },
        { icon: '🎁', label: 'Mes gains',     to: '/mes-gains' },
        { icon: '👤', label: 'Mon profil',    to: '/profil' },
      ]

  return (
    <nav className="navbar-bar" style={{
      background: 'var(--cream-light)', borderBottom: '1px solid var(--cream-border)',
      position: 'sticky', top: 0, zIndex: 200, boxShadow: '0 1px 8px rgba(0,0,0,.05)',
    }}>
      <div className="navbar-inner" style={{
        margin: '0 auto', padding: '0 10.5rem', height: 68,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>

        {/* ── Liens gauche ── */}
        <div className="nav-links-left hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '3rem', flex: 1 }}>
          {[
            { to: '/',      label: 'Accueil' },
            { to: '/jeu',   label: 'Jeu' },
            { to: '/gains', label: 'Gain' },
          ].map(({ to, label }) => (
            <span key={to} className="nav-link-item">
              <NavLink to={to} style={lnk} className="nav-link-animated">{label}</NavLink>
            </span>
          ))}
        </div>

        {/* ── Logo centre ── */}
        <Link to="/" className="navbar-logo" style={{ flexShrink: 0, margin: '0 1.5rem', display: 'flex', alignItems: 'center' }}>
          <img src="/images/Header/img_01.png" alt="Thé Tip Top"
            style={{ height: 50, width: 'auto' }}
            onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block' }}
          />
          <span style={{ display: 'none', fontFamily: 'var(--font-script)', fontSize: '1.4rem', color: 'var(--green-dark)', fontWeight: 700 }}>
            Thé Tip Top
          </span>
        </Link>

        {/* ── Liens droite ── */}
        <div className="nav-links-right hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '3rem', flex: 1, justifyContent: 'flex-end' }}>
          {user ? (
            <div ref={ddRef} style={{ position: 'relative' }}>
              <button
                className={`nav-user-btn${ddOpen ? ' open' : ''}`}
                onClick={() => setDdOpen(s => !s)}
                aria-expanded={ddOpen}
                aria-haspopup="true"
              >
                <span className="nav-user-icon"><PersonIcon /></span>
                <span>{user.first_name ?? 'Mon compte'}</span>
                <span className={`nav-chevron${ddOpen ? ' open' : ''}`}>▾</span>
              </button>

              {ddOpen && (
                <div className="nav-dropdown" role="menu">
                  <div className="nav-dd-header">
                    <p className="nav-dd-name">{user.first_name} {user.last_name}</p>
                    <p className="nav-dd-email">{user.email}</p>
                  </div>
                  {userMenuItems.map(item => (
                    <button key={item.to} className="nav-dd-item" role="menuitem" onClick={() => ddNav(item.to)}>
                      <span className="nav-dd-icon">{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                  <div className="nav-dd-sep" />
                  <button className="nav-dd-item nav-dd-logout" role="menuitem" onClick={handleLogout}>
                    <span className="nav-dd-icon">🚪</span>
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              {[
                { to: '/login',    label: 'Connexion' },
                { to: '/register', label: 'Inscription' },
                { to: '/contact',  label: 'Contact' },
              ].map(({ to, label }) => (
                <span key={to} className="nav-link-item">
                  <NavLink to={to} style={lnk} className="nav-link-animated">{label}</NavLink>
                </span>
              ))}
            </>
          )}
        </div>

        {/* ── Burger — frère direct de navbar-inner ── */}
        <button
          onClick={() => setOpen(!open)}
          aria-label="Menu"
          className="burger-btn"
          style={{
            fontSize: '1.4rem', color: 'var(--green-dark)',
            padding: '.25rem', background: 'none',
            border: 'none', cursor: 'pointer',
          }}
        >
          {open ? '✕' : '☰'}
        </button>

      </div>

      {/* ── Drawer mobile ── */}
      {open && (
        <div className="navbar-drawer" style={{
          background: '#fff', borderTop: '1px solid var(--cream-border)',
          padding: '1rem 1.5rem 1.5rem', boxShadow: 'var(--shadow-md)',
        }}>
          {[
            { to: '/',        label: 'Accueil',  cls: 'drawer-link-idle-1' },
            { to: '/jeu',     label: 'Jeu',      cls: 'drawer-link-idle-2' },
            { to: '/gains',   label: 'Gain',     cls: 'drawer-link-idle-3' },
            { to: '/contact', label: 'Contact',  cls: 'drawer-link-idle-4' },
          ].map(({ to, label, cls }) => (
            <Link key={to} to={to} onClick={() => setOpen(false)}
              className={cls}
              style={{ display: 'block', padding: '.75rem 0', borderBottom: '1px solid var(--cream-border)', fontSize: '.95rem', fontWeight: 500, color: 'var(--text-dark)', textDecoration: 'none' }}>
              {label}
            </Link>
          ))}

          {user ? (
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
              <div style={{ padding: '.6rem .9rem', marginBottom: '.2rem', background: 'var(--cream, #faf7f2)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: '.65rem' }}>
                <span style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,var(--green-dark,#1a3c2e),#3a7c5e)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <PersonIcon />
                </span>
                <div>
                  <div style={{ fontSize: '.85rem', fontWeight: 700, color: 'var(--green-dark)' }}>{user.first_name} {user.last_name}</div>
                  <div style={{ fontSize: '.7rem', color: 'var(--text-muted)' }}>{user.email}</div>
                </div>
              </div>

              {userMenuItems.map(item => (
                <Link key={item.to} to={item.to} onClick={() => setOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: '.65rem', padding: '.65rem .9rem', borderRadius: 12, border: '1px solid var(--cream-border)', textDecoration: 'none', color: 'var(--text-dark)', fontSize: '.9rem', fontWeight: 500, background: '#fff' }}>
                  <span style={{ fontSize: 16 }}>{item.icon}</span>
                  {item.label}
                </Link>
              ))}

              <button onClick={handleLogout}
                style={{ display: 'flex', alignItems: 'center', gap: '.65rem', padding: '.65rem .9rem', borderRadius: 12, border: '1px solid #fecaca', background: '#fef2f2', cursor: 'pointer', color: '#dc2626', fontSize: '.9rem', fontWeight: 500, fontFamily: 'var(--font-body)' }}>
                <span style={{ fontSize: 16 }}>🚪</span>
                Déconnexion
              </button>
            </div>
          ) : (
            <div style={{ marginTop: '1rem', display: 'flex', gap: '.75rem' }}>
              <Link to="/login"    className="btn btn-outline" onClick={() => setOpen(false)} style={{ flex: 1, textAlign: 'center' }}>Connexion</Link>
              <Link to="/register" className="btn btn-orange"  onClick={() => setOpen(false)} style={{ flex: 1, textAlign: 'center' }}>Inscription</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}