import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { ContentContainer } from "@/components/layout/ContentContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";

export const Route = createFileRoute("/ai-qa")({
  head: () => ({
    meta: [
      { title: "AI Policy Q&A — Policyworks" },
      { name: "description", content: "Ask natural-language questions about any policy document." },
    ],
  }),
  component: AIQAPage,
});

function AIQAPage() {
  return (
    <ContentContainer>
      <PageHeader
        title="AI Policy Q&A"
        description="Ask natural-language questions about coverage, exclusions, and endorsements."
      />
      <div className="mt-8">
        <EmptyState
          icon={<Sparkles className="h-5 w-5" />}
          title="No conversations yet"
          description="Upload a policy and start asking questions to see AI-powered answers grounded in your documents."
        />
      </div>
    </ContentContainer>
  );
}
