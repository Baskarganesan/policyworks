import type {
  AuditEvent,
  ChangeRecord,
  ContributingSignal,
  DecisionTrace,
  ExplainabilitySubject,
  SourceReference,
  TriggerCondition,
} from "./types";

function minutesAgo(m: number) {
  return new Date(Date.now() - m * 60_000).toISOString();
}

function seeded(key: string) {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) | 0;
  return Math.abs(h);
}

const SAMPLE_AUDIT_EVENTS: AuditEvent[] = [
  {
    id: "AE-001",
    type: "document_uploaded",
    actor: { name: "Jane Carter", kind: "user", role: "Policyholder" },
    timestamp: minutesAgo(60 * 26),
    entityType: "policy",
    entityId: "POL-2089",
    summary: "Uploaded property survey (Property survey.pdf)",
    source: "Customer portal",
  },
  {
    id: "AE-002",
    type: "ai_review_completed",
    actor: { name: "Coverage analyzer", kind: "ai" },
    timestamp: minutesAgo(60 * 6),
    entityType: "policy",
    entityId: "POL-2089",
    summary: "Endorsement scan completed — no flood rider detected",
    source: "AI coverage model v3.2",
  },
  {
    id: "AE-003",
    type: "risk_flag_generated",
    actor: { name: "Risk engine", kind: "system" },
    timestamp: minutesAgo(60 * 5),
    entityType: "policy",
    entityId: "POL-2089",
    summary: "Generated flag: Flood endorsement missing (confidence 82%)",
    source: "Geo-risk overlay",
  },
  {
    id: "AE-004",
    type: "claim_escalated",
    actor: { name: "Marcus Lee", kind: "user", role: "Adjuster" },
    timestamp: minutesAgo(60 * 3),
    entityType: "claim",
    entityId: "CLM-3318",
    summary: "Escalated for SIU review",
    source: "Manual escalation",
  },
  {
    id: "AE-005",
    type: "policy_updated",
    actor: { name: "Sarah Kim", kind: "user", role: "Underwriter" },
    timestamp: minutesAgo(60 * 48),
    entityType: "policy",
    entityId: "POL-2089",
    summary: "Annual premium adjusted",
    source: "Underwriting workspace",
  },
  {
    id: "AE-006",
    type: "workflow_reassigned",
    actor: { name: "Routing automation", kind: "automation" },
    timestamp: minutesAgo(90),
    entityType: "task",
    entityId: "TASK-2031",
    summary: "Reassigned to senior adjuster queue",
    source: "SLA escalation rule",
  },
  {
    id: "AE-007",
    type: "status_changed",
    actor: { name: "System", kind: "system" },
    timestamp: minutesAgo(30),
    entityType: "claim",
    entityId: "CLM-3318",
    summary: "Status changed: In review → Pending docs",
  },
];

const SAMPLE_CHANGES: ChangeRecord[] = [
  {
    id: "CH-1",
    field: "Status",
    before: "In review",
    after: "Pending documents",
    changedBy: { name: "System", kind: "system" },
    changedAt: minutesAgo(30),
  },
  {
    id: "CH-2",
    field: "Assignee",
    before: "Marcus Lee",
    after: "Senior adjuster queue",
    changedBy: { name: "Routing automation", kind: "automation" },
    changedAt: minutesAgo(90),
  },
  {
    id: "CH-3",
    field: "Coverage limit",
    before: "$240,000",
    after: "$285,000",
    changedBy: { name: "Sarah Kim", kind: "user", role: "Underwriter" },
    changedAt: minutesAgo(60 * 48),
  },
];

// ---- Trace templates ----

function floodTrace(subject: ExplainabilitySubject): DecisionTrace {
  const triggers: TriggerCondition[] = [
    { id: "t1", condition: "Active policy reviewed", source: "Policy registry", status: "matched", detail: "POL-2089 — Homeowners" },
    { id: "t2", condition: "Endorsement scan completed", source: "AI coverage model v3.2", status: "matched" },
    { id: "t3", condition: "Flood rider present on policy", source: "Endorsements table", status: "not_matched", detail: "No matching rider in last 24 months" },
    { id: "t4", condition: "Property ZIP in FEMA flood zone", source: "Geo-risk overlay", status: "matched", detail: "ZIP 33134 — Zone AE (high risk)" },
  ];
  const signals: ContributingSignal[] = [
    { id: "s1", kind: "geo", label: "FEMA flood zone AE classification", weight: 38, detail: "ZIP mapped to high-risk flood region" },
    { id: "s2", kind: "policy", label: "Missing flood rider", weight: 32, detail: "Endorsements scan returned no matching rider" },
    { id: "s3", kind: "history", label: "2 prior water-damage claims in region", weight: 18 },
    { id: "s4", kind: "document", label: "Property survey on file", weight: 12, detail: "Used to confirm property location" },
  ];
  const sources: SourceReference[] = [
    { id: "src1", kind: "policy", label: "Linked policy", reference: "POL-2089", updatedAt: minutesAgo(60 * 48) },
    { id: "src2", kind: "document", label: "Endorsements.pdf", reference: "DOC-441", updatedAt: minutesAgo(60 * 26) },
    { id: "src3", kind: "dataset", label: "FEMA flood overlay", reference: "geo-risk:v2025-04", updatedAt: minutesAgo(60 * 24 * 7) },
    { id: "src4", kind: "rule", label: "Coverage gap rule", reference: "rule:flood-rider-required" },
  ];
  return {
    id: `trace-${subject.subjectId}`,
    trigger: subject.title,
    triggerSource: "Coverage analyzer",
    confidence: subject.confidence ?? 82,
    rationale:
      "The linked policy has no flood endorsement on file while the insured property sits in a FEMA high-risk flood region. Two prior water-damage claims in the surrounding ZIP increase exposure.",
    triggers,
    signals,
    sources,
    events: SAMPLE_AUDIT_EVENTS.filter((e) => e.entityId === "POL-2089" || e.id === "AE-007"),
    changes: SAMPLE_CHANGES.slice(0, 2),
    relatedEntities: [
      { type: "policy", id: "POL-2089", label: "POL-2089" },
      { type: "document", id: "DOC-441", label: "Endorsements.pdf" },
    ],
    createdAt: minutesAgo(60 * 5),
  };
}

function slaTrace(subject: ExplainabilitySubject): DecisionTrace {
  const triggers: TriggerCondition[] = [
    { id: "t1", condition: "Claim created > 48h ago", source: "Claims registry", status: "matched", detail: "Created 64h ago" },
    { id: "t2", condition: "No adjuster update in last 24h", source: "Activity stream", status: "matched" },
    { id: "t3", condition: "SLA threshold exceeded", source: "SLA monitor", status: "matched", detail: "SLA: first action within 48h" },
    { id: "t4", condition: "Queue escalation triggered", source: "Routing automation", status: "matched" },
  ];
  const signals: ContributingSignal[] = [
    { id: "s1", kind: "behavior", label: "No customer or adjuster activity", weight: 45 },
    { id: "s2", kind: "data", label: "Claim age vs. SLA threshold", weight: 35 },
    { id: "s3", kind: "history", label: "Similar claims escalated previously", weight: 20 },
  ];
  const sources: SourceReference[] = [
    { id: "src1", kind: "claim", label: "Linked claim", reference: "CLM-3318", updatedAt: minutesAgo(60 * 3) },
    { id: "src2", kind: "rule", label: "Workflow SLA policy", reference: "rule:sla-claim-first-action" },
  ];
  return {
    id: `trace-${subject.subjectId}`,
    trigger: subject.title,
    triggerSource: "SLA monitor",
    confidence: subject.confidence ?? 92,
    rationale:
      "Claim CLM-3318 has been open for 64 hours without an adjuster update, breaching the 48h first-action SLA. The routing automation escalated the workflow to a senior queue.",
    triggers,
    signals,
    sources,
    events: SAMPLE_AUDIT_EVENTS.filter((e) => e.entityId === "CLM-3318" || e.entityId === "TASK-2031"),
    changes: SAMPLE_CHANGES.slice(0, 2),
    relatedEntities: [
      { type: "claim", id: "CLM-3318", label: "CLM-3318" },
      { type: "task", id: "TASK-2031", label: "TASK-2031" },
    ],
    createdAt: minutesAgo(20),
  };
}

function genericTrace(subject: ExplainabilitySubject): DecisionTrace {
  const sev = subject.severity ?? "medium";
  const conf = subject.confidence ?? (sev === "critical" ? 88 : sev === "high" ? 78 : 65);
  const rnd = seeded(subject.subjectId);
  const triggers: TriggerCondition[] = [
    { id: "t1", condition: "Operational signal generated", source: subject.category ?? "Risk engine", status: "matched" },
    { id: "t2", condition: "Related entity reviewed", source: "Cross-entity graph", status: "matched" },
    { id: "t3", condition: "Confidence above operational threshold", source: "Confidence scorer", status: conf >= 70 ? "matched" : "partial" },
  ];
  const signals: ContributingSignal[] = [
    { id: "s1", kind: "data", label: "Recent activity on linked entity", weight: 40 },
    { id: "s2", kind: "history", label: "Historical pattern match", weight: 30 },
    { id: "s3", kind: "document", label: "Supporting document references", weight: 20 },
    { id: "s4", kind: "behavior", label: "User-driven escalation history", weight: 10 },
  ];
  const sources: SourceReference[] = [
    { id: "src1", kind: "rule", label: "Operational rule set", reference: `rule:${subject.kind}-v${(rnd % 5) + 1}` },
    { id: "src2", kind: "dataset", label: "Customer 360 snapshot", reference: `snapshot:${(rnd % 1000).toString().padStart(4, "0")}` },
  ];
  return {
    id: `trace-${subject.subjectId}`,
    trigger: subject.title,
    triggerSource: subject.category ?? "Operational signal",
    confidence: conf,
    rationale:
      "This signal was generated by combining recent activity on the linked entity, historical patterns, and supporting document references. It is meant to surface attention, not enforce a decision.",
    triggers,
    signals,
    sources,
    events: SAMPLE_AUDIT_EVENTS.slice(0, 4),
    changes: SAMPLE_CHANGES,
    relatedEntities: [],
    createdAt: minutesAgo(30 + (rnd % 200)),
  };
}

export function getDecisionTrace(subject: ExplainabilitySubject): DecisionTrace {
  const t = subject.title.toLowerCase();
  if (t.includes("flood") || t.includes("endorsement")) return floodTrace(subject);
  if (t.includes("48 hours") || t.includes("sla") || t.includes("waiting") || t.includes("blocked")) {
    return slaTrace(subject);
  }
  return genericTrace(subject);
}

export function getAuditEventsFor(entityType: AuditEvent["entityType"], entityId: string): AuditEvent[] {
  const base = SAMPLE_AUDIT_EVENTS.filter((e) => e.entityType === entityType);
  // Always return something so the timeline is populated for any id
  if (base.length === 0) return SAMPLE_AUDIT_EVENTS.slice(0, 4);
  const offset = seeded(entityId) % base.length;
  return [...base.slice(offset), ...base.slice(0, offset)];
}

export function getChangeHistoryFor(_entityType: AuditEvent["entityType"], _entityId: string): ChangeRecord[] {
  return SAMPLE_CHANGES;
}
