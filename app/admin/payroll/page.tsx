import type { Metadata } from 'next'
import { PayrollTable } from '@/app/ui/admin/payroll-table'
import { getPayrollRecords, getStaff, getRequestPayPeriod } from '@/app/actions/admin'

export const metadata: Metadata = {
  title: 'Payroll',
  description: 'Employee payroll and payment slips for Work à Rail.',
}

// The title lives in the topbar (app/ui/admin/topbar.tsx).
export default async function PayrollPage() {
  const records = await getPayrollRecords()
  const staff = await getStaff()
  const period = await getRequestPayPeriod()
  return (
    <PayrollTable
      initialPayrollRuns={records}
      initialStaff={staff}
      activePayPeriod={period}
    />
  )
}
