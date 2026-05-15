import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ClaimSummaryCardProps {
  label: string;
  value: ReactNode;
  hint?: string;
  className?: string;
}

export function ClaimSummaryCard({ label, value, hint, className }: ClaimSummaryCardProps) {
  return (
    <div className={cn("rounded-lg border bg-card p-3", className)}>
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-sm font-medium text-foreground">{value}</div>
      {hint && <div className="mt-0.5 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}
