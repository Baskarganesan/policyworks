import { useMemo, useState } from "react";
import {
  Mail,
  Phone,
  MessageSquare,
  Users,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { CaseMessage, CaseMessageChannel } from "./types";

const CHANNEL_ICON: Record<CaseMessageChannel, LucideIcon> = {
  email: Mail,
  phone: Phone,
  portal: MessageSquare,
  internal: Users,
  sms: Smartphone,
};

const CHANNEL_LABEL: Record<CaseMessageChannel, string> = {
  email: "Email",
  phone: "Phone",
  portal: "Portal",
  internal: "Internal",
  sms: "SMS",
};

const DIRECTION_TONE: Record<CaseMessage["direction"], string> = {
  inbound: "border-l-success",
  outbound: "border-l-info",
  internal: "border-l-accent",
};

function formatTimestamp(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const FILTERS: { id: "all" | "external" | "internal"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "external", label: "Customer" },
  { id: "internal", label: "Internal" },
];

export function CommunicationFeed({ messages }: { messages: CaseMessage[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");

  const filtered = useMemo(() => {
    const sorted = [...messages].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
    return sorted.filter((m) => {
      if (filter === "all") return true;
      if (filter === "internal") return m.direction === "internal";
      if (filter === "external") return m.direction !== "internal";
      return true;
    });
  }, [messages, filter]);

  if (messages.length === 0) {
    return <p className="text-sm text-muted-foreground">No communications logged for this case.</p>;
  }

  return (
    <div className="space-y-3">
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

      <ul className="space-y-2">
        {filtered.map((m) => {
          const Icon = CHANNEL_ICON[m.channel];
          return (
            <li
              key={m.id}
              className={cn(
                "rounded-md border border-l-2 bg-card p-2.5",
                DIRECTION_TONE[m.direction],
              )}
            >
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium">
                  <Icon className="h-2.5 w-2.5" />
                  {CHANNEL_LABEL[m.channel]}
                </span>
                <span className="font-medium text-foreground">{m.author.name}</span>
                {m.author.role && <span>· {m.author.role}</span>}
                <span className="ml-auto">{formatTimestamp(m.timestamp)}</span>
              </div>
              {m.subject && <p className="mt-1.5 text-sm font-medium">{m.subject}</p>}
              <p className="mt-1 text-sm leading-relaxed text-foreground/90">{m.body}</p>
              {m.thread && (
                <p className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                  thread · {m.thread}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
