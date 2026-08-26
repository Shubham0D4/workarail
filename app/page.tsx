import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 bg-zinc-50 px-6 py-24 text-center dark:bg-black">
      <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        Work à Rail
      </h1>
      <p className="max-w-md text-zinc-600 dark:text-zinc-400">
        Sign in to get started.
      </p>
      <Link
        href="/signin"
        className="flex h-11 items-center rounded-lg bg-indigo-600 px-6 text-sm font-medium text-white transition hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
      >
        Sign in
      </Link>
    </main>
  )
}
