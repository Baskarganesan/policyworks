import { useState } from "react";
import { ChevronDown, ChevronRight, Clock, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { EscalationSeverityBadge, EscalationStatusBadge } from "./EscalationSeverityBadge";
import { OperationalPressureBadge } from "./OperationalPressureBadge";
import { DependencyTracker } from "./DependencyTracker";
import { ConflictResolutionCard } from "./ConflictResolutionCard";
import { ApprovalWorkflowPanel } from "./ApprovalWorkflowPanel";
import { EscalationTimeline } from "./EscalationTimeline";
import { ResolutionActionMenu } from "./ResolutionActionMenu";
import type { ExceptionType, OperationalException } from "./types";

const TYPE_LABEL: Record<ExceptionType, string> = {
  sla_breach: "SLA breach",
  missing_document: "Missing document",
  policy_conflict: "Policy conflict",
  duplicate_claim: "Duplicate claim",
  adjuster_conflict: "Adjuster conflict",
  approval_bottleneck: "Approval bottleneck",
  customer_complaint: "Customer complaint",
  fraud_hold: "Fraud hold",
  compliance_review: "Compliance review",
  settlement_threshold: "Settlement threshold",
};

function formatSLA(iso?: string) {
  if (!iso) return null;
  const ms = new Date(iso).getTime() - Date.now();
  const abs = Math.abs(ms);
  const hrs = Math.round(abs / 3_600_000);
  const fmt = hrs < 48 ? `${hrs}h` : `${Math.round(hrs / 24)}d`;
  return ms < 0 ? `SLA breached by ${fmt}` : `SLA in ${fmt}`;
}

interface Props {
  exception: OperationalException;
  defaultOpen?: boolean;
  compact?: boolean;
}

export function EscalationPanel({ exception, defaultOpen = false, compact = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const slaText = formatSLA(exception.slaDueAt);
  const slaBreached = exception.slaDueAt
    ? new Date(exception.slaDueAt).getTime() < Date.now()
    : false;

  return (
    <article
      className={cn(
        "overflow-hidden rounded-lg border bg-card",
        exception.severity === "critical" && "border-destructive/40",
        exception.severity === "high" && "border-warning/40",
      )}
    >
      <header
        className={cn(
          "relative grid gap-3 p-3",
          compact ? "grid-cols-1" : "lg:grid-cols-[1fr_180px]",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "absolute left-0 top-0 h-full w-0.5",
            exception.severity === "critical"
              ? "bg-destructive"
              : exception.severity === "high"
              ? "bg-warning"
              : exception.severity === "medium"
              ? "bg-info"
              : "bg-border",
          )}
        />
        <div className="min-w-0 space-y-1.5 pl-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-mono text-[10px] text-muted-foreground">{exception.reference}</span>
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
              · {TYPE_LABEL[exception.type]}
            </span>
            <EscalationSeverityBadge severity={exception.severity} />
            <EscalationStatusBadge status={exception.status} />
          </div>
          <h3 className="text-sm font-semibold leading-snug">{exception.title}</h3>
          <p className="text-xs leading-relaxed text-muted-foreground">{exception.summary}</p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <User className="h-3 w-3" />
              <span className="font-medium text-foreground/80">{exception.owner}</span>
              {exception.ownerRole && <span>· {exception.ownerRole}</span>}
            </span>
            {slaText && (
              <span
                className={cn(
                  "inline-flex items-center gap-1",
                  slaBreached && "text-destructive",
                )}
              >
                <Clock className="h-3 w-3" />
                {slaText}
              </span>
            )}
            {exception.dependencies.length > 0 && (
              <span>{exception.dependencies.length} dependency</span>
            )}
            {exception.approvals && exception.approvals.length > 0 && (
              <span>
                {exception.approvals.filter((a) => a.status === "pending").length} pending approval
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 pl-2 lg:items-end lg:pl-0">
          <OperationalPressureBadge
            score={exception.pressureScore}
            ageHours={exception.ageHours}
            compact
          />
          <ResolutionActionMenu actions={exception.recommendedActions} />
        </div>
      </header>

      <div className="border-t bg-muted/30 px-3 py-1.5">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setOpen((v) => !v)}
          className="h-7 w-full justify-between px-2 text-xs"
        >
          <span className="font-medium">{open ? "Hide details" : "View recovery workflow"}</span>
          {open ? (
            <ChevronDown className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>

      {open && (
        <div className="space-y-4 border-t p-3">
          {exception.dependencies.length > 0 && (
            <section className="space-y-1.5">
              <h4 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Dependencies
              </h4>
              <DependencyTracker dependencies={exception.dependencies} />
            </section>
          )}

          {exception.conflict && (
            <section className="space-y-1.5">
              <h4 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Conflicting signals
              </h4>
              <ConflictResolutionCard conflict={exception.conflict} />
            </section>
          )}

          {exception.approvals && exception.approvals.length > 0 && (
            <section className="space-y-1.5">
              <h4 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Approval chain
              </h4>
              <ApprovalWorkflowPanel steps={exception.approvals} />
            </section>
          )}

          <section className="space-y-1.5">
            <h4 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Escalation timeline
            </h4>
            <EscalationTimeline events={exception.timeline} />
          </section>

          {exception.relatedEntities.length > 0 && (
            <section className="space-y-1.5">
              <h4 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Linked entities
              </h4>
              <ul className="flex flex-wrap gap-1.5">
                {exception.relatedEntities.map((r) => (
                  <li
                    key={`${r.type}-${r.id}`}
                    className="inline-flex items-center gap-1 rounded-md border bg-background px-1.5 py-0.5 text-[11px]"
                  >
                    <span className="capitalize text-muted-foreground">{r.type}</span>
                    <span className="font-mono">{r.label}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </article>
  );
}

export function ExceptionsList({ exceptions }: { exceptions: OperationalException[] }) {
  if (exceptions.length === 0) {
    return (
      <div className="rounded-lg border border-dashed bg-card/40 p-4 text-sm text-muted-foreground">
        No active operational exceptions.
      </div>
    );
  }
  const sorted = [...exceptions].sort((a, b) => b.pressureScore - a.pressureScore);
  return (
    <div className="space-y-2">
      {sorted.map((ex, idx) => (
        <EscalationPanel key={ex.id} exception={ex} defaultOpen={idx === 0} />
      ))}
    </div>
  );
}
