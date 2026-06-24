'use client'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import type { Profile } from '@/lib/auth'
import { ChevronDown, LogOut, Search } from 'lucide-react'

export function TopBar({ profile, title }: { profile: Profile; title?: string }) {
  const initials = profile.full_name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()
  return (
    <header className="h-16 border-b glass sticky top-0 z-30 flex items-center justify-between px-6">
      <div className="flex items-center gap-3 flex-1">
        {title && <h1 className="text-sm font-medium text-muted-foreground">{title}</h1>}
      </div>
      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 px-2 h-10 hover:bg-accent">
              <Avatar className="h-8 w-8 ring-2 ring-primary/10">
                <AvatarFallback className="brand-bg text-white text-xs font-semibold">{initials}</AvatarFallback>
              </Avatar>
              <div className="text-left leading-tight hidden sm:block">
                <div className="text-xs font-medium">{profile.full_name}</div>
                <div className="text-[10px] text-muted-foreground">{profile.email}</div>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
            <DropdownMenuLabel className="font-normal">
              <div className="text-xs text-muted-foreground">Signed in as</div>
              <div className="text-sm font-medium mt-0.5">{profile.full_name}</div>
              <div className="text-xs text-muted-foreground">{profile.email}</div>
              {profile.designation && (
                <div className="text-xs text-primary mt-1">{profile.designation}</div>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <form action="/auth/signout" method="post">
              <DropdownMenuItem asChild>
                <button type="submit" className="w-full text-left">
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </DropdownMenuItem>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
