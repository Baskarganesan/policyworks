import { AlertTriangle, Building2, Check, Clock, User, Users, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Dependency, DependencyStatus } from "./types";

const OWNER_ICON: Record<Dependency["ownerType"], LucideIcon> = {
  internal: Users,
  customer: User,
  third_party: Building2,
  regulator: Building2,
};

const STATUS_TONE: Record<DependencyStatus, { dot: string; label: string; text: string }> = {
  waiting: { dot: "bg-warning", label: "Waiting", text: "text-warning-foreground" },
  overdue: { dot: "bg-destructive", label: "Overdue", text: "text-destructive" },
  in_progress: { dot: "bg-info", label: "In progress", text: "text-info" },
  received: { dot: "bg-success", label: "Received", text: "text-success" },
};

function durationSince(iso: string) {
  const ms = Date.now() - new Date(iso).getTime();
  const hrs = Math.round(ms / 3_600_000);
  if (hrs < 1) return "just now";
  if (hrs < 48) return `${hrs}h`;
  return `${Math.round(hrs / 24)}d`;
}

function durationUntil(iso: string) {
  const ms = new Date(iso).getTime() - Date.now();
  const abs = Math.abs(ms);
  const hrs = Math.round(abs / 3_600_000);
  if (hrs < 48) return ms < 0 ? `${hrs}h overdue` : `~${hrs}h`;
  const days = Math.round(hrs / 24);
  return ms < 0 ? `${days}d overdue` : `~${days}d`;
}

export function DependencyTracker({ dependencies }: { dependencies: Dependency[] }) {
  if (dependencies.length === 0) {
    return (
      <div className="flex items-center gap-2 rounded-md border border-dashed bg-card/40 p-2.5 text-xs text-muted-foreground">
        <Check className="h-3.5 w-3.5 text-success" />
        No external dependencies blocking this exception.
      </div>
    );
  }

  return (
    <ul className="space-y-1.5">
      {dependencies.map((d) => {
        const Icon = OWNER_ICON[d.ownerType];
        const status = STATUS_TONE[d.status];
        return (
          <li key={d.id} className="rounded-md border bg-card p-2.5">
            <div className="flex items-start gap-2.5">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                <Icon className="h-3.5 w-3.5" />
              </span>
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <p className="text-sm font-medium leading-snug">{d.description}</p>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                      status.text,
                    )}
                  >
                    <span className={cn("h-1.5 w-1.5 rounded-full", status.dot)} />
                    {status.label}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span className="font-medium text-foreground/80">{d.owner}</span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    blocked {durationSince(d.blockedSince)}
                  </span>
                  {d.expectedResolution && (
                    <>
                      <span>·</span>
                      <span
                        className={
                          new Date(d.expectedResolution).getTime() < Date.now()
                            ? "text-destructive"
                            : ""
                        }
                      >
                        ETA {durationUntil(d.expectedResolution)}
                      </span>
                    </>
                  )}
                </div>
                {d.downstreamImpact && (
                  <p className="inline-flex items-start gap-1.5 rounded-md bg-warning/10 px-1.5 py-1 text-[11px] text-warning-foreground">
                    <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
                    <span>{d.downstreamImpact}</span>
                  </p>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
