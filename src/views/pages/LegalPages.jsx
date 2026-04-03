import Layout from '../components/Layout.jsx'
import { Link } from 'react-router-dom'

function LegalPage({ title, subtitle, children }) {
  return (
    <Layout>
      <div className="page-hero">
        <div className="container">
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>
      <section className="section" style={{ background: 'var(--cream)' }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <div className="card" style={{ padding: '3rem', lineHeight: 1.8 }}>
            {children}
          </div>
        </div>
      </section>
    </Layout>
  )
}

function LegalSection({ title, children }) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <h3 style={{ marginBottom: '0.75rem', fontSize: '1.1rem', color: 'var(--green-dark)' }}>{title}</h3>
      <div style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>{children}</div>
    </div>
  )
}

// ── Politique de confidentialité ───────────────────────────────────────────────
export function PolitiquePage() {
  return (
    <LegalPage title="Politique de Confidentialité" subtitle="Dernière mise à jour : janvier 2026">
      <LegalSection title="1. Collecte des données">
        <p>Nous collectons les données que vous nous fournissez lors de votre inscription : nom, prénom, adresse e-mail et date de naissance. Ces données sont nécessaires à la participation au jeu-concours.</p>
      </LegalSection>
      <LegalSection title="2. Utilisation des données">
        <p>Vos données sont utilisées exclusivement pour :</p>
        <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
          <li>La gestion de votre participation au jeu-concours</li>
          <li>L'attribution et la remise des lots</li>
          <li>La communication relative au jeu</li>
        </ul>
      </LegalSection>
      <LegalSection title="3. Conservation des données">
        <p>Vos données sont conservées pendant la durée du jeu-concours et 1 an après sa clôture, conformément aux obligations légales.</p>
      </LegalSection>
      <LegalSection title="4. Vos droits">
        <p>Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition. Pour exercer ces droits, contactez-nous à <a href="mailto:privacy@thetiptop.fr" style={{ color: 'var(--green-mid)' }}>privacy@thetiptop.fr</a>.</p>
      </LegalSection>
    </LegalPage>
  )
}

// ── CGU ────────────────────────────────────────────────────────────────────────
export function CguPage() {
  return (
    <LegalPage title="Conditions Générales d'Utilisation" subtitle="Version en vigueur depuis le 1er janvier 2026">
      <LegalSection title="1. Acceptation des CGU">
        <p>L'utilisation du site Thé Tip Top implique l'acceptation pleine et entière des présentes conditions générales d'utilisation.</p>
      </LegalSection>
      <LegalSection title="2. Accès au service">
        <p>Le site est accessible 24h/24, 7j/7, sauf interruption pour maintenance. Thé Tip Top ne peut être tenu responsable des interruptions de service.</p>
      </LegalSection>
      <LegalSection title="3. Inscription">
        <p>L'inscription nécessite d'avoir 18 ans révolus et de résider en France métropolitaine. Chaque utilisateur ne peut posséder qu'un seul compte.</p>
      </LegalSection>
      <LegalSection title="4. Utilisation des codes">
        <p>Chaque code de participation est à usage unique et personnel. Tout partage, revente ou cession de code est strictement interdit.</p>
      </LegalSection>
      <LegalSection title="5. Propriété intellectuelle">
        <p>L'ensemble des contenus présents sur le site (textes, images, logos) est la propriété exclusive de Thé Tip Top et est protégé par le droit d'auteur.</p>
      </LegalSection>
    </LegalPage>
  )
}

// ── CGV ────────────────────────────────────────────────────────────────────────
export function CgvPage() {
  return (
    <LegalPage title="Conditions Générales de Vente" subtitle="Applicables à compter du 1er janvier 2026">
      <LegalSection title="1. Lots et gains">
        <p>Les lots sont attribués par tirage aléatoire parmi les tickets valides. Chaque ticket est garanti gagnant d'un lot parmi la sélection disponible.</p>
      </LegalSection>
      <LegalSection title="2. Remise des lots">
        <p>Les lots peuvent être récupérés selon les modalités suivantes :</p>
        <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
          <li><strong>En boutique</strong> : sur présentation de votre confirmation de gain</li>
          <li><strong>Par courrier</strong> : envoi à votre adresse dans un délai de 15 jours ouvrés</li>
          <li><strong>En ligne</strong> : téléchargement ou application de votre bon de réduction</li>
        </ul>
      </LegalSection>
      <LegalSection title="3. Délai de réclamation">
        <p>Les lots doivent être réclamés dans un délai de <strong>60 jours</strong> suivant la date de participation. Passé ce délai, le gain est annulé sans contrepartie.</p>
      </LegalSection>
      <LegalSection title="4. Lots non échangeables">
        <p>Les lots ne sont ni échangeables ni remboursables en espèces. Ils ne peuvent pas être cédés à un tiers.</p>
      </LegalSection>
    </LegalPage>
  )
}

// ── 404 ────────────────────────────────────────────────────────────────────────
export function NotFoundPage() {
  return (
    <Layout>
      <div style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '3rem',
        background: 'var(--cream)',
      }}>
        <div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '8rem', fontWeight: 700, color: 'var(--cream-border)', lineHeight: 1, marginBottom: '1rem' }}>
            404
          </div>
          <h2 style={{ marginBottom: '0.75rem' }}>Page introuvable</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: 400 }}>
            La page que vous cherchez n'existe pas ou a été déplacée.
          </p>
          <Link to="/" className="btn btn-primary">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </Layout>
  )
}
