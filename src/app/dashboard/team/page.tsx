import { createClient } from '@/lib/supabase/server'
import { requireProfile } from '@/lib/auth'
import { PageHeader } from '@/components/dashboard/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { TeamMemberCard } from './member-card'

export const dynamic = 'force-dynamic'

export default async function TeamPage() {
  const profile = await requireProfile()
  const supabase = createClient()
  const { data: members } = await supabase.from('profiles').select('*').order('full_name')

  return (
    <>
      <PageHeader
        title="Team"
        description="Manage who appears on the public Team page. Profiles are auto-created on first Google sign-in."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(members ?? []).map(m => (
          <TeamMemberCard key={m.id} member={m} isSelf={m.id === profile.id} />
        ))}
      </div>
    </>
  )
}
