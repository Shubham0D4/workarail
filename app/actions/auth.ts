'use server'

import type { ResetState, SignInState } from '@/app/lib/auth-state'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function signIn(
  prevState: SignInState,
  formData: FormData
): Promise<SignInState> {
  // The clicked submit button contributes `intent` to the FormData.
  const intent = String(formData.get('intent') ?? 'email')
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const remember = formData.get('remember') === 'on'

  // Step 2 -> step 1, so the user can correct a typo'd address.
  if (intent === 'back') {
    return { step: 'email', values: { email: prevState.values?.email } }
  }

  const emailError = !email
    ? 'Enter your email address.'
    : !EMAIL_PATTERN.test(email)
      ? 'Enter a valid email address.'
      : undefined

  // Step 1: validate the address, then advance to the password step.
  if (intent === 'email') {
    if (emailError) {
      return { step: 'email', errors: { email: emailError }, values: { email } }
    }

    // TODO: Optionally look the account up here first — that lets you send
    // SSO-backed domains straight to their identity provider, or surface
    // "no account found" before asking for a password. Returning the same
    // shape either way avoids leaking which addresses are registered.
    return { step: 'password', values: { email } }
  }

  // Step 2: the email rides along in a hidden input; re-check it defensively
  // since a client can post anything.
  if (emailError) {
    return { step: 'email', errors: { email: emailError }, values: { email } }
  }

  if (!password) {
    return {
      step: 'password',
      errors: { password: 'Enter your password.' },
      // Never echo the password back to the client.
      values: { email, remember },
    }
  }

  // TODO: Verify the credentials against your user store, then create a
  // session and redirect. The shape is roughly:
  //
  //   const user = await verifyCredentials(email, password)
  //   if (!user) return { step: 'password', message: 'Invalid email or password.', values: { email, remember } }
  //   await createSession(user.id, { remember })
  //   redirect('/')
  //
  // `redirect()` is imported from 'next/navigation' and throws, so it must be
  // called outside of a try/catch. Set the session cookie with `httpOnly`,
  // `secure` and `sameSite: 'lax'` — see the Next.js authentication guide.
  return {
    step: 'password',
    message: 'Sign-in is not wired up yet. Connect an auth provider in app/actions/auth.ts.',
    values: { email, remember },
  }
}

export async function signInWithGoogle(): Promise<SignInState> {
  // TODO: Kick off the Google OAuth flow. Typically you build the provider's
  // authorize URL (client id, redirect URI, scope, state/PKCE) and redirect to
  // it, then exchange the code for tokens in a route handler at
  // app/api/auth/callback/google/route.ts and create the session there.
  //
  //   redirect(buildGoogleAuthorizeUrl({ redirectTo: '/' }))
  //
  // `redirect()` is imported from 'next/navigation' and throws, so it must be
  // called outside of a try/catch.
  return {
    step: 'email',
    message: 'Google sign-in is not wired up yet. Add your OAuth client in app/actions/auth.ts.',
  }
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

  // TODO: Generate a single-use token, store only its hash with a short expiry
  // (an hour is typical), and email the link.
  //
  // Report success even when no account matches — otherwise this endpoint tells
  // an attacker which addresses are registered. Rate-limit it per address and
  // per IP, since it sends mail on demand.
  return { status: 'sent', values: { email } }
}
