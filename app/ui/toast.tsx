'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

type Variant = 'success' | 'error' | 'info'
type Toast = { id: number; message: string; variant: Variant }

const DURATION = 4000

const Ctx = createContext<{
  toast: (message: string, variant?: Variant) => void
}>({ toast: () => {} })

export function useToast() {
  return useContext(Ctx).toast
}

/**
 * App-wide toasts, pinned bottom-right. Mounted once in the root layout so any
 * page can raise one without threading props through the tree.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([])
  // A counter rather than Date.now(), so ids stay deterministic.
  const nextId = useRef(0)

  const dismiss = useCallback((id: number) => {
    setItems((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback(
    (message: string, variant: Variant = 'success') => {
      const id = ++nextId.current
      setItems((prev) => [...prev, { id, message, variant }])
      window.setTimeout(() => dismiss(id), DURATION)
    },
    [dismiss]
  )

  const value = useMemo(() => ({ toast }), [toast])

  return (
    <Ctx.Provider value={value}>
      {children}

      {/* Polite live region: announced without interrupting, and the stack
          sits above dialogs so a toast raised from one is still visible. */}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed right-4 bottom-4 z-[100] flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2"
      >
        {items.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </Ctx.Provider>
  )
}

const STYLES: Record<Variant, { ring: string; icon: ReactNode }> = {
  success: {
    ring: 'border-[#0ca30c]/30',
    icon: (
      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#0ca30c]/12 text-[#006300]">
        <Glyph d="m5 12.5 4.5 4.5L19 7" />
      </span>
    ),
  },
  error: {
    ring: 'border-[#d03b3b]/30',
    icon: (
      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#d03b3b]/12 text-[#b02c2c]">
        <Glyph d="M12 7.5v5M12 16h.01" />
      </span>
    ),
  },
  info: {
    ring: 'border-indigo-200',
    icon: (
      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
        <Glyph d="M12 11v5.5M12 7.5h.01" />
      </span>
    ),
  },
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast
  onDismiss: () => void
}) {
  const s = STYLES[toast.variant]
  return (
    <div
      role={toast.variant === 'error' ? 'alert' : 'status'}
      className={`animate-toast-in pointer-events-auto flex items-start gap-2.5 rounded-lg border bg-white px-3.5 py-3 shadow-lg ${s.ring}`}
    >
      {s.icon}
      <p className="min-w-0 flex-1 text-sm text-zinc-800">{toast.message}</p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="-mt-0.5 -mr-1 shrink-0 rounded-md p-1 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
      >
        <Glyph d="M6 6l12 12M18 6L6 18" />
      </button>
    </div>
  )
}

function Glyph({ d }: { d: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-3.5"
    >
      <path d={d} />
    </svg>
  )
}
