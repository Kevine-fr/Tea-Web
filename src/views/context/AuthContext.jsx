import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authApi } from '../../api/auth.js'

const Ctx = createContext(null)

/**
 * Normalise le rôle.
 * L'API retourne maintenant 'role' comme string directe (ex: "admin")
 * et non plus un objet { id, name }.
 * On accepte les deux formats pour rester robuste.
 */
function normalizeRole(raw) {
  if (!raw) return null
  // Si c'est encore un objet { name: '...' } (ancien format) → extraire le name
  if (typeof raw === 'object' && raw !== null) return String(raw.name ?? '').toLowerCase().trim()
  // Sinon c'est déjà une string
  return String(raw).toLowerCase().trim()
}

/** Normalise un objet user reçu de l'API */
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

    // Pré-remplir depuis le cache (affichage rapide)
    const cached = localStorage.getItem('ttt_user')
    if (cached) {
      try { setUser(normalizeUser(JSON.parse(cached))) } catch {}
    }

    // Vérifier avec le serveur pour avoir les données fraîches
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

  /* ── Login ─────────────────────────────────────────────── */
  const login = useCallback(async (creds) => {
    const data = await authApi.login(creds)

    const rawUser  = data?.user  ?? data
    const rawToken = data?.token ?? data?.access_token

    if (!rawToken) throw new Error('Token manquant dans la réponse de connexion')

    localStorage.setItem('ttt_token', rawToken)

    // Appel /me pour garantir que le rôle est bien chargé
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

  // user.role est normalisé en minuscule : "admin" | "employee" | "user" | null
  const isAdmin    = user?.role === 'admin'
  const isEmployee = user?.role === 'employee' || user?.role === 'admin'
  const isUser     = !!user

  return (
    <Ctx.Provider value={{ user, loading, login, register, logout, isAdmin, isEmployee, isUser }}>
      {children}
    </Ctx.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}