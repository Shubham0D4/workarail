import type { Metadata } from 'next'
import { ExpensesTable } from '@/app/ui/admin/expenses-table'
import { getExpenses, getStaff } from '@/app/actions/admin'

export const metadata: Metadata = {
  title: 'Expenses',
  description: 'Company expense claims, receipts and reimbursements.',
}

// The title and primary action live in the topbar (app/ui/admin/topbar.tsx).
export default async function ExpensesPage() {
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
