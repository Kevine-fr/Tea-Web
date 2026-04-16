// ═══════════════════════════════════════════════════════════════════
// src/hooks/usePWAInstall.js
// Capture l'événement beforeinstallprompt pour afficher un bouton
// d'installation PWA au bon moment.
// ═══════════════════════════════════════════════════════════════════
import { useState, useEffect } from 'react'

export function usePWAInstall() {
  const [prompt,      setPrompt]      = useState(null)   // événement différé
  const [isInstalled, setIsInstalled] = useState(false)
  const [isInstalling, setInstalling] = useState(false)

  useEffect(() => {
    /* Déjà installée en mode standalone */
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    const handler = e => {
      e.preventDefault()           // empêche le prompt navigateur automatique
      setPrompt(e)                  // on le garde pour l'afficher nous-mêmes
    }

    const onAppInstalled = () => {
      setIsInstalled(true)
      setPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', onAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      window.removeEventListener('appinstalled', onAppInstalled)
    }
  }, [])

  async function install() {
    if (!prompt) return
    setInstalling(true)
    try {
      await prompt.prompt()
      const { outcome } = await prompt.userChoice
      if (outcome === 'accepted') setIsInstalled(true)
    } finally {
      setPrompt(null)
      setInstalling(false)
    }
  }

  return {
    canInstall:  !!prompt && !isInstalled,
    isInstalled,
    isInstalling,
    install,
  }
}

