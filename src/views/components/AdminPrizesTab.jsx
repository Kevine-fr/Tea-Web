// ═══════════════════════════════════════════════════════════════════
// src/views/admin/AdminPrizesTab.jsx
// ═══════════════════════════════════════════════════════════════════
import { useState, useEffect } from 'react'
import { adminApi } from '../../api/admin.js'
import AdminModal from './AdminModal.jsx'
import { SklCards } from './AdminSkeleton.jsx'
import toast from 'react-hot-toast'

const CSS_PRIZES = `
@keyframes prizeIn { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
.prize-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(270px,1fr)); gap:1rem; }
.prize-card {
  background:#fff; border-radius:var(--radius); border:1px solid var(--cream-border);
  padding:1.25rem 1.5rem; animation:prizeIn .4s ease both;
  display:flex; flex-direction:column; gap:.6rem;
  transition:box-shadow .2s,transform .2s;
}
.prize-card:hover { box-shadow:var(--shadow-md); transform:translateY(-2px); }
.prize-card-name { font-family:'Playfair Display',Georgia,serif; font-weight:700; font-size:1rem; color:var(--green-dark); }
.prize-card-desc { font-family:'Lato',sans-serif; font-size:.82rem; color:var(--text-muted); line-height:1.5; }
.prize-bar { height:5px; border-radius:4px; background:var(--cream-border); overflow:hidden; }
.prize-bar-fill { height:100%; border-radius:4px; transition:width .5s ease; }
.prize-card-actions { display:flex; gap:.4rem; flex-wrap:wrap; margin-top:.25rem; }
.prize-section-title { font-family:'Playfair Display',Georgia,serif; font-size:1.15rem; font-weight:700; color:var(--green-dark); margin:0; }
`

export function AdminPrizesTab({ userRole = 'admin', refreshKey }) {
  const [prizes, setPrizes]   = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState(null)
  const isAdmin = userRole === 'admin'

  async function load() {
    setLoading(true)
    try { const res = await adminApi.prizes(); setPrizes(res.data ?? []) }
    catch { toast.error('Impossible de charger les lots.') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [refreshKey])

  async function handleCreate(vals) {
    try {
      await adminApi.createPrize({ name:vals.name, description:vals.description, stock:parseInt(vals.stock,10)||0 })
      toast.success('Lot créé.'); setModal(null); load()
    } catch (err) { toast.error(err.response?.data?.message || 'Erreur.') }
  }

  async function handleUpdate(vals) {
    try {
      await adminApi.updatePrize(modal.prize.id, { name:vals.name, description:vals.description, stock:parseInt(vals.stock,10)||0 })
      toast.success('Lot mis à jour.'); setModal(null); load()
    } catch (err) { toast.error(err.response?.data?.message || 'Erreur.') }
  }

  async function handleUpdateStock(vals) {
    try {
      await adminApi.updateStock(modal.prize.id, parseInt(vals.stock,10)||0)
      toast.success('Stock mis à jour.'); setModal(null); load()
    } catch (err) { toast.error(err.response?.data?.message || 'Erreur.') }
  }

  async function handleDelete() {
    try { await adminApi.deletePrize(modal.prize.id); toast.success('Lot supprimé.'); setModal(null); load() }
    catch (err) { toast.error(err.response?.data?.message || 'Erreur — ce lot est peut-être lié à des participations.') }
  }

  const maxStock = Math.max(...prizes.map(p => p.stock), 1)

  return (
    <>
      <style>{CSS_PRIZES}</style>
      <div style={{ padding:'1.75rem' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem', flexWrap:'wrap', gap:'.75rem' }}>
          <h2 className="prize-section-title">Lots à gagner</h2>
          {isAdmin && (
            <button className="btn btn-orange" style={{ fontSize:'.85rem' }} onClick={() => setModal({ type:'create' })}>
              + Ajouter un lot
            </button>
          )}
        </div>

        {loading
          ? <SklCards count={6} />
          : prizes.length === 0
            ? <div style={{ textAlign:'center', padding:'3.5rem', color:'var(--text-muted)' }}>Aucun lot configuré.</div>
            : <div className="prize-grid">
                {prizes.map((p,i) => {
                  const stockPct   = Math.max((p.stock/maxStock)*100,2)
                  const stockColor = p.stock===0?'var(--error)':p.stock<10?'var(--orange)':'var(--green-light)'
                  return (
                    <div key={p.id} className="prize-card" style={{ animationDelay:`${i*.06}s` }}>
                      <div className="prize-card-name">{p.name}</div>
                      {p.description && <div className="prize-card-desc">{p.description}</div>}
                      <div style={{ display:'flex', alignItems:'center', gap:'.75rem' }}>
                        <div className="prize-bar" style={{ flex:1 }}>
                          <div className="prize-bar-fill" style={{ width:`${stockPct}%`, background:stockColor }} />
                        </div>
                        <span style={{ fontSize:'.85rem', fontWeight:700, color:stockColor, flexShrink:0 }}>
                          {p.stock} en stock
                        </span>
                      </div>
                      {p.stock === 0 && <span style={{ fontSize:'.72rem', color:'var(--error)', fontWeight:700 }}>RUPTURE DE STOCK</span>}
                      <div className="prize-card-actions">
                        <button className="btn btn-outline" style={{ padding:'.25rem .8rem', fontSize:'.78rem' }}
                          onClick={() => setModal({ type:'stock', prize:p })}>Stock</button>
                        {isAdmin && (
                          <>
                            <button className="btn btn-orange" style={{ padding:'.25rem .8rem', fontSize:'.78rem' }}
                              onClick={() => setModal({ type:'edit', prize:p })}>Modifier</button>
                            <button className="btn btn-outline"
                              style={{ padding:'.25rem .65rem', fontSize:'.78rem', color:'var(--error)', borderColor:'var(--error)' }}
                              onClick={() => setModal({ type:'delete', prize:p })}>🗑</button>
                          </>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
        }
      </div>

      {modal?.type === 'create' && (
        <AdminModal title="Nouveau lot"
          fields={[
            { name:'name',        label:'Nom du lot',    placeholder:'Ex : Coffret prestige' },
            { name:'description', label:'Description',   type:'textarea', required:false, placeholder:'Description courte...' },
            { name:'stock',       label:'Stock initial', type:'number', defaultValue:'10', min:0 },
          ]}
          onClose={() => setModal(null)} onSubmit={handleCreate} submitLabel="Créer le lot" />
      )}
      {modal?.type === 'edit' && (
        <AdminModal title={`Modifier — ${modal.prize.name}`}
          fields={[
            { name:'name',        label:'Nom',         defaultValue:modal.prize.name??'' },
            { name:'description', label:'Description', type:'textarea', required:false, defaultValue:modal.prize.description??'' },
            { name:'stock',       label:'Stock',       type:'number', defaultValue:String(modal.prize.stock??0), min:0 },
          ]}
          onClose={() => setModal(null)} onSubmit={handleUpdate} submitLabel="Enregistrer" />
      )}
      {modal?.type === 'stock' && (
        <AdminModal title={`Stock — ${modal.prize.name}`}
          fields={[{ name:'stock', label:'Nouveau stock', type:'number', defaultValue:String(modal.prize.stock??0), min:0 }]}
          onClose={() => setModal(null)} onSubmit={handleUpdateStock} submitLabel="Mettre à jour" />
      )}
      {modal?.type === 'delete' && (
        <AdminModal title={`Supprimer "${modal.prize.name}" ?`}
          onClose={() => setModal(null)} onSubmit={handleDelete} submitLabel="🗑 Supprimer" submitVariant="red">
          <p style={{ fontSize:'.88rem', color:'var(--text-muted)', marginBottom:'1rem' }}>
            Suppression définitive. Impossible si des participations sont liées à ce lot.
          </p>
        </AdminModal>
      )}
    </>
  )
}

export default AdminPrizesTab