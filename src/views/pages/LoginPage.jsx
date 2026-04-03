import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext.jsx'
import Layout from '../components/Layout.jsx'
import TeaLogo from '../components/TeaLogo.jsx'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const from      = location.state?.from?.pathname || '/dashboard'

  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  async function onSubmit(data) {
    setServerError('')
    try {
      const user = await login(data)
      toast.success(`Bienvenue${user?.email ? ', ' + user.email : ''} !`)
      // Redirection selon le rôle
      const role = user?.role?.name
      if      (role === 'admin')    navigate('/admin',    { replace: true })
      else if (role === 'employee') navigate('/employee', { replace: true })
      else                         navigate(from,         { replace: true })
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Identifiants incorrects.'
      setServerError(msg)
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
        <div style={{ width: '100%', maxWidth: 440 }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Link to="/">
              <TeaLogo size={56} />
            </Link>
            <h2 style={{ marginTop: '1rem', marginBottom: '0.4rem' }}>Bon retour !</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Connectez-vous pour accéder à votre espace
            </p>
          </div>

          {/* Card */}
          <div className="card" style={{ padding: '2.5rem' }}>
            {serverError && (
              <div className="alert alert-error">{serverError}</div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="form-group">
                <label htmlFor="email">Adresse e-mail</label>
                <input
                  id="email"
                  type="email"
                  placeholder="vous@exemple.fr"
                  autoComplete="email"
                  style={errors.email ? { borderColor: 'var(--error)' } : {}}
                  {...register('email', {
                    required: 'L\'e-mail est requis',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'E-mail invalide' },
                  })}
                />
                {errors.email && <p className="error-msg">{errors.email.message}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="password">Mot de passe</label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  style={errors.password ? { borderColor: 'var(--error)' } : {}}
                  {...register('password', {
                    required: 'Le mot de passe est requis',
                    minLength: { value: 8, message: 'Minimum 8 caractères' },
                  })}
                />
                {errors.password && <p className="error-msg">{errors.password.message}</p>}
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
                style={{ width: '100%', marginTop: '0.5rem', padding: '0.85rem' }}
              >
                {isSubmitting ? 'Connexion…' : 'Se connecter'}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Pas encore de compte ?{' '}
              <Link to="/register" style={{ color: 'var(--green-mid)', fontWeight: 700 }}>
                S'inscrire
              </Link>
            </p>
          </div>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <Link to="/politique" style={{ color: 'var(--text-muted)' }}>Politique de confidentialité</Link>
            {' · '}
            <Link to="/cgv" style={{ color: 'var(--text-muted)' }}>CGV</Link>
          </p>
        </div>
      </div>
    </Layout>
  )
}
