import { useState, useEffect, useRef } from 'react'
import { participationsApi } from '../../api/participations.js'
import Layout                from '../components/Layout.jsx'
import PageBanner            from '../components/PageBanner.jsx'
import LoadingSpinner        from '../components/LoadingSpinner.jsx'
import toast                 from 'react-hot-toast'
import CountdownBanner from '../components/CountdownBanner.jsx'

const STYLES = `
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeScaleIn {
    from { opacity: 0; transform: scale(.97) translateY(16px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes rowIn {
    from { opacity: 0; transform: translateX(-14px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes badgePop {
    0%   { transform: scale(0.65); opacity: 0; }
    60%  { transform: scale(1.12); }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes emptyFloat {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-7px); }
  }
  @keyframes lineGrow {
    from { width: 0; }
    to   { width: 48px; }
  }
  @keyframes tickerBlink {
    0%, 100% { opacity: 1; }
    50%       { opacity: .45; }
  }

  .gains-title     { animation: slideUp .5s ease both; }
  .gains-underline {
    display: block; height: 2px; width: 0;
    background: var(--orange, #c8723a);
    border-radius: 4px; margin: .45rem auto 2rem;
    animation: lineGrow .55s ease .2s forwards;
  }
  .gains-card  { animation: fadeScaleIn .55s ease .1s both; }
  .gains-row   { animation: rowIn .4s ease both; transition: background .2s ease; }
  .gains-row:hover { background: rgba(106,143,90,.04); }
  .gains-code  { font-family: monospace; font-weight: 600; letter-spacing: .06em; transition: color .2s ease; }
  .gains-row:hover .gains-code { color: var(--green-mid, #6a8f5a); }
  .gains-badge { animation: badgePop .35s ease both; display: inline-block; }
  .s-prep    { animation: badgePop .35s ease both, tickerBlink 2.2s ease-in-out .8s infinite; }
  .s-lost    { animation: badgePop .35s ease both, tickerBlink 2.2s ease-in-out .8s infinite; }
  .s-won     { animation: badgePop .35s ease both, tickerBlink 2.2s ease-in-out .8s infinite; }
  .s-done    { animation: badgePop .35s ease both; }
  .s-pending { animation: badgePop .35s ease both, tickerBlink 2.2s ease-in-out .8s infinite; }
  .gains-empty      { animation: fadeScaleIn .5s ease both; }
  .gains-empty-icon { display: block; font-size: 2.6rem; margin-bottom: .75rem; animation: emptyFloat 3.2s ease-in-out infinite; }
  .gains-deco  { position: absolute; border-radius: 50%; pointer-events: none; }
  .gains-inner { position: relative; z-index: 1; padding: 0 8rem; }

  @media (max-width: 1024px) { .gains-inner { padding: 0 3rem; } }
  @media (max-width: 640px)  { .gains-inner { padding: 0 1rem; } }
  @media (max-width: 600px)  {
    .gains-card { overflow-x: auto; -webkit-overflow-scrolling: touch; }
    .tbl { min-width: 420px; }
    .gains-badge { font-size: .75rem; padding: 3px 7px; white-space: nowrap; }
  }
`

const STATUS = {
  waiting:   { label: 'Non réclamé',            cls: 's-lost' },
  pending:   { label: 'En préparation',         cls: 's-prep' },
  approved:  { label: 'Disponible en boutique', cls: 's-won'  },
  completed: { label: 'Remis',                  cls: 's-done' },
  rejected:  { label: 'Refusé',                 cls: 's-pending' },
}

export default function GainsPage() {
  const [list, setList]       = useState([])
  const [loading, setLoading] = useState(true)
  const titleRef = useRef(null)

  useEffect(() => {
    const id = '__gains-styles__'
    if (!document.getElementById(id)) {
      const el = document.createElement('style')
      el.id = id; el.textContent = STYLES
      document.head.appendChild(el)
    }
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) obs.disconnect() },
      { threshold: 0.1 }
    )
    if (titleRef.current) obs.observe(titleRef.current)
    return () => obs.disconnect()
  }, [])

  function loadList() {
    setLoading(true)
    participationsApi.mine()
      .then(res => setList((res.data ?? []).filter(p => p.prize_id != null)))
      .catch(() => toast.error('Impossible de charger vos gains.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadList() }, [])

  function deadline(iso) {
    if (!iso) return '—'
    const d = new Date(new Date(iso).getTime() + 60 * 24 * 60 * 60 * 1000)
    return d.toLocaleDateString('fr-FR')
  }

  return (
    <Layout>
      <PageBanner title="Suivi des gains" />
              <CountdownBanner />

      <div style={{ position: 'relative', background: 'var(--cream)', padding: '2.5rem 1.5rem 4rem', overflow: 'hidden' }}>

        <div className="gains-deco" style={{
          width: 360, height: 360, top: -110, right: -90,
          background: 'radial-gradient(circle, rgba(106,143,90,.07) 0%, transparent 70%)',
        }} />
        <div className="gains-deco" style={{
          width: 240, height: 240, bottom: -60, left: -60,
          background: 'radial-gradient(circle, rgba(200,100,40,.06) 0%, transparent 70%)',
        }} />

        <div className="gains-inner">

          <div ref={titleRef} className="gains-title" style={{ textAlign: 'center' }}>
            <h2>Suivi de mes gains</h2>
            <span className="gains-underline" />
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : list.length === 0 ? (
            <div className="card gains-empty" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <span className="gains-empty-icon">🏆</span>
              <p style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Aucun gain pour l'instant.</p>
              <p style={{ fontSize: '0.85rem' }}>Participez au jeu pour tenter de gagner un lot !</p>
            </div>
          ) : (
            <div className="card gains-card" style={{ overflow: 'auto' }}>
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
                  {list.map((p, i) => {
                    const code      = p.ticket_code?.code ?? p.ticket_code_id?.slice(0, 8) ?? '—'
                    const prizeName = p.prize?.name ?? 'Gain'
                    const redem     = p.redemption
                    const s         = redem ? (STATUS[redem.status] ?? STATUS.pending) : STATUS.waiting
                    const dateRef   = redem?.requested_at ?? p.participation_date

                    return (
                      <tr
                        key={p.id}
                        className="gains-row"
                        style={{ animationDelay: `${0.12 + i * 0.07}s` }}
                      >
                        <td className="gains-code">{code}</td>
                        <td style={{ fontWeight: 600 }}>{prizeName}</td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                          {deadline(dateRef)}
                        </td>
                        <td>
                          <span
                            className={`status gains-badge ${s.cls}`}
                            style={{ animationDelay: `${0.18 + i * 0.07}s` }}
                          >
                            {s.label}
                          </span>
                        </td>
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