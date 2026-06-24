// Realistic mock data for DEMO_MODE. No Supabase required.
// Used by demo Supabase client when NEXT_PUBLIC_DEMO_MODE === 'true'.

const today = new Date()
const daysAgo = (n: number) => new Date(today.getTime() - n * 86400000).toISOString().slice(0, 10)
const daysFromNow = (n: number) => new Date(today.getTime() + n * 86400000).toISOString().slice(0, 10)
const tsAgo = (n: number) => new Date(today.getTime() - n * 3600000).toISOString()

export const DEMO_PROFILE_ID = '00000000-0000-0000-0000-000000000001'

export const DEMO_PROFILES = [
  {
    id: DEMO_PROFILE_ID,
    full_name: 'Deepak Meena',
    email: 'deepak.ai@sgtuniversity.org',
    department: 'Centre of Excellence for AI',
    designation: 'Head, CoE AI',
    is_active: true,
    show_on_public_team: true,
    public_bio: 'Heads the Centre of Excellence for AI at SGT University. Focused on practical AI adoption across teaching, research, operations, and student development.',
    public_photo_url: null,
    created_at: tsAgo(24 * 60),
    updated_at: tsAgo(2)
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    full_name: 'Nikhil Sharma',
    email: 'nikhil.ai@sgtuniversity.org',
    department: 'CoE AI',
    designation: 'AI Programme Lead',
    is_active: true,
    show_on_public_team: true,
    public_bio: 'Leads faculty training programmes and partnership initiatives across the engineering and liberal arts schools.',
    public_photo_url: null,
    created_at: tsAgo(20 * 60),
    updated_at: tsAgo(5)
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    full_name: 'Ananya Verma',
    email: 'ananya.ai@sgtuniversity.org',
    department: 'CoE AI',
    designation: 'AI Product Engineer',
    is_active: true,
    show_on_public_team: true,
    public_bio: 'Builds AI products and prototypes for SGT — from internal automation to student-facing tools.',
    public_photo_url: null,
    created_at: tsAgo(15 * 60),
    updated_at: tsAgo(10)
  },
  {
    id: '00000000-0000-0000-0000-000000000004',
    full_name: 'Rohan Kapoor',
    email: 'rohan.ai@sgtuniversity.org',
    department: 'CoE AI',
    designation: 'Data Intelligence Intern',
    is_active: true,
    show_on_public_team: false,
    public_bio: null,
    public_photo_url: null,
    created_at: tsAgo(10 * 60),
    updated_at: tsAgo(20)
  }
]

export const DEMO_PROJECTS = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    title: 'Faculty AI Training Sprint',
    slug: 'faculty-ai-training-sprint',
    short_code: 'FAT-01',
    internal_description: 'Six-week training programme for ~120 faculty across colleges. Initial cohort starts with Engineering + Liberal Arts. Heavy on applied workshops, light on lectures.',
    public_description: 'A structured programme to equip SGT faculty with practical AI skills for teaching, research, and workload management. Six modules, hands-on workshops, takeaway artefacts per module.',
    project_type: 'Faculty Training',
    owner_id: DEMO_PROFILE_ID,
    department: 'Cross-college',
    status: 'In Progress',
    priority: 'High',
    start_date: daysAgo(20),
    target_date: daysFromNow(30),
    completion_date: null,
    current_blocker: 'Awaiting reviewer feedback from 2 college deans on Module 1.',
    latest_update: 'Module 1 draft circulated. Cohort 1 invitations going out Monday. Reviewer feedback pending from 2 leads.',
    internal_notes: 'Budget pre-approved by Vice Chancellor office. Watch out for clash with end-semester exam schedule in some departments.',
    public_visibility_status: 'Published',
    public_impact_statement: 'Equips 120+ faculty across 19 colleges with hands-on AI skills they can use in classroom and research workflows from week one.',
    is_public: true,
    created_by: DEMO_PROFILE_ID, updated_by: DEMO_PROFILE_ID,
    created_at: tsAgo(20 * 24), updated_at: tsAgo(6), deleted_at: null
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    title: 'One Stop SGT App',
    slug: 'one-stop-sgt-app',
    short_code: 'OSA-01',
    internal_description: 'Internal admissions + student services consolidation. CRM integration is the long pole. RFP being drafted.',
    public_description: 'A single mobile app for SGT students to access admissions status, fees, hostel, library, and academic services — replacing 7 disconnected touchpoints.',
    project_type: 'AI Product',
    owner_id: '00000000-0000-0000-0000-000000000003',
    department: 'Student Services',
    status: 'Planned',
    priority: 'High',
    start_date: daysAgo(5),
    target_date: daysFromNow(120),
    completion_date: null,
    current_blocker: null,
    latest_update: 'Stakeholder alignment ongoing. Vendor shortlist in progress (3 vendors).',
    internal_notes: 'Vendor A pricing aggressive. Vendor B has better CRM integrations. Decision next week.',
    public_visibility_status: 'Published',
    public_impact_statement: 'One app replaces 7 disconnected student touchpoints. Measurable reduction in admin queries and faster issue resolution.',
    is_public: true,
    created_by: DEMO_PROFILE_ID, updated_by: '00000000-0000-0000-0000-000000000003',
    created_at: tsAgo(15 * 24), updated_at: tsAgo(12), deleted_at: null
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    title: 'AI Question Paper Assistant',
    slug: 'ai-question-paper-assistant',
    short_code: 'AQP-01',
    internal_description: 'Tool for faculty to generate question papers with AI assistance — Bloom\'s taxonomy classifier, difficulty distribution, randomisation.',
    public_description: 'A tool that helps SGT faculty generate balanced question papers faster, with built-in difficulty distribution and Bloom\'s taxonomy classification.',
    project_type: 'AI Product',
    owner_id: '00000000-0000-0000-0000-000000000003',
    department: 'Academics',
    status: 'Testing',
    priority: 'Medium',
    start_date: daysAgo(45),
    target_date: daysFromNow(15),
    completion_date: null,
    current_blocker: null,
    latest_update: 'Internal beta with 5 faculty members. Positive early feedback on time savings.',
    internal_notes: null,
    public_visibility_status: 'Published',
    public_impact_statement: 'Cuts question paper preparation time by an estimated 60% while improving consistency and pedagogical balance.',
    is_public: true,
    created_by: '00000000-0000-0000-0000-000000000003', updated_by: '00000000-0000-0000-0000-000000000003',
    created_at: tsAgo(45 * 24), updated_at: tsAgo(2), deleted_at: null
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    title: 'Student AI Readiness Curriculum',
    slug: 'student-ai-readiness-curriculum',
    short_code: 'SAR-01',
    internal_description: 'Cross-college elective course covering AI fundamentals, prompting, ethics, and tools. Designed to be taught by trained faculty.',
    public_description: 'A cross-college elective course that equips SGT students with the AI fluency they\'ll need in their careers — fundamentals, prompting, ethics, and practical tools.',
    project_type: 'Student Initiative',
    owner_id: '00000000-0000-0000-0000-000000000002',
    department: 'Cross-college',
    status: 'In Progress',
    priority: 'High',
    start_date: daysAgo(10),
    target_date: daysFromNow(60),
    completion_date: null,
    current_blocker: null,
    latest_update: 'Curriculum draft v2 in review. 4 colleges have committed to pilot.',
    internal_notes: null,
    public_visibility_status: 'Pending Approval',
    public_impact_statement: 'Equips every SGT student with practical AI skills before they enter the workforce.',
    is_public: false,
    created_by: '00000000-0000-0000-0000-000000000002', updated_by: '00000000-0000-0000-0000-000000000002',
    created_at: tsAgo(10 * 24), updated_at: tsAgo(18), deleted_at: null
  },
  {
    id: '55555555-5555-5555-5555-555555555555',
    title: 'Vendor Evaluation — CRM Replacement',
    slug: 'crm-vendor-evaluation',
    short_code: 'CRM-01',
    internal_description: 'Evaluating 3 CRM vendors to replace the legacy admissions CRM. Pricing negotiations sensitive — do not share publicly.',
    public_description: null,
    project_type: 'Internal Operations',
    owner_id: DEMO_PROFILE_ID,
    department: 'Admissions',
    status: 'In Progress',
    priority: 'Medium',
    start_date: daysAgo(30),
    target_date: daysFromNow(45),
    completion_date: null,
    current_blocker: 'Waiting on Vendor B revised quote.',
    latest_update: 'Vendor B counter-quote received. Sharing with finance for review.',
    internal_notes: 'Confidential — Vendor A: ₹X/yr, Vendor B: ₹Y/yr, Vendor C: ₹Z/yr. Decision to be made in next leadership review.',
    public_visibility_status: 'Private',
    public_impact_statement: null,
    is_public: false,
    created_by: DEMO_PROFILE_ID, updated_by: DEMO_PROFILE_ID,
    created_at: tsAgo(30 * 24), updated_at: tsAgo(36), deleted_at: null
  },
  {
    id: '66666666-6666-6666-6666-666666666666',
    title: 'Research Lab AI Toolkit',
    slug: 'research-lab-ai-toolkit',
    short_code: 'RLT-01',
    internal_description: 'Curated toolkit of AI tools for research labs — literature review, code assistance, data analysis. Includes vetted prompts and workflows.',
    public_description: 'A curated AI toolkit for SGT research labs — vetted tools and workflows for literature review, code assistance, and data analysis.',
    project_type: 'Research',
    owner_id: '00000000-0000-0000-0000-000000000002',
    department: 'Research',
    status: 'Live',
    priority: 'Medium',
    start_date: daysAgo(90),
    target_date: daysAgo(10),
    completion_date: daysAgo(8),
    current_blocker: null,
    latest_update: 'Live across 4 research labs. Quarterly review scheduled.',
    internal_notes: null,
    public_visibility_status: 'Published',
    public_impact_statement: 'Used by 4 research labs at SGT to accelerate literature review, code work, and data analysis — saving ~6 hours/researcher/week.',
    is_public: true,
    created_by: '00000000-0000-0000-0000-000000000002', updated_by: '00000000-0000-0000-0000-000000000002',
    created_at: tsAgo(90 * 24), updated_at: tsAgo(48), deleted_at: null
  },
  {
    id: '77777777-7777-7777-7777-777777777777',
    title: 'Admissions Funnel Intelligence',
    slug: 'admissions-funnel-intelligence',
    short_code: 'AFI-01',
    internal_description: 'Data intelligence project to surface drop-off points in the admissions funnel and identify intervention opportunities.',
    public_description: null,
    project_type: 'Data Intelligence',
    owner_id: '00000000-0000-0000-0000-000000000004',
    department: 'Admissions',
    status: 'Planned',
    priority: 'Medium',
    start_date: null,
    target_date: daysFromNow(75),
    completion_date: null,
    current_blocker: null,
    latest_update: 'Data access requested from IT. Scoping document in draft.',
    internal_notes: null,
    public_visibility_status: 'Private',
    public_impact_statement: null,
    is_public: false,
    created_by: DEMO_PROFILE_ID, updated_by: '00000000-0000-0000-0000-000000000004',
    created_at: tsAgo(5 * 24), updated_at: tsAgo(30), deleted_at: null
  },
  {
    id: '88888888-8888-8888-8888-888888888888',
    title: 'Library Smart Search',
    slug: 'library-smart-search',
    short_code: 'LSS-01',
    internal_description: 'Semantic search across the SGT library catalogue + research papers. Replaces the keyword-only search.',
    public_description: 'Semantic search across the SGT library catalogue — find books and papers by meaning, not just keywords.',
    project_type: 'AI Product',
    owner_id: '00000000-0000-0000-0000-000000000003',
    department: 'Library',
    status: 'Paused',
    priority: 'Low',
    start_date: daysAgo(60),
    target_date: daysFromNow(90),
    completion_date: null,
    current_blocker: 'Library team prioritising digital archive migration first.',
    latest_update: 'Paused pending library team capacity. Revisit in 6 weeks.',
    internal_notes: null,
    public_visibility_status: 'Public Draft',
    public_impact_statement: 'Lets students and researchers find library resources by meaning, not just exact keywords.',
    is_public: false,
    created_by: '00000000-0000-0000-0000-000000000003', updated_by: '00000000-0000-0000-0000-000000000003',
    created_at: tsAgo(60 * 24), updated_at: tsAgo(72), deleted_at: null
  }
]

export const DEMO_TASKS = [
  { id: 'aaaa0001', project_id: '11111111-1111-1111-1111-111111111111', title: 'Finalize Module 1 outline', description: 'Reviewer feedback consolidated by Friday.', assigned_to: DEMO_PROFILE_ID, created_by: DEMO_PROFILE_ID, status: 'Doing', priority: 'High', due_date: daysFromNow(3), completion_date: null, blocker: null, remarks: 'Awaiting 2 reviewers.', attachment_url: null, created_at: tsAgo(48), updated_at: tsAgo(4), deleted_at: null },
  { id: 'aaaa0002', project_id: '11111111-1111-1111-1111-111111111111', title: 'Schedule cohort 1 kickoff', description: null, assigned_to: '00000000-0000-0000-0000-000000000002', created_by: DEMO_PROFILE_ID, status: 'To Do', priority: 'Medium', due_date: daysFromNow(7), completion_date: null, blocker: null, remarks: null, attachment_url: null, created_at: tsAgo(36), updated_at: tsAgo(36), deleted_at: null },
  { id: 'aaaa0003', project_id: '11111111-1111-1111-1111-111111111111', title: 'Send invitation emails to cohort 1', description: null, assigned_to: '00000000-0000-0000-0000-000000000002', created_by: DEMO_PROFILE_ID, status: 'To Do', priority: 'High', due_date: daysFromNow(5), completion_date: null, blocker: null, remarks: null, attachment_url: null, created_at: tsAgo(30), updated_at: tsAgo(30), deleted_at: null },
  { id: 'aaaa0004', project_id: '22222222-2222-2222-2222-222222222222', title: 'Draft RFP for One Stop App', description: 'Include integration acceptance criteria.', assigned_to: '00000000-0000-0000-0000-000000000003', created_by: DEMO_PROFILE_ID, status: 'To Do', priority: 'High', due_date: daysFromNow(14), completion_date: null, blocker: null, remarks: null, attachment_url: null, created_at: tsAgo(20), updated_at: tsAgo(20), deleted_at: null },
  { id: 'aaaa0005', project_id: '22222222-2222-2222-2222-222222222222', title: 'Vendor shortlist evaluation matrix', description: null, assigned_to: '00000000-0000-0000-0000-000000000003', created_by: DEMO_PROFILE_ID, status: 'Doing', priority: 'High', due_date: daysFromNow(10), completion_date: null, blocker: null, remarks: null, attachment_url: null, created_at: tsAgo(18), updated_at: tsAgo(6), deleted_at: null },
  { id: 'aaaa0006', project_id: '55555555-5555-5555-5555-555555555555', title: 'TCO comparison Vendor A vs B', description: null, assigned_to: DEMO_PROFILE_ID, created_by: DEMO_PROFILE_ID, status: 'Review', priority: 'Medium', due_date: daysAgo(2), completion_date: null, blocker: null, remarks: 'Sent to finance.', attachment_url: null, created_at: tsAgo(96), updated_at: tsAgo(8), deleted_at: null },
  { id: 'aaaa0007', project_id: '33333333-3333-3333-3333-333333333333', title: 'Beta feedback synthesis', description: 'Consolidate notes from 5 faculty testers.', assigned_to: '00000000-0000-0000-0000-000000000003', created_by: '00000000-0000-0000-0000-000000000003', status: 'Doing', priority: 'Medium', due_date: daysFromNow(4), completion_date: null, blocker: null, remarks: null, attachment_url: null, created_at: tsAgo(12), updated_at: tsAgo(3), deleted_at: null },
  { id: 'aaaa0008', project_id: '33333333-3333-3333-3333-333333333333', title: 'Fix Bloom\'s classifier edge cases', description: null, assigned_to: '00000000-0000-0000-0000-000000000003', created_by: '00000000-0000-0000-0000-000000000003', status: 'Blocked', priority: 'High', due_date: daysAgo(1), completion_date: null, blocker: 'Need labelled dataset from academics team.', remarks: null, attachment_url: null, created_at: tsAgo(72), updated_at: tsAgo(24), deleted_at: null },
  { id: 'aaaa0009', project_id: '44444444-4444-4444-4444-444444444444', title: 'Curriculum v2 review with deans', description: null, assigned_to: '00000000-0000-0000-0000-000000000002', created_by: '00000000-0000-0000-0000-000000000002', status: 'To Do', priority: 'Medium', due_date: daysFromNow(8), completion_date: null, blocker: null, remarks: null, attachment_url: null, created_at: tsAgo(48), updated_at: tsAgo(48), deleted_at: null },
  { id: 'aaaa0010', project_id: '77777777-7777-7777-7777-777777777777', title: 'Data access request to IT', description: null, assigned_to: '00000000-0000-0000-0000-000000000004', created_by: DEMO_PROFILE_ID, status: 'Done', priority: 'Medium', due_date: daysAgo(5), completion_date: daysAgo(4), blocker: null, remarks: null, attachment_url: null, created_at: tsAgo(120), updated_at: tsAgo(96), deleted_at: null },
  { id: 'aaaa0011', project_id: '66666666-6666-6666-6666-666666666666', title: 'Quarterly research lab review', description: null, assigned_to: '00000000-0000-0000-0000-000000000002', created_by: '00000000-0000-0000-0000-000000000002', status: 'To Do', priority: 'Low', due_date: daysFromNow(20), completion_date: null, blocker: null, remarks: null, attachment_url: null, created_at: tsAgo(24), updated_at: tsAgo(24), deleted_at: null },
  { id: 'aaaa0012', project_id: null, title: 'Weekly CoE AI update note', description: 'Standing weekly task — internal newsletter.', assigned_to: DEMO_PROFILE_ID, created_by: DEMO_PROFILE_ID, status: 'To Do', priority: 'Low', due_date: daysFromNow(1), completion_date: null, blocker: null, remarks: null, attachment_url: null, created_at: tsAgo(10), updated_at: tsAgo(10), deleted_at: null },
  { id: 'aaaa0013', project_id: '11111111-1111-1111-1111-111111111111', title: 'Print workshop materials', description: null, assigned_to: '00000000-0000-0000-0000-000000000004', created_by: DEMO_PROFILE_ID, status: 'Done', priority: 'Low', due_date: daysAgo(7), completion_date: daysAgo(6), blocker: null, remarks: null, attachment_url: null, created_at: tsAgo(240), updated_at: tsAgo(144), deleted_at: null },
  { id: 'aaaa0014', project_id: '88888888-8888-8888-8888-888888888888', title: 'Re-scope after library team confirms capacity', description: null, assigned_to: '00000000-0000-0000-0000-000000000003', created_by: '00000000-0000-0000-0000-000000000003', status: 'Blocked', priority: 'Low', due_date: null, completion_date: null, blocker: 'Library team prioritising archive migration.', remarks: null, attachment_url: null, created_at: tsAgo(72), updated_at: tsAgo(72), deleted_at: null }
]

export const DEMO_MEETINGS = [
  { id: 'bbbb0001', title: 'Faculty Training Sprint — Kickoff', meeting_date: daysAgo(5), meeting_type: 'Faculty Training Planning', project_id: '11111111-1111-1111-1111-111111111111', attendees: ['Deepak Meena', 'Nikhil Sharma', 'Dean (Engineering)', 'Dean (Liberal Arts)'], agenda: '1. Module structure review\n2. Cohort plan\n3. Reviewer assignment', summary: 'Aligned on 6-module structure. Cohort 1 to start in 2 weeks. Each module ends with a takeaway artefact, not slides.', key_decisions: '- Use applied workshop format, not lecture\n- Each module ends with a takeaway artefact\n- Cohort 1 capped at 30 to maintain quality', next_steps: 'Module 1 outline by Friday. Cohort invitations by next Monday.', next_meeting_date: daysFromNow(7), created_by: DEMO_PROFILE_ID, created_at: tsAgo(120), updated_at: tsAgo(120), deleted_at: null },
  { id: 'bbbb0002', title: 'Monthly Leadership Review — June', meeting_date: daysAgo(12), meeting_type: 'Leadership Review', project_id: null, attendees: ['Vice Chancellor', 'Deepak Meena', 'Registrar', 'Finance Head'], agenda: 'Status across all CoE AI initiatives. Budget tracking. New initiative requests.', summary: 'VC office expressed strong support for the One Stop App and faculty training direction. Approved budget for Q3.', key_decisions: '- Q3 budget approved\n- One Stop App vendor decision delegated to CoE AI\n- Faculty training expanded to all 19 colleges from Q4', next_steps: 'Detailed Q3 budget breakdown by next leadership review.', next_meeting_date: daysFromNow(18), created_by: DEMO_PROFILE_ID, created_at: tsAgo(288), updated_at: tsAgo(280), deleted_at: null },
  { id: 'bbbb0003', title: 'CRM Vendor B — Pricing Discussion', meeting_date: daysAgo(8), meeting_type: 'Vendor/Partner Discussion', project_id: '55555555-5555-5555-5555-555555555555', attendees: ['Deepak Meena', 'Finance Head', 'Vendor B Sales'], agenda: 'Revised pricing. Integration scope. Implementation timeline.', summary: 'Vendor B presented a revised counter-quote with better integration commitments. Decision pending finance review.', key_decisions: '- Request final firm quote with SLA\n- Compare with Vendor A on TCO over 5 years', next_steps: 'TCO comparison to be ready by next week.', next_meeting_date: daysFromNow(7), created_by: DEMO_PROFILE_ID, created_at: tsAgo(192), updated_at: tsAgo(180), deleted_at: null },
  { id: 'bbbb0004', title: 'Student AI Curriculum — Dean Sync', meeting_date: daysAgo(3), meeting_type: 'Department Meeting', project_id: '44444444-4444-4444-4444-444444444444', attendees: ['Nikhil Sharma', 'Dean (Engineering)', 'Dean (Liberal Arts)', 'Dean (Commerce)', 'Dean (Sciences)'], agenda: 'Cross-college elective rollout plan.', summary: '4 colleges committed to piloting the elective in the upcoming semester. Curriculum v2 to be reviewed in 2 weeks.', key_decisions: '- 4 colleges pilot: Engineering, Liberal Arts, Commerce, Sciences\n- Faculty trainers to be sourced from the Faculty AI Training cohort', next_steps: 'Curriculum v2 review meeting scheduled for next week.', next_meeting_date: daysFromNow(8), created_by: '00000000-0000-0000-0000-000000000002', created_at: tsAgo(72), updated_at: tsAgo(72), deleted_at: null }
]

export const DEMO_ACTION_ITEMS = [
  { id: 'cccc0001', meeting_id: 'bbbb0001', task_id: null, action_item: 'Confirm cohort 1 venue and AV setup', owner_id: '00000000-0000-0000-0000-000000000004', due_date: daysFromNow(5), status: 'In Progress', created_at: tsAgo(120), updated_at: tsAgo(24) },
  { id: 'cccc0002', meeting_id: 'bbbb0001', task_id: 'aaaa0001', action_item: 'Finalize Module 1 outline with reviewer feedback', owner_id: DEMO_PROFILE_ID, due_date: daysFromNow(3), status: 'In Progress', created_at: tsAgo(120), updated_at: tsAgo(4) },
  { id: 'cccc0003', meeting_id: 'bbbb0002', task_id: null, action_item: 'Prepare Q3 budget breakdown document', owner_id: DEMO_PROFILE_ID, due_date: daysFromNow(10), status: 'Open', created_at: tsAgo(288), updated_at: tsAgo(288) },
  { id: 'cccc0004', meeting_id: 'bbbb0003', task_id: 'aaaa0006', action_item: 'TCO comparison Vendor A vs B over 5 years', owner_id: DEMO_PROFILE_ID, due_date: daysAgo(2), status: 'In Progress', created_at: tsAgo(192), updated_at: tsAgo(8) },
  { id: 'cccc0005', meeting_id: 'bbbb0004', task_id: null, action_item: 'Share curriculum v2 draft with all 4 deans', owner_id: '00000000-0000-0000-0000-000000000002', due_date: daysFromNow(2), status: 'Open', created_at: tsAgo(72), updated_at: tsAgo(72) }
]

export const DEMO_TRAINING = [
  { id: 'dddd0001', title: 'AI Basics for Faculty', audience: 'Faculty', department: 'Cross-college', training_category: 'AI Basics', description: 'Foundation module covering how LLMs work and where they fit in teaching workflows. Hands-on exercises with ChatGPT and Claude.', status: 'Final', version: 'v2.1', prepared_by: DEMO_PROFILE_ID, reviewed_by: '00000000-0000-0000-0000-000000000002', delivery_date: daysAgo(10), file_url: '#', visibility: 'Public', notes: 'Most popular module so far. Used in faculty training sprint.', created_at: tsAgo(720), updated_at: tsAgo(48), deleted_at: null },
  { id: 'dddd0002', title: 'Prompting for Research', audience: 'Faculty', department: 'Research', training_category: 'Prompting', description: 'Patterns for using LLMs in literature review, drafting, and code assistance. Includes a vetted prompt library.', status: 'Under Review', version: 'v1', prepared_by: '00000000-0000-0000-0000-000000000002', reviewed_by: null, delivery_date: null, file_url: '#', visibility: 'Internal Only', notes: 'Awaiting review from research department head.', created_at: tsAgo(360), updated_at: tsAgo(96), deleted_at: null },
  { id: 'dddd0003', title: 'AI Ethics for Higher Education', audience: 'Faculty', department: 'Cross-college', training_category: 'AI Ethics', description: 'Practical AI ethics for university settings — academic integrity, data privacy, bias awareness.', status: 'Delivered', version: 'v1.0', prepared_by: '00000000-0000-0000-0000-000000000002', reviewed_by: DEMO_PROFILE_ID, delivery_date: daysAgo(30), file_url: '#', visibility: 'Public', notes: null, created_at: tsAgo(960), updated_at: tsAgo(240), deleted_at: null },
  { id: 'dddd0004', title: 'AI Tools for Workload Management', audience: 'Admin Staff', department: 'Admin', training_category: 'AI for Workload Management', description: 'AI tools that save time on common admin tasks — meeting notes, email drafts, document summarisation.', status: 'Draft', version: 'v0.3', prepared_by: '00000000-0000-0000-0000-000000000004', reviewed_by: null, delivery_date: null, file_url: null, visibility: 'Internal Only', notes: 'Early draft. Need to vet specific tools for institutional use.', created_at: tsAgo(120), updated_at: tsAgo(72), deleted_at: null },
  { id: 'dddd0005', title: 'Department AI Use-Case Workshop', audience: 'Department Specific', department: 'Engineering', training_category: 'Department Use Cases', description: 'Half-day workshop tailored to engineering faculty — discipline-specific AI applications.', status: 'Final', version: 'v1.2', prepared_by: '00000000-0000-0000-0000-000000000003', reviewed_by: DEMO_PROFILE_ID, delivery_date: daysFromNow(7), file_url: '#', visibility: 'Internal Only', notes: 'Scheduled for next Saturday.', created_at: tsAgo(480), updated_at: tsAgo(24), deleted_at: null }
]

export const DEMO_DOCUMENTS = [
  { id: 'eeee0001', title: 'CoE AI Charter', category: 'Policy', project_id: null, description: 'Mission, scope, and operating principles of the Centre of Excellence for AI at SGT University.', file_url: '#', visibility: 'Public', uploaded_by: DEMO_PROFILE_ID, version: 'v1.0', created_at: tsAgo(2160), updated_at: tsAgo(720), deleted_at: null },
  { id: 'eeee0002', title: 'Faculty Training Sprint — PRD', category: 'PRD', project_id: '11111111-1111-1111-1111-111111111111', description: 'Internal PRD for the faculty training sprint. Module structure, success metrics, rollout plan.', file_url: '#', visibility: 'Internal Only', uploaded_by: DEMO_PROFILE_ID, version: 'v1.2', created_at: tsAgo(480), updated_at: tsAgo(120), deleted_at: null },
  { id: 'eeee0003', title: 'AI Ethics Guidelines', category: 'Policy', project_id: null, description: 'Institutional guidelines on AI use for teaching, assessment, and research.', file_url: '#', visibility: 'Public', uploaded_by: '00000000-0000-0000-0000-000000000002', version: 'v1.0', created_at: tsAgo(960), updated_at: tsAgo(240), deleted_at: null },
  { id: 'eeee0004', title: 'CRM Vendor Comparison Matrix', category: 'Report', project_id: '55555555-5555-5555-5555-555555555555', description: 'Detailed comparison of three CRM vendors. Pricing, features, integration, SLAs.', file_url: '#', visibility: 'Restricted', uploaded_by: DEMO_PROFILE_ID, version: 'v1.0', created_at: tsAgo(240), updated_at: tsAgo(48), deleted_at: null },
  { id: 'eeee0005', title: 'Student AI Curriculum — Draft v2', category: 'Proposal', project_id: '44444444-4444-4444-4444-444444444444', description: 'Cross-college AI elective curriculum draft v2.', file_url: '#', visibility: 'Internal Only', uploaded_by: '00000000-0000-0000-0000-000000000002', version: 'v2', created_at: tsAgo(168), updated_at: tsAgo(48), deleted_at: null },
  { id: 'eeee0006', title: 'AI for Workload Management — Workshop Slides', category: 'Training Material', project_id: null, description: 'Slides from the AI workload management workshop for admin staff.', file_url: '#', visibility: 'Public', uploaded_by: '00000000-0000-0000-0000-000000000004', version: 'v1.0', created_at: tsAgo(120), updated_at: tsAgo(72), deleted_at: null }
]

export const DEMO_FEEDBACK = [
  { id: 'ffff0001', name: 'Priya Singh', email: 'priya.s@example.com', role: 'Faculty', department_or_org: 'Liberal Arts', category: 'Training Request', message: 'Would love a session on using AI for designing humanities assessments — beyond just multiple choice. Looking for things that test deeper understanding.', attachment_url: null, status: 'New', assigned_to: null, admin_notes: null, source_ip: null, created_at: tsAgo(2), updated_at: tsAgo(2) },
  { id: 'ffff0002', name: 'Karan Mehta', email: 'karan.m@example.com', role: 'Student', department_or_org: 'Engineering — CSE', category: 'Project Idea', message: 'Idea: an AI tutor for SGT students that knows our curriculum and can answer questions about specific subjects. Could really help with self-study.', attachment_url: null, status: 'Reviewed', assigned_to: '00000000-0000-0000-0000-000000000003', admin_notes: 'Good idea, aligns with student AI readiness initiative. Discussing in next planning session.', source_ip: null, created_at: tsAgo(48), updated_at: tsAgo(24) },
  { id: 'ffff0003', name: 'Dr. Vikram Rao', email: 'vikram.r@example.com', role: 'Faculty', department_or_org: 'Research', category: 'Collaboration', message: 'Our research lab would love to collaborate on a project using LLMs for systematic literature reviews. We have funding and a clear use case.', attachment_url: null, status: 'In Progress', assigned_to: '00000000-0000-0000-0000-000000000002', admin_notes: 'Meeting scheduled for next week. High-potential collaboration.', source_ip: null, created_at: tsAgo(72), updated_at: tsAgo(36) },
  { id: 'ffff0004', name: 'Anonymous', email: 'anon@example.com', role: 'Staff', department_or_org: 'Admin', category: 'Suggestion', message: 'The workshop on AI tools for workload management was excellent. Could you make it a recurring session for new admin staff?', attachment_url: null, status: 'Resolved', assigned_to: DEMO_PROFILE_ID, admin_notes: 'Added to recurring schedule.', source_ip: null, created_at: tsAgo(168), updated_at: tsAgo(120) }
]

export const DEMO_ACTIVITY = [
  { id: 'gggg0001', user_id: DEMO_PROFILE_ID, user_email: 'deepak.ai@sgtuniversity.org', action: 'project.updated', entity_type: 'project', entity_id: '11111111-1111-1111-1111-111111111111', entity_label: 'Faculty AI Training Sprint', metadata: { latest_update: true }, created_at: tsAgo(2) },
  { id: 'gggg0002', user_id: '00000000-0000-0000-0000-000000000003', user_email: 'ananya.ai@sgtuniversity.org', action: 'task.status_changed', entity_type: 'task', entity_id: 'aaaa0007', entity_label: 'Beta feedback synthesis', metadata: { to: 'Doing' }, created_at: tsAgo(3) },
  { id: 'gggg0003', user_id: DEMO_PROFILE_ID, user_email: 'deepak.ai@sgtuniversity.org', action: 'project.published', entity_type: 'project', entity_id: '33333333-3333-3333-3333-333333333333', entity_label: 'AI Question Paper Assistant', metadata: { status: 'Published' }, created_at: tsAgo(4) },
  { id: 'gggg0004', user_id: '00000000-0000-0000-0000-000000000002', user_email: 'nikhil.ai@sgtuniversity.org', action: 'document.uploaded', entity_type: 'document', entity_id: 'eeee0005', entity_label: 'Student AI Curriculum — Draft v2', metadata: {}, created_at: tsAgo(48) },
  { id: 'gggg0005', user_id: DEMO_PROFILE_ID, user_email: 'deepak.ai@sgtuniversity.org', action: 'meeting.created', entity_type: 'meeting', entity_id: 'bbbb0004', entity_label: 'Student AI Curriculum — Dean Sync', metadata: {}, created_at: tsAgo(72) },
  { id: 'gggg0006', user_id: '00000000-0000-0000-0000-000000000004', user_email: 'rohan.ai@sgtuniversity.org', action: 'task.created', entity_type: 'task', entity_id: 'aaaa0010', entity_label: 'Data access request to IT', metadata: {}, created_at: tsAgo(96) },
  { id: 'gggg0007', user_id: '00000000-0000-0000-0000-000000000003', user_email: 'ananya.ai@sgtuniversity.org', action: 'training.updated', entity_type: 'training_module', entity_id: 'dddd0005', entity_label: 'Department AI Use-Case Workshop', metadata: {}, created_at: tsAgo(120) },
  { id: 'gggg0008', user_id: DEMO_PROFILE_ID, user_email: 'deepak.ai@sgtuniversity.org', action: 'feedback.updated', entity_type: 'feedback', entity_id: 'ffff0004', entity_label: 'Anonymous', metadata: { status: 'Resolved' }, created_at: tsAgo(144) },
  { id: 'gggg0009', user_id: '00000000-0000-0000-0000-000000000002', user_email: 'nikhil.ai@sgtuniversity.org', action: 'task.created_from_mom', entity_type: 'task', entity_id: 'aaaa0006', entity_label: 'TCO comparison Vendor A vs B', metadata: { from_action_item: 'cccc0004' }, created_at: tsAgo(192) },
  { id: 'gggg0010', user_id: DEMO_PROFILE_ID, user_email: 'deepak.ai@sgtuniversity.org', action: 'project.created', entity_type: 'project', entity_id: '77777777-7777-7777-7777-777777777777', entity_label: 'Admissions Funnel Intelligence', metadata: {}, created_at: tsAgo(240) }
]

// Views (derived from tables)
export const DEMO_PUBLIC_PROJECTS = DEMO_PROJECTS
  .filter(p => p.is_public && !p.deleted_at)
  .map(p => ({
    id: p.id, title: p.title, slug: p.slug, short_code: p.short_code,
    public_description: p.public_description, public_impact_statement: p.public_impact_statement,
    project_type: p.project_type, status: p.status, department: p.department,
    target_date: p.target_date, completion_date: p.completion_date, updated_at: p.updated_at
  }))

export const DEMO_PUBLIC_TEAM = DEMO_PROFILES
  .filter(p => p.show_on_public_team && p.is_active)
  .map(p => ({
    id: p.id, full_name: p.full_name, department: p.department, designation: p.designation,
    public_bio: p.public_bio, public_photo_url: p.public_photo_url
  }))

export const DEMO_PUBLIC_RESOURCES = [
  ...DEMO_DOCUMENTS.filter(d => d.visibility === 'Public' && !d.deleted_at).map(d => ({
    kind: 'document', id: d.id, title: d.title, category: d.category,
    description: d.description, file_url: d.file_url, updated_at: d.updated_at
  })),
  ...DEMO_TRAINING.filter(t => t.visibility === 'Public' && ['Final', 'Delivered'].includes(t.status) && !t.deleted_at).map(t => ({
    kind: 'training', id: t.id, title: t.title, category: t.training_category,
    description: t.description, file_url: t.file_url, updated_at: t.updated_at
  }))
].sort((a, b) => (a.updated_at < b.updated_at ? 1 : -1))

export const DEMO_TABLES: Record<string, any[]> = {
  profiles: DEMO_PROFILES,
  projects: DEMO_PROJECTS,
  tasks: DEMO_TASKS,
  meetings: DEMO_MEETINGS,
  meeting_action_items: DEMO_ACTION_ITEMS,
  training_modules: DEMO_TRAINING,
  documents: DEMO_DOCUMENTS,
  feedback: DEMO_FEEDBACK,
  activity_logs: DEMO_ACTIVITY,
  public_projects: DEMO_PUBLIC_PROJECTS,
  public_team: DEMO_PUBLIC_TEAM,
  public_resources: DEMO_PUBLIC_RESOURCES
}

export const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

export const DEMO_USER = {
  id: DEMO_PROFILE_ID,
  email: 'deepak.ai@sgtuniversity.org',
  full_name: 'Deepak Meena',
  department: 'Centre of Excellence for AI',
  designation: 'Head, CoE AI',
  is_active: true,
  show_on_public_team: true,
  public_bio: null,
  public_photo_url: null
}
