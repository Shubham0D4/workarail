'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { PAY_ALLOWANCE_PENCE, formatMoney } from '@/app/lib/admin-data'
import { useRegisterPageAction } from '@/app/ui/admin/page-action'
import { useToast } from '@/app/ui/toast'

const SECTIONS = [
  { id: 'organisation', label: 'Organisation', icon: BuildingIcon },
  { id: 'payroll', label: 'Payroll', icon: CardIcon },
  { id: 'leave', label: 'Leave & attendance', icon: CalendarIcon },
  { id: 'holidays', label: 'Public holidays', icon: GlobeIcon },
  { id: 'notifications', label: 'Notifications', icon: BellIcon },
  { id: 'security', label: 'Security', icon: ShieldIcon },
] as const

/** One control height across the whole form, matching the rest of the app. */
const control =
  'h-9 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/40'

export function SettingsForm({ holidays }: { holidays?: React.ReactNode }) {
  // TODO: settings live in the form only — they reset on reload. Wire this to
  // a Server Action to persist them.
  const formRef = useRef<HTMLFormElement>(null)
  const [dirty, setDirty] = useState(false)
  const toast = useToast()

  useRegisterPageAction('Save changes', () =>
    formRef.current?.requestSubmit()
  )

  // Warn before losing edits on a real navigation away.
  useEffect(() => {
    if (!dirty) return
    const warn = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      <SettingsNav />

      <form
        ref={formRef}
        // Uncontrolled fields, so any edit marks the form dirty and Discard is
        // a plain form reset — no per-field state to keep in sync.
        onChange={() => setDirty(true)}
        onSubmit={(e) => {
          e.preventDefault()
          setDirty(false)
          toast('Settings saved for this session.')
        }}
        onReset={() => setDirty(false)}
        className="flex min-w-0 flex-1 flex-col gap-6"
      >
        <Section
          id="organisation"
          title="Organisation"
          description="How the company appears across the app and on documents."
        >
          <Row label="Company name">
            <input name="company" defaultValue="Work à Rail" className={control} />
          </Row>
          <Row label="Contact email">
            <input name="email" type="email" defaultValue="admin@workarail.com" className={control} />
          </Row>
          <Row label="Time zone">
            <Select name="timezone" defaultValue="Europe/London" options={['Europe/London', 'Europe/Dublin', 'Europe/Paris', 'UTC']} />
          </Row>
          <Row label="Currency" hint="Used for payroll, invoices and expenses.">
            <Select name="currency" defaultValue="GBP (£)" options={['GBP (£)', 'EUR (€)', 'USD ($)']} />
          </Row>
        </Section>

        <Section
          id="payroll"
          title="Payroll"
          description="Rates applied when a pay run is calculated. Changing these recalculates every payslip in the next run."
        >
          <Row label="Pay day">
            <Select name="payday" defaultValue="Last working day" options={['Last working day', '25th of the month', '1st of the month']} />
          </Row>
          <Row label="Personal allowance" hint={`Currently ${formatMoney(PAY_ALLOWANCE_PENCE)} per month.`}>
            <input name="allowance" type="number" step="0.01" defaultValue={(PAY_ALLOWANCE_PENCE / 100).toFixed(2)} className={control} />
          </Row>
          <Row label="Deduction rates" hint="Applied to pay above the allowance." group>
            <div className="grid grid-cols-3 gap-3">
              <Percent name="tax" label="Tax" defaultValue={20} />
              <Percent name="ni" label="NI" defaultValue={8} />
              <Percent name="pension" label="Pension" defaultValue={5} />
            </div>
          </Row>
        </Section>

        <Section
          id="leave"
          title="Leave & attendance"
          description="Entitlements and the working pattern behind timesheets."
        >
          <Row label="Annual leave" hint="Days per year, excluding public holidays.">
            <input name="leaveDays" type="number" defaultValue={28} className={control} />
          </Row>
          <Row label="Carry-over limit" hint="Unused days that roll into next year.">
            <input name="carryOver" type="number" defaultValue={5} className={control} />
          </Row>
          <Row label="Working days">
            <Select name="workingDays" defaultValue="Monday to Friday" options={['Monday to Friday', 'Monday to Saturday', 'Custom']} />
          </Row>
          <Row label="Standard day" hint="Hours credited for a full day on a timesheet.">
            <input name="standardDay" type="number" step="0.5" defaultValue={8} className={control} />
          </Row>
        </Section>

        {holidays}

        <Section
          id="notifications"
          title="Notifications"
          description="Emails sent to admin@workarail.com."
        >
          <Toggle name="notifyLeave" label="Leave requests" hint="When someone submits a request for approval." defaultChecked />
          <Toggle name="notifyExpenses" label="Expense claims" hint="When a claim is submitted or a receipt is missing." defaultChecked />
          <Toggle name="notifyPayroll" label="Payroll run" hint="A reminder two days before pay day." defaultChecked />
          <Toggle name="notifyCelebrations" label="Celebrations" hint="A weekly digest of upcoming birthdays and anniversaries." />
        </Section>

        <Section
          id="security"
          title="Security"
          description="Who can reach the admin area and how sessions behave."
        >
          <Row label="Session timeout" hint="Signed out after this long without activity.">
            <Select name="sessionTimeout" defaultValue="8 hours" options={['1 hour', '8 hours', '24 hours', 'Never']} />
          </Row>
          <Toggle name="twoFactor" label="Require two-factor" hint="Every admin must confirm sign-in with a second factor." defaultChecked />
          <Toggle name="auditLog" label="Keep an audit log" hint="Record approvals, pay runs and setting changes." defaultChecked />
        </Section>

        {/* Sticky only while there is something to lose. */}
        {dirty ? (
          <div className="sticky bottom-4 z-30 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-300 bg-white px-4 py-3 shadow-lg">
            <p className="flex items-center gap-2 text-sm text-zinc-700">
              <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-amber-500" />
              You have unsaved changes.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="reset"
                className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Discard
              </button>
              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Save changes
              </button>
            </div>
          </div>
        ) : null}
      </form>
    </div>
  )
}

/** Highlights whichever section is in view. Plain anchors underneath, so
 *  jumping between sections still works before hydration. */
function SettingsNav() {
  const [active, setActive] = useState<string>(SECTIONS[0].id)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-96px 0px -55% 0px', threshold: 0 }
    )
    for (const s of SECTIONS) {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [])

  return (
    <nav
      aria-label="Settings sections"
      className="lg:sticky lg:top-24 lg:w-48 lg:shrink-0"
    >
      <ul className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
        {SECTIONS.map((s) => {
          const current = active === s.id
          const Icon = s.icon
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-current={current ? 'true' : undefined}
                onClick={() => setActive(s.id)}
                className={`group relative flex shrink-0 items-center gap-2.5 rounded-lg py-2 pr-2.5 pl-3 text-sm font-medium whitespace-nowrap transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${
                  current ? 'text-indigo-700' : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {/* Left marker, echoing how the main rail marks its active item. */}
                <span
                  aria-hidden="true"
                  className={`absolute top-1/2 left-0 h-4 w-0.5 -translate-y-1/2 rounded-full transition ${
                    current ? 'bg-indigo-600' : 'bg-transparent'
                  }`}
                />
                <span className={current ? 'text-indigo-600' : 'text-zinc-400 group-hover:text-zinc-500'}>
                  <Icon />
                </span>
                {s.label}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

function Section({
  id,
  title,
  description,
  children,
}: {
  id: string
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-24 rounded-xl border border-zinc-200 bg-white">
      <div className="border-b border-zinc-200 px-5 py-4">
        <h2 className="text-sm font-medium text-zinc-900">{title}</h2>
        <p className="mt-0.5 text-sm text-zinc-500">{description}</p>
      </div>
      <div className="flex flex-col divide-y divide-zinc-100">{children}</div>
    </section>
  )
}

/** Label left, control right — one alignment for every setting on the page. */
function Row({
  label,
  hint,
  group,
  children,
}: {
  label: string
  hint?: string
  /** Set when the row holds several controls: a label may only point at one,
   *  so the pair becomes a fieldset and legend instead. */
  group?: boolean
  children: React.ReactNode
}) {
  const id = useId()
  const layout =
    'grid gap-2 px-5 py-4 sm:grid-cols-[16rem_1fr] sm:items-start sm:gap-4'

  if (group) {
    return (
      <fieldset className={layout}>
        <div>
          <legend className="text-sm font-medium text-zinc-700">{label}</legend>
          {hint ? <p className="mt-0.5 text-xs text-zinc-500">{hint}</p> : null}
        </div>
        <div className="max-w-sm">{children}</div>
      </fieldset>
    )
  }

  return (
    <div className={layout}>
      <div>
        <label htmlFor={id} className="text-sm font-medium text-zinc-700">
          {label}
        </label>
        {hint ? <p className="mt-0.5 text-xs text-zinc-500">{hint}</p> : null}
      </div>
      <div className="max-w-sm">
        <Cloned id={id}>{children}</Cloned>
      </div>
    </div>
  )
}

/** Attaches the row's generated id to whichever control it wraps. */
function Cloned({ id, children }: { id: string; children: React.ReactNode }) {
  if (typeof children === 'object' && children !== null && 'props' in children) {
    const el = children as React.ReactElement<{ id?: string }>
    return <el.type {...el.props} id={id} />
  }
  return <>{children}</>
}

function Select({
  name,
  defaultValue,
  options,
  id,
}: {
  name: string
  defaultValue: string
  options: string[]
  id?: string
}) {
  return (
    <div className="relative">
      <select id={id} name={name} defaultValue={defaultValue} className={`${control} appearance-none pr-9`}>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-zinc-400">
        <svg {...NAV_ICON} className="size-3.5">
          <path d="m6.5 9.5 5.5 5.5 5.5-5.5" />
        </svg>
      </span>
    </div>
  )
}

function Percent({
  name,
  label,
  defaultValue,
}: {
  name: string
  label: string
  defaultValue: number
}) {
  const id = useId()
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs text-zinc-500">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type="number"
          step="0.1"
          min="0"
          max="100"
          defaultValue={defaultValue}
          className={`${control} pr-7`}
        />
        <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-sm text-zinc-500">
          %
        </span>
      </div>
    </div>
  )
}

/**
 * A real checkbox behind a switch. Keeps it in the form, so Discard resets it
 * and its value would post with everything else.
 */
function Toggle({
  name,
  label,
  hint,
  defaultChecked,
}: {
  name: string
  label: string
  hint: string
  defaultChecked?: boolean
}) {
  const id = useId()
  return (
    <div className="flex items-start justify-between gap-4 px-5 py-4">
      <label htmlFor={id} className="min-w-0 cursor-pointer">
        <span className="block text-sm font-medium text-zinc-700">{label}</span>
        <span className="mt-0.5 block text-xs text-zinc-500">{hint}</span>
      </label>
      <span className="relative inline-flex shrink-0 items-center">
        <input
          id={id}
          name={name}
          type="checkbox"
          role="switch"
          defaultChecked={defaultChecked}
          className="peer size-9 cursor-pointer appearance-none rounded-full opacity-0"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-0 h-5 w-9 -translate-y-1/2 rounded-full bg-zinc-200 transition peer-checked:bg-indigo-600 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-indigo-500"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-[1.125rem] size-4 -translate-y-1/2 rounded-full bg-white transition-all peer-checked:right-0.5"
        />
      </span>
    </div>
  )
}

/* --- nav icons --- */

const NAV_ICON = {
  'aria-hidden': 'true',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  className: 'size-4',
} as const

function BuildingIcon() {
  return (
    <svg {...NAV_ICON}>
      <path d="M4 20.5V5.5A1.5 1.5 0 0 1 5.5 4h7A1.5 1.5 0 0 1 14 5.5v15" />
      <path d="M14 10h4.5A1.5 1.5 0 0 1 20 11.5v9" />
      <path d="M2.5 20.5h19M7 8h4M7 12h4M7 16h4" />
    </svg>
  )
}

function CardIcon() {
  return (
    <svg {...NAV_ICON}>
      <rect x="2.5" y="5.5" width="19" height="13" rx="2.5" />
      <path d="M2.5 10h19M6 14.5h3" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg {...NAV_ICON}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M3.5 9.5h17M8 3.5v3M16 3.5v3" />
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg {...NAV_ICON}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17" />
      <path d="M12 3.5c2.2 2.3 3.4 5.3 3.4 8.5S14.2 18.2 12 20.5c-2.2-2.3-3.4-5.3-3.4-8.5S9.8 5.8 12 3.5Z" />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg {...NAV_ICON}>
      <path d="M18 8.5a6 6 0 1 0-12 0c0 5-2 6.5-2 6.5h16s-2-1.5-2-6.5" />
      <path d="M10.3 19a2 2 0 0 0 3.4 0" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg {...NAV_ICON}>
      <path d="M12 3.5 5 6v6c0 4.2 2.9 7.6 7 8.5 4.1-.9 7-4.3 7-8.5V6Z" />
      <path d="m9.5 12 1.8 1.8L15 10" />
    </svg>
  )
}
