import { AlertTriangle, AlertOctagon, Info, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { ExplainButton } from "@/features/explainability/ExplainButton";
import type { RiskFlag } from "./types";

const SEVERITY = {
  critical: { icon: AlertOctagon, border: "border-destructive/50", chip: "bg-destructive text-destructive-foreground", label: "Critical" },
  high: { icon: ShieldAlert, border: "border-destructive/40", chip: "bg-destructive/10 text-destructive", label: "High" },
  medium: { icon: AlertTriangle, border: "border-warning/40", chip: "bg-warning/15 text-warning-foreground", label: "Medium" },
  low: { icon: Info, border: "border-border", chip: "bg-muted text-muted-foreground", label: "Low" },
} as const;

export function RiskFlagCard({ flag }: { flag: RiskFlag }) {
  const s = SEVERITY[flag.severity];
  const Icon = s.icon;
  return (
    <div className={cn("rounded-lg border bg-card p-3", s.border)}>
      <div className="flex items-start gap-3">
        <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", flag.severity === "low" ? "text-muted-foreground" : "text-destructive")} />
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium">{flag.message}</p>
            <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium", s.chip)}>
              {s.label}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">{flag.detail}</p>
          <div className="flex items-center gap-2 pt-1">
            <div className="h-1 w-20 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-foreground/60"
                style={{ width: `${flag.confidence}%` }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground">{flag.confidence}% confidence</span>
          </div>
        </div>
      </div>
    </div>
  );
}
