import { cn } from "@/lib/utils";
import type { DecisionMatrixCriterion, DecisionScenario } from "./types";

interface Props {
  scenarios: DecisionScenario[];
  criteria: DecisionMatrixCriterion[];
}

function toneFor(score: number) {
  if (score >= 75) return "bg-success/15 text-success-foreground";
  if (score >= 55) return "bg-info/15 text-info-foreground";
  if (score >= 35) return "bg-warning/15 text-warning-foreground";
  return "bg-muted text-muted-foreground";
}

export function OperationalDecisionMatrix({ scenarios, criteria }: Props) {
  if (criteria.length === 0) return null;
  const weighted = scenarios.map((s) => {
    const total = criteria.reduce((sum, c) => sum + (c.scores[s.id] ?? 0) * (c.weight / 100), 0);
    return { id: s.id, total: Math.round(total) };
  });
  const best = Math.max(...weighted.map((w) => w.total));

  return (
    <div className="overflow-hidden rounded-md border bg-card">
      <div className="border-b bg-muted/30 px-3 py-2">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          Operational decision matrix
        </p>
        <p className="text-[11px] text-muted-foreground">
          Relative scoring across criteria — for comparison, not a final verdict.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] text-[11px]">
          <thead>
            <tr className="bg-muted/20 text-left text-[10px] uppercase tracking-wide text-muted-foreground">
              <th className="px-3 py-2 font-medium">Criterion</th>
              {scenarios.map((s) => (
                <th key={s.id} className="px-2 py-2 font-medium">
                  <div className="truncate" title={s.title}>{s.title}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {criteria.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="px-3 py-1.5">
                  <div className="font-medium">{c.label}</div>
                  <div className="text-[10px] text-muted-foreground">weight {c.weight}%</div>
                </td>
                {scenarios.map((s) => {
                  const score = c.scores[s.id] ?? 0;
                  return (
                    <td key={s.id} className="px-2 py-1.5">
                      <span
                        className={cn(
                          "inline-flex min-w-[2.25rem] justify-center rounded-md px-1.5 py-0.5 tabular-nums",
                          toneFor(score),
                        )}
                      >
                        {score}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr className="border-t bg-muted/20">
              <td className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Weighted total
              </td>
              {weighted.map((w) => (
                <td key={w.id} className="px-2 py-2 font-semibold">
                  <span
                    className={cn(
                      "inline-flex min-w-[2.25rem] justify-center rounded-md px-1.5 py-0.5 tabular-nums",
                      w.total === best ? "bg-primary/15 text-primary" : "bg-muted text-foreground",
                    )}
                  >
                    {w.total}
                  </span>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
