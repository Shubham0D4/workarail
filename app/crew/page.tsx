import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ANNUAL_LEAVE_DAYS,
  attendanceFor,
  attendanceHours,
  attendanceWeek,
  currentStaff,
  expensesFor,
  formatMoney,
  leaveFor,
  leaveTakenBy,
  payPeriod,
  payrollFor,
  staff,
  today,
  type AttendanceCode,
} from '@/app/lib/admin-data'
import { STAT_ICON, StatCard } from '@/app/ui/admin/stat-card'
import { StatusPill } from '@/app/ui/crew/status-pill'

export const metadata: Metadata = {
  title: 'My dashboard',
  description: 'Your hours, leave and pay at Work à Rail.',
}

const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const DOW = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const CODE: Record<AttendanceCode, { label: string; cell: string; dot: string }> = {
  P: { label: 'Present', cell: 'bg-[#0ca30c]/12 text-[#006300]', dot: '#0ca30c' },
  H: { label: 'Half day', cell: 'bg-amber-100 text-amber-800', dot: '#fab219' },
  L: { label: 'Leave', cell: 'bg-zinc-200 text-zinc-700', dot: '#898781' },
  A: { label: 'Absent', cell: 'bg-[#d03b3b]/12 text-[#b02c2c]', dot: '#d03b3b' },
  '-': { label: 'Non-working', cell: 'bg-zinc-50 text-zinc-300', dot: '#d4d4d8' },
}

function shortDate(iso: string) {
  const [, m, d] = iso.split('-')
  return `${Number(d)} ${MON[Number(m) - 1]}`
}

export default function CrewDashboardPage() {
  const me = currentStaff()
  const codes = attendanceFor(me.ref)
  const todayIndex = attendanceWeek.indexOf(today)
  const todayCode = codes[todayIndex]

  const hours = codes.reduce((n, c) => n + attendanceHours[c], 0)
  const taken = leaveTakenBy(me.ref)
  const remaining = ANNUAL_LEAVE_DAYS - taken

  const myLeave = leaveFor(me.ref)
  const myExpenses = expensesFor(me.ref)
  const openClaims = myExpenses.filter(
    (e) => e.status === 'submitted' || e.status === 'approved'
  )
  const pay = payrollFor(me.ref)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
            Hello, {me.name.split(' ')[0]}
          </h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-zinc-600">
            <span
              aria-hidden="true"
              className="size-2 shrink-0 rounded-full"
              style={{ background: CODE[todayCode].dot }}
            />
            {CODE[todayCode].label} today · {shortDate(today)}
          </p>
        </div>
      </div>

      <nav aria-label="Quick actions" className="flex flex-wrap gap-2">
        <Action href="/crew/leave" label="Request leave" icon={<CalendarIcon />} primary />
        <Action href="/crew/timesheet" label="Submit timesheet" icon={<ClockIcon />} />
        <Action href="/crew/expenses" label="New expense claim" icon={<ReceiptIcon />} />
        <Action href="/crew/payslips" label="View payslip" icon={<CardIcon />} />
      </nav>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard label="Hours this week" value={hours} tone="bg-indigo-100 text-indigo-700" icon={<ClockIcon />} />
        <StatCard label="Leave remaining" value={remaining} tone="bg-[#0ca30c]/12 text-[#006300]" icon={<CalendarIcon />} />
        <StatCard label="Open claims" value={openClaims.length} tone="bg-amber-100 text-amber-800" icon={<ReceiptIcon />} />
        <MoneyCard
          label="Last net pay"
          value={pay ? formatMoney(pay.netPence) : '—'}
          hint={payPeriod.label}
          tone="bg-zinc-100 text-zinc-700"
          icon={<CardIcon />}
        />
      </div>

      <section className="rounded-xl border border-zinc-200 bg-white p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-sm font-medium text-zinc-900">Your week</h2>
          <Link
            href="/crew/timesheet"
            className="rounded-sm text-sm font-medium text-indigo-600 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Full timesheet
          </Link>
        </div>
        <ul className="mt-4 grid grid-cols-7 gap-2">
          {codes.map((c, i) => {
            const isToday = attendanceWeek[i] === today
            return (
              <li key={attendanceWeek[i]} className="flex flex-col items-center gap-1.5">
                <span className={`text-xs ${isToday ? 'font-semibold text-indigo-700' : 'text-zinc-500'}`}>
                  {DOW[i]}
                </span>
                <span
                  title={`${CODE[c].label} · ${attendanceHours[c]}h`}
                  className={`flex h-11 w-full items-center justify-center rounded-lg text-sm font-semibold ${CODE[c].cell} ${isToday ? 'ring-2 ring-indigo-500 ring-offset-1' : ''}`}
                >
                  <span aria-hidden="true">{c === '-' ? '·' : c}</span>
                  <span className="sr-only">{CODE[c].label}</span>
                </span>
                <span className="text-xs text-zinc-400" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {attendanceHours[c] || ''}
                </span>
              </li>
            )
          })}
        </ul>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-zinc-200 bg-white">
          <div className="flex items-center justify-between gap-3 border-b border-zinc-200 px-5 py-4">
            <h2 className="text-sm font-medium text-zinc-900">Your requests</h2>
            <span className="flex items-center gap-3">
              <Link
                href="/crew/leave"
                className="rounded-sm text-sm font-medium text-indigo-600 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Leave
              </Link>
              <Link
                href="/crew/expenses"
                className="rounded-sm text-sm font-medium text-indigo-600 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Expenses
              </Link>
            </span>
          </div>
          {myLeave.length === 0 && myExpenses.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-zinc-500">
              You haven&apos;t submitted anything yet.
            </p>
          ) : (
            <ul className="divide-y divide-zinc-100">
              {[
                ...myLeave.map((r) => ({
                  key: r.id,
                  title: `${r.days} day${r.days === 1 ? '' : 's'} ${r.type} leave`,
                  detail: `${shortDate(r.from)} – ${shortDate(r.to)}`,
                  status: r.status,
                })),
                ...myExpenses.map((e) => ({
                  key: e.id,
                  title: e.merchant,
                  detail: `${formatMoney(e.amountPence)} · ${e.description}`,
                  status: e.status,
                })),
              ]
                .slice(0, 5)
                .map((it) => (
                  <li key={it.key} className="flex items-center gap-3 px-5 py-3">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-zinc-900">
                        {it.title}
                      </span>
                      <span className="block truncate text-xs text-zinc-500">
                        {it.detail}
                      </span>
                    </span>
                    <StatusPill status={it.status} />
                  </li>
                ))}
            </ul>
          )}
        </section>

        <TeamCelebrations />
      </div>
    </div>
  )
}

/** Colleagues with something to mark in the next fortnight. */
function TeamCelebrations() {
  const days = (from: string, to: string) => {
    const [fy, fm, fd] = from.split('-').map(Number)
    const [ty, tm, td] = to.split('-').map(Number)
    return Math.round((Date.UTC(ty, tm - 1, td) - Date.UTC(fy, fm - 1, fd)) / 86_400_000)
  }
  const next = (md: string) => {
    const y = Number(today.slice(0, 4))
    return `${y}-${md}` >= today ? `${y}-${md}` : `${y + 1}-${md}`
  }

  const items = staff
    .flatMap((p) => {
      const out: { name: string; kind: string; away: number; date: string }[] = []
      const b = next(p.birthday)
      out.push({ name: p.name, kind: 'Birthday', away: days(today, b), date: b })
      const a = next(p.joined.slice(5))
      const years = Number(a.slice(0, 4)) - Number(p.joined.slice(0, 4))
      if (years > 0) {
        out.push({ name: p.name, kind: `${years} years`, away: days(today, a), date: a })
      }
      return out
    })
    .filter((c) => c.away >= 0 && c.away <= 14)
    .sort((a, b) => a.away - b.away)
    .slice(0, 5)

  return (
    <section className="rounded-xl border border-zinc-200 bg-white">
      <div className="border-b border-zinc-200 px-5 py-4">
        <h2 className="text-sm font-medium text-zinc-900">Around the team</h2>
        <p className="mt-0.5 text-sm text-zinc-500">Next two weeks</p>
      </div>
      {items.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-zinc-500">
          Nothing coming up.
        </p>
      ) : (
        <ul className="divide-y divide-zinc-100">
          {items.map((c) => (
            <li key={`${c.name}-${c.kind}`} className="flex items-center gap-3 px-5 py-3">
              <span className="min-w-0 flex-1 truncate text-sm text-zinc-900">
                {c.name}
              </span>
              <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600">
                {c.kind}
              </span>
              <span className="w-16 shrink-0 text-right text-xs text-zinc-500" style={{ fontVariantNumeric: 'tabular-nums' }}>
                {c.away === 0 ? 'Today' : c.away === 1 ? 'Tomorrow' : shortDate(c.date)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function Action({
  href,
  label,
  icon,
  primary,
}: {
  href: string
  label: string
  icon: React.ReactNode
  primary?: boolean
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${
        primary
          ? 'bg-indigo-600 text-white hover:bg-indigo-500'
          : 'border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50'
      }`}
    >
      <span className={primary ? 'text-white' : 'text-zinc-400'}>{icon}</span>
      {label}
    </Link>
  )
}

function MoneyCard({
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

function ClockIcon() {
  return (
    <svg {...STAT_ICON}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5.25L15.5 14" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg {...STAT_ICON}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M3.5 9.5h17M8 3.5v3M16 3.5v3" />
    </svg>
  )
}

function ReceiptIcon() {
  return (
    <svg {...STAT_ICON}>
      <path d="M5.5 3.5h13v17l-2.17-1.5-2.16 1.5-2.17-1.5-2.17 1.5-2.16-1.5z" />
      <path d="M9 8.5h6M9 12.5h6" />
    </svg>
  )
}

function CardIcon() {
  return (
    <svg {...STAT_ICON}>
      <rect x="2.5" y="5.5" width="19" height="13" rx="2.5" />
      <path d="M2.5 10h19M6 14.5h3" />
    </svg>
  )
}
