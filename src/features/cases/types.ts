export type CaseSeverity = "low" | "medium" | "high" | "critical";
export type CaseStatus = "open" | "in_review" | "blocked" | "escalated" | "resolved" | "closed";

export type CaseEntityType = "claim" | "policy" | "customer" | "document" | "task";

export interface CaseEntityRef {
  type: CaseEntityType;
  id: string;
  label: string;
  sublabel?: string;
}

export type CaseEventType =
  | "case_created"
  | "claim_filed"
  | "ai_insight"
  | "document_uploaded"
  | "document_requested"
  | "customer_message"
  | "internal_note"
  | "task_created"
  | "task_completed"
  | "status_changed"
  | "escalation"
  | "renewal_triggered"
  | "policy_updated"
  | "audit";

export type CaseEventActorKind = "user" | "system" | "ai" | "automation" | "customer";

export interface CaseEventActor {
  name: string;
  kind: CaseEventActorKind;
  role?: string;
}

export interface CaseEvent {
  id: string;
  type: CaseEventType;
  timestamp: string;
  actor: CaseEventActor;
  description: string;
  relatedEntity?: CaseEntityRef;
  source?: string;
}

export type CaseInsightSeverity = CaseSeverity;
export type CaseInsightCategory =
  | "fraud"
  | "coverage"
  | "compliance"
  | "sla"
  | "renewal"
  | "workflow"
  | "risk";

export interface CaseInsightAction {
  id: string;
  label: string;
  priority: "primary" | "secondary";
}

export interface CaseInsight {
  id: string;
  severity: CaseInsightSeverity;
  category: CaseInsightCategory;
  confidence: number; // 0-100
  title: string;
  explanation: string;
  suggestedActions: CaseInsightAction[];
  source?: string;
  triggers?: string[];
  relatedEntity?: CaseEntityRef;
}

export type CaseTaskStatus = "open" | "in_progress" | "blocked" | "waiting" | "done";
export type CaseTaskUrgency = "low" | "medium" | "high" | "critical";

export interface CaseTask {
  id: string;
  title: string;
  status: CaseTaskStatus;
  urgency: CaseTaskUrgency;
  assignee?: string;
  dueAt?: string;
  blocker?: string;
  dependsOn?: CaseEntityRef;
}

export type CaseDocumentStatus = "indexed" | "pending_review" | "missing" | "ai_reviewed";

export interface CaseDocument {
  id: string;
  name: string;
  kind: "contract" | "endorsement" | "photo" | "report" | "correspondence" | "evidence";
  status: CaseDocumentStatus;
  uploadedBy?: string;
  uploadedAt?: string;
  relatedEntity?: CaseEntityRef;
  aiSummary?: string;
}

export type CaseMessageChannel = "email" | "phone" | "portal" | "internal" | "sms";
export interface CaseMessage {
  id: string;
  channel: CaseMessageChannel;
  direction: "inbound" | "outbound" | "internal";
  author: CaseEventActor;
  timestamp: string;
  subject?: string;
  body: string;
  thread?: string;
}

export interface CaseSLA {
  label: string;
  dueAt: string;
  startedAt: string;
}

export interface CaseRecord {
  id: string;
  reference: string;
  title: string;
  summary: string;
  severity: CaseSeverity;
  status: CaseStatus;
  assignedTeam: string;
  assignedLead?: string;
  createdAt: string;
  updatedAt: string;
  sla: CaseSLA;
  relatedCustomer: CaseEntityRef;
  relatedPolicies: CaseEntityRef[];
  relatedClaims: CaseEntityRef[];
  relatedDocuments: CaseEntityRef[];
  relatedTasks: CaseEntityRef[];
  tasks: CaseTask[];
  insights: CaseInsight[];
  timeline: CaseEvent[];
  documents: CaseDocument[];
  messages: CaseMessage[];
  tags: string[];
}
