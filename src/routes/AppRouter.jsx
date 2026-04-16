import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../views/context/AuthContext.jsx'
import { PrivateRoute, RoleRoute } from './PrivateRoute.jsx'

import HomePage      from '../views/pages/HomePage.jsx'
import JeuPage       from '../views/pages/JeuPage.jsx'
import GainPage      from '../views/pages/GainPage.jsx'
import ContactPage   from '../views/pages/ContactPage.jsx'
import LoginPage     from '../views/pages/LoginPage.jsx'
import RegisterPage  from '../views/pages/RegisterPage.jsx'
import PolitiquePage from '../views/pages/PolitiquePage.jsx'
import CguPage       from '../views/pages/CguPage.jsx'
import NotFoundPage  from '../views/pages/NotFoundPage.jsx'
import DashboardPage from '../views/pages/DashboardPage.jsx'
import GainsPage     from '../views/pages/GainsPage.jsx'
import ProfilePage   from '../views/pages/ProfilePage.jsx'
import AdminPage     from '../views/pages/AdminPage.jsx'
import AuthCallbackPage from '../views/pages/AuthCallbackPage.jsx'

export default function AppRouter() {
  const { user } = useAuth()

  // Si déjà connecté → ne pas afficher login/register
  function guestOnly(page) {
    if (!user) return page
    // Admin et employee → /admin
    if (user.role === 'admin' || user.role === 'employee') return <Navigate to="/admin" replace />
    return <Navigate to="/dashboard" replace />
  }

  return (
    <Routes>
      {/* ── Publiques ──────────────────────────────────── */}
      <Route path="/"          element={<HomePage />} />
      <Route path="/jeu"       element={<JeuPage />} />
      <Route path="/gains"     element={<GainPage />} />
      <Route path="/contact"   element={<ContactPage />} />
      <Route path="/politique" element={<PolitiquePage />} />
      <Route path="/cgu"       element={<CguPage />} />

      {/* ── Auth (invités seulement) ───────────────────── */}
      <Route path="/login"    element={guestOnly(<LoginPage />)} />
      <Route path="/register" element={guestOnly(<RegisterPage />)} />

      {/* ── Espace utilisateur ────────────────────────── */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            {/* Si admin/employee arrive sur /dashboard → redirige vers /admin */}
            {user?.role === 'admin' || user?.role === 'employee'
              ? <Navigate to="/admin" replace />
              : <DashboardPage />
            }
          </PrivateRoute>
        }
      />
      <Route path="/mes-gains" element={<PrivateRoute><GainsPage /></PrivateRoute>} />
      <Route path="/profil"    element={<PrivateRoute><ProfilePage /></PrivateRoute>} />

      {/* ── Admin / Employé ────────────────────────────── */}
      <Route
        path="/admin"
        element={
          <RoleRoute roles={['admin', 'employee']}>
            <AdminPage />
          </RoleRoute>
        }
      />

      <Route path="/auth/callback" element={<AuthCallbackPage />} />

      {/* ── 404 ────────────────────────────────────────── */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
