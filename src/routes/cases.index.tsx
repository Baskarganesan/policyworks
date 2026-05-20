import { createFileRoute, Link } from "@tanstack/react-router";
import { Briefcase, ChevronRight } from "lucide-react";
import { ContentContainer } from "@/components/layout/ContentContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { SLAIndicator } from "@/features/cases/SLAIndicator";
import { MOCK_CASES } from "@/features/cases/mockData";
import type { CaseSeverity, CaseStatus } from "@/features/cases/types";

export const Route = createFileRoute("/cases/")({
  head: () => ({
    meta: [
      { title: "Cases — Policyworks" },
      { name: "description", content: "Unified operational case workspaces across claims, policies, and customers." },
    ],
  }),
  component: CasesIndex,
});

const SEVERITY_TONE: Record<CaseSeverity, "danger" | "warning" | "info" | "neutral"> = {
  critical: "danger",
  high: "warning",
  medium: "info",
  low: "neutral",
};

const STATUS_TONE: Record<CaseStatus, "success" | "warning" | "danger" | "info" | "neutral"> = {
  open: "info",
  in_review: "info",
  blocked: "warning",
  escalated: "danger",
  resolved: "success",
  closed: "neutral",
};

const STATUS_LABEL: Record<CaseStatus, string> = {
  open: "Open",
  in_review: "In review",
  blocked: "Blocked",
  escalated: "Escalated",
  resolved: "Resolved",
  closed: "Closed",
};

function CasesIndex() {
  return (
    <ContentContainer>
      <PageHeader
        title="Cases"
        description={`${MOCK_CASES.length} active operational cases coordinating claims, policies, and customers`}
      />
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {MOCK_CASES.map((c) => {
          const openTasks = c.tasks.filter((t) => t.status !== "done").length;
          const critical = c.insights.filter((i) => i.severity === "critical").length;
          return (
            <Link
              key={c.id}
              to="/cases/$caseId"
              params={{ caseId: c.id }}
              className="group rounded-lg border bg-card p-4 transition-colors hover:border-foreground/20"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">{c.reference}</span>
                    </div>
                    <p className="line-clamp-1 text-sm font-semibold">{c.title}</p>
                    <p className="line-clamp-2 text-xs text-muted-foreground">{c.summary}</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <StatusBadge tone={SEVERITY_TONE[c.severity]}>{c.severity.toUpperCase()}</StatusBadge>
                <StatusBadge tone={STATUS_TONE[c.status]}>{STATUS_LABEL[c.status]}</StatusBadge>
                {critical > 0 && <StatusBadge tone="danger">{critical} critical insight</StatusBadge>}
                {openTasks > 0 && <StatusBadge tone="neutral">{openTasks} open tasks</StatusBadge>}
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3 border-t pt-3 text-xs">
                <div>
                  <div className="text-muted-foreground">Customer</div>
                  <div className="truncate font-medium">{c.relatedCustomer.label}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Policies</div>
                  <div className="truncate font-mono">
                    {c.relatedPolicies.map((p) => p.label).join(", ") || "—"}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Claims</div>
                  <div className="truncate font-mono">
                    {c.relatedClaims.map((cl) => cl.label).join(", ") || "—"}
                  </div>
                </div>
              </div>
              <div className="mt-3 border-t pt-3">
                <SLAIndicator sla={c.sla} compact />
              </div>
            </Link>
          );
        })}
      </div>
    </ContentContainer>
  );
}
