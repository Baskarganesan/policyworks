export type CustomerStatus = "active" | "needs_attention" | "high_value" | "in_review";

export type PolicyType = "auto" | "home" | "health" | "life" | "commercial" | "umbrella";
export type PolicyStatus = "active" | "pending_renewal" | "lapsed" | "cancelled";

export interface CustomerPolicy {
  id: string;
  type: PolicyType;
  provider: string;
  policyNumber: string;
  premium: number;
  coverageLimit: number;
  renewalDate: string;
  status: PolicyStatus;
  coverageSummary: string;
}

export interface CustomerClaimSummary {
  id: string;
  type: string;
  status: "new" | "under_review" | "pending_documents" | "approved" | "rejected" | "closed";
  amount: number;
  filedAt: string;
  description: string;
}

export interface CustomerDocument {
  id: string;
  name: string;
  category: "policy" | "endorsement" | "claim" | "id" | "other";
  sizeKb: number;
  uploadedAt: string;
  status: "indexed" | "processing" | "failed";
}

export interface CustomerNote {
  id: string;
  author: string;
  message: string;
  timestamp: string;
  pinned?: boolean;
}

export type InteractionType = "call" | "email" | "meeting" | "sms" | "system";

export interface CustomerInteraction {
  id: string;
  type: InteractionType;
  summary: string;
  timestamp: string;
  actor: string;
}

export interface CustomerInsight {
  id: string;
  severity: "info" | "warning" | "critical" | "opportunity";
  title: string;
  detail: string;
}

export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  assignedAgent: string;
  status: CustomerStatus;
  tags: string[];
  customerSince: string;
  lifetimeValue: number;
  lastInteractionAt: string;
  policies: CustomerPolicy[];
  claims: CustomerClaimSummary[];
  documents: CustomerDocument[];
  notes: CustomerNote[];
  interactions: CustomerInteraction[];
  insights: CustomerInsight[];
}

export const CUSTOMER_STATUS_LABELS: Record<CustomerStatus, string> = {
  active: "Active",
  needs_attention: "Needs Attention",
  high_value: "High Value",
  in_review: "In Review",
};

export const POLICY_TYPE_LABELS: Record<PolicyType, string> = {
  auto: "Auto",
  home: "Home",
  health: "Health",
  life: "Life",
  commercial: "Commercial",
  umbrella: "Umbrella",
};

export const POLICY_STATUS_LABELS: Record<PolicyStatus, string> = {
  active: "Active",
  pending_renewal: "Pending Renewal",
  lapsed: "Lapsed",
  cancelled: "Cancelled",
};
