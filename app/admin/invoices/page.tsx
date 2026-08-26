import type { Metadata } from 'next'
import { InvoicesTable } from '@/app/ui/admin/invoices-table'

export const metadata: Metadata = {
  title: 'Invoices',
  description: 'Invoice transactions, documents and payment proof.',
}

// The title and primary action live in the topbar (app/ui/admin/topbar.tsx).
export default function InvoicesPage() {
  return <InvoicesTable />
}
