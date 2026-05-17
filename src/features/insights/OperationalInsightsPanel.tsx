import { useMemo, useState } from "react";
import { Lightbulb, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { InsightCard } from "./InsightCard";
import type { InsightSeverity, OperationalInsight, SuggestedAction } from "./types";

const SEVERITY_ORDER: Record<InsightSeverity, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

interface Props {
  insights: OperationalInsight[];
  title?: string;
  description?: string;
  className?: string;
  compact?: boolean;
  onAction?: (action: SuggestedAction, insight: OperationalInsight) => void;
}

export function OperationalInsightsPanel({
  insights,
  title = "Operational insights",
  description = "Contextual signals, risks, and suggested next actions.",
  className,
  compact = false,
  onAction,
}: Props) {
  const sorted = useMemo(
    () =>
      [...insights].sort(
        (a, b) =>
          SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity] ||
          b.confidence - a.confidence,
      ),
    [insights],
  );

  const [showAll, setShowAll] = useState(false);
  const initial = compact ? 2 : 3;
  const visible = showAll ? sorted : sorted.slice(0, initial);

  const counts = useMemo(() => {
    const c = { critical: 0, high: 0, medium: 0, low: 0 };
    sorted.forEach((i) => (c[i.severity] += 1));
    return c;
  }, [sorted]);

  if (insights.length === 0) {
    return (
      <div className={cn("rounded-lg border border-dashed bg-card/50 p-4", className)}>
        <div className="flex items-center gap-2 text-sm">
          <ShieldCheck className="h-4 w-4 text-success" />
          <span className="font-medium">No operational signals</span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          This record has no open risks, blockers, or suggested actions.
        </p>
      </div>
    );
  }

  return (
    <section className={cn("space-y-3", className)}>
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <Lightbulb className="h-3.5 w-3.5 text-primary" />
            <h3 className="text-sm font-semibold">{title}</h3>
            <span className="text-xs text-muted-foreground">· {sorted.length}</span>
          </div>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1 pt-0.5">
          {counts.critical > 0 && (
            <span className="rounded-full bg-destructive/10 px-1.5 py-0.5 text-[10px] font-medium text-destructive tabular-nums">
              {counts.critical} critical
            </span>
          )}
          {counts.high > 0 && (
            <span className="rounded-full bg-warning/15 px-1.5 py-0.5 text-[10px] font-medium text-warning-foreground tabular-nums">
              {counts.high} high
            </span>
          )}
          {counts.medium > 0 && (
            <span className="rounded-full bg-info/10 px-1.5 py-0.5 text-[10px] font-medium text-info tabular-nums">
              {counts.medium} med
            </span>
          )}
        </div>
      </header>

      <div className="space-y-2">
        {visible.map((i) => (
          <InsightCard key={i.id} insight={i} onAction={onAction} />
        ))}
      </div>

      {sorted.length > initial && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            {showAll ? "Show fewer" : `Show ${sorted.length - initial} more`}
          </button>
        </div>
      )}
    </section>
  );
}
