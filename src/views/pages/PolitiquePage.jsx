import { useState } from 'react'
import Layout from '../components/Layout.jsx'
import PageBanner from '../components/PageBanner.jsx'
import AnimatedLeaves from '../components/AnimatedLeaves.jsx'

const SECTIONS = [
  { title: 'Quelles données nous collectons ?', body: "Nous collectons uniquement les informations nécessaires à votre participation au jeu-concours : nom, prénom, adresse e-mail, date de naissance et données de connexion. Aucune donnée sensible n'est collectée sans votre consentement explicite." },
  { title: 'Comment nous utilisons vos données ?', body: "Vos données sont utilisées pour gérer votre compte, traiter votre participation au jeu-concours, vous attribuer vos gains et vous envoyer des communications relatives au jeu si vous y avez consenti." },
  { title: 'Avec qui vos données peuvent être partagées ?', body: "Thé Tip Top ne vend jamais vos données. Vos informations peuvent être partagées uniquement avec nos prestataires techniques dans le cadre strict de l'exécution du service." },
  { title: 'Comment nous protégeons vos données ?', body: "Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, perte ou destruction, conformément au RGPD." },
  { title: 'Vos droits sur vos données', body: "Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de suppression, d'opposition et de portabilité de vos données. Pour exercer ces droits, contactez-nous à privacy@thetiptop.fr." },
  { title: 'Cookies et traceurs', body: "Notre site utilise des cookies essentiels au bon fonctionnement du service. Vous pouvez configurer votre navigateur pour refuser les cookies, mais cela peut affecter certaines fonctionnalités du site." },
  { title: 'Mises à jour de cette politique', body: "Cette politique de confidentialité peut être mise à jour à tout moment. Nous vous informerons de tout changement significatif par e-mail ou via une notification sur le site." },
  { title: 'Nous contacter', body: "Pour toute question relative à notre politique de confidentialité : Thé Tip Top, 24 rue de Rivoli, 75001 Paris ou privacy@thetiptop.fr." },
]

export default function PolitiquePage() {
  const [open, setOpen] = useState(null)
  return (
    <Layout>
      <PageBanner title="Politique de confidentialité" />
      <section style={{ position: 'relative', background: 'var(--cream)', padding: '3rem 1.5rem 4rem', overflow: 'hidden' }}>
        <AnimatedLeaves />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 820, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '0.75rem' }}>Vos données, en toute confiance</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.8, fontSize: '0.92rem' }}>
            Chez Thé Tip Top, nous protégeons vos données avec sérieux : elles sont utilisées uniquement pour gérer votre compte, votre participation au jeu-concours et le suivi de vos lots.
          </p>
          {SECTIONS.map((s, i) => (
            <div key={i} className="acc-item">
              <div className="acc-head" onClick={() => setOpen(open === i ? null : i)}>
                <span>{s.title}</span>
                <span style={{ fontSize: '1.3rem', fontWeight: 300, color: 'var(--text-muted)', lineHeight: 1 }}>{open === i ? '−' : '+'}</span>
              </div>
              {open === i && <div className="acc-body">{s.body}</div>}
            </div>
          ))}
        </div>
      </section>
    </Layout>
  )
}
