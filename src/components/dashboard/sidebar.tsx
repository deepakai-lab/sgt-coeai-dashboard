'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, FolderKanban, CheckSquare, CalendarDays, GraduationCap,
  FileText, MessageSquare, Activity, Users, ArrowUpRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/projects', label: 'Projects', icon: FolderKanban },
  { href: '/dashboard/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/dashboard/meetings', label: 'Meetings', icon: CalendarDays },
  { href: '/dashboard/training', label: 'Training', icon: GraduationCap },
  { href: '/dashboard/documents', label: 'Documents', icon: FileText },
  { href: '/dashboard/feedback', label: 'Feedback', icon: MessageSquare },
  { href: '/dashboard/team', label: 'Team', icon: Users },
  { href: '/dashboard/activity', label: 'Activity', icon: Activity }
]

export function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="w-60 shrink-0 border-r border-border bg-card flex flex-col">
      <div className="px-5 h-14 border-b border-border flex items-center">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border bg-background">
            <span className="font-mono text-[10px] font-medium tracking-tighter">CoE</span>
          </span>
          <div className="leading-none">
            <div className="text-[13px] font-medium tracking-tight">Command Center</div>
            <div className="text-[10px] text-muted-foreground mt-0.5 font-mono uppercase tracking-wider">v1.0 beta</div>
          </div>
        </Link>
      </div>
      <nav className="flex-1 p-2 overflow-y-auto">
        <div className="px-2 pt-3 pb-2 eyebrow">Workspace</div>
        <div className="space-y-px">
          {NAV.map(item => {
            const Icon = item.icon
            const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] transition-colors',
                  active
                    ? 'bg-accent text-foreground'
                    : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                )}
              >
                <Icon className="h-3.5 w-3.5 stroke-[1.5]" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
      <div className="border-t border-border p-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-colors"
        >
          <span>Public portal</span>
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
    </aside>
  )
}
