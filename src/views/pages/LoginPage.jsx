import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext.jsx'
import Layout from '../components/Layout.jsx'
import PageBanner from '../components/PageBanner.jsx'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const from      = location.state?.from?.pathname
  const [srvErr, setSrvErr] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()

  async function onSubmit(data) {
    setSrvErr('')
    try {
      const user = await login(data)
      toast.success('Bienvenue !')

      const role = user?.role

      // Admins et employés → toujours vers /admin, quelle que soit l'origine
      if (role === 'admin' || role === 'employee') {
        navigate('/admin', { replace: true })
        return
      }

      // Utilisateurs normaux → retour à la page d'origine si pertinente,
      // sinon dashboard
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
        <div className="container" style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <h2 style={{ marginBottom: '0.5rem' }}>Pause Thé !</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: 540, margin: '0 auto', fontSize: '0.92rem', lineHeight: 1.7 }}>
            Connecte-toi pour consulter tes lots, suivre tes gains et découvrir quel coffret de thé bio artisanal t'attend.
          </p>
        </div>

        <div className="container auth-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 340px',
          gap: '2rem',
          alignItems: 'start',
          maxWidth: 900,
        }}>
          {/* ── Formulaire ── */}
          <div className="card" style={{ padding: '2.5rem' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '1.75rem', fontSize: '1.1rem' }}>
              Formulaire de connexion
            </h3>

            {srvErr && <div className="alert alert-err">{srvErr}</div>}

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="form-field">
                <label>Identifiant</label>
                <input
                  type="email"
                  placeholder="Votre mail.."
                  autoComplete="email"
                  className={errors.email ? 'is-err' : ''}
                  {...register('email', {
                    required: 'Requis',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'E-mail invalide' },
                  })}
                />
                {errors.email && <p className="err">{errors.email.message}</p>}
              </div>

              <div className="form-field">
                <label>Mot de passe</label>
                <input
                  type="password"
                  placeholder="Mot de passe.."
                  autoComplete="current-password"
                  className={errors.password ? 'is-err' : ''}
                  {...register('password', {
                    required: 'Requis',
                    minLength: { value: 8, message: 'Min 8 caractères' },
                  })}
                />
                {errors.password && <p className="err">{errors.password.message}</p>}
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                Vous n'avez pas de compte ?{' '}
                <Link to="/register" style={{ color: 'var(--green-mid)', fontWeight: 700 }}>
                  S'inscrire
                </Link>
              </p>

              <button
                type="submit"
                className="btn btn-orange"
                disabled={isSubmitting}
                style={{ width: '100%', fontSize: '1rem', padding: '0.85rem' }}
              >
                {isSubmitting ? 'Connexion…' : 'Se connecter'}
              </button>

              <div style={{ textAlign: 'center', margin: '1rem 0', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                — ou —
              </div>

              <button type="button" className="btn btn-outline"
                style={{ width: '100%', marginBottom: '0.6rem', fontSize: '0.88rem', gap: '0.6rem' }}>
                <img src="https://www.google.com/favicon.ico" alt="" style={{ width: 16, height: 16 }} />
                Se connecter avec Google
              </button>
              <button type="button" className="btn btn-outline"
                style={{ width: '100%', fontSize: '0.88rem', gap: '0.6rem' }}>
                <span style={{ color: '#1877f2', fontWeight: 900, fontSize: '1rem' }}>f</span>
                Se connecter avec Facebook
              </button>
            </form>
          </div>

          {/* ── Image latérale ── */}
          <div className="auth-img-col">
            <img
              src="/images/Connexion/img_01.png"
              alt="Thé Tip Top"
              style={{ width: '100%', height: 420, objectFit: 'cover', borderRadius: 'var(--radius)' }}
            />
          </div>
        </div>
      </section>
    </Layout>
  )
}
