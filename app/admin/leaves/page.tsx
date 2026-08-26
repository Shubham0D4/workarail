import type { Metadata } from 'next'
import { LeaveRequests } from '@/app/ui/admin/leave-requests'

export const metadata: Metadata = {
  title: 'Leaves',
  description: 'Employee leave requests and approvals for Work à Rail.',
}

// The title and primary action live in the topbar (app/ui/admin/topbar.tsx).
export default function LeavesPage() {
  return <LeaveRequests />
}
