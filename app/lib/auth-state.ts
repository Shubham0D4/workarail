// Plain module (no 'use server'): a Server Actions file may only export async
// functions, so the shared types and the initial state live here instead.

export type SignInStep = 'email' | 'password'

export type SignInState = {
  /** Which step of the sign-in flow to render. */
  step: SignInStep
  /** Field-level validation errors, keyed by input name. */
  errors?: {
    email?: string
    password?: string
  }
  /** Form-level error, e.g. rejected credentials. */
  message?: string
  /** Carried across steps so the email survives the round trip. */
  values?: {
    email?: string
    remember?: boolean
  }
}

export const initialSignInState: SignInState = { step: 'email' }

export type ResetStatus = 'idle' | 'sent'

export type ResetState = {
  /** 'sent' swaps the form for the confirmation panel. */
  status: ResetStatus
  /** Validation or form-level error. */
  error?: string
  values?: {
    email?: string
  }
}

export const initialResetState: ResetState = { status: 'idle' }

export type PasswordResetState = {
  error?: string
  success?: boolean
  values?: {
    password?: string
    confirmPassword?: string
  }
}

export const initialPasswordResetState: PasswordResetState = {}
