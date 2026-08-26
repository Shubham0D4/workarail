import type { Metadata } from 'next'
import { attendanceFor, attendanceWeek, currentStaff, today } from '@/app/lib/admin-data'
import { TimesheetForm } from '@/app/ui/crew/timesheet-form'

export const metadata: Metadata = { title: 'My timesheet' }

const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function CrewTimesheetPage() {
  const me = currentStaff()
  const [y, m, d] = attendanceWeek[0].split('-')
  const [, m2, d2] = attendanceWeek[6].split('-')
  const range = `${Number(d)} ${MON[Number(m) - 1]} – ${Number(d2)} ${MON[Number(m2) - 1]} ${y}`

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
          My timesheet
        </h1>
        <p className="mt-1 text-sm text-zinc-600">{range}</p>
      </div>

      <TimesheetForm initial={attendanceFor(me.ref)} today={today} />
    </div>
  )
}
