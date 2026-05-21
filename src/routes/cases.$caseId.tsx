import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  CaseWorkspaceLayout,
  CaseWorkspaceSection,
} from "@/features/cases/CaseWorkspaceLayout";
import { UnifiedTimeline } from "@/features/cases/UnifiedTimeline";
import { LinkedEntitiesPanel } from "@/features/cases/LinkedEntitiesPanel";
import { RiskInsightsPanel } from "@/features/cases/RiskInsightsPanel";
import { TasksBlockersPanel } from "@/features/cases/TasksBlockersPanel";
import { EvidencePanel } from "@/features/cases/EvidencePanel";
import { CommunicationFeed } from "@/features/cases/CommunicationFeed";
import { AuditTimeline } from "@/features/explainability/AuditTimeline";
import { getAuditEventsFor } from "@/features/explainability/mockData";
import { ExceptionsList } from "@/features/exceptions/EscalationPanel";
import { getExceptionsByEntity } from "@/features/exceptions/mockData";
import { getCaseById } from "@/features/cases/mockData";
import type { CaseRecord } from "@/features/cases/types";

export const Route = createFileRoute("/cases/$caseId")({
  head: ({ params }) => ({
    meta: [
      { title: `Case ${params.caseId} — Policyworks` },
      {
        name: "description",
        content:
          "Unified case workspace: timeline, linked entities, risks, blockers, evidence, and audit trail.",
      },
    ],
  }),
  loader: ({ params }): { record: CaseRecord } => {
    const record = getCaseById(params.caseId);
    if (!record) throw notFound();
    return { record };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-md p-12 text-center">
      <h1 className="text-xl font-semibold">Case not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        The requested case doesn't exist or was archived.
      </p>
      <Button asChild size="sm" className="mt-4">
        <Link to="/cases">Browse cases</Link>
      </Button>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-md p-12 text-center">
      <h1 className="text-xl font-semibold">Something went wrong</h1>
      <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
    </div>
  ),
  component: CaseDetailPage,
});

function CaseDetailPage() {
  const { record } = Route.useLoaderData();

  const exceptions = [
    ...getExceptionsByEntity("case", record.id),
    ...record.relatedClaims.flatMap((c: CaseRecord["relatedClaims"][number]) => getExceptionsByEntity("claim", c.id)),
  ].filter((ex, idx, arr) => arr.findIndex((x) => x.id === ex.id) === idx);

  const navItems = [
    { id: "exceptions", label: "Exceptions & escalations", count: exceptions.length },
    { id: "insights", label: "Risks & insights", count: record.insights.length },
    { id: "tasks", label: "Tasks & blockers", count: record.tasks.filter((t: CaseRecord["tasks"][number]) => t.status !== "done").length },
    { id: "timeline", label: "Timeline", count: record.timeline.length },
    { id: "evidence", label: "Evidence", count: record.documents.length },
    { id: "communication", label: "Communication", count: record.messages.length },
    { id: "audit", label: "Audit & explainability" },
  ];

  const main = (
    <>
      <CaseWorkspaceSection
        id="exceptions"
        title="Exceptions & escalations"
        description="Active recovery workflows: SLA breaches, conflicts, blockers, and approval bottlenecks."
      >
        <ExceptionsList exceptions={exceptions} />
      </CaseWorkspaceSection>

      <CaseWorkspaceSection
        id="insights"
        title="Risks & AI insights"
        description="Operational signals across coverage, fraud, SLA, and workflow."
      >
        <RiskInsightsPanel insights={record.insights} />
      </CaseWorkspaceSection>

      <CaseWorkspaceSection
        id="tasks"
        title="Tasks & blockers"
        description="Open work, pending approvals, and unresolved dependencies."
      >
        <TasksBlockersPanel tasks={record.tasks} />
      </CaseWorkspaceSection>

      <CaseWorkspaceSection
        id="timeline"
        title="Unified timeline"
        description="One stream across claims, documents, AI, customer, and audit events."
      >
        <UnifiedTimeline events={record.timeline} />
      </CaseWorkspaceSection>

      <CaseWorkspaceSection
        id="evidence"
        title="Documents & evidence"
        description="Indexed files, AI-reviewed evidence, and missing requests."
      >
        <EvidencePanel documents={record.documents} />
      </CaseWorkspaceSection>

      <CaseWorkspaceSection
        id="communication"
        title="Communication history"
        description="Customer outreach and internal coordination."
      >
        <CommunicationFeed messages={record.messages} />
      </CaseWorkspaceSection>

      <CaseWorkspaceSection
        id="audit"
        title="Audit & explainability"
        description="Traceable events with actor, source, and timestamp."
      >
        <AuditTimeline events={getAuditEventsFor("claim", record.relatedClaims[0]?.id ?? record.id)} />
      </CaseWorkspaceSection>
    </>
  );

  const side = (
    <>
      <section className="space-y-3">
        <h2 className="text-sm font-semibold tracking-tight">Linked entities</h2>
        <LinkedEntitiesPanel record={record} />
      </section>
    </>
  );

  return <CaseWorkspaceLayout record={record} navItems={navItems} main={main} side={side} />;
}
