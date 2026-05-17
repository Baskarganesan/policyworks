import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Shield } from "lucide-react";
import { ContentContainer } from "@/components/layout/ContentContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { MOCK_POLICIES } from "@/features/policies/mockData";
import { POLICY_STATUS_LABELS, POLICY_TYPE_LABELS, type PolicyStatus } from "@/features/policies/types";
import { formatCurrency, formatDate, daysUntil } from "@/features/policies/utils";

export const Route = createFileRoute("/policies/")({
  head: () => ({
    meta: [
      { title: "Policies — Policyworks" },
      { name: "description", content: "Browse and manage insurance policies." },
    ],
  }),
  component: PoliciesIndex,
});

const TONE: Record<PolicyStatus, "success" | "warning" | "danger" | "neutral" | "info"> = {
  active: "success", pending_renewal: "warning", lapsed: "danger", cancelled: "neutral", in_review: "info",
};

function PoliciesIndex() {
  return (
    <ContentContainer>
      <PageHeader title="Policies" description={`${MOCK_POLICIES.length} active policies across the workspace`} />
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {MOCK_POLICIES.map((p) => {
          const days = daysUntil(p.renewalDate);
          const renewalSoon = days >= 0 && days <= 60;
          return (
            <Link
              key={p.id}
              to="/policies/$policyId"
              params={{ policyId: p.id }}
              className="group rounded-lg border bg-card p-4 transition-colors hover:border-foreground/20"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{POLICY_TYPE_LABELS[p.type]}</span>
                      <span className="font-mono text-xs text-muted-foreground">{p.policyNumber}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{p.carrier} · {p.customer.name}</div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <StatusBadge tone={TONE[p.status]}>{POLICY_STATUS_LABELS[p.status]}</StatusBadge>
                {renewalSoon && <StatusBadge tone="warning">Renews in {days}d</StatusBadge>}
                {p.riskFlags.some((r) => r.severity === "high" || r.severity === "critical") && (
                  <StatusBadge tone="danger">Risk flagged</StatusBadge>
                )}
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3 border-t pt-3 text-xs">
                <div>
                  <div className="text-muted-foreground">Coverage</div>
                  <div className="font-medium">{formatCurrency(p.coverageAmount, { compact: true })}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Premium</div>
                  <div className="font-medium">{formatCurrency(p.annualPremium)}/yr</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Renews</div>
                  <div className="font-medium">{formatDate(p.renewalDate)}</div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </ContentContainer>
  );
}
