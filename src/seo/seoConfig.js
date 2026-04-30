// src/seo/seoConfig.js
// ─── Config SEO centralisée pour toutes les pages ───────────
// Usage : import { SEO } from '../seo/seoConfig.js'

const SITE_URL  = import.meta.env.VITE_SITE_URL  || 'thetiptop.fr'
const BASE_URL  = `https://${SITE_URL}`
const OG_IMAGE  = `${BASE_URL}/images/og-image.jpg`
const SITE_NAME = 'Thé Tip Top'

const defaults = {
  title       : 'Thé Tip Top — Jeu-concours & thés bio artisanaux',
  description : 'Participez au jeu-concours Thé Tip Top et gagnez des lots de thé bio artisanaux. 100 % des codes sont gagnants.',
  image       : OG_IMAGE,
  url         : BASE_URL,
  type        : 'website',
  robots      : 'index, follow',
  locale      : 'fr_FR',
}

export const SEO = {
  home: {
    ...defaults,
  },

  login: {
    title      : 'Connexion — Thé Tip Top',
    description: 'Connectez-vous à votre espace Thé Tip Top pour consulter vos lots et suivre vos gains.',
    url        : `${BASE_URL}/login`,
    robots     : 'noindex, nofollow',
    image      : OG_IMAGE,
  },

  register: {
    title      : 'Inscription — Thé Tip Top',
    description: 'Créez votre compte Thé Tip Top pour participer au jeu-concours et remporter des lots de thé bio artisanal.',
    url        : `${BASE_URL}/register`,
    robots     : 'noindex, nofollow',
    image      : OG_IMAGE,
  },

  jeu: {
    title      : 'Participer au jeu — Thé Tip Top',
    description: 'Saisissez votre code unique et découvrez votre lot. 100 % des participants gagnent un coffret de thé bio artisanal.',
    url        : `${BASE_URL}/jeu`,
    robots     : 'noindex, nofollow',
    image      : OG_IMAGE,
  },

  gains: {
    title      : 'Mes gains — Thé Tip Top',
    description: 'Consultez et suivez vos gains obtenus lors du jeu-concours Thé Tip Top.',
    url        : `${BASE_URL}/mes-gains`,
    robots     : 'noindex, nofollow',
    image      : OG_IMAGE,
  },

  dashboard: {
    title      : 'Mon espace — Thé Tip Top',
    description: 'Accédez à votre tableau de bord personnel Thé Tip Top.',
    url        : `${BASE_URL}/dashboard`,
    robots     : 'noindex, nofollow',
    image      : OG_IMAGE,
  },

  profile: {
    title      : 'Mon profil — Thé Tip Top',
    description: 'Gérez vos informations personnelles sur votre compte Thé Tip Top.',
    url        : `${BASE_URL}/profil`,
    robots     : 'noindex, nofollow',
    image      : OG_IMAGE,
  },

  admin: {
    title      : 'Administration — Thé Tip Top',
    description: 'Espace d\'administration Thé Tip Top.',
    url        : `${BASE_URL}/admin`,
    robots     : 'noindex, nofollow',
    image      : OG_IMAGE,
  },

  contact: {
    title      : 'Contact — Thé Tip Top',
    description: 'Contactez l\'équipe Thé Tip Top pour toute question concernant le jeu-concours ou nos produits.',
    url        : `${BASE_URL}/contact`,
    robots     : 'index, follow',
    image      : OG_IMAGE,
  },

  cgu: {
    title      : 'Conditions Générales d\'Utilisation — Thé Tip Top',
    description: 'Consultez les conditions générales d\'utilisation du site et du jeu-concours Thé Tip Top.',
    url        : `${BASE_URL}/cgu`,
    robots     : 'index, follow',
    image      : OG_IMAGE,
  },

  politique: {
    title      : 'Politique de confidentialité — Thé Tip Top',
    description: 'Découvrez comment Thé Tip Top protège vos données personnelles conformément au RGPD.',
    url        : `${BASE_URL}/politique`,
    robots     : 'index, follow',
    image      : OG_IMAGE,
  },

  notFound: {
    title      : 'Page introuvable (404) — Thé Tip Top',
    description: 'Cette page n\'existe pas ou a été déplacée.',
    url        : BASE_URL,
    robots     : 'noindex, nofollow',
    image      : OG_IMAGE,
  },
}

export { defaults, BASE_URL, SITE_NAME }