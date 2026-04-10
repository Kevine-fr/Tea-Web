// src/views/admin/AdminSkeleton.jsx

const SKL_CSS = `
@keyframes sklShimmer {
  0%   { background-position: -600px 0; }
  100% { background-position:  600px 0; }
}
.skl {
  background: linear-gradient(90deg, #ece6dc 25%, #f5f0e8 50%, #ece6dc 75%);
  background-size: 600px 100%;
  animation: sklShimmer 1.4s linear infinite;
  border-radius: 6px;
  display: block;
}
`

function injectSkelCSS() {
  if (!document.getElementById('skl-css')) {
    const el = document.createElement('style')
    el.id = 'skl-css'
    el.textContent = SKL_CSS
    document.head.appendChild(el)
  }
}

/* ── Bloc rectangle ──────────────────────────────────────── */
export function Skl({ w = '100%', h = 14, mb = 0, style = {} }) {
  injectSkelCSS()
  return <span className="skl" style={{ width: w, height: h, marginBottom: mb, ...style }} />
}

/* ── Rangée de table ─────────────────────────────────────── */
export function SklTableRow({ cols = 5 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} style={{ padding: '.8rem 1.25rem', borderBottom: '1px solid var(--cream-border)' }}>
          <Skl w={i === 0 ? 90 : i === cols - 1 ? 60 : '80%'} h={13} />
        </td>
      ))}
    </tr>
  )
}

/* ── Tableau complet ─────────────────────────────────────── */
export function SklTable({ cols = 5, rows = 6, headers = [] }) {
  injectSkelCSS()
  return (
    <div className="card" style={{ overflow: 'auto' }}>
      <table className="tbl">
        <thead>
          <tr>
            {(headers.length ? headers : Array.from({ length: cols })).map((h, i) => (
              <th key={i}>{h || <Skl w={60 + i * 10} h={11} />}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => <SklTableRow key={i} cols={cols} />)}
        </tbody>
      </table>
    </div>
  )
}

/* ── Grille de cartes ────────────────────────────────────── */
export function SklCards({ count = 4, cols = 'repeat(auto-fill, minmax(260px, 1fr))' }) {
  injectSkelCSS()
  return (
    <div style={{ display: 'grid', gridTemplateColumns: cols, gap: '1rem' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
          <Skl w="60%" h={15} />
          <Skl w="90%" h={11} />
          <Skl w="100%" h={6} style={{ borderRadius: 4 }} />
          <Skl w="50%" h={11} />
        </div>
      ))}
    </div>
  )
}

/* ── KPI row ─────────────────────────────────────────────── */
export function SklKpis({ count = 4 }) {
  injectSkelCSS()
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${count}, 1fr)`, gap: '1rem', marginBottom: '1.5rem' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card" style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
          <Skl w="60%" h={11} />
          <Skl w="40%" h={28} />
        </div>
      ))}
    </div>
  )
}

/* ── Dashboard skeleton ──────────────────────────────────── */
export function SklDashboard() {
  injectSkelCSS()
  return (
    <div style={{ padding: '1.75rem' }}>
      <SklKpis count={4} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.5rem' }}>
        <div>
          <div className="card" style={{ padding: '1.75rem', marginBottom: '1.25rem' }}>
            <Skl w="50%" h={15} mb={20} style={{ margin: '0 auto 1.25rem' }} />
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
              <Skl w={150} h={150} style={{ borderRadius: '50%', flexShrink: 0 }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
                {[80, 65, 70, 55].map((w, i) => <Skl key={i} w={`${w}%`} h={13} />)}
              </div>
            </div>
          </div>
          <div className="card" style={{ padding: '1.75rem' }}>
            <Skl w="50%" h={15} mb={20} style={{ margin: '0 auto 1.25rem' }} />
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '.5rem', height: 110 }}>
              {[60, 40, 75, 55, 90, 45, 70].map((h, i) => <Skl key={i} w={34} h={h} style={{ borderRadius: '4px 4px 0 0', flexShrink: 0 }} />)}
            </div>
          </div>
        </div>
        <div>
          <Skl w="100%" h={42} style={{ borderRadius: 8, marginBottom: '.75rem' }} />
          {[1, 2, 3].map(i => <div key={i} className="card" style={{ padding: '.85rem', marginBottom: '.5rem' }}><Skl w="80%" h={13} /></div>)}
        </div>
      </div>
    </div>
  )
}
