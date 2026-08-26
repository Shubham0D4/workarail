import type { ReactNode } from 'react'

/** Icon tile + label + count. Shared by the timesheets and leaves pages. */
export function StatCard({
  label,
  value,
  icon,
  tone,
}: {
  label: string
  value: number
  icon: ReactNode
  /** Tint classes for the icon square, e.g. the code's own colour. */
  tone: string
}) {
  return (
    <div className="flex items-center gap-3.5 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <span
        aria-hidden="true"
        className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${tone}`}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm text-zinc-600 dark:text-zinc-400">
          {label}
        </p>
        <p
          className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {String(value).padStart(2, '0')}
        </p>
      </div>
    </div>
  )
}

/** Shared attrs so every tile icon is drawn identically. */
export const STAT_ICON = {
  'aria-hidden': 'true',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.9,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  className: 'size-5',
} as const
