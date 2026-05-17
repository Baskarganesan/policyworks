import { useState } from "react";
import { ChevronDown, AlertCircle, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CoverageItem } from "./types";
import { formatCurrency } from "./utils";

export function CoverageCard({ item }: { item: CoverageItem }) {
  const [open, setOpen] = useState(false);
  const isGap = item.highlight === "gap";
  const isImportant = item.highlight === "important";

  return (
    <div
      className={cn(
        "rounded-lg border bg-card transition-colors",
        isGap && "border-destructive/40 bg-destructive/5",
        isImportant && "border-primary/30",
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-start justify-between gap-3 px-4 py-3 text-left"
      >
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{item.category}</span>
            {isImportant && <Star className="h-3 w-3 fill-primary text-primary" />}
            {isGap && (
              <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-medium text-destructive">
                <AlertCircle className="h-3 w-3" /> Coverage gap
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{item.description}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Limit</div>
            <div className={cn("text-sm font-semibold tabular-nums", isGap && "text-destructive")}>
              {item.limit > 0 ? formatCurrency(item.limit) : "—"}
            </div>
          </div>
          <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")} />
        </div>
      </button>

      {open && (
        <div className="grid gap-3 border-t px-4 py-3 sm:grid-cols-2">
          <div>
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Deductible</div>
            <div className="text-sm font-medium">{item.deductible > 0 ? formatCurrency(item.deductible) : "None"}</div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Exclusions</div>
            {item.exclusions.length === 0 ? (
              <div className="text-sm text-muted-foreground">None listed</div>
            ) : (
              <ul className="mt-1 space-y-0.5">
                {item.exclusions.map((ex) => (
                  <li key={ex} className="text-sm text-foreground">· {ex}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
