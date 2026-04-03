import client from './client.js'

export const adminApi = {
  stats:          ()       => client.get('admin/stats').then((r) => r.data.data ?? r.data),
  participations: (p = {}) => client.get('admin/participations', { params: p }).then((r) => r.data),
  redemptions:    (p = {}) => client.get('admin/redemptions',    { params: p }).then((r) => r.data),
  prizes:         ()       => client.get('prizes').then((r) => r.data),
  ticketStats:    ()       => client.get('admin/tickets/stats').then((r) => r.data.data ?? r.data),
  // PATCH /api/admin/redemptions/{id}/status
  updateRedemption: (id, status) =>
    client.patch(`admin/redemptions/${id}/status`, { status }).then((r) => r.data),
  // Admin-only
  createPrize: (body) => client.post('admin/prizes', body).then((r) => r.data),
  updatePrize: (id, body) => client.put(`admin/prizes/${id}`, body).then((r) => r.data),
}
