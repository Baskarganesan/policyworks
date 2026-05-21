import type {
  ApprovalStep,
  ConflictRecord,
  Dependency,
  EscalationEvent,
  OperationalException,
  ResolutionAction,
} from "./types";

function hoursAgo(h: number) {
  return new Date(Date.now() - h * 3_600_000).toISOString();
}
function hoursFromNow(h: number) {
  return new Date(Date.now() + h * 3_600_000).toISOString();
}

const STD_ACTIONS: ResolutionAction[] = [
  { id: "a-esc", kind: "escalate_supervisor", label: "Escalate to supervisor", priority: "primary" },
  { id: "a-reassign", kind: "reassign", label: "Reassign", priority: "secondary" },
  { id: "a-extend", kind: "extend_sla", label: "Extend SLA", priority: "secondary" },
  { id: "a-clarify", kind: "request_clarification", label: "Request clarification", priority: "secondary" },
];

const TIMELINE_BASE: EscalationEvent[] = [
  {
    id: "te-1",
    kind: "sla_breached",
    timestamp: hoursAgo(28),
    actor: "SLA monitor",
    actorKind: "system",
    description: "Acknowledgement SLA breached by 4h 12m.",
  },
  {
    id: "te-2",
    kind: "supervisor_assigned",
    timestamp: hoursAgo(26),
    actor: "Maya Lin",
    actorKind: "user",
    description: "Supervisor assigned to coordinate recovery.",
  },
  {
    id: "te-3",
    kind: "customer_escalation",
    timestamp: hoursAgo(8),
    actor: "Jane Carter",
    actorKind: "customer",
    description: "Customer escalated through portal: 'second time waiting for response'.",
  },
];

const DEPS_DOC: Dependency[] = [
  {
    id: "d-1",
    description: "County damage report (FEMA)",
    owner: "Broward County records",
    ownerType: "regulator",
    blockedSince: hoursAgo(36),
    expectedResolution: hoursFromNow(18),
    status: "overdue",
    downstreamImpact: "Blocks coverage determination on CLM-3318.",
  },
  {
    id: "d-2",
    description: "Customer signature on Proof of Loss",
    owner: "Jane Carter",
    ownerType: "customer",
    blockedSince: hoursAgo(20),
    expectedResolution: hoursFromNow(4),
    status: "waiting",
    downstreamImpact: "Required before settlement disbursement.",
  },
  {
    id: "d-3",
    description: "External adjuster site inspection",
    owner: "Coastal Field Services",
    ownerType: "third_party",
    blockedSince: hoursAgo(14),
    status: "in_progress",
    downstreamImpact: "Damages estimate pending vendor return.",
  },
];

const APPROVALS_SETTLE: ApprovalStep[] = [
  {
    id: "ap-1",
    approver: "Maya Lin",
    role: "Claims supervisor",
    status: "approved",
    decidedAt: hoursAgo(20),
    note: "Documentation sufficient pending county report.",
  },
  {
    id: "ap-2",
    approver: "Devon Reyes",
    role: "Regional manager",
    status: "pending",
    dueAt: hoursFromNow(6),
  },
  {
    id: "ap-3",
    approver: "Priya Shah",
    role: "VP, Claims",
    status: "waiting",
    dueAt: hoursFromNow(36),
  },
];

const APPROVALS_OVERRIDE: ApprovalStep[] = [
  {
    id: "ov-1",
    approver: "Kenji Tanaka",
    role: "Underwriting lead",
    status: "rejected",
    decidedAt: hoursAgo(5),
    note: "Endorsement E-22 excludes coastal flood — needs VP override.",
  },
  {
    id: "ov-2",
    approver: "Priya Shah",
    role: "VP, Underwriting",
    status: "pending",
    dueAt: hoursFromNow(10),
  },
];

const CONFLICT_LIABILITY: ConflictRecord = {
  id: "cf-1",
  title: "Adjuster liability conclusions diverge",
  summary:
    "Two adjusters reached different conclusions on liability allocation for CLM-3318.",
  signals: [
    {
      id: "cs-1",
      source: "Adjuster R. Patel · field report",
      contradiction: "Allocates 70% liability to insured (delayed reporting).",
      confidence: 64,
      recommendation: "Re-examine timeline of initial customer call.",
    },
    {
      id: "cs-2",
      source: "Adjuster S. Okafor · desk review",
      contradiction: "Allocates 25% liability to insured (named-peril coverage applies).",
      confidence: 72,
      recommendation: "Cross-reference Endorsement E-14 (water damage rider).",
    },
    {
      id: "cs-3",
      source: "AI coverage check · v3.2",
      contradiction: "Policy POL-2089 + Endorsement E-14 supports named-peril path.",
      confidence: 81,
      recommendation: "Use endorsement-based interpretation pending supervisor confirmation.",
    },
  ],
  recommendedPath: "Apply endorsement-based interpretation; document rationale on case.",
  escalationPath: "Supervisor → Claims director (24h)",
};

const CONFLICT_POLICY: ConflictRecord = {
  id: "cf-2",
  title: "Policy wording conflicts with endorsement",
  summary:
    "Base policy excludes named-storm wind events; Endorsement E-22 reinstates coverage with sub-limit.",
  signals: [
    {
      id: "cs-4",
      source: "POL-2089 · Section 4.2",
      contradiction: "Named-storm wind events excluded from base coverage.",
      confidence: 95,
    },
    {
      id: "cs-5",
      source: "Endorsement E-22 · Rider",
      contradiction: "Reinstates wind coverage with $25,000 sub-limit.",
      confidence: 92,
    },
  ],
  recommendedPath: "Apply endorsement sub-limit; flag for underwriting confirmation.",
  escalationPath: "Underwriting lead → VP Underwriting",
};

export const MOCK_EXCEPTIONS: OperationalException[] = [
  {
    id: "EX-9012",
    reference: "EX-9012",
    type: "sla_breach",
    severity: "critical",
    status: "escalated",
    title: "Claim acknowledgement SLA breached",
    summary:
      "Initial acknowledgement on CLM-3318 missed 24h SLA. Customer escalated through portal.",
    createdAt: hoursAgo(30),
    updatedAt: hoursAgo(2),
    owner: "Maya Lin",
    ownerRole: "Claims supervisor",
    slaDueAt: hoursAgo(4),
    ageHours: 30,
    pressureScore: 92,
    dependencies: [DEPS_DOC[0], DEPS_DOC[1]],
    approvals: APPROVALS_SETTLE,
    conflict: CONFLICT_LIABILITY,
    timeline: TIMELINE_BASE,
    relatedEntities: [
      { type: "case", id: "CASE-1801", label: "CASE-1801" },
      { type: "claim", id: "CLM-3318", label: "CLM-3318" },
      { type: "customer", id: "CUS-1042", label: "Jane Carter" },
    ],
    recommendedActions: STD_ACTIONS,
  },
  {
    id: "EX-9013",
    reference: "EX-9013",
    type: "missing_document",
    severity: "high",
    status: "waiting",
    title: "County damage report not received",
    summary:
      "FEMA county report required to finalize coverage determination. 36h overdue.",
    createdAt: hoursAgo(36),
    updatedAt: hoursAgo(6),
    owner: "R. Patel",
    ownerRole: "Field adjuster",
    slaDueAt: hoursFromNow(18),
    ageHours: 36,
    pressureScore: 78,
    dependencies: [DEPS_DOC[0]],
    timeline: [
      {
        id: "te-d1",
        kind: "note",
        timestamp: hoursAgo(36),
        actor: "Workflow engine",
        actorKind: "automation",
        description: "Auto-requested county report from Broward records.",
      },
      {
        id: "te-d2",
        kind: "note",
        timestamp: hoursAgo(12),
        actor: "R. Patel",
        actorKind: "user",
        description: "Followed up by phone — queued for processing.",
      },
    ],
    relatedEntities: [
      { type: "claim", id: "CLM-3318", label: "CLM-3318" },
      { type: "document", id: "DOC-REQ-441", label: "County report (requested)" },
    ],
    recommendedActions: [
      { id: "x1", kind: "request_clarification", label: "Resend request", priority: "primary" },
      { id: "x2", kind: "escalate_supervisor", label: "Escalate to supervisor", priority: "secondary" },
      { id: "x3", kind: "extend_sla", label: "Extend SLA", priority: "secondary" },
    ],
  },
  {
    id: "EX-9014",
    reference: "EX-9014",
    type: "adjuster_conflict",
    severity: "high",
    status: "active",
    title: "Conflicting adjuster decisions on CLM-3318",
    summary:
      "Field and desk adjusters reached materially different liability conclusions.",
    createdAt: hoursAgo(14),
    updatedAt: hoursAgo(1),
    owner: "Maya Lin",
    ownerRole: "Claims supervisor",
    ageHours: 14,
    pressureScore: 71,
    dependencies: [],
    conflict: CONFLICT_LIABILITY,
    timeline: [
      {
        id: "te-c1",
        kind: "note",
        timestamp: hoursAgo(14),
        actor: "Conflict detector",
        actorKind: "ai",
        description: "Detected liability divergence > 40% across two adjuster reports.",
      },
      {
        id: "te-c2",
        kind: "supervisor_assigned",
        timestamp: hoursAgo(12),
        actor: "Maya Lin",
        actorKind: "user",
        description: "Supervisor took ownership of resolution.",
      },
    ],
    relatedEntities: [
      { type: "claim", id: "CLM-3318", label: "CLM-3318" },
      { type: "policy", id: "POL-2089", label: "POL-2089" },
    ],
    recommendedActions: [
      { id: "y1", kind: "escalate_supervisor", label: "Escalate to director", priority: "primary" },
      { id: "y2", kind: "request_clarification", label: "Request joint review", priority: "secondary" },
      { id: "y3", kind: "reassign", label: "Reassign desk adjuster", priority: "secondary" },
    ],
  },
  {
    id: "EX-9015",
    reference: "EX-9015",
    type: "approval_bottleneck",
    severity: "high",
    status: "waiting",
    title: "Settlement approval awaiting regional manager",
    summary:
      "Settlement of $42,800 exceeds adjuster authority. Pending Devon Reyes for 6h+.",
    createdAt: hoursAgo(8),
    updatedAt: hoursAgo(1),
    owner: "Devon Reyes",
    ownerRole: "Regional manager",
    slaDueAt: hoursFromNow(6),
    ageHours: 8,
    pressureScore: 63,
    dependencies: [],
    approvals: APPROVALS_SETTLE,
    timeline: [
      {
        id: "te-ap1",
        kind: "approval_requested",
        timestamp: hoursAgo(8),
        actor: "Workflow engine",
        actorKind: "automation",
        description: "Settlement >$25K threshold — approval chain triggered.",
      },
      {
        id: "te-ap2",
        kind: "approval_granted",
        timestamp: hoursAgo(7),
        actor: "Maya Lin",
        actorKind: "user",
        description: "Claims supervisor approved.",
      },
    ],
    relatedEntities: [
      { type: "claim", id: "CLM-3318", label: "CLM-3318" },
      { type: "case", id: "CASE-1801", label: "CASE-1801" },
    ],
    recommendedActions: [
      { id: "z1", kind: "escalate_supervisor", label: "Nudge approver", priority: "primary" },
      { id: "z2", kind: "request_override", label: "Request override", priority: "secondary" },
    ],
  },
  {
    id: "EX-9016",
    reference: "EX-9016",
    type: "duplicate_claim",
    severity: "medium",
    status: "active",
    title: "Possible duplicate of CLM-3210",
    summary:
      "Similar incident date and loss location as a 2024 closed claim — review for duplicate filing.",
    createdAt: hoursAgo(5),
    updatedAt: hoursAgo(1),
    owner: "S. Okafor",
    ownerRole: "Desk adjuster",
    ageHours: 5,
    pressureScore: 38,
    dependencies: [],
    timeline: [
      {
        id: "te-dup",
        kind: "note",
        timestamp: hoursAgo(5),
        actor: "Duplicate detector",
        actorKind: "ai",
        description: "Match confidence 78% with CLM-3210 (wind damage, same address).",
      },
    ],
    relatedEntities: [
      { type: "claim", id: "CLM-3318", label: "CLM-3318" },
      { type: "claim", id: "CLM-3210", label: "CLM-3210" },
    ],
    recommendedActions: [
      { id: "m1", kind: "merge_duplicate", label: "Merge with CLM-3210", priority: "primary", destructive: true },
      { id: "m2", kind: "request_clarification", label: "Ask customer", priority: "secondary" },
    ],
  },
  {
    id: "EX-9017",
    reference: "EX-9017",
    type: "policy_conflict",
    severity: "medium",
    status: "active",
    title: "Policy wording vs. endorsement conflict",
    summary:
      "Base policy excludes named-storm wind; Endorsement E-22 reinstates coverage with sub-limit.",
    createdAt: hoursAgo(10),
    updatedAt: hoursAgo(2),
    owner: "Kenji Tanaka",
    ownerRole: "Underwriting lead",
    ageHours: 10,
    pressureScore: 52,
    dependencies: [],
    conflict: CONFLICT_POLICY,
    approvals: APPROVALS_OVERRIDE,
    timeline: [
      {
        id: "te-pc",
        kind: "note",
        timestamp: hoursAgo(10),
        actor: "Coverage analyzer",
        actorKind: "ai",
        description: "Detected interpretation conflict between Section 4.2 and Endorsement E-22.",
      },
    ],
    relatedEntities: [
      { type: "policy", id: "POL-2089", label: "POL-2089" },
      { type: "claim", id: "CLM-3318", label: "CLM-3318" },
    ],
    recommendedActions: [
      { id: "p1", kind: "request_override", label: "Request VP override", priority: "primary" },
      { id: "p2", kind: "escalate_supervisor", label: "Escalate to legal", priority: "secondary" },
    ],
  },
  {
    id: "EX-9018",
    reference: "EX-9018",
    type: "fraud_hold",
    severity: "critical",
    status: "active",
    title: "Fraud-review hold on CLM-3318",
    summary:
      "Pattern detector flagged 3 similar coastal claims within 60 days — investigations on hold.",
    createdAt: hoursAgo(18),
    updatedAt: hoursAgo(3),
    owner: "SIU desk",
    ownerRole: "Special investigations",
    slaDueAt: hoursFromNow(30),
    ageHours: 18,
    pressureScore: 81,
    dependencies: [DEPS_DOC[2]],
    timeline: [
      {
        id: "te-f1",
        kind: "fraud_review",
        timestamp: hoursAgo(18),
        actor: "Fraud detector",
        actorKind: "ai",
        description: "Triggered fraud review (similarity score 0.83 across recent coastal claims).",
      },
      {
        id: "te-f2",
        kind: "note",
        timestamp: hoursAgo(6),
        actor: "SIU desk",
        actorKind: "user",
        description: "Vendor inspection scheduled for tomorrow.",
      },
    ],
    relatedEntities: [
      { type: "claim", id: "CLM-3318", label: "CLM-3318" },
      { type: "customer", id: "CUS-1042", label: "Jane Carter" },
    ],
    recommendedActions: [
      { id: "f1", kind: "trigger_fraud", label: "Hand off to SIU", priority: "primary" },
      { id: "f2", kind: "request_clarification", label: "Request statement", priority: "secondary" },
    ],
  },
];

export function getExceptionsByEntity(
  entityType: "case" | "claim" | "policy" | "customer",
  entityId: string,
): OperationalException[] {
  return MOCK_EXCEPTIONS.filter((ex) =>
    ex.relatedEntities.some((r) => r.type === entityType && r.id === entityId),
  );
}

export function getCriticalExceptions(): OperationalException[] {
  return MOCK_EXCEPTIONS.filter(
    (ex) => ex.severity === "critical" || ex.severity === "high",
  ).sort((a, b) => b.pressureScore - a.pressureScore);
}
