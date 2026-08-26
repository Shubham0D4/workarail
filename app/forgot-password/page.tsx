import type { Metadata } from 'next'
import Link from 'next/link'
import { AuthShell } from '@/app/ui/auth-shell'
import { ForgotPasswordForm } from '@/app/ui/forgot-password-form'
import { authLinkClass } from '@/app/ui/styles'

export const metadata: Metadata = {
  title: 'Reset password',
  description: 'Reset the password for your Work à Rail account.',
}

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Reset your password"
      subtitle="We'll email you a reset link."
      footer={
        <>
          Remembered it?{' '}
          <Link href="/signin" className={authLinkClass}>
            Back to sign in
          </Link>
        </>
      }
    >
      <ForgotPasswordForm />
    </AuthShell>
  )
}
