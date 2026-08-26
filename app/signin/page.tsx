import type { Metadata } from 'next'
import { AuthShell } from '@/app/ui/auth-shell'
import { SignInForm } from '@/app/ui/signin-form'

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to your Work à Rail account.',
}

export default function SignInPage() {
  return (
    <AuthShell
      title="Sign in to Work à Rail"
      subtitle="Welcome back. Enter your details to continue."
    >
      <SignInForm />
    </AuthShell>
  )
}
