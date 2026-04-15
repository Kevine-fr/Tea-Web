import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockClient = {
  get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), delete: vi.fn(),
  interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
}
vi.mock('../api/client.js', () => ({ default: mockClient }))

const { adminApi } = await import('../api/admin.js')

beforeEach(() => vi.clearAllMocks())

const ok = (data) => ({ data: { data } })

describe('adminApi — stats', () => {
  it('appelle GET admin/stats', async () => {
    mockClient.get.mockResolvedValue(ok({ total: 10 }))
    const result = await adminApi.stats()
    expect(mockClient.get).toHaveBeenCalledWith('admin/stats', { params: {} })
    expect(result).toMatchObject({ total: 10 })
  })
})

describe('adminApi — participations', () => {
  it('liste les participations', async () => {
    mockClient.get.mockResolvedValue({ data: [{ id: 1 }] })
    await adminApi.participations()
    expect(mockClient.get).toHaveBeenCalledWith('admin/participations', { params: {} })
  })

  it('met à jour le lot d\'une participation', async () => {
    mockClient.patch.mockResolvedValue(ok({ id: 5, prize_id: 2 }))
    await adminApi.updateParticipationPrize(5, 2)
    expect(mockClient.patch).toHaveBeenCalledWith('admin/participations/5/prize', { prize_id: 2 })
  })

  it('supprime une participation', async () => {
    mockClient.delete.mockResolvedValue({ data: {} })
    await adminApi.deleteParticipation(5)
    expect(mockClient.delete).toHaveBeenCalledWith('admin/participations/5')
  })
})

describe('adminApi — tickets', () => {
  it('génère des tickets', async () => {
    mockClient.post.mockResolvedValue({ data: { generated: 50 } })
    await adminApi.generateTickets(50)
    expect(mockClient.post).toHaveBeenCalledWith('admin/tickets/generate', { quantity: 50 })
  })

  it('remet à zéro un ticket', async () => {
    mockClient.patch.mockResolvedValue({ data: {} })
    await adminApi.resetTicket(3)
    expect(mockClient.patch).toHaveBeenCalledWith('admin/tickets/3/reset', {})
  })

  it('supprime un ticket', async () => {
    mockClient.delete.mockResolvedValue({ data: {} })
    await adminApi.deleteTicket(3)
    expect(mockClient.delete).toHaveBeenCalledWith('admin/tickets/3')
  })
})

describe('adminApi — prizes', () => {
  it('crée un lot', async () => {
    mockClient.post.mockResolvedValue({ data: { id: 1 } })
    await adminApi.createPrize({ name: 'Thé vert', stock: 10 })
    expect(mockClient.post).toHaveBeenCalledWith('admin/prizes', { name: 'Thé vert', stock: 10 })
  })

  it('met à jour un lot', async () => {
    mockClient.put.mockResolvedValue({ data: { id: 1 } })
    await adminApi.updatePrize(1, { name: 'Thé noir' })
    expect(mockClient.put).toHaveBeenCalledWith('admin/prizes/1', { name: 'Thé noir' })
  })

  it('met à jour le stock', async () => {
    mockClient.patch.mockResolvedValue({ data: {} })
    await adminApi.updateStock(1, 20)
    expect(mockClient.patch).toHaveBeenCalledWith('admin/prizes/1/stock', { stock: 20 })
  })

  it('supprime un lot', async () => {
    mockClient.delete.mockResolvedValue({ data: {} })
    await adminApi.deletePrize(1)
    expect(mockClient.delete).toHaveBeenCalledWith('admin/prizes/1')
  })
})

describe('adminApi — users', () => {
  it('crée un utilisateur', async () => {
    mockClient.post.mockResolvedValue({ data: { id: 10 } })
    await adminApi.createUser({ email: 'x@y.com' })
    expect(mockClient.post).toHaveBeenCalledWith('admin/users', { email: 'x@y.com' })
  })

  it('met à jour le rôle', async () => {
    mockClient.patch.mockResolvedValue({ data: {} })
    await adminApi.updateRole(10, 'employee')
    expect(mockClient.patch).toHaveBeenCalledWith('admin/users/10/role', { role: 'employee' })
  })

  it('supprime un utilisateur', async () => {
    mockClient.delete.mockResolvedValue({ data: {} })
    await adminApi.deleteUser(10)
    expect(mockClient.delete).toHaveBeenCalledWith('admin/users/10')
  })
})

describe('adminApi — redemptions', () => {
  it('met à jour le statut', async () => {
    mockClient.patch.mockResolvedValue({ data: {} })
    await adminApi.updateRedemption(1, 'approved')
    expect(mockClient.patch).toHaveBeenCalledWith('admin/redemptions/1/status', { status: 'approved' })
  })

  it('supprime une réclamation', async () => {
    mockClient.delete.mockResolvedValue({ data: {} })
    await adminApi.deleteRedemption(1)
    expect(mockClient.delete).toHaveBeenCalledWith('admin/redemptions/1')
  })
})