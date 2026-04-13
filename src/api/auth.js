import client from './client.js'

// Réponse API : { success, data: { user, token } }
const unpack = (r) => r.data.data ?? r.data

export const authApi = {
  login:           (body) => client.post('auth/login',    body).then(unpack),
  register:        (body) => client.post('auth/register', body).then(unpack),
  logout:          ()     => client.post('auth/logout').then((r) => r.data),
  me:              ()     => client.get('auth/me').then((r) => r.data.data ?? r.data),

  // ── OAuth Google ───────────────────────────────────────────
  // Retourne l'URL de redirection Google (on laisse le backend gérer)
  googleRedirectUrl: () => {
    const base = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/+$/, '')
    return `${base}/api/auth/google`
  },
}