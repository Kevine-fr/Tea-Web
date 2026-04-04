import { useState, useEffect } from 'react'
import { participationsApi } from '../../api/participations.js'
import Layout from '../components/Layout.jsx'
import PageBanner from '../components/PageBanner.jsx'
import AnimatedLeaves from '../components/AnimatedLeaves.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import toast from 'react-hot-toast'

const STATUS = {
  pending:   { label: 'En préparation',         cls: 's-prep' },
  approved:  { label: 'Disponible en boutique', cls: 's-won'  },
  completed: { label: 'Remis',                  cls: 's-done' },
  rejected:  { label: 'Refusé',                 cls: 's-lost' },
}

export default function GainsPage() {
  const [list, setList]       = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    participationsApi.mine()
      .then(res => {
        const data = res.data ?? []
        // Garder uniquement les participations gagnantes
        setList(data.filter(p => p.prize_id != null))
      })
      .catch(() => toast.error('Impossible de charger vos gains.'))
      .finally(() => setLoading(false))
  }, [])

  function deadline(iso) {
    if (!iso) return '—'
    const d = new Date(new Date(iso).getTime() + 60 * 24 * 60 * 60 * 1000)
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
                    // ticket_code.code depuis la resource enrichie
                    const code = p.ticket_code?.code ?? p.ticket_code_id?.slice(0, 8) ?? '—'
                    const prizeName = p.prize?.name ?? 'Gain'
                    const redem = p.redemption
                    const s = redem ? (STATUS[redem.status] || STATUS.pending) : STATUS.pending
                    const dateRef = redem?.requested_at ?? p.participation_date

                    return (
                      <tr key={p.id}>
                        <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{code}</td>
                        <td style={{ fontWeight: 600 }}>{prizeName}</td>
                        <td>{deadline(dateRef)}</td>
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
