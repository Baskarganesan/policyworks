import { createFileRoute } from "@tanstack/react-router";
import { Settings as SettingsIcon } from "lucide-react";
import { ContentContainer } from "@/components/layout/ContentContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Policyworks" },
      { name: "description", content: "Workspace, team, and integration settings." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <ContentContainer>
      <PageHeader
        title="Settings"
        description="Manage your workspace, team members, integrations, and preferences."
      />
      <div className="mt-8">
        <EmptyState
          icon={<SettingsIcon className="h-5 w-5" />}
          title="Settings coming soon"
          description="Workspace, team, and integration controls will appear here."
        />
      </div>
    </ContentContainer>
  );
}
