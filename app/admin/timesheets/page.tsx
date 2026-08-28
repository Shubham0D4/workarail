import type { Metadata } from 'next'
import { AttendanceTable } from '@/app/ui/admin/attendance-table'
import { getTimesheetData } from '@/app/actions/admin'

export const metadata: Metadata = {
  title: 'Timesheets',
  description: 'Weekly attendance for every employee at Work à Rail.',
}

// The title and primary action live in the topbar (app/ui/admin/topbar.tsx).
export default async function TimesheetsPage() {
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
