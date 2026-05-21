import { Check, Clock, X, Circle, ChevronRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ApprovalStatus, ApprovalStep } from "./types";

const STATUS_META: Record<
  ApprovalStatus,
  { icon: LucideIcon; ring: string; text: string; bg: string; label: string }
> = {
  approved: {
    icon: Check,
    ring: "ring-success/30",
    text: "text-success",
    bg: "bg-success/10",
    label: "Approved",
  },
  rejected: {
    icon: X,
    ring: "ring-destructive/30",
    text: "text-destructive",
    bg: "bg-destructive/10",
    label: "Rejected",
  },
  pending: {
    icon: Clock,
    ring: "ring-warning/30",
    text: "text-warning-foreground",
    bg: "bg-warning/15",
    label: "Pending",
  },
  waiting: {
    icon: Circle,
    ring: "ring-border",
    text: "text-muted-foreground",
    bg: "bg-muted",
    label: "Waiting",
  },
  skipped: {
    icon: ChevronRight,
    ring: "ring-border",
    text: "text-muted-foreground",
    bg: "bg-muted",
    label: "Skipped",
  },
};

function formatTime(iso?: string) {
  if (!iso) return null;
  const ms = new Date(iso).getTime() - Date.now();
  const abs = Math.abs(ms);
  const hrs = Math.round(abs / 3_600_000);
  if (hrs < 1) return ms < 0 ? "just now" : "soon";
  if (hrs < 48) return ms < 0 ? `${hrs}h ago` : `due in ${hrs}h`;
  const days = Math.round(hrs / 24);
  return ms < 0 ? `${days}d ago` : `due in ${days}d`;
}

export function ApprovalWorkflowPanel({ steps }: { steps: ApprovalStep[] }) {
  if (steps.length === 0) return null;
  return (
    <ol className="space-y-2">
      {steps.map((step, idx) => {
        const meta = STATUS_META[step.status];
        const Icon = meta.icon;
        const isLast = idx === steps.length - 1;
        return (
          <li key={step.id} className="relative flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full ring-1 ring-inset",
                  meta.bg,
                  meta.text,
                  meta.ring,
                )}
              >
                <Icon className="h-3.5 w-3.5" />
              </span>
              {!isLast && <span className="mt-0.5 h-full w-px flex-1 bg-border" />}
            </div>
            <div className="flex-1 pb-3">
              <div className="flex flex-wrap items-center gap-1.5">
                <p className="text-sm font-medium leading-snug">{step.approver}</p>
                <span className="text-[11px] text-muted-foreground">· {step.role}</span>
                <span
                  className={cn(
                    "ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                    meta.bg,
                    meta.text,
                  )}
                >
                  {meta.label}
                </span>
              </div>
              <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
                {step.decidedAt && <span>decided {formatTime(step.decidedAt)}</span>}
                {step.dueAt && !step.decidedAt && (
                  <span
                    className={
                      new Date(step.dueAt).getTime() < Date.now() ? "text-destructive" : ""
                    }
                  >
                    {formatTime(step.dueAt)}
                  </span>
                )}
              </div>
              {step.note && (
                <p className="mt-1 rounded-md bg-muted/50 px-2 py-1 text-[11px] text-muted-foreground">
                  {step.note}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
