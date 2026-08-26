import type { Metadata } from 'next'
import { currentStaff, payrollFor } from '@/app/lib/admin-data'
import { CrewPayslips } from '@/app/ui/crew/payslips'

export const metadata: Metadata = { title: 'My payslips' }

export default function CrewPayslipsPage() {
  const me = currentStaff()
  const record = payrollFor(me.ref)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
          My payslips
        </h1>
        <p className="mt-1 text-sm text-zinc-600">
          Open a slip to print it or save it as a PDF.
        </p>
      </div>

      <CrewPayslips person={me} record={record} />
    </div>
  )
}
