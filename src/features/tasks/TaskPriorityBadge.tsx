import { StatusBadge } from "@/components/shared/StatusBadge";
import { TASK_PRIORITY_LABELS, type TaskPriority } from "./types";

const TONE: Record<TaskPriority, "neutral" | "info" | "warning" | "danger"> = {
  low: "neutral",
  medium: "info",
  high: "warning",
  urgent: "danger",
};

export function TaskPriorityBadge({ priority }: { priority: TaskPriority }) {
  return <StatusBadge tone={TONE[priority]}>{TASK_PRIORITY_LABELS[priority]}</StatusBadge>;
}
