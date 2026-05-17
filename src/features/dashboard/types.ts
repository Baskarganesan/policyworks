export type MetricStatus = "neutral" | "info" | "success" | "warning" | "danger";

export interface DashboardMetric {
  id: string;
  label: string;
  value: number | string;
  trend?: number; // percentage change
  status: MetricStatus;
  hint?: string;
  iconKey:
    | "claims"
    | "review"
    | "expiring"
    | "indexing"
    | "overdue"
    | "ai";
}

export type AlertPriority = "critical" | "high" | "medium" | "info";

export interface OperationalAlert {
  id: string;
  type: string;
  priority: AlertPriority;
  message: string;
  detail?: string;
  relatedEntity?: { kind: "claim" | "policy" | "customer" | "document"; ref: string };
  actionLabel?: string;
}

export type ActivityEventType =
  | "claim_created"
  | "document_uploaded"
  | "ai_question"
  | "policy_updated"
  | "note_added"
  | "renewal_sent"
  | "claim_escalated";

export interface ActivityEvent {
  id: string;
  type: ActivityEventType;
  timestamp: string;
  actor: string;
  description: string;
  target?: string;
}

export type InsightCategory = "trend" | "risk" | "anomaly" | "opportunity";

export interface AIInsight {
  id: string;
  category: InsightCategory;
  title: string;
  message: string;
  confidence: number; // 0-100
  source?: string;
}

export interface WorkQueueItem {
  id: string;
  title: string;
  reference: string;
  customer: string;
  priority: "low" | "medium" | "high" | "urgent";
  dueDate: string;
  assignedTo: string;
  category: "claim" | "document" | "approval" | "escalation";
}

export type RenewalRisk = "low" | "medium" | "high";

export interface UpcomingRenewal {
  id: string;
  customer: string;
  policyType: string;
  policyNumber: string;
  renewalDate: string;
  coverageAmount: number;
  risk: RenewalRisk;
}

export type ClaimAttentionReason =
  | "stalled"
  | "missing_docs"
  | "escalated"
  | "high_value";

export interface ClaimAttentionItem {
  id: string;
  reference: string;
  customer: string;
  type: string;
  amount: number;
  reason: ClaimAttentionReason;
  ageDays: number;
  assignedTo: string;
}
