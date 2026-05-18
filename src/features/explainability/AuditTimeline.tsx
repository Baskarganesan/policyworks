import { useMemo, useState } from "react";
import {
  FileUp,
  Sparkles,
  ClipboardList,
  ShieldAlert,
  FilePlus2,
  RefreshCw,
  Users,
  StickyNote,
  RotateCw,
  GitCommit,
  Bot,
  Cpu,
  User as UserIcon,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { AuditActorKind, AuditEvent, AuditEventType } from "./types";

const EVENT_ICON: Record<AuditEventType, LucideIcon> = {
  document_uploaded: FileUp,
  ai_review_completed: Sparkles,
  claim_created: ClipboardList,
  claim_escalated: ShieldAlert,
  policy_updated: GitCommit,
  workflow_reassigned: Users,
  risk_flag_generated: ShieldAlert,
  status_changed: RefreshCw,
  note_added: StickyNote,
  renewal_extended: RotateCw,
  document_replaced: FilePlus2,
  endorsement_added: FilePlus2,
};

const ACTOR_ICON: Record<AuditActorKind, LucideIcon> = {
  user: UserIcon,
  system: Cpu,
  ai: Bot,
  automation: Workflow,
};

const ACTOR_TONE: Record<AuditActorKind, string> = {
  user: "bg-muted text-foreground",
  system: "bg-muted text-muted-foreground",
  ai: "bg-info/10 text-info",
  automation: "bg-accent text-accent-foreground",
};

const FILTERS: { id: AuditActorKind | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "user", label: "People" },
  { id: "ai", label: "AI" },
  { id: "automation", label: "Automation" },
  { id: "system", label: "System" },
];

function formatDay(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const yest = new Date();
  yest.setDate(today.getDate() - 1);
  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  if (sameDay(d, today)) return "Today";
  if (sameDay(d, yest)) return "Yesterday";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export function AuditTimeline({
  events,
  showFilters = true,
  className,
}: {
  events: AuditEvent[];
  showFilters?: boolean;
  className?: string;
}) {
  const [filter, setFilter] = useState<AuditActorKind | "all">("all");

  const filtered = useMemo(
    () =>
      [...events]
        .filter((e) => filter === "all" || e.actor.kind === filter)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    [events, filter],
  );

  const groups = useMemo(() => {
    const map = new Map<string, AuditEvent[]>();
    for (const e of filtered) {
      const k = formatDay(e.timestamp);
      const arr = map.get(k) ?? [];
      arr.push(e);
      map.set(k, arr);
    }
    return Array.from(map.entries());
  }, [filtered]);

  if (events.length === 0) {
    return <p className="text-sm text-muted-foreground">No audit events recorded.</p>;
  }

  return (
    <div className={cn("space-y-3", className)}>
      {showFilters && (
        <div className="flex flex-wrap gap-1">
          {FILTERS.map((f) => (
            <Button
              key={f.id}
              type="button"
              size="sm"
              variant={filter === f.id ? "default" : "outline"}
              className="h-6 px-2 text-[11px]"
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </Button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-xs text-muted-foreground">No events match this filter.</p>
      ) : (
        <div className="space-y-4">
          {groups.map(([day, items]) => (
            <div key={day} className="space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                {day}
              </p>
              <ol className="relative space-y-3 border-l border-border pl-5">
                {items.map((e) => {
                  const EvIcon = EVENT_ICON[e.type];
                  const ActorIcon = ACTOR_ICON[e.actor.kind];
                  return (
                    <li key={e.id} className="relative">
                      <span className="absolute -left-[27px] flex h-5 w-5 items-center justify-center rounded-full border bg-background text-muted-foreground">
                        <EvIcon className="h-2.5 w-2.5" />
                      </span>
                      <div className="space-y-0.5">
                        <p className="text-sm leading-snug">{e.summary}</p>
                        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                              ACTOR_TONE[e.actor.kind],
                            )}
                          >
                            <ActorIcon className="h-2.5 w-2.5" />
                            {e.actor.name}
                          </span>
                          <span>·</span>
                          <span>{formatTime(e.timestamp)}</span>
                          {e.source && (
                            <>
                              <span>·</span>
                              <span className="truncate">{e.source}</span>
                            </>
                          )}
                          <span>·</span>
                          <span className="font-mono">{e.entityId}</span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
