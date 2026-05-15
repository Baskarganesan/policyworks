import { StatusBadge } from "@/components/shared/StatusBadge";
import { STATUS_LABELS, type ClaimStatus } from "./types";

const STATUS_TONE: Record<ClaimStatus, "neutral" | "info" | "warning" | "success" | "danger"> = {
  new: "info",
  under_review: "info",
  pending_documents: "warning",
  approved: "success",
  rejected: "danger",
  closed: "neutral",
};

export function ClaimStatusBadge({ status }: { status: ClaimStatus }) {
  return <StatusBadge tone={STATUS_TONE[status]}>{STATUS_LABELS[status]}</StatusBadge>;
}
