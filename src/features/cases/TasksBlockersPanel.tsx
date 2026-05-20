import { AlertTriangle, Check, Circle, CircleDashed, CircleDotDashed, Hourglass, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CaseTask, CaseTaskStatus, CaseTaskUrgency } from "./types";

const STATUS_ICON: Record<CaseTaskStatus, LucideIcon> = {
  open: Circle,
  in_progress: CircleDotDashed,
  blocked: AlertTriangle,
  waiting: Hourglass,
  done: Check,
};

const STATUS_TONE: Record<CaseTaskStatus, string> = {
  open: "text-muted-foreground",
  in_progress: "text-info",
  blocked: "text-destructive",
  waiting: "text-warning-foreground",
  done: "text-success",
};

const STATUS_LABEL: Record<CaseTaskStatus, string> = {
  open: "Open",
  in_progress: "In progress",
  blocked: "Blocked",
  waiting: "Waiting",
  done: "Done",
};

const URGENCY_TONE: Record<CaseTaskUrgency, string> = {
  critical: "bg-destructive/10 text-destructive",
  high: "bg-warning/15 text-warning-foreground",
  medium: "bg-info/10 text-info",
  low: "bg-muted text-muted-foreground",
};

function formatDue(iso?: string) {
  if (!iso) return null;
  const ms = new Date(iso).getTime() - Date.now();
  const abs = Math.abs(ms);
  const hrs = Math.round(abs / 3_600_000);
  if (hrs < 1) return ms < 0 ? "overdue" : "due now";
  if (hrs < 48) return ms < 0 ? `${hrs}h overdue` : `due in ${hrs}h`;
  const days = Math.round(hrs / 24);
  return ms < 0 ? `${days}d overdue` : `due in ${days}d`;
}

export function TasksBlockersPanel({ tasks }: { tasks: CaseTask[] }) {
  const open = tasks.filter((t) => t.status !== "done");
  const done = tasks.filter((t) => t.status === "done");

  return (
    <div className="space-y-3">
      <ul className="space-y-1.5">
        {open.map((t) => {
          const Icon = STATUS_ICON[t.status];
          const due = formatDue(t.dueAt);
          const overdue = t.dueAt && new Date(t.dueAt).getTime() < Date.now();
          return (
            <li key={t.id} className="rounded-md border bg-card p-2.5">
              <div className="flex items-start gap-2.5">
                <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", STATUS_TONE[t.status])} />
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <p className="text-sm font-medium leading-snug">{t.title}</p>
                    <span
                      className={cn(
                        "rounded-full px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                        URGENCY_TONE[t.urgency],
                      )}
                    >
                      {t.urgency}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
                    <span>{STATUS_LABEL[t.status]}</span>
                    {t.assignee && (
                      <>
                        <span>·</span>
                        <span>{t.assignee}</span>
                      </>
                    )}
                    {due && (
                      <>
                        <span>·</span>
                        <span className={overdue ? "text-destructive" : ""}>{due}</span>
                      </>
                    )}
                    {t.dependsOn && (
                      <>
                        <span>·</span>
                        <span className="font-mono">
                          {t.dependsOn.type}:{t.dependsOn.label}
                        </span>
                      </>
                    )}
                  </div>
                  {t.blocker && (
                    <p className="inline-flex items-start gap-1.5 rounded-md bg-destructive/5 px-1.5 py-1 text-[11px] text-destructive">
                      <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
                      <span>{t.blocker}</span>
                    </p>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {done.length > 0 && (
        <details className="rounded-md border bg-card/40 px-2.5 py-1.5 text-xs">
          <summary className="cursor-pointer text-muted-foreground">
            {done.length} completed
          </summary>
          <ul className="mt-2 space-y-1">
            {done.map((t) => (
              <li key={t.id} className="flex items-center gap-2 text-muted-foreground">
                <Check className="h-3 w-3 text-success" />
                <span className="line-through">{t.title}</span>
                {t.assignee && <span>· {t.assignee}</span>}
              </li>
            ))}
          </ul>
        </details>
      )}

      {open.length === 0 && done.length === 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CircleDashed className="h-4 w-4" />
          No tasks on this case.
        </div>
      )}
    </div>
  );
}
