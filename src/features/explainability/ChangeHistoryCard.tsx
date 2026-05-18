import { ArrowRight, Bot, Cpu, User as UserIcon, Workflow, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AuditActorKind, ChangeRecord } from "./types";

const ACTOR_ICON: Record<AuditActorKind, LucideIcon> = {
  user: UserIcon,
  system: Cpu,
  ai: Bot,
  automation: Workflow,
};

function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

export function ChangeHistoryCard({
  changes,
  className,
}: {
  changes: ChangeRecord[];
  className?: string;
}) {
  if (changes.length === 0) {
    return (
      <p className="text-xs text-muted-foreground">No tracked changes for this entity.</p>
    );
  }
  return (
    <ul className={cn("space-y-1.5", className)}>
      {changes.map((c) => {
        const Icon = ACTOR_ICON[c.changedBy.kind];
        return (
          <li
            key={c.id}
            className="rounded-md border bg-card px-2.5 py-2 text-xs"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium">{c.field}</span>
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Icon className="h-3 w-3" />
                {c.changedBy.name} · {formatRelative(c.changedAt)}
              </span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px]">
              <span className="rounded bg-muted px-1.5 py-0.5 line-through text-muted-foreground">
                {c.before ?? "—"}
              </span>
              <ArrowRight className="h-3 w-3 text-muted-foreground" />
              <span className="rounded bg-success/10 px-1.5 py-0.5 font-medium text-success">
                {c.after ?? "—"}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
