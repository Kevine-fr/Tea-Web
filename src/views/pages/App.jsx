import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext.jsx'
import AppRouter from '../../routes/AppRouter.jsx'
import CookieBanner     from "../components/CookieBanner.jsx"
import PWAInstallButton from "../components/PWAInstallButton.jsx"

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />

        {/* Composants globaux */}
        <CookieBanner />
        <PWAInstallButton />
      </AuthProvider>
    </BrowserRouter>
  )
}