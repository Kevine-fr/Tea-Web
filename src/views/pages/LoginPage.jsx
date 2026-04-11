import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext.jsx'
import Layout from '../components/Layout.jsx'
import PageBanner from '../components/PageBanner.jsx'
import toast from 'react-hot-toast'

const STYLES = `
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-28px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(28px); }
    to   { opacity: 1; transform: translateX(0); }
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
  @keyframes lineGrow {
    from { width: 0; }
    to   { width: 48px; }
  }

  .login-header { animation: slideUp .5s ease both; }
  .login-card   { animation: slideInLeft .6s ease .1s both; }

  .login-img-col {
    animation: slideInRight .6s ease .15s both;
    position: relative;
    overflow: hidden;
    border-radius: var(--radius);
  }
  .login-img-col img {
    display: block;
    transition: transform .6s cubic-bezier(.25,.46,.45,.94);
  }
  .login-img-col:hover img { transform: scale(1.04); }
  .login-img-col::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,.18) 0%, transparent 55%);
    border-radius: var(--radius);
    pointer-events: none;
  }

  .login-field { animation: slideUp .5s ease both; }
  .login-field:nth-of-type(1) { animation-delay: .22s; }
  .login-field:nth-of-type(2) { animation-delay: .32s; }

  .login-input {
    transition: border-color .25s ease, box-shadow .25s ease, background .25s ease;
  }
  .login-input:focus {
    outline: none;
    border-color: var(--green-mid, #6a8f5a) !important;
    box-shadow: 0 0 0 3px rgba(106,143,90,.15);
    background: #fafffe;
  }
  .login-input.is-err:focus {
    border-color: #e05454 !important;
    box-shadow: 0 0 0 3px rgba(224,84,84,.12);
  }

  .login-btn-primary {
    position: relative; overflow: hidden;
    transition: transform .2s ease, box-shadow .2s ease;
    animation: slideUp .45s ease .42s both;
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

  .login-alert-err { animation: alertShake .45s ease both; }

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

  .login-register-link a {
    position: relative; text-decoration: none;
  }
  .login-register-link a::after {
    content: '';
    position: absolute;
    bottom: -2px; left: 0;
    width: 0; height: 2px;
    background: var(--green-mid, #6a8f5a);
    border-radius: 2px;
    transition: width .25s ease;
  }
  .login-register-link a:hover::after { width: 100%; }

  .login-divider { animation: slideUp .35s ease .48s both; }

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
    .auth-grid-login {
      grid-template-columns: 1fr;
      padding: 0 1.5rem;
    }
    .login-img-col { display: none; }
  }
  @media (max-width: 480px) {
    .auth-grid-login { padding: 0 1rem; }
    .login-card > div[style] { padding: 1.5rem !important; }
  }
`

export default function LoginPage() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const from      = location.state?.from?.pathname
  const [srvErr, setSrvErr] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()

  useEffect(() => {
    const id = '__login-styles__'
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
      const user = await login(data)
      toast.success('Bienvenue !')
      const role = user?.role
      if (role === 'admin' || role === 'employee') {
        navigate('/admin', { replace: true })
        return
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

      <section style={{ background: 'var(--cream)', padding: '2.5rem 1.5rem 4rem' }}>

        <div className="container login-header" style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <h2 style={{ marginBottom: '0.5rem' }}>Pause Thé !</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: 540, margin: '0 auto', fontSize: '0.92rem', lineHeight: 1.7 }}>
            Connecte-toi pour consulter tes lots, suivre tes gains et découvrir quel coffret de thé bio artisanal t'attend.
          </p>
        </div>

        <div className="auth-grid-login">

          {/* Formulaire */}
          <div className="card login-card" style={{ padding: '2.5rem' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '1.75rem', fontSize: '1.1rem' }}>
              Formulaire de connexion
            </h3>

            {srvErr && (
              <div key={srvErr} className="alert alert-err login-alert-err">
                {srvErr}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="form-field login-field">
                <label>Identifiant</label>
                <input
                  type="email"
                  placeholder="Votre mail.."
                  autoComplete="email"
                  className={`login-input${errors.email ? ' is-err' : ''}`}
                  {...register('email', {
                    required: 'Requis',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'E-mail invalide' },
                  })}
                />
                {errors.email && <p className="err">{errors.email.message}</p>}
              </div>

              <div className="form-field login-field">
                <label>Mot de passe</label>
                <input
                  type="password"
                  placeholder="Mot de passe.."
                  autoComplete="current-password"
                  className={`login-input${errors.password ? ' is-err' : ''}`}
                  {...register('password', {
                    required: 'Requis',
                    minLength: { value: 8, message: 'Min 8 caractères' },
                  })}
                />
                {errors.password && <p className="err">{errors.password.message}</p>}
              </div>

              <p className="login-register-link" style={{
                fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem',
              }}>
                Vous n'avez pas de compte ?{' '}
                <Link to="/register" style={{ color: 'var(--green-mid)', fontWeight: 700 }}>
                  S'inscrire
                </Link>
              </p>

              <button
                type="submit"
                className="btn btn-orange login-btn-primary"
                disabled={isSubmitting}
                style={{ width: '100%', fontSize: '1rem', padding: '0.85rem' }}
              >
                {isSubmitting ? 'Connexion…' : 'Se connecter'}
              </button>

              <div className="login-divider" style={{
                textAlign: 'center', margin: '1rem 0',
                color: 'var(--text-muted)', fontSize: '0.82rem',
              }}>
                — ou —
              </div>

              <button type="button" className="btn btn-outline login-btn-social"
                style={{ width: '100%', marginBottom: '0.6rem', fontSize: '0.88rem', gap: '0.6rem' }}>
                <img src="https://www.google.com/favicon.ico" alt="" style={{ width: 16, height: 16 }} />
                Se connecter avec Google
              </button>
            </form>
          </div>

          {/* Image */}
          <div className="auth-img-col login-img-col">
            <img
              src="/images/Connexion/img_01.png"
              alt="Thé Tip Top"
              style={{ width: '100%', height: 500, objectFit: 'cover' }}
            />
          </div>
        </div>
      </section>
    </Layout>
  )
}
