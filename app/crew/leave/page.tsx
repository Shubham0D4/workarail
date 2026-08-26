import type { Metadata } from 'next'
import {
  ANNUAL_LEAVE_DAYS,
  currentStaff,
  leaveFor,
  leaveTakenBy,
  today,
} from '@/app/lib/admin-data'
import { LeaveForm } from '@/app/ui/crew/leave-form'

export const metadata: Metadata = { title: 'My leave' }

export default function CrewLeavePage() {
  const me = currentStaff()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900">My leave</h1>
        <p className="mt-1 text-sm text-zinc-600">
          {ANNUAL_LEAVE_DAYS} days a year, excluding public holidays.
        </p>
      </div>

      <LeaveForm
        staffRef={me.ref}
        existing={leaveFor(me.ref)}
        today={today}
        taken={leaveTakenBy(me.ref)}
      />
    </div>
  )
}
