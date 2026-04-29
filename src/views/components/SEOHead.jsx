import { useEffect } from 'react'
import { defaults, SITE_NAME } from '../../seo/seoConfig.js'

function setMeta(property, content, isProperty = false) {
  if (!content) return
  const attr = isProperty ? 'property' : 'name'
  let el = document.querySelector(`meta[${attr}="${property}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, property)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export default function SEOHead({
  title       = defaults.title,
  description = defaults.description,
  url         = defaults.url,
  image       = defaults.image,
  robots      = defaults.robots,
  type        = 'website',
  locale      = 'fr_FR',
  jsonLd      = null,
}) {
  useEffect(() => {
    document.title = title

    setMeta('description', description)
    setMeta('robots', robots)

    setMeta('og:type',        type,        true)
    setMeta('og:title',       title,       true)
    setMeta('og:description', description, true)
    setMeta('og:image',       image,       true)
    setMeta('og:url',         url,         true)
    setMeta('og:locale',      locale,      true)
    setMeta('og:site_name',   SITE_NAME,   true)

    setMeta('twitter:card',        'summary_large_image')
    setMeta('twitter:title',       title)
    setMeta('twitter:description', description)
    setMeta('twitter:image',       image)

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', url)

    // JSON-LD
    const data = jsonLd ?? {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_NAME,
      url: defaults.url,
    }
    let ld = document.querySelector('script[type="application/ld+json"]')
    if (!ld) {
      ld = document.createElement('script')
      ld.setAttribute('type', 'application/ld+json')
      document.head.appendChild(ld)
    }
    ld.textContent = JSON.stringify(data)
  }, [title, description, url, image, robots])

  return null
}