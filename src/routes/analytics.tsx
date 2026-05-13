import { createFileRoute } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";
import { ContentContainer } from "@/components/layout/ContentContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — Policyworks" },
      { name: "description", content: "Insights across policies, claims, and customer operations." },
    ],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  return (
    <ContentContainer>
      <PageHeader
        title="Analytics"
        description="Insights across policies, claims volume, retention, and team performance."
      />
      <div className="mt-8">
        <EmptyState
          icon={<BarChart3 className="h-5 w-5" />}
          title="Not enough data yet"
          description="Once policies and claims are flowing in, your dashboards will populate automatically."
        />
      </div>
    </ContentContainer>
  );
}
