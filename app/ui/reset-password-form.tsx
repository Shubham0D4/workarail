'use client'

import { useActionState, useId, useState } from 'react'
import { resetPassword } from '@/app/actions/auth'
import { initialPasswordResetState } from '@/app/lib/auth-state'
import {
  fieldBorderClass,
  fieldClass,
  primaryButtonClass,
} from '@/app/ui/styles'

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState(
    resetPassword,
    initialPasswordResetState
  )
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const passwordId = useId()
  const confirmPasswordId = useId()
  const errorId = `${passwordId}-error`

  return (
    <form action={formAction} noValidate className="animate-auth-up flex flex-col gap-5">
      <input type="hidden" name="token" value={token} />

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
          htmlFor={passwordId}
          className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
        >
          New password
        </label>
        <div className="relative">
          <input
            id={passwordId}
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            disabled={pending}
            className={`${fieldClass} pr-11 ${fieldBorderClass(Boolean(state.error))}`}
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
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={confirmPasswordId}
          className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
        >
          Confirm new password
        </label>
        <div className="relative">
          <input
            id={confirmPasswordId}
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="••••••••"
            disabled={pending}
            className={`${fieldClass} pr-11 ${fieldBorderClass(Boolean(state.error))}`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((shown) => !shown)}
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            aria-pressed={showConfirmPassword}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg text-zinc-500 transition hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:text-zinc-500 dark:hover:text-zinc-100"
          >
            {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
      </div>

      <button type="submit" disabled={pending} className={primaryButtonClass}>
        {pending ? (
          <>
            <SpinnerIcon />
            Updating password…
          </>
        ) : (
          'Update password'
        )}
      </button>
    </form>
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
