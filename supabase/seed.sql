-- ============================================================================
-- Seed data. Run AFTER the first time you (deepak.ai@sgtuniversity.org) have
-- logged in via Google — that creates the auth.users row and the matching
-- profiles row via the handle_new_user() trigger. This script then enriches
-- the profile and inserts demo records.
--
-- It's idempotent: re-running won't duplicate anything.
-- ============================================================================

-- Enrich the seed profile (if it exists from a previous login)
update profiles
set
  full_name = coalesce(nullif(full_name, ''), 'Deepak Meena'),
  department = 'Centre of Excellence for AI',
  designation = 'CoE Head',
  show_on_public_team = true,
  public_bio = 'Heads the Centre of Excellence for AI at SGT University. Focused on practical AI adoption across teaching, research, operations, and student development.'
where lower(email) = 'deepak.ai@sgtuniversity.org';

-- Demo projects (use deterministic UUIDs so reruns are idempotent)
insert into projects (id, title, slug, short_code, internal_description, public_description, project_type, status, priority, latest_update, public_visibility_status, public_impact_statement, owner_id)
values
  ('11111111-1111-1111-1111-111111111111', 'Faculty AI Training Sprint', 'faculty-ai-training-sprint', 'FAT-01',
   'Six-week training programme for ~120 faculty across colleges. Initial cohort starts with Engineering + Liberal Arts.',
   'A structured programme to equip SGT faculty with practical AI skills for teaching, research, and workload management.',
   'Faculty Training', 'In Progress', 'High',
   'Module 1 draft circulated. Awaiting reviewer notes from 2 leads.',
   'Published',
   'Equips 120+ faculty with hands-on AI skills they can use the same week in classroom and research workflows.',
   (select id from profiles where lower(email) = 'deepak.ai@sgtuniversity.org' limit 1)
  ),
  ('22222222-2222-2222-2222-222222222222', 'One Stop App', 'one-stop-app', 'OSA-01',
   'Internal admissions + student services consolidation. CRM integration is the long pole.',
   'A single mobile app for SGT students to access admissions status, fees, hostel, library and academic services.',
   'AI Product', 'Planned', 'High',
   'Stakeholder alignment ongoing. Vendor shortlist in progress.',
   'Published',
   'One app to replace 7 disconnected student touchpoints — measurable reduction in admin queries.',
   (select id from profiles where lower(email) = 'deepak.ai@sgtuniversity.org' limit 1)
  ),
  ('33333333-3333-3333-3333-333333333333', 'Vendor Negotiation — CRM Replacement', 'crm-vendor-eval', 'CRM-01',
   'Internal only. Evaluating 3 vendors. Pricing negotiations sensitive. Do not share publicly.',
   null,
   'Internal Operations', 'In Progress', 'Medium',
   'Vendor B counter-quote received. Sharing with finance.',
   'Private',
   null,
   (select id from profiles where lower(email) = 'deepak.ai@sgtuniversity.org' limit 1)
  )
on conflict (id) do nothing;

-- Demo tasks
insert into tasks (id, project_id, title, description, status, priority, due_date, assigned_to)
values
  ('aaaaaaaa-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111',
    'Finalize Module 1 outline', 'Reviewer feedback consolidated by Friday.',
    'Doing', 'High', current_date + 3,
    (select id from profiles where lower(email) = 'deepak.ai@sgtuniversity.org' limit 1)),
  ('aaaaaaaa-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111',
    'Schedule cohort 1 kickoff', null, 'To Do', 'Medium', current_date + 7, null),
  ('aaaaaaaa-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222',
    'Draft RFP', 'Include integration acceptance criteria.', 'To Do', 'High', current_date + 14, null),
  ('aaaaaaaa-0000-0000-0000-000000000004', '33333333-3333-3333-3333-333333333333',
    'Compare TCO Vendor A vs B', null, 'Review', 'Medium', current_date - 2, null),
  ('aaaaaaaa-0000-0000-0000-000000000005', null,
    'Standing — weekly CoE update note', null, 'To Do', 'Low', current_date + 1, null)
on conflict (id) do nothing;

-- Demo meeting
insert into meetings (id, title, meeting_date, meeting_type, project_id, attendees, agenda, summary, key_decisions, next_steps, next_meeting_date, created_by)
values
  ('bbbbbbbb-0000-0000-0000-000000000001', 'Faculty Training Sprint — Kickoff',
    current_date - 5, 'Faculty Training Planning', '11111111-1111-1111-1111-111111111111',
    array['Deepak Meena','Reviewer A','Reviewer B'],
    '1. Module structure review\n2. Cohort plan\n3. Reviewer assignment',
    'Aligned on 6-module structure. Cohort 1 to start in 2 weeks.',
    '- Use applied workshop format, not lecture\n- Each module ends with a takeaway artifact',
    'Module 1 outline by Friday. Cohort invites by next Monday.',
    current_date + 7,
    (select id from profiles where lower(email) = 'deepak.ai@sgtuniversity.org' limit 1)
  )
on conflict (id) do nothing;

insert into meeting_action_items (id, meeting_id, action_item, owner_id, due_date, status)
values
  ('cccccccc-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001',
    'Send cohort 1 invitations', (select id from profiles where lower(email) = 'deepak.ai@sgtuniversity.org' limit 1),
    current_date + 7, 'Open'),
  ('cccccccc-0000-0000-0000-000000000002', 'bbbbbbbb-0000-0000-0000-000000000001',
    'Finalize Module 1 outline', null, current_date + 3, 'In Progress')
on conflict (id) do nothing;

-- Demo training modules
insert into training_modules (id, title, audience, training_category, description, status, visibility)
values
  ('dddddddd-0000-0000-0000-000000000001', 'AI Basics for Faculty', 'Faculty', 'AI Basics',
    'Foundation module covering how LLMs work and where they fit in teaching workflows.',
    'Final', 'Public'),
  ('dddddddd-0000-0000-0000-000000000002', 'Prompting for Research', 'Faculty', 'Prompting',
    'Patterns for using LLMs in literature review, drafting, and code assistance.',
    'Under Review', 'Internal Only')
on conflict (id) do nothing;

-- Demo documents
insert into documents (id, title, category, project_id, description, visibility)
values
  ('eeeeeeee-0000-0000-0000-000000000001', 'CoE AI Charter', 'Policy', null,
    'Mission, scope, and operating principles of the Centre of Excellence for AI.',
    'Public'),
  ('eeeeeeee-0000-0000-0000-000000000002', 'Faculty Training PRD v1', 'PRD',
    '11111111-1111-1111-1111-111111111111',
    'Internal PRD for the faculty training sprint. Do not share externally.',
    'Internal Only')
on conflict (id) do nothing;

-- Demo feedback
insert into feedback (id, name, email, role, category, message, status)
values
  ('ffffffff-0000-0000-0000-000000000001', 'A. Sample', 'sample@example.com', 'Faculty',
    'Training Request', 'Would love a module on using AI for question-paper generation.', 'New')
on conflict (id) do nothing;
