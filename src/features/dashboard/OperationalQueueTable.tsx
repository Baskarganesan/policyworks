import { FileText, ClipboardList, ShieldAlert, CheckCircle2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { WorkQueueItem } from "./types";

const CATEGORY_ICON: Record<WorkQueueItem["category"], LucideIcon> = {
  claim: ClipboardList,
  document: FileText,
  approval: CheckCircle2,
  escalation: ShieldAlert,
};

const PRIORITY_TONE: Record<WorkQueueItem["priority"], string> = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-info/10 text-info",
  high: "bg-warning/15 text-warning-foreground",
  urgent: "bg-destructive/10 text-destructive",
};

function relativeDue(iso: string) {
  const diff = new Date(iso).getTime() - Date.now();
  const h = Math.round(diff / 3_600_000);
  if (h < 0) return { label: `${Math.abs(h)}h overdue`, overdue: true };
  if (h < 24) return { label: `Due in ${h}h`, overdue: false };
  const d = Math.round(h / 24);
  return { label: `Due in ${d}d`, overdue: false };
}

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function OperationalQueueTable({ items }: { items: WorkQueueItem[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">Queue is clear.</p>;
  }

  return (
    <div className="-mx-4 -my-4 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th className="px-4 py-2 font-medium">Task</th>
            <th className="hidden px-3 py-2 font-medium md:table-cell">Priority</th>
            <th className="hidden px-3 py-2 font-medium lg:table-cell">Due</th>
            <th className="hidden px-3 py-2 font-medium lg:table-cell">Assignee</th>
            <th className="px-4 py-2 text-right font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const Icon = CATEGORY_ICON[item.category];
            const due = relativeDue(item.dueDate);
            return (
              <tr
                key={item.id}
                className="border-b last:border-b-0 transition-colors hover:bg-accent/40"
              >
                <td className="px-4 py-2.5">
                  <div className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium leading-tight">
                        {item.title}
                      </div>
                      <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span className="font-mono">{item.reference}</span>
                        <span>·</span>
                        <span className="truncate">{item.customer}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="hidden px-3 py-2.5 md:table-cell">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium capitalize",
                      PRIORITY_TONE[item.priority],
                    )}
                  >
                    {item.priority}
                  </span>
                </td>
                <td className="hidden px-3 py-2.5 text-xs lg:table-cell">
                  <span className={cn(due.overdue && "font-medium text-destructive")}>
                    {due.label}
                  </span>
                </td>
                <td className="hidden px-3 py-2.5 text-xs lg:table-cell">
                  <div className="flex items-center gap-1.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-medium">
                      {initials(item.assignedTo)}
                    </span>
                    <span className="truncate text-muted-foreground">{item.assignedTo}</span>
                  </div>
                </td>
                <td className="px-4 py-2.5 text-right">
                  <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
                    Open
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
