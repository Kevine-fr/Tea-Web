import client from './client.js'

export const adminApi = {
  stats:          ()       => client.get('admin/stats').then((r) => r.data),
  participations: (p = {}) => client.get('admin/participations', { params: p }).then((r) => r.data),
  users:          (p = {}) => client.get('admin/users',          { params: p }).then((r) => r.data),
  redemptions:    (p = {}) => client.get('admin/redemptions',    { params: p }).then((r) => r.data),
  updateRedemption: (id, data) => client.put(`admin/redemptions/${id}`, data).then((r) => r.data),
  prizes:         ()       => client.get('admin/prizes').then((r) => r.data),
}

export const employeeApi = {
  redemptions:    (p = {}) => client.get('employee/redemptions',       { params: p }).then((r) => r.data),
  updateRedemption: (id, data) => client.put(`employee/redemptions/${id}`, data).then((r) => r.data),
}
