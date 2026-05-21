import { ArrowRight, GitBranch, Scale } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ConflictRecord } from "./types";

export function ConflictResolutionCard({ conflict }: { conflict: ConflictRecord }) {
  return (
    <div className="space-y-3 rounded-lg border border-warning/30 bg-card p-3">
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-warning/15 text-warning-foreground">
          <Scale className="h-3.5 w-3.5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-snug">{conflict.title}</p>
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{conflict.summary}</p>
        </div>
      </div>

      <ul className="space-y-1.5">
        {conflict.signals.map((s) => (
          <li key={s.id} className="rounded-md border bg-background/60 p-2 text-xs">
            <div className="flex items-center justify-between gap-2">
              <span className="truncate font-mono text-[11px] text-muted-foreground">{s.source}</span>
              <span className="shrink-0 tabular-nums text-[10px] text-muted-foreground">
                {s.confidence}% confidence
              </span>
            </div>
            <p className="mt-1 leading-relaxed text-foreground/90">{s.contradiction}</p>
            {s.recommendation && (
              <p className="mt-1 inline-flex items-start gap-1 text-[11px] text-muted-foreground">
                <ArrowRight className="mt-0.5 h-3 w-3 shrink-0" />
                <span>{s.recommendation}</span>
              </p>
            )}
            <div className="mt-1 h-1 overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  "h-full",
                  s.confidence >= 80
                    ? "bg-success"
                    : s.confidence >= 60
                    ? "bg-info"
                    : "bg-muted-foreground/50",
                )}
                style={{ width: `${s.confidence}%` }}
              />
            </div>
          </li>
        ))}
      </ul>

      {(conflict.recommendedPath || conflict.escalationPath) && (
        <div className="grid gap-1.5 rounded-md bg-muted/40 p-2 text-[11px] sm:grid-cols-2">
          {conflict.recommendedPath && (
            <div className="space-y-0.5">
              <p className="font-medium uppercase tracking-wide text-muted-foreground text-[10px]">
                Recommended path
              </p>
              <p className="leading-snug">{conflict.recommendedPath}</p>
            </div>
          )}
          {conflict.escalationPath && (
            <div className="space-y-0.5">
              <p className="inline-flex items-center gap-1 font-medium uppercase tracking-wide text-muted-foreground text-[10px]">
                <GitBranch className="h-3 w-3" /> Escalation path
              </p>
              <p className="leading-snug">{conflict.escalationPath}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
