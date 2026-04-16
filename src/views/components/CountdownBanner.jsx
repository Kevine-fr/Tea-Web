import { useState, useEffect, useRef } from 'react'
import client from '../../api/client.js'

function useCountdown(totalSeconds) {
  const [remaining, setRemaining] = useState(0)

  // Resync quand totalSeconds arrive depuis l'API (passe de 0 à une vraie valeur)
  useEffect(() => {
    if (totalSeconds > 0) setRemaining(totalSeconds)
  }, [totalSeconds])

  useEffect(() => {
    if (remaining <= 0) return
    const id = setInterval(() => setRemaining(s => Math.max(0, s - 1)), 1000)
    return () => clearInterval(id)
  }, [remaining])

  return {
    days:    Math.floor(remaining / 86400),
    hours:   Math.floor((remaining % 86400) / 3600),
    minutes: Math.floor((remaining % 3600) / 60),
    seconds: remaining % 60,
    remaining,
  }
}

function pad(n) { return String(n).padStart(2, '0') }

const CSS = `
  @keyframes cdLeafSpin {
    from { transform: rotate(0deg) translateY(0); opacity: 0; }
    20%  { opacity: 1; }
    80%  { opacity: 1; }
    to   { transform: rotate(360deg) translateY(-60px); opacity: 0; }
  }
  @keyframes cdFlip {
    0%   { transform: translateY(0) scaleY(1); opacity: 1; }
    40%  { transform: translateY(-55%) scaleY(0.3); opacity: 0; }
    60%  { transform: translateY(55%) scaleY(0.3); opacity: 0; }
    100% { transform: translateY(0) scaleY(1); opacity: 1; }
  }
  @keyframes cdUrgentPulse {
    0%, 100% { box-shadow: 0 6px 28px rgba(0,0,0,.18), 0 0 0 2px rgba(200,100,40,.15); }
    50%       { box-shadow: 0 6px 28px rgba(0,0,0,.22), 0 0 0 4px rgba(200,100,40,.35); }
  }
  @keyframes cdSlideIn {
    from { opacity: 0; transform: translateY(20px) scale(.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes cdBlink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.15; }
  }

  /* ── Bannière principale ── */
  .cd-banner {
    position: fixed;
    bottom: 1.25rem;
    right: 1.25rem;
    z-index: 9999;
    background: var(--cream-light, #fdf9f4);
    border: 1.5px solid var(--cream-border, #e4d9cc);
    border-radius: 18px;
    box-shadow: 0 6px 28px rgba(0,0,0,.12), 0 1px 4px rgba(0,0,0,.06);
    overflow: hidden;
    max-width: calc(100vw - 2.5rem);
    font-family: var(--font-body, 'Lato', sans-serif);
    transition: opacity .35s ease, transform .3s ease, box-shadow .3s ease, border-radius .35s ease;
    animation: cdSlideIn .5s cubic-bezier(.22,.68,0,1.15) both;
    user-select: none;
  }
  .cd-banner:hover {
    box-shadow: 0 10px 36px rgba(0,0,0,.16), 0 2px 8px rgba(0,0,0,.08);
    transform: translateY(-2px);
  }
  .cd-banner.urgent {
    border-color: var(--orange, #c8723a);
    animation: cdSlideIn .5s both, cdUrgentPulse 1.2s ease-in-out 1s infinite;
  }

  /* ── Mode réduit : pill semi-transparente ── */
  .cd-banner.is-collapsed {
    opacity: 0.55;
    border-radius: 999px;
    width: fit-content;
  }
  .cd-banner.is-collapsed:hover {
    opacity: 1;
  }

  /* ── Barre de progression ── */
  .cd-progress { height: 3px; background: var(--cream-border, #e4d9cc); overflow: hidden; }
  .cd-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--orange, #c8723a), #e89060);
    border-radius: 2px;
    transition: width 1s linear;
  }

  /* ── Bouton toggle ── */
  .cd-toggle {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 9px 14px;
    background: none;
    border: none;
    cursor: pointer;
    width: 100%;
    text-align: left;
    color: var(--text-dark, #2a2a2a);
    font-family: inherit;
    transition: background .18s ease, padding .3s ease, width .35s ease;
    white-space: nowrap;
  }
  .cd-banner.is-collapsed .cd-toggle {
    width: auto;
    gap: 6px;
    padding: 8px 12px;
  }
  .cd-toggle:hover { background: rgba(200,114,58,.05); }

  .cd-toggle-icon {
    font-size: .85rem;
    color: var(--orange, #c8723a);
    transition: transform .3s ease;
    flex-shrink: 0;
  }
  .cd-toggle-icon.open { transform: rotate(180deg); }

  /* Label visible seulement quand déployé */
  .cd-toggle-label {
    font-size: .72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .08em;
    color: var(--green-dark, #1a3c2e);
    overflow: hidden;
    max-width: 200px;
    transition: max-width .35s ease, opacity .3s ease, flex .35s ease;
    flex: 1;
  }
  .cd-toggle-label.hidden {
    display: none;
  }

  /* Timer preview dans le toggle */
  .cd-preview {
    font-size: .78rem;
    color: var(--orange, #c8723a);
    font-weight: 700;
    letter-spacing: .04em;
    flex-shrink: 0;
  }

  /* ── Corps dépliable ── */
  .cd-body {
    overflow: hidden;
    transition: max-height .4s cubic-bezier(.4,0,.2,1), opacity .3s ease, padding .35s;
  }
  .cd-body.open   { max-height: 180px; opacity: 1; padding: 2px 14px 14px; }
  .cd-body.closed { max-height: 0;     opacity: 0; padding: 0 14px; }

  /* ── Unités ── */
  .cd-units-row { display: flex; align-items: center; gap: 5px; justify-content: center; flex-wrap: nowrap; }
  .cd-unit { display: flex; flex-direction: column; align-items: center; gap: 4px; }

  .cd-card {
    width: 52px; height: 50px;
    border-radius: 10px;
    background: var(--cream, #faf7f2);
    border: 1.5px solid var(--cream-border, #e4d9cc);
    display: flex; align-items: center; justify-content: center;
    overflow: hidden; position: relative;
    box-shadow: 0 2px 8px rgba(0,0,0,.06), inset 0 1px 0 rgba(255,255,255,.8);
  }
  .cd-card::after {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 50%;
    background: linear-gradient(180deg, rgba(255,255,255,.4) 0%, transparent 100%);
    pointer-events: none; border-radius: 10px 10px 0 0;
  }

  .cd-digit {
    font-size: 1.35rem; font-weight: 800;
    color: var(--green-dark, #1a3c2e);
    letter-spacing: .02em; font-variant-numeric: tabular-nums; line-height: 1;
  }
  .cd-digit.flipping { animation: cdFlip .32s cubic-bezier(.4,0,.2,1); }
  .cd-digit.urgent   { color: var(--orange, #c8723a); }

  .cd-sep   { width: 32px; height: 1px; background: var(--cream-border, #e4d9cc); border-radius: 1px; }
  .cd-label { font-size: .58rem; text-transform: uppercase; letter-spacing: .08em; color: var(--text-muted, #888); font-weight: 600; }

  .cd-colon {
    font-size: 1.3rem; font-weight: 800;
    color: var(--orange, #c8723a);
    margin-bottom: 20px; opacity: .7; min-width: 8px; text-align: center;
    animation: cdBlink 1s ease-in-out infinite;
  }

  .cd-leaf { position: absolute; pointer-events: none; font-size: .85rem; animation: cdLeafSpin ease-out forwards; }

  /* ── Responsive ── */
  @media (max-width: 480px) {
    .cd-banner {
      bottom: 0.75rem;
      right: 0.75rem;
      left: 0.75rem;
      border-radius: 14px;
      max-width: none;
    }
    .cd-banner.is-collapsed {
      left: auto;
      border-radius: 999px;
    }
    .cd-card  { width: 44px; height: 42px; }
    .cd-digit { font-size: 1.1rem; }
    .cd-colon { font-size: 1rem; margin-bottom: 18px; }
    .cd-units-row { gap: 3px; }
    .cd-label { font-size: .52rem; }
  }

  @media (max-width: 360px) {
    .cd-card  { width: 38px; height: 36px; }
    .cd-digit { font-size: .95rem; }
    .cd-sep   { width: 26px; }
    .cd-label { display: none; }
  }
`

function FlipUnit({ value, label, urgent }) {
  const [flipping, setFlipping] = useState(false)
  const prev = useRef(value)
  useEffect(() => {
    if (prev.current !== value) {
      setFlipping(true)
      prev.current = value
      const t = setTimeout(() => setFlipping(false), 320)
      return () => clearTimeout(t)
    }
  }, [value])
  return (
    <div className="cd-unit">
      <div className="cd-card">
        <span className={`cd-digit${flipping ? ' flipping' : ''}${urgent ? ' urgent' : ''}`}>
          {pad(value)}
        </span>
      </div>
      <div className="cd-sep" />
      <span className="cd-label">{label}</span>
    </div>
  )
}

function Colon() {
  return <div className="cd-colon">:</div>
}

function LeafBurst({ active }) {
  if (!active) return null
  return (
    <>
      {['🍃','🌿','🍵','🌱'].map((l, i) => (
        <div key={i} className="cd-leaf" style={{
          left: `${15 + i * 20}%`, bottom: '10px',
          animationDuration: `${1.2 + i * 0.2}s`,
          animationDelay: `${i * 0.1}s`,
        }}>{l}</div>
      ))}
    </>
  )
}

export default function CountdownBanner() {
  const [initialSeconds, setInitialSeconds] = useState(null)
  const [error, setError]                   = useState(false)
  const [collapsed, setCollapsed]            = useState(false)
  const [burst, setBurst]                    = useState(false)

  // Charge la période depuis l'API
  useEffect(() => {
    client.get('game-period')
      .then(r => {
        const data = r.data?.data ?? r.data
        const secs = data?.remaining_seconds ?? null
        if (secs !== null && secs > 0) setInitialSeconds(secs)
        else setError(true)
      })
      .catch(() => setError(true))
  }, [])

  const { days, hours, minutes, seconds, remaining } = useCountdown(initialSeconds ?? 0)
  const isUrgent = remaining > 0 && remaining < 3600
  const prevSec = useRef(seconds)

  useEffect(() => {
    if (prevSec.current !== seconds && seconds === 0 && remaining > 0) {
      setBurst(true)
      setTimeout(() => setBurst(false), 1500)
    }
    prevSec.current = seconds
  }, [seconds, remaining])

  // Rien à afficher si pas de période ou période terminée
  if (error || initialSeconds === null) return null
  if (remaining <= 0) return null

  return (
    <>
      <style>{CSS}</style>
      <div className={`cd-banner${isUrgent ? ' urgent' : ''}${collapsed ? ' is-collapsed' : ''}`}>
        <LeafBurst active={burst} />

        {/* Barre de progression */}
        <div className="cd-progress">
          <div className="cd-progress-fill" style={{
            width: `${((initialSeconds - remaining) / initialSeconds) * 100}%`,
          }} />
        </div>

        {/* Header toggle */}
        <button
          className="cd-toggle"
          onClick={() => setCollapsed(c => !c)}
          aria-label={collapsed ? 'Déployer' : 'Réduire'}
        >
          <span className={`cd-toggle-icon${collapsed ? '' : ' open'}`}>▾</span>

          {/* Label — masqué en mode réduit */}
          <span className={`cd-toggle-label${collapsed ? ' hidden' : ''}`}>
            {isUrgent ? '⚡ Fin imminente !' : '🍵 Fin du jeu dans'}
          </span>

          {/* Timer toujours visible dans le header */}
          <span className="cd-preview">
            {pad(days)}j {pad(hours)}h {pad(minutes)}m {pad(seconds)}s
          </span>
        </button>

        {/* Corps dépliable */}
        <div className={`cd-body ${collapsed ? 'closed' : 'open'}`}>
          <div className="cd-units-row">
            <FlipUnit value={days}    label="jours"    urgent={isUrgent} />
            <Colon />
            <FlipUnit value={hours}   label="heures"   urgent={isUrgent} />
            <Colon />
            <FlipUnit value={minutes} label="minutes"  urgent={isUrgent} />
            <Colon />
            <FlipUnit value={seconds} label="secondes" urgent={isUrgent} />
          </div>
        </div>
      </div>
    </>
  )
}