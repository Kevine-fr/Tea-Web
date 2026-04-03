import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import TeaLogo from './TeaLogo.jsx'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, logout, isAdmin, isEmployee } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleLogout() {
    await logout()
    toast.success('À bientôt !')
    navigate('/')
  }

  function getDashboardLink() {
    if (isAdmin)    return '/admin'
    if (isEmployee) return '/employee'
    return '/dashboard'
  }

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(253,248,239,0.97)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid var(--cream-border)',
      boxShadow: '0 2px 12px rgba(26,60,46,.06)',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.9rem 1.5rem' }}>

        {/* ── Brand ─────────────────────────────────────────────────── */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <TeaLogo size={44} />
          <div>
            <div style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.1rem',
              fontStyle: 'italic',
              color: 'var(--green-dark)',
              fontWeight: 700,
              lineHeight: 1,
            }}>
              Thé Tip Top
            </div>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.15em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Maison de thés
            </div>
          </div>
        </Link>

        {/* ── Links desktop ─────────────────────────────────────────── */}
        <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          {[
            { to: '/jeu',   label: 'Jeu-concours' },
            { to: '/gains', label: 'Les lots' },
            { to: '/contact', label: 'Contact' },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                fontWeight: isActive ? 700 : 400,
                color: isActive ? 'var(--green-mid)' : 'var(--text-dark)',
                fontSize: '0.9rem',
                letterSpacing: '0.02em',
                borderBottom: isActive ? '2px solid var(--green-mid)' : '2px solid transparent',
                paddingBottom: '2px',
                transition: 'var(--transition)',
              })}
            >
              {label}
            </NavLink>
          ))}
        </div>

        {/* ── Auth ──────────────────────────────────────────────────── */}
        <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {user ? (
            <>
              <Link
                to={getDashboardLink()}
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--green-dark)',
                  fontWeight: 600,
                  background: 'rgba(45,106,79,.08)',
                  padding: '0.4rem 0.9rem',
                  borderRadius: '6px',
                }}
              >
                👤 Mon espace
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  background: 'none',
                  border: '1.5px solid var(--cream-border)',
                  padding: '0.4rem 0.9rem',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                }}
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ fontSize: '0.9rem', color: 'var(--green-dark)', fontWeight: 500 }}>
                Se connecter
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem' }}>
                Participer →
              </Link>
            </>
          )}
        </div>

        {/* ── Mobile burger ─────────────────────────────────────────── */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: 'var(--green-dark)',
          }}
          className="mobile-burger"
          aria-label="Menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* ── Mobile menu ───────────────────────────────────────────────── */}
      {menuOpen && (
        <div style={{
          background: 'var(--white)',
          borderTop: '1px solid var(--cream-border)',
          padding: '1rem 1.5rem',
        }}>
          {[
            { to: '/',        label: 'Accueil' },
            { to: '/jeu',     label: 'Jeu-concours' },
            { to: '/gains',   label: 'Les lots' },
            { to: '/contact', label: 'Contact' },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              style={{ display: 'block', padding: '0.7rem 0', borderBottom: '1px solid var(--cream-border)', color: 'var(--text-dark)' }}
            >
              {label}
            </Link>
          ))}
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
            {user ? (
              <Link to={getDashboardLink()} className="btn btn-primary" onClick={() => setMenuOpen(false)} style={{ flex: 1, textAlign: 'center' }}>
                Mon espace
              </Link>
            ) : (
              <>
                <Link to="/login"    className="btn btn-outline"  onClick={() => setMenuOpen(false)} style={{ flex: 1 }}>Connexion</Link>
                <Link to="/register" className="btn btn-primary"  onClick={() => setMenuOpen(false)} style={{ flex: 1 }}>Participer</Link>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .mobile-burger { display: block !important; }
        }
      `}</style>
    </nav>
  )
}
