import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import toast from 'react-hot-toast'

/* ─── Styles d'animation ─────────────────────────────────── */
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
  @keyframes logoBreath {
    0%, 100% { transform: scale(1); }
    50%       { transform: scale(1.06); }
  }

  /* ── Barre nav ── */
  .navbar-bar {
    animation: navbarSlideDown .45s cubic-bezier(.22,.68,0,1.1) both;
  }

  /* ── Logo ── */
  .navbar-logo img {
    animation: navLogoIn .5s cubic-bezier(.22,.68,0,1.2) .1s both;
    transition: transform .3s ease;
  }
  .navbar-logo:hover img {
    animation: logoBreath 2s ease-in-out infinite !important;
  }

  /* ── Liens de nav : entrée échelonnée ── */
  .nav-link-item {
    animation: navLinkIn .4s ease both;
  }
  .nav-link-item:nth-child(1) { animation-delay: .08s; }
  .nav-link-item:nth-child(2) { animation-delay: .14s; }
  .nav-link-item:nth-child(3) { animation-delay: .20s; }

  /* ── Hover underline slide sur les liens ── */
  .nav-link-animated {
    position: relative;
  }
  .nav-link-animated::after {
    content: '';
    position: absolute;
    bottom: -2px; left: 0;
    width: 0; height: 2px;
    background: var(--green-dark);
    border-radius: 2px;
    transition: width .22s ease;
  }
  .nav-link-animated:not([data-active="true"]):hover::after {
    width: 100%;
  }

  /* ── Bouton déconnexion hover ── */
  .nav-logout-btn {
    transition: color .2s ease, transform .2s ease;
  }
  .nav-logout-btn:hover {
    color: var(--green-dark) !important;
    transform: translateX(2px);
  }

  /* ── Drawer mobile ── */
  .navbar-drawer {
    animation: drawerSlideDown .3s ease both;
  }

  /* ── Burger ── */
  .burger-btn {
    transition: transform .2s ease;
  }
  .burger-btn:hover {
    transform: scale(1.15);
  }
`

const lnk = ({ isActive }) => ({
  fontFamily: 'var(--font-body)',
  fontSize: '0.92rem',
  fontWeight: isActive ? 700 : 400,
  color: isActive ? 'var(--green-dark)' : 'var(--text-dark)',
  padding: '0.2rem 0',
  borderBottom: isActive ? '2px solid var(--green-dark)' : '2px solid transparent',
  transition: 'var(--tr)',
  whiteSpace: 'nowrap',
})

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const id = '__navbar-styles__'
    if (!document.getElementById(id)) {
      const el = document.createElement('style')
      el.id = id
      el.textContent = STYLES
      document.head.appendChild(el)
    }
  }, [])

  async function handleLogout() {
    await logout()
    toast.success('À bientôt !')
    navigate('/')
    setOpen(false)
  }

  return (
    <nav className="navbar-bar" style={{
      background: 'var(--cream-light)',
      borderBottom: '1px solid var(--cream-border)',
      position: 'sticky', top: 0, zIndex: 200,
      boxShadow: '0 1px 8px rgba(0,0,0,.05)',
    }}>
      <div style={{
        margin: '0 auto', padding: '0 10.5rem',
        height: 68,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>

        {/* ── Left nav links ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15rem', flex: 1 }}>
          {[
            { to: '/',      label: 'Accueil' },
            { to: '/jeu',   label: 'Jeu' },
            { to: '/gains', label: 'Gain' },
          ].map(({ to, label }) => (
            <span key={to} className="nav-link-item hide-mobile">
              <NavLink to={to} style={lnk} className="nav-link-animated">
                {label}
              </NavLink>
            </span>
          ))}
        </div>

        {/* ── Center logo ── */}
        <Link to="/" className="navbar-logo" style={{ flexShrink: 0, margin: '0 1.5rem', display: 'flex', alignItems: 'center' }}>
          <img
            src="/images/Header/img_01.png"
            alt="Thé Tip Top"
            style={{ height: 50, width: 'auto' }}
            onError={e => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'block'
            }}
          />
          <span style={{
            display: 'none',
            fontFamily: 'var(--font-script)',
            fontSize: '1.4rem',
            color: 'var(--green-dark)',
            fontWeight: 700,
          }}>
            Thé Tip Top
          </span>
        </Link>

        {/* ── Right nav links ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15rem', flex: 1, justifyContent: 'flex-end' }}>
          {user ? (
            <>
              {isAdmin
                ? (
                  <span className="nav-link-item hide-mobile">
                    <NavLink to="/admin" style={lnk} className="nav-link-animated">Administration</NavLink>
                  </span>
                )
                : (
                  <>
                    <span className="nav-link-item hide-mobile">
                      <NavLink to="/dashboard" style={lnk} className="nav-link-animated">Mon espace</NavLink>
                    </span>
                    <span className="nav-link-item hide-mobile">
                      <NavLink to="/mes-gains" style={lnk} className="nav-link-animated">Mes gains</NavLink>
                    </span>
                  </>
                )
              }
              <button
                onClick={handleLogout}
                className="nav-logout-btn hide-mobile"
                style={{ fontSize: '0.88rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              {[
                { to: '/login',    label: 'Connexion' },
                { to: '/register', label: 'Inscription' },
                { to: '/contact',  label: 'Contact' },
              ].map(({ to, label }) => (
                <span key={to} className="nav-link-item hide-mobile">
                  <NavLink to={to} style={lnk} className="nav-link-animated">{label}</NavLink>
                </span>
              ))}
            </>
          )}

          {/* Burger */}
          <button onClick={() => setOpen(!open)} aria-label="Menu"
            style={{ display: 'none', fontSize: '1.4rem', color: 'var(--green-dark)', padding: '0.25rem' }}
            className="burger-btn">
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      {open && (
        <div className="navbar-drawer" style={{
          background: '#fff',
          borderTop: '1px solid var(--cream-border)',
          padding: '1rem 1.5rem 1.5rem',
          boxShadow: 'var(--shadow-md)',
        }}>
          {[
            { to: '/',        label: 'Accueil' },
            { to: '/jeu',     label: 'Jeu' },
            { to: '/gains',   label: 'Gain' },
            { to: '/contact', label: 'Contact' },
          ].map(({ to, label }) => (
            <Link key={to} to={to} onClick={() => setOpen(false)}
              style={{ display: 'block', padding: '0.75rem 0', borderBottom: '1px solid var(--cream-border)', fontSize: '0.95rem', fontWeight: 500 }}>
              {label}
            </Link>
          ))}
          {user ? (
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {!isAdmin && <Link to="/dashboard" className="btn btn-green" onClick={() => setOpen(false)} style={{ textAlign: 'center' }}>Mon espace</Link>}
              {isAdmin  && <Link to="/admin"     className="btn btn-green" onClick={() => setOpen(false)} style={{ textAlign: 'center' }}>Administration</Link>}
              <button onClick={handleLogout} className="btn btn-outline" style={{ width: '100%' }}>Déconnexion</button>
            </div>
          ) : (
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
              <Link to="/login"    className="btn btn-outline" onClick={() => setOpen(false)} style={{ flex: 1, textAlign: 'center' }}>Connexion</Link>
              <Link to="/register" className="btn btn-orange"  onClick={() => setOpen(false)} style={{ flex: 1, textAlign: 'center' }}>Inscription</Link>
            </div>
          )}
        </div>
      )}

      <style>{`@media(max-width:768px){.burger-btn{display:block!important}}`}</style>
    </nav>
  )
}