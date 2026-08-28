import type { Metadata } from 'next'
import { PayrollTable } from '@/app/ui/admin/payroll-table'
import { getPayrollRecords, getStaff, getRequestPayPeriod } from '@/app/actions/admin'

export const metadata: Metadata = { title: 'Payroll' }

export const dynamic = 'force-dynamic'

// Finance sees the same table the admin area does.
export default async function FinancePayrollPage() {
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
