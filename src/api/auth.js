import client from './client.js'

export const authApi = {
  login: (credentials) =>
    client.post('auth/login', credentials).then((r) => r.data),

  register: (data) =>
    client.post('auth/register', data).then((r) => r.data),

  logout: () =>
    client.post('auth/logout').then((r) => r.data),

  me: () =>
    client.get('auth/me').then((r) => r.data),
}
