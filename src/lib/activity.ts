import { createServiceClient } from '@/lib/supabase/server'
import type { Profile } from '@/lib/auth'

export async function logActivity(
  actor: Pick<Profile, 'id' | 'email'> | null,
  action: string,
  entity_type: string,
  entity_id: string | null,
  entity_label: string | null,
  metadata: Record<string, unknown> = {}
) {
  const supabase = createServiceClient()
  await supabase.from('activity_logs').insert({
    user_id: actor?.id ?? null,
    user_email: actor?.email ?? null,
    action,
    entity_type,
    entity_id,
    entity_label,
    metadata
  })
}
