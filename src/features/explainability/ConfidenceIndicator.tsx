import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

function band(confidence: number) {
  if (confidence >= 80) return { label: "High", tone: "text-success", bar: "bg-success" };
  if (confidence >= 55) return { label: "Medium", tone: "text-info", bar: "bg-info" };
  return { label: "Low", tone: "text-muted-foreground", bar: "bg-muted-foreground/60" };
}

export function ConfidenceIndicator({
  confidence,
  className,
  showLabel = true,
}: {
  confidence: number;
  className?: string;
  showLabel?: boolean;
}) {
  const b = band(confidence);
  const pct = Math.max(0, Math.min(100, confidence));
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Sparkles className={cn("h-3.5 w-3.5", b.tone)} />
      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
        <div className={cn("h-full rounded-full", b.bar)} style={{ width: `${pct}%` }} />
      </div>
      <span className={cn("text-xs font-medium tabular-nums", b.tone)}>{pct}%</span>
      {showLabel && (
        <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
          {b.label} confidence
        </span>
      )}
    </div>
  );
}
