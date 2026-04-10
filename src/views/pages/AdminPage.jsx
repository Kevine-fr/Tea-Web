// src/views/pages/AdminPage.jsx
import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { adminApi } from '../../api/admin.js'
import { Link } from "react-router-dom";
import SEO from '../components/SEO.jsx'
import AdminDashboardTab from '../components/AdminDashboardTab.jsx'
import AdminGainsTab     from '../components/AdminGainsTab.jsx'
import AdminTicketsTab   from '../components/AdminTicketsTab.jsx'
import AdminPrizesTab    from '../components/AdminPrizesTab.jsx'
import AdminUsersTab     from '../components/AdminUsersTab.jsx'
import toast from 'react-hot-toast'

const CSS = `
/* ── Shell ────────────────────────────────────────────────── */
.admin-page { display:flex; min-height:100vh; font-family:'Lato',sans-serif; }

/* ── Sidebar ─────────────────────────────────────────────── */
.adm-sidebar {
  width:220px; flex-shrink:0; background:var(--green-dark);
  display:flex; flex-direction:column;
  transition:transform .3s cubic-bezier(.4,0,.2,1);
  z-index:200; position:relative;
}
.adm-sidebar-logo { padding:1.5rem 1.25rem 1rem; border-bottom:1px solid rgba(255,255,255,.08); text-align:center; }
.adm-brand-name { font-family:'Playfair Display',Georgia,serif; color:#fff; font-size:1.05rem; font-weight:700; letter-spacing:.01em; }
.adm-sidebar-role { font-family:'Lato',sans-serif; font-size:.68rem; color:rgba(255,255,255,.4); text-transform:uppercase; letter-spacing:.08em; font-weight:700; margin-top:.35rem; }

.adm-nav { flex:1; padding:.5rem 0; }
.adm-nav-item {
  display:flex; align-items:center; gap:.65rem; padding:.78rem 1.25rem;
  width:100%; text-align:left; background:none;
  border:none; border-left:3px solid transparent;
  color:rgba(255,255,255,.52); font-family:'Lato',sans-serif; font-size:.87rem; font-weight:600;
  cursor:pointer; transition:all .2s ease; letter-spacing:.01em;
}
.adm-nav-item:hover  { color:#fff; background:rgba(255,255,255,.05); border-left-color:rgba(255,255,255,.2); }
.adm-nav-item.active { color:#fff; background:rgba(255,255,255,.09); border-left-color:var(--gold); }
.adm-nav-icon  { font-size:.98rem; flex-shrink:0; width:1.2rem; text-align:center; }
.adm-nav-badge { background:var(--orange); color:#fff; font-size:.62rem; font-weight:800; padding:.1rem .4rem; border-radius:10px; min-width:16px; text-align:center; margin-left:auto; }

.adm-footer { padding:.75rem 1.25rem 1.5rem; border-top:1px solid rgba(255,255,255,.08); font-family:'Lato',sans-serif; font-size:.72rem; color:rgba(255,255,255,.3); text-align:center; }

/* ── Main ────────────────────────────────────────────────── */
.adm-main { flex:1; min-width:0; display:flex; flex-direction:column; background:var(--cream); }

/* ── Topbar ──────────────────────────────────────────────── */
.adm-topbar {
  background:var(--green-dark); padding:.8rem 1.25rem;
  display:flex; align-items:center; gap:.6rem; flex-wrap:wrap;
  position:sticky; top:0; z-index:100;
  box-shadow:0 2px 12px rgba(0,0,0,.25);
}
.adm-topbar-title { font-family:'Playfair Display',Georgia,serif; font-size:1.05rem; font-weight:700; color:#fff; flex:1; min-width:80px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }

.adm-search-wrap { position:relative; flex:1; min-width:150px; max-width:360px; }
.adm-search {
  width:100%; padding:.52rem 1rem .52rem 2.1rem;
  border-radius:var(--radius-pill); border:none;
  font-family:'Lato',sans-serif; font-size:.87rem;
  background:rgba(255,255,255,.12); color:#fff; outline:none;
  transition:background .2s ease;
}
.adm-search::placeholder { color:rgba(255,255,255,.38); }
.adm-search:focus { background:rgba(255,255,255,.18); }
.adm-search-ico { position:absolute; left:.7rem; top:50%; transform:translateY(-50%); font-size:.8rem; pointer-events:none; }

.adm-topbar-btn {
  padding:.42rem .9rem; border-radius:var(--radius-pill);
  border:1px solid rgba(255,255,255,.22); background:transparent;
  color:rgba(255,255,255,.75); font-family:'Lato',sans-serif; font-size:.78rem; font-weight:700;
  cursor:pointer; transition:all .2s ease; white-space:nowrap;
}
.adm-topbar-btn:hover { background:rgba(255,255,255,.1); color:#fff; }

/* Hamburger */
.adm-burger { display:none; background:none; border:none; cursor:pointer; flex-direction:column; gap:5px; padding:.25rem; flex-shrink:0; }
.adm-burger span { display:block; width:21px; height:2px; background:#fff; border-radius:2px; transition:all .25s ease; }

/* Overlay mobile */
.adm-overlay { display:none; position:fixed; inset:0; background:rgba(0,0,0,.5); z-index:150; }

/* ── Tab content ─────────────────────────────────────────── */
@keyframes tabIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
.adm-content { flex:1; overflow:auto; }
.adm-tab-anim { animation:tabIn .3s ease both; }

/* ── Responsive ──────────────────────────────────────────── */
@media(max-width:768px) {
  .adm-burger { display:flex !important; }
  .adm-sidebar { position:fixed; left:0; top:0; bottom:0; transform:translateX(-100%); }
  .adm-sidebar.open { transform:translateX(0); }
  .adm-overlay.open { display:block; }
  .adm-topbar-title { font-size:.95rem; }
}
@media(max-width:1024px) {
  .adm-sidebar { width:200px; }
}
@media(max-width:480px) {
  .adm-search-wrap { max-width:100%; order:10; flex-basis:100%; }
}
`

const TABS = [
  { key:'dashboard', icon:'📊', label:'Dashboard'           },
  { key:'gains',     icon:'🎁', label:'Gains & Réclamations' },
  { key:'tickets',   icon:'🎫', label:'Tickets'             },
  { key:'prizes',    icon:'🏆', label:'Lots'                },
  { key:'users',     icon:'👥', label:'Utilisateurs'        },
]

export default function AdminPage() {
  const { user }              = useAuth()
  const [tab, setTab]         = useState('dashboard')
  const [stats, setStats]     = useState(null)
  const [statsLoading, setSL] = useState(true)
  const [searchVal, setSearchVal] = useState('')
  const [search, setSearch]   = useState('')
  const [sidebarOpen, setSO]  = useState(false)

  const userRole = user?.role?.name ?? user?.role ?? 'employee'

  const loadStats = useCallback(async () => {
    setSL(true)
    try { setStats(await adminApi.stats()) }
    catch {}
    finally { setSL(false) }
  }, [])

  useEffect(() => {
    loadStats()
    const id = setInterval(loadStats, 60_000)
    return () => clearInterval(id)
  }, [loadStats])

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchVal), 350)
    return () => clearTimeout(t)
  }, [searchVal])

  function switchTab(key) { setTab(key); setSO(false); setSearchVal(''); setSearch('') }

  const alertCount = stats?.low_stock_alerts?.length ?? 0

  return (
    <>
      <style>{CSS}</style>
      <SEO title="Administration | Thé Tip Top" description="Espace d'administration du jeu-concours Thé Tip Top." />

      {/* Mobile overlay */}
      <div className={`adm-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSO(false)} />

      <div className="admin-page">

        {/* ── Sidebar ───────────────────────────────────────── */}
        <aside className={`adm-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="adm-sidebar-logo">
            <Link to="/">
              <img
                src="/images/Footer/img_01.png"
                alt="Thé Tip Top"
                style={{ width: 200, margin: '0 auto', filter: 'brightness(1.15)' }}
                onError={e => { e.target.style.display = 'none' }}
              />
            </Link>
            <div className="adm-sidebar-role">
              {userRole === 'admin' ? 'Administrateur' : 'Caissier'}
            </div>
          </div>

          <nav className="adm-nav">
            {TABS.map(t => (
              <button key={t.key}
                className={`adm-nav-item ${tab === t.key ? 'active' : ''}`}
                onClick={() => switchTab(t.key)}>
                <span className="adm-nav-icon">{t.icon}</span>
                {t.label}
                {t.key === 'dashboard' && alertCount > 0 && (
                  <span className="adm-nav-badge">{alertCount}</span>
                )}
              </button>
            ))}
          </nav>

          <div className="adm-footer">Thé Tip Top © {new Date().getFullYear()}</div>
        </aside>

        {/* ── Main ──────────────────────────────────────────── */}
        <div className="adm-main">

          {/* Topbar */}
          <div className="adm-topbar">
            <button className="adm-burger" aria-label="Menu" onClick={() => setSO(o => !o)}>
              <span /><span /><span />
            </button>

            <div className="adm-topbar-title">
              {TABS.find(t => t.key === tab)?.label ?? ''}
            </div>

            {['gains','tickets','users'].includes(tab) && (
              <div className="adm-search-wrap">
                <span className="adm-search-ico">🔍</span>
                <input className="adm-search" aria-label="Rechercher"
                  placeholder="Rechercher…"
                  value={searchVal}
                  onChange={e => setSearchVal(e.target.value)} />
              </div>
            )}

            <button className="adm-topbar-btn" onClick={loadStats} title="Actualiser les statistiques">↺ Stats</button>

            {userRole === 'admin' && (
              <button className="btn btn-orange"
                style={{ padding:'.42rem .9rem', fontSize:'.78rem' }}
                onClick={async () => {
                  try { await adminApi.sendNewsletter(); toast.success('Newsletter envoyée !') }
                  catch { toast.error('Erreur envoi newsletter.') }
                }}>
                Newsletter
              </button>
            )}
          </div>

          {/* Contenu */}
          <div className="adm-content adm-tab-anim" key={tab}>
            {tab === 'dashboard' && <AdminDashboardTab stats={stats} loading={statsLoading} />}
            {tab === 'gains'     && <AdminGainsTab   search={search} />}
            {tab === 'tickets'   && <AdminTicketsTab  search={search} />}
            {tab === 'prizes'    && <AdminPrizesTab   userRole={userRole} />}
            {tab === 'users'     && <AdminUsersTab    search={search} currentUserId={user?.id} />}
          </div>
        </div>
      </div>
    </>
  )
}