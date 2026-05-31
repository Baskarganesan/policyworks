export type KnowledgeContext = "claim" | "case" | "policy" | "escalation" | "decision";

export type HistoricalOutcome =
  | "resolved_standard"
  | "resolved_supervisor"
  | "resolved_legal"
  | "settled_partial"
  | "denied"
  | "withdrawn"
  | "escalated_unresolved";

export type ResolutionPath =
  | "standard_workflow"
  | "supervisor_review"
  | "legal_review"
  | "underwriting_review"
  | "compliance_review"
  | "field_investigation"
  | "negotiated_settlement";

export interface HistoricalCase {
  id: string;
  reference: string;
  title: string;
  summary: string;
  similarityScore: number; // 0-100
  outcome: HistoricalOutcome;
  outcomeSummary: string;
  rationaleSummary: string;
  resolutionPath: ResolutionPath;
  timeToResolutionDays: number;
  closedAt: string;
  lessonsLearned: string[];
  matchedFactors: string[];
  auditReference?: string;
  ownerTeam?: string;
}

export type KnowledgeInsightType =
  | "best_practice"
  | "operational_pattern"
  | "known_risk"
  | "frequent_blocker"
  | "compliance_note";

export interface KnowledgeInsight {
  id: string;
  type: KnowledgeInsightType;
  title: string;
  description: string;
  confidence: number; // 0-100
  relevance: number; // 0-100
  sourceCases: { id: string; reference: string }[];
  tags?: string[];
}

export interface PlaybookStep {
  id: string;
  order: number;
  title: string;
  detail: string;
  owner?: string;
  expectedDurationHours?: number;
}

export interface OperationalPlaybook {
  id: string;
  title: string;
  summary: string;
  appliesTo: string[];
  steps: PlaybookStep[];
  commonBlockers: string[];
  escalationTriggers: string[];
  averageResolutionDays?: number;
  successRate?: number; // 0-100
}

export interface ExpertNote {
  id: string;
  author: string;
  role: string;
  note: string;
  seniorityYears?: number;
  endorsements?: number;
  tags?: string[];
}

export interface InstitutionalMemoryBundle {
  context: KnowledgeContext;
  entityId: string;
  headline: string;
  summary: string;
  similarCases: HistoricalCase[];
  insights: KnowledgeInsight[];
  playbooks: OperationalPlaybook[];
  expertNotes: ExpertNote[];
}
