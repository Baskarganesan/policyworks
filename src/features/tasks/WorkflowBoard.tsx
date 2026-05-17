import { Plus } from "lucide-react";
import { WorkflowCard } from "./WorkflowCard";
import { WORKFLOW_STAGES, WORKFLOW_STAGE_LABELS, type Task, type WorkflowStage } from "./types";

interface Props {
  tasks: Task[];
  onCardClick: (task: Task) => void;
}

export function WorkflowBoard({ tasks, onCardClick }: Props) {
  const grouped = WORKFLOW_STAGES.reduce<Record<WorkflowStage, Task[]>>(
    (acc, stage) => {
      acc[stage] = tasks.filter((t) => t.workflowStage === stage);
      return acc;
    },
    {} as Record<WorkflowStage, Task[]>,
  );

  return (
    <div className="-mx-1 overflow-x-auto pb-2">
      <div className="flex min-w-max gap-3 px-1">
        {WORKFLOW_STAGES.map((stage) => {
          const items = grouped[stage];
          return (
            <div
              key={stage}
              className="flex w-72 shrink-0 flex-col rounded-lg border bg-muted/30"
            >
              <div className="flex items-center justify-between border-b bg-background/50 px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{WORKFLOW_STAGE_LABELS[stage]}</span>
                  <span className="rounded-full bg-muted px-1.5 text-xs tabular-nums text-muted-foreground">
                    {items.length}
                  </span>
                </div>
                <button
                  type="button"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  aria-label="Add task"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="flex max-h-[60vh] flex-col gap-2 overflow-y-auto p-2">
                {items.length === 0 ? (
                  <div className="rounded-md border border-dashed py-6 text-center text-xs text-muted-foreground">
                    No tasks
                  </div>
                ) : (
                  items.map((t) => (
                    <WorkflowCard key={t.id} task={t} onClick={() => onCardClick(t)} />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
