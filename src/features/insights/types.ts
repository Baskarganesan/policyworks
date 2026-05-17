export type InsightSeverity = "low" | "medium" | "high" | "critical";
export type InsightCategory =
  | "compliance"
  | "fraud"
  | "coverage"
  | "renewal"
  | "workflow"
  | "risk";

export type RelatedEntityType = "claim" | "policy" | "customer" | "document" | "task";

export type SuggestedActionType =
  | "request_document"
  | "escalate_review"
  | "assign_adjuster"
  | "start_renewal_review"
  | "notify_underwriting"
  | "open_related"
  | "schedule_followup"
  | "flag_compliance";

export interface SuggestedAction {
  id: string;
  label: string;
  actionType: SuggestedActionType;
  priority: "primary" | "secondary";
}

export interface CrossEntityRef {
  type: RelatedEntityType;
  id: string;
  label: string;
}

export interface OperationalInsight {
  id: string;
  category: InsightCategory;
  severity: InsightSeverity;
  confidence: number; // 0-100
  title: string;
  description: string;
  relatedEntityType: RelatedEntityType;
  relatedEntityId: string;
  links?: CrossEntityRef[];
  suggestedActions: SuggestedAction[];
  createdAt: string;
  source?: string;
}
