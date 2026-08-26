/** Brand mark: the rail motif from the sign-in cover. */
export function LogoMark({ className = 'size-10' }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 40 40" className={className}>
      <rect width="40" height="40" rx="10" fill="currentColor" />
      <g
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.95"
      >
        <path d="M14 10v20M26 10v20" />
        <path d="M11 16h18M11 24h18" />
      </g>
    </svg>
  )
}
