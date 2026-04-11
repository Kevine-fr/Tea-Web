import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import toast from 'react-hot-toast'

const STYLES = `
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
  @keyframes logoBreath {
    0%, 100% { transform: scale(1); }
    50%       { transform: scale(1.06); }
  }

  .navbar-bar { animation: navbarSlideDown .45s cubic-bezier(.22,.68,0,1.1) both; }

  .navbar-logo img {
    animation: navLogoIn .5s cubic-bezier(.22,.68,0,1.2) .1s both;
    transition: transform .3s ease;
  }
  .navbar-logo:hover img { animation: logoBreath 2s ease-in-out infinite !important; }

  .nav-link-item { animation: navLinkIn .4s ease both; }
  .nav-link-item:nth-child(1) { animation-delay: .08s; }
  .nav-link-item:nth-child(2) { animation-delay: .14s; }
  .nav-link-item:nth-child(3) { animation-delay: .20s; }

  .nav-link-animated { position: relative; }
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
  }
  .nav-user-btn:hover, .nav-user-btn.open {
    border-color: var(--green-dark, #1a3c2e);
    box-shadow: 0 2px 12px rgba(26,60,46,.1);
    background: var(--cream, #faf7f2);
  }
  .nav-user-icon {
    width: 26px; height: 26px; border-radius: 50%;
    background: linear-gradient(135deg, var(--green-dark, #1a3c2e), #3a7c5e);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .nav-chevron {
    font-size: .65rem; color: var(--text-muted, #888);
    transition: transform .22s ease;
  }
  .nav-chevron.open { transform: rotate(180deg); }

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

  /* ── Reste ── */
  .nav-logout-btn { transition: color .2s ease, transform .2s ease; }
  .nav-logout-btn:hover { color: var(--green-dark) !important; transform: translateX(2px); }
  .navbar-drawer { animation: drawerSlideDown .3s ease both; }
  .burger-btn    { transition: transform .2s ease; }
  .burger-btn:hover { transform: scale(1.15); }

  .hide-mobile { display: flex !important; }
  .burger-btn  { display: none !important; }

  @media (max-width: 1100px) {
    .navbar-inner    { padding: 0 2rem !important; }
    .nav-links-left  { gap: 2rem !important; }
    .nav-links-right { gap: 2rem !important; }
  }
  @media (max-width: 768px) {
    .hide-mobile  { display: none !important; }
    .burger-btn   { display: block !important; }
    .navbar-inner { padding: 0 1.25rem !important; }
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

/* Icône personne SVG */
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
  const [open, setOpen]       = useState(false)   // drawer mobile
  const [ddOpen, setDdOpen]   = useState(false)   // dropdown desktop
  const ddRef = useRef(null)

  useEffect(() => {
    const id = '__navbar-styles__'
    if (!document.getElementById(id)) {
      const el = document.createElement('style'); el.id = id; el.textContent = STYLES
      document.head.appendChild(el)
    }
  }, [])

  // Fermer le dropdown au clic extérieur
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

  // Liens du dropdown selon le rôle
  const userMenuItems = isAdmin
    ? [
        { icon: '🛡️', label: 'Administration', to: '/admin' },
        { icon: '👤', label: 'Mon profil',      to: '/profil' },
      ]
    : [
        { icon: '🏠', label: 'Mon espace',      to: '/dashboard' },
        { icon: '🎁', label: 'Mes gains',        to: '/mes-gains' },
        { icon: '👤', label: 'Mon profil',       to: '/profil' },
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
            <>
              {/* Bouton user + dropdown */}
              <div ref={ddRef} style={{ position: 'relative' }}>
                <button
                  className={`nav-user-btn${ddOpen ? ' open' : ''}`}
                  onClick={() => setDdOpen(s => !s)}
                  aria-expanded={ddOpen}
                  aria-haspopup="true"
                >
                  <span className="nav-user-icon">
                    <PersonIcon />
                  </span>
                  <span>{user.first_name ?? 'Mon compte'}</span>
                  <span className={`nav-chevron${ddOpen ? ' open' : ''}`}>▾</span>
                </button>

                {/* Dropdown */}
                {ddOpen && (
                  <div className="nav-dropdown" role="menu">
                    {/* En-tête */}
                    <div className="nav-dd-header">
                      <p className="nav-dd-name">{user.first_name} {user.last_name}</p>
                      <p className="nav-dd-email">{user.email}</p>
                    </div>

                    {/* Liens */}
                    {userMenuItems.map(item => (
                      <button key={item.to} className="nav-dd-item" role="menuitem"
                        onClick={() => ddNav(item.to)}>
                        <span className="nav-dd-icon">{item.icon}</span>
                        {item.label}
                      </button>
                    ))}

                    <div className="nav-dd-sep" />

                    {/* Déconnexion */}
                    <button className="nav-dd-item nav-dd-logout" role="menuitem" onClick={handleLogout}>
                      <span className="nav-dd-icon">🚪</span>
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            </>
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

          {/* Burger */}
          <button onClick={() => setOpen(!open)} aria-label="Menu" className="burger-btn"
            style={{ fontSize: '1.4rem', color: 'var(--green-dark)', padding: '.25rem', background: 'none', border: 'none', cursor: 'pointer' }}>
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* ── Drawer mobile ── */}
      {open && (
        <div className="navbar-drawer" style={{
          background: '#fff', borderTop: '1px solid var(--cream-border)',
          padding: '1rem 1.5rem 1.5rem', boxShadow: 'var(--shadow-md)',
        }}>
          {[
            { to: '/',        label: 'Accueil' },
            { to: '/jeu',     label: 'Jeu' },
            { to: '/gains',   label: 'Gain' },
            { to: '/contact', label: 'Contact' },
          ].map(({ to, label }) => (
            <Link key={to} to={to} onClick={() => setOpen(false)}
              style={{ display: 'block', padding: '.75rem 0', borderBottom: '1px solid var(--cream-border)', fontSize: '.95rem', fontWeight: 500, color: 'var(--text-dark)', textDecoration: 'none' }}>
              {label}
            </Link>
          ))}

          {user ? (
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
              {/* En-tête profil */}
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