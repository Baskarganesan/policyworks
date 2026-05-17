export type PolicyType = "auto" | "home" | "health" | "life" | "commercial" | "umbrella";
export type PolicyStatus = "active" | "pending_renewal" | "lapsed" | "cancelled" | "in_review";

export const POLICY_TYPE_LABELS: Record<PolicyType, string> = {
  auto: "Auto",
  home: "Homeowners",
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
  in_review: "In Review",
};

export interface CoverageItem {
  id: string;
  category: string;
  description: string;
  limit: number;
  deductible: number;
  exclusions: string[];
  highlight?: "important" | "gap";
}

export interface Endorsement {
  id: string;
  name: string;
  addedAt: string;
  premiumDelta: number;
  status: "active" | "pending" | "expired";
  summary: string;
}

export interface PolicyDocumentRef {
  id: string;
  name: string;
  kind: "policy" | "rider" | "amendment" | "endorsement" | "renewal" | "certificate";
  sizeKb: number;
  uploadedAt: string;
  aiIndexed: "indexed" | "processing" | "failed";
}

export interface PolicyClaimRef {
  id: string;
  claimNumber: string;
  type: string;
  filedAt: string;
  amount: number;
  status: "open" | "under_review" | "approved" | "denied" | "closed";
  investigation?: boolean;
}

export interface RiskFlag {
  id: string;
  severity: "low" | "medium" | "high" | "critical";
  category: "coverage_gap" | "claims_frequency" | "endorsement_missing" | "expiring" | "exposure" | "underinsured";
  message: string;
  detail: string;
  confidence: number; // 0-100
}

export interface PolicyInsight {
  id: string;
  kind: "recommendation" | "observation" | "warning" | "trend";
  title: string;
  detail: string;
  confidence: number;
  source: string;
}

export interface RenewalMilestone {
  id: string;
  date: string;
  title: string;
  status: "complete" | "in_progress" | "blocked" | "pending";
  owner: string;
  detail?: string;
  blocker?: string;
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  actor: string;
  type: "update" | "claim" | "renewal" | "endorsement" | "ai_review" | "document" | "note";
  message: string;
}

export interface Policy {
  id: string;
  policyNumber: string;
  type: PolicyType;
  carrier: string;
  product: string;
  effectiveDate: string;
  renewalDate: string;
  status: PolicyStatus;
  coverageAmount: number;
  annualPremium: number;
  deductible: number;
  assignedAgent: string;
  customer: { id: string; name: string; email: string };
  insuredAsset: string;
  coverage: CoverageItem[];
  endorsements: Endorsement[];
  documents: PolicyDocumentRef[];
  claims: PolicyClaimRef[];
  riskFlags: RiskFlag[];
  insights: PolicyInsight[];
  renewalTimeline: RenewalMilestone[];
  activity: ActivityEvent[];
}
