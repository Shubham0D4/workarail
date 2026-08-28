import type { Metadata } from 'next'
import { InvoicesTable } from '@/app/ui/admin/invoices-table'
import { getInvoices } from '@/app/actions/admin'

export const metadata: Metadata = { title: 'Invoices' }

export const dynamic = 'force-dynamic'

// Finance sees the same table the admin area does.
export default async function FinanceInvoicesPage() {
  const invoices = await getInvoices()
  const today = new Date().toISOString().split('T')[0]
  return <InvoicesTable initialInvoices={invoices} todayDate={today} />
}
