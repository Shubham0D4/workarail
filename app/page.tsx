import { redirect } from 'next/navigation'
import { auth } from '@/app/lib/auth'
import { headers } from 'next/headers'
import { checkIsStaff } from '@/app/actions/auth'

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (session && session.user) {
    const isStaff = await checkIsStaff(session.user.email)
    if (isStaff) {
      redirect('/crew')
    } else {
      redirect('/admin/dashboard')
    }
  } else {
    redirect('/signin')
  }
}
