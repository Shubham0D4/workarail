import type { Metadata } from 'next'
import { LeaveRequests } from '@/app/ui/admin/leave-requests'
import { getLeaveRequests, getStaff } from '@/app/actions/admin'

export const metadata: Metadata = {
  title: 'Leaves',
  description: 'Employee leave requests and approvals for Work à Rail.',
}

// The title and primary action live in the topbar (app/ui/admin/topbar.tsx).
export default async function LeavesPage() {
  const leaves = await getLeaveRequests()
  const staff = await getStaff()
  const today = new Date().toISOString().split('T')[0]
  return <LeaveRequests initialLeaves={leaves} initialStaff={staff} todayDate={today} />
}
