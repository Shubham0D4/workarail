'use client'

import Link from 'next/link'
import { useActionState, useId, useState } from 'react'
import { signIn, signInWithGoogle } from '@/app/actions/auth'
import { initialSignInState } from '@/app/lib/auth-state'
import {
  fieldBorderClass,
  fieldClass,
  primaryButtonClass,
} from '@/app/ui/styles'

export function SignInForm({ resetSuccess }: { resetSuccess?: boolean }) {
  const [state, formAction, pending] = useActionState(signIn, initialSignInState)
  const [googleState, googleAction, googlePending] = useActionState(
    signInWithGoogle,
    initialSignInState
  )
  const [showPassword, setShowPassword] = useState(false)

  const emailId = useId()
  const passwordId = useId()
  const emailErrorId = `${emailId}-error`
  const passwordErrorId = `${passwordId}-error`

  const busy = pending || googlePending
  const email = state.values?.email ?? ''

  // Step 2: password.
  if (state.step === 'password') {
    return (
      <form action={formAction} noValidate className="animate-auth-up flex flex-col gap-5">
        <input type="hidden" name="email" value={email} />

        <div className="flex items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-800 dark:bg-zinc-950">
          <span className="truncate text-sm text-zinc-700 dark:text-zinc-300">
            {email}
          </span>
          <button
            type="submit"
            name="intent"
            value="back"
            disabled={busy}
            className="shrink-0 rounded-sm text-sm font-medium text-indigo-600 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-60 dark:text-indigo-400"
          >
            Change
          </button>
        </div>

        <Alert message={state.message} />

        <div className="flex flex-col gap-1.5">
          <div className="flex items-baseline justify-between gap-3">
            <label
              htmlFor={passwordId}
              className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="rounded-sm text-sm text-indigo-600 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:text-indigo-400"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              id={passwordId}
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••"
              autoFocus
              disabled={busy}
              aria-invalid={state.errors?.password ? true : undefined}
              aria-describedby={
                state.errors?.password ? passwordErrorId : undefined
              }
              className={`${fieldClass} pr-11 ${fieldBorderClass(Boolean(state.errors?.password))}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((shown) => !shown)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
              className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg text-zinc-500 transition hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:text-zinc-500 dark:hover:text-zinc-100"
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
          <FieldError id={passwordErrorId} message={state.errors?.password} />
        </div>

        <label className="flex w-fit items-center gap-2.5 text-sm text-zinc-700 select-none dark:text-zinc-300">
          <input
            type="checkbox"
            name="remember"
            defaultChecked={state.values?.remember}
            disabled={busy}
            className="size-4 rounded-sm border-zinc-300 accent-indigo-600 dark:border-zinc-700"
          />
          Keep me signed in
        </label>

        <button
          type="submit"
          name="intent"
          value="password"
          disabled={busy}
          className={primaryButtonClass}
        >
          {pending ? (
            <>
              <SpinnerIcon />
              Signing in…
            </>
          ) : (
            'Sign in'
          )}
        </button>
      </form>
    )
  }

  // Step 1: Google, then email.
  return (
    <div className="animate-auth-up flex flex-col gap-5">
      {resetSuccess ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-750 bg-emerald-50/60 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300">
          Your password has been updated. Please sign in below.
        </div>
      ) : null}
      <form action={googleAction}>
        <button
          type="submit"
          disabled={busy}
          className="flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:cursor-not-allowed disabled:opacity-70 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
        >
          {googlePending ? <SpinnerIcon /> : <GoogleIcon />}
          Continue with Google
        </button>
      </form>

      <Alert message={googleState.message} />

      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
        <span className="text-xs font-medium tracking-wide text-zinc-500 uppercase dark:text-zinc-500">
          or
        </span>
        <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
      </div>

      <form action={formAction} noValidate className="animate-auth-up flex flex-col gap-5">
        <Alert message={state.message} />

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={emailId}
            className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
          >
            Email
          </label>
          <input
            id={emailId}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            defaultValue={email}
            disabled={busy}
            aria-invalid={state.errors?.email ? true : undefined}
            aria-describedby={state.errors?.email ? emailErrorId : undefined}
            className={`${fieldClass} ${fieldBorderClass(Boolean(state.errors?.email))}`}
          />
          <FieldError id={emailErrorId} message={state.errors?.email} />
        </div>

        <button
          type="submit"
          name="intent"
          value="email"
          disabled={busy}
          className={primaryButtonClass}
        >
          {pending ? (
            <>
              <SpinnerIcon />
              Checking…
            </>
          ) : (
            'Continue'
          )}
        </button>
      </form>
    </div>
  )
}

function Alert({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p
      role="alert"
      className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
    >
      {message}
    </p>
  )
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} className="text-sm text-red-600 dark:text-red-400">
      {message}
    </p>
  )
}

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 18 18" className="size-5">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z"
      />
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
    >
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
    >
      <path d="M9.9 5.7A9.7 9.7 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a16.5 16.5 0 0 1-2.9 3.7M6.4 6.4A16.4 16.4 0 0 0 2.5 12S6 18.5 12 18.5c1.9 0 3.5-.65 4.8-1.5" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
      <path d="M3 3l18 18" />
    </svg>
  )
}

function SpinnerIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="size-4 animate-spin"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="3"
        className="opacity-25"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}
