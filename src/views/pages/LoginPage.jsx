import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext.jsx'
import Layout from '../components/Layout.jsx'
import PageBanner from '../components/PageBanner.jsx'
import toast from 'react-hot-toast'

/* ─── Particules & Sparkles ───────────────────────────────── */
const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  id: i, left: `${5 + (i * 6.5) % 90}%`,
  size: 3 + (i % 4), dur: 8 + (i % 6),
  delay: (i * 0.8) % 9, opacity: 0.04 + (i % 4) * 0.02,
}))
const SPARKS = [
  { left: '5%',  top: '20%', s: 7,  dur: '3.6s', del: '0s'   },
  { left: '95%', top: '15%', s: 6,  dur: '4.4s', del: '1.3s' },
  { left: '10%', top: '75%', s: 9,  dur: '3.9s', del: '0.7s' },
  { left: '90%', top: '70%', s: 6,  dur: '5.0s', del: '2.2s' },
  { left: '48%', top: '8%',  s: 7,  dur: '4.2s', del: '1.6s' },
]

const STYLES = `
  /* ══════════════════════════════════
     ENTRÉES
  ══════════════════════════════════ */
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-36px) scale(.98); }
    to   { opacity: 1; transform: none; }
  }
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(36px) scale(.98); }
    to   { opacity: 1; transform: none; }
  }
  @keyframes fieldReveal {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: none; }
  }

  /* ══════════════════════════════════
     IDLE CONTINUS
  ══════════════════════════════════ */
  @keyframes particleRise {
    0%   { transform: translateY(0) rotate(0deg);   opacity:0; }
    8%   { opacity:1; }
    92%  { opacity:1; }
    100% { transform: translateY(-88vh) rotate(360deg); opacity:0; }
  }
  @keyframes sparkle {
    0%,100% { opacity:0; transform: scale(0)   rotate(0deg);   }
    40%      { opacity:1; transform: scale(1)   rotate(180deg); }
    70%      { opacity:.6; transform: scale(.7) rotate(270deg); }
  }
  @keyframes imgFloat {
    0%,100% { transform: translateY(0)    scale(1);     }
    50%      { transform: translateY(-6px) scale(1.008); }
  }
  @keyframes cardBreathe {
    0%,100% { box-shadow: 0 4px 20px rgba(0,0,0,.07); }
    50%      { box-shadow: 0 12px 38px rgba(0,0,0,.12); }
  }
  @keyframes sectionHue {
    0%,100% { background-color: var(--cream); }
    50%      { background-color: #e8d9c2; }
  }
  @keyframes decoSpin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  /* ══════════════════════════════════
     INTERACTIONS
  ══════════════════════════════════ */
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes pulse-ring {
    0%   { box-shadow: 0 0 0 0    rgba(200,100,40,.35); }
    70%  { box-shadow: 0 0 0 12px rgba(200,100,40,0);   }
    100% { box-shadow: 0 0 0 0    rgba(200,100,40,0);   }
  }
  @keyframes alertShake {
    0%,100% { transform: translateX(0); }
    20%      { transform: translateX(-6px); }
    40%      { transform: translateX(6px); }
    60%      { transform: translateX(-4px); }
    80%      { transform: translateX(4px); }
  }
  @keyframes shimmerSweep {
    0%   { transform: translateX(-130%) skewX(-12deg); }
    100% { transform: translateX(230%)  skewX(-12deg); }
  }
  @keyframes ripple {
    from { transform: scale(0); opacity: .35; }
    to   { transform: scale(4); opacity: 0;   }
  }
  @keyframes labelUp {
    from { transform: translateY(4px); opacity:.6; }
    to   { transform: translateY(0);   opacity:1; }
  }
  @keyframes socialIconSpin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  /* ══════════════════════════════════
     CLASSES
  ══════════════════════════════════ */
  .login-header { animation: slideUp .5s ease both; }

  .login-card {
    animation:
      slideInLeft  .65s cubic-bezier(.22,.68,0,1.1) .1s both,
      cardBreathe  5s  ease-in-out 1s infinite;
  }

  .login-img-col {
    animation: slideInRight .65s cubic-bezier(.22,.68,0,1.1) .15s both;
    position: relative; overflow: hidden;
    border-radius: var(--radius);
  }
  .login-img-col img {
    display: block;
    transition: transform .6s cubic-bezier(.25,.46,.45,.94);
    animation: imgFloat 6s ease-in-out 1s infinite;
  }
  .login-img-col:hover img {
    transform: scale(1.05) translateY(-5px) !important;
    animation: none;
  }
  .login-img-col::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,.18) 0%, transparent 55%);
    border-radius: var(--radius);
    pointer-events: none;
  }
  /* Shimmer image au hover */
  .login-img-col::before {
    content: '';
    position: absolute; inset: 0; z-index: 1;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.15), transparent);
    opacity: 0; transition: opacity .3s;
    pointer-events: none;
    border-radius: var(--radius);
  }
  .login-img-col:hover::before {
    opacity: 1;
    animation: shimmerSweep 1.5s ease-in-out infinite;
  }

  /* Champs échelonnés */
  .login-field { animation: fieldReveal .5s cubic-bezier(.22,.68,0,1.1) both; }
  .login-field:nth-of-type(1) { animation-delay: .22s; }
  .login-field:nth-of-type(2) { animation-delay: .33s; }

  /* Labels */
  .form-field label {
    display: block;
    transition: color .2s ease;
  }
  .form-field:focus-within label {
    color: var(--green-mid, #6a8f5a);
    animation: labelUp .2s ease forwards;
  }

  /* Inputs */
  .login-input {
    transition: border-color .25s ease, box-shadow .25s ease, background .25s ease, transform .2s ease;
  }
  .login-input:focus {
    outline: none;
    border-color: var(--green-mid, #6a8f5a) !important;
    box-shadow: 0 0 0 3px rgba(106,143,90,.15);
    background: #fafffe;
    transform: translateY(-1px);
  }
  .login-input.is-err:focus {
    border-color: #e05454 !important;
    box-shadow: 0 0 0 3px rgba(224,84,84,.12);
    transform: none;
  }

  /* Alerte erreur */
  .login-alert-err { animation: alertShake .45s ease both; }

  /* Bouton principal */
  .login-btn-primary {
    position: relative; overflow: hidden;
    transition: transform .2s ease, box-shadow .2s ease;
    animation: slideUp .45s ease .42s both;
  }
  .login-btn-primary .login-btn-ripple {
    position: absolute; border-radius: 50%;
    width: 20px; height: 20px;
    background: rgba(255,255,255,.4);
    transform: scale(0);
    animation: ripple .6s linear;
    pointer-events: none;
  }
  .login-btn-primary:not(:disabled):hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(200,100,40,.35);
    animation: pulse-ring 1.4s ease-out infinite;
  }
  .login-btn-primary:not(:disabled):active { transform: translateY(0); }
  .login-btn-primary::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.25), transparent);
    background-size: 200% 100%;
    opacity: 0; transition: opacity .2s;
  }
  .login-btn-primary:not(:disabled):hover::after {
    opacity: 1; animation: shimmer 1s linear infinite;
  }

  /* Bouton social */
  .login-btn-social {
    transition: transform .2s ease, box-shadow .2s ease, background .2s ease;
    animation: slideUp .4s ease both;
  }
  .login-btn-social:first-of-type { animation-delay: .52s; }
  .login-btn-social:last-of-type  { animation-delay: .58s; }
  .login-btn-social:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0,0,0,.1);
    background: rgba(var(--green-rgb,80,120,60),.04) !important;
  }
  .login-btn-social:hover img {
    animation: socialIconSpin .5s ease forwards;
  }

  /* Lien inscription underline */
  .login-register-link a {
    position: relative; text-decoration: none;
  }
  .login-register-link a::after {
    content: '';
    position: absolute; bottom: -2px; left: 0;
    width: 0; height: 2px;
    background: var(--green-mid, #6a8f5a);
    border-radius: 2px;
    transition: width .25s ease;
  }
  .login-register-link a:hover::after { width: 100%; }

  .login-divider { animation: slideUp .35s ease .48s both; }

  /* Sparkles */
  .login-spark {
    position: absolute; pointer-events: none; z-index: 0;
    animation: sparkle ease-in-out infinite;
  }
  .login-spark::before, .login-spark::after {
    content: ''; position: absolute;
    background: rgba(180,100,40,.4); border-radius: 1px;
  }
  .login-spark::before { width:2px; height:10px; top:-5px; left:0; }
  .login-spark::after  { width:10px; height:2px; top:0; left:-5px; }

  /* Particule */
  .login-particle {
    position: absolute; border-radius: 50%;
    background: var(--orange, #c8723a);
    pointer-events: none;
    animation: particleRise linear infinite;
  }

  /* Section */
  .login-section { animation: sectionHue 10s ease-in-out 2s infinite; }

  /* Cercle déco */
  .login-deco-spin { animation: decoSpin linear infinite; }

  /* ── Grille responsive ── */
  .auth-grid-login {
    display: grid;
    grid-template-columns: 1fr 500px;
    gap: 2rem;
    align-items: start;
    padding: 0 8rem;
  }
  @media (max-width: 1024px) {
    .auth-grid-login { padding: 0 3rem; grid-template-columns: 1fr 420px; }
  }
  @media (max-width: 768px) {
    .auth-grid-login { grid-template-columns: 1fr; padding: 0 1.5rem; }
    .login-img-col { display: none; }
  }
  @media (max-width: 480px) {
    .auth-grid-login { padding: 0 1rem; }
    .login-card > div[style] { padding: 1.5rem !important; }
  }

  /* Réduit-mouvement */
  @media (prefers-reduced-motion: reduce) {
    .login-particle, .login-spark, .login-section,
    .login-img-col img, .login-card, .login-btn-primary { animation: none !important; }
    .login-input:focus { transform: none !important; }
  }
`

export default function LoginPage() {
  const { login }  = useAuth()
  const navigate   = useNavigate()
  const location   = useLocation()
  const from       = location.state?.from?.pathname
  const btnRef     = useRef(null)
  const [srvErr, setSrvErr] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()

  /* Injection CSS */
  useEffect(() => {
    const id = '__login-styles__'
    if (!document.getElementById(id)) {
      const el = document.createElement('style')
      el.id = id; el.textContent = STYLES
      document.head.appendChild(el)
    }
  }, [])

  /* Ripple sur le bouton */
  useEffect(() => {
    const btn = btnRef.current
    if (!btn) return
    const onClick = (e) => {
      const r = btn.getBoundingClientRect()
      const span = document.createElement('span')
      span.className = 'login-btn-ripple'
      span.style.left = `${e.clientX - r.left - 10}px`
      span.style.top  = `${e.clientY - r.top  - 10}px`
      btn.appendChild(span)
      span.addEventListener('animationend', () => span.remove())
    }
    btn.addEventListener('click', onClick)
    return () => btn.removeEventListener('click', onClick)
  }, [])

  async function onSubmit(data) {
    setSrvErr('')
    try {
      const user = await login(data)
      toast.success('Bienvenue !')
      const role = user?.role
      if (role === 'admin' || role === 'employee') {
        navigate('/admin', { replace: true }); return
      }
      const safePaths = ['/dashboard', '/mes-gains', '/profil', '/gains', '/jeu', '/contact']
      if (from && safePaths.some(p => from.startsWith(p))) {
        navigate(from, { replace: true })
      } else {
        navigate('/dashboard', { replace: true })
      }
    } catch (err) {
      setSrvErr(err.response?.data?.message || 'Identifiants incorrects.')
    }
  }

  return (
    <Layout>
      <PageBanner title="Connexion" />

      <section
        className="login-section"
        style={{ position:'relative', background:'var(--cream)', padding:'2.5rem 1.5rem 4rem', overflow:'hidden' }}
      >
        {/* Particules */}
        {PARTICLES.map(p => (
          <div key={p.id} className="login-particle" style={{
            left: p.left, bottom: '-10px',
            width: `${p.size}px`, height: `${p.size}px`,
            opacity: p.opacity,
            animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s`,
          }} />
        ))}

        {/* Sparkles */}
        {SPARKS.map((s, i) => (
          <span key={i} className="login-spark" style={{
            left: s.left, top: s.top,
            width: `${s.s}px`, height: `${s.s}px`,
            animationDuration: s.dur, animationDelay: s.del,
          }} />
        ))}

        {/* Cercles déco */}
        <div style={{ position:'absolute', borderRadius:'50%', pointerEvents:'none',
          width:460, height:460, top:-150, left:-110,
          background:'radial-gradient(circle, rgba(80,120,60,.07) 0%, transparent 70%)' }} />
        <div style={{ position:'absolute', borderRadius:'50%', pointerEvents:'none',
          width:300, height:300, bottom:-80, right:-70,
          background:'radial-gradient(circle, rgba(200,100,40,.06) 0%, transparent 70%)' }} />
        <div className="login-deco-spin" style={{ position:'absolute', pointerEvents:'none',
          width:160, height:160, top:'40%', right:'46%',
          border:'1.5px dashed rgba(106,143,90,.10)', borderRadius:'50%',
          animationDuration:'28s' }} />

        {/* Header */}
        <div className="container login-header" style={{ textAlign:'center', marginBottom:'1.75rem' }}>
          <h2 style={{ marginBottom:'0.5rem' }}>Pause Thé !</h2>
          <p style={{ color:'var(--text-muted)', maxWidth:540, margin:'0 auto', fontSize:'0.92rem', lineHeight:1.7 }}>
            Connecte-toi pour consulter tes lots, suivre tes gains et découvrir quel coffret de thé bio artisanal t'attend.
          </p>
        </div>

        <div className="auth-grid-login">

          {/* Formulaire */}
          <div className="card login-card" style={{ padding:'2.5rem' }}>
            <h3 style={{ textAlign:'center', marginBottom:'1.75rem', fontSize:'1.1rem' }}>
              Formulaire de connexion
            </h3>

            {srvErr && (
              <div key={srvErr} className="alert alert-err login-alert-err">{srvErr}</div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="form-field login-field">
                <label>Identifiant</label>
                <input type="email" placeholder="Votre mail.." autoComplete="email"
                  className={`login-input${errors.email ? ' is-err' : ''}`}
                  {...register('email', {
                    required: 'Requis',
                    pattern: { value:/^\S+@\S+\.\S+$/, message:'E-mail invalide' },
                  })} />
                {errors.email && <p className="err">{errors.email.message}</p>}
              </div>

              <div className="form-field login-field">
                <label>Mot de passe</label>
                <input type="password" placeholder="Mot de passe.." autoComplete="current-password"
                  className={`login-input${errors.password ? ' is-err' : ''}`}
                  {...register('password', {
                    required: 'Requis',
                    minLength: { value:8, message:'Min 8 caractères' },
                  })} />
                {errors.password && <p className="err">{errors.password.message}</p>}
              </div>

              <p className="login-register-link" style={{
                fontSize:'0.85rem', color:'var(--text-muted)', marginBottom:'1.25rem',
              }}>
                Vous n'avez pas de compte ?{' '}
                <Link to="/register" style={{ color:'var(--green-mid)', fontWeight:700 }}>S'inscrire</Link>
              </p>

              <button ref={btnRef} type="submit"
                className="btn btn-orange login-btn-primary" disabled={isSubmitting}
                style={{ width:'100%', fontSize:'1rem', padding:'0.85rem' }}>
                {isSubmitting ? 'Connexion…' : 'Se connecter'}
              </button>

              <div className="login-divider" style={{
                textAlign:'center', margin:'1rem 0',
                color:'var(--text-muted)', fontSize:'0.82rem',
              }}>— ou —</div>

              <button type="button" className="btn btn-outline login-btn-social"
                style={{ width:'100%', marginBottom:'0.6rem', fontSize:'0.88rem', gap:'0.6rem' }}>
                <img src="https://www.google.com/favicon.ico" alt="" style={{ width:16, height:16 }} />
                Se connecter avec Google
              </button>
            </form>
          </div>

          {/* Image */}
          <div className="auth-img-col login-img-col">
            <img src="/images/Connexion/img_01.png" alt="Thé Tip Top"
              style={{ width:'100%', height:500, objectFit:'cover' }} />
          </div>
        </div>
      </section>
    </Layout>
  )
}