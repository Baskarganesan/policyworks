import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import {
  TASK_PRIORITY_LABELS,
  TASK_STATUS_LABELS,
  WORKFLOW_TYPE_LABELS,
  type TaskPriority,
  type TaskStatus,
  type WorkflowType,
} from "./types";
import { AGENT_LIST } from "./mockData";

export interface TasksFilterState {
  query: string;
  status: TaskStatus | "all";
  priority: TaskPriority | "all";
  assignee: string | "all";
  workflowType: WorkflowType | "all";
}

interface Props {
  value: TasksFilterState;
  onChange: (next: TasksFilterState) => void;
}

export function TasksFilters({ value, onChange }: Props) {
  const set = <K extends keyof TasksFilterState>(k: K, v: TasksFilterState[K]) =>
    onChange({ ...value, [k]: v });

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative min-w-[220px] flex-1">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={value.query}
          onChange={(e) => set("query", e.target.value)}
          placeholder="Search tasks, customers, references…"
          className="h-9 pl-8"
        />
      </div>

      <Select value={value.status} onValueChange={(v) => set("status", v as TasksFilterState["status"])}>
        <SelectTrigger className="h-9 w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          {(Object.keys(TASK_STATUS_LABELS) as TaskStatus[]).map((s) => (
            <SelectItem key={s} value={s}>{TASK_STATUS_LABELS[s]}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={value.priority} onValueChange={(v) => set("priority", v as TasksFilterState["priority"])}>
        <SelectTrigger className="h-9 w-[140px]"><SelectValue placeholder="Priority" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All priorities</SelectItem>
          {(Object.keys(TASK_PRIORITY_LABELS) as TaskPriority[]).map((p) => (
            <SelectItem key={p} value={p}>{TASK_PRIORITY_LABELS[p]}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={value.assignee} onValueChange={(v) => set("assignee", v)}>
        <SelectTrigger className="h-9 w-[170px]"><SelectValue placeholder="Assignee" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All assignees</SelectItem>
          {AGENT_LIST.map((a) => (
            <SelectItem key={a} value={a}>{a}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={value.workflowType} onValueChange={(v) => set("workflowType", v as TasksFilterState["workflowType"])}>
        <SelectTrigger className="h-9 w-[180px]"><SelectValue placeholder="Workflow" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All workflows</SelectItem>
          {(Object.keys(WORKFLOW_TYPE_LABELS) as WorkflowType[]).map((w) => (
            <SelectItem key={w} value={w}>{WORKFLOW_TYPE_LABELS[w]}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
