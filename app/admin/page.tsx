import { redirect } from 'next/navigation'

/** The admin section has no index of its own — Dashboard is its default view. */
export default function AdminIndexPage() {
  redirect('/admin/dashboard')
}
