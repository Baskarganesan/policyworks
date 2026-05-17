import { Clock, FileWarning, ShieldAlert, DollarSign, ChevronRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { ClaimAttentionItem, ClaimAttentionReason } from "./types";

const REASON: Record<ClaimAttentionReason, { icon: LucideIcon; label: string; tone: string }> = {
  stalled: { icon: Clock, label: "Stalled", tone: "bg-warning/15 text-warning-foreground" },
  missing_docs: { icon: FileWarning, label: "Missing docs", tone: "bg-info/10 text-info" },
  escalated: { icon: ShieldAlert, label: "Escalated", tone: "bg-destructive/10 text-destructive" },
  high_value: { icon: DollarSign, label: "High value", tone: "bg-primary/10 text-primary" },
};

function formatCurrency(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n}`;
}

export function ClaimsAttentionCard({ items }: { items: ClaimAttentionItem[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">No claims need attention.</p>;
  }
  return (
    <ul className="space-y-2">
      {items.map((c) => {
        const r = REASON[c.reason];
        const Icon = r.icon;
        return (
          <li
            key={c.id}
            className="flex items-center gap-3 rounded-lg border bg-card p-3 transition-colors hover:bg-accent/40"
          >
            <span
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
                r.tone,
              )}
            >
              <Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-xs text-muted-foreground">{c.reference}</span>
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                    r.tone,
                  )}
                >
                  {r.label}
                </span>
              </div>
              <div className="mt-0.5 truncate text-sm font-medium">
                {c.customer} <span className="text-muted-foreground">· {c.type}</span>
              </div>
              <div className="mt-0.5 text-xs text-muted-foreground">
                {c.ageDays}d open · {c.assignedTo}
              </div>
            </div>
            <div className="hidden text-right sm:block">
              <div className="text-sm font-semibold tabular-nums">
                {formatCurrency(c.amount)}
              </div>
            </div>
            <Button size="sm" variant="ghost" className="h-7 shrink-0 px-2 text-xs">
              Open
              <ChevronRight className="ml-0.5 h-3 w-3" />
            </Button>
          </li>
        );
      })}
    </ul>
  );
}
