import type { Metadata } from 'next'
import { Celebrations } from '@/app/ui/admin/celebrations'
import { getStaff } from '@/app/actions/admin'

export const metadata: Metadata = {
  title: 'Celebrations',
  description: 'Upcoming birthdays and work anniversaries at Work à Rail.',
}

// The title lives in the topbar (app/ui/admin/topbar.tsx).
export default async function CelebrationsPage() {
  const staff = await getStaff()
  const today = new Date().toISOString().split('T')[0]
  return <Celebrations initialStaff={staff} todayDate={today} />
}
