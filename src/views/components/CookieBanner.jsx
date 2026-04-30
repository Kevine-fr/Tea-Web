import { useState, useEffect } from 'react'

const STORAGE_KEY = 'cookie-consent-v1'

function getConsent() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) }
  catch { return null }
}

function saveConsent(prefs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...prefs, savedAt: Date.now() }))
}

/* Hook exporté — utile pour conditionner les scripts analytics */
export function useCookieConsent() {
  const [consent, setConsent] = useState(() => getConsent())
  const refresh = () => setConsent(getConsent())
  return { consent, refresh }
}

const CSS_COOKIE = `
@keyframes cookieIn   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:none} }
@keyframes cookiePanelIn { from{opacity:0;transform:translateY(8px) scale(.99)} to{opacity:1;transform:none} }

.ck-overlay {
  position:fixed; inset:0; background:rgba(0,0,0,.45); z-index:9998;
  display:flex; align-items:flex-end; justify-content:center;
  padding:0;
}
.ck-banner {
  background:#fff; width:100%; max-height:90vh; overflow-y:auto;
  border-radius:16px 16px 0 0;
  padding:1.75rem 1.5rem 2rem;
  animation:cookieIn .35s cubic-bezier(.22,.68,0,1.1) both;
  font-family:'Lato',sans-serif;
}
@media(min-width:700px) {
  .ck-overlay { align-items:center; padding:1rem; }
  .ck-banner  { max-width:560px; border-radius:16px; }
}
.ck-title {
  font-family:'Playfair Display',Georgia,serif;
  font-size:1.2rem; font-weight:700; color:var(--green-dark,#1a3c2e);
  margin-bottom:.35rem;
}
.ck-sub {
  font-size:.83rem; color:var(--text-muted,#888);
  line-height:1.55; margin-bottom:1.25rem;
}
.ck-toggle-row {
  display:flex; align-items:center; justify-content:space-between;
  padding:.7rem 0; border-bottom:1px solid #f0ebe0;
  gap:.75rem;
}
.ck-toggle-row:last-of-type { border-bottom:none; }
.ck-toggle-label { font-size:.85rem; font-weight:700; color:#333; }
.ck-toggle-desc  { font-size:.75rem; color:var(--text-muted,#888); margin-top:.15rem; }

/* Toggle switch */
.ck-switch { position:relative; width:42px; height:24px; flex-shrink:0; }
.ck-switch input { opacity:0; width:0; height:0; }
.ck-switch-track {
  position:absolute; inset:0; border-radius:999px;
  background:#ddd; cursor:pointer;
  transition:background .25s ease;
}
.ck-switch input:checked ~ .ck-switch-track { background:var(--green-dark,#1a3c2e); }
.ck-switch input:disabled ~ .ck-switch-track { background:var(--green-light,#4a8c60); cursor:not-allowed; opacity:.6; }
.ck-switch-thumb {
  position:absolute; top:3px; left:3px;
  width:18px; height:18px; border-radius:50%;
  background:#fff; pointer-events:none;
  transition:transform .25s ease;
  box-shadow:0 1px 4px rgba(0,0,0,.2);
}
.ck-switch input:checked ~ .ck-switch-track .ck-switch-thumb { transform:translateX(18px); }

.ck-actions { display:flex; gap:.65rem; margin-top:1.25rem; flex-wrap:wrap; }
.ck-btn-all {
  flex:1; min-width:140px; padding:.72rem 1rem; border-radius:999px;
  background:var(--green-dark,#1a3c2e); color:#fff;
  font-family:'Lato',sans-serif; font-size:.88rem; font-weight:800;
  border:none; cursor:pointer; transition:background .2s;
}
.ck-btn-all:hover { background:#2a5c44; }
.ck-btn-sel {
  flex:1; min-width:120px; padding:.72rem 1rem; border-radius:999px;
  background:transparent; color:var(--green-dark,#1a3c2e);
  font-family:'Lato',sans-serif; font-size:.88rem; font-weight:700;
  border:2px solid var(--green-dark,#1a3c2e); cursor:pointer;
  transition:background .2s;
}
.ck-btn-sel:hover { background:#f5f0e8; }
.ck-btn-ess {
  width:100%; padding:.55rem 1rem; border-radius:999px;
  background:transparent; color:var(--text-muted,#888);
  font-family:'Lato',sans-serif; font-size:.78rem; font-weight:600;
  border:1.5px solid #ddd; cursor:pointer; transition:background .2s;
  margin-top:.35rem;
}
.ck-btn-ess:hover { background:#f5f0f0; }
.ck-link { color:var(--green-dark,#1a3c2e); text-decoration:underline; font-size:.72rem; }
.ck-footer { text-align:center; margin-top:.85rem; color:var(--text-muted,#888); font-size:.72rem; }

/* Bouton rouverture (coin bas gauche) */
.ck-reopen {
  position:fixed; bottom:1.25rem; left:1.25rem; z-index:9990;
  background:var(--green-dark,#1a3c2e); color:#fff;
  font-family:'Lato',sans-serif; font-size:.72rem; font-weight:700;
  padding:.45rem .9rem; border-radius:999px; border:none;
  cursor:pointer; opacity:.75; transition:opacity .2s;
  display:flex; align-items:center; gap:.35rem;
}
.ck-reopen:hover { opacity:1; }
`

const CATEGORIES = [
  {
    key:      'essential',
    label:    'Essentiels',
    desc:     'Connexion, panier, session utilisateur. Toujours actifs.',
    required: true,
  },
  {
    key:   'analytics',
    label: 'Analytiques',
    desc:  'Mesure d\'audience anonymisée pour améliorer le service (ex : Google Analytics).',
  },
  {
    key:   'marketing',
    label: 'Marketing',
    desc:  'Personnalisation des offres et suivi des campagnes publicitaires.',
  },
]

export function CookieBanner() {
  const saved = getConsent()
  const [open,  setOpen]  = useState(!saved)
  const [prefs, setPrefs] = useState({
    essential: true,
    analytics: saved?.analytics ?? false,
    marketing: saved?.marketing ?? false,
  })

  function acceptAll() {
    const full = { essential:true, analytics:true, marketing:true }
    saveConsent(full); setPrefs(full); setOpen(false)
  }

  function acceptSelected() {
    saveConsent(prefs); setOpen(false)
  }

  function essentialOnly() {
    const min = { essential:true, analytics:false, marketing:false }
    saveConsent(min); setPrefs(min); setOpen(false)
  }

  function toggle(key) {
    setPrefs(p => ({ ...p, [key]: !p[key] }))
  }

  return (
    <>
      <style>{CSS_COOKIE}</style>

      {/* Bouton pour rouvrir les préférences */}
      {!open && (
        <button className="ck-reopen" onClick={() => setOpen(true)} aria-label="Gérer mes cookies">
          🍪 Cookies
        </button>
      )}

      {open && (
        <div className="ck-overlay" role="dialog" aria-modal="true" aria-label="Préférences cookies">
          <div className="ck-banner">

            <div className="ck-title">🍪 Vos préférences cookies</div>
            <div className="ck-sub">
              Nous utilisons des cookies pour faire fonctionner le site et, avec votre accord,
              mesurer l'audience et personnaliser votre expérience.{' '}
              <a className="ck-link" href="/politique-de-confidentialite" target="_blank" rel="noopener">
                Politique de confidentialité
              </a>
            </div>

            {/* Toggles */}
            {CATEGORIES.map(cat => (
              <div key={cat.key} className="ck-toggle-row">
                <div>
                  <div className="ck-toggle-label">{cat.label}</div>
                  <div className="ck-toggle-desc">{cat.desc}</div>
                </div>
                <label className="ck-switch">
                  <input
                    type="checkbox"
                    checked={prefs[cat.key]}
                    disabled={cat.required}
                    onChange={() => !cat.required && toggle(cat.key)}
                  />
                  <div className="ck-switch-track">
                    <div className="ck-switch-thumb" />
                  </div>
                </label>
              </div>
            ))}

            {/* Actions */}
            <div className="ck-actions">
              <button className="ck-btn-all" onClick={acceptAll}>
                ✓ Tout accepter
              </button>
              <button className="ck-btn-sel" onClick={acceptSelected}>
                Enregistrer ma sélection
              </button>
            </div>
            <button className="ck-btn-ess" onClick={essentialOnly}>
              Essentiels uniquement
            </button>

            <div className="ck-footer">
              Vos choix sont sauvegardés localement et révocables à tout moment.
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default CookieBanner