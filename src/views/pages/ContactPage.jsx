import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Layout from '../components/Layout.jsx'
import toast from 'react-hot-toast'

const INFOS = [
  { icon: '📍', label: 'Adresse', value: '24 rue de Rivoli, 75001 Paris' },
  { icon: '📧', label: 'E-mail',  value: 'contact@thetiptop.fr' },
  { icon: '📞', label: 'Téléphone', value: '+33 1 23 45 67 89' },
  { icon: '🕐', label: 'Horaires', value: 'Lun – Sam : 9h – 19h' },
]

export default function ContactPage() {
  const [sent, setSent] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm()

  async function onSubmit(data) {
    // Simulation envoi — remplacer par un appel API si disponible
    await new Promise(r => setTimeout(r, 800))
    console.log('[Contact] Message envoyé :', data)
    toast.success('Message envoyé ! Nous vous répondrons sous 48h.')
    reset()
    setSent(true)
  }

  return (
    <Layout>
      <div className="page-hero">
        <div className="container">
          <h1>Nous Contacter</h1>
          <p>Une question sur le jeu-concours ? Notre équipe est là pour vous.</p>
        </div>
      </div>

      <section className="section" style={{ background: 'var(--cream)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>

          {/* Infos */}
          <div>
            <h3 style={{ marginBottom: '1.5rem' }}>Informations</h3>
            {INFOS.map(({ icon, label, value }) => (
              <div key={label} style={{
                display: 'flex',
                gap: '1rem',
                padding: '1rem 0',
                borderBottom: '1px solid var(--cream-border)',
              }}>
                <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{icon}</span>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--green-dark)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.15rem' }}>
                    {label}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{value}</div>
                </div>
              </div>
            ))}

            <div style={{ marginTop: '2rem', background: 'rgba(45,106,79,.08)', borderRadius: 'var(--radius)', padding: '1.25rem', borderLeft: '3px solid var(--green-mid)' }}>
              <p style={{ fontSize: '0.88rem', color: 'var(--green-dark)', lineHeight: 1.65 }}>
                <strong>Pour toute question sur le jeu-concours</strong>, indiquez votre numéro de ticket 
                dans votre message pour nous permettre de vous répondre rapidement.
              </p>
            </div>
          </div>

          {/* Formulaire */}
          <div className="card" style={{ padding: '2.5rem' }}>
            {sent ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                <h3 style={{ marginBottom: '0.5rem' }}>Message envoyé !</h3>
                <p style={{ color: 'var(--text-muted)' }}>Nous vous répondrons dans les 48 heures.</p>
                <button onClick={() => setSent(false)} className="btn btn-outline" style={{ marginTop: '1.5rem' }}>
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <h3 style={{ marginBottom: '1.5rem' }}>Envoyer un message</h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Prénom</label>
                    <input type="text" placeholder="Jean" {...register('first_name', { required: 'Requis' })} />
                    {errors.first_name && <p className="error-msg">{errors.first_name.message}</p>}
                  </div>
                  <div className="form-group">
                    <label>Nom</label>
                    <input type="text" placeholder="Dupont" {...register('last_name', { required: 'Requis' })} />
                    {errors.last_name && <p className="error-msg">{errors.last_name.message}</p>}
                  </div>
                </div>

                <div className="form-group">
                  <label>E-mail</label>
                  <input type="email" placeholder="vous@exemple.fr"
                    {...register('email', { required: 'Requis', pattern: { value: /^\S+@\S+\.\S+$/, message: 'E-mail invalide' } })} />
                  {errors.email && <p className="error-msg">{errors.email.message}</p>}
                </div>

                <div className="form-group">
                  <label>Sujet</label>
                  <select {...register('subject', { required: 'Requis' })}>
                    <option value="">Choisir un sujet…</option>
                    <option value="jeu">Question sur le jeu-concours</option>
                    <option value="lot">Problème avec mon lot</option>
                    <option value="code">Code ticket invalide</option>
                    <option value="autre">Autre</option>
                  </select>
                  {errors.subject && <p className="error-msg">{errors.subject.message}</p>}
                </div>

                <div className="form-group">
                  <label>Message</label>
                  <textarea
                    rows={5}
                    placeholder="Décrivez votre demande…"
                    style={{ resize: 'vertical' }}
                    {...register('message', { required: 'Requis', minLength: { value: 10, message: 'Minimum 10 caractères' } })}
                  />
                  {errors.message && <p className="error-msg">{errors.message.message}</p>}
                </div>

                <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ width: '100%', padding: '0.85rem' }}>
                  {isSubmitting ? 'Envoi en cours…' : 'Envoyer le message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </Layout>
  )
}
