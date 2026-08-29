'use client'

import { useState } from 'react'
import {
  formatMoney,
  type MonthPoint,
  type Expense,
  type Invoice,
} from '@/app/lib/admin-data'

/** Assign in order, never cycled — the ordering is what keeps them separable. */
export const CAT = [
  'var(--viz-cat-1)',
  'var(--viz-cat-2)',
  'var(--viz-cat-3)',
  'var(--viz-cat-4)',
  'var(--viz-cat-5)',
  'var(--viz-cat-6)',
]

const money = (pence: number) => formatMoney(pence)

function tick(pence: number) {
  const pounds = pence / 100
  const abs = Math.abs(pounds)
  const sign = pounds < 0 ? '−' : ''
  if (abs >= 1000) return `${sign}£${Math.round(abs / 1000)}k`
  return `${sign}£${Math.round(abs)}`
}

/* ------------------------------------------------------------------ */
/* Net position — a single series, so no legend: the title names it.   */
/* ------------------------------------------------------------------ */

const NW = 1000
const NH = 260
const NPAD = { top: 16, right: 12, bottom: 32, left: 66 }
const NPW = NW - NPAD.left - NPAD.right
const NPH = NH - NPAD.top - NPAD.bottom

export function NetTrend({ data }: { data: MonthPoint[] }) {
  const [active, setActive] = useState<number | null>(null)
  const nets = data.map((d) => d.earnedPence - d.spentPence)

  const step = 500000
  const hi = Math.ceil(Math.max(...nets, 0) / step) * step
  const lo = Math.min(Math.floor(Math.min(...nets, 0) / step) * step, 0)
  const span = hi - lo || step
  const ticks = Array.from(
    { length: Math.round(span / step) + 1 },
    (_, i) => lo + i * step
  )

  const band = NPW / data.length
  const x = (i: number) => NPAD.left + band * i + band / 2
  const y = (v: number) => NPAD.top + NPH - ((v - lo) / span) * NPH

  const line = nets.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i)},${y(v)}`).join(' ')
  const area = `${line} L${x(nets.length - 1)},${y(0)} L${x(0)},${y(0)} Z`
  const hovered = active === null ? null : { point: data[active], net: nets[active] }

  return (
    <section className="viz rounded-xl border border-zinc-200 bg-white p-5">
      <h2 className="text-sm font-medium text-zinc-900">Net position</h2>
      <p className="text-sm text-zinc-500">Earnings less spend, by month</p>

      <div className="relative mt-4">
        <svg viewBox={`0 0 ${NW} ${NH}`} className="h-auto w-full" role="img" aria-label="Net position by month">
          {ticks.map((t) => (
            <g key={t}>
              <line
                x1={NPAD.left}
                x2={NW - NPAD.right}
                y1={y(t)}
                y2={y(t)}
                stroke={t === 0 ? 'var(--viz-axis)' : 'var(--viz-grid)'}
                strokeWidth={t === 0 ? 1.5 : 1}
              />
              <text x={NPAD.left - 10} y={y(t) + 4} textAnchor="end" fontSize={11} fill="var(--viz-muted)" style={{ fontVariantNumeric: 'tabular-nums' }}>
                {tick(t)}
              </text>
            </g>
          ))}

          <path d={area} fill="var(--viz-cat-1)" opacity={0.12} />
          <path d={line} fill="none" stroke="var(--viz-cat-1)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

          {nets.map((v, i) => (
            <circle
              key={data[i].month}
              cx={x(i)}
              cy={y(v)}
              r={active === i ? 6 : 4.5}
              fill="var(--viz-cat-1)"
              stroke="#ffffff"
              strokeWidth={2}
            />
          ))}

          {data.map((d, i) => (
            <text key={`l-${d.month}`} x={x(i)} y={NH - 10} textAnchor="middle" fontSize={11} fill="var(--viz-muted)">
              {d.label}
            </text>
          ))}

          {data.map((d, i) => (
            <rect
              key={`hit-${d.month}`}
              x={NPAD.left + band * i}
              y={NPAD.top}
              width={band}
              height={NPH}
              fill="transparent"
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
            />
          ))}
        </svg>

        {hovered ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs shadow-sm"
            style={{ left: `${(x(active as number) / NW) * 100}%`, transform: 'translateX(-50%)' }}
          >
            <p className="font-medium text-zinc-900">{hovered.point.label} 2026</p>
            <p className="mt-1 text-zinc-600" style={{ fontVariantNumeric: 'tabular-nums' }}>
              Net {money(hovered.net)}
            </p>
          </div>
        ) : null}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Expenses by category — categorical, one hue per slot, in order.     */
/* ------------------------------------------------------------------ */

const LABELS: Record<string, string> = {
  travel: 'Travel',
  materials: 'Materials',
  equipment: 'Equipment',
  meals: 'Meals',
  training: 'Training',
  other: 'Other',
}

export function CategorySpend({ initialExpenses }: { initialExpenses: Expense[] }) {
  const expensesData = initialExpenses
  const totals = Object.entries(
    expensesData
      .filter((e) => e.status !== 'rejected')
      .reduce<Record<string, number>>((acc, e) => {
        acc[e.category] = (acc[e.category] ?? 0) + e.amountPence
        return acc
      }, {})
  ).sort((a, b) => b[1] - a[1])

  const total = totals.reduce((n, [, v]) => n + v, 0) || 1

  return (
    <section className="viz rounded-xl border border-zinc-200 bg-white p-5">
      <h2 className="text-sm font-medium text-zinc-900">Expenses by category</h2>
      <p className="text-sm text-zinc-500">{money(total)} across {totals.length} categories</p>

      {/* One stacked bar: the split reads at a glance, and every segment is
          named in the legend below with its own figure. */}
      <div className="mt-4 flex h-3 w-full gap-0.5 overflow-hidden rounded-full" role="img" aria-label="Share of expenses by category">
        {totals.map(([key, value], i) => (
          <span
            key={key}
            className="h-full first:rounded-l-full last:rounded-r-full"
            style={{ width: `${(value / total) * 100}%`, background: CAT[i] }}
          />
        ))}
      </div>

      <ul className="mt-4 flex flex-col gap-2.5">
        {totals.map(([key, value], i) => (
          <li key={key} className="flex items-center gap-2.5 text-sm">
            <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full" style={{ background: CAT[i] }} />
            <span className="flex-1 truncate text-zinc-600">{LABELS[key] ?? key}</span>
            <span className="w-14 shrink-0 text-right text-xs text-zinc-500" style={{ fontVariantNumeric: 'tabular-nums' }}>
              {Math.round((value / total) * 100)}%
            </span>
            <span className="w-24 shrink-0 text-right font-medium text-zinc-900" style={{ fontVariantNumeric: 'tabular-nums' }}>
              {money(value)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Receivables — status colours are reserved and always carry a label. */
/* ------------------------------------------------------------------ */

const RECEIVABLE = [
  { key: 'paid', label: 'Paid', colour: '#0ca30c' },
  { key: 'pending', label: 'Awaiting payment', colour: '#fab219' },
  { key: 'overdue', label: 'Overdue', colour: '#d03b3b' },
] as const

export function Receivables({ initialInvoices }: { initialInvoices: Invoice[] }) {
  const invoicesData = initialInvoices
  const rows = RECEIVABLE.map((r) => {
    const matching = invoicesData.filter((i) => i.status === r.key)
    return {
      ...r,
      count: matching.length,
      total: matching.reduce((n, i) => n + i.amountPence, 0),
    }
  })
  const peak = Math.max(...rows.map((r) => r.total), 1)
  const outstanding = rows
    .filter((r) => r.key !== 'paid')
    .reduce((n, r) => n + r.total, 0)

  return (
    <section className="viz rounded-xl border border-zinc-200 bg-white p-5">
      <h2 className="text-sm font-medium text-zinc-900">Receivables</h2>
      <p className="text-sm text-zinc-500">
        {money(outstanding)} still to collect
      </p>

      <ul className="mt-4 flex flex-col gap-3.5">
        {rows.map((r) => (
          <li key={r.key}>
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="flex items-center gap-1.5 text-zinc-600">
                {/* Status colour never carries the meaning alone. */}
                <span aria-hidden="true" className="size-2 shrink-0 rounded-full" style={{ background: r.colour }} />
                {r.label}
                <span className="text-xs text-zinc-400">
                  {r.count} invoice{r.count === 1 ? '' : 's'}
                </span>
              </span>
              <span className="font-medium text-zinc-900" style={{ fontVariantNumeric: 'tabular-nums' }}>
                {money(r.total)}
              </span>
            </div>
            <span aria-hidden="true" className="mt-1.5 block h-2 w-full overflow-hidden rounded-full bg-zinc-100">
              <span className="block h-full rounded-full" style={{ width: `${(r.total / peak) * 100}%`, background: r.colour }} />
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
