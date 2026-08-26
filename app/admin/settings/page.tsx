import type { Metadata } from 'next'
import { PublicHolidays } from '@/app/ui/admin/public-holidays'
import { SettingsForm } from '@/app/ui/admin/settings-form'

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Organisation, payroll, leave and notification settings.',
}

// The title and Save action live in the topbar (app/ui/admin/topbar.tsx).
export default async function SettingsPage({
  searchParams,
}: PageProps<'/admin/settings'>) {
  // Holiday selection travels in the URL so the fetch stays on the server.
  const params = await searchParams
  const one = (v: string | string[] | undefined) =>
    Array.isArray(v) ? v[0] : v

  const country = one(params.country) ?? 'GB'
  const region = one(params.region) || null
  const year = Number(one(params.year)) || 2026

  return (
    <SettingsForm
      holidays={
        <PublicHolidays country={country} region={region} year={year} />
      }
    />
  )
}
