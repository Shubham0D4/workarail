import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { LogoMark } from '@/app/ui/logo-mark'

/** Split layout used by every auth screen: cover art left, form right. */
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string
  subtitle: string
  children: ReactNode
  footer?: ReactNode
}) {
  return (
    <main className="flex h-dvh flex-col overflow-hidden lg:grid lg:grid-cols-[1fr_minmax(320px,35%)]">
      {/* Left: cover photo (Pexels, free licence). Swap public/auth-cover.jpg
          for your own artwork. */}
      <div className="relative hidden overflow-hidden bg-indigo-950 lg:block">
        <Image
          src="/auth-cover.webp"
          alt=""
          fill
          priority
          sizes="65vw"
          className="animate-auth-zoom object-cover"
        />
        <div className="animate-auth-fade absolute inset-0 bg-gradient-to-t from-indigo-950/80 via-indigo-950/10 to-transparent" />
        <div className="animate-auth-up absolute inset-x-0 bottom-0 p-10 [animation-delay:200ms] xl:p-14">
          <blockquote className="max-w-md text-balance text-2xl font-medium leading-snug tracking-tight text-white">
            Every job, every crew, every hour. All on one rail.
          </blockquote>
          <p className="mt-3 text-sm text-indigo-200">Work à Rail</p>
        </div>
      </div>

      {/* Right: the form. */}
      <div className="flex flex-1 flex-col overflow-y-auto bg-zinc-50 px-6 py-12 xl:px-10 dark:bg-black">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <div className="animate-auth-up mb-8 flex flex-col items-center gap-4 text-center lg:items-start lg:text-left">
              <Link
                href="/"
                aria-label="Work à Rail home"
                className="rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-500"
              >
                <LogoMark className="size-10 text-indigo-600 dark:text-indigo-400" />
              </Link>
              <div className="flex flex-col gap-1.5">
                <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                  {title}
                </h1>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {subtitle}
                </p>
              </div>
            </div>

            <div className="animate-auth-up [animation-delay:90ms]">{children}</div>

            {footer ? (
              <p className="mt-8 text-center text-sm text-zinc-600 lg:text-left dark:text-zinc-400">
                {footer}
              </p>
            ) : null}
          </div>
        </div>

        {/* Server Component, so the year is evaluated once on the server —
            no client re-render, no hydration mismatch. */}
        <p className="animate-auth-fade mt-8 shrink-0 text-center text-xs text-zinc-500 [animation-delay:220ms] dark:text-zinc-500">
          © {new Date().getFullYear()} Work à Rail. All rights reserved.
        </p>
      </div>
    </main>
  )
}
