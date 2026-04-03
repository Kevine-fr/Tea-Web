import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authApi } from '../../api/auth.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]         = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // ─── Hydrate from localStorage on mount ──────────────────────────────────
  useEffect(() => {
    const token    = localStorage.getItem('auth_token')
    const cached   = localStorage.getItem('auth_user')

    if (!token) {
      setIsLoading(false)
      return
    }

    // Use cached user immediately (fast), then verify with server
    if (cached) {
      try { setUser(JSON.parse(cached)) } catch { /* ignore */ }
    }

    authApi.me()
      .then((data) => {
        const u = data.data ?? data
        setUser(u)
        localStorage.setItem('auth_user', JSON.stringify(u))
      })
      .catch(() => {
        // Token invalid — clean up
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
        setUser(null)
      })
      .finally(() => setIsLoading(false))
  }, [])

  // ─── Login ────────────────────────────────────────────────────────────────
  const login = useCallback(async (credentials) => {
    const data = await authApi.login(credentials)
    const token = data.token ?? data.access_token ?? data.data?.token
    const u     = data.user  ?? data.data?.user ?? data.data

    if (!token) throw new Error('Token manquant dans la réponse')

    localStorage.setItem('auth_token', token)
    localStorage.setItem('auth_user', JSON.stringify(u))
    setUser(u)
    return u
  }, [])

  // ─── Register ─────────────────────────────────────────────────────────────
  const register = useCallback(async (formData) => {
    const data  = await authApi.register(formData)
    const token = data.token ?? data.access_token ?? data.data?.token
    const u     = data.user  ?? data.data?.user ?? data.data

    if (token) {
      localStorage.setItem('auth_token', token)
      localStorage.setItem('auth_user', JSON.stringify(u))
      setUser(u)
    }
    return data
  }, [])

  // ─── Logout ───────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try { await authApi.logout() } catch { /* ignore */ }
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    setUser(null)
  }, [])

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const isAdmin    = user?.role?.name === 'admin'
  const isEmployee = user?.role?.name === 'employee'
  const isUser     = user?.role?.name === 'user'

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, isAdmin, isEmployee, isUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
