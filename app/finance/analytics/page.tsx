import type { Metadata } from 'next'
import { FinanceAnalytics } from '@/app/ui/admin/finance-analytics'

export const metadata: Metadata = { title: 'Analytics' }

// Finance sees the same table the admin area does.
export default function FinanceAnalyticsPage() {
  return <FinanceAnalytics />
}
