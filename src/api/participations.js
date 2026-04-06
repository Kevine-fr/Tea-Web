import client from './client.js'

// ParticipateRequest attend { code }  (pas ticket_code)
export const participationsApi = {
  submit: (code) =>
    client.post('participations', { code }).then((r) => r.data),

  mine: () =>
    client.get('participations').then((r) => r.data),

  // RedemptionRequest attend { participation_id, method: 'store'|'mail'|'pickup' }
  redeem: (participation_id, method = 'store') =>
    client.post('redemptions', { participation_id, method }).then((r) => r.data),
}
