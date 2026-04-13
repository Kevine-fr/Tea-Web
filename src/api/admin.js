// src/api/admin.js
import client from './client.js'

const get  = (url, params = {}) => client.get(url, { params }).then(r => r.data)
const post = (url, body)         => client.post(url, body).then(r => r.data)
const put  = (url, body)         => client.put(url, body).then(r => r.data)
const patch= (url, body)         => client.patch(url, body).then(r => r.data)
const del  = (url)               => client.delete(url).then(r => r.data)

export const adminApi = {
  // ── Stats globales ──────────────────────────────────────────
  stats: () => get('admin/stats').then(r => r.data ?? r),

  // ── Participations ──────────────────────────────────────────
  participations: (p = {}) => get('admin/participations', p),
  participation:  (id)     => get(`admin/participations/${id}`).then(r => r.data ?? r),
  updateParticipationPrize: (id, prize_id) =>
    patch(`admin/participations/${id}/prize`, { prize_id }).then(r => r.data ?? r),
  deleteParticipation: (id) => del(`admin/participations/${id}`),

  // ── Réclamations ────────────────────────────────────────────
  redemptions:      (p = {}) => get('admin/redemptions', p),
  redemption:       (id)     => get(`admin/redemptions/${id}`).then(r => r.data ?? r),
  updateRedemption: (id, status) => patch(`admin/redemptions/${id}/status`, { status }),
  deleteRedemption: (id)     => del(`admin/redemptions/${id}`),

  // ── Tickets ─────────────────────────────────────────────────
  tickets:      (p = {}) => get('admin/tickets', p),
  ticketStats:  ()       => get('admin/tickets/stats').then(r => r.data ?? r),
  generateTickets: (quantity) => post('admin/tickets/generate', { quantity }),
  resetTicket:  (id) => patch(`admin/tickets/${id}/reset`, {}),
  deleteTicket: (id) => del(`admin/tickets/${id}`),

  // ── Lots ────────────────────────────────────────────────────
  prizes:       ()         => get('admin/prizes'),
  prize:        (id)       => get(`admin/prizes/${id}`).then(r => r.data ?? r),
  createPrize:  (body)     => post('admin/prizes', body),
  updatePrize:  (id, body) => put(`admin/prizes/${id}`, body),
  updateStock:  (id, stock)=> patch(`admin/prizes/${id}/stock`, { stock }),
  deletePrize:  (id)       => del(`admin/prizes/${id}`),

  // ── Utilisateurs ────────────────────────────────────────────
  users:       (p = {})    => get('admin/users', p),
  user:        (id)        => get(`admin/users/${id}`).then(r => r.data ?? r),
  createUser:  (body)      => post('admin/users', body),
  updateUser:  (id, body)  => put(`admin/users/${id}`, body),
  updateRole:  (id, role)  => patch(`admin/users/${id}/role`, { role }),
  deleteUser:  (id)        => del(`admin/users/${id}`),

  // ── Newsletter ──────────────────────────────────────────────
  sendNewsletter: () => post('admin/newsletter', {}),
  assignAnnualTea: () => post('admin/participations/assign-annual-tea', {}).then(r => r.data ?? r),

}