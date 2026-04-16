export default function LoadingSpinner({ full = false }) {
  if (full) return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--cream)'}}>
      <div className="spinner" />
    </div>
  )
  return <div className="spinner" />
}
