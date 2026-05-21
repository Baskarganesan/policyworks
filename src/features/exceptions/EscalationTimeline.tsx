import {
  AlertOctagon,
  Bot,
  Check,
  Gavel,
  MessageSquareWarning,
  RefreshCcw,
  Scale,
  ShieldAlert,
  StickyNote,
  UserCog,
  UserPlus,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { EscalationEvent, EscalationEventKind } from "./types";

const KIND_META: Record<
  EscalationEventKind,
  { icon: LucideIcon; tone: string; label: string }
> = {
  sla_breached: { icon: AlertOctagon, tone: "text-destructive", label: "SLA breached" },
  supervisor_assigned: { icon: UserPlus, tone: "text-info", label: "Supervisor assigned" },
  legal_review: { icon: Gavel, tone: "text-warning-foreground", label: "Legal review" },
  fraud_review: { icon: ShieldAlert, tone: "text-destructive", label: "Fraud review" },
  customer_escalation: {
    icon: MessageSquareWarning,
    tone: "text-warning-foreground",
    label: "Customer escalation",
  },
  compliance_review: { icon: Scale, tone: "text-warning-foreground", label: "Compliance review" },
  approval_requested: { icon: UserCog, tone: "text-info", label: "Approval requested" },
  approval_granted: { icon: Check, tone: "text-success", label: "Approval granted" },
  reopened: { icon: RefreshCcw, tone: "text-info", label: "Reopened" },
  note: { icon: StickyNote, tone: "text-muted-foreground", label: "Note" },
  reassigned: { icon: UserCog, tone: "text-info", label: "Reassigned" },
};

const ACTOR_LABEL: Record<EscalationEvent["actorKind"], string> = {
  user: "Person",
  system: "System",
  ai: "AI",
  automation: "Automation",
  customer: "Customer",
};

function formatStamp(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function EscalationTimeline({ events }: { events: EscalationEvent[] }) {
  if (events.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No escalation events recorded.</p>
    );
  }
  const sorted = [...events].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );
  return (
    <ol className="space-y-2">
      {sorted.map((ev, idx) => {
        const meta = KIND_META[ev.kind];
        const Icon = meta.icon;
        const last = idx === sorted.length - 1;
        return (
          <li key={ev.id} className="relative flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-card ring-1 ring-border",
                  meta.tone,
                )}
              >
                <Icon className="h-3 w-3" />
              </span>
              {!last && <span className="mt-0.5 h-full w-px flex-1 bg-border" />}
            </div>
            <div className="flex-1 pb-3">
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className={cn("font-medium uppercase tracking-wide", meta.tone)}>
                  {meta.label}
                </span>
                <span>·</span>
                <span>{formatStamp(ev.timestamp)}</span>
              </div>
              <p className="mt-0.5 text-sm leading-snug">{ev.description}</p>
              <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                {ev.actorKind === "ai" || ev.actorKind === "automation" ? (
                  <Bot className="h-3 w-3" />
                ) : null}
                <span className="font-medium text-foreground/80">{ev.actor}</span>
                <span>· {ACTOR_LABEL[ev.actorKind]}</span>
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
