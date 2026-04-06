// src/views/components/SEO.jsx
// Composant léger sans dépendance externe.
// Met à jour document.title et la meta description à chaque montage.

import { useEffect } from 'react'

const DEFAULT_TITLE = 'Jeu-concours Thé Tip Top | Gagnez des lots de thé bio artisanal'
const DEFAULT_DESC  = "Participez au jeu-concours 100 % gagnant de Thé Tip Top à l'occasion de l'ouverture de notre 10ème boutique à Nice et tentez de remporter de nombreux lots."

function getOrCreateMeta(name) {
  let el = document.querySelector(`meta[name="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('name', name)
    document.head.appendChild(el)
  }
  return el
}

export default function SEO({ title, description }) {
  useEffect(() => {
    const prevTitle = document.title
    const metaDesc  = getOrCreateMeta('description')
    const prevDesc  = metaDesc.getAttribute('content') || ''

    document.title = title || DEFAULT_TITLE
    metaDesc.setAttribute('content', description || DEFAULT_DESC)

    return () => {
      document.title = prevTitle
      metaDesc.setAttribute('content', prevDesc)
    }
  }, [title, description])

  return null
}