import { useMemo, useState } from "react";
import {
  Briefcase,
  ClipboardList,
  Sparkles,
  FileUp,
  FilePlus2,
  MessageSquare,
  StickyNote,
  ListPlus,
  CheckCircle2,
  RefreshCw,
  ChevronUp,
  RotateCw,
  GitCommit,
  ShieldCheck,
  Bot,
  Cpu,
  Workflow,
  User as UserIcon,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { CaseEvent, CaseEventActorKind, CaseEventType } from "./types";

const EVENT_ICON: Record<CaseEventType, LucideIcon> = {
  case_created: Briefcase,
  claim_filed: ClipboardList,
  ai_insight: Sparkles,
  document_uploaded: FileUp,
  document_requested: FilePlus2,
  customer_message: MessageSquare,
  internal_note: StickyNote,
  task_created: ListPlus,
  task_completed: CheckCircle2,
  status_changed: RefreshCw,
  escalation: ChevronUp,
  renewal_triggered: RotateCw,
  policy_updated: GitCommit,
  audit: ShieldCheck,
};

const ACTOR_ICON: Record<CaseEventActorKind, LucideIcon> = {
  user: UserIcon,
  system: Cpu,
  ai: Bot,
  automation: Workflow,
  customer: UserIcon,
};

const ACTOR_TONE: Record<CaseEventActorKind, string> = {
  user: "bg-muted text-foreground",
  system: "bg-muted text-muted-foreground",
  ai: "bg-info/10 text-info",
  automation: "bg-accent text-accent-foreground",
  customer: "bg-success/10 text-success",
};

const FILTERS: { id: "all" | "ai" | "people" | "system" | "customer"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "people", label: "People" },
  { id: "customer", label: "Customer" },
  { id: "ai", label: "AI signals" },
  { id: "system", label: "System & audit" },
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

export function UnifiedTimeline({ events }: { events: CaseEvent[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");

  const filtered = useMemo(() => {
    const sorted = [...events].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
    return sorted.filter((e) => {
      if (filter === "all") return true;
      if (filter === "ai") return e.actor.kind === "ai";
      if (filter === "customer") return e.actor.kind === "customer";
      if (filter === "people") return e.actor.kind === "user";
      if (filter === "system") return e.actor.kind === "system" || e.actor.kind === "automation";
      return true;
    });
  }, [events, filter]);

  const groups = useMemo(() => {
    const map = new Map<string, CaseEvent[]>();
    for (const e of filtered) {
      const k = formatDay(e.timestamp);
      const arr = map.get(k) ?? [];
      arr.push(e);
      map.set(k, arr);
    }
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <div className="space-y-4">
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

      {filtered.length === 0 ? (
        <p className="text-xs text-muted-foreground">No events match this filter.</p>
      ) : (
        <div className="space-y-5">
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
                      <div className="space-y-1 rounded-md border bg-card/40 px-2.5 py-2">
                        <p className="text-sm leading-snug">{e.description}</p>
                        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                              ACTOR_TONE[e.actor.kind],
                            )}
                          >
                            <ActorIcon className="h-2.5 w-2.5" />
                            {e.actor.name}
                            {e.actor.role ? ` · ${e.actor.role}` : ""}
                          </span>
                          <span>·</span>
                          <span>{formatTime(e.timestamp)}</span>
                          {e.source && (
                            <>
                              <span>·</span>
                              <span className="truncate">{e.source}</span>
                            </>
                          )}
                          {e.relatedEntity && (
                            <>
                              <span>·</span>
                              <span className="inline-flex items-center gap-1 font-mono">
                                {e.relatedEntity.type}:{e.relatedEntity.label}
                              </span>
                            </>
                          )}
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
