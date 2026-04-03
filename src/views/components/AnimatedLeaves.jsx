// src/views/components/AnimatedLeaves.jsx

import { useMemo } from 'react'

const COLORS = [
  { fill: '#4a7c59', hl: '#6aaa7a', vein: '#2d5c3a' },
  { fill: '#3d6b4a', hl: '#5a8c65', vein: '#254e35' },
  { fill: '#527a56', hl: '#72a876', vein: '#335840' },
  { fill: '#3a6e50', hl: '#56906e', vein: '#225038' },
  { fill: '#456b52', hl: '#62926a', vein: '#2d5040' },
  { fill: '#4e8060', hl: '#6da880', vein: '#306048' },
]

const CSS = `
  @keyframes tttFall {
    0%   { transform: translateY(-180px); opacity: 0; }
    8%   { opacity: 1; }
    88%  { opacity: 1; }
    100% { transform: translateY(calc(100vh + 180px)); opacity: 0; }
  }
  @keyframes tttSway1 {
    0%,100% { transform: translateX(-45px) rotate(-20deg); }
    50%     { transform: translateX( 45px) rotate( 20deg); }
  }
  @keyframes tttSway2 {
    0%,100% { transform: translateX(-65px) rotate(-28deg); }
    50%     { transform: translateX( 65px) rotate( 28deg); }
  }
  @keyframes tttSway3 {
    0%,100% { transform: translateX(-25px) rotate(-12deg); }
    50%     { transform: translateX( 25px) rotate( 12deg); }
  }
  @keyframes tttSway4 {
    0%     { transform: translateX(-50px) rotate(-22deg); }
    38%    { transform: translateX( 42px) rotate( 20deg); }
    68%    { transform: translateX(-18px) rotate( -9deg); }
    100%   { transform: translateX(-50px) rotate(-22deg); }
  }
  @keyframes tttSway5 {
    0%,100% { transform: translateX(-35px) rotate(-16deg); }
    30%     { transform: translateX( 58px) rotate( 26deg); }
    70%     { transform: translateX(-12px) rotate( -6deg); }
  }
  @keyframes tttSway6 {
    0%   { transform: translateX(-22px) rotate(  0deg); }
    100% { transform: translateX( 22px) rotate(360deg); }
  }
`

const SWAYLIST = ['tttSway1','tttSway2','tttSway3','tttSway4','tttSway5','tttSway6']

/* Flou par "couche de profondeur" — 0 = net, 1 = flou doux, 2 = très flou */
const BLUR_LEVELS = [0, 0, 0, 0.6, 0.6, 1.2, 1.2, 2.0]

function TeaLeaf({ w, c }) {
  const h  = w * 2.65
  const mx = w / 2
  const sw = Math.max(0.8, w * 0.048)
  const vw = Math.max(0.5, w * 0.030)

  const body = [
    `M${mx} 3`,
    `C${w*0.83} ${h*0.13}, ${w*0.92} ${h*0.38}, ${w*0.87} ${h*0.60}`,
    `C${w*0.81} ${h*0.80}, ${w*0.63} ${h*0.94}, ${mx} ${h-2}`,
    `C${w*0.37} ${h*0.94}, ${w*0.19} ${h*0.80}, ${w*0.13} ${h*0.60}`,
    `C${w*0.08} ${h*0.38}, ${w*0.17} ${h*0.13}, ${mx} 3Z`,
  ].join(' ')

  const shine = [
    `M${mx} 3`,
    `C${mx+w*0.12} ${h*0.13}, ${mx+w*0.14} ${h*0.38}, ${mx+w*0.10} ${h*0.60}`,
    `C${mx+w*0.06} ${h*0.80}, ${mx+w*0.02} ${h*0.93}, ${mx} ${h-2}`,
    `C${mx-w*0.04} ${h*0.93}, ${mx-w*0.05} ${h*0.80}, ${mx-w*0.02} ${h*0.60}`,
    `C${mx-w*0.06} ${h*0.38}, ${mx-w*0.04} ${h*0.13}, ${mx} 3Z`,
  ].join(' ')

  const veins = [[0.27,0.34],[0.44,0.51],[0.62,0.68]]

  return (
    <svg viewBox={`0 0 ${w} ${h+10}`} width={w} height={h+10} style={{ display:'block', overflow:'visible' }}>
      <path d={body} fill={c.fill} />
      <path d={shine} fill={c.hl} opacity="0.38" />
      <path
        d={`M${mx} 5 Q${mx+w*0.04} ${h*0.5} ${mx} ${h-3}`}
        stroke={c.vein} strokeWidth={sw} fill="none" strokeLinecap="round" opacity="0.72"
      />
      {veins.map(([y, ye], i) => (
        <path key={`L${i}`}
          d={`M${mx} ${h*y} Q${w*0.22} ${h*((y+ye)/2+0.02)} ${w*0.16} ${h*ye}`}
          stroke={c.vein} strokeWidth={vw} fill="none" strokeLinecap="round" opacity={0.60-i*0.08}
        />
      ))}
      {veins.map(([y, ye], i) => (
        <path key={`R${i}`}
          d={`M${mx} ${h*y} Q${w*0.78} ${h*((y+ye)/2+0.02)} ${w*0.84} ${h*ye}`}
          stroke={c.vein} strokeWidth={vw} fill="none" strokeLinecap="round" opacity={0.60-i*0.08}
        />
      ))}
      <path
        d={`M${mx} ${h-2} Q${mx-w*0.04} ${h+4} ${mx+w*0.02} ${h+9}`}
        stroke={c.vein} strokeWidth={sw*1.1} fill="none" strokeLinecap="round" opacity="0.68"
      />
    </svg>
  )
}

function makeLeaves(n = 28) {
  return Array.from({ length: n }, (_, i) => {
    const g  = i * 137.508
    const g2 = i * 61.803
    const blurIdx = Math.floor(g2 * 3.7) % BLUR_LEVELS.length
    return {
      id:      i,
      left:    `${(g % 88 + 4).toFixed(1)}%`,
      /* ↑ tailles plus grandes : 34 → 68px */
      size:    34 + Math.floor(g2 % 34),
      /* ↑ chute plus lente et gracieuse */
      fallDur: 12 + (g  % 12),
      /* ↑ balancement plus lent */
      swayDur: 3.5 + (g2 % 6),
      delay:   -((g  * 1.3) % 20),
      sway:    SWAYLIST[i % SWAYLIST.length],
      color:   COLORS[i % COLORS.length],
      opacity: 0.52 + (g2 % 26) / 100,
      blur:    BLUR_LEVELS[blurIdx],
      flip:    i % 4 === 0,
    }
  })
}

export default function AnimatedLeaves({ style = {} }) {
  const leaves = useMemo(() => makeLeaves(28), [])

  return (
    <>
      <style>{CSS}</style>
      <div style={{
        position: 'absolute', inset: 0,
        overflow: 'hidden', pointerEvents: 'none', zIndex: 0,
        ...style,
      }}>
        {leaves.map(l => (
          <div key={l.id} style={{
            position:   'absolute',
            left:        l.left,
            top:         0,
            /* cubic-bezier léger pour un démarrage et une fin plus doux */
            animation:  `tttFall ${l.fallDur}s cubic-bezier(0.40, 0, 0.60, 1) ${l.delay}s infinite`,
            willChange: 'transform, opacity',
          }}>
            <div style={{
              opacity:    l.opacity,
              transform:  l.flip ? 'scaleX(-1)' : undefined,
              animation:  `${l.sway} ${l.swayDur}s ease-in-out ${l.delay}s infinite`,
              willChange: 'transform',
              /* flou pour l'effet de profondeur de champ */
              filter:     l.blur > 0 ? `blur(${l.blur}px)` : undefined,
            }}>
              <TeaLeaf w={l.size} c={l.color} />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}