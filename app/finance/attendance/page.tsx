import type { Metadata } from 'next'
import { AttendanceTable } from '@/app/ui/admin/attendance-table'

export const metadata: Metadata = { title: 'Attendance' }

// Finance sees the same table the admin area does.
export default function FinanceAttendancePage() {
  return <AttendanceTable />
}
