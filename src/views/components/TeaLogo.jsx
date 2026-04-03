export default function TeaLogo({ size = 50, className = '' }) {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      className={className}
    >
      {/* Feuille de thé */}
      <path
        d="M40 8 C52 15, 58 28, 48 44 C40 54, 28 54, 22 44 C14 30, 22 15, 40 8Z"
        fill="#d4b44a"
        opacity="0.85"
      />
      <path
        d="M40 8 C40 28, 38 42, 37 56"
        stroke="#b8962e"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Nervures */}
      <path d="M40 22 C46 26, 50 32, 48 38" stroke="#b8962e" strokeWidth="0.8" fill="none" opacity="0.6" />
      <path d="M40 22 C34 26, 30 32, 32 38" stroke="#b8962e" strokeWidth="0.8" fill="none" opacity="0.6" />
      {/* Soucoupe */}
      <ellipse cx="38" cy="58" rx="14" ry="4" fill="none" stroke="#d4b44a" strokeWidth="1.5" />
      <path d="M24 58 Q24 66 38 66 Q52 66 52 58" fill="#d4b44a" opacity="0.2" />
    </svg>
  )
}
