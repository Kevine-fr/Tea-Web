import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext.jsx'
import Layout from '../components/Layout.jsx'
import PageBanner from '../components/PageBanner.jsx'
import AnimatedLeaves from '../components/AnimatedLeaves.jsx'
import client from '../../api/client.js'
import toast from 'react-hot-toast'

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

  async function onSubmit(data) {
    setSrvErr('')
    try {
      await client.put('auth/profile', data)
      toast.success('Informations mises à jour !')
    } catch (err) {
      setSrvErr(err.response?.data?.message || 'Erreur lors de la mise à jour.')
    }
  }

  return (
    <Layout>
      <PageBanner title="Détails du compte" />

      <div style={{ position: 'relative', background: 'var(--cream)', padding: '2.5rem 1.5rem 4rem', overflow: 'hidden' }}>
        <AnimatedLeaves />
        <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: 760 }}>
          <div className="card" style={{ padding: '2.5rem 3rem' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Mes informations</h2>

            {srvErr && <div className="alert alert-err">{srvErr}</div>}

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-field">
                  <label>Nom *</label>
                  <input type="text" placeholder="Nom"
                    className={errors.last_name ? 'is-err' : ''}
                    {...register('last_name', { required: 'Requis' })} />
                  {errors.last_name && <p className="err">{errors.last_name.message}</p>}
                </div>
                <div className="form-field">
                  <label>Prénom *</label>
                  <input type="text" placeholder="Prénom"
                    className={errors.first_name ? 'is-err' : ''}
                    {...register('first_name', { required: 'Requis' })} />
                  {errors.first_name && <p className="err">{errors.first_name.message}</p>}
                </div>
              </div>

              <div className="form-field">
                <label>Mail *</label>
                <input type="email" placeholder="Mail"
                  className={errors.email ? 'is-err' : ''}
                  {...register('email', {
                    required: 'Requis',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'E-mail invalide' },
                  })} />
                {errors.email && <p className="err">{errors.email.message}</p>}
              </div>

              <div className="form-field">
                <label>Ancien mot de passe *</label>
                <input type="password" placeholder="Ancien mot de passe"
                  {...register('old_password')} />
                <p style={{ fontSize: '0.8rem', color: 'var(--orange)', marginTop: '0.25rem', cursor: 'pointer' }}>
                  J'ai oublié mon mot de passe
                </p>
              </div>

              <div className="form-field">
                <label>Nouveau mot de passe *</label>
                <input type="password" placeholder="Nouveau mot de passe"
                  {...register('password', { minLength: { value: 8, message: 'Min 8 caractères' } })} />
                {errors.password && <p className="err">{errors.password.message}</p>}
              </div>

              <div style={{ textAlign: 'center', marginTop: '0.75rem' }}>
                <button type="submit" className="btn btn-orange" disabled={isSubmitting}
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
