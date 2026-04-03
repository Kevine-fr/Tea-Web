import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../views/context/AuthContext.jsx'
import LoadingSpinner from '../views/components/LoadingSpinner.jsx'

/**
 * Protège une route — redirige vers /login si non connecté
 */
export function PrivateRoute({ children }) {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return <LoadingSpinner fullPage />
  if (!user)     return <Navigate to="/login" state={{ from: location }} replace />
  return children
}

/**
 * Protège une route — redirige si le rôle ne correspond pas
 * @param {{ roles: string[], children: React.ReactNode }} props
 */
export function RoleRoute({ roles, children }) {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return <LoadingSpinner fullPage />
  if (!user)     return <Navigate to="/login" state={{ from: location }} replace />

  if (!roles.includes(user.role?.name)) {
    return <Navigate to="/dashboard" replace />
  }
  return children
}
