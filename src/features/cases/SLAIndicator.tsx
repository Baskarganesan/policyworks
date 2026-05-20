import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CaseSLA } from "./types";

function formatDelta(ms: number) {
  const abs = Math.abs(ms);
  const mins = Math.round(abs / 60000);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.round(mins / 60);
  if (hrs < 48) return `${hrs}h`;
  return `${Math.round(hrs / 24)}d`;
}

export function SLAIndicator({ sla, compact = false }: { sla: CaseSLA; compact?: boolean }) {
  const now = Date.now();
  const due = new Date(sla.dueAt).getTime();
  const start = new Date(sla.startedAt).getTime();
  const total = Math.max(due - start, 1);
  const elapsed = Math.min(Math.max(now - start, 0), total);
  const pct = Math.round((elapsed / total) * 100);
  const remaining = due - now;
  const overdue = remaining < 0;

  const tone =
    overdue || pct >= 90
      ? "bg-destructive"
      : pct >= 70
      ? "bg-warning"
      : pct >= 40
      ? "bg-info"
      : "bg-success";

  const textTone =
    overdue || pct >= 90
      ? "text-destructive"
      : pct >= 70
      ? "text-warning-foreground"
      : "text-muted-foreground";

  return (
    <div className={cn("space-y-1", compact && "min-w-[140px]")}>
      <div className="flex items-center justify-between gap-2 text-[11px]">
        <span className="inline-flex items-center gap-1 font-medium">
          <Clock className="h-3 w-3" />
          {sla.label}
        </span>
        <span className={cn("tabular-nums", textTone)}>
          {overdue ? `${formatDelta(remaining)} overdue` : `${formatDelta(remaining)} left`}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div className={cn("h-full transition-all", tone)} style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>
    </div>
  );
}
