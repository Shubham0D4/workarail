import type { Stat } from '@/app/lib/admin-data'

/** A hero number needs no plot — the value is the whole story. */
export function StatTile({ stat }: { stat: Stat }) {
  const flat = stat.trend === 'flat'
  const deltaTone = flat
    ? 'text-zinc-500'
    : stat.positive
      ? 'text-[#006300]'
      : 'text-[#b02c2c]'

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5">
      <p className="text-sm text-zinc-600">{stat.label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
        {stat.value}
      </p>
      <p className="mt-2 flex items-center gap-1.5 text-sm">
        {/* Direction is carried by the arrow glyph and the text, not by colour. */}
        <span className={`font-medium ${deltaTone}`}>
          <span aria-hidden="true">
            {flat ? '→' : stat.trend === 'up' ? '↑' : '↓'}
          </span>{' '}
          {stat.delta}
        </span>
        <span className="text-zinc-500">{stat.hint}</span>
      </p>
    </div>
  )
}
