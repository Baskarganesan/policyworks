import type { DecisionContext, DecisionScenario, DecisionSupportBundle } from "./types";

const claimScenarios: DecisionScenario[] = [
  {
    id: "sc-approve",
    kind: "approve_settlement",
    title: "Approve settlement at adjuster estimate",
    summary:
      "Close the claim at the adjuster's recommended $42,500 figure within the next 24h.",
    recommended: true,
    confidence: 72,
    slaImpact: "Resolves 2 days inside SLA",
    customerImpact: "High — fast resolution, low friction",
    financialExposure: "$42,500 (within reserve band)",
    operationalImpact: "Frees adjuster capacity; closes 1 active blocker",
    tradeoffs: [
      { id: "t1", category: "speed", label: "Fastest path to close", impact: "positive", severity: "high" },
      { id: "t2", category: "customer_satisfaction", label: "Reduces complaint risk", impact: "positive", severity: "medium" },
      { id: "t3", category: "risk", label: "Limited fraud re-review", impact: "negative", severity: "medium", note: "Skips a second SIU pass" },
      { id: "t4", category: "financial_exposure", label: "Within reserve", impact: "neutral", severity: "low" },
    ],
    dependencies: [
      { id: "d1", label: "Adjuster final report", status: "ready" },
      { id: "d2", label: "Supervisor sign-off", status: "pending", note: "Required above $40k" },
    ],
    projectedOutcomes: [
      { id: "o1", description: "Claim closed cleanly", likelihood: "very_likely", operationalImpact: "Queue -1", tone: "positive" },
      { id: "o2", description: "Customer NPS uplift", likelihood: "likely", operationalImpact: "Reduces inbound calls", tone: "positive" },
      { id: "o3", description: "Dispute reopened later", likelihood: "unlikely", operationalImpact: "Possible rework", tone: "negative" },
    ],
    uncertainties: [
      { id: "u1", type: "interpretation", description: "Endorsement wording on contents coverage is ambiguous", confidenceImpact: -10 },
      { id: "u2", type: "data_quality", description: "Receipts older than 6 months, value depreciation estimated", confidenceImpact: -8 },
    ],
    reasoning: [
      { id: "r1", label: "Documentation completeness", weight: 80, source: "Doc index" },
      { id: "r2", label: "Adjuster confidence", weight: 75, source: "Field report" },
      { id: "r3", label: "Similar resolved claims", weight: 65, source: "Benchmark" },
      { id: "r4", label: "Customer history", weight: 55, source: "CRM" },
    ],
    assumptions: [
      "Adjuster estimate reflects current replacement cost",
      "No additional damages will be reported in next 14 days",
    ],
    unresolvedRisks: ["Possible contents undervaluation", "Late vendor invoice could exceed reserve"],
    requiresHumanReview: true,
    reviewLevel: "supervisor",
    nextSteps: ["Request supervisor sign-off", "Notify customer of settlement offer", "Close blocker BLK-204"],
  },
  {
    id: "sc-evidence",
    kind: "request_evidence",
    title: "Request additional evidence before settling",
    summary:
      "Hold settlement pending updated receipts and a second contractor estimate.",
    confidence: 64,
    slaImpact: "Pushes SLA by ~3 business days",
    customerImpact: "Medium — introduces a wait, may frustrate",
    financialExposure: "Likely $38k–$45k range",
    operationalImpact: "Keeps claim open; adds review cycle",
    tradeoffs: [
      { id: "t1", category: "risk", label: "Reduces undervaluation risk", impact: "positive", severity: "medium" },
      { id: "t2", category: "compliance", label: "Stronger audit trail", impact: "positive", severity: "medium" },
      { id: "t3", category: "speed", label: "Slower resolution", impact: "negative", severity: "medium" },
      { id: "t4", category: "customer_satisfaction", label: "Possible complaint", impact: "negative", severity: "low" },
    ],
    dependencies: [
      { id: "d1", label: "Customer to upload receipts", status: "pending" },
      { id: "d2", label: "Second contractor estimate", status: "pending", note: "ETA 2–4 days" },
    ],
    projectedOutcomes: [
      { id: "o1", description: "Settlement amount adjusted within ±$3k", likelihood: "likely", operationalImpact: "Reserve update", tone: "neutral" },
      { id: "o2", description: "Customer escalation to supervisor", likelihood: "possible", operationalImpact: "+1 escalation", tone: "negative" },
      { id: "o3", description: "Reveals fraud indicators", likelihood: "unlikely", operationalImpact: "Triggers SIU", tone: "neutral" },
    ],
    uncertainties: [
      { id: "u1", type: "missing_info", description: "Receipts for high-value items missing", confidenceImpact: -12 },
    ],
    reasoning: [
      { id: "r1", label: "Documentation gaps", weight: 70 },
      { id: "r2", label: "Reserve sensitivity", weight: 60 },
      { id: "r3", label: "Audit posture", weight: 50 },
    ],
    assumptions: ["Customer is responsive within 72h"],
    unresolvedRisks: ["SLA breach if evidence delayed"],
    requiresHumanReview: false,
    nextSteps: ["Send documentation request", "Schedule contractor visit"],
  },
  {
    id: "sc-escalate",
    kind: "escalate_underwriting",
    title: "Escalate to underwriting review",
    summary:
      "Route to underwriting to re-confirm endorsement applicability before any settlement.",
    confidence: 58,
    slaImpact: "Likely SLA breach by 1–2 days",
    customerImpact: "Low — limited visibility",
    financialExposure: "Unchanged until decision",
    operationalImpact: "Adds underwriting workload; blocks closure",
    tradeoffs: [
      { id: "t1", category: "compliance", label: "Resolves interpretation risk", impact: "positive", severity: "high" },
      { id: "t2", category: "speed", label: "Delays closure", impact: "negative", severity: "high" },
      { id: "t3", category: "workload", label: "Underwriting capacity", impact: "negative", severity: "medium" },
    ],
    dependencies: [
      { id: "d1", label: "Underwriting queue capacity", status: "blocked", note: "3 reviews ahead" },
    ],
    projectedOutcomes: [
      { id: "o1", description: "Coverage reaffirmed", likelihood: "likely", operationalImpact: "Resume settlement", tone: "positive" },
      { id: "o2", description: "Coverage scope reduced", likelihood: "possible", operationalImpact: "Lower payout", tone: "neutral" },
    ],
    uncertainties: [
      { id: "u1", type: "conflict", description: "Endorsement language conflicts with policy schedule", confidenceImpact: -18 },
    ],
    reasoning: [
      { id: "r1", label: "Policy language conflict", weight: 85 },
      { id: "r2", label: "Underwriting precedent", weight: 60 },
    ],
    assumptions: ["Underwriting team available within 48h"],
    unresolvedRisks: ["Customer frustration during hold"],
    requiresHumanReview: true,
    reviewLevel: "underwriter",
    nextSteps: ["Open UW review ticket", "Notify customer of brief review"],
  },
  {
    id: "sc-legal",
    kind: "initiate_legal",
    title: "Initiate legal review",
    summary:
      "Engage legal due to liability ambiguity and prior litigation history on this policy.",
    confidence: 41,
    slaImpact: "SLA paused pending legal opinion",
    customerImpact: "Low — formal posture",
    financialExposure: "Potentially expands if disputed",
    operationalImpact: "Adds legal workflow; long cycle time",
    tradeoffs: [
      { id: "t1", category: "compliance", label: "Maximum protection", impact: "positive", severity: "high" },
      { id: "t2", category: "speed", label: "Significant delay", impact: "negative", severity: "high" },
      { id: "t3", category: "reputation", label: "Possible signal of dispute", impact: "negative", severity: "medium" },
    ],
    dependencies: [
      { id: "d1", label: "Legal intake form", status: "ready" },
      { id: "d2", label: "Outside counsel availability", status: "pending" },
    ],
    projectedOutcomes: [
      { id: "o1", description: "Higher likelihood of dispute resolution", likelihood: "possible", operationalImpact: "Long cycle", tone: "neutral" },
      { id: "o2", description: "Lower fraud exposure", likelihood: "likely", operationalImpact: "Stronger posture", tone: "positive" },
    ],
    uncertainties: [
      { id: "u1", type: "interpretation", description: "Liability allocation unclear between parties", confidenceImpact: -22 },
    ],
    reasoning: [
      { id: "r1", label: "Liability ambiguity", weight: 75 },
      { id: "r2", label: "Prior litigation history", weight: 65 },
    ],
    assumptions: ["Counsel can engage within 5 business days"],
    unresolvedRisks: ["Cost escalation", "Customer churn"],
    requiresHumanReview: true,
    reviewLevel: "legal",
    nextSteps: ["File legal intake", "Pause customer communication on settlement"],
  },
];

const caseScenarios: DecisionScenario[] = [
  {
    id: "case-sc-coord",
    kind: "transfer_specialist",
    title: "Assign coastal-loss specialist team",
    summary: "Coordinate all linked claims under a single specialist owner for consistency.",
    recommended: true,
    confidence: 78,
    slaImpact: "Stabilizes SLA across 3 linked claims",
    customerImpact: "High — single point of contact",
    financialExposure: "Neutral",
    operationalImpact: "Consolidates ownership; reduces handoffs",
    tradeoffs: [
      { id: "t1", category: "workload", label: "Concentrates load on one team", impact: "negative", severity: "medium" },
      { id: "t2", category: "customer_satisfaction", label: "Improves coherence", impact: "positive", severity: "high" },
      { id: "t3", category: "risk", label: "Reduces conflicting decisions", impact: "positive", severity: "high" },
    ],
    dependencies: [
      { id: "d1", label: "Specialist team capacity", status: "ready" },
    ],
    projectedOutcomes: [
      { id: "o1", description: "Faster aggregate resolution", likelihood: "likely", operationalImpact: "Queue -3", tone: "positive" },
      { id: "o2", description: "Increased workload on specialist team", likelihood: "very_likely", operationalImpact: "Capacity strain", tone: "negative" },
    ],
    uncertainties: [
      { id: "u1", type: "dependency", description: "FEMA report still pending for two claims", confidenceImpact: -10 },
    ],
    reasoning: [
      { id: "r1", label: "Linked claim count", weight: 70 },
      { id: "r2", label: "Geo-risk pattern match", weight: 65 },
      { id: "r3", label: "Specialist availability", weight: 60 },
    ],
    assumptions: ["Specialist team has bandwidth this week"],
    unresolvedRisks: ["Single-team key-person risk"],
    requiresHumanReview: true,
    reviewLevel: "claims_lead",
    nextSteps: ["Reassign 3 linked claims", "Brief specialist lead"],
  },
  {
    id: "case-sc-hold",
    kind: "extend_sla",
    title: "Hold pending external evidence",
    summary: "Extend SLAs across linked claims until FEMA and contractor reports land.",
    confidence: 55,
    slaImpact: "Documented SLA extension of 5 days",
    customerImpact: "Medium — requires proactive outreach",
    financialExposure: "Unchanged",
    operationalImpact: "Preserves quality at cost of cycle time",
    tradeoffs: [
      { id: "t1", category: "compliance", label: "Cleaner audit trail", impact: "positive", severity: "medium" },
      { id: "t2", category: "speed", label: "Slows resolution", impact: "negative", severity: "high" },
    ],
    dependencies: [
      { id: "d1", label: "FEMA disaster report", status: "blocked", note: "Federal ETA 4–6 days" },
    ],
    projectedOutcomes: [
      { id: "o1", description: "Higher decision quality", likelihood: "likely", operationalImpact: "Lower rework", tone: "positive" },
      { id: "o2", description: "Customer complaints rise", likelihood: "possible", operationalImpact: "Inbound +", tone: "negative" },
    ],
    uncertainties: [
      { id: "u1", type: "missing_info", description: "FEMA disaster declaration not finalized", confidenceImpact: -15 },
    ],
    reasoning: [
      { id: "r1", label: "Evidence completeness", weight: 70 },
      { id: "r2", label: "External dependency", weight: 60 },
    ],
    assumptions: ["External reports arrive within 6 days"],
    unresolvedRisks: ["SLA breach if FEMA delays further"],
    requiresHumanReview: false,
    nextSteps: ["Document SLA extension", "Send proactive customer update"],
  },
];

const policyScenarios: DecisionScenario[] = [
  {
    id: "pol-sc-renew",
    kind: "approve_settlement",
    title: "Renew with rate adjustment",
    summary: "Renew the policy with a moderate premium increase reflecting recent risk signals.",
    recommended: true,
    confidence: 68,
    slaImpact: "Within renewal window",
    customerImpact: "Medium — rate change requires explanation",
    financialExposure: "Improves loss ratio outlook",
    operationalImpact: "Standard renewal workflow",
    tradeoffs: [
      { id: "t1", category: "financial_exposure", label: "Improves margin", impact: "positive", severity: "high" },
      { id: "t2", category: "customer_satisfaction", label: "Rate increase friction", impact: "negative", severity: "medium" },
    ],
    dependencies: [
      { id: "d1", label: "Underwriting sign-off", status: "ready" },
    ],
    projectedOutcomes: [
      { id: "o1", description: "Retention likely with explanation", likelihood: "likely", operationalImpact: "Standard cycle", tone: "positive" },
      { id: "o2", description: "Possible churn to competitor", likelihood: "possible", operationalImpact: "-1 policy", tone: "negative" },
    ],
    uncertainties: [
      { id: "u1", type: "data_quality", description: "Recent loss data only partially loaded", confidenceImpact: -8 },
    ],
    reasoning: [
      { id: "r1", label: "Loss-ratio trend", weight: 75 },
      { id: "r2", label: "Geo-risk exposure", weight: 60 },
      { id: "r3", label: "Customer tenure", weight: 50 },
    ],
    assumptions: ["No new losses in next 30 days"],
    unresolvedRisks: ["Competitive rate undercutting"],
    requiresHumanReview: true,
    reviewLevel: "underwriter",
    nextSteps: ["Draft renewal package", "Schedule customer call"],
  },
  {
    id: "pol-sc-nonrenew",
    kind: "deny",
    title: "Non-renew at end of term",
    summary: "Decline renewal due to elevated, persistent risk signals on this policy.",
    confidence: 47,
    slaImpact: "Requires notice within regulatory window",
    customerImpact: "High — customer loses coverage",
    financialExposure: "Removes ongoing exposure",
    operationalImpact: "Triggers compliance notification workflow",
    tradeoffs: [
      { id: "t1", category: "risk", label: "Removes loss exposure", impact: "positive", severity: "high" },
      { id: "t2", category: "reputation", label: "Negative customer experience", impact: "negative", severity: "high" },
      { id: "t3", category: "compliance", label: "Strict notice rules", impact: "neutral", severity: "medium" },
    ],
    dependencies: [
      { id: "d1", label: "Compliance review", status: "pending" },
      { id: "d2", label: "Regulator notice template", status: "ready" },
    ],
    projectedOutcomes: [
      { id: "o1", description: "Lower fraud exposure", likelihood: "likely", operationalImpact: "Cleaner book", tone: "positive" },
      { id: "o2", description: "Complaint or regulator inquiry", likelihood: "possible", operationalImpact: "+1 review", tone: "negative" },
    ],
    uncertainties: [
      { id: "u1", type: "interpretation", description: "Underwriting guidelines updated 30 days ago; precedent unclear", confidenceImpact: -20 },
    ],
    reasoning: [
      { id: "r1", label: "Loss frequency", weight: 70 },
      { id: "r2", label: "Updated guidelines", weight: 55 },
    ],
    assumptions: ["Notice timing meets state regulation"],
    unresolvedRisks: ["Regulator complaint risk"],
    requiresHumanReview: true,
    reviewLevel: "compliance",
    nextSteps: ["Open compliance review", "Prepare non-renewal notice"],
  },
];

const escalationScenarios: DecisionScenario[] = [
  {
    id: "esc-sc-override",
    kind: "approve_settlement",
    title: "Request supervisor override and proceed",
    summary: "Document rationale and request a supervisor override to unblock the workflow.",
    recommended: true,
    confidence: 66,
    slaImpact: "Recovers SLA if approved today",
    customerImpact: "High — unblocks waiting customer",
    financialExposure: "Within current reserve",
    operationalImpact: "Closes one bottleneck",
    tradeoffs: [
      { id: "t1", category: "speed", label: "Fastest unblock", impact: "positive", severity: "high" },
      { id: "t2", category: "compliance", label: "Override trail required", impact: "neutral", severity: "medium" },
      { id: "t3", category: "risk", label: "Skips deeper second review", impact: "negative", severity: "medium" },
    ],
    dependencies: [
      { id: "d1", label: "Supervisor on shift", status: "ready" },
      { id: "d2", label: "Override justification", status: "pending" },
    ],
    projectedOutcomes: [
      { id: "o1", description: "Bottleneck cleared", likelihood: "very_likely", operationalImpact: "-1 blocker", tone: "positive" },
      { id: "o2", description: "Audit flag on override", likelihood: "likely", operationalImpact: "Compliance review", tone: "neutral" },
    ],
    uncertainties: [
      { id: "u1", type: "dependency", description: "Override justification not yet written", confidenceImpact: -10 },
    ],
    reasoning: [
      { id: "r1", label: "Time-in-queue", weight: 75 },
      { id: "r2", label: "Customer pressure", weight: 60 },
      { id: "r3", label: "Risk band", weight: 50 },
    ],
    assumptions: ["Supervisor available in next 2 hours"],
    unresolvedRisks: ["Audit flag follow-up"],
    requiresHumanReview: true,
    reviewLevel: "supervisor",
    nextSteps: ["Draft override justification", "Page supervisor"],
  },
  {
    id: "esc-sc-reassign",
    kind: "transfer_specialist",
    title: "Reassign to senior adjuster",
    summary: "Move the work to a senior adjuster better matched to the complexity.",
    confidence: 60,
    slaImpact: "1 day handoff cost",
    customerImpact: "Medium — new owner introduction",
    financialExposure: "Unchanged",
    operationalImpact: "Adds senior workload; reduces error risk",
    tradeoffs: [
      { id: "t1", category: "risk", label: "Better decision quality", impact: "positive", severity: "medium" },
      { id: "t2", category: "workload", label: "Senior team strain", impact: "negative", severity: "medium" },
    ],
    dependencies: [
      { id: "d1", label: "Senior adjuster capacity", status: "pending" },
    ],
    projectedOutcomes: [
      { id: "o1", description: "Cleaner resolution", likelihood: "likely", operationalImpact: "Lower rework", tone: "positive" },
    ],
    uncertainties: [],
    reasoning: [
      { id: "r1", label: "Complexity score", weight: 70 },
      { id: "r2", label: "Owner experience gap", weight: 55 },
    ],
    assumptions: ["Knowledge transfer takes <1 hour"],
    unresolvedRisks: ["Continuity for customer"],
    requiresHumanReview: false,
    nextSteps: ["Identify senior owner", "Schedule handoff"],
  },
];

function buildBundle(
  context: DecisionContext,
  entityId: string,
  title: string,
  summary: string,
  scenarios: DecisionScenario[],
): DecisionSupportBundle {
  const matrixCriteria = [
    { id: "m1", label: "Speed to resolution", weight: 25 },
    { id: "m2", label: "Risk mitigation", weight: 30 },
    { id: "m3", label: "Customer experience", weight: 20 },
    { id: "m4", label: "Compliance posture", weight: 25 },
  ].map((c) => ({
    ...c,
    scores: Object.fromEntries(
      scenarios.map((s) => {
        const base =
          c.id === "m1"
            ? s.kind === "approve_settlement"
              ? 85
              : s.kind === "request_evidence"
              ? 50
              : s.kind === "initiate_legal"
              ? 20
              : 60
            : c.id === "m2"
            ? s.kind === "initiate_legal"
              ? 85
              : s.kind === "escalate_underwriting"
              ? 75
              : s.kind === "request_evidence"
              ? 65
              : 55
            : c.id === "m3"
            ? s.kind === "approve_settlement"
              ? 80
              : s.kind === "transfer_specialist"
              ? 70
              : 50
            : s.kind === "initiate_legal"
            ? 85
            : s.kind === "escalate_underwriting"
            ? 75
            : 60;
        return [s.id, Math.min(100, Math.max(0, base + (s.recommended ? 5 : 0)))];
      }),
    ),
  }));

  return {
    id: `ds-${context}-${entityId}`,
    context,
    entityId,
    title,
    summary,
    generatedAt: new Date().toISOString(),
    scenarios,
    matrixCriteria,
  };
}

export function getDecisionSupport(
  context: DecisionContext,
  entityId: string,
): DecisionSupportBundle {
  switch (context) {
    case "claim":
      return buildBundle(
        context,
        entityId,
        "Settlement decision support",
        "Compare operational paths for resolving this claim under current uncertainty.",
        claimScenarios,
      );
    case "case":
      return buildBundle(
        context,
        entityId,
        "Case coordination scenarios",
        "Evaluate coordinated paths for this multi-entity case.",
        caseScenarios,
      );
    case "policy":
      return buildBundle(
        context,
        entityId,
        "Policy review scenarios",
        "Compare renewal and underwriting paths under current risk signals.",
        policyScenarios,
      );
    case "escalation":
    case "underwriting":
    default:
      return buildBundle(
        context,
        entityId,
        "Escalation recovery scenarios",
        "Compare recovery paths to unblock this exception.",
        escalationScenarios,
      );
  }
}
