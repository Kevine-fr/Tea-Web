// src/views/pages/ContactPage.jsx
import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import Layout from '../components/Layout.jsx'
import PageBanner from '../components/PageBanner.jsx'
import SEO from '../components/SEO.jsx'
import client from '../../api/client.js'
import toast from 'react-hot-toast'

const CSS = `
@keyframes contactIn { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:none} }
`

export default function ContactPage() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm()
  const titleRef = useRef(null)
  const cardRef  = useRef(null)

  useEffect(() => {
    if (titleRef.current) titleRef.current.style.animation = 'contactIn .55s ease .10s both'
    if (cardRef.current)  cardRef.current.style.animation  = 'contactIn .60s ease .28s both'
  }, [])

  async function onSubmit(data) {
    try {
      await client.post('contact', data)
      toast.success('Message envoyé ! Vous allez recevoir un email de confirmation.')
      reset()
    } catch (err) {
      const msg = err.response?.data?.message || 'Erreur lors de l\'envoi. Réessayez.'
      toast.error(msg)
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

      <section style={{ position: 'relative', background: 'var(--cream)', padding: '2.5rem 1.5rem 4rem', overflow: 'hidden' }}>
        <div className="page-inner" style={{ position: 'relative', zIndex: 1 }}>

          <div ref={titleRef} style={{ textAlign: 'center', marginBottom: '1.75rem', opacity: 0 }}>
            <h2>Écrivez-nous !</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '0.92rem', lineHeight: 1.7 }}>
              Une demande, un souci avec un lot, ou juste une question ? On met la bouilloire et on arrive..
            </p>
          </div>

          <div ref={cardRef} className="card  " style={{ padding: '2.5rem 3rem', opacity: 0 }}>
            <h3 style={{ textAlign: 'center', marginBottom: '1.75rem', fontSize: '1.15rem' }}>
              Formulaire de contact
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-field">
                  <input type="text" placeholder="Nom" className={errors.last_name ? 'is-err' : ''}
                    {...register('last_name', { required: 'Requis' })} />
                  {errors.last_name && <p className="err">{errors.last_name.message}</p>}
                </div>
                <div className="form-field">
                  <input type="text" placeholder="Prénom" className={errors.first_name ? 'is-err' : ''}
                    {...register('first_name', { required: 'Requis' })} />
                  {errors.first_name && <p className="err">{errors.first_name.message}</p>}
                </div>
              </div>

              <div className="form-field">
                <input type="email" placeholder="Email" className={errors.email ? 'is-err' : ''}
                  {...register('email', {
                    required: 'Requis',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'E-mail invalide' },
                  })} />
                {errors.email && <p className="err">{errors.email.message}</p>}
              </div>

              <div className="form-field">
                <input type="text" placeholder="Sujet" className={errors.subject ? 'is-err' : ''}
                  {...register('subject', { required: 'Requis' })} />
                {errors.subject && <p className="err">{errors.subject.message}</p>}
              </div>

              <div className="form-field">
                <textarea rows={6} placeholder="Votre message.."
                  className={errors.message ? 'is-err' : ''}
                  {...register('message', {
                    required: 'Requis',
                    minLength: { value: 10, message: 'Message trop court (min. 10 caractères)' },
                  })} />
                {errors.message && <p className="err">{errors.message.message}</p>}
              </div>

              <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                <button type="submit" className="btn btn-orange" disabled={isSubmitting}
                  style={{ padding: '0.85rem 4rem', fontSize: '0.95rem' }}>
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