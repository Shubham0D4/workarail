'use client'

import Link from 'next/link'
import { useActionState, useId } from 'react'
import { requestPasswordReset } from '@/app/actions/auth'
import { initialResetState } from '@/app/lib/auth-state'
import {
  authLinkClass,
  fieldBorderClass,
  fieldClass,
  primaryButtonClass,
} from '@/app/ui/styles'

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(
    requestPasswordReset,
    initialResetState
  )

  const emailId = useId()
  const errorId = `${emailId}-error`
  const email = state.values?.email ?? ''

  // Sent: swap the form for a confirmation. Deliberately phrased so it reads the
  // same whether or not an account exists for the address.
  if (state.status === 'sent') {
    return (
      <div className="animate-auth-up flex flex-col gap-5">
        <div className="flex flex-col gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/40">
          <div className="flex items-center gap-2 text-sm font-medium text-emerald-800 dark:text-emerald-300">
            <CheckIcon />
            Check your inbox
          </div>
          <p className="text-sm text-emerald-800/90 dark:text-emerald-300/90">
            If an account exists for{' '}
            <span className="font-medium break-all">{email}</span>, we&apos;ve
            sent a link to reset the password. The link expires in an hour.
          </p>
        </div>

        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Didn&apos;t get it? Check your spam folder, or{' '}
          <Link href="/forgot-password" className={authLinkClass}>
            try another address
          </Link>
          .
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} noValidate className="animate-auth-up flex flex-col gap-5">
      {state.error ? (
        <p
          id={errorId}
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
        >
          {state.error}
        </p>
      ) : null}

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
          autoFocus
          disabled={pending}
          aria-invalid={state.error ? true : undefined}
          aria-describedby={state.error ? errorId : undefined}
          className={`${fieldClass} ${fieldBorderClass(Boolean(state.error))}`}
        />
      </div>

      <button type="submit" disabled={pending} className={primaryButtonClass}>
        {pending ? (
          <>
            <SpinnerIcon />
            Sending…
          </>
        ) : (
          'Send reset link'
        )}
      </button>
    </form>
  )
}

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4 shrink-0"
    >
      <path d="M20 6 9 17l-5-5" />
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
