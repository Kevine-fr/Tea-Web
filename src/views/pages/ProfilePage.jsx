import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Layout    from '../components/Layout.jsx'
import PageBanner from '../components/PageBanner.jsx'
import client    from '../../api/client.js'
import toast     from 'react-hot-toast'

/* ─── Styles ─────────────────────────────────────────────── */
const STYLES = `
  @keyframes fadeUp   { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:none} }
  @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes scaleIn  { from{opacity:0;transform:scale(.93)} to{opacity:1;transform:scale(1)} }
  @keyframes slideRight { from{opacity:0;transform:translateX(-22px)} to{opacity:1;transform:none} }
  @keyframes avatarPop {
    0%  {transform:scale(0.7) rotate(-8deg);opacity:0}
    60% {transform:scale(1.08) rotate(2deg);opacity:1}
    100%{transform:scale(1) rotate(0deg);opacity:1}
  }
  @keyframes lineGrow { from{width:0} to{width:56px} }
  @keyframes pulse    { 0%,100%{box-shadow:0 0 0 0 rgba(200,100,40,.4)} 70%{box-shadow:0 0 0 9px rgba(200,100,40,0)} }
  @keyframes shake    { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-5px)} 40%{transform:translateX(5px)} 60%{transform:translateX(-3px)} 80%{transform:translateX(3px)} }
  @keyframes dangerPulse { 0%,100%{box-shadow:0 0 0 0 rgba(220,38,38,.35)} 70%{box-shadow:0 0 0 8px rgba(220,38,38,0)} }

  /* Layout */
  .prof-wrap   { position:relative; background:var(--cream); padding:2.5rem 1.5rem 5rem; overflow:hidden; }
  .prof-deco   { position:absolute; border-radius:50%; pointer-events:none; }
  .prof-inner  { position:relative; z-index:1; max-width:780px; margin:0 auto; }

  /* Avatar */
  .prof-avatar {
    width:92px; height:92px; border-radius:50%;
    background:linear-gradient(135deg,var(--green-dark,#1a3c2e),#3a7c5e);
    display:flex; align-items:center; justify-content:center;
    font-size:2.1rem; font-weight:800; color:#fff;
    margin:0 auto 1.1rem;
    animation:avatarPop .6s cubic-bezier(.34,1.56,.64,1) both;
    box-shadow:0 8px 28px rgba(26,60,46,.22);
    border:3px solid #fff;
  }

  /* Titre */
  .prof-title  { animation:fadeUp .5s ease .1s both; text-align:center; margin-bottom:0; }
  .prof-under  { display:block; height:2px; width:0; background:var(--orange,#c8723a); border-radius:4px; margin:.45rem auto 2.2rem; animation:lineGrow .55s ease .25s forwards; }
  .prof-role   { text-align:center; font-size:.82rem; color:var(--text-muted,#888); margin-bottom:2rem; letter-spacing:.04em; animation:fadeIn .5s ease .3s both; }

  /* Cards */
  .prof-card   { border-radius:20px; padding:2rem 2.25rem; background:#fff; box-shadow:0 2px 18px rgba(0,0,0,.06); margin-bottom:1.5rem; }
  .prof-card-1 { animation:slideRight .5s ease .15s both; }
  .prof-card-2 { animation:slideRight .5s ease .25s both; }
  .prof-card-3 { animation:slideRight .5s ease .35s both; border:1.5px solid rgba(220,38,38,.18); }

  /* Section titles */
  .prof-sec-title {
    font-family:'Playfair Display',Georgia,serif; font-size:1.05rem; font-weight:700;
    color:var(--green-dark,#1a3c2e); margin:0 0 1.25rem;
    display:flex; align-items:center; gap:.55rem;
  }
  .prof-sec-title.danger { color:#b91c1c; }

  /* Form grid */
  .prof-grid   { display:grid; grid-template-columns:1fr 1fr; gap:1rem 1.25rem; }
  @media(max-width:540px){ .prof-grid{ grid-template-columns:1fr; } }

  /* Field */
  .prof-field  { display:flex; flex-direction:column; gap:.35rem; }
  .prof-field label { font-size:.78rem; font-weight:700; color:var(--green-dark,#1a3c2e); letter-spacing:.03em; }
  .prof-input  {
    padding:.65rem 1rem; border-radius:10px;
    border:1.5px solid var(--cream-border,#e8e0d5);
    font-size:.9rem; font-family:'Lato',sans-serif;
    transition:border-color .22s ease, box-shadow .22s ease, background .2s ease;
    background:#fafaf8; color:var(--text,#2a2a2a);
    width:100%; box-sizing:border-box;
  }
  .prof-input:focus {
    outline:none;
    border-color:var(--green-mid,#6a8f5a);
    box-shadow:0 0 0 3px rgba(106,143,90,.14);
    background:#fafffe;
  }
  .prof-input.error { border-color:#dc2626; box-shadow:0 0 0 3px rgba(220,38,38,.12); }
  .prof-input:disabled { opacity:.6; cursor:not-allowed; }

  /* Password toggle wrapper */
  .prof-pw-wrap { position:relative; }
  .prof-pw-wrap .prof-input { padding-right:2.6rem; }
  .prof-pw-eye  {
    position:absolute; right:.8rem; top:50%; transform:translateY(-50%);
    background:none; border:none; cursor:pointer; padding:0; color:var(--text-muted,#888);
    font-size:1rem; transition:color .2s;
  }
  .prof-pw-eye:hover { color:var(--green-dark,#1a3c2e); }

  /* Hint / error inline */
  .prof-hint   { font-size:.72rem; color:var(--text-muted,#888); margin:0; }
  .prof-err    { font-size:.72rem; color:#dc2626; margin:0; }

  /* Save button */
  .prof-btn-save {
    margin-top:1.25rem; padding:.7rem 2.2rem;
    background:var(--green-dark,#1a3c2e); color:#fff;
    border:none; border-radius:var(--radius-pill,999px);
    font-size:.9rem; font-weight:700; cursor:pointer;
    transition:transform .2s, box-shadow .2s, opacity .2s;
  }
  .prof-btn-save:hover:not(:disabled) {
    transform:translateY(-2px);
    box-shadow:0 8px 22px rgba(26,60,46,.25);
    animation:pulse 1.6s ease-out infinite;
  }
  .prof-btn-save:disabled { opacity:.55; cursor:not-allowed; }

  /* Delete zone */
  .prof-delete-desc { font-size:.88rem; color:var(--text-muted,#888); margin:0 0 1.1rem; line-height:1.65; }
  .prof-btn-delete  {
    padding:.65rem 1.8rem; background:#dc2626; color:#fff;
    border:none; border-radius:var(--radius-pill,999px);
    font-size:.88rem; font-weight:700; cursor:pointer;
    transition:transform .2s, box-shadow .2s, opacity .2s;
  }
  .prof-btn-delete:hover:not(:disabled) {
    transform:translateY(-2px);
    box-shadow:0 8px 22px rgba(220,38,38,.3);
    animation:dangerPulse 1.6s ease-out infinite;
  }
  .prof-btn-delete:disabled { opacity:.55; cursor:not-allowed; }

  /* Confirm delete overlay */
  .prof-overlay {
    position:fixed; inset:0; z-index:1000;
    background:rgba(0,0,0,.5);
    display:flex; align-items:center; justify-content:center;
    animation:fadeIn .2s ease both;
    backdrop-filter:blur(3px);
  }
  .prof-modal {
    background:#fff; border-radius:20px;
    padding:2.25rem 2.5rem; max-width:430px; width:92%;
    box-shadow:0 24px 64px rgba(0,0,0,.22);
    animation:scaleIn .25s cubic-bezier(.34,1.56,.64,1) both;
  }
  .prof-modal-icon { font-size:2.4rem; text-align:center; margin-bottom:.75rem; display:block; }
  .prof-modal h3   { font-family:'Playfair Display',Georgia,serif; font-size:1.2rem; color:#b91c1c; margin:0 0 .6rem; text-align:center; }
  .prof-modal p    { font-size:.88rem; color:var(--text-muted,#888); margin:0 0 1.25rem; text-align:center; line-height:1.65; }
  .prof-modal-btns { display:flex; gap:.65rem; justify-content:center; }

  /* Success flash */
  .prof-success-banner {
    background:linear-gradient(90deg,#dcfce7,#f0fdf4);
    border:1.5px solid #86efac; border-radius:12px;
    padding:.8rem 1.2rem; margin-bottom:1.25rem;
    display:flex; align-items:center; gap:.6rem;
    font-size:.88rem; font-weight:600; color:#15803d;
    animation:fadeUp .35s ease both;
  }

  .shake { animation:shake .4s ease both; }
`

/* ─── Helpers ────────────────────────────────────────────── */
const ROLE_LABEL = { admin: '👑 Administrateur', employee: '🧑‍💼 Employé', user: '🌿 Participant' }

function initials(u) {
  if (!u) return '?'
  return ((u.first_name?.[0] ?? '') + (u.last_name?.[0] ?? '')).toUpperCase() || '?'
}

function Eye({ show, onClick }) {
  return (
    <button type="button" className="prof-pw-eye" onClick={onClick} tabIndex={-1} aria-label="Afficher/masquer">
      {show ? '🙈' : '👁️'}
    </button>
  )
}

function Field({ label, name, type = 'text', value, onChange, error, hint, disabled, full, placeholder }) {
  const [show, setShow] = useState(false)
  const isPw = type === 'password'
  return (
    <div className="prof-field" style={full ? { gridColumn: '1 / -1' } : {}}>
      <label htmlFor={name}>{label}</label>
      <div className={isPw ? 'prof-pw-wrap' : ''}>
        <input
          id={name} name={name}
          type={isPw && show ? 'text' : type}
          value={value} onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={`prof-input${error ? ' error' : ''}`}
          autoComplete={isPw ? 'new-password' : undefined}
        />
        {isPw && <Eye show={show} onClick={() => setShow(s => !s)} />}
      </div>
      {error && <p className="prof-err">{error}</p>}
      {!error && hint && <p className="prof-hint">{hint}</p>}
    </div>
  )
}

/* ─── Page ───────────────────────────────────────────────── */
export default function ProfilePage() {
  const { user, setUser, logout } = useAuth()
  const navigate = useNavigate()

  // ── Inject styles ──
  useEffect(() => {
    const id = '__prof-styles__'
    if (!document.getElementById(id)) {
      const el = document.createElement('style')
      el.id = id; el.textContent = STYLES
      document.head.appendChild(el)
    }
  }, [])

  // ── Form state : infos ──
  const [info, setInfo]         = useState({ first_name: '', last_name: '', email: '', birth_date: '' })
  const [infoErr, setInfoErr]   = useState({})
  const [infoSaving, setInfoSaving] = useState(false)
  const [infoFlash, setInfoFlash]   = useState(false)

  // ── Form state : mot de passe ──
  const [pw, setPw]     = useState({ current_password: '', password: '', confirm: '' })
  const [pwErr, setPwErr] = useState({})
  const [pwSaving, setPwSaving] = useState(false)
  const [pwFlash, setPwFlash]   = useState(false)
  const pwCardRef = useRef(null)

  // ── Delete modal ──
  const [showDelete, setShowDelete]   = useState(false)
  const [deletePw, setDeletePw]       = useState('')
  const [deleteErr, setDeleteErr]     = useState('')
  const [deleting, setDeleting]       = useState(false)
  const [showDeletePw, setShowDeletePw] = useState(false)
  const modalRef = useRef(null)

  // Pré-remplir avec les données du contexte
  useEffect(() => {
    if (!user) return
    setInfo({
      first_name: user.first_name ?? '',
      last_name:  user.last_name  ?? '',
      email:      user.email      ?? '',
      birth_date: user.birth_date ? user.birth_date.slice(0, 10) : '',
    })
  }, [user])

  function onInfoChange(e) {
    setInfo(s => ({ ...s, [e.target.name]: e.target.value }))
    setInfoErr(s => ({ ...s, [e.target.name]: undefined }))
  }
  function onPwChange(e) {
    setPw(s => ({ ...s, [e.target.name]: e.target.value }))
    setPwErr(s => ({ ...s, [e.target.name]: undefined }))
  }

  // ── Sauvegarder infos ──
  async function handleSaveInfo(e) {
    e.preventDefault()
    const errs = {}
    if (!info.first_name.trim()) errs.first_name = 'Requis.'
    if (!info.last_name.trim())  errs.last_name  = 'Requis.'
    if (!info.email.trim())      errs.email      = 'Requis.'
    if (Object.keys(errs).length) { setInfoErr(errs); return }

    setInfoSaving(true)
    try {
      const res = await client.put('profile', {
        first_name: info.first_name,
        last_name:  info.last_name,
        email:      info.email,
        birth_date: info.birth_date || null,
      })
      setUser?.(res.data.data) // mettre à jour le contexte
      setInfoFlash(true)
      setTimeout(() => setInfoFlash(false), 3500)
      toast.success('Profil mis à jour !')
    } catch (err) {
      const apiErr = err.response?.data?.errors ?? {}
      setInfoErr(apiErr)
      if (!Object.keys(apiErr).length)
        toast.error(err.response?.data?.message || 'Erreur.')
    } finally { setInfoSaving(false) }
  }

  // ── Changer mot de passe ──
  async function handleSavePw(e) {
    e.preventDefault()
    const errs = {}
    if (!pw.current_password)          errs.current_password = 'Requis.'
    if (!pw.password)                  errs.password         = 'Requis.'
    else if (pw.password.length < 8)   errs.password         = 'Minimum 8 caractères.'
    if (pw.password !== pw.confirm)    errs.confirm          = 'Les mots de passe ne correspondent pas.'
    if (Object.keys(errs).length) { setPwErr(errs); return }

    setPwSaving(true)
    try {
      await client.put('profile', {
        current_password: pw.current_password,
        password:         pw.password,
      })
      setPw({ current_password: '', password: '', confirm: '' })
      setPwFlash(true)
      setTimeout(() => setPwFlash(false), 3500)
      toast.success('Mot de passe mis à jour !')
    } catch (err) {
      const apiErr = err.response?.data?.errors ?? {}
      setPwErr(apiErr)
      if (!Object.keys(apiErr).length)
        toast.error(err.response?.data?.message || 'Erreur.')
      // Shake la card
      pwCardRef.current?.classList.add('shake')
      setTimeout(() => pwCardRef.current?.classList.remove('shake'), 500)
    } finally { setPwSaving(false) }
  }

  // ── Supprimer le compte ──
  async function handleDelete() {
    if (!deletePw.trim()) { setDeleteErr('Veuillez saisir votre mot de passe.'); return }
    setDeleting(true)
    try {
      await client.delete('profile', { data: { password: deletePw } })
      toast.success('Compte supprimé. À bientôt ! 🍵')
      logout?.()
      navigate('/')
    } catch (err) {
      setDeleteErr(err.response?.data?.errors?.password?.[0] ?? err.response?.data?.message ?? 'Mot de passe incorrect.')
    } finally { setDeleting(false) }
  }

  // Fermer modale avec Échap
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') setShowDelete(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const roleName = user?.role?.name ?? 'user'

  return (
    <Layout>
      <PageBanner title="Mon profil" />

      <div className="prof-wrap">

        {/* ── Décorations ── */}
        <div className="prof-deco" style={{ width:380,height:380,top:-110,right:-90,background:'radial-gradient(circle,rgba(106,143,90,.07) 0%,transparent 70%)' }} />
        <div className="prof-deco" style={{ width:260,height:260,bottom:-80,left:-70,background:'radial-gradient(circle,rgba(200,100,40,.06) 0%,transparent 70%)' }} />

        <div className="prof-inner">

          {/* ── Avatar + nom ── */}
          <div className="prof-avatar">{initials(user)}</div>
          <h2 className="prof-title">{user?.first_name} {user?.last_name}</h2>
          <span className="prof-under" />
          <p className="prof-role">{ROLE_LABEL[roleName] ?? roleName}</p>

          {/* ──────────────────────────────────────────
              Card 1 : Informations personnelles
          ────────────────────────────────────────── */}
          <div className="prof-card prof-card-1">
            <h3 className="prof-sec-title">
              <span>🧑‍🌿</span> Informations personnelles
            </h3>

            {infoFlash && (
              <div className="prof-success-banner">
                <span>✅</span> Vos informations ont été mises à jour avec succès.
              </div>
            )}

            <form onSubmit={handleSaveInfo} noValidate>
              <div className="prof-grid">
                <Field label="Prénom"        name="first_name" value={info.first_name} onChange={onInfoChange} error={infoErr.first_name} disabled={infoSaving} />
                <Field label="Nom"           name="last_name"  value={info.last_name}  onChange={onInfoChange} error={infoErr.last_name}  disabled={infoSaving} />
                <Field label="Adresse e-mail" name="email"     type="email" value={info.email} onChange={onInfoChange} error={infoErr.email} disabled={infoSaving} full />
                <Field label="Date de naissance" name="birth_date" type="date" value={info.birth_date} onChange={onInfoChange} error={infoErr.birth_date} disabled={infoSaving} hint="Facultatif" />
              </div>
              <div style={{ display:'flex', justifyContent:'flex-end' }}>
                <button type="submit" className="prof-btn-save" disabled={infoSaving}>
                  {infoSaving ? '⏳ Sauvegarde…' : '💾 Sauvegarder'}
                </button>
              </div>
            </form>
          </div>

          {/* ──────────────────────────────────────────
              Card 2 : Changer le mot de passe
          ────────────────────────────────────────── */}
          <div className="prof-card prof-card-2" ref={pwCardRef}>
            <h3 className="prof-sec-title">
              <span>🔐</span> Changer le mot de passe
            </h3>

            {pwFlash && (
              <div className="prof-success-banner">
                <span>✅</span> Mot de passe mis à jour avec succès.
              </div>
            )}

            <form onSubmit={handleSavePw} noValidate>
              <div className="prof-grid">
                <Field
                  label="Mot de passe actuel" name="current_password" type="password"
                  value={pw.current_password} onChange={onPwChange}
                  error={pwErr.current_password} disabled={pwSaving} full
                />
                <Field
                  label="Nouveau mot de passe" name="password" type="password"
                  value={pw.password} onChange={onPwChange}
                  error={pwErr.password} hint="8 caractères minimum" disabled={pwSaving}
                />
                <Field
                  label="Confirmer le nouveau mot de passe" name="confirm" type="password"
                  value={pw.confirm} onChange={onPwChange}
                  error={pwErr.confirm} disabled={pwSaving}
                />
              </div>
              <div style={{ display:'flex', justifyContent:'flex-end' }}>
                <button type="submit" className="prof-btn-save" disabled={pwSaving}>
                  {pwSaving ? '⏳ Mise à jour…' : '🔑 Mettre à jour'}
                </button>
              </div>
            </form>
          </div>

          {/* ──────────────────────────────────────────
              Card 3 : Zone danger
          ────────────────────────────────────────── */}
          <div className="prof-card prof-card-3">
            <h3 className="prof-sec-title danger">
              <span>⚠️</span> Zone de danger
            </h3>
            <p className="prof-delete-desc">
              La suppression de votre compte est <strong>irréversible</strong>. Toutes vos données
              (participations, gains, réclamations) seront définitivement effacées.
              Vous recevrez un e-mail de confirmation.
            </p>
            <button
              className="prof-btn-delete"
              onClick={() => { setShowDelete(true); setDeletePw(''); setDeleteErr('') }}
            >
              🗑️ Supprimer mon compte
            </button>
          </div>

        </div>
      </div>

      {/* ── Modal confirmation suppression ── */}
      {showDelete && (
        <div
          className="prof-overlay"
          onClick={e => { if (e.target === e.currentTarget) setShowDelete(false) }}
        >
          <div className="prof-modal" ref={modalRef}>
            <span className="prof-modal-icon">🗑️</span>
            <h3>Supprimer mon compte ?</h3>
            <p>
              Cette action est <strong>irréversible</strong>. Saisissez votre mot de passe
              pour confirmer la suppression définitive de votre compte.
            </p>

            <div className="prof-field" style={{ marginBottom:'1.1rem' }}>
              <label htmlFor="del-pw" style={{ fontSize:'.78rem', fontWeight:700, color:'#b91c1c' }}>
                Mot de passe
              </label>
              <div className="prof-pw-wrap">
                <input
                  id="del-pw"
                  type={showDeletePw ? 'text' : 'password'}
                  value={deletePw}
                  onChange={e => { setDeletePw(e.target.value); setDeleteErr('') }}
                  className={`prof-input${deleteErr ? ' error' : ''}`}
                  placeholder="Votre mot de passe actuel"
                  disabled={deleting}
                  autoFocus
                />
                <Eye show={showDeletePw} onClick={() => setShowDeletePw(s => !s)} />
              </div>
              {deleteErr && <p className="prof-err">{deleteErr}</p>}
            </div>

            <div className="prof-modal-btns">
              <button
                className="prof-btn-save"
                style={{ background:'var(--green-dark,#1a3c2e)', marginTop:0 }}
                onClick={() => setShowDelete(false)}
                disabled={deleting}
              >
                Annuler
              </button>
              <button
                className="prof-btn-delete"
                onClick={handleDelete}
                disabled={deleting || !deletePw.trim()}
              >
                {deleting ? '⏳ Suppression…' : '🗑️ Confirmer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}