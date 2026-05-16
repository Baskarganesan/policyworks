import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { ClipboardList } from "lucide-react";
import type { CustomerClaimSummary } from "./types";

const STATUS_LABELS: Record<CustomerClaimSummary["status"], string> = {
  new: "New",
  under_review: "Under Review",
  pending_documents: "Pending Docs",
  approved: "Approved",
  rejected: "Rejected",
  closed: "Closed",
};

const STATUS_TONE: Record<CustomerClaimSummary["status"], string> = {
  new: "bg-info/10 text-info",
  under_review: "bg-warning/15 text-warning-foreground",
  pending_documents: "bg-warning/15 text-warning-foreground",
  approved: "bg-success/10 text-success",
  rejected: "bg-destructive/10 text-destructive",
  closed: "bg-muted text-muted-foreground",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

export function ClaimsHistoryList({ claims }: { claims: CustomerClaimSummary[] }) {
  if (claims.length === 0) {
    return (
      <EmptyState
        icon={<ClipboardList className="h-5 w-5" />}
        title="No claims on file"
        description="This customer has no claim history. New filings will appear here."
        className="bg-card"
      />
    );
  }

  return (
    <div className="divide-y rounded-lg border bg-card">
      {claims.map((c) => (
        <div key={c.id} className="flex items-center gap-3 p-3 hover:bg-muted/40">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-medium">{c.id}</span>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_TONE[c.status]}`}>
                {STATUS_LABELS[c.status]}
              </span>
              <span className="text-sm">{c.type}</span>
            </div>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">{c.description}</p>
          </div>
          <div className="hidden text-right sm:block">
            <div className="text-sm font-medium tabular-nums">{formatCurrency(c.amount)}</div>
            <div className="text-xs text-muted-foreground">Filed {formatDate(c.filedAt)}</div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
