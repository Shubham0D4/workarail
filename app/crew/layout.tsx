import { CrewTopNav } from '@/app/ui/crew/top-nav'

export default function CrewLayout({ children }: LayoutProps<'/crew'>) {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50">
      <CrewTopNav />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        {children}
      </main>
    </div>
  )
}
