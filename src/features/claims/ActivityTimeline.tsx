import {
  FilePlus2,
  Upload,
  RefreshCw,
  MessageSquare,
  UserPlus,
  DollarSign,
  type LucideIcon,
} from "lucide-react";
import type { TimelineEvent, TimelineEventType } from "./types";

const ICONS: Record<TimelineEventType, LucideIcon> = {
  created: FilePlus2,
  document_uploaded: Upload,
  status_changed: RefreshCw,
  note_added: MessageSquare,
  agent_assigned: UserPlus,
  amount_updated: DollarSign,
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function ActivityTimeline({ events }: { events: TimelineEvent[] }) {
  if (events.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No activity recorded for this claim yet.</p>
    );
  }

  const sorted = [...events].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  return (
    <ol className="relative space-y-5 border-l border-border pl-6">
      {sorted.map((event) => {
        const Icon = ICONS[event.type];
        return (
          <li key={event.id} className="relative">
            <span className="absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full border bg-background text-muted-foreground">
              <Icon className="h-3 w-3" />
            </span>
            <div className="space-y-0.5">
              <p className="text-sm">{event.description}</p>
              <p className="text-xs text-muted-foreground">
                {event.actor} · {formatDateTime(event.timestamp)}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
