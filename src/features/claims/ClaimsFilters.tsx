import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  STATUS_LABELS,
  PRIORITY_LABELS,
  CLAIM_TYPE_LABELS,
  type ClaimStatus,
  type ClaimPriority,
  type ClaimType,
} from "./types";
import { MOCK_AGENTS } from "./mockData";

export interface ClaimsFilterState {
  query: string;
  status: ClaimStatus | "all";
  priority: ClaimPriority | "all";
  agent: string | "all";
  claimType: ClaimType | "all";
}

interface ClaimsFiltersProps {
  value: ClaimsFilterState;
  onChange: (next: ClaimsFilterState) => void;
}

export function ClaimsFilters({ value, onChange }: ClaimsFiltersProps) {
  const hasActive =
    value.query ||
    value.status !== "all" ||
    value.priority !== "all" ||
    value.agent !== "all" ||
    value.claimType !== "all";

  const update = <K extends keyof ClaimsFilterState>(key: K, v: ClaimsFilterState[K]) =>
    onChange({ ...value, [key]: v });

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative w-full lg:max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search claim ID, customer, policy…"
          value={value.query}
          onChange={(e) => update("query", e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Select value={value.status} onValueChange={(v) => update("status", v as ClaimStatus | "all")}>
          <SelectTrigger className="h-9 w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {(Object.keys(STATUS_LABELS) as ClaimStatus[]).map((s) => (
              <SelectItem key={s} value={s}>
                {STATUS_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={value.priority}
          onValueChange={(v) => update("priority", v as ClaimPriority | "all")}
        >
          <SelectTrigger className="h-9 w-[140px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All priorities</SelectItem>
            {(Object.keys(PRIORITY_LABELS) as ClaimPriority[]).map((p) => (
              <SelectItem key={p} value={p}>
                {PRIORITY_LABELS[p]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={value.agent} onValueChange={(v) => update("agent", v)}>
          <SelectTrigger className="h-9 w-[170px]">
            <SelectValue placeholder="Agent" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All agents</SelectItem>
            {MOCK_AGENTS.map((a) => (
              <SelectItem key={a} value={a}>
                {a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={value.claimType}
          onValueChange={(v) => update("claimType", v as ClaimType | "all")}
        >
          <SelectTrigger className="h-9 w-[160px]">
            <SelectValue placeholder="Claim type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All claim types</SelectItem>
            {(Object.keys(CLAIM_TYPE_LABELS) as ClaimType[]).map((t) => (
              <SelectItem key={t} value={t}>
                {CLAIM_TYPE_LABELS[t]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActive && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              onChange({
                query: "",
                status: "all",
                priority: "all",
                agent: "all",
                claimType: "all",
              })
            }
          >
            <X className="mr-1 h-3.5 w-3.5" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
