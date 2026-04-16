// src/views/pages/AuthCallbackPage.jsx
// Page intermédiaire appelée après la redirection Google
// URL : /auth/callback?token=xxx  ou  /auth/callback?error=xxx

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function AuthCallbackPage() {
  const navigate            = useNavigate()
  const { loginWithToken }  = useAuth()
  const [errMsg, setErrMsg] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token  = params.get('token')
    const error  = params.get('error')

    if (token) {
      loginWithToken(token)
        .then((user) => {
          // Redirige selon le rôle
          const role = user?.role
          if (role === 'admin' || role === 'employee') {
            navigate('/admin', { replace: true })
          } else {
            navigate('/dashboard', { replace: true })
          }
        })
        .catch(() => {
          setErrMsg('Impossible de finaliser la connexion. Veuillez réessayer.')
          setTimeout(() => navigate('/login', { replace: true }), 3000)
        })
    } else {
      setErrMsg(error ?? 'Connexion annulée.')
      setTimeout(() => navigate('/login', { replace: true }), 3000)
    }
  }, [])

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center',
      height: '100vh', gap: '1rem',
      fontFamily: "'Lato', sans-serif",
      background: 'var(--cream, #f5f0e8)',
    }}>
      {errMsg ? (
        <>
          <div style={{ fontSize: '2rem' }}>⚠️</div>
          <p style={{ color: '#c0392b', fontWeight: 700, maxWidth: 340, textAlign: 'center' }}>
            {errMsg}
          </p>
          <p style={{ fontSize: '.82rem', color: '#888' }}>Redirection vers la connexion…</p>
        </>
      ) : (
        <>
          {/* Spinner */}
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            border: '3px solid rgba(26,60,46,.15)',
            borderTopColor: '#1a3c2e',
            animation: 'spin .7s linear infinite',
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: '#1a3c2e', fontWeight: 700 }}>Connexion en cours…</p>
          <p style={{ fontSize: '.82rem', color: '#888' }}>Finalisation de l'authentification Google</p>
        </>
      )}
    </div>
  )
}