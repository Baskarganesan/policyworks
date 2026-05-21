export type ExceptionSeverity = "low" | "medium" | "high" | "critical";

export type ExceptionStatus =
  | "active"
  | "waiting"
  | "escalated"
  | "resolved"
  | "reopened";

export type ExceptionType =
  | "sla_breach"
  | "missing_document"
  | "policy_conflict"
  | "duplicate_claim"
  | "adjuster_conflict"
  | "approval_bottleneck"
  | "customer_complaint"
  | "fraud_hold"
  | "compliance_review"
  | "settlement_threshold";

export type ExceptionEntityType = "case" | "claim" | "policy" | "customer" | "task" | "document";

export interface ExceptionEntityRef {
  type: ExceptionEntityType;
  id: string;
  label: string;
}

export type DependencyStatus = "waiting" | "overdue" | "received" | "in_progress";

export interface Dependency {
  id: string;
  description: string;
  owner: string;
  ownerType: "internal" | "customer" | "third_party" | "regulator";
  blockedSince: string;
  expectedResolution?: string;
  status: DependencyStatus;
  downstreamImpact?: string;
}

export type ApprovalStatus = "pending" | "approved" | "rejected" | "waiting" | "skipped";

export interface ApprovalStep {
  id: string;
  approver: string;
  role: string;
  status: ApprovalStatus;
  dueAt?: string;
  decidedAt?: string;
  note?: string;
}

export interface ConflictSignal {
  id: string;
  source: string;
  contradiction: string;
  confidence: number; // 0-100
  recommendation?: string;
}

export interface ConflictRecord {
  id: string;
  title: string;
  summary: string;
  signals: ConflictSignal[];
  recommendedPath?: string;
  escalationPath?: string;
}

export type EscalationEventKind =
  | "sla_breached"
  | "supervisor_assigned"
  | "legal_review"
  | "fraud_review"
  | "customer_escalation"
  | "compliance_review"
  | "approval_requested"
  | "approval_granted"
  | "reopened"
  | "note"
  | "reassigned";

export interface EscalationEvent {
  id: string;
  kind: EscalationEventKind;
  timestamp: string;
  actor: string;
  actorKind: "user" | "system" | "ai" | "automation" | "customer";
  description: string;
}

export interface OperationalException {
  id: string;
  reference: string;
  type: ExceptionType;
  severity: ExceptionSeverity;
  status: ExceptionStatus;
  title: string;
  summary: string;
  createdAt: string;
  updatedAt: string;
  owner: string;
  ownerRole?: string;
  slaDueAt?: string;
  ageHours: number;
  pressureScore: number; // 0-100
  dependencies: Dependency[];
  approvals?: ApprovalStep[];
  conflict?: ConflictRecord;
  timeline: EscalationEvent[];
  relatedEntities: ExceptionEntityRef[];
  recommendedActions: ResolutionAction[];
}

export type ResolutionActionKind =
  | "escalate_supervisor"
  | "request_override"
  | "reassign"
  | "trigger_legal"
  | "trigger_fraud"
  | "merge_duplicate"
  | "extend_sla"
  | "request_clarification"
  | "approve"
  | "reject"
  | "reopen";

export interface ResolutionAction {
  id: string;
  kind: ResolutionActionKind;
  label: string;
  priority: "primary" | "secondary";
  destructive?: boolean;
}
