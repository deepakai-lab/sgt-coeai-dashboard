import Link from 'next/link'
import { Sparkles, ArrowUpRight } from 'lucide-react'

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/initiatives', label: 'Initiatives' },
  { href: '/projects', label: 'Projects' },
  { href: '/team', label: 'Team' },
  { href: '/resources', label: 'Resources' },
  { href: '/feedback', label: 'Feedback' }
]

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="glass sticky top-0 z-40 border-b">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg brand-bg shadow-glow">
              <Sparkles className="h-4 w-4 text-white" />
            </span>
            <div className="leading-tight">
              <div className="font-semibold tracking-tight text-sm">CoE AI</div>
              <div className="text-[10px] text-muted-foreground -mt-0.5">SGT University</div>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-0.5 text-sm">
            {NAV.map(n => (
              <Link
                key={n.href}
                href={n.href}
                className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors"
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/login"
            className="hidden md:inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Staff sign in <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="md:hidden border-t px-4 py-2 flex overflow-x-auto gap-1 text-sm">
          {NAV.map(n => (
            <Link key={n.href} href={n.href} className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent whitespace-nowrap">
              {n.label}
            </Link>
          ))}
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t mt-20">
        <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-md brand-bg">
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </span>
              <span className="font-semibold">Centre of Excellence for AI</span>
            </div>
            <p className="text-muted-foreground">
              SGT University — practical AI for teaching, research, operations and student development.
            </p>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Explore</div>
            <div className="flex flex-col gap-1.5">
              <Link href="/initiatives" className="hover:text-foreground text-muted-foreground">Initiatives</Link>
              <Link href="/projects" className="hover:text-foreground text-muted-foreground">Projects</Link>
              <Link href="/team" className="hover:text-foreground text-muted-foreground">Team</Link>
              <Link href="/resources" className="hover:text-foreground text-muted-foreground">Resources</Link>
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Get involved</div>
            <div className="flex flex-col gap-1.5">
              <Link href="/feedback" className="hover:text-foreground text-muted-foreground">Share feedback</Link>
              <Link href="/feedback" className="hover:text-foreground text-muted-foreground">Collaborate with us</Link>
              <Link href="/login" className="hover:text-foreground text-muted-foreground">Staff sign in</Link>
            </div>
          </div>
        </div>
        <div className="border-t">
          <div className="container mx-auto px-4 py-5 text-xs text-muted-foreground flex flex-col md:flex-row justify-between gap-2">
            <div>© {new Date().getFullYear()} Centre of Excellence for AI · SGT University</div>
            <div>Built for practical AI adoption, not for show.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
