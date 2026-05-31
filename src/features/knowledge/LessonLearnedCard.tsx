import { Lightbulb } from "lucide-react";
import type { HistoricalCase } from "./types";

export function LessonLearnedCard({ cases }: { cases: HistoricalCase[] }) {
  const lessons = cases.flatMap((c) =>
    c.lessonsLearned.map((text) => ({ text, ref: c.reference, id: `${c.id}-${text.slice(0, 10)}` })),
  );
  if (lessons.length === 0) return null;
  return (
    <ul className="space-y-1.5">
      {lessons.map((l) => (
        <li key={l.id} className="flex gap-2 rounded-md border bg-card p-2.5">
          <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" />
          <div className="min-w-0 flex-1">
            <p className="text-xs leading-relaxed text-foreground/90">{l.text}</p>
            <p className="mt-1 font-mono text-[10px] text-muted-foreground">From {l.ref}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
