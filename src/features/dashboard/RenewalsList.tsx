import { cn } from "@/lib/utils";
import type { RenewalRisk, UpcomingRenewal } from "./types";

const RISK_TONE: Record<RenewalRisk, string> = {
  low: "bg-success/10 text-success",
  medium: "bg-warning/15 text-warning-foreground",
  high: "bg-destructive/10 text-destructive",
};

function daysUntil(iso: string) {
  const d = Math.round((new Date(iso).getTime() - Date.now()) / 86_400_000);
  if (d <= 0) return "Today";
  if (d === 1) return "Tomorrow";
  return `${d}d`;
}

function formatCurrency(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n}`;
}

export function RenewalsList({ renewals }: { renewals: UpcomingRenewal[] }) {
  if (renewals.length === 0) {
    return <p className="text-sm text-muted-foreground">No upcoming renewals.</p>;
  }
  return (
    <ul className="divide-y">
      {renewals.map((r) => (
        <li
          key={r.id}
          className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0 transition-colors hover:bg-accent/30"
        >
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium">{r.customer}</div>
            <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>{r.policyType}</span>
              <span>·</span>
              <span className="font-mono">{r.policyNumber}</span>
            </div>
          </div>
          <div className="hidden text-right sm:block">
            <div className="text-xs font-medium tabular-nums">
              {formatCurrency(r.coverageAmount)}
            </div>
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
              Coverage
            </div>
          </div>
          <div className="flex w-16 shrink-0 flex-col items-end gap-1">
            <span className="text-xs font-semibold tabular-nums">{daysUntil(r.renewalDate)}</span>
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[10px] font-medium capitalize",
                RISK_TONE[r.risk],
              )}
            >
              {r.risk}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
