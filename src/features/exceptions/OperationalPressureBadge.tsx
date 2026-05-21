import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export function OperationalPressureBadge({
  score,
  ageHours,
  compact = false,
}: {
  score: number;
  ageHours?: number;
  compact?: boolean;
}) {
  const tone =
    score >= 80
      ? "text-destructive"
      : score >= 60
      ? "text-warning-foreground"
      : score >= 35
      ? "text-info"
      : "text-muted-foreground";

  const bar =
    score >= 80
      ? "bg-destructive"
      : score >= 60
      ? "bg-warning"
      : score >= 35
      ? "bg-info"
      : "bg-muted-foreground/40";

  const label =
    score >= 80 ? "Critical pressure" : score >= 60 ? "High pressure" : score >= 35 ? "Watch" : "Stable";

  return (
    <div className={cn("space-y-1", compact && "min-w-[120px]")}>
      <div className="flex items-center justify-between gap-2 text-[11px]">
        <span className={cn("inline-flex items-center gap-1 font-medium", tone)}>
          <Activity className="h-3 w-3" />
          {label}
        </span>
        {ageHours !== undefined && (
          <span className="tabular-nums text-muted-foreground">
            aged {ageHours < 24 ? `${ageHours}h` : `${Math.round(ageHours / 24)}d`}
          </span>
        )}
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full transition-all", bar)}
          style={{ width: `${Math.min(score, 100)}%` }}
        />
      </div>
    </div>
  );
}
