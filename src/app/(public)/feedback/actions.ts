'use server'
import { z } from 'zod'
import { headers } from 'next/headers'
import { createServiceClient } from '@/lib/supabase/server'
import { IS_DEMO } from '@/lib/demo-data'
import { FEEDBACK_CATEGORIES } from '@/lib/constants'

const Schema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(200),
  role: z.string().max(80).optional().nullable(),
  department_or_org: z.string().max(120).optional().nullable(),
  category: z.enum(FEEDBACK_CATEGORIES),
  message: z.string().min(5).max(5000),
  consent: z.string().optional(),
  website: z.string().max(0).optional() // honeypot
})

export async function submitFeedback(formData: FormData): Promise<{ ok?: true; error?: string }> {
  const raw: Record<string, string> = {}
  for (const [k, v] of formData.entries()) raw[k] = String(v)

  const parsed = Schema.safeParse(raw)
  if (!parsed.success) return { error: 'Please check the form and try again.' }
  if (parsed.data.website) return { ok: true } // honeypot tripped — silently succeed
  if (!parsed.data.consent) return { error: 'Please confirm consent to send.' }

  if (IS_DEMO) return { ok: true }

  const ip = headers().get('x-forwarded-for')?.split(',')[0]?.trim() || null

  const supabase = createServiceClient()
  const { error } = await supabase.from('feedback').insert({
    name: parsed.data.name,
    email: parsed.data.email,
    role: parsed.data.role || null,
    department_or_org: parsed.data.department_or_org || null,
    category: parsed.data.category,
    message: parsed.data.message,
    source_ip: ip
  })
  if (error) return { error: 'Could not send right now. Please try again later.' }
  return { ok: true }
}
