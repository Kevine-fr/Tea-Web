import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext.jsx'
import Layout from '../components/Layout.jsx'
import PageBanner from '../components/PageBanner.jsx'
import client from '../../api/client.js'
import toast from 'react-hot-toast'

/* ─── Styles d'animation ─────────────────────────────────── */
const STYLES = `
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeScaleIn {
    from { opacity: 0; transform: scale(.97) translateY(16px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes pulse-ring {
    0%   { box-shadow: 0 0 0 0   rgba(200,100,40,.35); }
    70%  { box-shadow: 0 0 0 10px rgba(200,100,40,0); }
    100% { box-shadow: 0 0 0 0   rgba(200,100,40,0); }
  }
  @keyframes alertShake {
    0%, 100% { transform: translateX(0); }
    20%       { transform: translateX(-6px); }
    40%       { transform: translateX(6px); }
    60%       { transform: translateX(-4px); }
    80%       { transform: translateX(4px); }
  }
  @keyframes avatarPop {
    0%   { transform: scale(0.5) translateY(-8px); opacity: 0; }
    60%  { transform: scale(1.08); }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes lineGrow {
    from { width: 0; }
    to   { width: 48px; }
  }
  @keyframes fieldIn {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Carte principale ── */
  .prof-card {
    animation: fadeScaleIn .55s ease both;
  }

  /* ── Avatar initiales ── */
  .prof-avatar {
    animation: avatarPop .5s ease .1s both;
    width: 72px; height: 72px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--green-mid, #6a8f5a), var(--green-dark, #3d5c30));
    color: white;
    font-size: 1.5rem;
    font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 0.5rem;
    box-shadow: 0 6px 20px rgba(80,120,60,.3);
    transition: transform .3s ease, box-shadow .3s ease;
    cursor: default;
    user-select: none;
    font-family: var(--font-display, serif);
  }
  .prof-avatar:hover {
    transform: scale(1.07);
    box-shadow: 0 10px 28px rgba(80,120,60,.35);
  }

  /* ── Nom d'utilisateur ── */
  .prof-username {
    animation: slideUp .45s ease .18s both;
    text-align: center;
    margin-bottom: 0.25rem;
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-dark, #2a2a2a);
  }

  /* ── Badge rôle ── */
  .prof-role-badge {
    animation: slideUp .4s ease .24s both;
    display: inline-block;
    padding: 0.2rem 0.8rem;
    border-radius: 999px;
    background: rgba(106,143,90,.12);
    color: var(--green-mid, #6a8f5a);
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: capitalize;
  }

  /* ── Divider ── */
  .prof-divider {
    animation: lineGrow .5s ease .3s both;
    height: 1px;
    background: var(--cream-border, #e0d9cc);
    border: none;
    margin: 1.5rem 0;
    width: 100%;
  }

  /* ── Titre section ── */
  .prof-section-title {
    animation: slideUp .45s ease .32s both;
  }

  /* ── Champs avec entrée échelonnée ── */
  .prof-field {
    animation: fieldIn .45s ease both;
  }
  .prof-field:nth-of-type(1) { animation-delay: .36s; }
  .prof-field:nth-of-type(2) { animation-delay: .42s; }
  .prof-field:nth-of-type(3) { animation-delay: .48s; }
  .prof-field:nth-of-type(4) { animation-delay: .54s; }
  .prof-field:nth-of-type(5) { animation-delay: .6s; }

  /* ── Input focus glow ── */
  .prof-input {
    transition: border-color .25s ease, box-shadow .25s ease, background .25s ease;
  }
  .prof-input:focus {
    outline: none;
    border-color: var(--green-mid, #6a8f5a) !important;
    box-shadow: 0 0 0 3px rgba(106,143,90,.15);
    background: #fafffe;
  }
  .prof-input.is-err:focus {
    border-color: #e05454 !important;
    box-shadow: 0 0 0 3px rgba(224,84,84,.12);
  }

  /* ── Lien mot de passe oublié ── */
  .prof-forgot {
    font-size: .8rem;
    color: var(--orange, #c8723a);
    margin-top: .25rem;
    cursor: pointer;
    display: inline-block;
    position: relative;
    transition: opacity .2s;
  }
  .prof-forgot::after {
    content: '';
    position: absolute;
    bottom: -1px; left: 0;
    width: 0; height: 1px;
    background: var(--orange, #c8723a);
    transition: width .25s ease;
  }
  .prof-forgot:hover { opacity: .8; }
  .prof-forgot:hover::after { width: 100%; }

  /* ── Bouton sauvegarder ── */
  .prof-btn-save {
    position: relative;
    overflow: hidden;
    transition: transform .2s ease, box-shadow .2s ease;
    animation: slideUp .45s ease .65s both;
  }
  .prof-btn-save:not(:disabled):hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(200,100,40,.3);
    animation: pulse-ring 1.4s ease-out infinite;
  }
  .prof-btn-save:not(:disabled):active {
    transform: translateY(0);
  }
  .prof-btn-save::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.25), transparent);
    background-size: 200% 100%;
    opacity: 0;
    transition: opacity .2s;
  }
  .prof-btn-save:not(:disabled):hover::after {
    opacity: 1;
    animation: shimmer 1s linear infinite;
  }

  /* ── Alerte erreur ── */
  .prof-alert-err {
    animation: alertShake .4s ease both;
  }

  /* ── Déco fond ── */
  .prof-deco {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
  }
`

export default function ProfilePage() {
  const { user } = useAuth()
  const [srvErr, setSrvErr] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      last_name:  user?.last_name  || '',
      first_name: user?.first_name || '',
      email:      user?.email      || '',
    },
  })

  /* Inject styles once */
  useEffect(() => {
    const id = '__prof-styles__'
    if (!document.getElementById(id)) {
      const el = document.createElement('style')
      el.id = id
      el.textContent = STYLES
      document.head.appendChild(el)
    }
  }, [])

  async function onSubmit(data) {
    setSrvErr('')
    try {
      await client.put('auth/profile', data)
      toast.success('Informations mises à jour !')
    } catch (err) {
      setSrvErr(err.response?.data?.message || 'Erreur lors de la mise à jour.')
    }
  }

  /* Initiales de l'avatar */
  const initials = [user?.first_name?.[0], user?.last_name?.[0]]
    .filter(Boolean).join('').toUpperCase() || '?'

  return (
    <Layout>
      <PageBanner title="Détails du compte" />

      <div style={{ position: 'relative', background: 'var(--cream)', padding: '2.5rem 1.5rem 4rem', overflow: 'hidden' }}>

        {/* ── Décorations fond ── */}
        <div className="prof-deco" style={{
          width: 340, height: 340,
          top: -100, right: -80,
          background: 'radial-gradient(circle, rgba(106,143,90,.07) 0%, transparent 70%)',
        }} />
        <div className="prof-deco" style={{
          width: 220, height: 220,
          bottom: -50, left: -50,
          background: 'radial-gradient(circle, rgba(200,100,40,.06) 0%, transparent 70%)',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: 760 }}>
          <div className="card prof-card" style={{ padding: '2.5rem 3rem' }}>

            {/* ── Avatar + nom ── */}
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div className="prof-avatar" title={`${user?.first_name ?? ''} ${user?.last_name ?? ''}`}>
                {initials}
              </div>
              <p className="prof-username">
                {user?.first_name} {user?.last_name}
              </p>
              {user?.role && (
                <span className="prof-role-badge">{user.role}</span>
              )}
            </div>

            <hr className="prof-divider" />

            <h2 className="prof-section-title" style={{ textAlign: 'center', marginBottom: '1.75rem', fontSize: '1.1rem' }}>
              Mes informations
            </h2>

            {srvErr && (
              <div key={srvErr} className="alert alert-err prof-alert-err">
                {srvErr}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate>

              {/* Nom / Prénom */}
              <div className="prof-field" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-field">
                  <label>Nom *</label>
                  <input type="text" placeholder="Nom"
                    className={`prof-input${errors.last_name ? ' is-err' : ''}`}
                    {...register('last_name', { required: 'Requis' })} />
                  {errors.last_name && <p className="err">{errors.last_name.message}</p>}
                </div>
                <div className="form-field">
                  <label>Prénom *</label>
                  <input type="text" placeholder="Prénom"
                    className={`prof-input${errors.first_name ? ' is-err' : ''}`}
                    {...register('first_name', { required: 'Requis' })} />
                  {errors.first_name && <p className="err">{errors.first_name.message}</p>}
                </div>
              </div>

              {/* Email */}
              <div className="form-field prof-field">
                <label>Mail *</label>
                <input type="email" placeholder="Mail"
                  className={`prof-input${errors.email ? ' is-err' : ''}`}
                  {...register('email', {
                    required: 'Requis',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'E-mail invalide' },
                  })} />
                {errors.email && <p className="err">{errors.email.message}</p>}
              </div>

              {/* Ancien mot de passe */}
              <div className="form-field prof-field">
                <label>Ancien mot de passe</label>
                <input type="password" placeholder="Ancien mot de passe"
                  className="prof-input"
                  {...register('old_password')} />
                <span className="prof-forgot">J'ai oublié mon mot de passe</span>
              </div>

              {/* Nouveau mot de passe */}
              <div className="form-field prof-field">
                <label>Nouveau mot de passe</label>
                <input type="password" placeholder="Nouveau mot de passe"
                  className={`prof-input${errors.password ? ' is-err' : ''}`}
                  {...register('password', { minLength: { value: 8, message: 'Min 8 caractères' } })} />
                {errors.password && <p className="err">{errors.password.message}</p>}
              </div>

              {/* Submit */}
              <div style={{ textAlign: 'center', marginTop: '0.75rem' }}>
                <button type="submit" className="btn btn-orange prof-btn-save"
                  disabled={isSubmitting}
                  style={{ padding: '0.85rem 3.5rem', fontSize: '0.95rem' }}>
                  {isSubmitting ? 'Sauvegarde…' : 'Sauvegarder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}