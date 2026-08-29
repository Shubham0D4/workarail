import type { Metadata } from 'next'
import { AuthShell } from '@/app/ui/auth-shell'
import { SignInForm } from '@/app/ui/signin-form'
import { auth } from '@/app/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to your Work à Rail account.',
}

interface PageProps {
  searchParams: Promise<{ reset?: string }>
}

export default async function SignInPage({ searchParams }: PageProps) {
  const params = await searchParams
  const resetSuccess = params.reset === 'success'

  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (session && session.user) {
    const { checkIsStaff } = await import('@/app/actions/auth')
    const isStaff = await checkIsStaff(session.user.email)
    if (isStaff) {
      redirect('/crew')
    } else {
      redirect('/admin/dashboard')
    }
  }

  return (
    <AuthShell
      title="Sign in to Work à Rail"
      subtitle={resetSuccess ? "Password updated. Enter your details to continue." : "Welcome back. Enter your details to continue."}
    >
      <SignInForm resetSuccess={resetSuccess} />
    </AuthShell>
  )
}
