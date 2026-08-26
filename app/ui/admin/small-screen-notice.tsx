/**
 * Shown instead of the admin shell below `lg`. Pure CSS visibility rather than
 * a JS viewport check — no hydration mismatch, and no flash of the wrong UI
 * before hydration settles.
 */
export function SmallScreenNotice() {
  return (
    <div className="flex h-dvh flex-col items-center justify-center overflow-hidden bg-indigo-950 px-6 text-center lg:hidden">
      <div className="animate-auth-up flex w-full max-w-sm flex-col items-center gap-8">
        <DeviceArt />

        <div className="flex flex-col gap-2.5">
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Mind the gap
          </h1>
          <p className="text-sm leading-relaxed text-indigo-200">
            The office needs a wider screen. Open it on a laptop or desktop.
          </p>
        </div>
      </div>
    </div>
  )
}

/** Phone to monitor, with the gap between them doing the talking. */
function DeviceArt() {
  return (
    <svg
      viewBox="0 0 220 96"
      role="img"
      aria-label="A phone beside a larger desktop monitor"
      className="w-full max-w-[220px]"
      fill="none"
    >
      {/* phone */}
      <g stroke="#a5b4fc" strokeWidth="2.5" strokeLinejoin="round">
        <rect x="14" y="30" width="34" height="56" rx="6" />
        <path d="M26 38h10" strokeLinecap="round" strokeOpacity="0.7" />
      </g>

      {/* the gap */}
      <g stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round">
        <path d="M62 58h30" strokeDasharray="2 7" />
        <path d="M86 51.5 93.5 58 86 64.5" />
      </g>

      {/* monitor */}
      <g stroke="#ffffff" strokeWidth="2.5" strokeLinejoin="round">
        <rect x="108" y="14" width="98" height="62" rx="7" />
        <path d="M141 86h32" strokeLinecap="round" />
        <path d="M157 76v10" strokeLinecap="round" />
      </g>
      <path
        d="M108 62h98"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeOpacity="0.35"
      />
      {/* rails on the screen, the brand mark faintly */}
      <g stroke="#a5b4fc" strokeWidth="2" strokeLinecap="round" opacity="0.75">
        <path d="M139 26v28M175 26v28" />
        <path d="M129 36h56M129 46h56" />
      </g>
    </svg>
  )
}
