import { useState } from "react";
import { ChevronDown, ChevronRight, BookOpen, AlertTriangle, ArrowUpRight } from "lucide-react";
import type { OperationalPlaybook } from "./types";

export function OperationalPlaybookCard({ playbook }: { playbook: OperationalPlaybook }) {
  const [open, setOpen] = useState(false);
  return (
    <article className="overflow-hidden rounded-lg border bg-card">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start gap-3 px-3 py-2.5 text-left transition-colors hover:bg-muted/40"
      >
        <BookOpen className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium leading-snug">{playbook.title}</p>
          <p className="text-xs leading-relaxed text-muted-foreground">{playbook.summary}</p>
          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
            {playbook.averageResolutionDays != null && <span>{playbook.averageResolutionDays}d avg</span>}
            {playbook.successRate != null && <span>· {playbook.successRate}% success</span>}
            <span>· {playbook.steps.length} steps</span>
          </div>
        </div>
        {open ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
      </button>

      {open && (
        <div className="space-y-3 border-t bg-muted/20 p-3">
          <section>
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Recommended workflow
            </p>
            <ol className="space-y-1.5">
              {playbook.steps.map((s) => (
                <li key={s.id} className="flex gap-2 rounded-md border bg-card p-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                    {s.order}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium">{s.title}</p>
                    <p className="text-[11px] leading-relaxed text-muted-foreground">{s.detail}</p>
                    {(s.owner || s.expectedDurationHours) && (
                      <p className="mt-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                        {s.owner}
                        {s.expectedDurationHours ? ` · ~${s.expectedDurationHours}h` : ""}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {playbook.commonBlockers.length > 0 && (
            <section>
              <p className="mb-1 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                <AlertTriangle className="h-3 w-3" /> Expected blockers
              </p>
              <ul className="space-y-0.5">
                {playbook.commonBlockers.map((b) => (
                  <li key={b} className="text-[11px] leading-relaxed text-muted-foreground">· {b}</li>
                ))}
              </ul>
            </section>
          )}

          {playbook.escalationTriggers.length > 0 && (
            <section>
              <p className="mb-1 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                <ArrowUpRight className="h-3 w-3" /> Escalation triggers
              </p>
              <ul className="space-y-0.5">
                {playbook.escalationTriggers.map((t) => (
                  <li key={t} className="text-[11px] leading-relaxed text-muted-foreground">· {t}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </article>
  );
}
