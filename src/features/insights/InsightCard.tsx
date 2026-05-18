import {
  AlertOctagon,
  AlertTriangle,
  ShieldAlert,
  Scale,
  ShieldCheck,
  Workflow,
  Compass,
  CalendarRange,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SeverityChip, CategoryChip } from "./RiskIndicator";
import { ConfidenceBadge } from "./ConfidenceBadge";
import { CrossEntityLink } from "./CrossEntityLink";
import { SuggestedActionButton } from "./SuggestedActionButton";
import { ExplainButton } from "@/features/explainability/ExplainButton";
import type { InsightCategory, InsightSeverity, OperationalInsight, SuggestedAction } from "./types";

const CATEGORY_ICON: Record<InsightCategory, LucideIcon> = {
  compliance: Scale,
  fraud: ShieldAlert,
  coverage: ShieldCheck,
  renewal: CalendarRange,
  workflow: Workflow,
  risk: Compass,
};

const SEVERITY_BORDER: Record<InsightSeverity, string> = {
  low: "border-border",
  medium: "border-info/30",
  high: "border-warning/40",
  critical: "border-destructive/50",
};

const SEVERITY_ICON: Record<InsightSeverity, LucideIcon> = {
  low: Compass,
  medium: AlertTriangle,
  high: ShieldAlert,
  critical: AlertOctagon,
};

function formatRelative(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return `${days}d ago`;
}

export function InsightCard({
  insight,
  onAction,
}: {
  insight: OperationalInsight;
  onAction?: (action: SuggestedAction, insight: OperationalInsight) => void;
}) {
  const CatIcon = CATEGORY_ICON[insight.category];
  const SevIcon = SEVERITY_ICON[insight.severity];
  const isStrong = insight.severity === "high" || insight.severity === "critical";

  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-3 transition-colors hover:bg-accent/20",
        SEVERITY_BORDER[insight.severity],
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md",
            isStrong
              ? "bg-destructive/10 text-destructive"
              : insight.severity === "medium"
              ? "bg-info/10 text-info"
              : "bg-muted text-muted-foreground",
          )}
        >
          <SevIcon className="h-3.5 w-3.5" />
        </span>

        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <SeverityChip severity={insight.severity} />
            <CategoryChip category={insight.category} />
            <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
              <CatIcon className="h-3 w-3" />
              {insight.source ?? "Operational signal"}
            </span>
            <span className="ml-auto flex items-center gap-1.5">
              <ConfidenceBadge confidence={insight.confidence} />
              <span className="text-[10px] text-muted-foreground">
                {formatRelative(insight.createdAt)}
              </span>
            </span>
          </div>

          <p className="text-sm font-medium leading-snug">{insight.title}</p>
          <p className="text-xs leading-relaxed text-muted-foreground">{insight.description}</p>

          {insight.links && insight.links.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                Related
              </span>
              {insight.links.map((l) => (
                <CrossEntityLink key={`${l.type}-${l.id}`} entity={l} />
              ))}
            </div>
          )}

          {insight.suggestedActions.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
              {insight.suggestedActions.map((a) => (
                <SuggestedActionButton
                  key={a.id}
                  action={a}
                  onTrigger={(act) => onAction?.(act, insight)}
                />
              ))}
              <ExplainButton
                className="ml-auto"
                subject={{
                  subjectId: insight.id,
                  title: insight.title,
                  kind: "insight",
                  category: insight.source,
                  severity: insight.severity,
                  confidence: insight.confidence,
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
