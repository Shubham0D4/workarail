'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/app/lib/auth'
import type { ResetState, SignInState, PasswordResetState } from '@/app/lib/auth-state'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function signIn(
  prevState: SignInState,
  formData: FormData
): Promise<SignInState> {
  const intent = String(formData.get('intent') ?? 'email')
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const remember = formData.get('remember') === 'on'

  if (intent === 'back') {
    return { step: 'email', values: { email: prevState.values?.email } }
  }

  const emailError = !email
    ? 'Enter your email address.'
    : !EMAIL_PATTERN.test(email)
      ? 'Enter a valid email address.'
      : undefined

  if (intent === 'email') {
    if (emailError) {
      return { step: 'email', errors: { email: emailError }, values: { email } }
    }
    return { step: 'password', values: { email } }
  }

  if (emailError) {
    return { step: 'email', errors: { email: emailError }, values: { email } }
  }

  if (!password) {
    return {
      step: 'password',
      errors: { password: 'Enter your password.' },
      values: { email, remember },
    }
  }

  try {
    // Attempt sign-in first
    await auth.api.signInEmail({
      body: {
        email,
        password,
        rememberMe: remember,
      },
      headers: await headers(),
    });
  } catch (error: any) {
    // If sign-in failed, attempt automatic registration (flawless onboarding/dev experience)
    try {
      await auth.api.signUpEmail({
        body: {
          email,
          password,
          name: email.split('@')[0],
          rememberMe: remember,
        },
        headers: await headers(),
      });
    } catch (signUpError: any) {
      return {
        step: 'password',
        message: error.message || signUpError.message || 'Invalid email or password.',
        values: { email, remember },
      };
    }
  }

  // Redirect based on whether user is crew or admin
  const { prisma } = await import('@/app/lib/prisma')
  const isStaff = await prisma.staff.findUnique({
    where: { email },
  })

  if (isStaff) {
    redirect('/crew')
  } else {
    redirect('/admin/dashboard')
  }
}

export async function signInWithGoogle(): Promise<SignInState> {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const appUrl = process.env.APP_URL || 'http://localhost:3000'

  if (!clientId || clientId === 'mock') {
    if (process.env.NODE_ENV === 'production') {
      return {
        step: 'email',
        message: 'Google Client ID is not configured.',
      }
    }

    // Dev mock login fallback:
    // 1. Register mock user if not exists
    try {
      await auth.api.signUpEmail({
        body: {
          email: "mock-admin@workarail.com",
          password: "mock-password-123",
          name: "Mock Admin User",
        },
        headers: await headers(),
      });
    } catch (e) {
      // Ignore if user already exists
    }

    // 2. Sign in mock user
    try {
      await auth.api.signInEmail({
        body: {
          email: "mock-admin@workarail.com",
          password: "mock-password-123",
        },
        headers: await headers(),
      });
    } catch (e: any) {
      return {
        step: 'email',
        message: e.message || 'Mock login failed',
      };
    }

    redirect('/admin/dashboard')
  }

  // Real Google OAuth
  let redirectUrl: string | null = null;
  try {
    const res = await auth.api.signInSocial({
      body: {
        provider: "google",
        callbackURL: `${appUrl}/admin/dashboard`
      },
      headers: await headers(),
    });
    if (res?.url) {
      redirectUrl = res.url;
    }
  } catch (e: any) {
    return {
      step: 'email',
      message: e.message || 'Google Sign-In failed',
    };
  }

  if (redirectUrl) {
    redirect(redirectUrl);
  }

  return { step: 'email' }
}

export async function signOut(): Promise<void> {
  try {
    await auth.api.signOut({
      headers: await headers(),
    });
  } catch (e) {
    // Ignore sign-out errors
  }
  redirect('/signin')
}

export async function requestPasswordReset(
  _prevState: ResetState,
  formData: FormData
): Promise<ResetState> {
  const email = String(formData.get('email') ?? '').trim()

  if (!email) {
    return { status: 'idle', error: 'Enter your email address.', values: { email } }
  }

  if (!EMAIL_PATTERN.test(email)) {
    return {
      status: 'idle',
      error: 'Enter a valid email address.',
      values: { email },
    }
  }

  try {
    const appUrl = process.env.APP_URL || 'http://localhost:3000'
    await auth.api.requestPasswordReset({
      body: {
        email,
        redirectTo: `${appUrl}/reset-password`,
      },
      headers: await headers(),
    })
  } catch (error: any) {
    return {
      status: 'idle',
      error: error.message || 'Failed to send reset link.',
      values: { email },
    }
  }

  return { status: 'sent', values: { email } }
}

export async function resetPassword(
  _prevState: PasswordResetState,
  formData: FormData
): Promise<PasswordResetState> {
  const password = String(formData.get('password') ?? '')
  const confirmPassword = String(formData.get('confirmPassword') ?? '')
  const token = String(formData.get('token') ?? '')

  if (!password) {
    return { error: 'Enter a new password.', values: { password, confirmPassword } }
  }

  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters.', values: { password, confirmPassword } }
  }

  if (password !== confirmPassword) {
    return { error: 'Passwords do not match.', values: { password, confirmPassword } }
  }

  if (!token) {
    return { error: 'Invalid or missing token.', values: { password, confirmPassword } }
  }

  try {
    await auth.api.resetPassword({
      body: {
        token,
        newPassword: password,
      },
      headers: await headers(),
    })
  } catch (error: any) {
    return {
      error: error.message || 'Failed to reset password.',
      values: { password, confirmPassword },
    }
  }

  redirect('/signin?reset=success')
}

export async function checkIsStaff(email: string): Promise<boolean> {
  const { prisma } = await import('@/app/lib/prisma')
  const isStaff = await prisma.staff.findUnique({
    where: { email },
  })
  return !!isStaff
}

