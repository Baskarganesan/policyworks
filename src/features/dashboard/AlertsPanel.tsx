import { AlertOctagon, AlertTriangle, Info, Bell, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ExplainButton } from "@/features/explainability/ExplainButton";
import type { AlertPriority, OperationalAlert } from "./types";

const META: Record<AlertPriority, { icon: typeof Info; tone: string; label: string; bar: string }> = {
  critical: {
    icon: AlertOctagon,
    tone: "bg-destructive/10 text-destructive ring-destructive/20",
    bar: "bg-destructive",
    label: "Critical",
  },
  high: {
    icon: AlertTriangle,
    tone: "bg-warning/15 text-warning-foreground ring-warning/30",
    bar: "bg-warning",
    label: "High",
  },
  medium: {
    icon: Bell,
    tone: "bg-info/10 text-info ring-info/20",
    bar: "bg-info",
    label: "Medium",
  },
  info: {
    icon: Info,
    tone: "bg-muted text-muted-foreground ring-border",
    bar: "bg-border",
    label: "Info",
  },
};

const PRIORITY_ORDER: AlertPriority[] = ["critical", "high", "medium", "info"];

export function AlertsPanel({ alerts }: { alerts: OperationalAlert[] }) {
  const sorted = [...alerts].sort(
    (a, b) => PRIORITY_ORDER.indexOf(a.priority) - PRIORITY_ORDER.indexOf(b.priority),
  );

  if (sorted.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No active operational alerts.</p>
    );
  }

  return (
    <ul className="-m-1 space-y-1.5">
      {sorted.map((a) => {
        const m = META[a.priority];
        const Icon = m.icon;
        return (
          <li
            key={a.id}
            className="relative flex items-start gap-3 overflow-hidden rounded-lg border bg-card p-3 transition-colors hover:bg-accent/40"
          >
            <span aria-hidden className={cn("absolute left-0 top-0 h-full w-0.5", m.bar)} />
            <span
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-md ring-1 ring-inset",
                m.tone,
              )}
            >
              <Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {a.type}
                </span>
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                    m.tone,
                  )}
                >
                  {m.label}
                </span>
              </div>
              <p className="mt-0.5 text-sm font-medium leading-snug">{a.message}</p>
              {a.detail && (
                <p className="mt-0.5 text-xs text-muted-foreground">{a.detail}</p>
              )}
            </div>
            {a.actionLabel && (
              <Button
                size="sm"
                variant="ghost"
                className="h-7 shrink-0 self-center px-2 text-xs"
              >
                {a.actionLabel}
                <ChevronRight className="ml-0.5 h-3 w-3" />
              </Button>
            )}
          </li>
        );
      })}
    </ul>
  );
}
