import type { Metadata } from 'next'
import { PayrollTable } from '@/app/ui/admin/payroll-table'

export const metadata: Metadata = { title: 'Payroll' }

// Finance sees the same table the admin area does.
export default function FinancePayrollPage() {
  return <PayrollTable />
}
