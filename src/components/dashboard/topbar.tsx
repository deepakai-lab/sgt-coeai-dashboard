'use client'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import type { Profile } from '@/lib/auth'
import { ChevronDown, LogOut } from 'lucide-react'

export function TopBar({ profile, title }: { profile: Profile; title?: string }) {
  const initials = profile.full_name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()
  return (
    <header className="h-14 border-b border-border bg-background flex items-center justify-between px-6">
      <div className="flex items-center gap-3 flex-1">
        {title && <h1 className="text-sm text-muted-foreground">{title}</h1>}
      </div>
      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 px-2 h-9 hover:bg-accent">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-secondary text-foreground text-[10px] font-mono font-medium">{initials}</AvatarFallback>
              </Avatar>
              <div className="text-left leading-tight hidden sm:block">
                <div className="text-xs font-medium">{profile.full_name}</div>
                <div className="text-[10px] text-muted-foreground font-mono">{profile.email}</div>
              </div>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
            <DropdownMenuLabel className="font-normal">
              <div className="eyebrow">Signed in as</div>
              <div className="text-sm font-medium mt-1">{profile.full_name}</div>
              <div className="text-xs text-muted-foreground font-mono">{profile.email}</div>
              {profile.designation && (
                <div className="text-xs text-muted-foreground mt-1">{profile.designation}</div>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <form action="/auth/signout" method="post">
              <DropdownMenuItem asChild>
                <button type="submit" className="w-full text-left">
                  <LogOut className="h-3.5 w-3.5" /> Sign out
                </button>
              </DropdownMenuItem>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
