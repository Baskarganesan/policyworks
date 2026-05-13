import { StatusBadge } from "@/components/shared/StatusBadge";
import type { DocumentStatus } from "./types";
import { CheckCircle2, Clock, Loader2, AlertCircle } from "lucide-react";

const STATUS_CONFIG: Record<
  DocumentStatus,
  { label: string; tone: "neutral" | "success" | "warning" | "info" | "danger"; Icon: typeof Clock }
> = {
  uploaded: { label: "Uploaded", tone: "neutral", Icon: Clock },
  processing: { label: "Processing", tone: "info", Icon: Loader2 },
  indexed: { label: "Indexed", tone: "success", Icon: CheckCircle2 },
  failed: { label: "Failed", tone: "danger", Icon: AlertCircle },
};

export function DocumentStatusBadge({ status }: { status: DocumentStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <StatusBadge tone={cfg.tone} dot={false}>
      <cfg.Icon className={`h-3 w-3 ${status === "processing" ? "animate-spin" : ""}`} />
      {cfg.label}
    </StatusBadge>
  );
}
