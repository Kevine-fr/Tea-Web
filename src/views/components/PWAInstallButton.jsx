import { useState } from 'react'
import { usePWAInstall } from '../../hooks/usePWAInstall.js'

const CSS_PWA = `
@keyframes pwaSlideIn  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
@keyframes pwaPulse    { 0%,100%{box-shadow:0 0 0 0 rgba(26,60,46,.4)} 70%{box-shadow:0 0 0 10px rgba(26,60,46,0)} }

.pwa-banner {
  position:fixed; bottom:5.5rem; right:1.25rem; z-index:1000;
  background:var(--green-dark, #1a3c2e);
  border-radius:14px; padding:1rem 1.25rem;
  box-shadow:0 8px 32px rgba(0,0,0,.25);
  display:flex; align-items:flex-start; gap:.85rem;
  max-width:300px; min-width:240px;
  animation:pwaSlideIn .4s cubic-bezier(.22,.68,0,1.2) both;
}
.pwa-banner-icon {
  font-size:1.6rem; flex-shrink:0; margin-top:.1rem;
}
.pwa-banner-body { flex:1; min-width:0; }
.pwa-banner-title {
  font-family:'Playfair Display',Georgia,serif;
  color:#fff; font-size:.95rem; font-weight:700; margin-bottom:.2rem;
}
.pwa-banner-sub {
  font-size:.75rem; color:rgba(255,255,255,.6);
  line-height:1.4; margin-bottom:.7rem;
}
.pwa-banner-sub strong { color:rgba(255,255,255,.9); }
.pwa-install-btn {
  width:100%; padding:.52rem .9rem; border-radius:999px;
  background:var(--gold, #d4af37); color:var(--green-dark, #1a3c2e);
  font-family:'Lato',sans-serif; font-size:.82rem; font-weight:800;
  border:none; cursor:pointer; letter-spacing:.02em;
  transition:transform .18s ease, background .18s ease;
  animation:pwaPulse 2.5s ease-in-out infinite;
}
.pwa-install-btn:hover  { transform:scale(1.03); animation:none; background:#e0c040; }
.pwa-install-btn:active { transform:scale(.97); }
.pwa-install-btn:disabled { opacity:.6; cursor:not-allowed; animation:none; }
.pwa-close-btn {
  background:none; border:none; color:rgba(255,255,255,.4);
  font-size:1.1rem; cursor:pointer; line-height:1; padding:.1rem;
  flex-shrink:0; transition:color .2s;
}
.pwa-close-btn:hover { color:#fff; }
.pwa-ios-hint {
  display:flex; align-items:center; gap:.4rem;
  background:rgba(255,255,255,.1);
  border-radius:8px; padding:.5rem .7rem;
  font-size:.75rem; color:rgba(255,255,255,.75);
  margin-top:.4rem; line-height:1.4;
}
.pwa-ios-hint strong { color:#fff; }

@media(max-width:480px) {
  .pwa-banner { right:.75rem; bottom:4.5rem; max-width:calc(100vw - 1.5rem); }
}
`

export function PWAInstallButton() {
  const { canInstall, isInstalling, install } = usePWAInstall()
  const [dismissed, setDismissed]             = useState(
    () => localStorage.getItem('pwa-banner-dismissed') === '1'
  )

  // ── Détection iOS ─────────────────────────────────────────────
  const isIOS             = /iphone|ipad|ipod/i.test(navigator.userAgent)
  const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches

  function dismiss() {
    localStorage.setItem('pwa-banner-dismissed', '1')
    setDismissed(true)
  }

  // Déjà installée ou bannière rejetée → rien à afficher
  if (dismissed || isInStandaloneMode) return null

  return (
    <>
      <style>{CSS_PWA}</style>

      {/* ── iOS : prompt natif impossible, on guide l'utilisateur ── */}
      {isIOS && (
        <div className="pwa-banner" role="complementary" aria-label="Installer l'application">
          <div className="pwa-banner-icon">📲</div>
          <div className="pwa-banner-body">
            <div className="pwa-banner-title">Installer l'appli</div>
            <div className="pwa-banner-sub">
              Sur iPhone / iPad, appuyez sur :
            </div>
            <div className="pwa-ios-hint">
              ⎙ <strong>Partager</strong> → <strong>"Sur l'écran d'accueil"</strong>
            </div>
          </div>
          <button className="pwa-close-btn" onClick={dismiss} aria-label="Fermer">×</button>
        </div>
      )}

      {/* ── Android / Desktop : prompt natif via beforeinstallprompt ── */}
      {!isIOS && canInstall && (
        <div className="pwa-banner" role="complementary" aria-label="Installer l'application">
          <div className="pwa-banner-icon">📲</div>
          <div className="pwa-banner-body">
            <div className="pwa-banner-title">Installer l'appli</div>
            <div className="pwa-banner-sub">
              Accédez à Thé Tip Top directement depuis votre écran d'accueil, même hors ligne.
            </div>
            <button className="pwa-install-btn" onClick={install} disabled={isInstalling}>
              {isInstalling ? 'Installation…' : '⬇ Installer gratuitement'}
            </button>
          </div>
          <button className="pwa-close-btn" onClick={dismiss} aria-label="Fermer">×</button>
        </div>
      )}
    </>
  )
}

export default PWAInstallButton