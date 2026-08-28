import type { Metadata } from 'next'
import { AttendanceTable } from '@/app/ui/admin/attendance-table'
import { getTimesheetData } from '@/app/actions/admin'

export const metadata: Metadata = { title: 'Attendance' }

export const dynamic = 'force-dynamic'

// Finance sees the same table the admin area does.
export default async function FinanceAttendancePage() {
  const { staff, attendancePatterns, week, today } = await getTimesheetData()
  return (
    <AttendanceTable
      initialStaff={staff}
      initialPatterns={attendancePatterns}
      week={week}
      todayDate={today}
    />
  )
}
