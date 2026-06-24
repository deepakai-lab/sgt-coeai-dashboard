'use client'
import { useState, useTransition } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FileUpload } from '@/components/file-upload'
import { useToast } from '@/components/ui/use-toast'
import { updateProfile } from './actions'

export function TeamMemberCard({ member, isSelf }: { member: any; isSelf: boolean }) {
  const [open, setOpen] = useState(false)
  const [isPending, start] = useTransition()
  const { toast } = useToast()
  const initials = (member.full_name || '').split(' ').map((p: string) => p[0]).slice(0,2).join('').toUpperCase()

  async function save(fd: FormData) {
    start(async () => {
      const r = await updateProfile(member.id, fd)
      if (r?.error) toast({ title: 'Error', description: r.error, variant: 'destructive' })
      else { toast({ title: 'Saved' }); setOpen(false) }
    })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3 pb-3">
        <Avatar className="h-12 w-12">
          {member.public_photo_url && <AvatarImage src={member.public_photo_url} alt={member.full_name} />}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <CardTitle className="text-base truncate">{member.full_name} {isSelf && <span className="text-xs text-muted-foreground font-normal">(you)</span>}</CardTitle>
          <p className="text-xs text-muted-foreground truncate">{member.email}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex flex-wrap gap-1.5">
          {member.show_on_public_team && <Badge variant="success">Public</Badge>}
          {!member.is_active && <Badge variant="muted">Inactive</Badge>}
        </div>
        <div className="text-xs text-muted-foreground">
          {member.designation || 'Member'}{member.department ? ` · ${member.department}` : ''}
        </div>
        {member.public_bio && <p className="text-xs">{member.public_bio}</p>}
        <Button size="sm" variant="outline" onClick={() => setOpen(o => !o)}>{open ? 'Cancel' : 'Edit'}</Button>
        {open && (
          <form action={save} className="space-y-3 pt-2 border-t">
            <Field label="Name *"><Input name="full_name" defaultValue={member.full_name} required /></Field>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Designation"><Input name="designation" defaultValue={member.designation ?? ''} /></Field>
              <Field label="Department"><Input name="department" defaultValue={member.department ?? ''} /></Field>
            </div>
            <Field label="Public bio"><Textarea name="public_bio" defaultValue={member.public_bio ?? ''} rows={3} /></Field>
            <Field label="Public photo (square works best)">
              <FileUpload name="public_photo_url" bucket="public-assets" defaultUrl={member.public_photo_url} accept="image/*" />
            </Field>
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" name="show_on_public_team" defaultChecked={member.show_on_public_team} />
              Show this person on the public Team page
            </label>
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" name="is_active" defaultChecked={member.is_active} />
              Active (can sign in and use the dashboard)
            </label>
            <Button type="submit" size="sm" disabled={isPending}>{isPending ? 'Saving…' : 'Save'}</Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><Label className="text-xs mb-1 block">{label}</Label>{children}</div>
}
