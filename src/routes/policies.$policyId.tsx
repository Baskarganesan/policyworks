import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PolicyHeader } from "@/features/policies/PolicyHeader";
import { CoverageCard } from "@/features/policies/CoverageCard";
import { ClaimsLinkedTable } from "@/features/policies/ClaimsLinkedTable";
import { PolicyDocumentsPanel } from "@/features/policies/PolicyDocumentsPanel";
import { RenewalTimeline } from "@/features/policies/RenewalTimeline";
import { RiskFlagCard } from "@/features/policies/RiskFlagCard";
import { PolicyInsightCard } from "@/features/policies/PolicyInsightCard";
import { PolicyActivityFeed } from "@/features/policies/PolicyActivityFeed";
import { EndorsementsList } from "@/features/policies/EndorsementsList";
import { SectionNav } from "@/features/policies/SectionNav";
import { PolicySection } from "@/features/policies/PolicySection";
import { getPolicyById } from "@/features/policies/mockData";
import type { CoverageItem, PolicyInsight, RiskFlag } from "@/features/policies/types";

export const Route = createFileRoute("/policies/$policyId")({
  head: ({ params }) => ({
    meta: [
      { title: `Policy ${params.policyId} — Policyworks` },
      { name: "description", content: "Operational workspace for an insurance policy: coverage, claims, renewals, and risk." },
    ],
  }),
  loader: ({ params }) => {
    const policy = getPolicyById(params.policyId);
    if (!policy) throw notFound();
    return { policy };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-md p-12 text-center">
      <h1 className="text-xl font-semibold">Policy not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        The requested policy doesn't exist or was archived.
      </p>
      <Button asChild size="sm" className="mt-4">
        <Link to="/policies">Browse policies</Link>
      </Button>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-md p-12 text-center">
      <h1 className="text-xl font-semibold">Something went wrong</h1>
      <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
    </div>
  ),
  component: PolicyDetailPage,
});

function PolicyDetailPage() {
  const { policy } = Route.useLoaderData();

  const navItems = [
    { id: "summary", label: "Summary" },
    { id: "coverage", label: "Coverage", count: policy.coverage.length },
    { id: "claims", label: "Claims", count: policy.claims.length },
    { id: "documents", label: "Documents", count: policy.documents.length },
    { id: "endorsements", label: "Endorsements", count: policy.endorsements.length },
    { id: "renewal", label: "Renewal" },
    { id: "insights", label: "AI insights", count: policy.insights.length },
    { id: "risks", label: "Risk flags", count: policy.riskFlags.length },
    { id: "activity", label: "Activity" },
  ];

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="sticky top-14 z-20 bg-background">
        <PolicyHeader policy={policy} />
      </div>

      <div className="flex-1">
        <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[200px_1fr] lg:px-8 lg:py-8">
          <aside className="hidden lg:block">
            <div className="sticky top-[260px]">
              <p className="px-2.5 pb-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                On this page
              </p>
              <SectionNav items={navItems} />
            </div>
          </aside>

          <div id="summary" className="min-w-0 space-y-8 scroll-mt-32">
            <PolicySection
              id="coverage"
              title="Coverage overview"
              description="Limits, deductibles, and exclusions across coverage categories."
            >
              <div className="space-y-2">
                {policy.coverage.map((c: CoverageItem) => (
                  <CoverageCard key={c.id} item={c} />
                ))}
              </div>
            </PolicySection>

            <PolicySection
              id="claims"
              title="Related claims"
              description="Claims activity tied to this policy."
            >
              <ClaimsLinkedTable claims={policy.claims} />
            </PolicySection>

            <PolicySection
              id="documents"
              title="Documents"
              description="Policy contracts, riders, endorsements, and renewals."
            >
              <PolicyDocumentsPanel documents={policy.documents} />
            </PolicySection>

            <PolicySection
              id="endorsements"
              title="Endorsements & riders"
              description="Active modifications to the base policy."
            >
              <EndorsementsList endorsements={policy.endorsements} />
            </PolicySection>

            <PolicySection
              id="renewal"
              title="Renewal timeline"
              description="Milestones, owners, and blockers for the upcoming renewal."
            >
              <RenewalTimeline milestones={policy.renewalTimeline} />
            </PolicySection>

            <PolicySection
              id="insights"
              title="AI insights"
              description="Analytical signals from policy review and benchmarks."
            >
              <div className="grid gap-2 md:grid-cols-2">
                {policy.insights.map((i: PolicyInsight) => (
                  <PolicyInsightCard key={i.id} insight={i} />
                ))}
              </div>
            </PolicySection>

            <PolicySection
              id="risks"
              title="Risk flags"
              description="Operational and underwriting risks requiring attention."
            >
              <div className="grid gap-2 md:grid-cols-2">
                {policy.riskFlags.map((r: RiskFlag) => (
                  <RiskFlagCard key={r.id} flag={r} />
                ))}
              </div>
            </PolicySection>

            <PolicySection
              id="activity"
              title="Activity"
              description="Recent operational events on this policy."
            >
              <PolicyActivityFeed events={policy.activity} />
            </PolicySection>
          </div>
        </div>
      </div>
    </div>
  );
}
