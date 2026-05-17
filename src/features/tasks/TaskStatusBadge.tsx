import { StatusBadge } from "@/components/shared/StatusBadge";
import { TASK_STATUS_LABELS, type TaskStatus } from "./types";

const TONE: Record<TaskStatus, "neutral" | "info" | "warning" | "danger" | "success"> = {
  open: "neutral",
  in_progress: "info",
  waiting_customer: "warning",
  blocked: "danger",
  completed: "success",
};

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return <StatusBadge tone={TONE[status]}>{TASK_STATUS_LABELS[status]}</StatusBadge>;
}
