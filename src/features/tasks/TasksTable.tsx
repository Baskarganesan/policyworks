import { useState } from "react";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { TaskStatusBadge } from "./TaskStatusBadge";
import { TaskPriorityBadge } from "./TaskPriorityBadge";
import { WORKFLOW_TYPE_LABELS, type Task } from "./types";

type SortKey = "id" | "title" | "dueDate" | "priority" | "updatedAt";
type SortDir = "asc" | "desc";

const PRIORITY_RANK = { low: 0, medium: 1, high: 2, urgent: 3 } as const;

interface Props {
  tasks: Task[];
  selectedIds: Set<string>;
  onSelectedIdsChange: (ids: Set<string>) => void;
  onRowClick: (task: Task) => void;
}

function formatDue(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(d);
  target.setHours(0, 0, 0, 0);
  const diff = Math.round((target.getTime() - today.getTime()) / 86400000);
  const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  if (diff === 0) return { label: `Today · ${label}`, tone: "warning" as const };
  if (diff < 0) return { label: `${Math.abs(diff)}d overdue`, tone: "danger" as const };
  if (diff === 1) return { label: `Tomorrow · ${label}`, tone: "info" as const };
  return { label, tone: "muted" as const };
}

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function TasksTable({ tasks, selectedIds, onSelectedIdsChange, onRowClick }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("dueDate");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const sorted = [...tasks].sort((a, b) => {
    let av: number | string;
    let bv: number | string;
    if (sortKey === "priority") {
      av = PRIORITY_RANK[a.priority];
      bv = PRIORITY_RANK[b.priority];
    } else if (sortKey === "dueDate" || sortKey === "updatedAt") {
      av = new Date(a[sortKey]).getTime();
      bv = new Date(b[sortKey]).getTime();
    } else {
      av = a[sortKey];
      bv = b[sortKey];
    }
    if (av < bv) return sortDir === "asc" ? -1 : 1;
    if (av > bv) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else {
      setSortKey(k);
      setSortDir("asc");
    }
  };

  const allSelected = sorted.length > 0 && sorted.every((t) => selectedIds.has(t.id));
  const someSelected = sorted.some((t) => selectedIds.has(t.id));

  const toggleAll = () => {
    if (allSelected) onSelectedIdsChange(new Set());
    else onSelectedIdsChange(new Set(sorted.map((t) => t.id)));
  };

  const toggleOne = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onSelectedIdsChange(next);
  };

  const SortHeader = ({ k, label }: { k: SortKey; label: string }) => (
    <button
      type="button"
      onClick={() => toggleSort(k)}
      className="inline-flex items-center gap-1 hover:text-foreground"
    >
      {label}
      <ArrowUpDown className="h-3 w-3 opacity-60" />
    </button>
  );

  const dueTone: Record<"warning" | "danger" | "info" | "muted", string> = {
    warning: "text-warning-foreground",
    danger: "text-destructive font-medium",
    info: "text-info",
    muted: "text-muted-foreground",
  };

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead className="w-10 pl-4">
              <Checkbox
                checked={allSelected ? true : someSelected ? "indeterminate" : false}
                onCheckedChange={toggleAll}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead><SortHeader k="id" label="Task" /></TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Related</TableHead>
            <TableHead><SortHeader k="priority" label="Priority" /></TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead><SortHeader k="dueDate" label="Due" /></TableHead>
            <TableHead>Workflow</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((task) => {
            const due = formatDue(task.dueDate);
            const related =
              task.relatedClaim?.reference ?? task.relatedPolicy?.number ?? "—";
            return (
              <TableRow
                key={task.id}
                className="cursor-pointer"
                onClick={() => onRowClick(task)}
                data-state={selectedIds.has(task.id) ? "selected" : undefined}
              >
                <TableCell className="pl-4" onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedIds.has(task.id)}
                    onCheckedChange={() => toggleOne(task.id)}
                    aria-label={`Select ${task.id}`}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium leading-tight">{task.title}</span>
                    <span className="font-mono text-xs text-muted-foreground">{task.id}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{task.relatedCustomer.name}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{related}</TableCell>
                <TableCell><TaskPriorityBadge priority={task.priority} /></TableCell>
                <TableCell><TaskStatusBadge status={task.status} /></TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-[10px] font-medium">
                      {initialsOf(task.assignedTo)}
                    </span>
                    <span className="text-sm">{task.assignedTo}</span>
                  </div>
                </TableCell>
                <TableCell className={cn("text-sm tabular-nums", dueTone[due.tone])}>
                  {due.label}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {WORKFLOW_TYPE_LABELS[task.workflowType]}
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onRowClick(task)}>View details</DropdownMenuItem>
                      <DropdownMenuItem>Reassign</DropdownMenuItem>
                      <DropdownMenuItem>Change status</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">Archive</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
