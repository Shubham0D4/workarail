import type { Metadata } from 'next'
import { ExpensesTable } from '@/app/ui/admin/expenses-table'

export const metadata: Metadata = { title: 'Expenses' }

// Finance sees the same table the admin area does.
export default function FinanceExpensesPage() {
  return <ExpensesTable />
}
