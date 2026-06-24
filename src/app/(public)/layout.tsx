import Link from 'next/link'

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
      <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-14 px-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border bg-card text-foreground">
              <span className="font-mono text-[11px] font-medium tracking-tighter">CoE</span>
            </span>
            <div className="leading-none">
              <div className="text-[13px] font-medium tracking-tight">Centre of Excellence for AI</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">SGT University</div>
            </div>
          </Link>
          <nav className="hidden md:flex items-center text-sm">
            {NAV.map(n => (
              <Link
                key={n.href}
                href={n.href}
                className="px-3 py-1.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/login"
            className="hidden md:inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="dot dot-live" /> Staff sign in
          </Link>
        </div>
        <div className="md:hidden border-t border-border px-4 py-2 flex overflow-x-auto gap-1 text-sm">
          {NAV.map(n => (
            <Link key={n.href} href={n.href} className="px-3 py-1.5 text-muted-foreground hover:text-foreground whitespace-nowrap">
              {n.label}
            </Link>
          ))}
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border mt-24">
        <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-border bg-card">
                <span className="font-mono text-[10px]">CoE</span>
              </span>
              <span className="font-medium tracking-tight">Centre of Excellence for AI</span>
            </div>
            <p className="text-muted-foreground max-w-md leading-relaxed">
              Practical AI for teaching, research, operations, and student development at SGT University.
            </p>
          </div>
          <div>
            <div className="eyebrow mb-3">Explore</div>
            <div className="flex flex-col gap-2">
              <Link href="/initiatives" className="hover:text-foreground text-muted-foreground">Initiatives</Link>
              <Link href="/projects" className="hover:text-foreground text-muted-foreground">Projects</Link>
              <Link href="/team" className="hover:text-foreground text-muted-foreground">Team</Link>
              <Link href="/resources" className="hover:text-foreground text-muted-foreground">Resources</Link>
            </div>
          </div>
          <div>
            <div className="eyebrow mb-3">Connect</div>
            <div className="flex flex-col gap-2">
              <Link href="/feedback" className="hover:text-foreground text-muted-foreground">Share feedback</Link>
              <Link href="/feedback" className="hover:text-foreground text-muted-foreground">Collaborate</Link>
              <Link href="/login" className="hover:text-foreground text-muted-foreground">Staff portal</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-border">
          <div className="container mx-auto px-4 py-5 text-xs text-muted-foreground flex flex-col md:flex-row justify-between gap-2">
            <div>© {new Date().getFullYear()} Centre of Excellence for AI · SGT University</div>
            <div className="font-mono text-[10px] tracking-wide">v1.0 BETA</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
