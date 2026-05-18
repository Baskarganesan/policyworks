import { Database, FileText, Map, History, User, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ContributingSignal, SignalKind } from "./types";

const KIND_ICON: Record<SignalKind, typeof Database> = {
  data: Database,
  history: History,
  document: FileText,
  policy: ClipboardList,
  geo: Map,
  behavior: User,
};

export function DecisionTraceCard({
  title,
  rationale,
  signals,
}: {
  title: string;
  rationale: string;
  signals: ContributingSignal[];
}) {
  const total = signals.reduce((s, x) => s + x.weight, 0) || 1;
  return (
    <div className="space-y-2.5 rounded-lg border bg-card p-3">
      <div>
        <p className="text-sm font-semibold leading-snug">{title}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{rationale}</p>
      </div>
      <ul className="space-y-1.5">
        {signals.map((s) => {
          const Icon = KIND_ICON[s.kind];
          const pct = Math.round((s.weight / total) * 100);
          return (
            <li key={s.id} className="space-y-1">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="flex min-w-0 items-center gap-1.5">
                  <Icon className="h-3 w-3 shrink-0 text-muted-foreground" />
                  <span className="truncate font-medium">{s.label}</span>
                </span>
                <span className="shrink-0 tabular-nums text-muted-foreground">{pct}%</span>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full",
                    pct >= 30 ? "bg-foreground/70" : "bg-muted-foreground/50",
                  )}
                  style={{ width: `${pct}%` }}
                />
              </div>
              {s.detail && <p className="text-[11px] text-muted-foreground">{s.detail}</p>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
