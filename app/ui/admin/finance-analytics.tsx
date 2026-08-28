'use client'

import { useState } from 'react'
import {
  formatMoney,
  type MonthPoint,
  type Expense,
  type Invoice,
} from '@/app/lib/admin-data'
import {
  CategorySpend,
  NetTrend,
  Receivables,
} from '@/app/ui/admin/analytics-charts'
import { STAT_ICON } from '@/app/ui/admin/stat-card'

const W = 1000
const H = 300
const PAD = { top: 16, right: 8, bottom: 34, left: 62 }
const PLOT_W = W - PAD.left - PAD.right
const PLOT_H = H - PAD.top - PAD.bottom
const GAP = 2 // surface gap between the paired bars
const R = 4 // rounded data-end

const SERIES = [
  { key: 'earnedPence', label: 'Earned', color: 'var(--viz-series-1)' },
  { key: 'spentPence', label: 'Spent', color: 'var(--viz-series-2)' },
] as const

/** Bar with only its top corners rounded — square on the baseline. */
function topRounded(x: number, y: number, w: number, h: number) {
  if (h <= 0) return ''
  const r = Math.min(R, h, w / 2)
  return `M${x},${y + h} L${x},${y + r} Q${x},${y} ${x + r},${y} L${x + w - r},${y} Q${x + w},${y} ${x + w},${y + r} L${x + w},${y + h} Z`
}

/** Pence to '£52k' for axis ticks — full figures live in the tooltip. */
function tick(pence: number) {
  const pounds = pence / 100
  if (pounds >= 1000) return `£${Math.round(pounds / 1000)}k`
  return `£${Math.round(pounds)}`
}

export function FinanceAnalytics({
  initialMonthlyFinance,
  initialInvoices,
  initialExpenses,
  initialPayrollCost,
}: {
  initialMonthlyFinance: MonthPoint[]
  initialInvoices: Invoice[]
  initialExpenses: Expense[]
  initialPayrollCost: number
}) {
  const data = initialMonthlyFinance
  const invoicesData = initialInvoices
  const expensesData = initialExpenses
  const payrollCostVal = initialPayrollCost

  const [active, setActive] = useState<number | null>(null)
  const [showTable, setShowTable] = useState(false)

  const earned = data.reduce((n, d) => n + d.earnedPence, 0)
  const spent = data.reduce((n, d) => n + d.spentPence, 0)
  const net = earned - spent
  const margin = earned ? Math.round((net / earned) * 100) : 0

  // Round the axis up to a whole 10k so every tick is a clean figure.
  const peak = Math.max(0, ...data.flatMap((d) => [d.earnedPence, d.spentPence]))
  const step = 1000000
  const max = Math.max(step, Math.ceil(peak / step) * step)
  const ticks = Array.from({ length: max / step + 1 }, (_, i) => i * step)

  const band = PLOT_W / (data.length || 1)
  const barW = Math.min(34, (band * 0.62 - GAP) / 2)
  const groupW = barW * 2 + GAP

  const x = (i: number) => PAD.left + band * i + (band - groupW) / 2
  const y = (v: number) => PAD.top + PLOT_H - (v / max) * PLOT_H

  const hovered = active === null ? null : data[active]

  // Where the money comes from and goes, for the two breakdown panels.
  const byClient = Object.entries(
    invoicesData
      .filter((i) => i.status !== 'draft')
      .reduce<Record<string, number>>((acc, i) => {
        acc[i.client] = (acc[i.client] ?? 0) + i.amountPence
        return acc
      }, {})
  ).sort((a, b) => b[1] - a[1])

  const expenseTotal = expensesData
    .filter((e) => e.status !== 'rejected')
    .reduce((n, e) => n + e.amountPence, 0)
  const spendSplit: [string, number][] = [
    ['Payroll', payrollCostVal],
    ['Expenses', expenseTotal],
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card label="Revenue" value={formatMoney(earned)} hint="Last 6 months" tone="bg-indigo-100 text-indigo-700" icon={<UpIcon />} />
        <Card label="Spend" value={formatMoney(spent)} hint="Payroll and expenses" tone="bg-amber-100 text-amber-800" icon={<DownIcon />} />
        <Card label="Net" value={formatMoney(net)} hint={net >= 0 ? 'In surplus' : 'In deficit'} tone={net >= 0 ? 'bg-[#0ca30c]/12 text-[#006300]' : 'bg-[#d03b3b]/12 text-[#b02c2c]'} icon={<BalanceIcon />} />
        <Card label="Margin" value={`${margin}%`} hint="Net over revenue" tone="bg-zinc-100 text-zinc-700" icon={<PercentIcon />} />
      </div>

      <section className="viz rounded-xl border border-zinc-200 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-medium text-zinc-900">
              Earnings and spend
            </h2>
            <p className="text-sm text-zinc-500">Monthly, last 6 months</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Legend is always present at 2+ series, so identity is never colour alone. */}
            <ul className="flex items-center gap-3">
              {SERIES.map((s) => (
                <li key={s.key} className="flex items-center gap-1.5 text-xs text-zinc-600">
                  <span aria-hidden="true" className="size-2.5 rounded-full" style={{ background: s.color }} />
                  {s.label}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setShowTable((v) => !v)}
              aria-pressed={showTable}
              className="rounded-md border border-zinc-300 px-2 py-1 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              {showTable ? 'Chart' : 'Table'}
            </button>
          </div>
        </div>

        {showTable ? (
          <ChartTable data={data} />
        ) : (
          <div className="relative mt-4">
            <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Monthly earnings and spend">
              {ticks.map((t) => (
                <g key={t}>
                  <line
                    x1={PAD.left}
                    x2={W - PAD.right}
                    y1={y(t)}
                    y2={y(t)}
                    stroke={t === 0 ? 'var(--viz-axis)' : 'var(--viz-grid)'}
                    strokeWidth={1}
                  />
                  <text x={PAD.left - 10} y={y(t) + 4} textAnchor="end" fontSize={11} fill="var(--viz-muted)" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {tick(t)}
                  </text>
                </g>
              ))}

              {data.map((d, i) => {
                const gx = x(i)
                const dim = active !== null && active !== i
                return (
                  <g key={d.month} opacity={dim ? 0.45 : 1}>
                    <path d={topRounded(gx, y(d.earnedPence), barW, PAD.top + PLOT_H - y(d.earnedPence))} fill="var(--viz-series-1)" />
                    <path d={topRounded(gx + barW + GAP, y(d.spentPence), barW, PAD.top + PLOT_H - y(d.spentPence))} fill="var(--viz-series-2)" />
                    <text x={gx + groupW / 2} y={H - 12} textAnchor="middle" fontSize={11} fill="var(--viz-muted)">
                      {d.label}
                    </text>
                  </g>
                )
              })}

              {/* Hit targets: full-height bands, wider than the marks. */}
              {data.map((d, i) => (
                <rect
                  key={`hit-${d.month}`}
                  x={PAD.left + band * i}
                  y={PAD.top}
                  width={band}
                  height={PLOT_H}
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
                style={{
                  left: `${((PAD.left + band * (active as number) + band / 2) / W) * 100}%`,
                  transform: 'translateX(-50%)',
                }}
              >
                <p className="font-medium text-zinc-900">{hovered.label} 2026</p>
                {SERIES.map((s) => (
                  <p key={s.key} className="mt-1 flex items-center gap-1.5 text-zinc-600">
                    <span aria-hidden="true" className="size-2 rounded-full" style={{ background: s.color }} />
                    {s.label}
                    <span className="ml-auto pl-4 font-medium text-zinc-900" style={{ fontVariantNumeric: 'tabular-nums' }}>
                      {formatMoney(hovered[s.key])}
                    </span>
                  </p>
                ))}
                <p className="mt-1.5 border-t border-zinc-200 pt-1.5 text-zinc-600">
                  Net
                  <span className="ml-auto pl-4 font-medium text-zinc-900" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {formatMoney(hovered.earnedPence - hovered.spentPence)}
                  </span>
                </p>
              </div>
            ) : null}
          </div>
        )}
      </section>

      <NetTrend data={data} />

      <div className="grid gap-6 lg:grid-cols-2">
        <CategorySpend initialExpenses={expensesData} />
        <Receivables initialInvoices={invoicesData} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Breakdown title="Revenue by client" rows={byClient} colour="var(--viz-cat-1)" />
        <Breakdown title="Where spend goes" rows={spendSplit} colour="var(--viz-cat-2)" />
      </div>
    </div>
  )
}

function Breakdown({
  title,
  rows,
  colour,
}: {
  title: string
  rows: [string, number][]
  colour: string
}) {
  const peak = Math.max(...rows.map(([, v]) => v), 1)
  return (
    <section className="viz rounded-xl border border-zinc-200 bg-white p-5">
      <h2 className="text-sm font-medium text-zinc-900">{title}</h2>
      <ul className="mt-4 flex flex-col gap-3">
        {rows.map(([label, value]) => (
          <li key={label} className="flex items-center gap-3">
            <span className="w-36 shrink-0 truncate text-sm text-zinc-600">{label}</span>
            {/* Decorative — the figure beside it carries the value. */}
            <span aria-hidden="true" className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-100">
              <span className="block h-full rounded-full" style={{ width: `${Math.round((value / peak) * 100)}%`, background: colour }} />
            </span>
            <span className="w-28 shrink-0 text-right text-sm font-medium text-zinc-900" style={{ fontVariantNumeric: 'tabular-nums' }}>
              {formatMoney(value)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function ChartTable({ data }: { data: MonthPoint[] }) {
  return (
    <div className="mt-4 overflow-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-200 text-zinc-600">
            <th className="py-2 pr-4 font-medium">Month</th>
            <th className="py-2 pr-4 text-right font-medium">Earned</th>
            <th className="py-2 pr-4 text-right font-medium">Spent</th>
            <th className="py-2 text-right font-medium">Net</th>
          </tr>
        </thead>
        <tbody style={{ fontVariantNumeric: 'tabular-nums' }}>
          {data.map((d) => (
            <tr key={d.month} className="border-b border-zinc-100 last:border-0">
              <td className="py-2 pr-4 text-zinc-700">{d.label} 2026</td>
              <td className="py-2 pr-4 text-right text-zinc-700">{formatMoney(d.earnedPence)}</td>
              <td className="py-2 pr-4 text-right text-zinc-700">{formatMoney(d.spentPence)}</td>
              <td className="py-2 text-right font-medium text-zinc-900">
                {formatMoney(d.earnedPence - d.spentPence)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Card({
  label,
  value,
  hint,
  tone,
  icon,
}: {
  label: string
  value: string
  hint: string
  tone: string
  icon: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-3.5 rounded-xl border border-zinc-200 bg-white p-4">
      <span aria-hidden="true" className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${tone}`}>
        {icon}
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm text-zinc-600">{label}</p>
        <p className="truncate text-xl font-semibold tracking-tight text-zinc-900" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {value}
        </p>
        <p className="truncate text-xs text-zinc-500">{hint}</p>
      </div>
    </div>
  )
}

function UpIcon() {
  return (
    <svg {...STAT_ICON}>
      <path d="M4 16.5 10 10l4 4 6-6.5" />
      <path d="M20 12V7.5h-4.5" />
    </svg>
  )
}

function DownIcon() {
  return (
    <svg {...STAT_ICON}>
      <path d="M4 7.5 10 14l4-4 6 6.5" />
      <path d="M20 12v4.5h-4.5" />
    </svg>
  )
}

function BalanceIcon() {
  return (
    <svg {...STAT_ICON}>
      <path d="M12 4.5v15M6 8h12" />
      <path d="M4 15a3 3 0 0 0 6 0L7 8.5Z" />
      <path d="M14 15a3 3 0 0 0 6 0L17 8.5Z" />
    </svg>
  )
}

function PercentIcon() {
  return (
    <svg {...STAT_ICON}>
      <path d="M6 18 18 6" />
      <circle cx="7.5" cy="7.5" r="2" />
      <circle cx="16.5" cy="16.5" r="2" />
    </svg>
  )
}
