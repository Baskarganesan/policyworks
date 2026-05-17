import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Paperclip,
  User,
  FileText,
  ClipboardList,
  Briefcase,
} from "lucide-react";
import { OperationalInsightsPanel } from "@/features/insights/OperationalInsightsPanel";
import { getInsightsForTask } from "@/features/insights/mockData";
import { TaskPriorityBadge } from "./TaskPriorityBadge";
import { TaskStatusBadge } from "./TaskStatusBadge";
import { ActivityFeed } from "./ActivityFeed";
import {
  TASK_STATUS_LABELS,
  WORKFLOW_TYPE_LABELS,
  type Task,
  type TaskStatus,
} from "./types";

interface Props {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onToggleChecklist: (taskId: string, itemId: string) => void;
  onAddNote: (taskId: string, message: string) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function SectionCard({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <Card className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </h3>
        {action}
      </div>
      {children}
    </Card>
  );
}

function MetaRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof User;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5 text-sm">
      <span className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

export function TaskDetailDrawer({
  task,
  open,
  onOpenChange,
  onStatusChange,
  onToggleChecklist,
  onAddNote,
}: Props) {
  const [note, setNote] = useState("");

  const submitNote = () => {
    if (!task || !note.trim()) return;
    onAddNote(task.id, note.trim());
    setNote("");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-2xl">
        {task && (
          <>
            <SheetHeader className="space-y-3 border-b px-6 pb-4 pt-6">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-muted-foreground">{task.id}</span>
                <span className="text-xs text-muted-foreground">·</span>
                <span className="text-xs text-muted-foreground">
                  {WORKFLOW_TYPE_LABELS[task.workflowType]}
                </span>
              </div>
              <SheetTitle className="pr-8 text-left text-lg leading-snug">
                {task.title}
              </SheetTitle>
              <div className="flex flex-wrap items-center gap-2">
                <TaskPriorityBadge priority={task.priority} />
                <TaskStatusBadge status={task.status} />
              </div>
            </SheetHeader>

            <ScrollArea className="flex-1">
              <div className="space-y-4 px-6 py-5">
                <OperationalInsightsPanel insights={getInsightsForTask(task.id)} compact />

                {/* Description */}
                <SectionCard title="Description">
                  <p className="text-sm leading-relaxed text-foreground/90">
                    {task.description}
                  </p>
                </SectionCard>

                {/* Meta */}
                <SectionCard title="Details">
                  <div className="divide-y">
                    <MetaRow icon={User} label="Assignee" value={task.assignedTo} />
                    <MetaRow icon={Calendar} label="Due date" value={formatDate(task.dueDate)} />
                    <MetaRow
                      icon={Briefcase}
                      label="Customer"
                      value={task.relatedCustomer.name}
                    />
                    {task.relatedClaim && (
                      <MetaRow
                        icon={ClipboardList}
                        label="Claim"
                        value={
                          <span className="font-mono text-xs">{task.relatedClaim.reference}</span>
                        }
                      />
                    )}
                    {task.relatedPolicy && (
                      <MetaRow
                        icon={FileText}
                        label="Policy"
                        value={
                          <span className="font-mono text-xs">{task.relatedPolicy.number}</span>
                        }
                      />
                    )}
                  </div>

                  <div className="mt-3 border-t pt-3">
                    <label className="text-xs text-muted-foreground">Status</label>
                    <Select
                      value={task.status}
                      onValueChange={(v) => onStatusChange(task.id, v as TaskStatus)}
                    >
                      <SelectTrigger className="mt-1 h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(TASK_STATUS_LABELS) as TaskStatus[]).map((s) => (
                          <SelectItem key={s} value={s}>
                            {TASK_STATUS_LABELS[s]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </SectionCard>

                {/* Checklist */}
                <SectionCard
                  title="Checklist"
                  action={
                    task.checklist.length > 0 && (
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {task.checklist.filter((c) => c.done).length}/{task.checklist.length}
                      </span>
                    )
                  }
                >
                  {task.checklist.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No checklist items.</p>
                  ) : (
                    <ul className="space-y-2">
                      {task.checklist.map((item) => (
                        <li key={item.id} className="flex items-start gap-2.5">
                          <Checkbox
                            checked={item.done}
                            onCheckedChange={() => onToggleChecklist(task.id, item.id)}
                            className="mt-0.5"
                          />
                          <span
                            className={
                              item.done
                                ? "text-sm text-muted-foreground line-through"
                                : "text-sm"
                            }
                          >
                            {item.label}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </SectionCard>

                {/* Attachments */}
                <SectionCard title="Attachments">
                  {task.attachments.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No attachments.</p>
                  ) : (
                    <ul className="space-y-1.5">
                      {task.attachments.map((a) => (
                        <li
                          key={a.id}
                          className="flex items-center justify-between rounded-md border bg-muted/30 px-2.5 py-1.5"
                        >
                          <div className="flex items-center gap-2 text-sm">
                            <Paperclip className="h-3.5 w-3.5 text-muted-foreground" />
                            {a.name}
                          </div>
                          <span className="text-xs text-muted-foreground tabular-nums">
                            {a.sizeKb} KB
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </SectionCard>

                {/* Notes */}
                <SectionCard title="Notes">
                  <div className="space-y-3">
                    {task.notes.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No notes yet.</p>
                    ) : (
                      <ul className="space-y-2.5">
                        {task.notes.map((n) => (
                          <li key={n.id} className="rounded-md border bg-muted/30 p-2.5">
                            <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                              <span className="font-medium text-foreground">{n.author}</span>
                              <span>
                                {new Date(n.timestamp).toLocaleString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  hour: "numeric",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                            <p className="text-sm">{n.message}</p>
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="space-y-2">
                      <Textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Add a note…"
                        className="min-h-[70px]"
                      />
                      <div className="flex justify-end">
                        <Button size="sm" onClick={submitNote} disabled={!note.trim()}>
                          Add note
                        </Button>
                      </div>
                    </div>
                  </div>
                </SectionCard>

                {/* Timeline */}
                <SectionCard title="Timeline">
                  <ActivityFeed events={task.timeline} />
                </SectionCard>
              </div>
            </ScrollArea>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
