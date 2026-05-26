import { cn } from "@/lib/utils";
import type { Likelihood, ProjectedOutcome } from "./types";

const LIKELIHOOD_LABEL: Record<Likelihood, string> = {
  unlikely: "Unlikely",
  possible: "Possible",
  likely: "Likely",
  very_likely: "Very likely",
};

const LIKELIHOOD_PCT: Record<Likelihood, number> = {
  unlikely: 20,
  possible: 45,
  likely: 70,
  very_likely: 90,
};

export function OutcomeProjectionCard({ outcomes }: { outcomes: ProjectedOutcome[] }) {
  if (outcomes.length === 0) return null;
  return (
    <ul className="space-y-1.5">
      {outcomes.map((o) => {
        const pct = LIKELIHOOD_PCT[o.likelihood];
        const tone =
          o.tone === "positive"
            ? "bg-success"
            : o.tone === "negative"
            ? "bg-destructive"
            : "bg-info";
        return (
          <li key={o.id} className="rounded-md border bg-card px-2.5 py-2">
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs leading-snug text-foreground/90">{o.description}</p>
              <span className="shrink-0 rounded-full bg-muted px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                {LIKELIHOOD_LABEL[o.likelihood]}
              </span>
            </div>
            <p className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">
              {o.operationalImpact}
            </p>
            <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-muted">
              <div className={cn("h-full", tone)} style={{ width: `${pct}%` }} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
