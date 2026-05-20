import {
  Briefcase,
  ShieldAlert,
  UserPlus,
  FileUp,
  Sparkles,
  ListPlus,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { SLAIndicator } from "./SLAIndicator";
import type { CaseRecord, CaseSeverity, CaseStatus } from "./types";

const SEVERITY_TONE: Record<CaseSeverity, "danger" | "warning" | "info" | "neutral"> = {
  critical: "danger",
  high: "warning",
  medium: "info",
  low: "neutral",
};

const STATUS_TONE: Record<CaseStatus, "success" | "warning" | "danger" | "info" | "neutral"> = {
  open: "info",
  in_review: "info",
  blocked: "warning",
  escalated: "danger",
  resolved: "success",
  closed: "neutral",
};

const STATUS_LABEL: Record<CaseStatus, string> = {
  open: "Open",
  in_review: "In review",
  blocked: "Blocked",
  escalated: "Escalated",
  resolved: "Resolved",
  closed: "Closed",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function CaseSummaryHeader({ record }: { record: CaseRecord }) {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1 font-mono">
                <Briefcase className="h-3 w-3" />
                {record.reference}
              </span>
              <span>·</span>
              <StatusBadge tone={SEVERITY_TONE[record.severity]}>
                {record.severity.toUpperCase()} severity
              </StatusBadge>
              <StatusBadge tone={STATUS_TONE[record.status]}>{STATUS_LABEL[record.status]}</StatusBadge>
              {record.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-accent/60 px-1.5 py-0.5 text-[10px] font-medium text-accent-foreground"
                >
                  {t}
                </span>
              ))}
            </div>

            <h1 className="text-xl font-semibold leading-tight tracking-tight sm:text-2xl">
              {record.title}
            </h1>
            <p className="max-w-3xl text-sm text-muted-foreground">{record.summary}</p>

            <div className="grid grid-cols-2 gap-x-6 gap-y-2 pt-1 text-xs sm:grid-cols-4">
              <Field label="Assigned team" value={record.assignedTeam} />
              <Field label="Lead" value={record.assignedLead ?? "Unassigned"} />
              <Field label="Customer" value={record.relatedCustomer.label} mono />
              <Field label="Created" value={formatDate(record.createdAt)} />
              <Field
                label="Policies"
                value={record.relatedPolicies.map((p) => p.label).join(", ") || "—"}
                mono
              />
              <Field
                label="Claims"
                value={record.relatedClaims.map((c) => c.label).join(", ") || "—"}
                mono
              />
              <Field label="Documents" value={`${record.documents.length} on file`} />
              <Field label="Open tasks" value={`${record.tasks.filter((t) => t.status !== "done").length}`} />
            </div>
          </div>

          <div className="flex w-full shrink-0 flex-col gap-3 lg:w-72">
            <div className="rounded-lg border bg-card p-3">
              <SLAIndicator sla={record.sla} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" variant="default" className="h-8 gap-1.5 text-xs">
                <ChevronUp className="h-3.5 w-3.5" /> Escalate
              </Button>
              <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs">
                <UserPlus className="h-3.5 w-3.5" /> Assign
              </Button>
              <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs">
                <FileUp className="h-3.5 w-3.5" /> Request docs
              </Button>
              <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs">
                <Sparkles className="h-3.5 w-3.5" /> AI review
              </Button>
              <Button size="sm" variant="outline" className="col-span-2 h-8 gap-1.5 text-xs">
                <ListPlus className="h-3.5 w-3.5" /> Create task
              </Button>
            </div>
            {record.severity === "critical" && (
              <p className="inline-flex items-center gap-1.5 rounded-md bg-destructive/10 px-2 py-1 text-[11px] text-destructive">
                <ShieldAlert className="h-3 w-3" /> Critical-severity case — coordinate before payout
              </p>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="min-w-0">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className={mono ? "truncate font-mono text-xs" : "truncate font-medium"}>{value}</div>
    </div>
  );
}
