export type DecisionContext = "claim" | "case" | "policy" | "escalation" | "underwriting";

export type ScenarioKind =
  | "approve_settlement"
  | "escalate_underwriting"
  | "request_evidence"
  | "initiate_legal"
  | "reopen_investigation"
  | "deny"
  | "partial_settle"
  | "extend_sla"
  | "transfer_specialist";

export type TradeoffCategory =
  | "speed"
  | "risk"
  | "compliance"
  | "customer_satisfaction"
  | "financial_exposure"
  | "workload"
  | "reputation";

export type Severity = "low" | "medium" | "high" | "critical";
export type Impact = "positive" | "neutral" | "negative";
export type Likelihood = "unlikely" | "possible" | "likely" | "very_likely";

export interface Tradeoff {
  id: string;
  category: TradeoffCategory;
  label: string;
  impact: Impact;
  severity: Severity;
  note?: string;
}

export interface ProjectedOutcome {
  id: string;
  description: string;
  likelihood: Likelihood;
  operationalImpact: string;
  tone?: Impact;
}

export interface UncertaintySignal {
  id: string;
  type: "missing_info" | "conflict" | "interpretation" | "dependency" | "data_quality";
  description: string;
  confidenceImpact: number; // negative integer, e.g. -15
}

export interface ScenarioDependency {
  id: string;
  label: string;
  status: "ready" | "pending" | "blocked";
  note?: string;
}

export interface ReasoningSignal {
  id: string;
  label: string;
  weight: number; // 0-100
  note?: string;
  source?: string;
}

export interface DecisionScenario {
  id: string;
  kind: ScenarioKind;
  title: string;
  summary: string;
  recommended?: boolean;
  confidence: number; // 0-100
  slaImpact: string;
  customerImpact: string;
  financialExposure: string;
  operationalImpact: string;
  tradeoffs: Tradeoff[];
  dependencies: ScenarioDependency[];
  projectedOutcomes: ProjectedOutcome[];
  uncertainties: UncertaintySignal[];
  reasoning: ReasoningSignal[];
  assumptions: string[];
  unresolvedRisks: string[];
  requiresHumanReview: boolean;
  reviewLevel?: "supervisor" | "underwriter" | "legal" | "compliance" | "claims_lead";
  nextSteps: string[];
}

export interface DecisionSupportBundle {
  id: string;
  context: DecisionContext;
  entityId: string;
  title: string;
  summary: string;
  generatedAt: string;
  scenarios: DecisionScenario[];
  matrixCriteria?: DecisionMatrixCriterion[];
}

export interface DecisionMatrixCriterion {
  id: string;
  label: string;
  weight: number; // 0-100
  /** scenarioId -> score 0-100 */
  scores: Record<string, number>;
}
