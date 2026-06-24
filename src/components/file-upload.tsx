'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Upload, X } from 'lucide-react'

const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

type Props = {
  name: string                          // hidden input name (so it submits with the form)
  bucket: 'documents-public' | 'documents-private' | 'training-public' | 'training-private' | 'public-assets'
  defaultUrl?: string | null
  accept?: string
}

export function FileUpload({ name, bucket, defaultUrl, accept }: Props) {
  const [url, setUrl] = useState<string>(defaultUrl ?? '')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true); setError(null)
    if (IS_DEMO) {
      // Pretend upload — show a placeholder URL so the UI shows "file attached"
      setTimeout(() => {
        setUrl(`https://placehold.co/600x400/8b5cf6/white?text=${encodeURIComponent(file.name)}`)
        setUploading(false)
      }, 400)
      return
    }
    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop() ?? 'bin'
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 80)
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`
      const { error: upErr } = await supabase.storage.from(bucket).upload(path, file, { upsert: false })
      if (upErr) throw upErr
      const isPublicBucket = bucket.includes('public')
      if (isPublicBucket) {
        const { data } = supabase.storage.from(bucket).getPublicUrl(path)
        setUrl(data.publicUrl)
      } else {
        const { data, error: signErr } = await supabase.storage.from(bucket).createSignedUrl(path, 60 * 60 * 24 * 365)
        if (signErr) throw signErr
        setUrl(data.signedUrl)
      }
    } catch (e: any) {
      setError(e?.message ?? 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <input type="hidden" name={name} value={url} />
      <div className="flex items-center gap-2">
        <label className="flex-1">
          <Input type="file" accept={accept} onChange={onFile} disabled={uploading} />
        </label>
        {uploading && <span className="text-xs text-muted-foreground">Uploading…</span>}
      </div>
      {url && (
        <div className="flex items-center gap-2 text-xs">
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary underline truncate flex-1">{url}</a>
          <Button type="button" variant="ghost" size="sm" onClick={() => setUrl('')}>
            <X className="h-3 w-3" /> remove
          </Button>
        </div>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
