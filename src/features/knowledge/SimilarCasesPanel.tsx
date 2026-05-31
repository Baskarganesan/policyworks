import { useState } from "react";
import { Library, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import { HistoricalOutcomeCard } from "./HistoricalOutcomeCard";
import type { HistoricalCase } from "./types";

function SimilarityBar({ score }: { score: number }) {
  const tone = score >= 85 ? "bg-success" : score >= 70 ? "bg-info" : "bg-muted-foreground/50";
  return (
    <div className="flex items-center gap-1.5">
      <div className="h-1 w-12 overflow-hidden rounded-full bg-muted">
        <div className={cn("h-full", tone)} style={{ width: `${score}%` }} />
      </div>
      <span className="text-[10px] font-medium tabular-nums text-muted-foreground">{score}%</span>
    </div>
  );
}

export function SimilarCasesPanel({ cases }: { cases: HistoricalCase[] }) {
  const [openId, setOpenId] = useState<string | null>(cases[0]?.id ?? null);
  if (cases.length === 0) return null;

  return (
    <div className="space-y-2">
      {cases.map((c) => {
        const isOpen = openId === c.id;
        return (
          <article key={c.id} className="overflow-hidden rounded-lg border bg-card">
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : c.id)}
              className="flex w-full items-start gap-3 px-3 py-2.5 text-left transition-colors hover:bg-muted/40"
            >
              <Library className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] text-muted-foreground">{c.reference}</p>
                    <p className="text-sm font-medium leading-snug">{c.title}</p>
                  </div>
                  <SimilarityBar score={c.similarityScore} />
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">{c.summary}</p>
                {c.matchedFactors.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {c.matchedFactors.map((f) => (
                      <span
                        key={f}
                        className="rounded-sm bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </button>

            {isOpen && (
              <div className="space-y-2 border-t bg-muted/20 p-3">
                <HistoricalOutcomeCard record={c} />
                {c.lessonsLearned.length > 0 && (
                  <div className="rounded-md border bg-card p-2.5">
                    <p className="mb-1 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      <Lightbulb className="h-3 w-3" /> Lessons learned
                    </p>
                    <ul className="space-y-1">
                      {c.lessonsLearned.map((l, i) => (
                        <li key={i} className="text-xs leading-relaxed text-foreground/90">
                          · {l}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
