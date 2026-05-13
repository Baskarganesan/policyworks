import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { ContentContainer } from "@/components/layout/ContentContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/customers")({
  head: () => ({
    meta: [
      { title: "Customers — Policyworks" },
      { name: "description", content: "Manage policyholders, contacts, and household relationships." },
    ],
  }),
  component: CustomersPage,
});

function CustomersPage() {
  return (
    <ContentContainer>
      <PageHeader
        title="Customers"
        description="Manage policyholders, household relationships, and contact preferences."
        actions={<Button size="sm">Add customer</Button>}
      />
      <div className="mt-8">
        <EmptyState
          icon={<Users className="h-5 w-5" />}
          title="No customers yet"
          description="Import your customer list or create a profile to start tracking policies and interactions."
        />
      </div>
    </ContentContainer>
  );
}
