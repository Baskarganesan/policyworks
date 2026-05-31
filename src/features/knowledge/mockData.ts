import type {
  ExpertNote,
  HistoricalCase,
  InstitutionalMemoryBundle,
  KnowledgeContext,
  KnowledgeInsight,
  OperationalPlaybook,
} from "./types";

const HIST_CASES: HistoricalCase[] = [
  {
    id: "HC-2024-118",
    reference: "CASE-2024-118",
    title: "Fleet collision — liability dispute (3-party)",
    summary:
      "Commercial fleet rear-end collision with disputed liability allocation between insured driver and third-party operator.",
    similarityScore: 92,
    outcome: "resolved_supervisor",
    outcomeSummary: "Liability allocated 70/30 after supervisor review of dash-cam footage.",
    rationaleSummary:
      "Field adjuster and AI fault analysis diverged. Supervisor sided with field investigation after re-reviewing footage.",
    resolutionPath: "supervisor_review",
    timeToResolutionDays: 14,
    closedAt: "2024-09-12",
    lessonsLearned: [
      "Always request raw dash-cam, not only the compressed export.",
      "Loop in supervisor early when AI fault confidence is below 70%.",
    ],
    matchedFactors: ["Commercial auto", "3-party liability", "Conflicting evidence"],
    auditReference: "audit/CASE-2024-118",
    ownerTeam: "Commercial Auto",
  },
  {
    id: "HC-2024-091",
    reference: "CASE-2024-091",
    title: "Commercial flood claim — missing endorsement",
    summary:
      "Coastal warehouse flood claim filed without a flood endorsement on the underlying commercial policy.",
    similarityScore: 88,
    outcome: "settled_partial",
    outcomeSummary:
      "Partial settlement under business interruption coverage; flood damage itself denied.",
    rationaleSummary:
      "Policy review confirmed flood endorsement was never bound. Compliance sign-off required.",
    resolutionPath: "underwriting_review",
    timeToResolutionDays: 21,
    closedAt: "2024-07-29",
    lessonsLearned: [
      "Verify endorsement bindings BEFORE communicating coverage expectations.",
      "Coastal policies should auto-flag missing flood endorsements at intake.",
    ],
    matchedFactors: ["Commercial property", "Flood", "Coverage gap"],
    auditReference: "audit/CASE-2024-091",
    ownerTeam: "Property Claims",
  },
  {
    id: "HC-2024-052",
    reference: "CASE-2024-052",
    title: "Medical claim — documentation dispute",
    summary:
      "Health claim flagged for incomplete provider records; insured submitted supplemental documentation under appeal.",
    similarityScore: 81,
    outcome: "resolved_standard",
    outcomeSummary: "Approved after secondary provider records were received.",
    rationaleSummary:
      "Initial denial was procedural. Standard workflow resumed once documentation gap was closed.",
    resolutionPath: "standard_workflow",
    timeToResolutionDays: 9,
    closedAt: "2024-05-04",
    lessonsLearned: [
      "Send a single consolidated documentation request, not sequential ones.",
      "Provider records via fax typically arrive within 5 business days.",
    ],
    matchedFactors: ["Medical", "Documentation gap", "Appeal"],
    auditReference: "audit/CASE-2024-052",
    ownerTeam: "Health Claims",
  },
  {
    id: "HC-2023-204",
    reference: "CASE-2023-204",
    title: "Suspected duplicate claim — same VIN",
    summary: "Two collision claims filed within 9 days against same VIN by different drivers.",
    similarityScore: 76,
    outcome: "denied",
    outcomeSummary: "Second claim denied as duplicate after SIU review.",
    rationaleSummary:
      "Photos and damage geometry matched across both filings. Field inspection confirmed single incident.",
    resolutionPath: "field_investigation",
    timeToResolutionDays: 18,
    closedAt: "2023-11-20",
    lessonsLearned: [
      "Cross-check by VIN and incident geo-coordinates, not just policy number.",
      "Engage SIU early when damage photos align across separate filings.",
    ],
    matchedFactors: ["Auto", "Duplicate signal", "SIU"],
    auditReference: "audit/CASE-2023-204",
    ownerTeam: "SIU",
  },
];

const INSIGHTS: KnowledgeInsight[] = [
  {
    id: "KI-001",
    type: "operational_pattern",
    title: "County police reports add 2–3 days to SLA",
    description:
      "Claims awaiting county police reports historically exceed standard SLA by an average of 2.4 days. Plan SLA extension proactively.",
    confidence: 86,
    relevance: 78,
    sourceCases: [
      { id: "HC-2024-118", reference: "CASE-2024-118" },
      { id: "HC-2023-204", reference: "CASE-2023-204" },
    ],
    tags: ["SLA", "Auto"],
  },
  {
    id: "KI-002",
    type: "known_risk",
    title: "Commercial auto liability disputes often need secondary review",
    description:
      "73% of 3-party commercial auto disputes in the past 12 months required supervisor or legal sign-off before close.",
    confidence: 81,
    relevance: 88,
    sourceCases: [{ id: "HC-2024-118", reference: "CASE-2024-118" }],
    tags: ["Commercial auto", "Liability"],
  },
  {
    id: "KI-003",
    type: "best_practice",
    title: "Validate endorsement bindings before customer communication",
    description:
      "Confirming endorsement coverage before any customer-facing commitment prevents downstream legal exposure.",
    confidence: 92,
    relevance: 84,
    sourceCases: [{ id: "HC-2024-091", reference: "CASE-2024-091" }],
    tags: ["Coverage", "Customer experience"],
  },
  {
    id: "KI-004",
    type: "frequent_blocker",
    title: "Provider record retrieval bottleneck",
    description:
      "Medical claims commonly stall 4–7 days waiting for provider record retrieval. Pre-request at intake when possible.",
    confidence: 79,
    relevance: 72,
    sourceCases: [{ id: "HC-2024-052", reference: "CASE-2024-052" }],
    tags: ["Health", "Documentation"],
  },
  {
    id: "KI-005",
    type: "compliance_note",
    title: "SIU referral threshold for duplicate signals",
    description:
      "When two claims share VIN + damage geometry, SIU referral is a standing compliance recommendation.",
    confidence: 88,
    relevance: 70,
    sourceCases: [{ id: "HC-2023-204", reference: "CASE-2023-204" }],
    tags: ["Fraud", "Compliance"],
  },
];

const PLAYBOOKS: OperationalPlaybook[] = [
  {
    id: "PB-MISSING-ENDORSEMENT",
    title: "Missing Endorsement Playbook",
    summary:
      "Workflow for claims where a needed endorsement (flood, equipment, business interruption) is absent from the underlying policy.",
    appliesTo: ["Property", "Commercial", "Coverage gap"],
    steps: [
      { id: "s1", order: 1, title: "Confirm gap with underwriting", detail: "Pull binder + endorsement history; confirm no implicit coverage.", owner: "Adjuster", expectedDurationHours: 4 },
      { id: "s2", order: 2, title: "Identify adjacent coverage", detail: "Check for business interruption or contingent coverage that may apply.", owner: "Underwriter", expectedDurationHours: 8 },
      { id: "s3", order: 3, title: "Draft customer communication", detail: "Use approved coverage-gap template; route to compliance.", owner: "Claims Lead", expectedDurationHours: 4 },
      { id: "s4", order: 4, title: "Settle eligible portion", detail: "Process partial settlement against adjacent coverage if applicable.", owner: "Adjuster", expectedDurationHours: 24 },
    ],
    commonBlockers: ["Missing binder history", "Customer disputes coverage interpretation", "Compliance backlog on communication review"],
    escalationTriggers: ["Customer threatens regulatory complaint", "Adjacent coverage interpretation contested", "Exposure > $250K"],
    averageResolutionDays: 18,
    successRate: 74,
  },
  {
    id: "PB-FRAUD-REVIEW",
    title: "Fraud Review Playbook",
    summary: "Standard SIU referral and review workflow for fraud-flagged claims.",
    appliesTo: ["Auto", "Property", "Fraud signal"],
    steps: [
      { id: "s1", order: 1, title: "Preserve evidence", detail: "Lock attachments, snapshot communication history.", owner: "Adjuster" },
      { id: "s2", order: 2, title: "SIU intake", detail: "File SIU referral with flagged signals and confidence score.", owner: "SIU" },
      { id: "s3", order: 3, title: "Field verification", detail: "Schedule inspection or recorded statement as appropriate.", owner: "Field Investigator" },
      { id: "s4", order: 4, title: "Decision & documentation", detail: "Approve, deny, or settle with full SIU rationale appended.", owner: "Claims Lead" },
    ],
    commonBlockers: ["Insured unavailable for recorded statement", "Conflicting third-party statements", "Photo metadata stripped"],
    escalationTriggers: ["Suspected organized fraud ring", "Prior SIU history on insured", "Exposure > $100K"],
    averageResolutionDays: 24,
    successRate: 68,
  },
  {
    id: "PB-DUPLICATE-CLAIM",
    title: "Duplicate Claim Investigation",
    summary: "Verify and resolve suspected duplicate filings across the book.",
    appliesTo: ["Auto", "Duplicate signal"],
    steps: [
      { id: "s1", order: 1, title: "Cross-match by VIN + geo", detail: "Run duplicate signal check across last 90 days.", owner: "Adjuster" },
      { id: "s2", order: 2, title: "Compare damage geometry", detail: "Run photo-overlap check; document overlapping regions.", owner: "Adjuster" },
      { id: "s3", order: 3, title: "Decide path", detail: "Merge, deny duplicate, or split if confirmed distinct incidents.", owner: "Claims Lead" },
    ],
    commonBlockers: ["Different policy numbers on same VIN", "Photo quality too low for overlap analysis"],
    escalationTriggers: ["Both insureds dispute duplicate finding", "Different carriers involved"],
    averageResolutionDays: 12,
    successRate: 82,
  },
  {
    id: "PB-MULTI-PARTY-LIABILITY",
    title: "Multi-party Liability Investigation",
    summary: "Coordinated workflow for 3+ party liability allocation.",
    appliesTo: ["Commercial auto", "Liability"],
    steps: [
      { id: "s1", order: 1, title: "Collect all party statements", detail: "Recorded statements from each driver/operator.", owner: "Adjuster" },
      { id: "s2", order: 2, title: "Independent reconstruction", detail: "Engage reconstruction vendor if disputed.", owner: "Claims Lead" },
      { id: "s3", order: 3, title: "Allocate liability percentages", detail: "Document allocation with supervisor co-sign.", owner: "Supervisor" },
      { id: "s4", order: 4, title: "Coordinate carrier settlement", detail: "Negotiate contribution from other carriers.", owner: "Claims Lead" },
    ],
    commonBlockers: ["Other carrier non-response", "Conflicting reconstruction findings", "Witness unavailable"],
    escalationTriggers: ["Allocation dispute > 20% delta", "Litigation filed by any party"],
    averageResolutionDays: 28,
    successRate: 71,
  },
];

const NOTES: ExpertNote[] = [
  {
    id: "EN-1",
    author: "Marta Chen",
    role: "Senior Auto Adjuster",
    note: "Senior adjusters typically request additional documentation BEFORE approving 3-party liability claims, even when AI confidence is high. Saves a downstream reversal.",
    seniorityYears: 18,
    endorsements: 24,
    tags: ["Auto", "Liability"],
  },
  {
    id: "EN-2",
    author: "Devon Hart",
    role: "Underwriting Lead",
    note: "Underwriting review is recommended whenever liability exposure exceeds the policy aggregate by more than 30%. We've seen too many late-stage surprises.",
    seniorityYears: 12,
    endorsements: 17,
    tags: ["Underwriting", "Exposure"],
  },
  {
    id: "EN-3",
    author: "Priya Anand",
    role: "Compliance Officer",
    note: "If a coverage interpretation is being communicated to the customer, route through compliance review first. It adds 24h but prevents bad-faith allegations.",
    seniorityYears: 9,
    endorsements: 31,
    tags: ["Compliance", "Customer communication"],
  },
];

function pickByContext(context: KnowledgeContext, entityId: string) {
  const seed = (entityId.length + context.length) % 3;
  return {
    similar: HIST_CASES.slice(0, 3 + ((seed + 1) % 2)),
    insights: INSIGHTS.slice(0, 4),
    playbooks: (() => {
      if (context === "policy") return [PLAYBOOKS[0]];
      if (context === "escalation") return [PLAYBOOKS[3], PLAYBOOKS[0]];
      if (context === "decision") return [PLAYBOOKS[1]];
      // claim / case
      return [PLAYBOOKS[3], PLAYBOOKS[1]];
    })(),
    notes: NOTES,
  };
}

const HEADLINES: Record<KnowledgeContext, string> = {
  claim: "We've seen claims like this before",
  case: "Institutional memory for this case",
  policy: "Operational history on similar policies",
  escalation: "How we've recovered from similar exceptions",
  decision: "Historical precedent for this decision",
};

const SUMMARIES: Record<KnowledgeContext, string> = {
  claim: "Similar claims, lessons learned, and playbooks drawn from prior resolutions.",
  case: "What worked, what stalled, and what experienced operators recommend.",
  policy: "Historical patterns from policies with comparable risk profile and coverage shape.",
  escalation: "Resolution paths and playbooks from prior escalations of this type.",
  decision: "Outcomes, rationale, and expert notes from analogous decisions.",
};

export function getInstitutionalMemory(
  context: KnowledgeContext,
  entityId: string,
): InstitutionalMemoryBundle {
  const picked = pickByContext(context, entityId);
  return {
    context,
    entityId,
    headline: HEADLINES[context],
    summary: SUMMARIES[context],
    similarCases: picked.similar,
    insights: picked.insights,
    playbooks: picked.playbooks,
    expertNotes: picked.notes,
  };
}
