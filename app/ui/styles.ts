// Shared Tailwind class strings for the auth screens. Plain module so both
// Server and Client Components can import it without pulling in a component.

export const fieldClass =
  'w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-xs outline-none transition placeholder:text-zinc-400 focus-visible:ring-2 focus-visible:ring-indigo-500/40 disabled:opacity-60 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-600'

export const primaryButtonClass =
  'flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white transition hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:cursor-not-allowed disabled:opacity-70'

export const authLinkClass =
  'rounded-sm font-medium text-indigo-600 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:text-indigo-400'

export function fieldBorderClass(hasError: boolean) {
  return hasError
    ? 'border-red-500 focus-visible:border-red-500 dark:border-red-500'
    : 'border-zinc-300 focus-visible:border-indigo-500 dark:border-zinc-800 dark:focus-visible:border-indigo-500'
}
