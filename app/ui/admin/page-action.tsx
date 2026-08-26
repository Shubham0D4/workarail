'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

export type PageAction = { label: string; run: () => void }

const Ctx = createContext<{
  action: PageAction | null
  setAction: (a: PageAction | null) => void
}>({ action: null, setAction: () => {} })

/**
 * Lets a page put its primary action in the topbar, which lives in the layout
 * and can't otherwise reach page state.
 */
export function PageActionProvider({ children }: { children: ReactNode }) {
  const [action, setAction] = useState<PageAction | null>(null)
  const value = useMemo(() => ({ action, setAction }), [action])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function usePageActionValue() {
  return useContext(Ctx).action
}

/**
 * Register this page's topbar action. The handler is held in a ref so passing
 * a fresh closure each render doesn't re-register on every render.
 */
export function useRegisterPageAction(label: string, onRun: () => void) {
  const { setAction } = useContext(Ctx)
  const latest = useRef(onRun)

  useEffect(() => {
    latest.current = onRun
  })

  const run = useCallback(() => latest.current(), [])

  useEffect(() => {
    setAction({ label, run })
    return () => setAction(null)
  }, [label, run, setAction])
}
