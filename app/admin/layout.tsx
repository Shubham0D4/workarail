import { redirect } from 'next/navigation'
import { auth } from '@/app/lib/auth'
import { headers } from 'next/headers'
import { checkIsStaff } from '@/app/actions/auth'
import { getPendingCounts } from '@/app/actions/admin'
import { PageActionProvider } from '@/app/ui/admin/page-action'
import { AdminSidebar } from '@/app/ui/admin/sidebar'
import { SmallScreenNotice } from '@/app/ui/admin/small-screen-notice'
import { AdminTopbar } from '@/app/ui/admin/topbar'

const RAIL = 'w-64'

export default async function AdminLayout({ children }: LayoutProps<'/admin'>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  
  if (!session || !session.user) {
    redirect('/signin')
  }

  const isStaff = await checkIsStaff(session.user.email)
  if (isStaff) {
    redirect('/crew')
  }

  const user = {
    ...session.user,
    avatarUrl: session.user.image,
  }

  const { pendingLeaves, pendingExpenses } = await getPendingCounts()

  return (
    <>
      {/* Below lg the office is gated — see SmallScreenNotice. */}
      <SmallScreenNotice />

      <div className="hidden flex-1 flex-col bg-zinc-50 lg:flex dark:bg-black">
        {/* Flush rail, pinned to the viewport edges. */}
        <aside
          className={`lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:block ${RAIL}`}
        >
          <AdminSidebar
            user={user}
            pendingLeaves={pendingLeaves}
            pendingExpenses={pendingExpenses}
          />
        </aside>

        <PageActionProvider>
          <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
            <AdminTopbar />
            <main className="flex-1 px-4 py-5 lg:px-8 lg:py-8">{children}</main>
          </div>
        </PageActionProvider>
      </div>
    </>
  )
}

