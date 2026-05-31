import { CheckCircle2, AlertTriangle, CircleSlash, Handshake, Scale, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import type { HistoricalCase, HistoricalOutcome, ResolutionPath } from "./types";

const OUTCOME_META: Record<HistoricalOutcome, { label: string; tone: string; Icon: typeof CheckCircle2 }> = {
  resolved_standard: { label: "Resolved", tone: "text-success", Icon: CheckCircle2 },
  resolved_supervisor: { label: "Resolved via supervisor", tone: "text-info", Icon: Scale },
  resolved_legal: { label: "Resolved via legal", tone: "text-info", Icon: Scale },
  settled_partial: { label: "Partial settlement", tone: "text-warning", Icon: Handshake },
  denied: { label: "Denied", tone: "text-destructive", Icon: CircleSlash },
  withdrawn: { label: "Withdrawn", tone: "text-muted-foreground", Icon: CircleSlash },
  escalated_unresolved: { label: "Escalated, unresolved", tone: "text-destructive", Icon: AlertTriangle },
};

const PATH_LABEL: Record<ResolutionPath, string> = {
  standard_workflow: "Standard workflow",
  supervisor_review: "Supervisor review",
  legal_review: "Legal review",
  underwriting_review: "Underwriting review",
  compliance_review: "Compliance review",
  field_investigation: "Field investigation",
  negotiated_settlement: "Negotiated settlement",
};

export function HistoricalOutcomeCard({ record }: { record: HistoricalCase }) {
  const meta = OUTCOME_META[record.outcome];
  const Icon = meta.Icon;
  return (
    <div className="rounded-md border bg-card p-2.5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-mono text-[10px] text-muted-foreground">{record.reference}</p>
          <p className="text-sm font-medium leading-snug">{record.title}</p>
        </div>
        <span className={cn("inline-flex shrink-0 items-center gap-1 text-[11px] font-medium", meta.tone)}>
          <Icon className="h-3.5 w-3.5" />
          {meta.label}
        </span>
      </div>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{record.outcomeSummary}</p>
      <p className="mt-1 text-[11px] italic leading-relaxed text-muted-foreground">
        Rationale: {record.rationaleSummary}
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] uppercase tracking-wide text-muted-foreground">
        <span>{PATH_LABEL[record.resolutionPath]}</span>
        <span>· {record.timeToResolutionDays}d to resolve</span>
        {record.auditReference && (
          <span className="inline-flex items-center gap-1">
            <FileText className="h-3 w-3" />
            {record.auditReference}
          </span>
        )}
      </div>
    </div>
  );
}
