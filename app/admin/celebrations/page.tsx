import type { Metadata } from 'next'
import { Celebrations } from '@/app/ui/admin/celebrations'

export const metadata: Metadata = {
  title: 'Celebrations',
  description: 'Upcoming birthdays and work anniversaries at Work à Rail.',
}

// The title lives in the topbar (app/ui/admin/topbar.tsx).
export default function CelebrationsPage() {
  return <Celebrations />
}
