import { cn } from "@/lib/utils";
import { RiskIndicator } from "./RiskIndicator";
import type { OperationalInsight } from "./types";

function formatRelative(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

export function InsightTimeline({ insights }: { insights: OperationalInsight[] }) {
  const sorted = [...insights].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  if (sorted.length === 0) {
    return <p className="text-xs text-muted-foreground">No insight activity yet.</p>;
  }
  return (
    <ol className="relative space-y-2 border-l pl-4">
      {sorted.map((i) => (
        <li key={i.id} className="relative">
          <span className={cn("absolute -left-[21px] top-1.5")}>
            <RiskIndicator severity={i.severity} />
          </span>
          <div className="flex items-baseline justify-between gap-2">
            <p className="truncate text-xs font-medium">{i.title}</p>
            <span className="shrink-0 text-[10px] text-muted-foreground">
              {formatRelative(i.createdAt)}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            {i.category} · {i.confidence}% confidence
          </p>
        </li>
      ))}
    </ol>
  );
}
