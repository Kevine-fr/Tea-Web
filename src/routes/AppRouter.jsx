import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../views/context/AuthContext.jsx'
import { PrivateRoute, RoleRoute } from './PrivateRoute.jsx'

// Pages publiques
import HomePage       from '../views/pages/HomePage.jsx'
import JeuPage        from '../views/pages/JeuPage.jsx'
import GainPage       from '../views/pages/GainPage.jsx'
import ContactPage    from '../views/pages/ContactPage.jsx'
import LoginPage      from '../views/pages/LoginPage.jsx'
import RegisterPage   from '../views/pages/RegisterPage.jsx'
import PolitiquePage  from '../views/pages/PolitiquePage.jsx'
import CguPage        from '../views/pages/CguPage.jsx'
import CgvPage        from '../views/pages/CgvPage.jsx'
import NotFoundPage   from '../views/pages/NotFoundPage.jsx'

// Pages authentifiées
import DashboardPage  from '../views/pages/DashboardPage.jsx'
import AdminPage      from '../views/pages/AdminPage.jsx'
import EmployeePage   from '../views/pages/EmployeePage.jsx'

export default function AppRouter() {
  const { user } = useAuth()

  return (
    <Routes>
      {/* ── Publiques ───────────────────────────────────────────────── */}
      <Route path="/"          element={<HomePage />} />
      <Route path="/jeu"       element={<JeuPage />} />
      <Route path="/gains"     element={<GainPage />} />
      <Route path="/contact"   element={<ContactPage />} />
      <Route path="/politique" element={<PolitiquePage />} />
      <Route path="/cgu"       element={<CguPage />} />
      <Route path="/cgv"       element={<CgvPage />} />

      {/* ── Auth (redirige si déjà connecté) ────────────────────────── */}
      <Route path="/login"    element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />

      {/* ── Tableau de bord utilisateur ──────────────────────────────── */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />

      {/* ── Admin ────────────────────────────────────────────────────── */}
      <Route
        path="/admin"
        element={
          <RoleRoute roles={['admin']}>
            <AdminPage />
          </RoleRoute>
        }
      />

      {/* ── Employé ──────────────────────────────────────────────────── */}
      <Route
        path="/employee"
        element={
          <RoleRoute roles={['employee', 'admin']}>
            <EmployeePage />
          </RoleRoute>
        }
      />

      {/* ── 404 ─────────────────────────────────────────────────────── */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
