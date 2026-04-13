// Reçoit ?token=xxx ou ?error=xxx après redirection Google
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function AuthCallbackPage() {
  const navigate = useNavigate()
  const { loginWithToken } = useAuth()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token  = params.get('token')
    const error  = params.get('error')

    if (token) {
      loginWithToken(token)   // stocke le token + charge l'utilisateur
      navigate('/', { replace: true })
    } else {
      navigate(`/login?error=${encodeURIComponent(error ?? 'Erreur inconnue')}`, { replace: true })
    }
  }, [])

  return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh' }}>
      <p style={{ fontFamily:'Lato,sans-serif', color:'#888' }}>Connexion en cours…</p>
    </div>
  )
}