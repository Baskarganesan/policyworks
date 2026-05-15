export type ClaimStatus =
  | "new"
  | "under_review"
  | "pending_documents"
  | "approved"
  | "rejected"
  | "closed";

export type ClaimPriority = "low" | "medium" | "high" | "urgent";

export type ClaimPolicyType = "auto" | "home" | "health" | "life" | "commercial";

export type ClaimType =
  | "collision"
  | "theft"
  | "property_damage"
  | "medical"
  | "liability"
  | "natural_disaster";

export interface Claim {
  id: string;
  customerName: string;
  customerEmail: string;
  policyNumber: string;
  policyType: ClaimPolicyType;
  claimType: ClaimType;
  status: ClaimStatus;
  priority: ClaimPriority;
  assignedAgent: string;
  amount: number;
  description: string;
  incidentDate: string;
  createdAt: string;
  updatedAt: string;
  attachments: { id: string; name: string; sizeKb: number }[];
}

export interface ClaimComment {
  id: string;
  claimId: string;
  user: string;
  message: string;
  timestamp: string;
  internal: boolean;
}

export type TimelineEventType =
  | "created"
  | "document_uploaded"
  | "status_changed"
  | "note_added"
  | "agent_assigned"
  | "amount_updated";

export interface TimelineEvent {
  id: string;
  claimId: string;
  type: TimelineEventType;
  description: string;
  actor: string;
  timestamp: string;
}

export const STATUS_LABELS: Record<ClaimStatus, string> = {
  new: "New",
  under_review: "Under Review",
  pending_documents: "Pending Documents",
  approved: "Approved",
  rejected: "Rejected",
  closed: "Closed",
};

export const PRIORITY_LABELS: Record<ClaimPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

export const POLICY_TYPE_LABELS: Record<ClaimPolicyType, string> = {
  auto: "Auto",
  home: "Home",
  health: "Health",
  life: "Life",
  commercial: "Commercial",
};

export const CLAIM_TYPE_LABELS: Record<ClaimType, string> = {
  collision: "Collision",
  theft: "Theft",
  property_damage: "Property Damage",
  medical: "Medical",
  liability: "Liability",
  natural_disaster: "Natural Disaster",
};
