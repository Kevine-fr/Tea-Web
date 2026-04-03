import client from './client.js'

export const participationsApi = {
  submit: (data) =>
    client.post('participations', data).then((r) => r.data),

  mine: () =>
    client.get('participations').then((r) => r.data),

  redeem: (data) =>
    client.post('redemptions', data).then((r) => r.data),
}
