// src/views/pages/PolitiquePage.jsx

import { useEffect, useRef, useState } from 'react'
import Layout from '../components/Layout.jsx'
import PageBanner from '../components/PageBanner.jsx'

const CSS = `
@keyframes accIn  { from { opacity:0; transform: translateY(18px) } to { opacity:1; transform: none } }
@keyframes accOpen { from { opacity:0; max-height:0 } to { opacity:1; max-height: 300px } }
`

function useReveal() {
  const [vis, setVis] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect() } },
      { threshold: 0.05 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return [ref, vis]
}

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

function AccItem({ title, body, delay }) {
  const [open, setOpen] = useState(false)
  const [ref, vis] = useReveal()
  return (
    <div ref={ref} className="acc-item" style={{
      opacity: vis ? 1 : 0,
      transform: vis ? 'translateY(0)' : 'translateY(18px)',
      transition: `opacity .45s ease ${delay}s, transform .45s ease ${delay}s`,
    }}>
      <div className="acc-head" onClick={() => setOpen(!open)}>
        <span>{title}</span>
        <span style={{
          fontSize: '1.3rem', fontWeight: 300, color: 'var(--text-muted)', lineHeight: 1,
          transition: 'transform .25s ease',
          display: 'inline-block',
          transform: open ? 'rotate(45deg)' : 'none',
        }}>+</span>
      </div>
      {open && (
        <div className="acc-body" style={{ animation: 'accOpen .3s ease both' }}>
          {body}
        </div>
      )}
    </div>
  )
}

export default function PolitiquePage() {
  const titleRef = useRef(null)
  const descRef  = useRef(null)
  useEffect(() => {
    if (titleRef.current) titleRef.current.style.animation = 'accIn .55s ease .1s both'
    if (descRef.current)  descRef.current.style.animation  = 'accIn .55s ease .25s both'
  }, [])

  return (
    <Layout>
      <style>{CSS}</style>
      <PageBanner title="Politique" />
      <section style={{ position: 'relative', background: 'var(--cream)', padding: '3rem 1.5rem 4rem', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 820, margin: '0 auto' }}>
          <h2 ref={titleRef} style={{ textAlign: 'center', marginBottom: '0.75rem', opacity: 0 }}>
            Vos données, en toute confiance
          </h2>
          <p ref={descRef} style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.8, fontSize: '0.92rem', opacity: 0 }}>
            Chez Thé Tip Top, nous protégeons vos données avec sérieux : elles sont utilisées uniquement pour gérer votre compte, votre participation au jeu-concours et le suivi de vos lots.
          </p>
          {SECTIONS.map((s, i) => (
            <AccItem key={i} title={s.title} body={s.body} delay={Math.min(i * 0.07, 0.5)} />
          ))}
        </div>
      </section>
    </Layout>
  )
}