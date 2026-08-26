import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Page not found',
}

export default function NotFound() {
  return (
    <main className="relative flex h-dvh flex-col items-center justify-center overflow-hidden bg-zinc-50 px-6 text-center dark:bg-black">
      {/* Oversized numeral sitting behind the copy, clipped by the viewport. */}
      <p
        aria-hidden="true"
        className="animate-auth-fade pointer-events-none absolute leading-none font-semibold tracking-tighter text-transparent select-none"
        style={{
          fontSize: 'clamp(11rem, 34vw, 26rem)',
          backgroundImage:
            'linear-gradient(180deg, var(--color-404), transparent)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        404
      </p>

      <div className="animate-auth-up relative flex w-full max-w-md flex-col items-center gap-6">
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
            This stop doesn&apos;t exist
          </h1>
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            The page you asked for isn&apos;t on the line. It may have moved, or
            the address might have a typo. Let&apos;s get you back on track.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/admin/dashboard"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white transition hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Back to dashboard
          </Link>
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-zinc-300 px-4 text-sm font-medium text-zinc-700 transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
          >
            Go home
          </Link>
        </div>
      </div>
    </main>
  )
}
