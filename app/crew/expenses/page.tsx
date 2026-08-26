import type { Metadata } from 'next'
import { currentStaff, expensesFor, today } from '@/app/lib/admin-data'
import { ExpenseClaims } from '@/app/ui/crew/expense-claims'

export const metadata: Metadata = { title: 'My expenses' }

export default function CrewExpensesPage() {
  const me = currentStaff()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
          My expenses
        </h1>
        <p className="mt-1 text-sm text-zinc-600">
          Claim back anything you paid for out of pocket.
        </p>
      </div>

      <ExpenseClaims staffRef={me.ref} existing={expensesFor(me.ref)} today={today} />
    </div>
  )
}
