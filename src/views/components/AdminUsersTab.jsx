// src/views/admin/AdminUsersTab.jsx
import { useState, useEffect } from 'react'
import { adminApi } from '../../api/admin.js'
import AdminModal from './AdminModal.jsx'
import { SklTable } from './AdminSkeleton.jsx'
import toast from 'react-hot-toast'

const CSS = `
@keyframes userRowIn { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:none} }
.user-row { animation:userRowIn .35s ease both; }
.user-row:hover td { background:var(--cream) !important; }
.users-section-title { font-family:'Playfair Display',Georgia,serif; font-size:1.15rem; font-weight:700; color:var(--green-dark); margin:0; }
.users-fbtn { padding:.3rem .9rem; border-radius:var(--radius-pill); border:1.5px solid var(--cream-border); font-family:'Lato',sans-serif; font-size:.8rem; font-weight:700; cursor:pointer; transition:all .2s ease; }
.users-fbtn.active { background:var(--green-dark); color:#fff; border-color:var(--green-dark); }
.users-fbtn:hover:not(.active) { background:var(--cream); }
.user-avatar {
  width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-content:center;
  font-size:.75rem; font-weight:700; flex-shrink:0;
  font-family:'Lato',sans-serif;
}
`

const ROLE_LABELS = { admin:'Admin', employee:'Caissier', user:'Utilisateur' }
const ROLE_OPTS   = [
  { value:'user',     label:'Utilisateur' },
  { value:'employee', label:'Caissier' },
  { value:'admin',    label:'Admin' },
]
const AVATAR_STYLE = {
  admin:    { bg:'rgba(45,92,62,.12)',   color:'var(--green-mid)' },
  employee: { bg:'rgba(201,168,76,.15)',  color:'#8a6a10' },
  user:     { bg:'#f0ebe0',             color:'#9a9a9a' },
}

export default function AdminUsersTab({ search = '', currentUserId }) {
  const [users, setUsers]         = useState([])
  const [meta, setMeta]           = useState({})
  const [loading, setLoading]     = useState(true)
  const [page, setPage]           = useState(1)
  const [roleFilter, setRoleFilter] = useState('all')
  const [modal, setModal]         = useState(null)

  async function load(p = 1) {
    setLoading(true)
    try {
      const res = await adminApi.users({
        page: p,
        search: search || undefined,
        role:   roleFilter === 'all' ? undefined : roleFilter,
      })
      setUsers(res.data ?? [])
      setMeta(res.meta ?? {})
    } catch { toast.error('Impossible de charger les utilisateurs.') }
    finally { setLoading(false) }
  }

  useEffect(() => { load(1) }, [search, roleFilter])

  async function handleCreate(vals) {
    try {
      await adminApi.createUser({ first_name:vals.first_name, last_name:vals.last_name, email:vals.email, password:vals.password||'Password@1234', role:vals.role })
      toast.success('Utilisateur créé.'); setModal(null); load(page)
    } catch (err) { toast.error(err.response?.data?.message || 'Erreur.') }
  }

  async function handleUpdate(vals) {
    try {
      await adminApi.updateUser(modal.user.id, {
        first_name: vals.first_name, last_name: vals.last_name, email: vals.email,
        ...(vals.password ? { password:vals.password } : {}),
      })
      const currentRole = modal.user.role?.name ?? modal.user.role ?? 'user'
      if (vals.role !== currentRole) {
        await adminApi.updateRole(modal.user.id, vals.role)
      }
      toast.success('Utilisateur mis à jour.'); setModal(null); load(page)
    } catch (err) { toast.error(err.response?.data?.message || 'Erreur.') }
  }

  async function handleDelete() {
    if (modal.user.id === currentUserId) return toast.error('Vous ne pouvez pas supprimer votre propre compte.')
    try {
      await adminApi.deleteUser(modal.user.id)
      toast.success('Utilisateur supprimé.'); setModal(null); load(page)
    } catch (err) { toast.error(err.response?.data?.message || 'Erreur.') }
  }

  return (
    <>
      <style>{CSS}</style>
      <div style={{ padding:'1.75rem' }}>

        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.25rem', flexWrap:'wrap', gap:'.75rem' }}>
          <div>
            <h2 className="users-section-title">
              Utilisateurs & droits
              {meta.total != null && <span style={{ fontFamily:"'Lato',sans-serif", fontSize:'.8rem', color:'var(--text-muted)', fontWeight:400, marginLeft:'.5rem' }}>({meta.total})</span>}
            </h2>
          </div>
          <button className="btn btn-orange" style={{ fontSize:'.85rem' }} onClick={() => setModal({ type:'create' })}>
            + Ajouter un utilisateur
          </button>
        </div>

        {/* Filtres rôle */}
        <div style={{ display:'flex', gap:'.5rem', marginBottom:'1rem', flexWrap:'wrap' }}>
          {[{ key:'all', label:'Tous' }, ...ROLE_OPTS.map(o => ({ key:o.value, label:o.label }))].map(f => (
            <button key={f.key} className={`users-fbtn ${roleFilter===f.key?'active':''}`}
              onClick={() => { setRoleFilter(f.key); setPage(1) }}>
              {f.label}
            </button>
          ))}
        </div>

        {loading
          ? <SklTable cols={5} rows={8} headers={['Nom / Prénom','Mail','Rôle','Inscrit le','Actions']} />
          : users.length === 0
            ? <div style={{ textAlign:'center', padding:'3.5rem', color:'var(--text-muted)' }}>Aucun utilisateur trouvé.</div>
            : (
              <div className="card" style={{ overflow:'auto' }}>
                <table className="tbl">
                  <thead>
                    <tr><th>Utilisateur</th><th>Mail</th><th>Rôle</th><th>Inscrit le</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {users.map((u, i) => {
                      const roleName = u.role?.name ?? u.role ?? 'user'
                      const av = AVATAR_STYLE[roleName] ?? AVATAR_STYLE.user
                      const isMe = u.id === currentUserId
                      const initials = `${(u.first_name?.[0]||'').toUpperCase()}${(u.last_name?.[0]||'').toUpperCase()}`
                      return (
                        <tr key={u.id} className="user-row" style={{ animationDelay:`${i*.04}s` }}>
                          <td>
                            <div style={{ display:'flex', alignItems:'center', gap:'.65rem' }}>
                              <div className="user-avatar" style={{ background:av.bg, color:av.color }}>{initials}</div>
                              <div>
                                <div style={{ fontWeight:600, fontSize:'.88rem' }}>
                                  {u.first_name ?? '—'} {u.last_name ?? ''}
                                  {isMe && <span style={{ fontSize:'.7rem', color:'var(--text-muted)', marginLeft:'.35rem' }}>(vous)</span>}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td style={{ fontSize:'.83rem', color:'var(--text-muted)' }}>{u.email}</td>
                          <td>
                            <span className={`status ${roleName==='admin'?'s-done':roleName==='employee'?'s-won':'s-lost'}`}>
                              {ROLE_LABELS[roleName] ?? roleName}
                            </span>
                          </td>
                          <td style={{ fontSize:'.8rem', color:'var(--text-muted)' }}>
                            {u.created_at ? new Date(u.created_at).toLocaleDateString('fr-FR') : '—'}
                          </td>
                          <td>
                            <div style={{ display:'flex', gap:'.3rem' }}>
                              <button className="btn btn-orange"
                                style={{ padding:'.25rem .7rem', fontSize:'.75rem' }}
                                onClick={() => setModal({ type:'edit', user:u })}>
                                Modifier
                              </button>
                              {!isMe && (
                                <button className="btn btn-outline"
                                  style={{ padding:'.25rem .65rem', fontSize:'.78rem', color:'var(--error)', borderColor:'var(--error)' }}
                                  title="Supprimer cet utilisateur"
                                  onClick={() => setModal({ type:'delete', user:u })}>
                                  🗑
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )
        }

        {/* Pagination */}
        {meta.last_page > 1 && (
          <div style={{ display:'flex', justifyContent:'center', gap:'.5rem', marginTop:'1rem', flexWrap:'wrap' }}>
            {page > 1 && <button className="btn btn-outline" style={{ padding:'.3rem .9rem', fontSize:'.8rem' }} onClick={() => { const p=page-1; setPage(p); load(p) }}>← Préc.</button>}
            <span style={{ padding:'.3rem .9rem', fontSize:'.85rem', color:'var(--text-muted)' }}>{meta.current_page} / {meta.last_page}</span>
            {page < meta.last_page && <button className="btn btn-outline" style={{ padding:'.3rem .9rem', fontSize:'.8rem' }} onClick={() => { const p=page+1; setPage(p); load(p) }}>Suiv. →</button>}
          </div>
        )}
      </div>

      {modal?.type === 'create' && (
        <AdminModal title="Nouvel utilisateur"
          fields={[
            { name:'last_name',  label:'Nom',    placeholder:'Dupont' },
            { name:'first_name', label:'Prénom', placeholder:'Jean' },
            { name:'email',      label:'E-mail', type:'email' },
            { name:'password',   label:'Mot de passe', type:'password', required:false, placeholder:'Vide → Password@1234' },
            { name:'role',       label:'Rôle',   type:'select', defaultValue:'user', options:ROLE_OPTS },
          ]}
          onClose={() => setModal(null)} onSubmit={handleCreate} submitLabel="Créer" />
      )}
      {modal?.type === 'edit' && (
        <AdminModal title={`Modifier — ${modal.user.first_name??''} ${modal.user.last_name??''}`}
          fields={[
            { name:'last_name',  label:'Nom',    defaultValue:modal.user.last_name??''  },
            { name:'first_name', label:'Prénom', defaultValue:modal.user.first_name??'' },
            { name:'email',      label:'E-mail', type:'email', defaultValue:modal.user.email??'' },
            { name:'password',   label:'Nouveau mot de passe (optionnel)', type:'password', required:false, defaultValue:'' },
            { name:'role',       label:'Rôle',   type:'select', defaultValue:modal.user.role?.name??modal.user.role??'user', options:ROLE_OPTS },
          ]}
          onClose={() => setModal(null)} onSubmit={handleUpdate} submitLabel="Enregistrer" />
      )}
      {modal?.type === 'delete' && (
        <AdminModal title={`Supprimer ${modal.user.first_name??''} ${modal.user.last_name??''} ?`}
          onClose={() => setModal(null)} onSubmit={handleDelete} submitLabel="🗑 Supprimer" submitVariant="red">
          <p style={{ fontSize:'.88rem', color:'var(--text-muted)', marginBottom:'1rem' }}>
            Toutes les données de cet utilisateur seront supprimées définitivement.
          </p>
        </AdminModal>
      )}
    </>
  )
}
