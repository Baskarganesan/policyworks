import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, RefreshCw, Filter } from "lucide-react";
import { ContentContainer } from "@/components/layout/ContentContainer";
import { Button } from "@/components/ui/button";
import { KPIStatCard } from "@/features/dashboard/KPIStatCard";
import { DashboardSection } from "@/features/dashboard/DashboardSection";
import { AlertsPanel } from "@/features/dashboard/AlertsPanel";
import { OperationalQueueTable } from "@/features/dashboard/OperationalQueueTable";
import { ActivityTimeline } from "@/features/dashboard/ActivityTimeline";
import { AIInsightsPanel } from "@/features/dashboard/AIInsightCard";
import { RenewalsList } from "@/features/dashboard/RenewalsList";
import { ClaimsAttentionCard } from "@/features/dashboard/ClaimsAttentionCard";
import {
  mockActivity,
  mockAlerts,
  mockClaimsAttention,
  mockInsights,
  mockMetrics,
  mockQueue,
  mockRenewals,
} from "@/features/dashboard/mockData";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Operations Dashboard — Policyworks" },
      {
        name: "description",
        content:
          "Operational command center for insurance teams — claims, renewals, alerts, and AI insights at a glance.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <ContentContainer>
      {/* Sticky header */}
      <div className="sticky top-0 z-10 -mx-4 -mt-6 mb-6 border-b bg-background/85 px-4 py-4 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Operations</h1>
            <p className="text-sm text-muted-foreground">
              What needs attention across claims, policies, and customers right now.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" className="h-8 gap-1.5 px-2 text-xs">
              <Filter className="h-3.5 w-3.5" />
              All teams
            </Button>
            <Button size="sm" variant="outline" className="h-8 gap-1.5 px-2.5 text-xs">
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh
            </Button>
            <Button size="sm" className="h-8 gap-1.5 px-2.5 text-xs">
              <Plus className="h-3.5 w-3.5" />
              New claim
            </Button>
          </div>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {mockMetrics.map((m) => (
          <KPIStatCard
            key={m.id}
            metric={m}
            invertTrend={m.id === "ai-questions"}
          />
        ))}
      </div>

      {/* Main grid */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Left column (2/3) */}
        <div className="space-y-4 lg:col-span-2">
          <DashboardSection
            title="Operational alerts"
            description="Priority-ranked issues requiring intervention."
            actions={
              <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
                View all
              </Button>
            }
          >
            <AlertsPanel alerts={mockAlerts} />
          </DashboardSection>

          <DashboardSection
            title="Needs attention"
            description="High-priority work queue across your team."
            actions={
              <Button asChild size="sm" variant="ghost" className="h-7 px-2 text-xs">
                <Link to="/tasks">Open queue</Link>
              </Button>
            }
            contentClassName="p-0"
          >
            <div className="p-4">
              <OperationalQueueTable items={mockQueue} />
            </div>
          </DashboardSection>

          <DashboardSection
            title="Claims requiring action"
            description="Stalled, escalated, missing documentation, or high value."
            actions={
              <Button asChild size="sm" variant="ghost" className="h-7 px-2 text-xs">
                <Link to="/claims">Go to claims</Link>
              </Button>
            }
          >
            <ClaimsAttentionCard items={mockClaimsAttention} />
          </DashboardSection>
        </div>

        {/* Right column (1/3) */}
        <div className="space-y-4">
          <DashboardSection
            title="AI insights"
            description="Operational signals derived from your data."
          >
            <AIInsightsPanel insights={mockInsights} />
          </DashboardSection>

          <DashboardSection
            title="Upcoming renewals"
            description="Next 14 days, ranked by risk."
            actions={
              <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
                View all
              </Button>
            }
          >
            <RenewalsList renewals={mockRenewals} />
          </DashboardSection>

          <DashboardSection
            title="Recent activity"
            description="Workspace-wide operational events."
          >
            <ActivityTimeline events={mockActivity} />
          </DashboardSection>
        </div>
      </div>
    </ContentContainer>
  );
}
