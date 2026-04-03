import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import toast from 'react-hot-toast'

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

  async function handleLogout() {
    await logout()
    toast.success('À bientôt !')
    navigate('/')
    setOpen(false)
  }

  return (
    <nav style={{
      background: 'var(--cream-light)',
      borderBottom: '1px solid var(--cream-border)',
      position: 'sticky', top: 0, zIndex: 200,
      boxShadow: '0 1px 8px rgba(0,0,0,.05)',
    }}>
      <div style={{
        maxWidth: 1180, margin: '0 auto', padding: '0 1.5rem',
        height: 68,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* ── Left nav links ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', flex: 1 }}>
          <NavLink to="/"      style={lnk} className="hide-mobile">Accueil</NavLink>
          <NavLink to="/jeu"   style={lnk} className="hide-mobile">Jeu</NavLink>
          <NavLink to="/gains" style={lnk} className="hide-mobile">Gain</NavLink>
        </div>

        {/* ── Center logo ── */}
        <Link to="/" style={{ flexShrink: 0, margin: '0 1.5rem', display: 'flex', alignItems: 'center' }}>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flex: 1, justifyContent: 'flex-end' }}>
          {user ? (
            <>
              {isAdmin
                ? <NavLink to="/admin"     style={lnk} className="hide-mobile">Administration</NavLink>
                : <>
                    <NavLink to="/dashboard" style={lnk} className="hide-mobile">Mon espace</NavLink>
                    <NavLink to="/mes-gains" style={lnk} className="hide-mobile">Mes gains</NavLink>
                  </>
              }
              <button onClick={handleLogout} className="hide-mobile"
                style={{ fontSize: '0.88rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login"    style={lnk} className="hide-mobile">Connexion</NavLink>
              <NavLink to="/register" style={lnk} className="hide-mobile">Inscription</NavLink>
              <NavLink to="/contact"  style={lnk} className="hide-mobile">Contact</NavLink>
            </>
          )}

          {/* Mobile burger */}
          <button onClick={() => setOpen(!open)} aria-label="Menu"
            style={{ display: 'none', fontSize: '1.4rem', color: 'var(--green-dark)', padding: '0.25rem' }}
            className="burger-btn">
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      {open && (
        <div style={{
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
