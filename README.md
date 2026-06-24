# CoE AI Command Center — v1.0 Beta

Internal dashboard + public portal for the **Centre of Excellence for AI, SGT University**.

Built per `coe_ai_command_center_prd_v1_beta.md`.

---

## Two modes

The app runs in either **Demo Mode** (no backend, deploy-and-share) or **Real Mode** (Supabase-backed, fully functional).

| | Demo Mode | Real Mode |
|---|---|---|
| **Backend** | None | Supabase Postgres + Auth + Storage |
| **Data** | Realistic hardcoded sample data | Live database |
| **Auth** | Bypassed (anyone gets in) | Google OAuth, `@sgtuniversity.org` restricted |
| **Writes** | Show as saved but don't persist | Persist to Postgres |
| **File uploads** | Show as attached but don't store | Upload to Supabase Storage |
| **Cost** | ₹0 (Vercel Hobby) | ₹0 (Supabase Free + Vercel Hobby) |
| **Use when** | Showing to management, sharing a preview link | Real beta usage |

A purple banner at the top says **"Live demo — sample data, changes aren't saved"** so management knows what they're looking at.

---

## 🚀 Quick deploy to Vercel (Demo Mode)

For sharing with management. No Supabase needed.

### Option A — Vercel CLI (fastest)

```sh
npm install -g vercel
cd "CoE - AI Dashboard"
vercel
# When prompted for env vars, add only ONE:
#   NEXT_PUBLIC_DEMO_MODE = true
```

You'll get a URL like `https://coe-ai-dashboard.vercel.app` to share.

### Option B — GitHub + Vercel dashboard

1. Push this folder to a GitHub repo
2. Go to https://vercel.com/new → import the repo
3. Under **Environment Variables**, add only:
   ```
   NEXT_PUBLIC_DEMO_MODE=true
   ```
4. Click **Deploy**. ~60 seconds later you have a live URL.

That's it. No database, no auth setup, no Google OAuth. Just UI on real data shapes.

### What the demo shows

- **Public portal** (`/`) — full hero, 6 initiatives, 6 live published projects with detail pages, team page with 3 members, 4 public resources, working feedback form (shows success message, doesn't persist)
- **Dashboard** (`/dashboard`) — login page → "Enter demo dashboard" button → dashboard with 8 sample projects (mix of statuses, some published), 14 tasks (some overdue, some blocked), 4 MoMs with action items, 5 training modules, 6 documents, 4 feedback entries, full activity log
- All CRUD flows work visually — create/edit forms submit and redirect, but changes don't persist between page loads (intentional)

---

## Tech

- **Next.js 14** App Router + **TypeScript**
- **Tailwind CSS** + custom design tokens (violet/cyan brand gradient, Inter font)
- **shadcn/ui** primitives (hand-installed)
- **Supabase** — Postgres, Auth, Storage, RLS (when in Real Mode)
- **Zod** validation for forms

---

## Local development

```sh
npm install
cp .env.example .env.local
# Edit .env.local — leave NEXT_PUBLIC_DEMO_MODE=true for demo, or fill Supabase keys for real mode
npm run dev
```

Open http://localhost:3000

---

## Real Mode setup (when Supabase quota is available)

### 1. Supabase project (free tier is enough)

1. Go to https://supabase.com → New project
2. Project Settings → API → copy the three values
3. SQL Editor → paste `supabase/migrations/0001_init.sql` → Run
4. Auth → Providers → Google → enable (paste your Google OAuth client ID + secret)

### 2. Environment variables

```env
NEXT_PUBLIC_DEMO_MODE=false
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
ALLOWED_EMAIL_DOMAIN=sgtuniversity.org
```

### 3. First sign-in, then seed

```sh
npm run dev
```

- Visit `/dashboard`, sign in with `deepak.ai@sgtuniversity.org`
- This creates your `profiles` row via the `handle_new_user` trigger
- Now in Supabase SQL Editor, paste `supabase/seed.sql` → Run. This enriches your profile and adds sample data.

### 4. Deploy

```sh
vercel
# Add all the env vars above
```

---

## Project structure

```
src/
  app/
    (public)/          # Public portal — no auth
      page.tsx               # / — hero with mesh gradient
      about/, team/, initiatives/, projects/, resources/, feedback/
    dashboard/         # Internal dashboard — auth required (bypassed in demo)
      page.tsx               # Greeting hero + 10 stat cards + distributions + activity
      projects/, tasks/, meetings/, training/, documents/, feedback/, activity/, team/
    auth/              # OAuth callback + sign-out (real mode)
    login/             # /login (skipped in demo, but routable)
  components/
    ui/                # shadcn primitives (button, card, dialog, table, …)
    dashboard/         # sidebar, topbar, page-header, empty-state
    badges.tsx         # status/priority/visibility chips with dots
    file-upload.tsx    # client uploader → Supabase Storage (no-op in demo)
    demo-banner.tsx    # Purple banner shown in demo mode
  lib/
    supabase/{server,client,middleware,demo-client}.ts
    auth.ts            # session/profile helpers (returns demo user in demo)
    activity.ts        # activity_logs writer
    constants.ts       # enums mirrored from SQL
    db-types.ts        # hand-written DB types
    demo-data.ts       # ★ realistic sample data for demo mode
    utils.ts
  middleware.ts        # route guard + domain enforcement (bypassed in demo)
supabase/
  migrations/0001_init.sql   # 9 tables, enums, triggers, views, RLS, buckets
  seed.sql                   # demo data for real-mode Supabase
```

---

## Architecture decisions

### Demo mode
A fake Supabase client (`src/lib/supabase/demo-client.ts`) mocks the query builder API and returns rows from `src/lib/demo-data.ts`. When `NEXT_PUBLIC_DEMO_MODE=true`, the real `createClient()` returns this fake. Pages don't know the difference — they just call `supabase.from('projects').select(...).order(...)` and get sample data back. Auth checks return a hardcoded "Deepak Meena" profile.

### Internal vs public separation (Real Mode)
Enforced **three ways**:
1. **Separate fields** on `projects` — `internal_description` vs `public_description`, etc.
2. **A Postgres VIEW** `public_projects` that exposes only safe columns. Public portal reads only the view.
3. **Two storage buckets** — `documents-public` vs `documents-private` with signed URLs.

### Single-role model
PRD's 4-role matrix simplified to one internal role per user direction. Activity log captures who did what for accountability. `is_active` flag on profiles is the kill-switch.

### Soft delete
All operational tables have `deleted_at`. RLS denies hard deletes from clients. Partial unique indexes on `slug`/`email` allow soft-deleted rows.

### Convert action item → task
Idempotent via `.is('task_id', null)` guard — concurrent double-clicks can't create two tasks.

---

## What's not built (intentional)

Per PRD §6.2:
- AI-generated MoMs, chatbot, project scoring, deep analytics
- Department-wise login for all 19 colleges, student/faculty logins
- Mobile app, WhatsApp, complex email notifications

Per user simplification:
- Multi-role permissions matrix
- "Pending Approval" gate as an *enforced* workflow (kept as a status only)

See `PRD_AUDIT.md` for the line-by-line audit.

---

## Test checklist (Demo Mode)

Before sharing the Vercel link:

- [ ] Open the deployed URL — purple demo banner visible at top
- [ ] Public home shows hero, 6 initiatives, 3 featured projects
- [ ] `/projects` shows 6 published projects with status badges
- [ ] Click a project — detail page loads
- [ ] `/team` shows 3 members
- [ ] `/resources` shows public docs + training
- [ ] Submit `/feedback` → success message appears
- [ ] Click "Staff sign in" → login page says "Preview the dashboard"
- [ ] Click "Enter demo dashboard" → lands at `/dashboard`
- [ ] Sidebar navigation works for all 9 sections
- [ ] Stat cards on home show realistic numbers
- [ ] `/dashboard/projects` shows 8 projects
- [ ] Click a project → detail page with linked tasks/meetings/docs
- [ ] `/dashboard/tasks` — see "My tasks", "Overdue" filters
- [ ] `/dashboard/meetings/<any>` — see action items panel
- [ ] `/dashboard/activity` — see 10 activity events
- [ ] All charts and badges render correctly

---

## See also

- [PRD_AUDIT.md](PRD_AUDIT.md) — what's implemented vs PRD, line by line
- [coe_ai_command_center_prd_v1_beta.md](../Downloads/coe_ai_command_center_prd_v1_beta.md) — source PRD
