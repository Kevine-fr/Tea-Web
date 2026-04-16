// src/views/pages/AdminPage.jsx
import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { adminApi } from '../../api/admin.js'
import { Link } from "react-router-dom"
import SEO from '../components/SEO.jsx'
import AdminDashboardTab   from '../components/AdminDashboardTab.jsx'
import AdminGainsTab       from '../components/AdminGainsTab.jsx'
import AdminTicketsTab     from '../components/AdminTicketsTab.jsx'
import AdminPrizesTab      from '../components/AdminPrizesTab.jsx'
import AdminUsersTab       from '../components/AdminUsersTab.jsx'
import AdminGrandPrizeDraw from '../components/AdminGrandPrizeDraw.jsx'
import AdminGamePeriodTab  from '../components/AdminGamePeriodTab.jsx'
import toast from 'react-hot-toast'

const CSS = `
  @keyframes sidebarIn    { from{opacity:0;transform:translateX(-24px)} to{opacity:1;transform:none} }
  @keyframes topbarIn     { from{opacity:0;transform:translateY(-16px)} to{opacity:1;transform:none} }
  @keyframes navItemIn    { from{opacity:0;transform:translateX(-14px)} to{opacity:1;transform:none} }
  @keyframes logoIn       { from{opacity:0;transform:scale(.88) translateY(-8px)} to{opacity:1;transform:none} }
  @keyframes tabIn        { from{opacity:0;transform:translateY(10px) scale(.99)} to{opacity:1;transform:none} }
  @keyframes badgePulse   { 0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(200,100,40,.5)} 50%{transform:scale(1.08);box-shadow:0 0 0 5px rgba(200,100,40,0)} }
  @keyframes activeBorderGlow { 0%,100%{border-left-color:var(--gold)} 50%{border-left-color:rgba(212,175,55,.5)} }
  @keyframes logoFloat    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
  @keyframes shimmerBtn   { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes pulseRing    { 0%{box-shadow:0 0 0 0 rgba(200,100,40,.4)} 70%{box-shadow:0 0 0 10px rgba(200,100,40,0)} 100%{box-shadow:0 0 0 0 rgba(200,100,40,0)} }
  @keyframes spinOnce     { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes searchFocusGlow { from{box-shadow:0 0 0 0 rgba(255,255,255,0)} to{box-shadow:0 0 0 3px rgba(255,255,255,.15)} }
  @keyframes burgerTopOpen  { 0%{transform:none} 50%{transform:translateY(7px)} 100%{transform:translateY(7px) rotate(45deg)} }
  @keyframes burgerMidOpen  { 0%{opacity:1;transform:scaleX(1)} 100%{opacity:0;transform:scaleX(0)} }
  @keyframes burgerBotOpen  { 0%{transform:none} 50%{transform:translateY(-7px)} 100%{transform:translateY(-7px) rotate(-45deg)} }
  @keyframes burgerTopClose { 0%{transform:translateY(7px) rotate(45deg)} 50%{transform:translateY(7px)} 100%{transform:none} }
  @keyframes burgerMidClose { 0%{opacity:0;transform:scaleX(0)} 100%{opacity:1;transform:scaleX(1)} }
  @keyframes burgerBotClose { 0%{transform:translateY(-7px) rotate(-45deg)} 50%{transform:translateY(-7px)} 100%{transform:none} }
  @keyframes sidebarSlideIn { from{transform:translateX(-100%)} to{transform:translateX(0)} }
  @keyframes overlayIn      { from{opacity:0} to{opacity:1} }

  .admin-page { display:flex; height:100vh; overflow:hidden; font-family:'Lato',sans-serif; }

  .adm-sidebar {
    width:220px; flex-shrink:0; background:var(--green-dark);
    display:flex; flex-direction:column; height:100vh;
    overflow-y:auto; overflow-x:hidden;
    transition:transform .3s cubic-bezier(.4,0,.2,1); z-index:200;
    animation:sidebarIn .5s cubic-bezier(.22,.68,0,1.1) both;
  }
  .adm-sidebar-logo { padding:1.5rem 1.25rem 1rem; border-bottom:1px solid rgba(255,255,255,.08); text-align:center; flex-shrink:0; animation:logoIn .55s cubic-bezier(.22,.68,0,1.2) .1s both; }
  .adm-sidebar-logo img { animation:logoFloat 4s ease-in-out 1s infinite; display:block; transition:filter .3s ease; }
  .adm-sidebar-logo:hover img { filter:brightness(1.3) !important; animation:none; }
  .adm-sidebar-role { font-family:'Lato',sans-serif; font-size:.68rem; color:rgba(255,255,255,.4); text-transform:uppercase; letter-spacing:.08em; font-weight:700; margin-top:.35rem; }

  .adm-nav { flex:1; padding:.5rem 0; }
  .adm-nav-item {
    display:flex; align-items:center; gap:.65rem; padding:.78rem 1.25rem;
    width:100%; text-align:left; background:none;
    border:none; border-left:3px solid transparent;
    color:rgba(255,255,255,.52); font-family:'Lato',sans-serif;
    font-size:.87rem; font-weight:600; cursor:pointer; letter-spacing:.01em;
    transition:color .2s ease, background .2s ease, border-left-color .2s ease, transform .2s ease, padding-left .2s ease;
    position:relative; overflow:hidden;
  }
  .adm-nav-item:nth-child(1) { animation:navItemIn .45s cubic-bezier(.22,.68,0,1.1) .20s both; }
  .adm-nav-item:nth-child(2) { animation:navItemIn .45s cubic-bezier(.22,.68,0,1.1) .28s both; }
  .adm-nav-item:nth-child(3) { animation:navItemIn .45s cubic-bezier(.22,.68,0,1.1) .36s both; }
  .adm-nav-item:nth-child(4) { animation:navItemIn .45s cubic-bezier(.22,.68,0,1.1) .44s both; }
  .adm-nav-item:nth-child(5) { animation:navItemIn .45s cubic-bezier(.22,.68,0,1.1) .52s both; }
  .adm-nav-item:nth-child(6) { animation:navItemIn .45s cubic-bezier(.22,.68,0,1.1) .60s both; }
  .adm-nav-item:nth-child(7) { animation:navItemIn .45s cubic-bezier(.22,.68,0,1.1) .68s both; }
  .adm-nav-item::before { content:''; position:absolute; inset:0; background:rgba(255,255,255,0); transition:background .25s ease; }
  .adm-nav-item:hover { color:#fff; border-left-color:rgba(255,255,255,.2); padding-left:1.55rem; }
  .adm-nav-item:hover::before { background:rgba(255,255,255,.05); }
  .adm-nav-item.active { color:#fff; background:rgba(255,255,255,.09); border-left-color:var(--gold); animation:activeBorderGlow 3s ease-in-out infinite; padding-left:1.55rem; }
  .adm-nav-item:hover .adm-nav-icon { transform:scale(1.2); transition:transform .2s ease; }
  .adm-nav-icon { font-size:.98rem; flex-shrink:0; width:1.2rem; text-align:center; transition:transform .2s ease; }
  .adm-nav-badge { background:var(--orange); color:#fff; font-size:.62rem; font-weight:800; padding:.1rem .4rem; border-radius:10px; min-width:16px; text-align:center; margin-left:auto; animation:badgePulse 2s ease-in-out infinite; }
  .adm-footer { padding:.75rem 1.25rem 1.5rem; flex-shrink:0; border-top:1px solid rgba(255,255,255,.08); font-family:'Lato',sans-serif; font-size:.72rem; color:rgba(255,255,255,.3); text-align:center; animation:navItemIn .4s ease .6s both; }

  .adm-main { flex:1; min-width:0; display:flex; flex-direction:column; height:100vh; overflow:hidden; background:var(--cream); }

  .adm-topbar { background:var(--green-dark); padding:.8rem 1.25rem; display:flex; align-items:center; gap:.6rem; flex-wrap:wrap; flex-shrink:0; box-shadow:0 2px 12px rgba(0,0,0,.25); animation:topbarIn .45s cubic-bezier(.22,.68,0,1.1) both; }
  .adm-topbar-title { font-family:'Playfair Display',Georgia,serif; font-size:1.05rem; font-weight:700; color:#fff; flex:1; min-width:80px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; transition:opacity .2s ease; }
  .adm-search-wrap { position:relative; flex:1; min-width:150px; max-width:360px; }
  .adm-search { width:100%; padding:.52rem 1rem .52rem 2.1rem; border-radius:var(--radius-pill); border:none; font-family:'Lato',sans-serif; font-size:.87rem; background:rgba(255,255,255,.12); color:#fff; outline:none; transition:background .25s ease, box-shadow .25s ease, transform .2s ease; }
  .adm-search::placeholder { color:rgba(255,255,255,.38); }
  .adm-search:focus { background:rgba(255,255,255,.18); animation:searchFocusGlow .25s ease forwards; transform:scaleX(1.02); transform-origin:left; }
  .adm-search-ico { position:absolute; left:.7rem; top:50%; transform:translateY(-50%); font-size:.8rem; pointer-events:none; transition:transform .2s ease; }
  .adm-search-wrap:focus-within .adm-search-ico { transform:translateY(-50%) scale(1.15); }
  .adm-topbar-btn { padding:.42rem .9rem; border-radius:var(--radius-pill); border:1px solid rgba(255,255,255,.22); background:transparent; color:rgba(255,255,255,.75); font-family:'Lato',sans-serif; font-size:.78rem; font-weight:700; cursor:pointer; transition:all .2s ease; white-space:nowrap; position:relative; overflow:hidden; }
  .adm-topbar-btn:hover { background:rgba(255,255,255,.1); color:#fff; }
  .adm-topbar-btn:disabled { opacity:.55; cursor:not-allowed; }
  .adm-topbar-btn.spinning .adm-refresh-ico { animation:spinOnce .5s ease forwards; }
  .adm-newsletter-btn { position:relative; overflow:hidden; transition:transform .2s ease, box-shadow .2s ease !important; }
  .adm-newsletter-btn::after { content:''; position:absolute; inset:0; background:linear-gradient(90deg,transparent,rgba(255,255,255,.25),transparent); background-size:200% 100%; opacity:0; transition:opacity .2s; }
  .adm-newsletter-btn:hover { transform:translateY(-2px) !important; animation:pulseRing 1.4s ease-out infinite; }
  .adm-newsletter-btn:hover::after { opacity:1; animation:shimmerBtn 1s linear infinite; }

  .adm-burger { display:none; background:none; border:none; cursor:pointer; flex-direction:column; gap:5px; padding:.25rem; flex-shrink:0; }
  .adm-burger span { display:block; width:21px; height:2px; background:#fff; border-radius:2px; transition:all .28s cubic-bezier(.4,0,.2,1); transform-origin:center; }
  .adm-burger.open span:nth-child(1)    { animation:burgerTopOpen  .28s cubic-bezier(.4,0,.2,1) forwards; }
  .adm-burger.open span:nth-child(2)    { animation:burgerMidOpen  .2s  ease forwards; }
  .adm-burger.open span:nth-child(3)    { animation:burgerBotOpen  .28s cubic-bezier(.4,0,.2,1) forwards; }
  .adm-burger.closing span:nth-child(1) { animation:burgerTopClose .28s cubic-bezier(.4,0,.2,1) forwards; }
  .adm-burger.closing span:nth-child(2) { animation:burgerMidClose .2s  ease forwards; }
  .adm-burger.closing span:nth-child(3) { animation:burgerBotClose .28s cubic-bezier(.4,0,.2,1) forwards; }

  .adm-overlay { display:none; position:fixed; inset:0; background:rgba(0,0,0,.5); z-index:150; }
  .adm-overlay.open { display:block; animation:overlayIn .25s ease both; }
  .adm-content { flex:1; overflow-y:auto; overflow-x:hidden; min-height:0; }
  .adm-tab-anim { animation:tabIn .35s cubic-bezier(.22,.68,0,1.1) both; }

  @media(max-width:768px) {
    .adm-burger { display:flex !important; }
    .adm-sidebar { position:fixed; left:0; top:0; bottom:0; transform:translateX(-100%); animation:none; }
    .adm-sidebar.open { transform:translateX(0); animation:sidebarSlideIn .3s cubic-bezier(.22,.68,0,1.1) both; }
    .adm-topbar-title { font-size:.95rem; }
  }
  @media(max-width:1024px) { .adm-sidebar { width:200px; } }
  @media(max-width:480px) { .adm-search-wrap { max-width:100%; order:10; flex-basis:100%; } }
  @media(prefers-reduced-motion:reduce) {
    .adm-sidebar, .adm-sidebar-logo, .adm-nav-item, .adm-topbar, .adm-tab-anim,
    .adm-nav-badge, .adm-sidebar-logo img { animation:none !important; }
    .adm-nav-item { transition:color .1s, background .1s !important; }
    .adm-search:focus { transform:none !important; }
  }
`

const TABS = [
  { key:'dashboard',  icon:'📊', label:'Dashboard'            },
  { key:'gains',      icon:'🎁', label:'Gains & Réclamations' },
  { key:'tickets',    icon:'🎫', label:'Tickets'              },
  { key:'prizes',     icon:'🏆', label:'Lots'                 },
  { key:'users',      icon:'👥', label:'Utilisateurs'         },
  { key:'grandlot',   icon:'🎰', label:'Grand lot 360€'       },
  { key:'gameperiod', icon:'📅', label:'Période de jeu'       },
]

export default function AdminPage() {
  const { user }                      = useAuth()
  const [tab, setTab]                 = useState('dashboard')
  const [stats, setStats]             = useState(null)
  const [statsLoading, setSL]         = useState(true)
  const [searchVal, setSearchVal]     = useState('')
  const [search, setSearch]           = useState('')
  const [sidebarOpen, setSO]          = useState(false)
  const [burgerState, setBurgerState] = useState('')
  const [refreshSpin, setRefreshSpin] = useState(false)
  const [refreshKey, setRefreshKey]   = useState(0)

  const userRole = user?.role?.name ?? user?.role ?? 'employee'

  const loadStats = useCallback(async () => {
    setSL(true)
    try { setStats(await adminApi.stats()) }
    catch {}
    finally { setSL(false) }
  }, [])

  useEffect(() => { loadStats() }, []) // eslint-disable-line

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchVal), 350)
    return () => clearTimeout(t)
  }, [searchVal])

  function toggleSidebar() {
    if (!sidebarOpen) { setSO(true); setBurgerState('open') }
    else { setBurgerState('closing'); setTimeout(() => { setSO(false); setBurgerState('') }, 280) }
  }

  async function handleRefresh() {
    setRefreshSpin(true)
    setRefreshKey(k => k + 1)
    try { await loadStats() }
    finally { setRefreshSpin(false) }
  }

  function switchTab(key) {
    setTab(key); setSO(false); setBurgerState('closing')
    setTimeout(() => setBurgerState(''), 280)
    setSearchVal(''); setSearch('')
  }

  const alertCount = stats?.low_stock_alerts?.length ?? 0

  return (
    <>
      <style>{CSS}</style>
      <SEO title="Administration | Thé Tip Top" description="Espace d'administration du jeu-concours Thé Tip Top." />

      <div className={`adm-overlay ${sidebarOpen ? 'open' : ''}`} onClick={toggleSidebar} />

      <div className="admin-page">
        <aside className={`adm-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="adm-sidebar-logo">
            <Link to="/">
              <img src="/images/Footer/img_01.png" alt="Thé Tip Top"
                style={{ width:200, margin:'0 auto', filter:'brightness(1.15)' }}
                onError={e => { e.target.style.display = 'none' }} />
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

        <div className="adm-main">
          <div className="adm-topbar">
            <button className={`adm-burger ${burgerState}`} aria-label="Menu" onClick={toggleSidebar}>
              <span /><span /><span />
            </button>
            <div className="adm-topbar-title">
              {TABS.find(t => t.key === tab)?.label ?? ''}
            </div>
            {['gains','tickets','users'].includes(tab) && (
              <div className="adm-search-wrap">
                <span className="adm-search-ico">🔍</span>
                <input className="adm-search" aria-label="Rechercher"
                  placeholder="Rechercher…" value={searchVal}
                  onChange={e => setSearchVal(e.target.value)} />
              </div>
            )}
            <button
              className={`adm-topbar-btn ${refreshSpin ? 'spinning' : ''}`}
              onClick={handleRefresh} disabled={refreshSpin}
              title="Actualiser">
              <span className="adm-refresh-ico">↺</span> {refreshSpin ? '…' : 'Stats'}
            </button>
            {userRole === 'admin' && (
              <button className="btn btn-orange adm-newsletter-btn"
                style={{ padding:'.42rem .9rem', fontSize:'.78rem' }}
                onClick={async () => {
                  try { await adminApi.sendNewsletter(); toast.success('Newsletter envoyée !') }
                  catch { toast.error('Erreur envoi newsletter.') }
                }}>
                Newsletter
              </button>
            )}
          </div>

          <div className="adm-content adm-tab-anim" key={`${tab}-${refreshKey}`}>
            {tab === 'dashboard'  && <AdminDashboardTab stats={stats} loading={statsLoading} />}
            {tab === 'gains'      && <AdminGainsTab     search={search} refreshKey={refreshKey} />}
            {tab === 'tickets'    && <AdminTicketsTab   search={search} refreshKey={refreshKey} />}
            {tab === 'prizes'     && <AdminPrizesTab    userRole={userRole} refreshKey={refreshKey} />}
            {tab === 'users'      && <AdminUsersTab     search={search} currentUserId={user?.id} refreshKey={refreshKey} />}
            {tab === 'grandlot'   && <AdminGrandPrizeDraw />}
            {tab === 'gameperiod' && <AdminGamePeriodTab />}
          </div>
        </div>
      </div>
    </>
  )
}