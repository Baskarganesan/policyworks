import type {
  CrossEntityRef,
  OperationalInsight,
  RelatedEntityType,
  SuggestedAction,
} from "./types";

let seq = 1;
const id = () => `INS-${seq++}`;

function minutesAgo(m: number) {
  return new Date(Date.now() - m * 60_000).toISOString();
}

function act(
  label: string,
  type: SuggestedAction["actionType"],
  priority: SuggestedAction["priority"] = "secondary",
): SuggestedAction {
  return { id: `${type}-${Math.random().toString(36).slice(2, 7)}`, label, actionType: type, priority };
}

function link(type: RelatedEntityType, refId: string, label: string): CrossEntityRef {
  return { type, id: refId, label };
}

// ---------- CLAIM templates ----------
function claimInsights(entityId: string): OperationalInsight[] {
  return [
    {
      id: id(),
      category: "coverage",
      severity: "high",
      confidence: 87,
      title: "Flood endorsement not detected on linked policy",
      description:
        "The policy tied to this claim has no flood endorsement on file. Coverage for water damage from rising water may not apply.",
      relatedEntityType: "claim",
      relatedEntityId: entityId,
      links: [link("policy", "POL-2089", "POL-2089"), link("document", "DOC-441", "Endorsements.pdf")],
      suggestedActions: [
        act("Notify underwriting", "notify_underwriting", "primary"),
        act("Open related policy", "open_related"),
      ],
      createdAt: minutesAgo(18),
      source: "Coverage analyzer",
    },
    {
      id: id(),
      category: "fraud",
      severity: "critical",
      confidence: 73,
      title: "Claim amount exceeds regional fraud threshold",
      description:
        "Reported amount is 2.4× the median for similar incidents in this ZIP. SIU review is recommended before payout.",
      relatedEntityType: "claim",
      relatedEntityId: entityId,
      links: [link("customer", "CUS-1042", "Jane Carter")],
      suggestedActions: [
        act("Escalate to SIU", "escalate_review", "primary"),
        act("Flag compliance", "flag_compliance"),
      ],
      createdAt: minutesAgo(42),
      source: "Fraud signal",
    },
    {
      id: id(),
      category: "risk",
      severity: "medium",
      confidence: 68,
      title: "Customer has multiple active claims",
      description:
        "This policyholder has 3 open claims across two policies in the last 90 days. Consider consolidated review.",
      relatedEntityType: "claim",
      relatedEntityId: entityId,
      links: [link("customer", "CUS-1042", "Jane Carter"), link("claim", "CLM-3318", "CLM-3318")],
      suggestedActions: [
        act("Assign senior adjuster", "assign_adjuster", "primary"),
        act("Schedule follow-up", "schedule_followup"),
      ],
      createdAt: minutesAgo(120),
      source: "Customer history",
    },
    {
      id: id(),
      category: "workflow",
      severity: "medium",
      confidence: 91,
      title: "Police report still missing",
      description:
        "Required document for liability assessment has been requested 6 days ago without response.",
      relatedEntityType: "claim",
      relatedEntityId: entityId,
      suggestedActions: [act("Request document", "request_document", "primary")],
      createdAt: minutesAgo(60 * 24),
      source: "Workflow checks",
    },
  ];
}

// ---------- POLICY templates ----------
function policyInsights(entityId: string): OperationalInsight[] {
  return [
    {
      id: id(),
      category: "coverage",
      severity: "high",
      confidence: 82,
      title: "Coverage limits below regional average",
      description:
        "Dwelling limit is 18% below the average for comparable properties in this market. Consider a coverage review.",
      relatedEntityType: "policy",
      relatedEntityId: entityId,
      suggestedActions: [
        act("Start coverage review", "escalate_review", "primary"),
        act("Notify underwriting", "notify_underwriting"),
      ],
      createdAt: minutesAgo(35),
      source: "Benchmark engine",
    },
    {
      id: id(),
      category: "renewal",
      severity: "critical",
      confidence: 89,
      title: "Renewal risk elevated",
      description:
        "Loss ratio on this policy is trending above 0.85 with two recent claims. Probability of non-renewal review is high.",
      relatedEntityType: "policy",
      relatedEntityId: entityId,
      links: [link("claim", "CLM-3318", "CLM-3318"), link("claim", "CLM-3401", "CLM-3401")],
      suggestedActions: [
        act("Start renewal review", "start_renewal_review", "primary"),
        act("Schedule follow-up", "schedule_followup"),
      ],
      createdAt: minutesAgo(60),
      source: "Renewal scorer",
    },
    {
      id: id(),
      category: "coverage",
      severity: "medium",
      confidence: 76,
      title: "Required endorsement missing",
      description:
        "Detached structure on the property has no scheduled rider. Coverage gap likely on shed/garage incidents.",
      relatedEntityType: "policy",
      relatedEntityId: entityId,
      links: [link("document", "DOC-220", "Property survey.pdf")],
      suggestedActions: [act("Request document", "request_document", "primary")],
      createdAt: minutesAgo(60 * 6),
      source: "Endorsement check",
    },
  ];
}

// ---------- CUSTOMER templates ----------
function customerInsights(entityId: string): OperationalInsight[] {
  return [
    {
      id: id(),
      category: "risk",
      severity: "high",
      confidence: 84,
      title: "High lifetime claim frequency",
      description:
        "This customer has filed 7 claims in 5 years — 3.1× the book average. Suggest consolidated risk review.",
      relatedEntityType: "customer",
      relatedEntityId: entityId,
      suggestedActions: [act("Escalate review", "escalate_review", "primary")],
      createdAt: minutesAgo(90),
      source: "Customer 360",
    },
    {
      id: id(),
      category: "compliance",
      severity: "medium",
      confidence: 95,
      title: "Pending compliance verification",
      description:
        "KYC re-verification is overdue by 14 days. Renewal cannot finalize until verification is complete.",
      relatedEntityType: "customer",
      relatedEntityId: entityId,
      links: [link("document", "DOC-989", "Government ID.pdf")],
      suggestedActions: [
        act("Request document", "request_document", "primary"),
        act("Flag compliance", "flag_compliance"),
      ],
      createdAt: minutesAgo(60 * 26),
      source: "Compliance monitor",
    },
    {
      id: id(),
      category: "workflow",
      severity: "medium",
      confidence: 70,
      title: "Recent support escalation detected",
      description:
        "Customer escalated a billing dispute 3 days ago. Coordinate with service before issuing renewal offer.",
      relatedEntityType: "customer",
      relatedEntityId: entityId,
      links: [link("task", "TASK-2031", "TASK-2031")],
      suggestedActions: [
        act("Schedule follow-up", "schedule_followup", "primary"),
        act("Open related task", "open_related"),
      ],
      createdAt: minutesAgo(60 * 5),
      source: "Service signal",
    },
  ];
}

// ---------- TASK templates ----------
function taskInsights(entityId: string): OperationalInsight[] {
  return [
    {
      id: id(),
      category: "workflow",
      severity: "high",
      confidence: 92,
      title: "Blocked waiting on customer for 5+ days",
      description:
        "No customer response since last document request. SLA breach in 24h if no contact is made.",
      relatedEntityType: "task",
      relatedEntityId: entityId,
      suggestedActions: [
        act("Send reminder", "request_document", "primary"),
        act("Schedule follow-up", "schedule_followup"),
      ],
      createdAt: minutesAgo(15),
      source: "SLA monitor",
    },
    {
      id: id(),
      category: "risk",
      severity: "medium",
      confidence: 66,
      title: "Similar task previously escalated",
      description:
        "An equivalent workflow on the same customer was escalated last quarter. Consider preemptive review.",
      relatedEntityType: "task",
      relatedEntityId: entityId,
      links: [link("customer", "CUS-1042", "Jane Carter")],
      suggestedActions: [act("Escalate review", "escalate_review", "primary")],
      createdAt: minutesAgo(60 * 3),
      source: "Historical pattern",
    },
    {
      id: id(),
      category: "workflow",
      severity: "high",
      confidence: 88,
      title: "Required document still missing",
      description:
        "Proof of repair has not been uploaded. Workflow cannot advance to approval stage.",
      relatedEntityType: "task",
      relatedEntityId: entityId,
      links: [link("document", "DOC-771", "Repair estimate.pdf")],
      suggestedActions: [act("Request document", "request_document", "primary")],
      createdAt: minutesAgo(60 * 2),
      source: "Workflow checks",
    },
  ];
}

// Public API — slice the templates pseudo-deterministically based on id
function slice<T>(arr: T[], key: string): T[] {
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) | 0;
  const start = Math.abs(hash) % Math.max(1, arr.length);
  // rotate
  return [...arr.slice(start), ...arr.slice(0, start)];
}

export function getInsightsForClaim(claimId: string): OperationalInsight[] {
  return slice(claimInsights(claimId), claimId);
}

export function getInsightsForPolicy(policyId: string): OperationalInsight[] {
  return slice(policyInsights(policyId), policyId);
}

export function getInsightsForCustomer(customerId: string): OperationalInsight[] {
  return slice(customerInsights(customerId), customerId);
}

export function getInsightsForTask(taskId: string): OperationalInsight[] {
  return slice(taskInsights(taskId), taskId);
}
