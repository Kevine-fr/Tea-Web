import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockClient = {
  get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), delete: vi.fn(),
  interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
}
vi.mock('../api/client.js', () => ({ default: mockClient }))

const { authApi } = await import('../api/auth.js')

beforeEach(() => vi.clearAllMocks())

describe('authApi — login', () => {
  it('appelle POST auth/login et retourne user + token', async () => {
    mockClient.post.mockResolvedValue({ data: { data: { user: { id: 1 }, token: 'abc' } } })
    const result = await authApi.login({ email: 'a@b.com', password: 'secret' })
    expect(mockClient.post).toHaveBeenCalledWith('auth/login', { email: 'a@b.com', password: 'secret' })
    expect(result).toMatchObject({ user: { id: 1 }, token: 'abc' })
  })
})

describe('authApi — register', () => {
  it('appelle POST auth/register', async () => {
    mockClient.post.mockResolvedValue({ data: { data: { user: { id: 2 }, token: 'xyz' } } })
    const result = await authApi.register({ email: 'c@d.com', password: 'pass' })
    expect(mockClient.post).toHaveBeenCalledWith('auth/register', expect.any(Object))
    expect(result.token).toBe('xyz')
  })
})

describe('authApi — logout', () => {
  it('appelle POST auth/logout', async () => {
    mockClient.post.mockResolvedValue({ data: { success: true } })
    await authApi.logout()
    expect(mockClient.post).toHaveBeenCalledWith('auth/logout')
  })
})

describe('authApi — me', () => {
  it('retourne les données utilisateur (format data.data)', async () => {
    mockClient.get.mockResolvedValue({ data: { data: { id: 1, email: 'a@b.com' } } })
    const result = await authApi.me()
    expect(mockClient.get).toHaveBeenCalledWith('auth/me')
    expect(result).toMatchObject({ id: 1, email: 'a@b.com' })
  })

  it('gère la réponse plate (sans data.data)', async () => {
    mockClient.get.mockResolvedValue({ data: { id: 1, email: 'a@b.com' } })
    const result = await authApi.me()
    expect(result).toMatchObject({ id: 1, email: 'a@b.com' })
  })
})

describe('authApi — googleRedirectUrl', () => {
  it('retourne une URL se terminant par /api/auth/google', () => {
    const url = authApi.googleRedirectUrl()
    expect(url).toMatch(/\/api\/auth\/google$/)
  })
})