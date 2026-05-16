import { Car, Home, HeartPulse, Shield, Briefcase, Umbrella } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  POLICY_TYPE_LABELS,
  POLICY_STATUS_LABELS,
  type CustomerPolicy,
} from "./types";

const ICONS = {
  auto: Car,
  home: Home,
  health: HeartPulse,
  life: Shield,
  commercial: Briefcase,
  umbrella: Umbrella,
} as const;

const STATUS_TONE: Record<CustomerPolicy["status"], string> = {
  active: "bg-success/10 text-success",
  pending_renewal: "bg-warning/15 text-warning-foreground",
  lapsed: "bg-destructive/10 text-destructive",
  cancelled: "bg-muted text-muted-foreground",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

function daysUntil(iso: string) {
  const ms = new Date(iso).getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export function PolicyCard({ policy }: { policy: CustomerPolicy }) {
  const Icon = ICONS[policy.type];
  const days = daysUntil(policy.renewalDate);
  const renewalSoon = days >= 0 && days <= 30;

  return (
    <div className="group rounded-lg border bg-card p-4 transition-colors hover:border-foreground/20">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">{POLICY_TYPE_LABELS[policy.type]}</span>
              <span className="font-mono text-xs text-muted-foreground">{policy.policyNumber}</span>
            </div>
            <div className="text-xs text-muted-foreground">{policy.provider}</div>
          </div>
        </div>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_TONE[policy.status]}`}>
          {POLICY_STATUS_LABELS[policy.status]}
        </span>
      </div>

      <p className="mt-3 text-sm text-muted-foreground">{policy.coverageSummary}</p>

      <div className="mt-3 grid grid-cols-3 gap-3 border-t pt-3 text-xs">
        <div>
          <div className="text-muted-foreground">Premium</div>
          <div className="font-medium text-foreground">{formatCurrency(policy.premium)}/yr</div>
        </div>
        <div>
          <div className="text-muted-foreground">Coverage</div>
          <div className="font-medium text-foreground">{formatCurrency(policy.coverageLimit)}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Renews</div>
          <div className={`font-medium ${renewalSoon ? "text-warning-foreground" : "text-foreground"}`}>
            {formatDate(policy.renewalDate)}
            {renewalSoon && <span className="ml-1 text-muted-foreground">({days}d)</span>}
          </div>
        </div>
      </div>

      <div className="mt-3 flex justify-end">
        <Button variant="ghost" size="sm" className="h-7 text-xs">
          View policy
        </Button>
      </div>
    </div>
  );
}
