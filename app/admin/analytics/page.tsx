import type { Metadata } from 'next'
import { FinanceAnalytics } from '@/app/ui/admin/finance-analytics'

export const metadata: Metadata = {
  title: 'Analytics',
  description: 'Company earnings, spend and margin for Work à Rail.',
}

// The title lives in the topbar (app/ui/admin/topbar.tsx).
export default function AnalyticsPage() {
  return <FinanceAnalytics />
}
