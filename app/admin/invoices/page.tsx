import type { Metadata } from 'next'
import { InvoicesTable } from '@/app/ui/admin/invoices-table'
import { getInvoices } from '@/app/actions/admin'

export const metadata: Metadata = {
  title: 'Invoices',
  description: 'Invoice transactions, documents and payment proof.',
}

// The title and primary action live in the topbar (app/ui/admin/topbar.tsx).
export default async function InvoicesPage() {
  const invoices = await getInvoices()
  const today = new Date().toISOString().split('T')[0]
  return <InvoicesTable initialInvoices={invoices} todayDate={today} />
}
