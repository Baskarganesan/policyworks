import { useState } from "react";
import { Brain, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SimilarCasesPanel } from "./SimilarCasesPanel";
import { LessonLearnedCard } from "./LessonLearnedCard";
import { KnowledgeReferenceCard } from "./KnowledgeReferenceCard";
import { OperationalPlaybookCard } from "./OperationalPlaybookCard";
import { ExpertInsightCard } from "./ExpertInsightCard";
import { getInstitutionalMemory } from "./mockData";
import type { KnowledgeContext } from "./types";

type Tab = "similar" | "lessons" | "knowledge" | "playbooks" | "experts";

const TAB_LABEL: Record<Tab, string> = {
  similar: "Similar cases",
  lessons: "Lessons",
  knowledge: "Knowledge",
  playbooks: "Playbooks",
  experts: "Expert notes",
};

interface Props {
  context: KnowledgeContext;
  entityId: string;
  title?: string;
  description?: string;
  defaultExpanded?: boolean;
  className?: string;
}

export function InstitutionalMemoryPanel({
  context,
  entityId,
  title,
  description,
  defaultExpanded = true,
  className,
}: Props) {
  const bundle = getInstitutionalMemory(context, entityId);
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [tab, setTab] = useState<Tab>("similar");

  const counts: Record<Tab, number> = {
    similar: bundle.similarCases.length,
    lessons: bundle.similarCases.reduce((n, c) => n + c.lessonsLearned.length, 0),
    knowledge: bundle.insights.length,
    playbooks: bundle.playbooks.length,
    experts: bundle.expertNotes.length,
  };

  const topMatch = bundle.similarCases[0];

  return (
    <section className={cn("space-y-3 rounded-lg border bg-card/40 p-3", className)}>
      <header className="flex flex-wrap items-start justify-between gap-2">
        <div className="space-y-0.5">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
            <Brain className="h-3 w-3" />
            Institutional memory
          </div>
          <h3 className="text-sm font-semibold">{title ?? bundle.headline}</h3>
          <p className="text-xs text-muted-foreground">{description ?? bundle.summary}</p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => setExpanded((v) => !v)}
          className="h-7 gap-1 text-xs"
        >
          {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          {expanded ? "Collapse" : "Explore memory"}
        </Button>
      </header>

      {!expanded && topMatch && (
        <div className="rounded-md border bg-card px-3 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Closest match · {topMatch.similarityScore}% similar
          </p>
          <p className="text-sm font-medium">{topMatch.title}</p>
          <p className="text-xs text-muted-foreground">{topMatch.outcomeSummary}</p>
        </div>
      )}

      {expanded && (
        <>
          <nav className="flex flex-wrap gap-1 border-b">
            {(Object.keys(TAB_LABEL) as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={cn(
                  "relative -mb-px px-2.5 py-1.5 text-xs font-medium transition-colors",
                  tab === t
                    ? "border-b-2 border-primary text-foreground"
                    : "border-b-2 border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                {TAB_LABEL[t]}
                {counts[t] > 0 && (
                  <span className="ml-1 rounded-sm bg-muted px-1 py-0.5 text-[10px] text-muted-foreground">
                    {counts[t]}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {tab === "similar" && <SimilarCasesPanel cases={bundle.similarCases} />}
          {tab === "lessons" && <LessonLearnedCard cases={bundle.similarCases} />}
          {tab === "knowledge" && (
            <div className="grid gap-2 md:grid-cols-2">
              {bundle.insights.map((i) => (
                <KnowledgeReferenceCard key={i.id} insight={i} />
              ))}
            </div>
          )}
          {tab === "playbooks" && (
            <div className="space-y-2">
              {bundle.playbooks.map((p) => (
                <OperationalPlaybookCard key={p.id} playbook={p} />
              ))}
            </div>
          )}
          {tab === "experts" && (
            <div className="grid gap-2 md:grid-cols-2">
              {bundle.expertNotes.map((n) => (
                <ExpertInsightCard key={n.id} note={n} />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
