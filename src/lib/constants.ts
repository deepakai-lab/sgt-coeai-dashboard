export const PROJECT_STATUSES = ['Idea','Planned','In Progress','Testing','Live','Paused','Closed'] as const
export const PROJECT_PRIORITIES = ['High','Medium','Low'] as const
export const PROJECT_TYPES = [
  'Internal Operations','Faculty Training','Student Initiative','AI Product',
  'Research','Automation','Data Intelligence','Public Initiative','Collaboration'
] as const
export const PUBLIC_VISIBILITY = ['Private','Public Draft','Pending Approval','Published','Unpublished'] as const
export const TASK_STATUSES = ['To Do','Doing','Review','Blocked','Done'] as const
export const MEETING_TYPES = [
  'Internal CoE Meeting','Leadership Review','Department Meeting',
  'Faculty Training Planning','Project Review','Vendor/Partner Discussion',
  'Student Initiative Meeting','Other'
] as const
export const TRAINING_AUDIENCES = ['Faculty','Students','Admin Staff','Leadership','Department Specific','General Public'] as const
export const TRAINING_CATEGORIES = [
  'AI Basics','AI for Teaching','AI for Research','AI for Workload Management',
  'AI Tools','Prompting','AI Ethics','Department Use Cases','Hands-on Workshop'
] as const
export const TRAINING_STATUSES = ['Draft','Under Review','Final','Delivered','Archived'] as const
export const DOC_CATEGORIES = ['PRD','Report','Proposal','Training Material','MoM Attachment','Policy','SOP','Template','Research','Other'] as const
export const DOC_VISIBILITY = ['Internal Only','Public','Restricted'] as const
export const FEEDBACK_CATEGORIES = ['Suggestion','Collaboration','Issue','Training Request','Project Idea','General Feedback'] as const
export const FEEDBACK_STATUSES = ['New','Reviewed','In Progress','Resolved','Ignored'] as const
export const ACTION_ITEM_STATUSES = ['Open','In Progress','Done','Cancelled'] as const

export const INITIATIVES = [
  { slug: 'faculty-ai-training', title: 'Faculty AI Training', description: 'Practical AI upskilling for SGT faculty across teaching, research, and workload management.' },
  { slug: 'student-ai-readiness', title: 'Student AI Readiness', description: 'Equipping students with the AI fluency they will need in their careers.' },
  { slug: 'ai-for-operations', title: 'AI for University Operations', description: 'Internal automation across admissions, academics, and administration.' },
  { slug: 'ai-products', title: 'AI Products and Prototypes', description: 'Building practical AI products that solve real SGT problems.' },
  { slug: 'department-projects', title: 'Department AI Projects', description: 'Working with individual departments on their AI use cases.' },
  { slug: 'data-intelligence', title: 'Data Intelligence Initiatives', description: 'Surfacing decisions from the data the university already generates.' }
] as const
