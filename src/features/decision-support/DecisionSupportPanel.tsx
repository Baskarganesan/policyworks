import { useState } from "react";
import { ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScenarioComparisonCard } from "./ScenarioComparisonCard";
import { OperationalDecisionMatrix } from "./OperationalDecisionMatrix";
import { GlobalHumanReviewNotice } from "./HumanReviewBanner";
import { InstitutionalMemoryPanel } from "@/features/knowledge/InstitutionalMemoryPanel";
import { getDecisionSupport } from "./mockData";
import type { DecisionContext } from "./types";

interface Props {
  context: DecisionContext;
  entityId: string;
  title?: string;
  description?: string;
  defaultExpanded?: boolean;
  showMatrix?: boolean;
  className?: string;
}

export function DecisionSupportPanel({
  context,
  entityId,
  title,
  description,
  defaultExpanded = true,
  showMatrix = true,
  className,
}: Props) {
  const bundle = getDecisionSupport(context, entityId);
  const [expanded, setExpanded] = useState(defaultExpanded);

  const recommended = bundle.scenarios.find((s) => s.recommended) ?? bundle.scenarios[0];

  return (
    <section className={cn("space-y-3 rounded-lg border bg-card/40 p-3", className)}>
      <header className="flex flex-wrap items-start justify-between gap-2">
        <div className="space-y-0.5">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
            <Sparkles className="h-3 w-3" />
            Decision support
          </div>
          <h3 className="text-sm font-semibold">{title ?? bundle.title}</h3>
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
          {expanded ? "Collapse" : "Compare scenarios"}
        </Button>
      </header>

      {!expanded && recommended && (
        <div className="rounded-md border bg-card px-3 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Top recommendation
          </p>
          <p className="text-sm font-medium">{recommended.title}</p>
          <p className="text-xs text-muted-foreground">{recommended.summary}</p>
        </div>
      )}

      {expanded && (
        <>
          <GlobalHumanReviewNotice />
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {bundle.scenarios.map((s) => (
              <ScenarioComparisonCard key={s.id} scenario={s} highlighted={s.recommended} />
            ))}
          </div>
          {showMatrix && bundle.matrixCriteria && (
            <OperationalDecisionMatrix
              scenarios={bundle.scenarios}
              criteria={bundle.matrixCriteria}
            />
          )}
          <InstitutionalMemoryPanel
            context="decision"
            entityId={entityId}
            title="Historical precedent"
            description="Outcomes, rationale, and expert notes from analogous prior decisions."
            defaultExpanded={false}
          />
        </>
      )}
    </section>
  );
}
