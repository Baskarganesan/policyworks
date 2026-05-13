import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { ContentContainer } from "@/components/layout/ContentContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/documents")({
  head: () => ({
    meta: [
      { title: "Policy Documents — Policyworks" },
      { name: "description", content: "Upload, organize, and search insurance policy documents." },
    ],
  }),
  component: DocumentsPage,
});

function DocumentsPage() {
  return (
    <ContentContainer>
      <PageHeader
        title="Policy Documents"
        description="Upload, organize, and search policies, endorsements, and certificates."
        actions={<Button size="sm">Upload document</Button>}
      />
      <div className="mt-8">
        <EmptyState
          icon={<FileText className="h-5 w-5" />}
          title="No documents uploaded"
          description="Drop a PDF or import from your DMS to begin extracting policy data."
        />
      </div>
    </ContentContainer>
  );
}
