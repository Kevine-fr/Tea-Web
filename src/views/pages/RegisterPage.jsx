import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext.jsx'
import Layout from '../components/Layout.jsx'
import PageBanner from '../components/PageBanner.jsx'
import toast from 'react-hot-toast'

/* ─── Particules & Sparkles ───────────────────────────────── */
const PARTICLES = Array.from({ length: 16 }, (_, i) => ({
  id: i, left: `${5 + (i * 5.9) % 90}%`,
  size: 3 + (i % 4), dur: 8 + (i % 6),
  delay: (i * 0.7) % 9, opacity: 0.045 + (i % 4) * 0.02,
}))
const SPARKS = [
  { left: '6%',  top: '15%', s: 8,  dur: '3.5s', del: '0s'   },
  { left: '94%', top: '20%', s: 6,  dur: '4.3s', del: '1.2s' },
  { left: '12%', top: '78%', s: 9,  dur: '3.8s', del: '0.6s' },
  { left: '88%', top: '72%', s: 7,  dur: '5.2s', del: '2.1s' },
  { left: '50%', top: '6%',  s: 6,  dur: '4.1s', del: '1.7s' },
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
    50%      { box-shadow: 0 10px 36px rgba(0,0,0,.12); }
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
    70%  { box-shadow: 0 0 0 12px rgba(200,100,40,0); }
    100% { box-shadow: 0 0 0 0    rgba(200,100,40,0); }
  }
  @keyframes checkPop {
    0%   { transform: scale(0.5); opacity: 0; }
    60%  { transform: scale(1.15); }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes inputSuccess {
    0%   { border-color: var(--green-mid, #6a8f5a); }
    50%  { border-color: rgba(106,143,90,.4); }
    100% { border-color: var(--green-mid, #6a8f5a); }
  }
  @keyframes shimmerSweep {
    0%   { transform: translateX(-130%) skewX(-12deg); }
    100% { transform: translateX(230%)  skewX(-12deg); }
  }
  @keyframes ripple {
    from { transform: scale(0); opacity: .35; }
    to   { transform: scale(4); opacity: 0; }
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
  .reg-header { animation: slideUp .55s ease both; }

  .reg-img-col {
    animation: slideInLeft .65s cubic-bezier(.22,.68,0,1.1) .1s both;
    position: relative; overflow: hidden;
    border-radius: var(--radius);
  }
  .reg-img-col img {
    transition: transform .6s cubic-bezier(.25,.46,.45,.94);
    display: block;
    animation: imgFloat 6s ease-in-out 1s infinite;
  }
  .reg-img-col:hover img {
    transform: scale(1.05) translateY(-5px) !important;
    animation: none;
  }
  .reg-img-col::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,.15) 0%, transparent 50%);
    border-radius: var(--radius);
    pointer-events: none;
  }
  /* Shimmer sur image au hover */
  .reg-img-col::before {
    content: '';
    position: absolute; inset: 0; z-index: 1;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.15), transparent);
    opacity: 0;
    transition: opacity .3s;
    pointer-events: none;
    border-radius: var(--radius);
  }
  .reg-img-col:hover::before {
    opacity: 1;
    animation: shimmerSweep 1.5s ease-in-out infinite;
  }

  .reg-card {
    animation:
      slideInRight .65s cubic-bezier(.22,.68,0,1.1) .15s both,
      cardBreathe  5s  ease-in-out 1s infinite;
  }

  /* Champs avec révélation échelonnée */
  .reg-field { animation: fieldReveal .5s cubic-bezier(.22,.68,0,1.1) both; }
  .reg-field:nth-child(1) { animation-delay: .20s; }
  .reg-field:nth-child(2) { animation-delay: .28s; }
  .reg-field:nth-child(3) { animation-delay: .36s; }
  .reg-field:nth-child(4) { animation-delay: .44s; }
  .reg-field:nth-child(5) { animation-delay: .52s; }
  .reg-field:nth-child(6) { animation-delay: .60s; }

  /* Labels animés au focus */
  .form-field label {
    display: block;
    transition: color .2s ease, transform .2s ease;
    transform-origin: left;
  }
  .form-field:focus-within label {
    color: var(--green-mid, #6a8f5a);
    animation: labelUp .2s ease forwards;
  }

  /* Inputs */
  .reg-input {
    transition: border-color .25s ease, box-shadow .25s ease, background .25s ease, transform .2s ease;
  }
  .reg-input:focus {
    outline: none;
    border-color: var(--green-mid, #6a8f5a) !important;
    box-shadow: 0 0 0 3px rgba(106,143,90,.15);
    background: #fafffe;
    transform: translateY(-1px);
  }
  .reg-input.is-err:focus {
    border-color: #e05454 !important;
    box-shadow: 0 0 0 3px rgba(224,84,84,.12);
    transform: none;
  }

  /* Checkbox */
  .reg-checkbox-wrap input[type="checkbox"] {
    transition: transform .15s ease;
  }
  .reg-checkbox-wrap input[type="checkbox"]:checked {
    animation: checkPop .25s ease forwards;
  }

  /* Bouton principal */
  .reg-btn-primary {
    position: relative; overflow: hidden;
    transition: transform .2s ease, box-shadow .2s ease;
  }
  .reg-btn-primary .reg-btn-ripple {
    position: absolute;
    border-radius: 50%;
    width: 20px; height: 20px;
    background: rgba(255,255,255,.4);
    transform: scale(0);
    animation: ripple .6s linear;
    pointer-events: none;
  }
  .reg-btn-primary:not(:disabled):hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(200,100,40,.35);
    animation: pulse-ring 1.4s ease-out infinite;
  }
  .reg-btn-primary:not(:disabled):active { transform: translateY(0); }
  .reg-btn-primary::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.25), transparent);
    background-size: 200% 100%;
    opacity: 0; transition: opacity .2s;
  }
  .reg-btn-primary:not(:disabled):hover::after {
    opacity: 1; animation: shimmer 1s linear infinite;
  }

  /* Bouton social */
  .reg-btn-social {
    transition: transform .2s ease, box-shadow .2s ease, background .2s ease;
  }
  .reg-btn-social:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0,0,0,.1);
    background: rgba(var(--green-rgb,80,120,60),.04) !important;
  }
  .reg-btn-social:hover img {
    animation: socialIconSpin .5s ease forwards;
  }

  /* Lien connexion avec underline animé */
  .reg-login-link a {
    position: relative; text-decoration: none;
  }
  .reg-login-link a::after {
    content: '';
    position: absolute; bottom: -2px; left: 0;
    width: 0; height: 2px;
    background: var(--green-mid, #6a8f5a);
    border-radius: 2px;
    transition: width .25s ease;
  }
  .reg-login-link a:hover::after { width: 100%; }

  .reg-divider  { animation: slideUp .4s ease .60s both; }
  .reg-login-link { animation: slideUp .4s ease .65s both; }

  /* Sparkles */
  .reg-spark {
    position: absolute; pointer-events: none; z-index: 0;
    animation: sparkle ease-in-out infinite;
  }
  .reg-spark::before, .reg-spark::after {
    content: ''; position: absolute;
    background: rgba(180,100,40,.4); border-radius: 1px;
  }
  .reg-spark::before { width:2px; height:10px; top:-5px; left:0; }
  .reg-spark::after  { width:10px; height:2px; top:0; left:-5px; }

  /* Particule */
  .reg-particle {
    position: absolute; border-radius: 50%;
    background: var(--orange, #c8723a);
    pointer-events: none;
    animation: particleRise linear infinite;
  }

  /* Section hue */
  .reg-section { animation: sectionHue 10s ease-in-out 2s infinite; }

  /* Cercle déco tournant */
  .reg-deco-spin { animation: decoSpin linear infinite; }

  /* ── Grille responsive ── */
  .auth-grid-register {
    display: grid;
    grid-template-columns: 500px 1fr;
    gap: 2rem;
    align-items: start;
    padding: 0 8rem;
  }
  @media (max-width: 1024px) {
    .auth-grid-register { padding: 0 3rem; grid-template-columns: 380px 1fr; }
  }
  @media (max-width: 768px) {
    .auth-grid-register { grid-template-columns: 1fr; padding: 0 1.5rem; }
    .reg-img-col { display: none; }
  }
  @media (max-width: 480px) {
    .auth-grid-register { padding: 0 1rem; }
  }
  @media (max-width: 420px) {
    .reg-name-grid, .reg-pwd-grid { grid-template-columns: 1fr !important; }
  }

  /* Réduit-mouvement */
  @media (prefers-reduced-motion: reduce) {
    .reg-particle, .reg-spark, .reg-section,
    .reg-img-col img, .reg-card, .reg-btn-primary { animation: none !important; }
    .reg-input:focus { transform: none !important; }
  }
`

export default function RegisterPage() {
  const { register: registerUser } = useAuth()
  const navigate   = useNavigate()
  const btnRef     = useRef(null)
  const [srvErrors, setSrvErrors] = useState({})

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm()
  const password = watch('password')

  /* Injection CSS */
  useEffect(() => {
    const id = '__reg-styles__'
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
      span.className = 'reg-btn-ripple'
      span.style.left = `${e.clientX - r.left - 10}px`
      span.style.top  = `${e.clientY - r.top  - 10}px`
      btn.appendChild(span)
      span.addEventListener('animationend', () => span.remove())
    }
    btn.addEventListener('click', onClick)
    return () => btn.removeEventListener('click', onClick)
  }, [])

  async function onSubmit({ password_confirm, consent, newsletter, ...payload }) {
    setSrvErrors({})
    try {
      await registerUser(payload)
      toast.success('Compte créé ! Bienvenue 🍵')
      navigate('/dashboard', { replace: true })
    } catch (err) {
      const resp = err.response?.data
      if (resp?.errors) {
        const flat = {}
        Object.entries(resp.errors).forEach(([k, v]) => { flat[k] = Array.isArray(v) ? v[0] : v })
        setSrvErrors(flat)
      } else {
        toast.error(resp?.message || "Erreur lors de l'inscription.")
      }
    }
  }

  const sErr = (name) => errors[name]?.message || srvErrors[name]

  return (
    <Layout>
      <PageBanner title="Inscription" />

      <section
        className="reg-section"
        style={{ position:'relative', background:'var(--cream)', padding:'2.5rem 1.5rem 4rem', overflow:'hidden' }}
      >
        {/* Particules */}
        {PARTICLES.map(p => (
          <div key={p.id} className="reg-particle" style={{
            left: p.left, bottom: '-10px',
            width: `${p.size}px`, height: `${p.size}px`,
            opacity: p.opacity,
            animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s`,
          }} />
        ))}

        {/* Sparkles */}
        {SPARKS.map((s, i) => (
          <span key={i} className="reg-spark" style={{
            left: s.left, top: s.top,
            width: `${s.s}px`, height: `${s.s}px`,
            animationDuration: s.dur, animationDelay: s.del,
          }} />
        ))}

        {/* Cercles déco */}
        <div style={{ position:'absolute', borderRadius:'50%', pointerEvents:'none',
          width:480, height:480, top:-160, right:-120,
          background:'radial-gradient(circle, rgba(80,120,60,.07) 0%, transparent 70%)' }} />
        <div style={{ position:'absolute', borderRadius:'50%', pointerEvents:'none',
          width:300, height:300, bottom:-90, left:-80,
          background:'radial-gradient(circle, rgba(200,100,40,.06) 0%, transparent 70%)' }} />
        <div className="reg-deco-spin" style={{ position:'absolute', pointerEvents:'none',
          width:180, height:180, top:'38%', left:'48%',
          border:'1.5px dashed rgba(106,143,90,.10)', borderRadius:'50%',
          animationDuration:'30s' }} />

        {/* Header */}
        <div className="container reg-header" style={{ textAlign:'center', marginBottom:'1.75rem' }}>
          <h2>Bienvenue dans l'aventure Thé Tip Top</h2>
          <p style={{ color:'var(--text-muted)', maxWidth:540, margin:'0.5rem auto 0', fontSize:'0.92rem', lineHeight:1.7 }}>
            Crée ton compte, tente ta chance et découvre tes lots bien-être et cadeaux de thé bio artisanal.
          </p>
        </div>

        <div className="auth-grid-register">

          {/* Image */}
          <div className="auth-img-col reg-img-col">
            <img src="/images/Inscription/img_01.png" alt="Inscription"
              style={{ width:'100%', height:570, objectFit:'cover' }} />
          </div>

          {/* Formulaire */}
          <div className="card reg-card" style={{ padding:'2.5rem' }}>
            <h3 style={{ textAlign:'center', marginBottom:'1.5rem', fontSize:'1.1rem' }}>
              Inscrivez-vous au Jeu-concours !
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>

              {/* Nom / Prénom */}
              <div className="reg-field reg-name-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
                <div className="form-field">
                  <input type="text" placeholder="Nom"
                    className={`reg-input${sErr('last_name') ? ' is-err' : ''}`}
                    {...register('last_name', { required:'Requis' })} />
                  {sErr('last_name') && <p className="err">{sErr('last_name')}</p>}
                </div>
                <div className="form-field">
                  <input type="text" placeholder="Prénom"
                    className={`reg-input${sErr('first_name') ? ' is-err' : ''}`}
                    {...register('first_name', { required:'Requis' })} />
                  {sErr('first_name') && <p className="err">{sErr('first_name')}</p>}
                </div>
              </div>

              {/* Email */}
              <div className="form-field reg-field">
                <input type="email" placeholder="Email"
                  className={`reg-input${sErr('email') ? ' is-err' : ''}`}
                  {...register('email', {
                    required: 'Requis',
                    pattern: { value:/^\S+@\S+\.\S+$/, message:'E-mail invalide' },
                  })} />
                {sErr('email') && <p className="err">{sErr('email')}</p>}
              </div>

              {/* Mots de passe */}
              <div className="reg-field reg-pwd-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
                <div className="form-field">
                  <input type="password" placeholder="Mot de passe"
                    className={`reg-input${sErr('password') ? ' is-err' : ''}`}
                    {...register('password', {
                      required:'Requis',
                      minLength:{ value:8, message:'Min 8 car.' },
                    })} />
                  {sErr('password') && <p className="err">{sErr('password')}</p>}
                </div>
                <div className="form-field">
                  <input type="password" placeholder="Confirmez mot de passe"
                    className={`reg-input${errors.password_confirm ? ' is-err' : ''}`}
                    {...register('password_confirm', {
                      required:'Requis',
                      validate: v => v === password || 'Mots de passe différents',
                    })} />
                  {errors.password_confirm && <p className="err">{errors.password_confirm.message}</p>}
                </div>
              </div>

              {/* Checkboxes */}
              <div className="reg-field" style={{ marginBottom:'1.25rem' }}>
                <label className="reg-checkbox-wrap" style={{
                  display:'flex', alignItems:'flex-start', gap:'0.6rem',
                  fontSize:'0.82rem', color:'var(--text-muted)',
                  cursor:'pointer', marginBottom:'0.6rem',
                }}>
                  <input type="checkbox"
                    style={{ marginTop:3, accentColor:'var(--orange)', flexShrink:0 }}
                    {...register('consent', { required:'Vous devez accepter les CGU' })} />
                  J'accepte les conditions générales d'utilisation et le règlement du jeu *
                </label>
                {errors.consent && <p className="err">{errors.consent.message}</p>}

                <label className="reg-checkbox-wrap" style={{
                  display:'flex', alignItems:'flex-start', gap:'0.6rem',
                  fontSize:'0.82rem', color:'var(--text-muted)', cursor:'pointer',
                }}>
                  <input type="checkbox"
                    style={{ marginTop:3, accentColor:'var(--orange)', flexShrink:0 }}
                    {...register('newsletter')} />
                  J'accepte de recevoir par e-mail les actualités, offres commerciales et newsletters de Thé Tip Top.
                </label>
              </div>

              <button ref={btnRef} type="submit"
                className="btn btn-orange reg-btn-primary" disabled={isSubmitting}
                style={{ width:'100%', fontSize:'1rem', padding:'0.85rem' }}>
                {isSubmitting ? 'Création…' : 'Créer mon compte'}
              </button>

              <div className="reg-divider" style={{
                textAlign:'center', margin:'1rem 0',
                color:'var(--text-muted)', fontSize:'0.82rem',
              }}>— ou —</div>

              <button type="button" className="btn btn-outline reg-btn-social"
                style={{ width:'100%', marginBottom:'0.6rem', fontSize:'0.88rem', gap:'0.6rem' }}>
                <img src="https://www.google.com/favicon.ico" alt="" style={{ width:16, height:16 }} />
                S'inscrire avec Google
              </button>

              <p className="reg-login-link" style={{
                textAlign:'center', marginTop:'1.25rem',
                fontSize:'0.85rem', color:'var(--text-muted)',
              }}>
                Déjà un compte ?{' '}
                <Link to="/login" style={{ color:'var(--green-mid)', fontWeight:700 }}>Se connecter</Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  )
}