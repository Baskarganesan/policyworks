import { Phone, Mail, Calendar, MessageSquare, Cog } from "lucide-react";
import type { CustomerInteraction, InteractionType } from "./types";

const ICONS: Record<InteractionType, React.ComponentType<{ className?: string }>> = {
  call: Phone,
  email: Mail,
  meeting: Calendar,
  sms: MessageSquare,
  system: Cog,
};

const TONE: Record<InteractionType, string> = {
  call: "bg-info/10 text-info",
  email: "bg-primary/10 text-primary",
  meeting: "bg-success/10 text-success",
  sms: "bg-warning/15 text-warning-foreground",
  system: "bg-muted text-muted-foreground",
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function InteractionFeed({ interactions }: { interactions: CustomerInteraction[] }) {
  if (interactions.length === 0) {
    return (
      <div className="rounded-lg border border-dashed bg-card/50 p-6 text-center text-sm text-muted-foreground">
        No interactions logged yet.
      </div>
    );
  }

  const sorted = [...interactions].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  return (
    <ol className="relative space-y-3 border-l pl-5">
      {sorted.map((i) => {
        const Icon = ICONS[i.type];
        return (
          <li key={i.id} className="relative">
            <span
              className={`absolute -left-[34px] flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-background ${TONE[i.type]}`}
            >
              <Icon className="h-3 w-3" />
            </span>
            <div className="rounded-lg border bg-card p-3">
              <div className="text-sm font-medium">{i.summary}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">
                {i.actor} · {formatDateTime(i.timestamp)}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
