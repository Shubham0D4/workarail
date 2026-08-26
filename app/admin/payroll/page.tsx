import type { Metadata } from 'next'
import { PayrollTable } from '@/app/ui/admin/payroll-table'

export const metadata: Metadata = {
  title: 'Payroll',
  description: 'Employee payroll and payment slips for Work à Rail.',
}

// The title lives in the topbar (app/ui/admin/topbar.tsx).
export default function PayrollPage() {
  return <PayrollTable />
}
