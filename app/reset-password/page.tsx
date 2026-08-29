import type { Metadata } from 'next'
import Link from 'next/link'
import { AuthShell } from '@/app/ui/auth-shell'
import { ResetPasswordForm } from '@/app/ui/reset-password-form'
import { authLinkClass } from '@/app/ui/styles'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Reset password',
  description: 'Reset the password for your Work à Rail account.',
}

interface PageProps {
  searchParams: Promise<{ token?: string }>
}

export default async function ResetPasswordPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const token = params.token;

  if (!token) {
    redirect('/signin');
  }

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter a new password below to update your credentials."
      footer={
        <>
          Remembered it?{' '}
          <Link href="/signin" className={authLinkClass}>
            Back to sign in
          </Link>
        </>
      }
    >
      <ResetPasswordForm token={token} />
    </AuthShell>
  )
}
