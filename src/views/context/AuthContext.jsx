import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authApi } from '../../api/auth.js'

const Ctx = createContext(null)

function normalizeRole(raw) {
  if (!raw) return null
  if (typeof raw === 'object' && raw !== null) return String(raw.name ?? '').toLowerCase().trim()
  return String(raw).toLowerCase().trim()
}

function normalizeUser(u) {
  if (!u) return null
  return { ...u, role: normalizeRole(u.role) }
}

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  /* ── Hydratation au montage ────────────────────────────── */
  useEffect(() => {
    const token = localStorage.getItem('ttt_token')
    if (!token) { setLoading(false); return }

    const cached = localStorage.getItem('ttt_user')
    if (cached) {
      try { setUser(normalizeUser(JSON.parse(cached))) } catch {}
    }

    authApi.me()
      .then((u) => {
        const normalized = normalizeUser(u)
        setUser(normalized)
        localStorage.setItem('ttt_user', JSON.stringify(normalized))
      })
      .catch(() => {
        localStorage.removeItem('ttt_token')
        localStorage.removeItem('ttt_user')
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  /* ── Login email/password ──────────────────────────────── */
  const login = useCallback(async (creds) => {
    const data     = await authApi.login(creds)
    const rawUser  = data?.user  ?? data
    const rawToken = data?.token ?? data?.access_token

    if (!rawToken) throw new Error('Token manquant dans la réponse de connexion')

    localStorage.setItem('ttt_token', rawToken)

    let normalized
    try {
      const fresh = await authApi.me()
      normalized  = normalizeUser(fresh)
    } catch {
      normalized = normalizeUser(rawUser)
    }

    localStorage.setItem('ttt_user', JSON.stringify(normalized))
    setUser(normalized)
    return normalized
  }, [])

  /* ── Login via token OAuth (callback Google) ───────────── */
  const loginWithToken = useCallback(async (token) => {
    localStorage.setItem('ttt_token', token)
    try {
      const fresh      = await authApi.me()
      const normalized = normalizeUser(fresh)
      localStorage.setItem('ttt_user', JSON.stringify(normalized))
      setUser(normalized)
      return normalized
    } catch {
      localStorage.removeItem('ttt_token')
      throw new Error('Impossible de récupérer le profil utilisateur.')
    }
  }, [])

  /* ── Register ──────────────────────────────────────────── */
  const register = useCallback(async (body) => {
    const data     = await authApi.register(body)
    const rawUser  = data?.user  ?? data
    const rawToken = data?.token ?? data?.access_token

    if (rawToken) {
      localStorage.setItem('ttt_token', rawToken)
      const normalized = normalizeUser(rawUser)
      localStorage.setItem('ttt_user', JSON.stringify(normalized))
      setUser(normalized)
    }
    return normalizeUser(rawUser)
  }, [])

  /* ── Logout ────────────────────────────────────────────── */
  const logout = useCallback(async () => {
    try { await authApi.logout() } catch {}
    localStorage.removeItem('ttt_token')
    localStorage.removeItem('ttt_user')
    setUser(null)
  }, [])

  const isAdmin    = user?.role === 'admin'
  const isEmployee = user?.role === 'employee' || user?.role === 'admin'
  const isUser     = !!user

  return (
    <Ctx.Provider value={{ user, loading, login, loginWithToken, register, logout, isAdmin, isEmployee, isUser }}>
      {children}
    </Ctx.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}