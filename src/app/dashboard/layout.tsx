import { requireProfile } from '@/lib/auth'
import { Sidebar } from '@/components/dashboard/sidebar'
import { TopBar } from '@/components/dashboard/topbar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireProfile()
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar profile={profile} />
        <main className="flex-1 p-8 lg:p-10 max-w-[1400px]">{children}</main>
      </div>
    </div>
  )
}
