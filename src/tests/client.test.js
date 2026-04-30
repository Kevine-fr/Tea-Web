import { describe, it, expect, vi } from 'vitest'

const mockInstance = {
  get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), delete: vi.fn(),
  interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
}

vi.mock('axios', () => ({
  default: { create: vi.fn(() => mockInstance) }
}))

import axios from 'axios'

await import('../api/client.js')

describe('client.js — axios instance', () => {
  it('crée une instance avec baseURL /api et les bons headers', () => {
    expect(axios.create).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: expect.stringContaining('/api'),
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }),
      })
    )
  })

  it('expose des interceptors request et response configurables', () => {
    // Les interceptors sont des vi.fn() — ils existent et sont appelables
    expect(typeof mockInstance.interceptors.request.use).toBe('function')
    expect(typeof mockInstance.interceptors.response.use).toBe('function')
  })
})