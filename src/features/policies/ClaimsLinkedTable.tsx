import { ArrowUpRight, Search } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import type { PolicyClaimRef } from "./types";
import { formatCurrency, formatDate } from "./utils";

const STATUS_TONE = {
  open: "info",
  under_review: "warning",
  approved: "success",
  denied: "danger",
  closed: "neutral",
} as const;

const STATUS_LABEL = {
  open: "Open",
  under_review: "Under review",
  approved: "Approved",
  denied: "Denied",
  closed: "Closed",
} as const;

export function ClaimsLinkedTable({ claims }: { claims: PolicyClaimRef[] }) {
  if (claims.length === 0) {
    return (
      <EmptyState
        icon={<Search className="h-5 w-5" />}
        title="No claims on this policy"
        description="No claim activity has been linked. New claims will appear here automatically."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <table className="w-full text-sm">
        <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-3 py-2 text-left font-medium">Claim</th>
            <th className="px-3 py-2 text-left font-medium">Type</th>
            <th className="px-3 py-2 text-left font-medium">Filed</th>
            <th className="px-3 py-2 text-right font-medium">Amount</th>
            <th className="px-3 py-2 text-left font-medium">Status</th>
            <th className="px-3 py-2" />
          </tr>
        </thead>
        <tbody className="divide-y">
          {claims.map((c) => (
            <tr key={c.id} className="hover:bg-muted/30">
              <td className="px-3 py-2 font-mono text-xs">{c.claimNumber}</td>
              <td className="px-3 py-2">
                <div className="flex items-center gap-2">
                  <span>{c.type}</span>
                  {c.investigation && (
                    <span className="rounded bg-warning/15 px-1.5 py-0.5 text-[10px] font-medium text-warning-foreground">
                      Investigation
                    </span>
                  )}
                </div>
              </td>
              <td className="px-3 py-2 text-muted-foreground">{formatDate(c.filedAt)}</td>
              <td className="px-3 py-2 text-right tabular-nums">{formatCurrency(c.amount)}</td>
              <td className="px-3 py-2">
                <StatusBadge tone={STATUS_TONE[c.status]}>{STATUS_LABEL[c.status]}</StatusBadge>
              </td>
              <td className="px-3 py-2 text-right">
                <button className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                  Open <ArrowUpRight className="h-3 w-3" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
