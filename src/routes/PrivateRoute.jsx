import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../views/context/AuthContext.jsx'

function Spinner() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--cream)',
    }}>
      <div className="spinner" />
    </div>
  )
}

/**
 * Protège une route — redirige vers /login si non connecté
 */
export function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  const loc = useLocation()

  if (loading) return <Spinner />
  if (!user)   return <Navigate to="/login" state={{ from: loc }} replace />
  return children
}

/**
 * Protège une route — redirige si le rôle n'est pas dans la liste autorisée
 * @param {{ roles: string[], children: React.ReactNode }} props
 */
export function RoleRoute({ roles, children }) {
  const { user, loading } = useAuth()
  const loc = useLocation()

  if (loading) return <Spinner />
  if (!user)   return <Navigate to="/login" state={{ from: loc }} replace />

  // Comparaison insensible à la casse
  const userRole = (user.role || '').toLowerCase()
  const allowed  = roles.map(r => r.toLowerCase())

  if (!allowed.includes(userRole)) {
    // Redirige vers le bon espace selon le rôle
    return <Navigate to="/dashboard" replace />
  }

  return children
}
