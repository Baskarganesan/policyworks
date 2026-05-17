import { StatusBadge } from "@/components/shared/StatusBadge";
import type { Endorsement } from "./types";
import { formatCurrency, formatDate } from "./utils";

const TONE = { active: "success", pending: "warning", expired: "neutral" } as const;
const LABEL = { active: "Active", pending: "Pending", expired: "Expired" } as const;

export function EndorsementsList({ endorsements }: { endorsements: Endorsement[] }) {
  if (endorsements.length === 0) {
    return <p className="text-sm text-muted-foreground">No endorsements on this policy.</p>;
  }
  return (
    <ul className="divide-y rounded-lg border bg-card">
      {endorsements.map((e) => (
        <li key={e.id} className="flex items-start justify-between gap-3 p-3">
          <div className="min-w-0 space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{e.name}</span>
              <StatusBadge tone={TONE[e.status]}>{LABEL[e.status]}</StatusBadge>
            </div>
            <p className="text-xs text-muted-foreground">{e.summary}</p>
            <p className="text-[11px] text-muted-foreground">Added {formatDate(e.addedAt)}</p>
          </div>
          <div className="shrink-0 text-right">
            <div className="text-[11px] text-muted-foreground">Premium</div>
            <div className="text-sm font-medium tabular-nums">+{formatCurrency(e.premiumDelta)}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}
