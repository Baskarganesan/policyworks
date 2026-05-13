import { createFileRoute } from "@tanstack/react-router";
import { ClipboardList } from "lucide-react";
import { ContentContainer } from "@/components/layout/ContentContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/claims")({
  head: () => ({
    meta: [
      { title: "Claims — Policyworks" },
      { name: "description", content: "Track and manage the lifecycle of insurance claims." },
    ],
  }),
  component: ClaimsPage,
});

function ClaimsPage() {
  return (
    <ContentContainer>
      <PageHeader
        title="Claims"
        description="Track claim status, assignments, and payouts across your book of business."
        actions={<Button size="sm">New claim</Button>}
      />
      <div className="mt-8">
        <EmptyState
          icon={<ClipboardList className="h-5 w-5" />}
          title="No claims to display"
          description="Open claims will appear here as they are filed by customers or imported from your carriers."
        />
      </div>
    </ContentContainer>
  );
}
