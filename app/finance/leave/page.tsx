import type { Metadata } from 'next'
import { LeaveRequests } from '@/app/ui/admin/leave-requests'

export const metadata: Metadata = { title: 'Leave' }

// Finance sees the same table the admin area does.
export default function FinanceLeavePage() {
  return <LeaveRequests />
}
