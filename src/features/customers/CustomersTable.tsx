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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CustomerStatusBadge } from "./CustomerStatusBadge";
import type { Customer } from "./types";

type SortKey = "fullName" | "policies" | "openClaims" | "lastInteractionAt";
type SortDir = "asc" | "desc";

interface Props {
  customers: Customer[];
  selectedIds: Set<string>;
  onSelectedIdsChange: (ids: Set<string>) => void;
  onRowClick: (customer: Customer) => void;
}

const OPEN_CLAIM_STATUSES = new Set(["new", "under_review", "pending_documents"]);

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function CustomersTable({ customers, selectedIds, onSelectedIdsChange, onRowClick }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("lastInteractionAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const openClaimCount = (c: Customer) =>
    c.claims.filter((cl) => OPEN_CLAIM_STATUSES.has(cl.status)).length;

  const sorted = [...customers].sort((a, b) => {
    let av: number | string;
    let bv: number | string;
    if (sortKey === "policies") {
      av = a.policies.length;
      bv = b.policies.length;
    } else if (sortKey === "openClaims") {
      av = openClaimCount(a);
      bv = openClaimCount(b);
    } else if (sortKey === "lastInteractionAt") {
      av = new Date(a.lastInteractionAt).getTime();
      bv = new Date(b.lastInteractionAt).getTime();
    } else {
      av = a.fullName;
      bv = b.fullName;
    }
    if (av < bv) return sortDir === "asc" ? -1 : 1;
    if (av > bv) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else {
      setSortKey(k);
      setSortDir("desc");
    }
  };

  const allSelected = sorted.length > 0 && sorted.every((c) => selectedIds.has(c.id));
  const someSelected = sorted.some((c) => selectedIds.has(c.id));

  const toggleAll = () => {
    if (allSelected) onSelectedIdsChange(new Set());
    else onSelectedIdsChange(new Set(sorted.map((c) => c.id)));
  };
  const toggleOne = (id: string) => {
    const n = new Set(selectedIds);
    n.has(id) ? n.delete(id) : n.add(id);
    onSelectedIdsChange(n);
  };

  const SortHeader = ({ k, label, align }: { k: SortKey; label: string; align?: "right" }) => (
    <button
      type="button"
      onClick={() => toggleSort(k)}
      className={`inline-flex items-center gap-1 hover:text-foreground ${align === "right" ? "ml-auto" : ""}`}
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
            <TableHead><SortHeader k="fullName" label="Customer" /></TableHead>
            <TableHead>Contact</TableHead>
            <TableHead className="text-center"><SortHeader k="policies" label="Policies" /></TableHead>
            <TableHead className="text-center"><SortHeader k="openClaims" label="Open claims" /></TableHead>
            <TableHead>Agent</TableHead>
            <TableHead><SortHeader k="lastInteractionAt" label="Last interaction" /></TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((c) => {
            const open = openClaimCount(c);
            return (
              <TableRow
                key={c.id}
                className="cursor-pointer"
                onClick={() => onRowClick(c)}
                data-state={selectedIds.has(c.id) ? "selected" : undefined}
              >
                <TableCell className="pl-4" onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedIds.has(c.id)}
                    onCheckedChange={() => toggleOne(c.id)}
                    aria-label={`Select ${c.fullName}`}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                      {initials(c.fullName)}
                    </div>
                    <div>
                      <div className="font-medium">{c.fullName}</div>
                      <div className="font-mono text-xs text-muted-foreground">{c.id}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{c.email}</div>
                  <div className="text-xs text-muted-foreground">{c.phone}</div>
                </TableCell>
                <TableCell className="text-center tabular-nums">{c.policies.length}</TableCell>
                <TableCell className="text-center tabular-nums">
                  {open > 0 ? (
                    <span className="inline-flex min-w-[1.5rem] items-center justify-center rounded-full bg-destructive/10 px-2 text-xs font-medium text-destructive">
                      {open}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">0</span>
                  )}
                </TableCell>
                <TableCell className="text-sm">{c.assignedAgent}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(c.lastInteractionAt)}
                </TableCell>
                <TableCell><CustomerStatusBadge status={c.status} /></TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onRowClick(c)}>View profile</DropdownMenuItem>
                      <DropdownMenuItem>Log interaction</DropdownMenuItem>
                      <DropdownMenuItem>Reassign agent</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
