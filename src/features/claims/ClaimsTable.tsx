import { useState } from "react";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ClaimStatusBadge } from "./ClaimStatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import { POLICY_TYPE_LABELS, CLAIM_TYPE_LABELS, type Claim } from "./types";

type SortKey = "id" | "customerName" | "amount" | "updatedAt" | "priority";
type SortDir = "asc" | "desc";

interface ClaimsTableProps {
  claims: Claim[];
  selectedIds: Set<string>;
  onSelectedIdsChange: (ids: Set<string>) => void;
  onRowClick: (claim: Claim) => void;
}

const PRIORITY_RANK = { low: 0, medium: 1, high: 2, urgent: 3 } as const;

function formatAmount(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ClaimsTable({
  claims,
  selectedIds,
  onSelectedIdsChange,
  onRowClick,
}: ClaimsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("updatedAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const sorted = [...claims].sort((a, b) => {
    let av: number | string;
    let bv: number | string;
    if (sortKey === "priority") {
      av = PRIORITY_RANK[a.priority];
      bv = PRIORITY_RANK[b.priority];
    } else if (sortKey === "amount") {
      av = a.amount;
      bv = b.amount;
    } else if (sortKey === "updatedAt") {
      av = new Date(a.updatedAt).getTime();
      bv = new Date(b.updatedAt).getTime();
    } else {
      av = a[sortKey];
      bv = b[sortKey];
    }
    if (av < bv) return sortDir === "asc" ? -1 : 1;
    if (av > bv) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const allSelected = sorted.length > 0 && sorted.every((c) => selectedIds.has(c.id));
  const someSelected = sorted.some((c) => selectedIds.has(c.id));

  const toggleAll = () => {
    if (allSelected) {
      onSelectedIdsChange(new Set());
    } else {
      onSelectedIdsChange(new Set(sorted.map((c) => c.id)));
    }
  };

  const toggleOne = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onSelectedIdsChange(next);
  };

  const SortHeader = ({ k, label, align }: { k: SortKey; label: string; align?: "right" }) => (
    <button
      type="button"
      onClick={() => toggleSort(k)}
      className={`inline-flex items-center gap-1 hover:text-foreground ${
        align === "right" ? "ml-auto" : ""
      }`}
    >
      {label}
      <ArrowUpDown className="h-3 w-3 opacity-60" />
    </button>
  );

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead className="w-10 pl-4">
              <Checkbox
                checked={allSelected ? true : someSelected ? "indeterminate" : false}
                onCheckedChange={toggleAll}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead><SortHeader k="id" label="Claim ID" /></TableHead>
            <TableHead><SortHeader k="customerName" label="Customer" /></TableHead>
            <TableHead>Policy</TableHead>
            <TableHead>Claim Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead><SortHeader k="priority" label="Priority" /></TableHead>
            <TableHead>Assigned</TableHead>
            <TableHead><SortHeader k="updatedAt" label="Updated" /></TableHead>
            <TableHead className="text-right"><SortHeader k="amount" label="Amount" align="right" /></TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((claim) => (
            <TableRow
              key={claim.id}
              className="cursor-pointer"
              onClick={() => onRowClick(claim)}
              data-state={selectedIds.has(claim.id) ? "selected" : undefined}
            >
              <TableCell className="pl-4" onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={selectedIds.has(claim.id)}
                  onCheckedChange={() => toggleOne(claim.id)}
                  aria-label={`Select ${claim.id}`}
                />
              </TableCell>
              <TableCell className="font-mono text-xs font-medium">{claim.id}</TableCell>
              <TableCell>
                <div className="font-medium">{claim.customerName}</div>
                <div className="text-xs text-muted-foreground">{claim.customerEmail}</div>
              </TableCell>
              <TableCell className="text-sm">{POLICY_TYPE_LABELS[claim.policyType]}</TableCell>
              <TableCell className="text-sm">{CLAIM_TYPE_LABELS[claim.claimType]}</TableCell>
              <TableCell><ClaimStatusBadge status={claim.status} /></TableCell>
              <TableCell><PriorityBadge priority={claim.priority} /></TableCell>
              <TableCell className="text-sm">{claim.assignedAgent}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(claim.updatedAt)}
              </TableCell>
              <TableCell className="text-right font-medium tabular-nums">
                {formatAmount(claim.amount)}
              </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onRowClick(claim)}>
                      View details
                    </DropdownMenuItem>
                    <DropdownMenuItem>Reassign</DropdownMenuItem>
                    <DropdownMenuItem>Change status</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">Archive</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
