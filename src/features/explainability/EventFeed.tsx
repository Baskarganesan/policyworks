/**
 * EventFeed — compact, non-grouped alternative to AuditTimeline.
 * Useful inline within cards where headers/filters would be too heavy.
 */
import { Bot, Cpu, User as UserIcon, Workflow, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AuditActorKind, AuditEvent } from "./types";

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

export function EventFeed({
  events,
  className,
  limit,
}: {
  events: AuditEvent[];
  className?: string;
  limit?: number;
}) {
  const sorted = [...events]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit ?? events.length);
  if (sorted.length === 0) {
    return <p className="text-xs text-muted-foreground">No recent events.</p>;
  }
  return (
    <ul className={cn("space-y-1.5", className)}>
      {sorted.map((e) => {
        const Icon = ACTOR_ICON[e.actor.kind];
        return (
          <li key={e.id} className="flex items-start gap-2 text-xs">
            <Icon className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-foreground">{e.summary}</p>
              <p className="text-[11px] text-muted-foreground">
                {e.actor.name} · {formatRelative(e.timestamp)}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
