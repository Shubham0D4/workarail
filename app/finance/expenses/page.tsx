import type { Metadata } from 'next'
import { ExpensesTable } from '@/app/ui/admin/expenses-table'
import { getExpenses, getStaff } from '@/app/actions/admin'

export const metadata: Metadata = { title: 'Expenses' }

export const dynamic = 'force-dynamic'

// Finance sees the same table the admin area does.
export default async function FinanceExpensesPage() {
  const expenses = await getExpenses()
  const staff = await getStaff()
  const today = new Date().toISOString().split('T')[0]
  return (
    <ExpensesTable
      initialExpenses={expenses}
      initialStaff={staff}
      todayDate={today}
    />
  )
}
