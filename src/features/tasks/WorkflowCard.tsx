import { Calendar, GripVertical } from "lucide-react";
import { Card } from "@/components/ui/card";
import { TaskPriorityBadge } from "./TaskPriorityBadge";
import type { Task } from "./types";

interface Props {
  task: Task;
  onClick?: () => void;
}

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatShort(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function WorkflowCard({ task, onClick }: Props) {
  const related = task.relatedClaim?.reference ?? task.relatedPolicy?.number;

  return (
    <Card
      onClick={onClick}
      className="group cursor-pointer space-y-2.5 border-border/70 p-3 transition-all hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-elevated"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[10px] text-muted-foreground">{task.id}</span>
            {related && (
              <>
                <span className="text-[10px] text-muted-foreground">·</span>
                <span className="font-mono text-[10px] text-muted-foreground">{related}</span>
              </>
            )}
          </div>
          <p className="mt-0.5 line-clamp-2 text-sm font-medium leading-snug">{task.title}</p>
        </div>
        <GripVertical className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40 opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      <p className="truncate text-xs text-muted-foreground">{task.relatedCustomer.name}</p>

      <div className="flex items-center justify-between pt-1">
        <TaskPriorityBadge priority={task.priority} />
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatShort(task.dueDate)}
          </span>
          <span
            title={task.assignedTo}
            className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[9px] font-medium text-foreground"
          >
            {initialsOf(task.assignedTo)}
          </span>
        </div>
      </div>
    </Card>
  );
}
