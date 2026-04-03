import { useState, useEffect } from 'react'
import { participationsApi } from '../../api/participations.js'
import Layout from '../components/Layout.jsx'
import PageBanner from '../components/PageBanner.jsx'
import AnimatedLeaves from '../components/AnimatedLeaves.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import toast from 'react-hot-toast'

const STATUS = {
  pending:   { label: 'En préparation',         cls: 's-prep' },
  approved:  { label: 'Disponible en boutique', cls: 's-done' },
  completed: { label: 'Remis',                  cls: 's-done' },
  rejected:  { label: 'Refusé',                 cls: 's-lost' },
}

export default function GainsPage() {
  const [list, setList]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    participationsApi.mine()
      .then(res => setList((res.data ?? []).filter(p => p.prize_id != null)))
      .catch(() => toast.error('Impossible de charger vos gains.'))
      .finally(() => setLoading(false))
  }, [])

  function deadline(date) {
    if (!date) return '—'
    const d = new Date(new Date(date).getTime() + 60 * 24 * 60 * 60 * 1000)
    return d.toLocaleDateString('fr-FR')
  }

  return (
    <Layout>
      <PageBanner title="Suivi des gains" />

      <div style={{ position: 'relative', background: 'var(--cream)', padding: '2.5rem 1.5rem 4rem', overflow: 'hidden' }}>
        <AnimatedLeaves />

        <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: 980 }}>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Suivi de mes gains</h2>

          {loading ? <LoadingSpinner /> : list.length === 0 ? (
            <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Aucun gain pour l'instant.</p>
              <p style={{ fontSize: '0.85rem' }}>Participez au jeu pour tenter de gagner un lot !</p>
            </div>
          ) : (
            <div className="card" style={{ overflow: 'auto' }}>
              <table className="tbl">
                <thead>
                  <tr>
                    <th>N° Ticket</th>
                    <th>Lot</th>
                    <th>Date limite</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map(p => {
                    const s = STATUS[p.redemption?.status] || STATUS.pending
                    return (
                      <tr key={p.id}>
                        <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>
                          {p.ticket_code_id ?? p.id?.slice(0, 8) ?? '—'}
                        </td>
                        <td style={{ fontWeight: 600 }}>{p.prize?.name ?? 'Gain'}</td>
                        <td>{deadline(p.participation_date)}</td>
                        <td><span className={`status ${s.cls}`}>{s.label}</span></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
