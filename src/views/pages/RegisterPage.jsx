import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext.jsx'
import Layout from '../components/Layout.jsx'
import PageBanner from '../components/PageBanner.jsx'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [srvErrors, setSrvErrors] = useState({})

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm()
  const password = watch('password')

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

      <section style={{ background: 'var(--cream)', padding: '2.5rem 1.5rem 4rem' }}>
        <div className="container" style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <h2>Bienvenue dans l'aventure Thé Tip Top</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: 540, margin: '0.5rem auto 0', fontSize: '0.92rem', lineHeight: 1.7 }}>
            Crée ton compte, tente ta chance et découvre tes lots bien-être et cadeaux de thé bio artisanal.
          </p>
        </div>

        <div className="container auth-grid" style={{
          display: 'grid',
          gridTemplateColumns: '300px 1fr',
          gap: '2rem',
          alignItems: 'start',
          maxWidth: 920,
        }}>
          {/* Side image */}
          <div className="auth-img-col">
            <img
              src="/images/Inscription/img_01.png"
              alt="Inscription"
              style={{ width: '100%', height: 450, objectFit: 'cover', borderRadius: 'var(--radius)' }}
            />
          </div>

          {/* Form card */}
          <div className="card" style={{ padding: '2.5rem' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
              Inscrivez-vous au Jeu-concours !
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-field">
                  <input type="text" placeholder="Nom"
                    className={sErr('last_name') ? 'is-err' : ''}
                    {...register('last_name', { required: 'Requis' })} />
                  {sErr('last_name') && <p className="err">{sErr('last_name')}</p>}
                </div>
                <div className="form-field">
                  <input type="text" placeholder="Prénom"
                    className={sErr('first_name') ? 'is-err' : ''}
                    {...register('first_name', { required: 'Requis' })} />
                  {sErr('first_name') && <p className="err">{sErr('first_name')}</p>}
                </div>
              </div>

              <div className="form-field">
                <input type="email" placeholder="Email"
                  className={sErr('email') ? 'is-err' : ''}
                  {...register('email', {
                    required: 'Requis',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'E-mail invalide' },
                  })} />
                {sErr('email') && <p className="err">{sErr('email')}</p>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-field">
                  <input type="password" placeholder="Mot de passe"
                    className={sErr('password') ? 'is-err' : ''}
                    {...register('password', {
                      required: 'Requis',
                      minLength: { value: 8, message: 'Min 8 car.' },
                    })} />
                  {sErr('password') && <p className="err">{sErr('password')}</p>}
                </div>
                <div className="form-field">
                  <input type="password" placeholder="Confirmez mot de passe"
                    className={errors.password_confirm ? 'is-err' : ''}
                    {...register('password_confirm', {
                      required: 'Requis',
                      validate: v => v === password || 'Mots de passe différents',
                    })} />
                  {errors.password_confirm && <p className="err">{errors.password_confirm.message}</p>}
                </div>
              </div>

              {/* Checkboxes */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.82rem', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '0.6rem' }}>
                  <input type="checkbox" style={{ marginTop: 3, accentColor: 'var(--orange)', flexShrink: 0 }}
                    {...register('consent', { required: 'Vous devez accepter les CGU' })} />
                  J'accepte les conditions générales d'utilisation et le règlement du jeu *
                </label>
                {errors.consent && <p className="err">{errors.consent.message}</p>}

                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.82rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <input type="checkbox" style={{ marginTop: 3, accentColor: 'var(--orange)', flexShrink: 0 }}
                    {...register('newsletter')} />
                  J'accepte de recevoir par e-mail les actualités, offres commerciales et newsletters de Thé Tip Top.
                </label>
              </div>

              <button type="submit" className="btn btn-orange" disabled={isSubmitting}
                style={{ width: '100%', fontSize: '1rem', padding: '0.85rem' }}>
                {isSubmitting ? 'Création…' : 'Créer mon compte'}
              </button>

              <div style={{ textAlign: 'center', margin: '1rem 0', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                — ou —
              </div>

              <button type="button" className="btn btn-outline"
                style={{ width: '100%', marginBottom: '0.6rem', fontSize: '0.88rem', gap: '0.6rem' }}>
                <img src="https://www.google.com/favicon.ico" alt="" style={{ width: 16, height: 16 }} />
                S'inscrire avec Google
              </button>
              <button type="button" className="btn btn-outline"
                style={{ width: '100%', fontSize: '0.88rem', gap: '0.6rem' }}>
                <span style={{ color: '#1877f2', fontWeight: 900, fontSize: '1rem' }}>f</span>
                S'inscrire avec Facebook
              </button>

              <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Déjà un compte ?{' '}
                <Link to="/login" style={{ color: 'var(--green-mid)', fontWeight: 700 }}>Se connecter</Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  )
}
