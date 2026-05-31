import { Quote, ThumbsUp } from "lucide-react";
import type { ExpertNote } from "./types";

export function ExpertInsightCard({ note }: { note: ExpertNote }) {
  return (
    <article className="space-y-2 rounded-md border bg-card p-2.5">
      <Quote className="h-3.5 w-3.5 text-muted-foreground" />
      <p className="text-xs leading-relaxed text-foreground/90">{note.note}</p>
      <div className="flex items-center justify-between gap-2 border-t pt-2">
        <div className="min-w-0">
          <p className="truncate text-[11px] font-medium">{note.author}</p>
          <p className="truncate text-[10px] uppercase tracking-wide text-muted-foreground">
            {note.role}
            {note.seniorityYears ? ` · ${note.seniorityYears}y` : ""}
          </p>
        </div>
        {note.endorsements != null && (
          <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
            <ThumbsUp className="h-3 w-3" />
            {note.endorsements}
          </span>
        )}
      </div>
    </article>
  );
}
