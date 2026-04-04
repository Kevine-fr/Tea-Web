import client from './client.js'

export const adminApi = {
  stats:          ()         => client.get('admin/stats').then(r => r.data.data ?? r.data),
  participations: (p = {})   => client.get('admin/participations', { params: p }).then(r => r.data),
  redemptions:    (p = {})   => client.get('admin/redemptions',    { params: p }).then(r => r.data),
  prizes:         ()         => client.get('prizes').then(r => r.data),
  ticketStats:    ()         => client.get('admin/tickets/stats').then(r => r.data.data ?? r.data),

  updateRedemption: (id, status) =>
    client.patch(`admin/redemptions/${id}/status`, { status }).then(r => r.data),

  // Users
  users:        (p = {})    => client.get('admin/users', { params: p }).then(r => r.data),
  createUser:   (body)      => client.post('admin/users', body).then(r => r.data),
  updateUser:   (id, body)  => client.put(`admin/users/${id}`, body).then(r => r.data),
  deleteUser:   (id)        => client.delete(`admin/users/${id}`).then(r => r.data),

  // Prizes
  createPrize: (body)       => client.post('admin/prizes', body).then(r => r.data),
  updatePrize: (id, body)   => client.put(`admin/prizes/${id}`, body).then(r => r.data),
}
