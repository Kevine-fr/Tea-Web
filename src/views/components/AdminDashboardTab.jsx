// src/views/admin/AdminDashboardTab.jsx
import { SklDashboard } from './AdminSkeleton.jsx'

const CSS = `
@keyframes kpiIn { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:none} }
@keyframes barGrow { from{height:4px} to{height:var(--bh)} }

.dash-kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.dash-kpi {
  background: #fff;
  border: 1px solid var(--cream-border);
  border-radius: var(--radius);
  padding: 1.25rem 1.5rem;
  animation: kpiIn .45s ease both;
  transition: box-shadow .2s, transform .2s;
}
.dash-kpi:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
.dash-kpi-label { font-family:'Lato',sans-serif; font-size:.75rem; font-weight:700; text-transform:uppercase; letter-spacing:.06em; color:var(--text-muted); margin-bottom:.35rem; }
.dash-kpi-val   { font-family:'Playfair Display',Georgia,serif; font-size:2rem; font-weight:700; color:var(--green-dark); line-height:1; }

.dash-charts-grid {
  display: grid;
  grid-template-columns: 1fr 270px;
  gap: 1.5rem;
  align-items: start;
}
.dash-bar-area  { display:flex; align-items:flex-end; gap:.5rem; height:110px; overflow-x:auto; padding-bottom:.25rem; border-bottom:1.5px solid var(--cream-border); }
.dash-bar-item  { flex:0 0 auto; min-width:34px; display:flex; flex-direction:column; align-items:center; gap:.3rem; }
.dash-bar       { width:100%; background:var(--green-dark); border-radius:4px 4px 0 0; cursor:default; transition:background .2s; }
.dash-bar:hover { background:var(--green-light); }
.dash-bar-cnt   { font-size:.63rem; color:var(--text-muted); font-weight:700; }
.dash-bar-date  { font-size:.62rem; color:var(--text-muted); white-space:nowrap; }

.dash-alert-hdr { background:var(--green-dark); color:#fff; border-radius:var(--radius-sm); padding:.75rem 1.25rem; font-family:'Playfair Display',Georgia,serif; font-weight:700; text-align:center; margin-bottom:.75rem; }
.dash-alert-row { display:flex; align-items:flex-start; gap:.6rem; padding:.7rem 1rem; background:#fff; border-radius:var(--radius-sm); border:1px solid var(--cream-border); border-left:3px solid var(--orange); margin-bottom:.5rem; font-size:.83rem; }
.dash-summary-row { display:flex; justify-content:space-between; font-size:.85rem; padding:.35rem 0; border-bottom:1px solid var(--cream-border); }
.dash-summary-row:last-child { border-bottom:none; }

@media(max-width:1024px) { .dash-kpi-grid{grid-template-columns:repeat(2,1fr)} .dash-charts-grid{grid-template-columns:1fr} }
@media(max-width:480px)  { .dash-kpi-grid{grid-template-columns:1fr 1fr} .dash-kpi-val{font-size:1.5rem} }
`

const COLORS = ['#1a3c2e','#e8431a','#c9a84c','#4a8c60','#7c3aed','#e2d9c8']

function DonutChart({ distribution }) {
  const total = distribution.reduce((s, d) => s + d.count, 0)
  let offset = 0
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'2rem', flexWrap:'wrap' }}>
      <div style={{ width:150, height:150, flexShrink:0 }}>
        <svg viewBox="0 0 36 36" style={{ width:150, height:150, transform:'rotate(-90deg)' }}>
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f0ebe0" strokeWidth="3.5" />
          {distribution.length === 0
            ? <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2d9c8" strokeWidth="3.5" />
            : distribution.map((d, i) => {
                const dash = total > 0 ? (d.count / total) * 100 : 0
                const el = <circle key={d.prize_id} cx="18" cy="18" r="15.9" fill="none"
                  stroke={COLORS[i % COLORS.length]} strokeWidth="3.5"
                  strokeDasharray={`${dash} ${100 - dash}`} strokeDashoffset={-offset} />
                offset += dash
                return el
              })
          }
        </svg>
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        {distribution.length === 0
          ? <p style={{ color:'var(--text-muted)', fontSize:'.85rem' }}>Aucune donnée</p>
          : distribution.map((d, i) => (
              <div key={d.prize_id} style={{ display:'flex', alignItems:'center', gap:'.5rem', marginBottom:'.45rem', fontSize:'.83rem' }}>
                <span style={{ width:9, height:9, borderRadius:'50%', background:COLORS[i%COLORS.length], flexShrink:0 }} />
                <span style={{ flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{d.prize_name}</span>
                <strong style={{ color:'var(--green-dark)', flexShrink:0 }}>{d.count}</strong>
              </div>
            ))
        }
        {total > 0 && <div style={{ fontSize:'.72rem', color:'var(--text-muted)', marginTop:'.4rem' }}>{total} gains total</div>}
      </div>
    </div>
  )
}

export default function AdminDashboardTab({ stats, loading }) {
  if (loading) return <SklDashboard />

  const dist    = stats?.prize_distribution || []
  const alerts  = stats?.low_stock_alerts   || []
  const tpd     = stats?.tickets_per_day    || []
  const maxC    = Math.max(...tpd.map(d => d.count), 1)

  const kpis = [
    { label:'Participations', val:stats?.total_participations },
    { label:'Gagnants',       val:stats?.total_winners        },
    { label:'Réclamations',   val:stats?.total_redemptions    },
    { label:'En attente',     val:stats?.pending_redemptions  },
  ]

  return (
    <>
      <style>{CSS}</style>
      <div style={{ padding:'1.75rem' }}>

        {/* KPI */}
        <div className="dash-kpi-grid">
          {kpis.map(({ label, val }, i) => (
            <div key={label} className="dash-kpi" style={{ animationDelay:`${i*.08}s` }}>
              <div className="dash-kpi-label">{label}</div>
              <div className="dash-kpi-val">{val ?? '—'}</div>
            </div>
          ))}
        </div>

        {/* Charts + sidebar */}
        <div className="dash-charts-grid">
          <div>
            <div className="card" style={{ padding:'1.75rem', marginBottom:'1.25rem' }}>
              <h3 style={{ fontFamily:"'Playfair Display',Georgia,serif", textAlign:'center', marginBottom:'1.5rem', fontSize:'1rem' }}>
                Répartition des gains
              </h3>
              <DonutChart distribution={dist} />
            </div>

            <div className="card" style={{ padding:'1.75rem' }}>
              <h3 style={{ fontFamily:"'Playfair Display',Georgia,serif", textAlign:'center', marginBottom:'1.25rem', fontSize:'1rem' }}>
                Tickets utilisés — 30 derniers jours
              </h3>
              {tpd.length === 0
                ? <p style={{ textAlign:'center', color:'var(--text-muted)', fontSize:'.85rem', padding:'1rem 0' }}>Aucune donnée</p>
                : <div className="dash-bar-area">
                    {tpd.map((d, i) => (
                      <div key={i} className="dash-bar-item">
                        <span className="dash-bar-cnt">{d.count}</span>
                        <div className="dash-bar" title={`${d.count} ticket(s)`}
                          style={{ height:`${Math.max((d.count/maxC)*100,4)}px` }} />
                        <span className="dash-bar-date">
                          {new Date(d.date).toLocaleDateString('fr-FR',{day:'2-digit',month:'2-digit'})}
                        </span>
                      </div>
                    ))}
                  </div>
              }
            </div>
          </div>

          <div style={{ position:'sticky', top:'4rem' }}>
            <div className="dash-alert-hdr">
              ⚠ Alertes stock{alerts.length > 0 && <span style={{ background:'var(--orange)', color:'#fff', fontSize:'.68rem', fontWeight:800, padding:'.1rem .45rem', borderRadius:10, marginLeft:'.5rem' }}>{alerts.length}</span>}
            </div>
            {alerts.length === 0
              ? <div className="card" style={{ padding:'.85rem 1rem', fontSize:'.83rem', color:'var(--text-muted)', textAlign:'center' }}>Tout est en ordre ✓</div>
              : alerts.map(p => (
                  <div key={p.id} className="dash-alert-row">
                    <span style={{ color:'var(--orange)', fontSize:'1rem', flexShrink:0 }}>⚠</span>
                    <div>
                      <div style={{ fontWeight:700, fontSize:'.83rem' }}>{p.name}</div>
                      <div style={{ fontSize:'.75rem', color:'var(--text-muted)' }}>{p.stock} restant{p.stock>1?'s':''}</div>
                    </div>
                  </div>
                ))
            }
            <div className="card" style={{ padding:'1.25rem', marginTop:'1rem' }}>
              <p style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:'.82rem', fontWeight:700, marginBottom:'.6rem' }}>Résumé</p>
              {[
                ['Stock total restant', stats?.prizes_remaining_stock ?? '—'],
                ['Lots en alerte',      alerts.length],
              ].map(([l, v]) => (
                <div key={l} className="dash-summary-row">
                  <span style={{ color:'var(--text-muted)' }}>{l}</span>
                  <strong>{v}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
