import type { Metadata } from 'next'
import { LeaveRequests } from '@/app/ui/admin/leave-requests'
import { getLeaveRequests, getStaff } from '@/app/actions/admin'

export const metadata: Metadata = { title: 'Leave' }

export const dynamic = 'force-dynamic'

// Finance sees the same table the admin area does.
export default async function FinanceLeavePage() {
  const leaves = await getLeaveRequests()
  const staff = await getStaff()
  const today = new Date().toISOString().split('T')[0]
  return <LeaveRequests initialLeaves={leaves} initialStaff={staff} todayDate={today} />
}
