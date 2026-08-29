import type { Metadata } from 'next'
import { FinanceAnalytics } from '@/app/ui/admin/finance-analytics'
import {
  getMonthlyFinance,
  getInvoices,
  getExpenses,
  getPayrollRecords,
} from '@/app/actions/admin'

export const metadata: Metadata = { title: 'Analytics' }
export const dynamic = 'force-dynamic'

// Finance sees the same table the admin area does.
export default async function FinanceAnalyticsPage() {
  const data = await getMonthlyFinance()
  const invoices = await getInvoices()
  const expenses = await getExpenses()
  const payroll = await getPayrollRecords()
  const payrollCostVal = payroll.reduce((sum, r) => sum + r.grossPence, 0)

  return (
    <FinanceAnalytics
      initialMonthlyFinance={data}
      initialInvoices={invoices}
      initialExpenses={expenses}
      initialPayrollCost={payrollCostVal}
    />
  )
}
