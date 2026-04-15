import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockClient = {
  get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), delete: vi.fn(),
  interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
}
vi.mock('../api/client.js', () => ({ default: mockClient }))

const { participationsApi } = await import('../api/participations.js')

beforeEach(() => vi.clearAllMocks())

describe('participationsApi — submit', () => {
  it('envoie POST participations avec le code', async () => {
    mockClient.post.mockResolvedValue({ data: { success: true, prize: 'Thé vert' } })
    const result = await participationsApi.submit('CODE-1234')
    expect(mockClient.post).toHaveBeenCalledWith('participations', { code: 'CODE-1234' })
    expect(result.success).toBe(true)
  })

  it('transmet l\'erreur si le code est invalide', async () => {
    mockClient.post.mockRejectedValue({ response: { status: 422 } })
    await expect(participationsApi.submit('INVALIDE')).rejects.toBeDefined()
  })
})

describe('participationsApi — mine', () => {
  it('retourne la liste des participations', async () => {
    mockClient.get.mockResolvedValue({ data: [{ id: 1 }, { id: 2 }] })
    const result = await participationsApi.mine()
    expect(mockClient.get).toHaveBeenCalledWith('participations')
    expect(result).toHaveLength(2)
  })
})

describe('participationsApi — redeem', () => {
  it('envoie POST redemptions avec method "store" par défaut', async () => {
    mockClient.post.mockResolvedValue({ data: { id: 1, status: 'pending' } })
    const result = await participationsApi.redeem(42)
    expect(mockClient.post).toHaveBeenCalledWith('redemptions', { participation_id: 42, method: 'store' })
    expect(result.status).toBe('pending')
  })

  it('accepte une méthode personnalisée', async () => {
    mockClient.post.mockResolvedValue({ data: { id: 2 } })
    await participationsApi.redeem(42, 'online')
    expect(mockClient.post).toHaveBeenCalledWith('redemptions', { participation_id: 42, method: 'online' })
  })
})