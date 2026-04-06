import axios from 'axios'
import toast from 'react-hot-toast'

const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/+$/, '')

const client = axios.create({
  baseURL: `${BASE}/api`,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('ttt_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

client.interceptors.response.use(
  (r) => r,
  (err) => {
    const status = err.response?.status
    if (status === 401) {
      localStorage.removeItem('ttt_token')
      localStorage.removeItem('ttt_user')
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        toast.error('Session expirée, veuillez vous reconnecter.')
        window.location.href = '/login'
      }
    } else if (status === 403) {
      toast.error('Accès refusé.')
    } else if (status === 500) {
      toast.error('Erreur serveur. Réessayez plus tard.')
    } else if (!err.response) {
      toast.error('Impossible de contacter le serveur.')
    }
    return Promise.reject(err)
  }
)

export default client
