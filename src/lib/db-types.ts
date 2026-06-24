// Hand-written types matching the migration. Keep in sync with supabase/migrations/0001_init.sql.

export type ProjectStatus = 'Idea'|'Planned'|'In Progress'|'Testing'|'Live'|'Paused'|'Closed'
export type Priority = 'High'|'Medium'|'Low'
export type ProjectType =
  | 'Internal Operations'|'Faculty Training'|'Student Initiative'|'AI Product'
  | 'Research'|'Automation'|'Data Intelligence'|'Public Initiative'|'Collaboration'
export type PublicVisibility = 'Private'|'Public Draft'|'Pending Approval'|'Published'|'Unpublished'
export type TaskStatus = 'To Do'|'Doing'|'Review'|'Blocked'|'Done'
export type MeetingType =
  | 'Internal CoE Meeting'|'Leadership Review'|'Department Meeting'
  | 'Faculty Training Planning'|'Project Review'|'Vendor/Partner Discussion'
  | 'Student Initiative Meeting'|'Other'
export type TrainingAudience = 'Faculty'|'Students'|'Admin Staff'|'Leadership'|'Department Specific'|'General Public'
export type TrainingCategory =
  | 'AI Basics'|'AI for Teaching'|'AI for Research'|'AI for Workload Management'
  | 'AI Tools'|'Prompting'|'AI Ethics'|'Department Use Cases'|'Hands-on Workshop'
export type TrainingStatusT = 'Draft'|'Under Review'|'Final'|'Delivered'|'Archived'
export type DocCategory = 'PRD'|'Report'|'Proposal'|'Training Material'|'MoM Attachment'|'Policy'|'SOP'|'Template'|'Research'|'Other'
export type DocVisibility = 'Internal Only'|'Public'|'Restricted'
export type FeedbackCategory = 'Suggestion'|'Collaboration'|'Issue'|'Training Request'|'Project Idea'|'General Feedback'
export type FeedbackStatusT = 'New'|'Reviewed'|'In Progress'|'Resolved'|'Ignored'
export type ActionItemStatus = 'Open'|'In Progress'|'Done'|'Cancelled'

export type Project = {
  id: string; title: string; slug: string; short_code: string | null
  internal_description: string | null; public_description: string | null
  project_type: ProjectType
  owner_id: string | null; department: string | null
  status: ProjectStatus; priority: Priority
  start_date: string | null; target_date: string | null; completion_date: string | null
  current_blocker: string | null; latest_update: string | null; internal_notes: string | null
  public_visibility_status: PublicVisibility; public_impact_statement: string | null
  is_public: boolean
  created_by: string | null; updated_by: string | null
  created_at: string; updated_at: string; deleted_at: string | null
}

export type Task = {
  id: string; project_id: string | null; title: string; description: string | null
  assigned_to: string | null; created_by: string | null
  status: TaskStatus; priority: Priority
  due_date: string | null; completion_date: string | null
  blocker: string | null; remarks: string | null; attachment_url: string | null
  created_at: string; updated_at: string; deleted_at: string | null
}

export type Meeting = {
  id: string; title: string; meeting_date: string; meeting_type: MeetingType
  project_id: string | null; attendees: string[]
  agenda: string | null; summary: string | null; key_decisions: string | null
  next_steps: string | null; next_meeting_date: string | null
  created_by: string | null
  created_at: string; updated_at: string; deleted_at: string | null
}

export type MeetingActionItem = {
  id: string; meeting_id: string; task_id: string | null
  action_item: string; owner_id: string | null
  due_date: string | null; status: ActionItemStatus
  created_at: string; updated_at: string
}

export type TrainingModule = {
  id: string; title: string; audience: TrainingAudience; department: string | null
  training_category: TrainingCategory; description: string | null
  status: TrainingStatusT; version: string | null
  prepared_by: string | null; reviewed_by: string | null
  delivery_date: string | null; file_url: string | null
  visibility: DocVisibility; notes: string | null
  created_at: string; updated_at: string; deleted_at: string | null
}

export type Document = {
  id: string; title: string; category: DocCategory
  project_id: string | null; description: string | null
  file_url: string | null; visibility: DocVisibility
  uploaded_by: string | null; version: string | null
  created_at: string; updated_at: string; deleted_at: string | null
}

export type Feedback = {
  id: string; name: string; email: string; role: string | null
  department_or_org: string | null; category: FeedbackCategory
  message: string; attachment_url: string | null
  status: FeedbackStatusT; assigned_to: string | null; admin_notes: string | null
  created_at: string; updated_at: string
}

export type ActivityLog = {
  id: string; user_id: string | null; user_email: string | null
  action: string; entity_type: string; entity_id: string | null
  entity_label: string | null; metadata: Record<string, unknown>
  created_at: string
}

export type ProfileLite = { id: string; full_name: string; email: string }
