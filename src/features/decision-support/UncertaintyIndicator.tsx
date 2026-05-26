import { AlertTriangle, HelpCircle, GitBranch, FileQuestion, Database } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UncertaintySignal } from "./types";

const ICON = {
  missing_info: FileQuestion,
  conflict: GitBranch,
  interpretation: HelpCircle,
  dependency: AlertTriangle,
  data_quality: Database,
} as const;

export function UncertaintyIndicator({
  signals,
  compact = false,
}: {
  signals: UncertaintySignal[];
  compact?: boolean;
}) {
  if (signals.length === 0) {
    return (
      <p className="text-[11px] text-muted-foreground">No uncertainty signals detected.</p>
    );
  }
  const total = signals.reduce((sum, s) => sum + Math.abs(s.confidenceImpact), 0);
  return (
    <div className="space-y-1.5">
      {!compact && (
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <AlertTriangle className="h-3 w-3 text-warning" />
            {signals.length} uncertainty signal{signals.length === 1 ? "" : "s"}
          </span>
          <span className="tabular-nums">−{total}% confidence</span>
        </div>
      )}
      <ul className="space-y-1">
        {signals.map((s) => {
          const Icon = ICON[s.type];
          return (
            <li
              key={s.id}
              className={cn(
                "flex items-start gap-2 rounded-md border border-warning/20 bg-warning/5 px-2 py-1.5",
              )}
            >
              <Icon className="mt-0.5 h-3 w-3 shrink-0 text-warning" />
              <div className="min-w-0 flex-1 text-[11px] leading-relaxed">
                <p className="text-foreground/90">{s.description}</p>
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  {s.type.replace("_", " ")} · {s.confidenceImpact}% confidence
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
