import { useState } from "react";
import { ChevronDown, ChevronRight, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { ReasoningSignal } from "./types";

interface Props {
  reasoning: ReasoningSignal[];
  assumptions: string[];
  unresolvedRisks: string[];
}

export function RecommendationReasoningCard({
  reasoning,
  assumptions,
  unresolvedRisks,
}: Props) {
  const [open, setOpen] = useState(false);
  const max = Math.max(...reasoning.map((r) => r.weight), 1);
  return (
    <div className="rounded-md border bg-card">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setOpen((v) => !v)}
        className="h-8 w-full justify-between px-2.5 text-xs"
      >
        <span className="inline-flex items-center gap-1.5">
          <Info className="h-3.5 w-3.5 text-muted-foreground" />
          Why this is surfaced
        </span>
        {open ? (
          <ChevronDown className="h-3.5 w-3.5" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5" />
        )}
      </Button>
      {open && (
        <div className="space-y-3 border-t p-3">
          <section className="space-y-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Contributing signals
            </p>
            <ul className="space-y-1.5">
              {reasoning.map((r) => (
                <li key={r.id} className="space-y-0.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-medium text-foreground/90">{r.label}</span>
                    <span className="tabular-nums text-muted-foreground">{r.weight}</span>
                  </div>
                  <div className="h-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn("h-full bg-primary/70")}
                      style={{ width: `${(r.weight / max) * 100}%` }}
                    />
                  </div>
                  {r.source && (
                    <p className="text-[10px] text-muted-foreground">Source: {r.source}</p>
                  )}
                </li>
              ))}
            </ul>
          </section>

          {assumptions.length > 0 && (
            <section className="space-y-1">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Assumptions
              </p>
              <ul className="space-y-0.5 text-[11px] text-foreground/80">
                {assumptions.map((a, i) => (
                  <li key={i}>· {a}</li>
                ))}
              </ul>
            </section>
          )}

          {unresolvedRisks.length > 0 && (
            <section className="space-y-1">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Unresolved risks
              </p>
              <ul className="space-y-0.5 text-[11px] text-foreground/80">
                {unresolvedRisks.map((r, i) => (
                  <li key={i}>· {r}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
