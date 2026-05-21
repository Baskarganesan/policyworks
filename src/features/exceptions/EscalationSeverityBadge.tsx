import { cn } from "@/lib/utils";
import type { ExceptionSeverity, ExceptionStatus } from "./types";

const SEV_TONE: Record<ExceptionSeverity, string> = {
  critical: "bg-destructive/10 text-destructive ring-destructive/20",
  high: "bg-warning/15 text-warning-foreground ring-warning/30",
  medium: "bg-info/10 text-info ring-info/20",
  low: "bg-muted text-muted-foreground ring-border",
};

const STATUS_TONE: Record<ExceptionStatus, string> = {
  active: "bg-info/10 text-info ring-info/20",
  waiting: "bg-warning/15 text-warning-foreground ring-warning/30",
  escalated: "bg-destructive/10 text-destructive ring-destructive/20",
  resolved: "bg-success/10 text-success ring-success/20",
  reopened: "bg-accent text-accent-foreground ring-border",
};

const STATUS_LABEL: Record<ExceptionStatus, string> = {
  active: "Active",
  waiting: "Waiting",
  escalated: "Escalated",
  resolved: "Resolved",
  reopened: "Reopened",
};

export function EscalationSeverityBadge({
  severity,
  compact = false,
}: {
  severity: ExceptionSeverity;
  compact?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 font-medium uppercase tracking-wide ring-1 ring-inset",
        SEV_TONE[severity],
        compact ? "text-[10px]" : "text-[11px]",
      )}
    >
      {severity}
    </span>
  );
}

export function EscalationStatusBadge({ status }: { status: ExceptionStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ring-1 ring-inset",
        STATUS_TONE[status],
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
