// src/views/pages/ContactPage.jsx
import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import Layout from '../components/Layout.jsx'
import PageBanner from '../components/PageBanner.jsx'
import SEO from '../components/SEO.jsx'
import client from '../../api/client.js'
import toast from 'react-hot-toast'

/* ─── Particules & Sparkles ───────────────────────────────── */
const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  id: i, left: `${5 + (i * 6.5) % 90}%`,
  size: 3 + (i % 4), dur: 8 + (i % 6),
  delay: (i * 0.8) % 9, opacity: 0.04 + (i % 4) * 0.02,
}))
const SPARKS = [
  { left: '4%',  top: '18%', s: 7,  dur: '3.6s', del: '0s'   },
  { left: '96%', top: '14%', s: 6,  dur: '4.4s', del: '1.2s' },
  { left: '8%',  top: '76%', s: 8,  dur: '3.9s', del: '0.6s' },
  { left: '92%', top: '70%', s: 6,  dur: '5.1s', del: '2.0s' },
  { left: '50%', top: '5%',  s: 7,  dur: '4.2s', del: '1.7s' },
]

const CSS = `
  /* ══════════════════════════════════
     ENTRÉES
  ══════════════════════════════════ */
  @keyframes contactIn {
    from { opacity:0; transform: translateY(28px) scale(.98); }
    to   { opacity:1; transform: none; }
  }
  @keyframes fieldReveal {
    from { opacity:0; transform: translateY(12px); }
    to   { opacity:1; transform: none; }
  }
  @keyframes underlineGrow {
    from { width:0; opacity:0; }
    to   { width:56px; opacity:1; }
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
    0%,100% { opacity:0; transform:scale(0)   rotate(0deg);   }
    40%      { opacity:1; transform:scale(1)   rotate(180deg); }
    70%      { opacity:.6; transform:scale(.7) rotate(270deg); }
  }
  @keyframes cardBreathe {
    0%,100% { box-shadow: 0 4px 20px rgba(0,0,0,.07); }
    50%      { box-shadow: 0 12px 36px rgba(0,0,0,.12); }
  }
  @keyframes sectionHue {
    0%,100% { background-color: var(--cream); }
    50%      { background-color: #e8d9c2; }
  }
  @keyframes decoSpin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes decoSpinR {
    from { transform: rotate(0deg); }
    to   { transform: rotate(-360deg); }
  }

  /* ══════════════════════════════════
     INTERACTIONS
  ══════════════════════════════════ */
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes pulseRing {
    0%   { box-shadow: 0 0 0 0    rgba(200,100,40,.35); }
    70%  { box-shadow: 0 0 0 12px rgba(200,100,40,0);   }
    100% { box-shadow: 0 0 0 0    rgba(200,100,40,0);   }
  }
  @keyframes ripple {
    from { transform: scale(0); opacity:.35; }
    to   { transform: scale(4); opacity:0;   }
  }
  @keyframes labelUp {
    from { transform: translateY(4px); opacity:.6; }
    to   { transform: translateY(0);   opacity:1;  }
  }
  @keyframes textareaGrow {
    from { box-shadow: 0 0 0 0   rgba(106,143,90,.0); }
    to   { box-shadow: 0 0 0 3px rgba(106,143,90,.15); }
  }

  /* ══════════════════════════════════
     SECTION
  ══════════════════════════════════ */
  .contact-section {
    position: relative;
    background: var(--cream);
    padding: 2.5rem 1.5rem 4rem;
    overflow: hidden;
    animation: sectionHue 10s ease-in-out 2s infinite;
  }

  /* ══════════════════════════════════
     CARTE FORMULAIRE
  ══════════════════════════════════ */
  .contact-card {
    animation:
      contactIn .65s cubic-bezier(.22,.68,0,1.1) .28s both,
      cardBreathe 5s ease-in-out 1s infinite;

    margin: 0 8.8rem;
    padding: 2rem 2.25rem;
  }

  /* Tablette */
  @media (max-width: 1024px) {
    .contact-card {
      margin: 0 4rem;
      padding: 1.8rem;
    }
  }

  /* Mobile */
  @media (max-width: 768px) {
    .contact-card {
      margin: 0 1.5rem;
      padding: 1.5rem;
    }
  }

  /* Petit mobile */
  @media (max-width: 480px) {
    .contact-card {
      margin: 0 1rem;
      padding: 1.2rem;
    }
  }

  /* Titre centré + underline */
  .contact-title-wrap { text-align: center; margin-bottom: 1.75rem; }
  .contact-underline {
    display: block; height:3px; width:56px;
    border-radius:4px;
    background: linear-gradient(90deg, var(--orange, #c8723a), #e89060);
    margin: 0.5rem auto 0;
    animation: underlineGrow .7s cubic-bezier(.22,.68,0,1.1) .45s both;
  }

  /* Champs échelonnés */
  .contact-field { animation: fieldReveal .5s cubic-bezier(.22,.68,0,1.1) both; }
  .contact-field:nth-child(1) { animation-delay: .35s; }
  .contact-field:nth-child(2) { animation-delay: .43s; }
  .contact-field:nth-child(3) { animation-delay: .51s; }
  .contact-field:nth-child(4) { animation-delay: .59s; }
  .contact-field:nth-child(5) { animation-delay: .67s; }

  /* Labels animés */
  .form-field label {
    display: block;
    transition: color .2s ease;
  }
  .form-field:focus-within label {
    color: var(--green-mid, #6a8f5a);
    animation: labelUp .2s ease forwards;
  }

  /* Inputs & textarea */
  .contact-input,
  .contact-textarea {
    width: 100%; box-sizing: border-box;
    font-size: 0.88rem;
    padding: 0.6rem 0.85rem;
    transition: border-color .25s, box-shadow .25s, background .25s, transform .2s;
  }
  .contact-input:focus,
  .contact-textarea:focus {
    outline: none;
    border-color: var(--green-mid, #6a8f5a) !important;
    box-shadow: 0 0 0 3px rgba(106,143,90,.15);
    background: #fafffe;
    transform: translateY(-1px);
  }
  .contact-input.is-err:focus,
  .contact-textarea.is-err:focus {
    border-color: #e05454 !important;
    box-shadow: 0 0 0 3px rgba(224,84,84,.12);
    transform: none;
  }
  .contact-textarea { resize: vertical; min-height: 110px; }

  /* Bouton */
  .contact-btn {
    position: relative; overflow: hidden;
    transition: transform .2s ease, box-shadow .2s ease;
    animation: fieldReveal .5s ease .75s both;
  }
  .contact-btn .contact-ripple {
    position: absolute; border-radius: 50%;
    width:20px; height:20px;
    background: rgba(255,255,255,.4);
    transform: scale(0);
    animation: ripple .6s linear;
    pointer-events: none;
  }
  .contact-btn:not(:disabled):hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(200,100,40,.35);
    animation: pulseRing 1.4s ease-out infinite;
  }
  .contact-btn:not(:disabled):active { transform: translateY(0); }
  .contact-btn::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.25), transparent);
    background-size: 200% 100%;
    opacity: 0; transition: opacity .2s;
  }
  .contact-btn:not(:disabled):hover::after {
    opacity:1; animation: shimmer 1s linear infinite;
  }

  /* Sparkles */
  .contact-spark {
    position: absolute; pointer-events:none; z-index:0;
    animation: sparkle ease-in-out infinite;
  }
  .contact-spark::before, .contact-spark::after {
    content:''; position:absolute;
    background: rgba(180,100,40,.4); border-radius:1px;
  }
  .contact-spark::before { width:2px; height:10px; top:-5px; left:0; }
  .contact-spark::after  { width:10px; height:2px; top:0; left:-5px; }

  /* Particule */
  .contact-particle {
    position:absolute; border-radius:50%;
    background: var(--orange, #c8723a); pointer-events:none;
    animation: particleRise linear infinite;
  }

  /* Cercles décoratifs */
  .contact-deco {
    position:absolute; border-radius:50%; pointer-events:none;
  }

  /* ══════════════════════════════════
     RESPONSIVE
  ══════════════════════════════════ */
  @media (max-width: 640px) {
    .contact-card { padding: 1.5rem 1.25rem !important; }
    .contact-name-grid { grid-template-columns: 1fr !important; }
  }

  /* Réduit-mouvement */
  @media (prefers-reduced-motion: reduce) {
    .contact-particle, .contact-spark,
    .contact-section, .contact-card,
    .contact-btn { animation: none !important; }
    .contact-input:focus,
    .contact-textarea:focus { transform: none !important; }
  }
`

export default function ContactPage() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm()
  const titleRef = useRef(null)
  const btnRef   = useRef(null)

  /* Entrée du titre */
  useEffect(() => {
    if (titleRef.current)
      titleRef.current.style.animation = 'contactIn .55s cubic-bezier(.22,.68,0,1.1) .10s both'
  }, [])

  /* Ripple sur le bouton */
  useEffect(() => {
    const btn = btnRef.current
    if (!btn) return
    const onClick = (e) => {
      const r = btn.getBoundingClientRect()
      const span = document.createElement('span')
      span.className = 'contact-ripple'
      span.style.left = `${e.clientX - r.left - 10}px`
      span.style.top  = `${e.clientY - r.top  - 10}px`
      btn.appendChild(span)
      span.addEventListener('animationend', () => span.remove())
    }
    btn.addEventListener('click', onClick)
    return () => btn.removeEventListener('click', onClick)
  }, [])

  async function onSubmit(data) {
    try {
      await client.post('contact', data)
      toast.success('Message envoyé ! Vous allez recevoir un email de confirmation.')
      reset()
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de l'envoi. Réessayez.")
    }
  }

  return (
    <Layout>
      <SEO
        title="Contact Thé Tip Top | Nous contacter pour toute question"
        description="Contactez Thé Tip Top pour toute question sur le jeu-concours, vos lots, votre participation ou les modalités de remise des gains."
      />
      <style>{CSS}</style>
      <PageBanner title="Contact" />

      <section className="contact-section">

        {/* Particules montantes */}
        {PARTICLES.map(p => (
          <div key={p.id} className="contact-particle" style={{
            left: p.left, bottom: '-10px',
            width: `${p.size}px`, height: `${p.size}px`,
            opacity: p.opacity,
            animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s`,
          }} />
        ))}

        {/* Sparkles */}
        {SPARKS.map((s, i) => (
          <span key={i} className="contact-spark" style={{
            left: s.left, top: s.top,
            width: `${s.s}px`, height: `${s.s}px`,
            animationDuration: s.dur, animationDelay: s.del,
          }} />
        ))}

        {/* Cercles déco */}
        <div className="contact-deco" style={{
          width:440, height:440, top:-150, right:-110,
          background:'radial-gradient(circle, rgba(80,120,60,.07) 0%, transparent 70%)',
        }} />
        <div className="contact-deco" style={{
          width:300, height:300, bottom:-80, left:-80,
          background:'radial-gradient(circle, rgba(200,100,40,.06) 0%, transparent 70%)',
        }} />
        {/* Cercle tournant outer */}
        <div className="contact-deco" style={{
          width:220, height:220, top:'30%', left:'5%',
          border:'1.5px dashed rgba(106,143,90,.10)', borderRadius:'50%',
          animation:'decoSpin 32s linear infinite',
        }} />
        {/* Cercle tournant inner (sens inverse) */}
        <div className="contact-deco" style={{
          width:120, height:120, top:'55%', right:'6%',
          border:'1.5px dashed rgba(200,100,40,.09)', borderRadius:'50%',
          animation:'decoSpinR 24s linear infinite',
        }} />

        <div className="page-inner" style={{ position:'relative', zIndex:1 }}>

          {/* Titre */}
          <div ref={titleRef} className="contact-title-wrap" style={{ opacity:0 }}>
            <h2>Écrivez-nous !</h2>
            <span className="contact-underline" />
            <p style={{ color:'var(--text-muted)', marginTop:'0.75rem', fontSize:'0.92rem', lineHeight:1.7 }}>
              Une demande, un souci avec un lot, ou juste une question ?<br />
              On met la bouilloire et on arrive..
            </p>
          </div>

          {/* Carte formulaire réduite */}
          <div className="card contact-card">
            <h3 style={{ textAlign:'center', marginBottom:'1.5rem', fontSize:'1.1rem' }}>
              Formulaire de contact
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>

              {/* Nom / Prénom */}
              <div className="contact-field contact-name-grid" style={{
                display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.65rem', marginBottom:'0.65rem',
              }}>
                <div className="form-field" style={{ marginBottom:0 }}>
                  <input type="text" placeholder="Nom"
                    className={`contact-input${errors.last_name ? ' is-err' : ''}`}
                    {...register('last_name', { required:'Requis' })} />
                  {errors.last_name && <p className="err">{errors.last_name.message}</p>}
                </div>
                <div className="form-field" style={{ marginBottom:0 }}>
                  <input type="text" placeholder="Prénom"
                    className={`contact-input${errors.first_name ? ' is-err' : ''}`}
                    {...register('first_name', { required:'Requis' })} />
                  {errors.first_name && <p className="err">{errors.first_name.message}</p>}
                </div>
              </div>

              {/* Email */}
              <div className="form-field contact-field" style={{ marginBottom:'0.65rem' }}>
                <input type="email" placeholder="Email"
                  className={`contact-input${errors.email ? ' is-err' : ''}`}
                  {...register('email', {
                    required:'Requis',
                    pattern:{ value:/^\S+@\S+\.\S+$/, message:'E-mail invalide' },
                  })} />
                {errors.email && <p className="err">{errors.email.message}</p>}
              </div>

              {/* Sujet */}
              <div className="form-field contact-field" style={{ marginBottom:'0.65rem' }}>
                <input type="text" placeholder="Sujet"
                  className={`contact-input${errors.subject ? ' is-err' : ''}`}
                  {...register('subject', { required:'Requis' })} />
                {errors.subject && <p className="err">{errors.subject.message}</p>}
              </div>

              {/* Message */}
              <div className="form-field contact-field" style={{ marginBottom:'0.9rem' }}>
                <textarea rows={5} placeholder="Votre message.."
                  className={`contact-textarea${errors.message ? ' is-err' : ''}`}
                  {...register('message', {
                    required:'Requis',
                    minLength:{ value:10, message:'Message trop court (min. 10 caractères)' },
                  })} />
                {errors.message && <p className="err">{errors.message.message}</p>}
              </div>

              {/* Bouton */}
              <div style={{ textAlign:'center' }}>
                <button ref={btnRef} type="submit"
                  className="btn btn-orange contact-btn" disabled={isSubmitting}
                  style={{ padding:'0.8rem 3.5rem', fontSize:'0.95rem' }}>
                  {isSubmitting ? 'Envoi en cours…' : 'Envoyer'}
                </button>
              </div>

            </form>
          </div>
        </div>
      </section>
    </Layout>
  )
}