import {
  FilePlus2,
  RefreshCw,
  UserPlus,
  MessageSquare,
  Upload,
  MessageCircle,
  AlertTriangle,
  Clock,
  type LucideIcon,
} from "lucide-react";
import type { TaskEventType, WorkflowEvent } from "./types";

const ICONS: Record<TaskEventType, LucideIcon> = {
  created: FilePlus2,
  status_changed: RefreshCw,
  assigned: UserPlus,
  comment_added: MessageSquare,
  document_requested: Upload,
  customer_responded: MessageCircle,
  claim_escalated: AlertTriangle,
  due_changed: Clock,
};

const TONES: Record<TaskEventType, string> = {
  created: "text-muted-foreground bg-muted",
  status_changed: "text-info bg-info/10",
  assigned: "text-foreground bg-accent",
  comment_added: "text-muted-foreground bg-muted",
  document_requested: "text-warning-foreground bg-warning/15",
  customer_responded: "text-success bg-success/10",
  claim_escalated: "text-destructive bg-destructive/10",
  due_changed: "text-muted-foreground bg-muted",
};

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.round(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return `${d}d ago`;
}

function groupByDay(events: WorkflowEvent[]) {
  const groups: { label: string; events: WorkflowEvent[] }[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today.getTime() - 86400000);
  for (const e of events) {
    const ts = new Date(e.timestamp);
    const day = new Date(ts);
    day.setHours(0, 0, 0, 0);
    let label: string;
    if (day.getTime() === today.getTime()) label = "Today";
    else if (day.getTime() === yesterday.getTime()) label = "Yesterday";
    else label = day.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    let g = groups.find((x) => x.label === label);
    if (!g) {
      g = { label, events: [] };
      groups.push(g);
    }
    g.events.push(e);
  }
  return groups;
}

export function ActivityFeed({ events }: { events: WorkflowEvent[] }) {
  if (events.length === 0) {
    return <p className="text-sm text-muted-foreground">No recent activity.</p>;
  }

  const sorted = [...events].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );
  const groups = groupByDay(sorted);

  return (
    <div className="space-y-5">
      {groups.map((g) => (
        <div key={g.label}>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {g.label}
          </p>
          <ol className="space-y-2.5">
            {g.events.map((e) => {
              const Icon = ICONS[e.type];
              return (
                <li key={e.id} className="flex items-start gap-2.5">
                  <span
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${TONES[e.type]}`}
                  >
                    <Icon className="h-3 w-3" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-snug">{e.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {e.actor} · {relativeTime(e.timestamp)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      ))}
    </div>
  );
}
