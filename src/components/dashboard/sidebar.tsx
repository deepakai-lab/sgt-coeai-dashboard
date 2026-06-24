'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, FolderKanban, CheckSquare, CalendarDays, GraduationCap,
  FileText, MessageSquare, Activity, Users, ArrowUpRight, Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
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
    <aside className="w-64 shrink-0 border-r bg-card flex flex-col">
      <div className="px-5 py-5 border-b">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl brand-bg shadow-glow">
            <Sparkles className="h-4 w-4 text-white" />
          </span>
          <div className="leading-tight">
            <div className="font-semibold tracking-tight text-sm">CoE AI</div>
            <div className="text-[10px] text-muted-foreground -mt-0.5">Command Center</div>
          </div>
        </Link>
      </div>
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        <div className="px-2 pb-2 text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Workspace</div>
        {NAV.map(item => {
          const Icon = item.icon
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group relative flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-all',
                active
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
              )}
            >
              {active && <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 brand-bg rounded-full" />}
              <Icon className={cn('h-4 w-4 transition-transform', active && 'text-primary')} />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="border-t p-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between rounded-lg px-2.5 py-2 text-xs text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-colors"
        >
          <span>Public portal</span>
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
    </aside>
  )
}
