# PRD Audit — CoE AI Command Center v1.0 Beta

Audited against `coe_ai_command_center_prd_v1_beta.md`.

Legend: ✅ implemented · 🟡 partial · ❌ not implemented · ⚠️ risk

---

## §4 Target users & roles

| PRD requirement | Status | Notes |
|---|---|---|
| Super Admin / Admin / Team Member / Viewer / Public | 🟡 | **Simplified per user direction** to one internal role ("member") + Public. All internal users can perform all internal operations. Schema retains `is_active` for kill-switching. |
| Public users | ✅ | Anon access to portal only. |

## §5 Product principle (internal-by-default, explicit publish)

| | Status | Notes |
|---|---|---|
| Separate internal/public fields on projects | ✅ | `internal_description`, `internal_notes` vs `public_description`, `public_impact_statement`. |
| Approval flow super_admin → published | 🟡 | Status enum retained (`Pending Approval`, `Published`…) but enforced approval gate removed with role simplification. Any logged-in member can publish. ⚠️ |
| Public portal never sees internal fields | ✅ | `public_projects` Postgres view exposes only 7 safe columns; portal queries the view. |

## §6.1 Included in v1.0

| | Status |
|---|---|
| 1. Internal login | ✅ Google OAuth + `@sgtuniversity.org` middleware gate |
| 2. Role-based dashboard | 🟡 Role model simplified (see §4) |
| 3. Project tracker | ✅ List + filters + create/edit + detail + soft delete + publish |
| 4. Task tracker | ✅ List + My Tasks + Overdue view + filters + create/edit + quick status |
| 5. MoM tracker | ✅ Full incl. action items + convert-to-task (idempotent) |
| 6. Training repo | ✅ Full incl. upload to Storage |
| 7. Document repo | ✅ Full incl. upload to public/private buckets |
| 8. Public portal | ✅ 7 pages (Home/About/Team/Initiatives/Projects/Resources/Feedback) |
| 9. Public feedback form | ✅ + honeypot + IP capture |
| 10. Admin feedback management | ✅ Inbox with inline status/assign/notes |
| 11. Public/private visibility control | ✅ Per-project enum + view + bucket split |
| 12. Basic dashboard analytics | ✅ Counters + status/priority summaries |
| 13. Search and filters | 🟡 Per-section search + filters. **Global search across all entities NOT built** (PRD §18). |
| 14. Activity log | ✅ Writer + viewer page |

## §6.2 NOT in v1.0 (verified not built — correct)

| | Status |
|---|---|
| AI-generated MoMs | ❌ Correctly omitted |
| AI chatbot | ❌ Correctly omitted |
| Automated project scoring | ❌ Correctly omitted |
| Complex reporting | ❌ Correctly omitted |
| Department-wise login (19 colleges) | ❌ Correctly omitted |
| Student / faculty logins | ❌ Correctly omitted |
| Payment system | ❌ Correctly omitted |
| Mobile app | ❌ Correctly omitted |
| Deep analytics | ❌ Correctly omitted |
| WhatsApp integration | ❌ Correctly omitted |
| Complex email notifications | ❌ Correctly omitted |

## §7 Tech stack

| | Status |
|---|---|
| Next.js | ✅ 14 App Router |
| Tailwind CSS | ✅ |
| shadcn/ui | ✅ Hand-installed (path with spaces broke the CLI) |
| Supabase Auth/DB/Storage/RLS/roles | ✅ All used |
| Vercel + Supabase deployment | 🟡 Vercel-ready. **Currently local-only** per user direction. |

## §8 Security

| | Status |
|---|---|
| Login required for internal | ✅ middleware redirects unauth /dashboard → /login |
| Only approved domain | ✅ Middleware + auth callback both check `@sgtuniversity.org` |
| Every internal user has a role | 🟡 Single role; `is_active` flag exists |
| Public users blocked from internal routes | ✅ Middleware |
| Private docs not exposed publicly | ✅ Bucket split + RLS |
| Public content requires approval | 🟡 Enum exists, approval enforcement removed with role simplification ⚠️ |
| Soft delete | ✅ All operational tables, RLS denies hard delete |
| Important actions logged | ✅ Server actions write to `activity_logs` |

### §8.3 Sensitive actions requiring Super Admin
All ⚠️ — no role distinction enforced. Any member can delete projects, publish/unpublish, etc. Activity log captures the actor for accountability.

## §9 Modules

| Module | Status |
|---|---|
| 1. Internal dashboard home | ✅ 10 counter cards, status/priority summaries, recent activity, recent meetings |
| 2. Projects tracker (all fields, types, statuses, visibility) | ✅ |
| 3. Task tracker (all fields, statuses, views) | ✅ |
| 4. MoM tracker (all fields, types, action items, convert-to-task) | ✅ |
| 5. Training module repository | ✅ |
| 6. Document repository | ✅ |
| 7. Public portal (7 pages) | ✅ |
| 8. Feedback management | ✅ |
| 9. Activity log | ✅ |

## §10 Navigation

| Internal route | Status |
|---|---|
| /dashboard | ✅ |
| /dashboard/projects, /dashboard/projects/:id | ✅ |
| /dashboard/tasks | ✅ |
| /dashboard/meetings | ✅ |
| /dashboard/training | ✅ |
| /dashboard/documents | ✅ |
| /dashboard/feedback | ✅ |
| /dashboard/users | 🟡 Implemented as `/dashboard/team` (same purpose) |
| /dashboard/activity | ✅ |
| /dashboard/settings | ❌ Not built — nothing to put in it given role simplification. Can add later. |

| Public route | Status |
|---|---|
| / | ✅ |
| /about | ✅ |
| /team | ✅ |
| /initiatives | ✅ (static, per PRD) |
| /projects, /projects/:slug | ✅ |
| /resources | ✅ |
| /feedback | ✅ |

## §11–12 Database tables / schema

| Table | Status |
|---|---|
| profiles | ✅ + added `is_active`, `show_on_public_team`, `public_bio`, `public_photo_url` |
| projects | ✅ Per PRD + `is_public` denorm + `slug` partial-unique |
| tasks | ✅ |
| meetings | ✅ |
| meeting_action_items | ✅ |
| training_modules | ✅ |
| documents | ✅ |
| feedback | ✅ + `source_ip` for abuse triage |
| activity_logs | ✅ |

Plus 3 read-only Postgres views (`public_projects`, `public_team`, `public_resources`) for safe anon access.

## §13 Permissions matrix

🟡 **Replaced by one-role model.** Matrix is therefore "all internal users = all internal ops". The activity log captures who did what for accountability.

## §14 Key user flows

| Flow | Status |
|---|---|
| 1. Admin creates project | ✅ |
| 2. Admin publishes public project | ✅ (without separate super-admin approval gate) |
| 3. MoM action item → task | ✅ Idempotent via `task_id IS NULL` guard |
| 4. Public feedback | ✅ Honeypot + IP capture |

## §15 Beta success metrics

Counters available on dashboard home:
- ✅ Total / active / live / paused projects
- ✅ Pending / overdue / blocked tasks
- ✅ Published-publicly count
- ✅ New feedback count
- ✅ Final/Delivered trainings count

Execution-discipline metrics (% projects updated in last 7 days, % tasks without owner) — 🟡 NOT computed as cards; the data is queryable via SQL but no UI counter built yet.

## §16 UI requirements

| | Status |
|---|---|
| Sidebar nav, topbar | ✅ |
| Tables, status/priority badges, cards | ✅ |
| Detail pages | ✅ |
| Empty states | ✅ |
| Confirmation dialogs | 🟡 Destructive actions (delete) are single-click via form post. Could add `<Dialog>` confirm. Recommend before showing leadership. |
| Mobile responsive public portal | ✅ Container + responsive nav |
| Dashboard not optimised for mobile | ✅ (intentional) |

## §17 Filters — implemented

- Projects: status, priority, type, visibility, title search ✅
- Tasks: status, priority, project, assignee, title search, mine/overdue presets ✅
- MoMs: type, project, title search ✅
- Training: status, audience, category, visibility, title search ✅
- Documents: category, visibility, project, title search ✅
- Feedback: status, category ✅

## §18 Search

🟡 Per-section search only (ilike on title). **Global search across all 6 entities NOT built.** Suggest adding in v1.1.

## §19 Notifications

| | Status |
|---|---|
| Dashboard badges for overdue tasks | ✅ Card highlights amber when > 0 |
| Dashboard badges for blocked tasks | ✅ |
| Dashboard badges for new feedback | ✅ Card highlights amber when > 0 |
| Email alerts (optional) | ❌ Out of scope per PRD §19 "Optional" |

## §20 Data privacy

✅ All private fields kept server-side; public portal reads via views that exclude them. RLS enforces.

## §21 Public content approval rule

| | Status |
|---|---|
| Separate fields | ✅ |
| Approval enforcement | 🟡 Status field present; role-based approval not enforced (per simplification) ⚠️ |

## §22 Beta launch checklist

See `README.md` for an executable version.

---

## Open risks / things to do before showing leadership

1. **Role enforcement removed** — anyone with an SGT email can publish, delete, or modify anything. If this is acceptable for beta, great. If not, re-introduce a `super_admin` flag on `profiles` and add `is_super_admin = true` checks to destructive RLS policies (~30 min of work). ⚠️
2. **Confirmation dialogs on delete** — currently single-click. Worth adding for the demo. (~15 min)
3. **Global search** — per-section search works; cross-entity search per §18 not built. Out of scope for the "boringly reliable" beta but flagging.
4. **Email notifications** — none. PRD lists as optional. Document this expectation with leadership upfront.
5. **First-login UX** — when a new SGT user signs in, they land on /dashboard with full access. If you want a "pending approval" gate, flip `profiles.is_active` default from `true` to `false`, add a check in `requireProfile()`, and build a tiny approval page.

## What's solid

- The data model and RLS are the load-bearing pieces and they're written carefully — the public/private separation is enforced three independent ways (separate columns, view, bucket split).
- Soft delete is consistent across all operational tables.
- Activity log captures every meaningful mutation via SECURITY DEFINER-pattern writes (service-role client server-side; no client write policy exists).
- All 14 PRD modules have working UI.
- TypeScript clean compile.
