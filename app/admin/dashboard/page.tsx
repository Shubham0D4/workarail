import type { Metadata } from 'next'
import { dashboardStats } from '@/app/lib/admin-data'
import { HoursChart } from '@/app/ui/admin/hours-chart'
import { JobsTable } from '@/app/ui/admin/jobs-table'
import { StatTile } from '@/app/ui/admin/stat-tile'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'People, approvals and finance at a glance.',
}

// The title lives in the topbar (app/ui/admin/topbar.tsx).
export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats().map((stat) => (
          <StatTile key={stat.label} stat={stat} />
        ))}
      </div>

      <HoursChart />
      <JobsTable />
    </div>
  )
}
