import { Sparkles, FileText, ClipboardList, RotateCw, FilePlus2, StickyNote, GitCommit } from "lucide-react";
import type { ActivityEvent } from "./types";
import { formatRelative } from "./utils";

const ICONS = {
  ai_review: Sparkles,
  document: FileText,
  claim: ClipboardList,
  renewal: RotateCw,
  endorsement: FilePlus2,
  note: StickyNote,
  update: GitCommit,
} as const;

export function PolicyActivityFeed({ events }: { events: ActivityEvent[] }) {
  return (
    <ol className="relative space-y-3 pl-5">
      <span className="absolute left-[9px] top-2 bottom-2 w-px bg-border" aria-hidden />
      {events.map((e) => {
        const Icon = ICONS[e.type];
        return (
          <li key={e.id} className="relative">
            <span className="absolute -left-5 top-1 flex h-[18px] w-[18px] items-center justify-center rounded-full border bg-card text-muted-foreground">
              <Icon className="h-2.5 w-2.5" />
            </span>
            <div className="text-sm">
              <span className="text-foreground">{e.message}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {e.actor} · {formatRelative(e.timestamp)}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
