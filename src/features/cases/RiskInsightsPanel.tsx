import {
  AlertOctagon,
  AlertTriangle,
  ShieldAlert,
  Compass,
  Scale,
  Workflow,
  ShieldCheck,
  CalendarRange,
  Clock,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ExplainButton } from "@/features/explainability/ExplainButton";
import type { CaseInsight, CaseInsightCategory, CaseInsightSeverity } from "./types";

const SEVERITY_ICON: Record<CaseInsightSeverity, LucideIcon> = {
  critical: AlertOctagon,
  high: ShieldAlert,
  medium: AlertTriangle,
  low: Compass,
};

const SEVERITY_BORDER: Record<CaseInsightSeverity, string> = {
  critical: "border-destructive/50",
  high: "border-warning/40",
  medium: "border-info/30",
  low: "border-border",
};

const SEVERITY_BADGE: Record<CaseInsightSeverity, string> = {
  critical: "bg-destructive/10 text-destructive",
  high: "bg-warning/15 text-warning-foreground",
  medium: "bg-info/10 text-info",
  low: "bg-muted text-muted-foreground",
};

const CATEGORY_ICON: Record<CaseInsightCategory, LucideIcon> = {
  fraud: ShieldAlert,
  coverage: ShieldCheck,
  compliance: Scale,
  sla: Clock,
  renewal: CalendarRange,
  workflow: Workflow,
  risk: Compass,
};

function ConfidenceBar({ value }: { value: number }) {
  const tone = value >= 80 ? "bg-success" : value >= 60 ? "bg-info" : "bg-muted-foreground";
  return (
    <div className="flex items-center gap-1.5">
      <div className="h-1 w-12 overflow-hidden rounded-full bg-muted">
        <div className={cn("h-full", tone)} style={{ width: `${value}%` }} />
      </div>
      <span className="text-[10px] tabular-nums text-muted-foreground">{value}%</span>
    </div>
  );
}

export function RiskInsightsPanel({ insights }: { insights: CaseInsight[] }) {
  if (insights.length === 0) {
    return (
      <div className="rounded-lg border border-dashed bg-card/40 p-4 text-sm text-muted-foreground">
        No operational risks detected on this case.
      </div>
    );
  }

  const sorted = [...insights].sort((a, b) => {
    const order = { critical: 0, high: 1, medium: 2, low: 3 } as const;
    return order[a.severity] - order[b.severity] || b.confidence - a.confidence;
  });

  return (
    <div className="grid gap-2 md:grid-cols-2">
      {sorted.map((i) => {
        const SevIcon = SEVERITY_ICON[i.severity];
        const CatIcon = CATEGORY_ICON[i.category];
        return (
          <div
            key={i.id}
            className={cn(
              "flex flex-col gap-2 rounded-lg border bg-card p-3",
              SEVERITY_BORDER[i.severity],
            )}
          >
            <div className="flex items-start gap-2.5">
              <span
                className={cn(
                  "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md",
                  SEVERITY_BADGE[i.severity],
                )}
              >
                <SevIcon className="h-3.5 w-3.5" />
              </span>
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                      SEVERITY_BADGE[i.severity],
                    )}
                  >
                    {i.severity}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                    <CatIcon className="h-3 w-3" /> {i.category}
                  </span>
                  <span className="ml-auto">
                    <ConfidenceBar value={i.confidence} />
                  </span>
                </div>
                <p className="text-sm font-medium leading-snug">{i.title}</p>
                <p className="text-xs leading-relaxed text-muted-foreground">{i.explanation}</p>
              </div>
            </div>

            {i.triggers && i.triggers.length > 0 && (
              <ul className="grid gap-0.5 rounded-md bg-muted/40 px-2 py-1.5">
                {i.triggers.map((t, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
                    <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-current" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex flex-wrap items-center gap-1.5">
              {i.suggestedActions.map((a) => (
                <Button
                  key={a.id}
                  size="sm"
                  variant={a.priority === "primary" ? "default" : "outline"}
                  className="h-7 px-2 text-xs"
                >
                  {a.label}
                </Button>
              ))}
              <ExplainButton
                className="ml-auto"
                subject={{
                  subjectId: i.id,
                  title: i.title,
                  kind: "insight",
                  category: i.source ?? i.category,
                  severity: i.severity,
                  confidence: i.confidence,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
