import {
  FilePlus2,
  Upload,
  Sparkles,
  RefreshCw,
  MessageSquare,
  Send,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react";
import type { ActivityEvent, ActivityEventType } from "./types";

const ICONS: Record<ActivityEventType, LucideIcon> = {
  claim_created: FilePlus2,
  document_uploaded: Upload,
  ai_question: Sparkles,
  policy_updated: RefreshCw,
  note_added: MessageSquare,
  renewal_sent: Send,
  claim_escalated: AlertTriangle,
};

const TONES: Record<ActivityEventType, string> = {
  claim_created: "text-info bg-info/10",
  document_uploaded: "text-muted-foreground bg-muted",
  ai_question: "text-primary bg-primary/10",
  policy_updated: "text-muted-foreground bg-muted",
  note_added: "text-muted-foreground bg-muted",
  renewal_sent: "text-success bg-success/10",
  claim_escalated: "text-destructive bg-destructive/10",
};

function relative(iso: string) {
  const m = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

function groupByBucket(events: ActivityEvent[]) {
  const buckets: { label: string; events: ActivityEvent[] }[] = [
    { label: "Last hour", events: [] },
    { label: "Today", events: [] },
    { label: "Earlier", events: [] },
  ];
  const oneHour = 60 * 60_000;
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  for (const e of events) {
    const t = new Date(e.timestamp).getTime();
    if (Date.now() - t < oneHour) buckets[0].events.push(e);
    else if (t >= startOfDay.getTime()) buckets[1].events.push(e);
    else buckets[2].events.push(e);
  }
  return buckets.filter((b) => b.events.length > 0);
}

export function ActivityTimeline({ events }: { events: ActivityEvent[] }) {
  const sorted = [...events].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );
  const groups = groupByBucket(sorted);

  if (groups.length === 0) {
    return <p className="text-sm text-muted-foreground">No recent activity.</p>;
  }

  return (
    <div className="space-y-4">
      {groups.map((g) => (
        <div key={g.label}>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
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
                    <p className="text-sm leading-snug">
                      <span className="font-medium">{e.actor}</span>{" "}
                      <span className="text-muted-foreground">{e.description}</span>
                      {e.target && (
                        <span className="ml-1 font-mono text-xs text-foreground/80">
                          {e.target}
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">{relative(e.timestamp)}</p>
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
