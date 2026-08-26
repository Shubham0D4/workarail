import type { Metadata } from 'next'
import { CrewsTable } from '@/app/ui/admin/crews-table'

export const metadata: Metadata = {
  title: 'Crews',
  description: 'Crew roster, assignments and contact details for Work à Rail.',
}

// The title and primary action live in the topbar (app/ui/admin/topbar.tsx).
export default function CrewsPage() {
  return <CrewsTable />
}
