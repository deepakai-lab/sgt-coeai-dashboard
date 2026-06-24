-- ============================================================================
-- CoE AI Command Center — v1.0 Beta Schema
-- One internal role model: any authenticated profile = "member" (full CRUD).
-- Anon (public) can read only narrowly defined public surfaces + insert feedback.
-- ============================================================================

-- Required extensions
create extension if not exists pgcrypto;

-- ===== ENUMS (fixed in v1.0 per PRD §23 risk #3) ============================
do $$ begin
  create type project_status as enum ('Idea','Planned','In Progress','Testing','Live','Paused','Closed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type project_priority as enum ('High','Medium','Low');
exception when duplicate_object then null; end $$;

do $$ begin
  create type project_type as enum (
    'Internal Operations','Faculty Training','Student Initiative','AI Product',
    'Research','Automation','Data Intelligence','Public Initiative','Collaboration'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public_visibility_status as enum (
    'Private','Public Draft','Pending Approval','Published','Unpublished'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type task_status as enum ('To Do','Doing','Review','Blocked','Done');
exception when duplicate_object then null; end $$;

do $$ begin
  create type meeting_type as enum (
    'Internal CoE Meeting','Leadership Review','Department Meeting',
    'Faculty Training Planning','Project Review','Vendor/Partner Discussion',
    'Student Initiative Meeting','Other'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type training_audience as enum (
    'Faculty','Students','Admin Staff','Leadership','Department Specific','General Public'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type training_category as enum (
    'AI Basics','AI for Teaching','AI for Research','AI for Workload Management',
    'AI Tools','Prompting','AI Ethics','Department Use Cases','Hands-on Workshop'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type training_status as enum ('Draft','Under Review','Final','Delivered','Archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type doc_category as enum (
    'PRD','Report','Proposal','Training Material','MoM Attachment',
    'Policy','SOP','Template','Research','Other'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type doc_visibility as enum ('Internal Only','Public','Restricted');
exception when duplicate_object then null; end $$;

do $$ begin
  create type feedback_category as enum (
    'Suggestion','Collaboration','Issue','Training Request','Project Idea','General Feedback'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type feedback_status as enum ('New','Reviewed','In Progress','Resolved','Ignored');
exception when duplicate_object then null; end $$;

do $$ begin
  create type action_item_status as enum ('Open','In Progress','Done','Cancelled');
exception when duplicate_object then null; end $$;

-- ===== TABLES ================================================================

-- profiles (extends auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  department text,
  designation text,
  is_active boolean not null default true,
  show_on_public_team boolean not null default false,
  public_bio text,
  public_photo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists profiles_email_unique on profiles (lower(email));

-- projects
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null,
  short_code text,
  internal_description text,
  public_description text,
  project_type project_type not null default 'Internal Operations',
  owner_id uuid references profiles(id) on delete set null,
  department text,
  status project_status not null default 'Idea',
  priority project_priority not null default 'Medium',
  start_date date,
  target_date date,
  completion_date date,
  current_blocker text,
  latest_update text,
  internal_notes text,
  public_visibility_status public_visibility_status not null default 'Private',
  public_impact_statement text,
  is_public boolean not null default false,
  created_by uuid references profiles(id) on delete set null,
  updated_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create unique index if not exists projects_slug_unique_live on projects (slug) where deleted_at is null;
create index if not exists projects_status_idx on projects (status) where deleted_at is null;
create index if not exists projects_owner_idx on projects (owner_id) where deleted_at is null;
create index if not exists projects_public_idx on projects (is_public) where is_public = true and deleted_at is null;

-- tasks
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete set null,
  title text not null,
  description text,
  assigned_to uuid references profiles(id) on delete set null,
  created_by uuid references profiles(id) on delete set null,
  status task_status not null default 'To Do',
  priority project_priority not null default 'Medium',
  due_date date,
  completion_date date,
  blocker text,
  remarks text,
  attachment_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index if not exists tasks_project_idx on tasks (project_id) where deleted_at is null;
create index if not exists tasks_assigned_idx on tasks (assigned_to) where deleted_at is null;
create index if not exists tasks_status_idx on tasks (status) where deleted_at is null;
create index if not exists tasks_due_idx on tasks (due_date) where deleted_at is null;

-- meetings
create table if not exists meetings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  meeting_date date not null,
  meeting_type meeting_type not null default 'Internal CoE Meeting',
  project_id uuid references projects(id) on delete set null,
  attendees text[] not null default '{}',
  agenda text,
  summary text,
  key_decisions text,
  next_steps text,
  next_meeting_date date,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index if not exists meetings_date_idx on meetings (meeting_date desc) where deleted_at is null;
create index if not exists meetings_project_idx on meetings (project_id) where deleted_at is null;

-- meeting_action_items
create table if not exists meeting_action_items (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid not null references meetings(id) on delete cascade,
  task_id uuid references tasks(id) on delete set null,
  action_item text not null,
  owner_id uuid references profiles(id) on delete set null,
  due_date date,
  status action_item_status not null default 'Open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists action_items_meeting_idx on meeting_action_items (meeting_id);

-- training_modules
create table if not exists training_modules (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  audience training_audience not null default 'Faculty',
  department text,
  training_category training_category not null default 'AI Basics',
  description text,
  status training_status not null default 'Draft',
  version text default 'v1',
  prepared_by uuid references profiles(id) on delete set null,
  reviewed_by uuid references profiles(id) on delete set null,
  delivery_date date,
  file_url text,
  visibility doc_visibility not null default 'Internal Only',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index if not exists training_status_idx on training_modules (status) where deleted_at is null;
create index if not exists training_visibility_idx on training_modules (visibility) where deleted_at is null;

-- documents
create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category doc_category not null default 'Other',
  project_id uuid references projects(id) on delete set null,
  description text,
  file_url text,
  visibility doc_visibility not null default 'Internal Only',
  uploaded_by uuid references profiles(id) on delete set null,
  version text default 'v1',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index if not exists documents_project_idx on documents (project_id) where deleted_at is null;
create index if not exists documents_visibility_idx on documents (visibility) where deleted_at is null;

-- feedback (inserted by anonymous public)
create table if not exists feedback (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  role text,
  department_or_org text,
  category feedback_category not null default 'General Feedback',
  message text not null,
  attachment_url text,
  status feedback_status not null default 'New',
  assigned_to uuid references profiles(id) on delete set null,
  admin_notes text,
  source_ip inet,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists feedback_status_idx on feedback (status);
create index if not exists feedback_created_idx on feedback (created_at desc);

-- activity_logs
create table if not exists activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete set null,
  user_email text,
  action text not null,         -- e.g. 'project.created'
  entity_type text not null,    -- e.g. 'project'
  entity_id uuid,
  entity_label text,            -- human-readable name
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists activity_created_idx on activity_logs (created_at desc);
create index if not exists activity_entity_idx on activity_logs (entity_type, entity_id);

-- ===== TRIGGERS ==============================================================

-- updated_at touch
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists trg_profiles_updated on profiles;
create trigger trg_profiles_updated before update on profiles for each row execute function set_updated_at();
drop trigger if exists trg_projects_updated on projects;
create trigger trg_projects_updated before update on projects for each row execute function set_updated_at();
drop trigger if exists trg_tasks_updated on tasks;
create trigger trg_tasks_updated before update on tasks for each row execute function set_updated_at();
drop trigger if exists trg_meetings_updated on meetings;
create trigger trg_meetings_updated before update on meetings for each row execute function set_updated_at();
drop trigger if exists trg_action_items_updated on meeting_action_items;
create trigger trg_action_items_updated before update on meeting_action_items for each row execute function set_updated_at();
drop trigger if exists trg_training_updated on training_modules;
create trigger trg_training_updated before update on training_modules for each row execute function set_updated_at();
drop trigger if exists trg_documents_updated on documents;
create trigger trg_documents_updated before update on documents for each row execute function set_updated_at();
drop trigger if exists trg_feedback_updated on feedback;
create trigger trg_feedback_updated before update on feedback for each row execute function set_updated_at();

-- keep projects.is_public synced with public_visibility_status
create or replace function sync_project_is_public()
returns trigger language plpgsql as $$
begin
  new.is_public = (new.public_visibility_status = 'Published');
  return new;
end $$;

drop trigger if exists trg_projects_sync_public on projects;
create trigger trg_projects_sync_public before insert or update of public_visibility_status on projects
  for each row execute function sync_project_is_public();

-- ===== AUTO-CREATE PROFILE ON NEW AUTH USER =================================
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists trg_on_auth_user_created on auth.users;
create trigger trg_on_auth_user_created after insert on auth.users
  for each row execute function handle_new_user();

-- ===== PUBLIC VIEW (only safe columns reach anon) ===========================
create or replace view public_projects as
  select
    id, title, slug, short_code,
    public_description,
    public_impact_statement,
    project_type,
    status,
    department,
    target_date,
    completion_date,
    updated_at
  from projects
  where is_public = true and deleted_at is null;

-- Public-safe team members
create or replace view public_team as
  select
    id, full_name, department, designation,
    public_bio, public_photo_url
  from profiles
  where show_on_public_team = true and is_active = true;

-- Public-safe resources (docs + training)
create or replace view public_resources as
  select
    'document'::text as kind, id, title,
    category::text as category,
    description, file_url, updated_at
  from documents
  where visibility = 'Public' and deleted_at is null
  union all
  select
    'training'::text as kind, id, title,
    training_category::text as category,
    description, file_url, updated_at
  from training_modules
  where visibility = 'Public' and status in ('Final','Delivered') and deleted_at is null;

-- ===== ROW LEVEL SECURITY ====================================================
alter table profiles enable row level security;
alter table projects enable row level security;
alter table tasks enable row level security;
alter table meetings enable row level security;
alter table meeting_action_items enable row level security;
alter table training_modules enable row level security;
alter table documents enable row level security;
alter table feedback enable row level security;
alter table activity_logs enable row level security;

-- ----- profiles -------------------------------------------------------------
drop policy if exists "profiles_read_auth" on profiles;
create policy "profiles_read_auth" on profiles for select
  using (auth.role() = 'authenticated');

drop policy if exists "profiles_update_self" on profiles;
create policy "profiles_update_self" on profiles for update
  using (auth.uid() = id) with check (auth.uid() = id);

-- ----- projects -------------------------------------------------------------
drop policy if exists "projects_read_auth" on projects;
create policy "projects_read_auth" on projects for select
  using (auth.role() = 'authenticated' and deleted_at is null);

drop policy if exists "projects_insert_auth" on projects;
create policy "projects_insert_auth" on projects for insert
  with check (auth.role() = 'authenticated');

drop policy if exists "projects_update_auth" on projects;
create policy "projects_update_auth" on projects for update
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Soft delete only — direct DELETE blocked by absence of a delete policy
-- (RLS denies by default). UI/server actions must UPDATE deleted_at instead.

-- ----- tasks ----------------------------------------------------------------
drop policy if exists "tasks_read_auth" on tasks;
create policy "tasks_read_auth" on tasks for select
  using (auth.role() = 'authenticated' and deleted_at is null);
drop policy if exists "tasks_write_auth" on tasks;
create policy "tasks_write_auth" on tasks for insert with check (auth.role() = 'authenticated');
drop policy if exists "tasks_update_auth" on tasks;
create policy "tasks_update_auth" on tasks for update using (auth.role() = 'authenticated');

-- ----- meetings + action items ---------------------------------------------
drop policy if exists "meetings_read_auth" on meetings;
create policy "meetings_read_auth" on meetings for select using (auth.role() = 'authenticated' and deleted_at is null);
drop policy if exists "meetings_write_auth" on meetings;
create policy "meetings_write_auth" on meetings for insert with check (auth.role() = 'authenticated');
drop policy if exists "meetings_update_auth" on meetings;
create policy "meetings_update_auth" on meetings for update using (auth.role() = 'authenticated');

drop policy if exists "action_items_read_auth" on meeting_action_items;
create policy "action_items_read_auth" on meeting_action_items for select using (auth.role() = 'authenticated');
drop policy if exists "action_items_write_auth" on meeting_action_items;
create policy "action_items_write_auth" on meeting_action_items for insert with check (auth.role() = 'authenticated');
drop policy if exists "action_items_update_auth" on meeting_action_items;
create policy "action_items_update_auth" on meeting_action_items for update using (auth.role() = 'authenticated');
drop policy if exists "action_items_delete_auth" on meeting_action_items;
create policy "action_items_delete_auth" on meeting_action_items for delete using (auth.role() = 'authenticated');

-- ----- training modules -----------------------------------------------------
drop policy if exists "training_read_auth" on training_modules;
create policy "training_read_auth" on training_modules for select using (auth.role() = 'authenticated' and deleted_at is null);
drop policy if exists "training_read_anon_public" on training_modules;
create policy "training_read_anon_public" on training_modules for select
  using (visibility = 'Public' and status in ('Final','Delivered') and deleted_at is null);
drop policy if exists "training_write_auth" on training_modules;
create policy "training_write_auth" on training_modules for insert with check (auth.role() = 'authenticated');
drop policy if exists "training_update_auth" on training_modules;
create policy "training_update_auth" on training_modules for update using (auth.role() = 'authenticated');

-- ----- documents ------------------------------------------------------------
drop policy if exists "docs_read_auth" on documents;
create policy "docs_read_auth" on documents for select using (auth.role() = 'authenticated' and deleted_at is null);
drop policy if exists "docs_read_anon_public" on documents;
create policy "docs_read_anon_public" on documents for select
  using (visibility = 'Public' and deleted_at is null);
drop policy if exists "docs_write_auth" on documents;
create policy "docs_write_auth" on documents for insert with check (auth.role() = 'authenticated');
drop policy if exists "docs_update_auth" on documents;
create policy "docs_update_auth" on documents for update using (auth.role() = 'authenticated');

-- ----- feedback (anon inserts, auth reads/updates) --------------------------
drop policy if exists "feedback_insert_anon" on feedback;
create policy "feedback_insert_anon" on feedback for insert to anon, authenticated with check (true);
drop policy if exists "feedback_read_auth" on feedback;
create policy "feedback_read_auth" on feedback for select using (auth.role() = 'authenticated');
drop policy if exists "feedback_update_auth" on feedback;
create policy "feedback_update_auth" on feedback for update using (auth.role() = 'authenticated');

-- ----- activity_logs (read auth, write only via SECURITY DEFINER funcs) -----
drop policy if exists "activity_read_auth" on activity_logs;
create policy "activity_read_auth" on activity_logs for select using (auth.role() = 'authenticated');
-- no insert/update/delete policies → blocked from clients

-- ===== STORAGE BUCKETS ======================================================
insert into storage.buckets (id, name, public)
  values ('documents-public', 'documents-public', true)
  on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
  values ('documents-private', 'documents-private', false)
  on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
  values ('training-public', 'training-public', true)
  on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
  values ('training-private', 'training-private', false)
  on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
  values ('public-assets', 'public-assets', true)
  on conflict (id) do nothing;

-- Storage RLS: authenticated users can read/write any bucket; anon can read public buckets only.
drop policy if exists "storage_auth_all" on storage.objects;
create policy "storage_auth_all" on storage.objects for all to authenticated
  using (true) with check (true);

drop policy if exists "storage_anon_read_public" on storage.objects;
create policy "storage_anon_read_public" on storage.objects for select to anon
  using (bucket_id in ('documents-public','training-public','public-assets'));

-- ===== GRANTS for views (RLS still applies on underlying tables) ============
grant select on public_projects to anon, authenticated;
grant select on public_team to anon, authenticated;
grant select on public_resources to anon, authenticated;
