// ═══════════════════════════════════════════════════════════════════
// src/views/admin/AdminTicketsTab.jsx
// ═══════════════════════════════════════════════════════════════════
import { useState, useEffect } from 'react'
import { adminApi } from '../../api/admin.js'
import AdminModal from './AdminModal.jsx'
import { SklTable, SklKpis } from './AdminSkeleton.jsx'
import toast from 'react-hot-toast'

const CSS_TICKETS = `
.tkt-section-title { font-family:'Playfair Display',Georgia,serif; font-size:1.15rem; font-weight:700; color:var(--green-dark); margin:0; }
.tkt-kpi { background:#fff; border-radius:var(--radius-sm); border:1px solid var(--cream-border); padding:1rem 1.25rem; }
.tkt-kpi-val { font-family:'Playfair Display',Georgia,serif; font-size:1.6rem; font-weight:700; }
.tkt-kpi-lbl { font-family:'Lato',sans-serif; font-size:.75rem; color:var(--text-muted); font-weight:700; text-transform:uppercase; letter-spacing:.05em; }
.tkt-fbtn { padding:.3rem .9rem; border-radius:var(--radius-pill); border:1.5px solid var(--cream-border); font-family:'Lato',sans-serif; font-size:.8rem; font-weight:700; cursor:pointer; transition:all .2s ease; }
.tkt-fbtn.active { background:var(--green-dark); color:#fff; border-color:var(--green-dark); }
.tkt-fbtn:hover:not(.active) { background:var(--cream); }
`

function PaginationT({ meta, page, onPage }) {
  if (!meta?.last_page || meta.last_page <= 1) return null
  return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:'.5rem', marginTop:'1rem', flexWrap:'wrap' }}>
      <button className="btn btn-outline" style={{ padding:'.3rem .9rem', fontSize:'.8rem', opacity:page<=1?.4:1 }}
        disabled={page<=1} onClick={() => onPage(page-1)}>← Préc.</button>
      <span style={{ padding:'.3rem .9rem', fontSize:'.85rem', color:'var(--text-muted)', minWidth:80, textAlign:'center' }}>
        {meta.current_page} / {meta.last_page}
      </span>
      <button className="btn btn-outline" style={{ padding:'.3rem .9rem', fontSize:'.8rem', opacity:page>=meta.last_page?.4:1 }}
        disabled={page>=meta.last_page} onClick={() => onPage(page+1)}>Suiv. →</button>
    </div>
  )
}

export function AdminTicketsTab({ search = '', refreshKey }) {
  const [stats, setStats]     = useState(null)
  const [tickets, setTickets] = useState([])
  const [meta, setMeta]       = useState({})
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState('all')
  const [page, setPage]       = useState(1)
  const [modal, setModal]     = useState(null)

  async function load(p = 1, f = filter) {
    setLoading(true)
    try {
      const [s, t] = await Promise.allSettled([
        adminApi.ticketStats(),
        adminApi.tickets({ page:p, status:f==='all'?undefined:f, search:search||undefined }),
      ])
      if (s.status === 'fulfilled') setStats(s.value)
      if (t.status === 'fulfilled') { setTickets(t.value.data??[]); setMeta(t.value.meta??{}) }
    } catch { toast.error('Erreur de chargement.') }
    finally { setLoading(false) }
  }

  useEffect(() => { setPage(1); load(1, filter) }, [search, filter, refreshKey])

  async function handleGenerate(vals) {
    const qty = parseInt(vals.quantity, 10)
    if (!qty || qty < 1) return toast.error('Quantité invalide.')
    try {
      const res = await adminApi.generateTickets(qty)
      toast.success(`${res.data?.created ?? qty} tickets générés.`)
      setModal(null); load(1)
    } catch (err) { toast.error(err.response?.data?.message || 'Erreur.') }
  }

  async function handleReset() {
    try { await adminApi.resetTicket(modal.ticket.id); toast.success('Ticket remis à disponible.'); setModal(null); load(page) }
    catch (err) { toast.error(err.response?.data?.message || 'Erreur.') }
  }

  async function handleDelete() {
    try { await adminApi.deleteTicket(modal.ticket.id); toast.success('Ticket supprimé.'); setModal(null); load(page) }
    catch (err) { toast.error(err.response?.data?.message || 'Erreur.') }
  }

  function goPage(p) { setPage(p); load(p) }

  const FILTERS = [
    { key:'all',       label:'Tous' },
    { key:'available', label:'Disponibles' },
    { key:'used',      label:'Utilisés' },
  ]

  return (
    <>
      <style>{CSS_TICKETS}</style>
      <div style={{ padding:'1.75rem' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.25rem', flexWrap:'wrap', gap:'.75rem' }}>
          <h2 className="tkt-section-title">Gestion des tickets</h2>
          <button className="btn btn-orange" style={{ fontSize:'.85rem' }} onClick={() => setModal('generate')}>
            + Générer des tickets
          </button>
        </div>

        {loading
          ? <SklKpis count={3} />
          : <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'.75rem', marginBottom:'1.25rem' }}>
              {[
                { label:'Total',       val:stats?.total,     color:'var(--green-dark)' },
                { label:'Disponibles', val:stats?.available, color:'var(--green-light)' },
                { label:'Utilisés',    val:stats?.used,      color:'var(--orange)' },
              ].map(({ label, val, color }) => (
                <div key={label} className="tkt-kpi">
                  <div className="tkt-kpi-val" style={{ color }}>{val ?? '—'}</div>
                  <div className="tkt-kpi-lbl">{label}</div>
                </div>
              ))}
            </div>
        }

        <div style={{ display:'flex', gap:'.5rem', marginBottom:'1rem', flexWrap:'wrap' }}>
          {FILTERS.map(f => (
            <button key={f.key} className={`tkt-fbtn ${filter===f.key?'active':''}`}
              onClick={() => { setFilter(f.key); setPage(1) }}>{f.label}</button>
          ))}
        </div>

        {loading
          ? <SklTable cols={4} rows={8} headers={['Code','Statut','Créé le','Actions']} />
          : tickets.length === 0
            ? <div style={{ textAlign:'center', padding:'3.5rem', color:'var(--text-muted)' }}>Aucun ticket trouvé.</div>
            : <div className="card" style={{ overflow:'auto' }}>
                <table className="tbl">
                  <thead><tr><th>Code</th><th>Statut</th><th>Créé le</th><th>Actions</th></tr></thead>
                  <tbody>
                    {tickets.map(t => (
                      <tr key={t.id}>
                        <td style={{ fontFamily:'monospace', fontWeight:700, letterSpacing:'.06em', color:'var(--green-dark)' }}>{t.code}</td>
                        <td><span className={`status ${t.is_used?'s-prep':'s-done'}`}>{t.is_used?'Utilisé':'Disponible'}</span></td>
                        <td style={{ fontSize:'.83rem', color:'var(--text-muted)' }}>
                          {t.created_at ? new Date(t.created_at).toLocaleDateString('fr-FR') : '—'}
                        </td>
                        <td>
                          <div style={{ display:'flex', gap:'.3rem' }}>
                            {t.is_used && (
                              <button className="btn btn-outline"
                                style={{ padding:'.25rem .7rem', fontSize:'.75rem' }}
                                onClick={() => setModal({ type:'reset', ticket:t })}>↺ Reset</button>
                            )}
                            {!t.is_used && (
                              <button className="btn btn-outline"
                                style={{ padding:'.25rem .65rem', fontSize:'.78rem', color:'var(--error)', borderColor:'var(--error)' }}
                                onClick={() => setModal({ type:'delete', ticket:t })}>🗑</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
        }

        <PaginationT meta={meta} page={page} onPage={goPage} />
      </div>

      {modal === 'generate' && (
        <AdminModal title="Générer des tickets"
          fields={[{ name:'quantity', label:'Nombre de tickets', type:'number', defaultValue:'100', min:1, max:10000, placeholder:'Ex : 500' }]}
          onClose={() => setModal(null)} onSubmit={handleGenerate} submitLabel="Générer" />
      )}
      {modal?.type === 'reset' && (
        <AdminModal title={`Remettre à disponible — ${modal.ticket.code}`}
          onClose={() => setModal(null)} onSubmit={handleReset} submitLabel="Confirmer le reset">
          <p style={{ fontSize:'.88rem', color:'var(--text-muted)', marginBottom:'1rem' }}>
            Ce ticket sera marqué comme non utilisé. À n'utiliser qu'en cas d'erreur de saisie.
          </p>
        </AdminModal>
      )}
      {modal?.type === 'delete' && (
        <AdminModal title={`Supprimer le ticket ${modal.ticket.code} ?`}
          onClose={() => setModal(null)} onSubmit={handleDelete} submitLabel="🗑 Supprimer" submitVariant="red">
          <p style={{ fontSize:'.88rem', color:'var(--text-muted)', marginBottom:'1rem' }}>
            Seuls les tickets non utilisés peuvent être supprimés. Action irréversible.
          </p>
        </AdminModal>
      )}
    </>
  )
}

export default AdminTicketsTab