import type {
  CaseRecord,
  CaseEvent,
  CaseInsight,
  CaseTask,
  CaseDocument,
  CaseMessage,
  CaseEntityRef,
} from "./types";

function hoursAgo(h: number) {
  return new Date(Date.now() - h * 60 * 60_000).toISOString();
}
function minutesAgo(m: number) {
  return new Date(Date.now() - m * 60_000).toISOString();
}
function hoursFromNow(h: number) {
  return new Date(Date.now() + h * 60 * 60_000).toISOString();
}

const CUSTOMER_JANE: CaseEntityRef = {
  type: "customer",
  id: "CUS-1042",
  label: "Jane Carter",
  sublabel: "Policyholder · since 2019",
};
const POL_2089: CaseEntityRef = {
  type: "policy",
  id: "POL-2089",
  label: "POL-2089",
  sublabel: "Homeowners · Florida",
};
const POL_2090: CaseEntityRef = {
  type: "policy",
  id: "POL-2090",
  label: "POL-2090",
  sublabel: "Umbrella · Auto+Home",
};
const CLM_3318: CaseEntityRef = {
  type: "claim",
  id: "CLM-3318",
  label: "CLM-3318",
  sublabel: "Water damage · $42,800",
};
const CLM_3210: CaseEntityRef = {
  type: "claim",
  id: "CLM-3210",
  label: "CLM-3210",
  sublabel: "Wind damage · 2024 · closed",
};
const DOC_441: CaseEntityRef = { type: "document", id: "DOC-441", label: "Endorsements.pdf" };
const DOC_510: CaseEntityRef = { type: "document", id: "DOC-510", label: "Damage photos (12)" };

const timeline_3318: CaseEvent[] = [
  {
    id: "EV-1",
    type: "case_created",
    timestamp: hoursAgo(72),
    actor: { name: "Routing automation", kind: "automation" },
    description: "Case opened — water damage claim auto-routed to coastal team",
    source: "Claim intake",
  },
  {
    id: "EV-2",
    type: "claim_filed",
    timestamp: hoursAgo(71),
    actor: { name: "Jane Carter", kind: "customer", role: "Policyholder" },
    description: "Customer filed claim through portal",
    relatedEntity: CLM_3318,
    source: "Customer portal",
  },
  {
    id: "EV-3",
    type: "document_uploaded",
    timestamp: hoursAgo(70),
    actor: { name: "Jane Carter", kind: "customer" },
    description: "Uploaded 12 damage photos and property survey",
    relatedEntity: DOC_510,
  },
  {
    id: "EV-4",
    type: "ai_insight",
    timestamp: hoursAgo(68),
    actor: { name: "Coverage analyzer", kind: "ai" },
    description: "Detected missing flood endorsement on linked policy POL-2089",
    relatedEntity: POL_2089,
    source: "AI coverage model v3.2",
  },
  {
    id: "EV-5",
    type: "task_created",
    timestamp: hoursAgo(67),
    actor: { name: "Marcus Lee", kind: "user", role: "Adjuster" },
    description: "Requested medical/repair quote from contractor",
  },
  {
    id: "EV-6",
    type: "document_requested",
    timestamp: hoursAgo(50),
    actor: { name: "Marcus Lee", kind: "user", role: "Adjuster" },
    description: "Requested original endorsements pack from underwriting",
    relatedEntity: DOC_441,
  },
  {
    id: "EV-7",
    type: "customer_message",
    timestamp: hoursAgo(40),
    actor: { name: "Jane Carter", kind: "customer" },
    description: "“Plumber finished structural assessment, sending invoice tomorrow.”",
  },
  {
    id: "EV-8",
    type: "ai_insight",
    timestamp: hoursAgo(26),
    actor: { name: "Risk engine", kind: "system" },
    description: "Claim amount sits 2.4× above ZIP-level median — fraud signal",
    relatedEntity: CLM_3318,
    source: "Geo-fraud overlay",
  },
  {
    id: "EV-9",
    type: "escalation",
    timestamp: hoursAgo(20),
    actor: { name: "Marcus Lee", kind: "user", role: "Adjuster" },
    description: "Escalated to SIU for secondary review",
  },
  {
    id: "EV-10",
    type: "internal_note",
    timestamp: hoursAgo(8),
    actor: { name: "Priya Shah", kind: "user", role: "SIU analyst" },
    description: "Reviewing contractor history — no fraud pattern on file so far",
  },
  {
    id: "EV-11",
    type: "status_changed",
    timestamp: hoursAgo(5),
    actor: { name: "System", kind: "system" },
    description: "Status changed: In review → Pending docs",
  },
  {
    id: "EV-12",
    type: "audit",
    timestamp: minutesAgo(45),
    actor: { name: "Audit log", kind: "system" },
    description: "Workflow SLA at 70% — auto-reassignment scheduled in 14h",
    source: "SLA monitor",
  },
];

const insights_3318: CaseInsight[] = [
  {
    id: "CI-1",
    severity: "critical",
    category: "fraud",
    confidence: 73,
    title: "Claim amount exceeds regional fraud threshold",
    explanation:
      "Reported amount of $42,800 is 2.4× the median for similar water-damage incidents in ZIP 33134 over the last 12 months. Two adjacent claims in the same building flagged in last 90 days.",
    source: "Geo-fraud overlay",
    relatedEntity: CLM_3318,
    triggers: ["Amount > 2x ZIP median", "2 nearby flagged claims (90d)", "First claim by this contractor"],
    suggestedActions: [
      { id: "a1", label: "Escalate to SIU", priority: "primary" },
      { id: "a2", label: "Request contractor history", priority: "secondary" },
    ],
  },
  {
    id: "CI-2",
    severity: "high",
    category: "coverage",
    confidence: 87,
    title: "Flood endorsement missing on linked policy",
    explanation:
      "POL-2089 has no flood rider on file while the insured property is in FEMA Zone AE. Water-from-rising-water coverage may not apply if root cause is reclassified.",
    source: "Coverage analyzer",
    relatedEntity: POL_2089,
    triggers: ["FEMA Zone AE", "No flood rider in endorsements", "Two prior water-damage claims in region"],
    suggestedActions: [
      { id: "a3", label: "Notify underwriting", priority: "primary" },
      { id: "a4", label: "Open policy workspace", priority: "secondary" },
    ],
  },
  {
    id: "CI-3",
    severity: "high",
    category: "sla",
    confidence: 92,
    title: "SLA breach in 14h without contractor invoice",
    explanation:
      "First-action SLA is currently 70% consumed. Routing automation will auto-reassign to senior adjuster queue if invoice is not attached.",
    source: "SLA monitor",
    triggers: ["SLA window 48h", "Customer pending response 40h", "No invoice attached"],
    suggestedActions: [
      { id: "a5", label: "Send follow-up", priority: "primary" },
      { id: "a6", label: "Extend SLA", priority: "secondary" },
    ],
  },
  {
    id: "CI-4",
    severity: "medium",
    category: "renewal",
    confidence: 64,
    title: "Renewal in 41 days — risk reclassification likely",
    explanation:
      "Open claim activity typically triggers underwriting reclassification at renewal. Expect ~12-18% premium delta if fraud flag is not cleared before renewal.",
    source: "Underwriting predictor",
    relatedEntity: POL_2089,
    triggers: ["Renewal in 41d", "Open critical-severity claim", "Prior reclass history"],
    suggestedActions: [
      { id: "a7", label: "Start renewal review", priority: "secondary" },
    ],
  },
];

const tasks_3318: CaseTask[] = [
  {
    id: "T-1",
    title: "Receive contractor invoice from customer",
    status: "waiting",
    urgency: "high",
    assignee: "Marcus Lee",
    dueAt: hoursFromNow(14),
    blocker: "Waiting on customer response — 40h elapsed",
    dependsOn: CUSTOMER_JANE,
  },
  {
    id: "T-2",
    title: "SIU secondary review on fraud signal",
    status: "in_progress",
    urgency: "critical",
    assignee: "Priya Shah",
    dueAt: hoursFromNow(36),
    dependsOn: CLM_3318,
  },
  {
    id: "T-3",
    title: "Confirm flood endorsement status with underwriting",
    status: "blocked",
    urgency: "high",
    assignee: "Underwriting team",
    blocker: "Underwriting reviewer out of office until Mon",
    dependsOn: POL_2089,
  },
  {
    id: "T-4",
    title: "Schedule on-site inspection",
    status: "open",
    urgency: "medium",
    assignee: "Field ops queue",
  },
  {
    id: "T-5",
    title: "Index damage photos for AI review",
    status: "done",
    urgency: "low",
    assignee: "Document automation",
    dependsOn: DOC_510,
  },
];

const documents_3318: CaseDocument[] = [
  {
    id: "DOC-510",
    name: "Damage photos (12)",
    kind: "photo",
    status: "ai_reviewed",
    uploadedBy: "Jane Carter",
    uploadedAt: hoursAgo(70),
    relatedEntity: CLM_3318,
    aiSummary: "Visible water damage across living room and kitchen ceiling. No fire indicators.",
  },
  {
    id: "DOC-441",
    name: "Endorsements.pdf",
    kind: "endorsement",
    status: "indexed",
    uploadedBy: "Underwriting",
    uploadedAt: hoursAgo(26 * 24),
    relatedEntity: POL_2089,
    aiSummary: "No flood rider detected. Wind & hail rider present. Last updated 2024-09.",
  },
  {
    id: "DOC-602",
    name: "Property survey.pdf",
    kind: "report",
    status: "indexed",
    uploadedBy: "Jane Carter",
    uploadedAt: hoursAgo(26),
  },
  {
    id: "DOC-701",
    name: "Contractor invoice",
    kind: "evidence",
    status: "missing",
    relatedEntity: CLM_3318,
  },
  {
    id: "DOC-555",
    name: "SIU review notes",
    kind: "correspondence",
    status: "pending_review",
    uploadedBy: "Priya Shah",
    uploadedAt: hoursAgo(8),
  },
];

const messages_3318: CaseMessage[] = [
  {
    id: "M-1",
    channel: "portal",
    direction: "inbound",
    author: { name: "Jane Carter", kind: "customer" },
    timestamp: hoursAgo(71),
    subject: "New claim — water damage",
    body: "Hi team, woke up to ceiling leak in the living room. Filing now with photos attached.",
    thread: "claim-intake",
  },
  {
    id: "M-2",
    channel: "email",
    direction: "outbound",
    author: { name: "Marcus Lee", kind: "user", role: "Adjuster" },
    timestamp: hoursAgo(67),
    subject: "Acknowledging your claim CLM-3318",
    body: "Hi Jane, confirming we received your claim. Next step is a contractor estimate — please forward when ready.",
    thread: "claim-intake",
  },
  {
    id: "M-3",
    channel: "internal",
    direction: "internal",
    author: { name: "Marcus Lee", kind: "user" },
    timestamp: hoursAgo(50),
    body: "@underwriting — can we confirm flood rider status on POL-2089 before payout review?",
    thread: "ops-coordination",
  },
  {
    id: "M-4",
    channel: "phone",
    direction: "inbound",
    author: { name: "Jane Carter", kind: "customer" },
    timestamp: hoursAgo(40),
    subject: "Call summary",
    body: "Customer called — plumber finished structural assessment, will send invoice tomorrow.",
    thread: "claim-intake",
  },
  {
    id: "M-5",
    channel: "internal",
    direction: "internal",
    author: { name: "Priya Shah", kind: "user", role: "SIU analyst" },
    timestamp: hoursAgo(8),
    body: "Initial review — contractor has clean record. Will continue cross-checks tomorrow.",
    thread: "siu-review",
  },
];

const CASE_3318: CaseRecord = {
  id: "CASE-2031",
  reference: "CASE-2031",
  title: "Coastal water-damage claim — flood coverage at risk",
  summary:
    "Critical-severity case combining a high-value water-damage claim with a coverage gap on the linked homeowners policy and an active fraud signal. SLA breach approaching.",
  severity: "critical",
  status: "escalated",
  assignedTeam: "Coastal Claims · SIU",
  assignedLead: "Marcus Lee",
  createdAt: hoursAgo(72),
  updatedAt: minutesAgo(45),
  sla: { label: "First-action SLA", dueAt: hoursFromNow(14), startedAt: hoursAgo(48) },
  relatedCustomer: CUSTOMER_JANE,
  relatedPolicies: [POL_2089, POL_2090],
  relatedClaims: [CLM_3318, CLM_3210],
  relatedDocuments: [DOC_441, DOC_510],
  relatedTasks: [],
  tasks: tasks_3318,
  insights: insights_3318,
  timeline: timeline_3318,
  documents: documents_3318,
  messages: messages_3318,
  tags: ["water-damage", "coastal", "fraud-review", "renewal-watch"],
};

const CUSTOMER_OMAR: CaseEntityRef = {
  type: "customer",
  id: "CUS-1188",
  label: "Omar Reyes",
  sublabel: "SMB · Fleet account",
};
const POL_3344: CaseEntityRef = {
  type: "policy",
  id: "POL-3344",
  label: "POL-3344",
  sublabel: "Commercial auto · 14 vehicles",
};
const CLM_4101: CaseEntityRef = {
  type: "claim",
  id: "CLM-4101",
  label: "CLM-4101",
  sublabel: "Multi-vehicle collision",
};

const CASE_FLEET: CaseRecord = {
  id: "CASE-2032",
  reference: "CASE-2032",
  title: "Fleet collision — multi-claim coordination",
  summary:
    "Three drivers, two vehicles, overlapping liability. Coordinating across two adjusters and pending police report.",
  severity: "high",
  status: "in_review",
  assignedTeam: "Commercial Auto",
  assignedLead: "Dana Wu",
  createdAt: hoursAgo(40),
  updatedAt: hoursAgo(2),
  sla: { label: "Liability assessment SLA", dueAt: hoursFromNow(30), startedAt: hoursAgo(36) },
  relatedCustomer: CUSTOMER_OMAR,
  relatedPolicies: [POL_3344],
  relatedClaims: [CLM_4101],
  relatedDocuments: [],
  relatedTasks: [],
  tasks: [
    {
      id: "T-F1",
      title: "Retrieve police report from county",
      status: "waiting",
      urgency: "high",
      assignee: "Dana Wu",
      dueAt: hoursFromNow(20),
      blocker: "County office processing — 3 business day SLA",
    },
    {
      id: "T-F2",
      title: "Align liability split with co-insurer",
      status: "in_progress",
      urgency: "medium",
      assignee: "Dana Wu",
    },
    {
      id: "T-F3",
      title: "Customer outreach — rental coverage",
      status: "open",
      urgency: "medium",
      assignee: "Service desk",
    },
  ],
  insights: [
    {
      id: "CI-F1",
      severity: "high",
      category: "workflow",
      confidence: 81,
      title: "Two adjusters editing same claim",
      explanation:
        "Dana Wu and Tariq Ali both have active sessions on CLM-4101. Risk of conflicting notes.",
      source: "Workflow coordinator",
      relatedEntity: CLM_4101,
      triggers: ["Concurrent edits in last 60min", "Same claim, different teams"],
      suggestedActions: [{ id: "x1", label: "Lock to primary adjuster", priority: "primary" }],
    },
    {
      id: "CI-F2",
      severity: "medium",
      category: "coverage",
      confidence: 70,
      title: "Rental reimbursement cap may be exceeded",
      explanation:
        "Estimated repair time of 18 days vs. 14-day rental cap on POL-3344. Recommend pre-approval.",
      source: "Coverage analyzer",
      relatedEntity: POL_3344,
      suggestedActions: [{ id: "x2", label: "Request pre-approval", priority: "primary" }],
    },
  ],
  timeline: [
    {
      id: "EVF-1",
      type: "case_created",
      timestamp: hoursAgo(40),
      actor: { name: "Routing automation", kind: "automation" },
      description: "Case opened — multi-vehicle collision on commercial fleet",
    },
    {
      id: "EVF-2",
      type: "claim_filed",
      timestamp: hoursAgo(39),
      actor: { name: "Omar Reyes", kind: "customer" },
      description: "Claim filed via broker portal",
      relatedEntity: CLM_4101,
    },
    {
      id: "EVF-3",
      type: "ai_insight",
      timestamp: hoursAgo(20),
      actor: { name: "Workflow coordinator", kind: "ai" },
      description: "Detected concurrent edits on CLM-4101",
    },
    {
      id: "EVF-4",
      type: "internal_note",
      timestamp: hoursAgo(2),
      actor: { name: "Dana Wu", kind: "user" },
      description: "Waiting on county police report — escalation if not in by Friday",
    },
  ],
  documents: [
    {
      id: "DOC-F1",
      name: "Scene photos (8)",
      kind: "photo",
      status: "ai_reviewed",
      uploadedBy: "Omar Reyes",
      uploadedAt: hoursAgo(39),
      relatedEntity: CLM_4101,
      aiSummary: "Front-end collision damage on two vehicles. No fire/smoke indicators.",
    },
    {
      id: "DOC-F2",
      name: "Police report",
      kind: "report",
      status: "missing",
      relatedEntity: CLM_4101,
    },
  ],
  messages: [
    {
      id: "MF-1",
      channel: "portal",
      direction: "inbound",
      author: { name: "Omar Reyes", kind: "customer" },
      timestamp: hoursAgo(39),
      subject: "Filing fleet collision",
      body: "Two of our vans hit by a third-party driver this morning. Photos attached.",
    },
    {
      id: "MF-2",
      channel: "internal",
      direction: "internal",
      author: { name: "Dana Wu", kind: "user" },
      timestamp: hoursAgo(2),
      body: "@tariq please hand off CLM-4101 edits to me to avoid conflicts.",
    },
  ],
  tags: ["fleet", "commercial-auto", "multi-party"],
};

const CUSTOMER_LIN: CaseEntityRef = {
  type: "customer",
  id: "CUS-1331",
  label: "Lin Park",
  sublabel: "Renewal · 3 policies",
};
const POL_4501: CaseEntityRef = {
  type: "policy",
  id: "POL-4501",
  label: "POL-4501",
  sublabel: "Homeowners · renewal in 14d",
};

const CASE_RENEWAL: CaseRecord = {
  id: "CASE-2033",
  reference: "CASE-2033",
  title: "Renewal review — coverage gap risk",
  summary:
    "Bundle of three policies renewing together. AI flagged a coverage gap between umbrella and home, customer has not engaged yet.",
  severity: "medium",
  status: "open",
  assignedTeam: "Customer Success · Renewals",
  assignedLead: "Sofia Alvarez",
  createdAt: hoursAgo(24 * 5),
  updatedAt: hoursAgo(6),
  sla: { label: "Renewal outreach SLA", dueAt: hoursFromNow(48), startedAt: hoursAgo(24) },
  relatedCustomer: CUSTOMER_LIN,
  relatedPolicies: [POL_4501],
  relatedClaims: [],
  relatedDocuments: [],
  relatedTasks: [],
  tasks: [
    {
      id: "T-R1",
      title: "Send personalized renewal review email",
      status: "open",
      urgency: "medium",
      assignee: "Sofia Alvarez",
      dueAt: hoursFromNow(48),
    },
    {
      id: "T-R2",
      title: "Generate coverage comparison sheet",
      status: "done",
      urgency: "low",
      assignee: "Automation",
    },
  ],
  insights: [
    {
      id: "CI-R1",
      severity: "medium",
      category: "coverage",
      confidence: 75,
      title: "Umbrella vs. home liability mismatch",
      explanation:
        "Umbrella policy requires $300k home liability but home policy is $250k. Bundle won't qualify for discount at renewal.",
      source: "Coverage analyzer",
      relatedEntity: POL_4501,
      suggestedActions: [{ id: "y1", label: "Suggest liability bump", priority: "primary" }],
    },
  ],
  timeline: [
    {
      id: "EVR-1",
      type: "case_created",
      timestamp: hoursAgo(24 * 5),
      actor: { name: "Renewal automation", kind: "automation" },
      description: "Renewal case auto-created — bundle within 30d window",
    },
    {
      id: "EVR-2",
      type: "ai_insight",
      timestamp: hoursAgo(48),
      actor: { name: "Coverage analyzer", kind: "ai" },
      description: "Bundle discount qualification at risk",
    },
  ],
  documents: [],
  messages: [],
  tags: ["renewal", "bundle", "customer-success"],
};

export const MOCK_CASES: CaseRecord[] = [CASE_3318, CASE_FLEET, CASE_RENEWAL];

export function getCaseById(id: string): CaseRecord | undefined {
  return MOCK_CASES.find((c) => c.id === id || c.reference === id);
}
