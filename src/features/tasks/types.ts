export type TaskPriority = "low" | "medium" | "high" | "urgent";

export type TaskStatus =
  | "open"
  | "in_progress"
  | "waiting_customer"
  | "blocked"
  | "completed";

export type WorkflowStage =
  | "intake"
  | "review"
  | "pending_docs"
  | "approval"
  | "completed";

export type WorkflowType =
  | "claim_review"
  | "policy_renewal"
  | "document_request"
  | "customer_followup"
  | "underwriting"
  | "compliance";

export interface ChecklistItem {
  id: string;
  label: string;
  done: boolean;
}

export interface TaskAttachment {
  id: string;
  name: string;
  sizeKb: number;
}

export interface TaskNote {
  id: string;
  author: string;
  message: string;
  timestamp: string;
}

export type TaskEventType =
  | "created"
  | "status_changed"
  | "assigned"
  | "comment_added"
  | "document_requested"
  | "customer_responded"
  | "claim_escalated"
  | "due_changed";

export interface WorkflowEvent {
  id: string;
  type: TaskEventType;
  timestamp: string;
  actor: string;
  description: string;
  taskId?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  assignedTo: string;
  assignedAvatar?: string;
  relatedCustomer: { id: string; name: string };
  relatedClaim?: { id: string; reference: string };
  relatedPolicy?: { id: string; number: string };
  workflowStage: WorkflowStage;
  workflowType: WorkflowType;
  checklist: ChecklistItem[];
  attachments: TaskAttachment[];
  notes: TaskNote[];
  timeline: WorkflowEvent[];
}

export interface AutomationSuggestion {
  id: string;
  title: string;
  trigger: string;
  action: string;
  category: "claims" | "policies" | "renewals" | "documents";
}

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  open: "Open",
  in_progress: "In Progress",
  waiting_customer: "Waiting on Customer",
  blocked: "Blocked",
  completed: "Completed",
};

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

export const WORKFLOW_STAGE_LABELS: Record<WorkflowStage, string> = {
  intake: "Intake",
  review: "Review",
  pending_docs: "Pending Docs",
  approval: "Approval",
  completed: "Completed",
};

export const WORKFLOW_TYPE_LABELS: Record<WorkflowType, string> = {
  claim_review: "Claim Review",
  policy_renewal: "Policy Renewal",
  document_request: "Document Request",
  customer_followup: "Customer Follow-up",
  underwriting: "Underwriting",
  compliance: "Compliance",
};

export const WORKFLOW_STAGES: WorkflowStage[] = [
  "intake",
  "review",
  "pending_docs",
  "approval",
  "completed",
];
