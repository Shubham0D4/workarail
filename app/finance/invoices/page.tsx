import type { Metadata } from 'next'
import { InvoicesTable } from '@/app/ui/admin/invoices-table'

export const metadata: Metadata = { title: 'Invoices' }

// Finance sees the same table the admin area does.
export default function FinanceInvoicesPage() {
  return <InvoicesTable />
}
