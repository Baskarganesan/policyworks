import { cn } from "@/lib/utils";
import type { InsightSeverity, InsightCategory } from "./types";

const SEV_TONE: Record<InsightSeverity, string> = {
  low: "bg-muted text-muted-foreground ring-border",
  medium: "bg-info/10 text-info ring-info/20",
  high: "bg-warning/15 text-warning-foreground ring-warning/30",
  critical: "bg-destructive/10 text-destructive ring-destructive/30",
};

const SEV_DOT: Record<InsightSeverity, string> = {
  low: "bg-muted-foreground/60",
  medium: "bg-info",
  high: "bg-warning",
  critical: "bg-destructive",
};

const SEV_LABEL: Record<InsightSeverity, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

const CAT_LABEL: Record<InsightCategory, string> = {
  compliance: "Compliance",
  fraud: "Fraud",
  coverage: "Coverage",
  renewal: "Renewal",
  workflow: "Workflow",
  risk: "Risk",
};

export function SeverityChip({ severity }: { severity: InsightSeverity }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium ring-1 ring-inset",
        SEV_TONE[severity],
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", SEV_DOT[severity])} />
      {SEV_LABEL[severity]}
    </span>
  );
}

export function CategoryChip({ category }: { category: InsightCategory }) {
  return (
    <span className="inline-flex items-center rounded-full bg-accent/60 px-1.5 py-0.5 text-[10px] font-medium text-accent-foreground">
      {CAT_LABEL[category]}
    </span>
  );
}

export function RiskIndicator({ severity }: { severity: InsightSeverity }) {
  return (
    <span
      aria-label={`Severity ${SEV_LABEL[severity]}`}
      className={cn("inline-block h-2 w-2 rounded-full", SEV_DOT[severity])}
    />
  );
}
