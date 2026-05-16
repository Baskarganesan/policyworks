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
import { CUSTOMER_STATUS_LABELS, type CustomerStatus } from "./types";
import { MOCK_AGENTS } from "./mockData";

export interface CustomersFilterState {
  query: string;
  status: CustomerStatus | "all";
  agent: string | "all";
}

interface Props {
  value: CustomersFilterState;
  onChange: (next: CustomersFilterState) => void;
}

export function CustomersFilters({ value, onChange }: Props) {
  const hasActive = value.query || value.status !== "all" || value.agent !== "all";
  const update = <K extends keyof CustomersFilterState>(k: K, v: CustomersFilterState[K]) =>
    onChange({ ...value, [k]: v });

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative w-full lg:max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search name, email, phone, policy…"
          value={value.query}
          onChange={(e) => update("query", e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Select value={value.status} onValueChange={(v) => update("status", v as CustomerStatus | "all")}>
          <SelectTrigger className="h-9 w-[170px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {(Object.keys(CUSTOMER_STATUS_LABELS) as CustomerStatus[]).map((s) => (
              <SelectItem key={s} value={s}>
                {CUSTOMER_STATUS_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={value.agent} onValueChange={(v) => update("agent", v)}>
          <SelectTrigger className="h-9 w-[180px]">
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
        {hasActive && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChange({ query: "", status: "all", agent: "all" })}
          >
            <X className="mr-1 h-3.5 w-3.5" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
