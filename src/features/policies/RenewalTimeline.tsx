import { Check, Circle, Clock, AlertOctagon, CircleDot } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RenewalMilestone } from "./types";
import { formatDate, formatRelative } from "./utils";

const STATUS = {
  complete: { icon: Check, ring: "bg-success text-success-foreground border-success", label: "Complete" },
  in_progress: { icon: CircleDot, ring: "bg-info/15 text-info border-info/40", label: "In progress" },
  blocked: { icon: AlertOctagon, ring: "bg-destructive/15 text-destructive border-destructive/40", label: "Blocked" },
  pending: { icon: Clock, ring: "bg-muted text-muted-foreground border-border", label: "Pending" },
} as const;

export function RenewalTimeline({ milestones }: { milestones: RenewalMilestone[] }) {
  return (
    <ol className="relative space-y-3 pl-6">
      <span className="absolute left-[11px] top-2 bottom-2 w-px bg-border" aria-hidden />
      {milestones.map((m) => {
        const s = STATUS[m.status];
        const Icon = s.icon;
        return (
          <li key={m.id} className="relative">
            <span
              className={cn(
                "absolute -left-6 top-0.5 flex h-[22px] w-[22px] items-center justify-center rounded-full border",
                s.ring,
              )}
            >
              <Icon className="h-3 w-3" />
            </span>
            <div className="rounded-lg border bg-card p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium">{m.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(m.date)} · {formatRelative(m.date)} · Owner: {m.owner}
                  </div>
                  {m.detail && <p className="mt-1.5 text-xs text-muted-foreground">{m.detail}</p>}
                  {m.blocker && (
                    <p className="mt-1.5 rounded border border-destructive/30 bg-destructive/5 px-2 py-1 text-xs text-destructive">
                      Blocker: {m.blocker}
                    </p>
                  )}
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium",
                    s.ring,
                  )}
                >
                  {s.label}
                </span>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
