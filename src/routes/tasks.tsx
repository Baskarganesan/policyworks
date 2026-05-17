import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  CalendarClock,
  ClipboardCheck,
  Download,
  FileWarning,
  ListChecks,
  Plus,
  SearchX,
  UserCheck,
} from "lucide-react";
import { ContentContainer } from "@/components/layout/ContentContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { KPIStatCard } from "@/features/tasks/KPIStatCard";
import { TasksFilters, type TasksFilterState } from "@/features/tasks/TasksFilters";
import { TasksTable } from "@/features/tasks/TasksTable";
import { WorkflowBoard } from "@/features/tasks/WorkflowBoard";
import { TaskDetailDrawer } from "@/features/tasks/TaskDetailDrawer";
import { ActivityFeed } from "@/features/tasks/ActivityFeed";
import { WorkflowAutomationCard } from "@/features/tasks/WorkflowAutomationCard";
import {
  MOCK_TASKS,
  MOCK_ACTIVITY,
  MOCK_AUTOMATIONS,
} from "@/features/tasks/mockData";
import type { Task, TaskNote, TaskStatus, WorkflowEvent } from "@/features/tasks/types";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "Tasks & Workflows — Policyworks" },
      {
        name: "description",
        content:
          "Coordinate insurance operations across claims, customers, policies, and documents.",
      },
    ],
  }),
  component: TasksPage,
});

const PAGE_SIZE = 8;

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [activity, setActivity] = useState<WorkflowEvent[]>(MOCK_ACTIVITY);

  const [filters, setFilters] = useState<TasksFilterState>({
    query: "",
    status: "all",
    priority: "all",
    assignee: "all",
    workflowType: "all",
  });
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [view, setView] = useState<"table" | "board">("table");

  const kpis = useMemo(() => {
    const today = startOfToday();
    const overdue = tasks.filter(
      (t) => t.status !== "completed" && new Date(t.dueDate).getTime() < today,
    ).length;
    const dueToday = tasks.filter((t) => {
      const d = new Date(t.dueDate);
      d.setHours(0, 0, 0, 0);
      return t.status !== "completed" && d.getTime() === today;
    }).length;
    const awaitingReview = tasks.filter(
      (t) => t.relatedClaim && (t.workflowStage === "review" || t.workflowStage === "approval"),
    ).length;
    const missingDocs = tasks.filter(
      (t) => t.workflowStage === "pending_docs" || t.status === "waiting_customer",
    ).length;
    const pendingCustomer = tasks.filter((t) => t.status === "waiting_customer").length;
    return { overdue, dueToday, awaitingReview, missingDocs, pendingCustomer };
  }, [tasks]);

  const filtered = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    return tasks.filter((t) => {
      if (filters.status !== "all" && t.status !== filters.status) return false;
      if (filters.priority !== "all" && t.priority !== filters.priority) return false;
      if (filters.assignee !== "all" && t.assignedTo !== filters.assignee) return false;
      if (filters.workflowType !== "all" && t.workflowType !== filters.workflowType) return false;
      if (q) {
        const hay = [
          t.id,
          t.title,
          t.description,
          t.relatedCustomer.name,
          t.relatedClaim?.reference ?? "",
          t.relatedPolicy?.number ?? "",
        ]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [tasks, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const upcoming = useMemo(
    () =>
      [...tasks]
        .filter((t) => t.status !== "completed")
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .slice(0, 5),
    [tasks],
  );

  const activeTask = tasks.find((t) => t.id === activeId) ?? null;

  const openTask = (t: Task) => {
    setActiveId(t.id);
    setDrawerOpen(true);
  };

  const handleStatusChange = (taskId: string, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status, updatedAt: new Date().toISOString() } : t)),
    );
    setActivity((prev) => [
      {
        id: `e-${Date.now()}`,
        type: "status_changed",
        timestamp: new Date().toISOString(),
        actor: "You",
        description: `Moved ${taskId} to ${status.replace(/_/g, " ")}`,
        taskId,
      },
      ...prev,
    ]);
  };

  const handleToggleChecklist = (taskId: string, itemId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              checklist: t.checklist.map((c) =>
                c.id === itemId ? { ...c, done: !c.done } : c,
              ),
            }
          : t,
      ),
    );
  };

  const handleAddNote = (taskId: string, message: string) => {
    const note: TaskNote = {
      id: `n-${Date.now()}`,
      author: "You",
      message,
      timestamp: new Date().toISOString(),
    };
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, notes: [note, ...t.notes] } : t)),
    );
    setActivity((prev) => [
      {
        id: `e-${Date.now()}`,
        type: "comment_added",
        timestamp: new Date().toISOString(),
        actor: "You",
        description: `Commented on ${taskId}`,
        taskId,
      },
      ...prev,
    ]);
  };

  const hasResults = filtered.length > 0;

  return (
    <ContentContainer>
      <div className="sticky top-14 z-10 -mx-4 -mt-6 border-b bg-background/95 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <PageHeader
          className="border-b-0 pb-0"
          title="Tasks & Workflows"
          description={
            selectedIds.size > 0
              ? `${selectedIds.size} selected`
              : `${filtered.length} of ${tasks.length} tasks across the operations queue`
          }
          actions={
            <>
              {selectedIds.size > 0 && (
                <>
                  <Button variant="outline" size="sm">Reassign</Button>
                  <Button variant="outline" size="sm">Change status</Button>
                </>
              )}
              <Button variant="outline" size="sm">
                <Download className="mr-1.5 h-3.5 w-3.5" />
                Export
              </Button>
              <Button size="sm">
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                New task
              </Button>
            </>
          }
        />
      </div>

      {/* KPI strip */}
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        <KPIStatCard
          label="Overdue"
          value={kpis.overdue}
          icon={AlertTriangle}
          tone="danger"
          delta={12}
          hint="Past due date"
        />
        <KPIStatCard
          label="Due today"
          value={kpis.dueToday}
          icon={CalendarClock}
          tone="warning"
          delta={-3}
          hint="Resolve before EOD"
        />
        <KPIStatCard
          label="Claims awaiting review"
          value={kpis.awaitingReview}
          icon={ClipboardCheck}
          tone="info"
          delta={5}
          hint="In review or approval"
        />
        <KPIStatCard
          label="Missing documents"
          value={kpis.missingDocs}
          icon={FileWarning}
          tone="warning"
          delta={-8}
          hint="Pending doc requests"
        />
        <KPIStatCard
          label="Pending customer actions"
          value={kpis.pendingCustomer}
          icon={UserCheck}
          tone="neutral"
          delta={2}
          hint="Awaiting response"
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_320px]">
        {/* Left: tabs + content */}
        <div className="min-w-0 space-y-4">
          <Tabs value={view} onValueChange={(v) => setView(v as typeof view)}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <TabsList>
                <TabsTrigger value="table">List</TabsTrigger>
                <TabsTrigger value="board">Workflow board</TabsTrigger>
              </TabsList>
            </div>

            <div className="mt-4 space-y-4">
              <TasksFilters
                value={filters}
                onChange={(next) => {
                  setFilters(next);
                  setPage(1);
                }}
              />

              <TabsContent value="table" className="m-0">
                {!hasResults ? (
                  <EmptyState
                    icon={<SearchX className="h-5 w-5" />}
                    title="No matching tasks"
                    description="Try adjusting your filters or search to find what you're looking for."
                  />
                ) : (
                  <>
                    <TasksTable
                      tasks={pageItems}
                      selectedIds={selectedIds}
                      onSelectedIdsChange={setSelectedIds}
                      onRowClick={openTask}
                    />
                    {totalPages > 1 && (
                      <Pagination className="mt-4">
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() => setPage((p) => Math.max(1, p - 1))}
                              className={
                                currentPage === 1
                                  ? "pointer-events-none opacity-50"
                                  : "cursor-pointer"
                              }
                            />
                          </PaginationItem>
                          {Array.from({ length: totalPages }).map((_, i) => (
                            <PaginationItem key={i}>
                              <PaginationLink
                                isActive={currentPage === i + 1}
                                onClick={() => setPage(i + 1)}
                                className="cursor-pointer"
                              >
                                {i + 1}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          <PaginationItem>
                            <PaginationNext
                              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                              className={
                                currentPage === totalPages
                                  ? "pointer-events-none opacity-50"
                                  : "cursor-pointer"
                              }
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    )}
                  </>
                )}
              </TabsContent>

              <TabsContent value="board" className="m-0">
                {!hasResults ? (
                  <EmptyState
                    icon={<ListChecks className="h-5 w-5" />}
                    title="No tasks on the board"
                    description="Adjust your filters or create a new task to populate the workflow."
                  />
                ) : (
                  <WorkflowBoard tasks={filtered} onCardClick={openTask} />
                )}
              </TabsContent>
            </div>
          </Tabs>

          {/* Automations */}
          <section className="space-y-3 pt-2">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-sm font-semibold">Suggested automations</h2>
                <p className="text-xs text-muted-foreground">
                  Operational rules that can be enabled to reduce manual work.
                </p>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {MOCK_AUTOMATIONS.map((a) => (
                <WorkflowAutomationCard key={a.id} suggestion={a} />
              ))}
            </div>
          </section>
        </div>

        {/* Right: sidebar panels */}
        <aside className="space-y-4">
          <Card className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold">Upcoming deadlines</h3>
              <span className="text-xs text-muted-foreground">Next 5</span>
            </div>
            {upcoming.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nothing on the horizon.</p>
            ) : (
              <ul className="space-y-2">
                {upcoming.map((t) => {
                  const due = new Date(t.dueDate);
                  const today = startOfToday();
                  const d = new Date(t.dueDate);
                  d.setHours(0, 0, 0, 0);
                  const overdue = d.getTime() < today;
                  return (
                    <li key={t.id}>
                      <button
                        type="button"
                        onClick={() => openTask(t)}
                        className="flex w-full items-start justify-between gap-3 rounded-md border bg-card px-2.5 py-2 text-left transition-colors hover:bg-muted/40"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{t.title}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {t.relatedCustomer.name}
                          </p>
                        </div>
                        <span
                          className={
                            overdue
                              ? "shrink-0 text-xs font-medium text-destructive tabular-nums"
                              : "shrink-0 text-xs text-muted-foreground tabular-nums"
                          }
                        >
                          {due.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>

          <Card className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold">Activity</h3>
              <button type="button" className="text-xs text-muted-foreground hover:text-foreground">
                View all
              </button>
            </div>
            <ActivityFeed events={activity.slice(0, 8)} />
          </Card>
        </aside>
      </div>

      <TaskDetailDrawer
        task={activeTask}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onStatusChange={handleStatusChange}
        onToggleChecklist={handleToggleChecklist}
        onAddNote={handleAddNote}
      />
    </ContentContainer>
  );
}
