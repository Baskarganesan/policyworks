import { createFileRoute } from "@tanstack/react-router";
import { LayoutDashboard } from "lucide-react";
import { ContentContainer } from "@/components/layout/ContentContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <ContentContainer>
      <PageHeader
        title="Dashboard"
        description="Overview of policies, claims, and customer activity across your workspace."
        actions={<Button size="sm">New report</Button>}
      />
      <div className="mt-8">
        <EmptyState
          icon={<LayoutDashboard className="h-5 w-5" />}
          title="Your workspace is ready"
          description="Connect your first policy document or sync customer data to start populating your dashboard."
        />
      </div>
    </ContentContainer>
  );
}
