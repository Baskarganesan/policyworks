import { Check, Minus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TriggerCondition, TriggerStatus } from "./types";

const META: Record<TriggerStatus, { icon: typeof Check; tone: string; label: string }> = {
  matched: { icon: Check, tone: "text-success", label: "Matched" },
  partial: { icon: Minus, tone: "text-warning-foreground", label: "Partial" },
  not_matched: { icon: X, tone: "text-destructive", label: "Not matched" },
};

export function TriggerConditionList({ triggers }: { triggers: TriggerCondition[] }) {
  return (
    <ul className="space-y-1.5">
      {triggers.map((t) => {
        const m = META[t.status];
        const Icon = m.icon;
        return (
          <li key={t.id} className="flex items-start gap-2.5 rounded-md border bg-card px-2.5 py-2">
            <span
              className={cn(
                "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ring-1 ring-inset",
                t.status === "matched" && "bg-success/10 ring-success/30",
                t.status === "partial" && "bg-warning/15 ring-warning/30",
                t.status === "not_matched" && "bg-destructive/10 ring-destructive/30",
              )}
            >
              <Icon className={cn("h-2.5 w-2.5", m.tone)} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <p className="text-sm leading-snug">{t.condition}</p>
                <span className={cn("text-[10px] font-medium uppercase tracking-wide", m.tone)}>
                  {m.label}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {t.source}
                {t.detail ? ` · ${t.detail}` : ""}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
