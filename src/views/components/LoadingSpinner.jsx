export default function LoadingSpinner({ fullPage = false, size = 40 }) {
  const spinner = (
    <div
      style={{
        width: size,
        height: size,
        border: '3px solid #f0e6cc',
        borderTopColor: '#2d6a4f',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }}
    />
  )

  if (fullPage) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--cream)',
      }}>
        {spinner}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem' }}>
      {spinner}
    </div>
  )
}
