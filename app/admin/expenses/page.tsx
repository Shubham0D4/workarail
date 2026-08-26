import type { Metadata } from 'next'
import { ExpensesTable } from '@/app/ui/admin/expenses-table'

export const metadata: Metadata = {
  title: 'Expenses',
  description: 'Company expense claims, receipts and reimbursements.',
}

// The title and primary action live in the topbar (app/ui/admin/topbar.tsx).
export default function ExpensesPage() {
  return <ExpensesTable />
}
