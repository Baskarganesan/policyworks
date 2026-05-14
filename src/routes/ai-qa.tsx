import { createFileRoute } from "@tanstack/react-router";
import { AIChatLayout } from "@/features/ai-qa/AIChatLayout";

export const Route = createFileRoute("/ai-qa")({
  head: () => ({
    meta: [
      { title: "AI Policy Q&A — Policyworks" },
      {
        name: "description",
        content:
          "Ask natural-language questions about coverage, exclusions, and endorsements with cited answers from your policy documents.",
      },
      { property: "og:title", content: "AI Policy Q&A — Policyworks" },
      {
        property: "og:description",
        content: "Cited, AI-powered answers grounded in your indexed insurance policy documents.",
      },
    ],
  }),
  component: AIQAPage,
});

function AIQAPage() {
  return <AIChatLayout />;
}
