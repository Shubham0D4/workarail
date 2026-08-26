'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { regionName, type Country } from '@/app/lib/holidays'

const control =
  'h-9 appearance-none rounded-lg border border-zinc-300 bg-white pr-9 pl-3 text-sm text-zinc-900 outline-none transition focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/40'

/**
 * Navigates rather than submitting a form: this sits inside the settings
 * <form>, and a nested <form> is invalid HTML and breaks hydration.
 */
export function HolidayFilter({
  countries,
  regions,
  country,
  region,
  year,
}: {
  countries: Country[]
  regions: string[]
  country: string
  region: string | null
  year: number
}) {
  const router = useRouter()
  const params = useSearchParams()
  const [pending, setPending] = useState(false)

  function apply(next: Record<string, string>) {
    const q = new URLSearchParams(params.toString())
    for (const [k, v] of Object.entries(next)) {
      if (v) q.set(k, v)
      else q.delete(k)
    }
    setPending(true)
    router.push(`/admin/settings?${q.toString()}#holidays`)
  }

  return (
    <div className="flex flex-wrap items-end gap-3 border-b border-zinc-200 px-5 py-4">
      <Labelled label="Country">
        <select
          value={country}
          aria-label="Country"
          onChange={(e) => apply({ country: e.target.value, region: '' })}
          className={`${control} w-52`}
        >
          {countries.length === 0 ? (
            <option value={country}>{country}</option>
          ) : (
            countries.map((c) => (
              <option key={c.countryCode} value={c.countryCode}>
                {c.name}
              </option>
            ))
          )}
        </select>
      </Labelled>

      <Labelled label="Region">
        <select
          value={region ?? ''}
          aria-label="Region"
          disabled={regions.length === 0}
          onChange={(e) => apply({ region: e.target.value })}
          className={`${control} w-52 disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:text-zinc-400`}
        >
          <option value="">
            {regions.length === 0 ? 'No regions' : 'Nationwide only'}
          </option>
          {regions.map((r) => (
            <option key={r} value={r}>
              {regionName(r)}
            </option>
          ))}
        </select>
      </Labelled>

      <Labelled label="Year">
        <select
          value={year}
          aria-label="Year"
          onChange={(e) => apply({ year: e.target.value })}
          className={`${control} w-28`}
        >
          {[year - 1, year, year + 1].map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </Labelled>

      {pending ? (
        <span aria-live="polite" className="pb-2 text-xs text-zinc-500">
          Loading…
        </span>
      ) : null}
    </div>
  )
}

function Labelled({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <span className="flex flex-col gap-1.5 text-sm font-medium text-zinc-700">
      {label}
      <span className="relative">{children}<Chevron /></span>
    </span>
  )
}

function Chevron() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-zinc-400"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="size-3.5">
        <path d="m6.5 9.5 5.5 5.5 5.5-5.5" />
      </svg>
    </span>
  )
}
