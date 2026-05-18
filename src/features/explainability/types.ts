export type AuditActorKind = "user" | "system" | "ai" | "automation";

export interface AuditActor {
  name: string;
  kind: AuditActorKind;
  role?: string;
}

export type AuditEventType =
  | "document_uploaded"
  | "ai_review_completed"
  | "claim_created"
  | "claim_escalated"
  | "policy_updated"
  | "workflow_reassigned"
  | "risk_flag_generated"
  | "status_changed"
  | "note_added"
  | "renewal_extended"
  | "document_replaced"
  | "endorsement_added";

export interface AuditEvent {
  id: string;
  type: AuditEventType;
  actor: AuditActor;
  timestamp: string;
  entityType: "claim" | "policy" | "task" | "customer" | "document";
  entityId: string;
  summary: string;
  source?: string;
  metadata?: Record<string, string | number | boolean | null>;
}

export type TriggerStatus = "matched" | "partial" | "not_matched";

export interface TriggerCondition {
  id: string;
  condition: string;
  source: string;
  status: TriggerStatus;
  detail?: string;
}

export type SignalKind = "data" | "history" | "document" | "policy" | "geo" | "behavior";

export interface ContributingSignal {
  id: string;
  kind: SignalKind;
  label: string;
  weight: number; // 0-100 relative contribution
  detail?: string;
}

export interface SourceReference {
  id: string;
  kind: "document" | "policy" | "claim" | "customer" | "rule" | "dataset";
  label: string;
  reference: string;
  updatedAt?: string;
}

export interface ChangeRecord {
  id: string;
  field: string;
  before: string | null;
  after: string | null;
  changedBy: AuditActor;
  changedAt: string;
}

export interface DecisionTrace {
  id: string;
  trigger: string;
  triggerSource: string;
  confidence: number; // 0-100
  rationale: string;
  triggers: TriggerCondition[];
  signals: ContributingSignal[];
  sources: SourceReference[];
  events: AuditEvent[];
  changes?: ChangeRecord[];
  relatedEntities?: { type: AuditEvent["entityType"]; id: string; label: string }[];
  createdAt: string;
}

export interface ExplainabilitySubject {
  /** A short identifier of what we're explaining (insight id, alert id, flag id, etc.) */
  subjectId: string;
  /** Short label shown in the drawer header (e.g. "Flood endorsement missing") */
  title: string;
  /** Type of subject for picking the right mock trace generator */
  kind: "insight" | "alert" | "risk_flag" | "policy_insight" | "task_signal";
  /** Optional subtitle / category */
  category?: string;
  /** Optional severity hint to color the header */
  severity?: "low" | "medium" | "high" | "critical";
  /** Optional confidence to seed the trace */
  confidence?: number;
}
