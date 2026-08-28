import type { Metadata } from 'next'
import { FinanceAnalytics } from '@/app/ui/admin/finance-analytics'
import { getMonthlyFinance, getInvoices, getExpenses, getPayrollRecords } from '@/app/actions/admin'

export const metadata: Metadata = {
  title: 'Analytics',
  description: 'Company earnings, spend and margin for Work à Rail.',
}

// The title lives in the topbar (app/ui/admin/topbar.tsx).
export default async function AnalyticsPage() {
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
