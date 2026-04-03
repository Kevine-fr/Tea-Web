import axios from 'axios'
import toast from 'react-hot-toast'

// Strip trailing slashes to prevent double-slash URLs
const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/+$/, '')

const client = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
  withCredentials: false,
})

// ─── Request interceptor — inject token ──────────────────────────────────────
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ─── Response interceptor — handle errors globally ───────────────────────────
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const status  = error.response?.status
    const message = error.response?.data?.message || error.response?.data?.error

    if (status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      // Redirect to login only if not already there
      if (!window.location.pathname.includes('/login')) {
        toast.error('Session expirée, veuillez vous reconnecter.')
        window.location.href = '/login'
      }
    } else if (status === 403) {
      toast.error('Accès refusé.')
    } else if (status === 422) {
      // Validation errors — handled per-form, don't toast globally
    } else if (status === 500) {
      toast.error('Erreur serveur. Réessayez plus tard.')
    } else if (!error.response) {
      toast.error('Impossible de contacter le serveur.')
    }

    return Promise.reject(error)
  }
)

export default client
