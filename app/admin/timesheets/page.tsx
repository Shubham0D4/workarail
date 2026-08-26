import type { Metadata } from 'next'
import { AttendanceTable } from '@/app/ui/admin/attendance-table'

export const metadata: Metadata = {
  title: 'Timesheets',
  description: 'Weekly attendance for every employee at Work à Rail.',
}

// The title and primary action live in the topbar (app/ui/admin/topbar.tsx).
export default function TimesheetsPage() {
  return <AttendanceTable />
}
