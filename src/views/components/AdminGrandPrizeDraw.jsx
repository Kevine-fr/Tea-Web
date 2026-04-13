// src/views/admin/AdminGrandPrizeDraw.jsx
import { useState, useEffect, useRef, useCallback } from 'react'
import { adminApi } from '../../api/admin.js'
import toast from 'react-hot-toast'

const CSS = `
/* ══════════════════════════════════════════════════════════
   KEYFRAMES
══════════════════════════════════════════════════════════ */
@keyframes gpd-fadeIn    { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
@keyframes gpd-scaleIn   { from{opacity:0;transform:scale(.85)} to{opacity:1;transform:scale(1)} }
@keyframes gpd-shimmer   { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
@keyframes gpd-glow      { 0%,100%{box-shadow:0 0 0 0 rgba(212,175,55,.4)} 50%{box-shadow:0 0 18px 4px rgba(212,175,55,.25)} }
@keyframes gpd-spin      { from{transform:translateY(0)} to{transform:translateY(-100%)} }
@keyframes gpd-pulse     { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }
@keyframes gpd-confetti-fall {
  0%   { transform:translateY(-20px) rotate(0deg) scale(1); opacity:1; }
  80%  { opacity:1; }
  100% { transform:translateY(340px) rotate(720deg) scale(.5); opacity:0; }
}
@keyframes gpd-winner-in {
  0%   { opacity:0; transform:scale(.7) rotate(-4deg); }
  60%  { transform:scale(1.06) rotate(1deg); }
  100% { opacity:1; transform:scale(1) rotate(0deg); }
}
@keyframes gpd-crown     { 0%,100%{transform:translateY(0) rotate(-5deg)} 50%{transform:translateY(-5px) rotate(5deg)} }
@keyframes gpd-star-spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
@keyframes gpd-ticker    {
  0%   { transform:translateY(0); }
  100% { transform:translateY(calc(-100% + 64px)); }
}
@keyframes gpd-btn-ready {
  0%,100%{ box-shadow:0 0 0 0 rgba(200,100,40,.5); }
  50%    { box-shadow:0 0 0 10px rgba(200,100,40,0); }
}

/* ══════════════════════════════════════════════════════════
   LAYOUT
══════════════════════════════════════════════════════════ */
.gpd-wrap {
  max-width: 700px; margin: 0 auto; padding: 2rem 1.5rem;
  font-family: 'Lato', sans-serif;
  animation: gpd-fadeIn .4s ease both;
}

/* ── Hero card ─────────────────────────────────────────── */
.gpd-hero {
  background: var(--green-dark, #1a3c2e);
  border-radius: 16px; padding: 2.5rem 2rem;
  text-align: center; margin-bottom: 1.5rem;
  position: relative; overflow: hidden;
}
.gpd-hero-label {
  font-family: 'Playfair Display', Georgia, serif;
  color: rgba(255,255,255,.55); font-size: .78rem;
  letter-spacing: .12em; text-transform: uppercase;
  font-weight: 700; margin-bottom: .5rem;
}
.gpd-hero-title {
  font-family: 'Playfair Display', Georgia, serif;
  color: #fff; font-size: 1.65rem; font-weight: 700;
  margin-bottom: .35rem; line-height: 1.2;
}
.gpd-hero-sub {
  color: rgba(255,255,255,.5); font-size: .85rem;
  margin-bottom: 0;
}
.gpd-gold-line {
  width: 48px; height: 2px;
  background: var(--gold, #d4af37);
  margin: 1rem auto;
  border-radius: 2px;
}

/* ── Slot machine ──────────────────────────────────────── */
.gpd-slot-outer {
  background: rgba(0,0,0,.3);
  border: 2px solid var(--gold, #d4af37);
  border-radius: 10px;
  overflow: hidden;
  height: 64px;
  position: relative;
  margin: 1.5rem 0 1.25rem;
}
.gpd-slot-track {
  position: absolute; width: 100%;
  transition: none;
}
.gpd-slot-item {
  height: 64px; display: flex; align-items: center;
  justify-content: center;
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.05rem; font-weight: 700;
  color: #fff; letter-spacing: .01em;
  padding: 0 1rem;
}
/* Overlay gradients top/bottom */
.gpd-slot-outer::before,
.gpd-slot-outer::after {
  content: ''; position: absolute; left: 0; right: 0; z-index: 2; height: 18px; pointer-events: none;
}
.gpd-slot-outer::before { top: 0;    background: linear-gradient(to bottom, rgba(26,60,46,1), transparent); }
.gpd-slot-outer::after  { bottom: 0; background: linear-gradient(to top,   rgba(26,60,46,1), transparent); }

/* ── CTA button ────────────────────────────────────────── */
.gpd-btn {
  display: inline-flex; align-items: center; gap: .5rem;
  padding: .9rem 2.5rem; border-radius: var(--radius-pill, 999px);
  background: var(--orange, #e8431a);
  color: #fff; font-family: 'Lato', sans-serif;
  font-size: .95rem; font-weight: 800; letter-spacing: .02em;
  border: none; cursor: pointer;
  transition: transform .18s ease, background .18s ease, opacity .18s;
  animation: gpd-btn-ready 2s ease-in-out infinite;
}
.gpd-btn:hover:not(:disabled) { transform: translateY(-2px); background: #d03a14; animation: none; }
.gpd-btn:active:not(:disabled) { transform: scale(.97); }
.gpd-btn:disabled { opacity: .55; cursor: not-allowed; animation: none; }

/* ── Winner card ───────────────────────────────────────── */
.gpd-winner-card {
  background: #fff;
  border: 2px solid var(--gold, #d4af37);
  border-radius: 16px;
  padding: 2rem 1.5rem;
  text-align: center;
  animation: gpd-winner-in .55s cubic-bezier(.34,1.3,.64,1) both;
  position: relative; overflow: hidden;
  animation: gpd-glow 3s ease-in-out infinite;
}
.gpd-winner-crown {
  font-size: 2.5rem; display: block;
  animation: gpd-crown 2s ease-in-out infinite;
  margin-bottom: .5rem;
}
.gpd-winner-name {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.65rem; font-weight: 700;
  color: var(--green-dark, #1a3c2e);
  margin-bottom: .25rem;
}
.gpd-winner-email {
  font-size: .88rem; color: var(--text-muted, #888);
  margin-bottom: 1rem;
}
.gpd-winner-prize {
  display: inline-flex; align-items: center; gap: .4rem;
  background: var(--green-dark, #1a3c2e); color: #fff;
  padding: .45rem 1.1rem; border-radius: 999px;
  font-size: .85rem; font-weight: 700;
}
.gpd-winner-meta {
  font-size: .78rem; color: var(--text-muted, #888);
  margin-top: .85rem;
}

/* ── Confetti ──────────────────────────────────────────── */
.gpd-confetti-wrap {
  position: absolute; inset: 0; pointer-events: none; overflow: hidden; z-index: 10;
}
.gpd-confetto {
  position: absolute; top: -10px;
  width: 8px; height: 8px;
  border-radius: 2px;
  animation: gpd-confetti-fall linear both;
}

/* ── Info card ─────────────────────────────────────────── */
.gpd-info-card {
  background: #fff;
  border: 1px solid var(--cream-border, #e8e0d0);
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  font-size: .84rem;
  color: var(--text-muted, #888);
  margin-top: 1rem;
}
.gpd-info-card p { margin: .35rem 0; }
.gpd-info-card strong { color: var(--text-dark, #333); }

/* ── History row ───────────────────────────────────────── */
.gpd-history-label {
  font-size: .72rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: .07em; color: var(--text-muted, #888);
  margin: 1.5rem 0 .6rem;
}
.gpd-prev-winner {
  background: #fff; border: 1px solid var(--cream-border, #e8e0d0);
  border-left: 3px solid var(--gold, #d4af37);
  border-radius: 8px; padding: .85rem 1.1rem;
  display: flex; align-items: center; gap: 1rem;
  font-size: .85rem;
  animation: gpd-fadeIn .35s ease both;
}
.gpd-prev-winner-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: var(--green-dark, #1a3c2e);
  color: #fff; font-size: .8rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

/* ── Spinner overlay ───────────────────────────────────── */
.gpd-spinner {
  width: 28px; height: 28px;
  border: 3px solid rgba(255,255,255,.25);
  border-top-color: #fff;
  border-radius: 50%;
  animation: gpd-star-spin .7s linear infinite;
  display: inline-block; flex-shrink: 0;
}

@media(prefers-reduced-motion:reduce) {
  .gpd-winner-crown, .gpd-btn, .gpd-winner-card,
  .gpd-confetto, .gpd-hero, .gpd-slot-track { animation: none !important; }
}
`

// Noms fictifs pour le défilement du slot (esthétique uniquement)
const DUMMY_NAMES = [
  'Marie Dupont', 'Jean-Paul Martin', 'Sophie Bernard', 'Lucas Petit',
  'Emma Leroy', 'Thomas Moreau', 'Clara Simon', 'Antoine Lefebvre',
  'Camille Rousseau', 'Julien Fontaine', 'Manon Girard', 'Nicolas Blanc',
  'Inès Chevalier', 'Alexandre Faure', 'Léa Mercier', 'Hugo Lambert',
]

const CONFETTI_COLORS = ['#d4af37','#e8431a','#1a3c2e','#fff','#f5c842','#e07b39']

function Confetti() {
  const pieces = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    left:     `${Math.random() * 100}%`,
    color:    CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    delay:    `${Math.random() * 1.2}s`,
    duration: `${1.8 + Math.random() * 1.4}s`,
    size:     `${6 + Math.random() * 8}px`,
    rotate:   Math.random() > .5 ? '2px' : '0px',
  }))

  return (
    <div className="gpd-confetti-wrap">
      {pieces.map(p => (
        <div key={p.id} className="gpd-confetto" style={{
          left: p.left,
          background: p.color,
          width: p.size, height: p.size,
          borderRadius: p.rotate,
          animationDelay: p.delay,
          animationDuration: p.duration,
        }} />
      ))}
    </div>
  )
}

function SlotMachine({ phase }) {
  const trackRef    = useRef(null)
  const intervalRef = useRef(null)
  const indexRef    = useRef(0)
  const [items, setItems] = useState(() => [...DUMMY_NAMES].sort(() => Math.random() - .5))

  useEffect(() => {
    if (phase === 'idle' || phase === 'done') return

    // Vitesse selon la phase
    const speeds = { spinning: 60, slowing: 200, revealing: 500 }
    const speed  = speeds[phase] ?? 80

    if (intervalRef.current) clearInterval(intervalRef.current)

    intervalRef.current = setInterval(() => {
      indexRef.current = (indexRef.current + 1) % DUMMY_NAMES.length
      if (trackRef.current) {
        // Décale le track vers le haut d'un item (64px)
        const current = parseInt(trackRef.current.style.transform?.replace(/[^-\d]/g, '') || '0', 10)
        const next    = current - 64
        trackRef.current.style.transition = `transform ${speed * .9}ms ease`
        trackRef.current.style.transform  = `translateY(${next}px)`

        // Remise à zéro discrète quand on atteint la moitié
        if (Math.abs(next) >= (items.length / 2) * 64) {
          setTimeout(() => {
            if (trackRef.current) {
              trackRef.current.style.transition = 'none'
              trackRef.current.style.transform  = 'translateY(0)'
            }
          }, speed * .9 + 10)
        }
      }
    }, speed)

    return () => clearInterval(intervalRef.current)
  }, [phase])

  if (phase === 'idle') return null

  return (
    <div className="gpd-slot-outer">
      <div className="gpd-slot-track" ref={trackRef} style={{ transform:'translateY(0)' }}>
        {/* Double la liste pour le loop infini */}
        {[...items, ...items].map((name, i) => (
          <div key={i} className="gpd-slot-item">{name}</div>
        ))}
      </div>
    </div>
  )
}

export default function AdminGrandPrizeDraw() {
  const [phase,   setPhase]  = useState('idle')    // idle | spinning | slowing | revealing | done
  const [winner,  setWinner] = useState(null)
  const [history, setHistory] = useState([])
  const timerRefs = useRef([])

  const clearTimers = () => timerRefs.current.forEach(clearTimeout)

  const handleDraw = useCallback(async () => {
  if (phase !== 'idle') return
  clearTimers()
  setPhase('spinning')

  const t1 = setTimeout(() => setPhase('slowing'),   2200)
  const t2 = setTimeout(() => setPhase('revealing'),  3800)
  timerRefs.current = [t1, t2]

  try {
    // Lance l'API en parallèle mais on attend le résultat au bout de 4.8s min
    const apiPromise = adminApi.assignAnnualTea().then(r => r?.data ?? r)

    const t3 = setTimeout(async () => {
      try {
        const result = await apiPromise
        setWinner(result)
        setHistory(h => [result, ...h].slice(0, 5))
        setPhase('done')
      } catch (err) {
        // Erreur reçue après la fin de l'animation
        const msg = err?.response?.data?.message ?? 'Erreur lors du tirage.'
        toast.error(msg)
        setPhase('idle')
      }
    }, 4800)

    timerRefs.current.push(t3)

    // Si l'API échoue AVANT 4.8s, on coupe tout immédiatement
    apiPromise.catch(err => {
      clearTimers()                     // ← annule t1, t2, t3
      const msg = err?.response?.data?.message ?? 'Erreur lors du tirage.'
      toast.error(msg)
      setPhase('idle')
    })

  } catch (err) {
    clearTimers()
    toast.error('Erreur lors du tirage.')
    setPhase('idle')
  }
}, [phase])

  const handleReset = () => {
    clearTimers()
    setPhase('idle')
    setWinner(null)
  }

  const initials = w => w
    ? `${w.user?.first_name?.[0] ?? ''}${w.user?.last_name?.[0] ?? ''}`.toUpperCase()
    : ''

  const isDrawing = ['spinning','slowing','revealing'].includes(phase)

  return (
    <>
      <style>{CSS}</style>
      <div className="gpd-wrap">

        {/* ── Hero ──────────────────────────────────────────── */}
        <div className="gpd-hero">

          {/* Confetti sur la carte hero quand winner */}
          {phase === 'done' && <Confetti />}

          <div className="gpd-hero-label">Grand tirage au sort</div>
          <div className="gpd-hero-title">1 an de thé — 360 €</div>
          <div className="gpd-gold-line" />
          <div className="gpd-hero-sub">
            Sélection aléatoire parmi tous les participants gagnants
          </div>

          {/* Slot machine */}
          <SlotMachine phase={phase} />

          {/* CTA */}
          {phase === 'idle' && (
            <button className="gpd-btn" onClick={handleDraw} style={{ marginTop: phase === 'idle' ? '1.5rem' : 0 }}>
              🎰 Lancer le tirage
            </button>
          )}
          {isDrawing && (
            <button className="gpd-btn" disabled>
              <span className="gpd-spinner" />
              Tirage en cours…
            </button>
          )}
          {phase === 'done' && (
            <button
              className="gpd-btn"
              onClick={handleReset}
              style={{ background:'rgba(255,255,255,.15)', animation:'none', marginTop:'.5rem' }}
            >
              ↺ Réinitialiser
            </button>
          )}
        </div>

        {/* ── Carte gagnant ──────────────────────────────────── */}
        {phase === 'done' && winner && (
          <div className="gpd-winner-card" style={{ marginBottom:'1.5rem' }}>
            <span className="gpd-winner-crown">👑</span>
            <div className="gpd-winner-name">
              {winner.user?.first_name} {winner.user?.last_name}
            </div>
            <div className="gpd-winner-email">{winner.user?.email}</div>
            <div className="gpd-winner-prize">
              🍵 1 an de thé (360 €) attribué
            </div>
            <div className="gpd-winner-meta">
              Participation du {new Date(winner.participation_date).toLocaleDateString('fr-FR', {
                day:'2-digit', month:'long', year:'numeric'
              })}
              {winner.ticket_code?.code && ` · Ticket ${winner.ticket_code.code}`}
            </div>
          </div>
        )}

        {/* ── Info ───────────────────────────────────────────── */}
        <div className="gpd-info-card">
          <p>🔒 <strong>Lot unique :</strong> ce prix ne peut être attribué qu'une seule fois (stock : 1).</p>
          <p>⏱  <strong>Délai :</strong> le lot n'est attribuable que 30 jours après le lancement du jeu concours.</p>
          <p>🎲 <strong>Éligibilité :</strong> seuls les participants ayant déjà remporté un lot sont inclus dans ce tirage.</p>
          <p>🚫 <strong>Exclusion :</strong> ce lot n'apparaît jamais dans le tirage automatique des participations.</p>
        </div>

        {/* ── Historique des tirages de la session ───────────── */}
        {history.length > 0 && (
          <>
            <div className="gpd-history-label">Tirage(s) effectué(s) cette session</div>
            {history.map((w, i) => (
              <div key={i} className="gpd-prev-winner" style={{ animationDelay:`${i*.07}s` }}>
                <div className="gpd-prev-winner-avatar">{initials(w)}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:700, color:'var(--text-dark,#333)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {w.user?.first_name} {w.user?.last_name}
                  </div>
                  <div style={{ fontSize:'.78rem', color:'var(--text-muted,#888)' }}>{w.user?.email}</div>
                </div>
                <div style={{ fontSize:'.75rem', color:'var(--text-muted,#888)', flexShrink:0 }}>
                  {new Date(w.participation_date).toLocaleDateString('fr-FR')}
                </div>
              </div>
            ))}
          </>
        )}

      </div>
    </>
  )
}