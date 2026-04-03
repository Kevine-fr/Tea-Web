import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext.jsx'
import Layout from '../components/Layout.jsx'
import TeaLogo from '../components/TeaLogo.jsx'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [serverErrors, setServerErrors] = useState({})

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()

  const password = watch('password')

  async function onSubmit(data) {
    setServerErrors({})
    const { password_confirm, ...payload } = data
    try {
      await registerUser(payload)
      toast.success('Compte créé ! Bienvenue chez Thé Tip Top 🍵')
      navigate('/dashboard', { replace: true })
    } catch (err) {
      const resp = err.response?.data
      if (resp?.errors) {
        // Erreurs de validation Laravel (422)
        const flat = {}
        Object.entries(resp.errors).forEach(([key, msgs]) => {
          flat[key] = Array.isArray(msgs) ? msgs[0] : msgs
        })
        setServerErrors(flat)
      } else {
        toast.error(resp?.message || 'Erreur lors de l\'inscription.')
      }
    }
  }

  return (
    <Layout>
      <div style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        background: 'linear-gradient(135deg, var(--cream) 0%, var(--cream-dark) 100%)',
      }}>
        <div style={{ width: '100%', maxWidth: 500 }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Link to="/"><TeaLogo size={56} /></Link>
            <h2 style={{ marginTop: '1rem', marginBottom: '0.4rem' }}>Créer mon compte</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Rejoignez Thé Tip Top et participez au jeu-concours
            </p>
          </div>

          {/* Card */}
          <div className="card" style={{ padding: '2.5rem' }}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Prénom</label>
                  <input
                    type="text"
                    placeholder="Jean"
                    style={errors.first_name || serverErrors.first_name ? { borderColor: 'var(--error)' } : {}}
                    {...register('first_name', { required: 'Requis' })}
                  />
                  {(errors.first_name || serverErrors.first_name) && (
                    <p className="error-msg">{errors.first_name?.message || serverErrors.first_name}</p>
                  )}
                </div>
                <div className="form-group">
                  <label>Nom</label>
                  <input
                    type="text"
                    placeholder="Dupont"
                    style={errors.last_name || serverErrors.last_name ? { borderColor: 'var(--error)' } : {}}
                    {...register('last_name', { required: 'Requis' })}
                  />
                  {(errors.last_name || serverErrors.last_name) && (
                    <p className="error-msg">{errors.last_name?.message || serverErrors.last_name}</p>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Adresse e-mail</label>
                <input
                  type="email"
                  placeholder="vous@exemple.fr"
                  autoComplete="email"
                  style={errors.email || serverErrors.email ? { borderColor: 'var(--error)' } : {}}
                  {...register('email', {
                    required: 'L\'e-mail est requis',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'E-mail invalide' },
                  })}
                />
                {(errors.email || serverErrors.email) && (
                  <p className="error-msg">{errors.email?.message || serverErrors.email}</p>
                )}
              </div>

              <div className="form-group">
                <label>Date de naissance</label>
                <input
                  type="date"
                  style={errors.birth_date || serverErrors.birth_date ? { borderColor: 'var(--error)' } : {}}
                  {...register('birth_date', { required: 'Requis' })}
                />
                {(errors.birth_date || serverErrors.birth_date) && (
                  <p className="error-msg">{errors.birth_date?.message || serverErrors.birth_date}</p>
                )}
              </div>

              <div className="form-group">
                <label>Mot de passe</label>
                <input
                  type="password"
                  placeholder="Minimum 8 caractères"
                  autoComplete="new-password"
                  style={errors.password || serverErrors.password ? { borderColor: 'var(--error)' } : {}}
                  {...register('password', {
                    required: 'Requis',
                    minLength: { value: 8, message: 'Minimum 8 caractères' },
                  })}
                />
                {(errors.password || serverErrors.password) && (
                  <p className="error-msg">{errors.password?.message || serverErrors.password}</p>
                )}
              </div>

              <div className="form-group">
                <label>Confirmer le mot de passe</label>
                <input
                  type="password"
                  placeholder="Répétez votre mot de passe"
                  autoComplete="new-password"
                  style={errors.password_confirm ? { borderColor: 'var(--error)' } : {}}
                  {...register('password_confirm', {
                    required: 'Requis',
                    validate: (v) => v === password || 'Les mots de passe ne correspondent pas',
                  })}
                />
                {errors.password_confirm && (
                  <p className="error-msg">{errors.password_confirm.message}</p>
                )}
              </div>

              {/* Consentement */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', margin: '1rem 0' }}>
                <input
                  id="consent"
                  type="checkbox"
                  style={{ marginTop: '3px', accentColor: 'var(--green-mid)', flexShrink: 0 }}
                  {...register('consent', { required: 'Vous devez accepter les CGU' })}
                />
                <label htmlFor="consent" style={{ fontSize: '0.83rem', color: 'var(--text-muted)', fontWeight: 400, textTransform: 'none', letterSpacing: 0, cursor: 'pointer' }}>
                  J'accepte les{' '}
                  <Link to="/cgu" target="_blank" style={{ color: 'var(--green-mid)' }}>conditions d'utilisation</Link>
                  {' '}et la{' '}
                  <Link to="/politique" target="_blank" style={{ color: 'var(--green-mid)' }}>politique de confidentialité</Link>
                </label>
              </div>
              {errors.consent && <p className="error-msg">{errors.consent.message}</p>}

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
                style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem' }}
              >
                {isSubmitting ? 'Création du compte…' : 'Créer mon compte'}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Déjà un compte ?{' '}
              <Link to="/login" style={{ color: 'var(--green-mid)', fontWeight: 700 }}>Se connecter</Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
