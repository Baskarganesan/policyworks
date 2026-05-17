import { Link } from "@tanstack/react-router";
import {
  Car, Home, HeartPulse, Shield, Briefcase, Umbrella,
  FileText, Sparkles, FilePlus2, RotateCw, ArrowLeft, AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { POLICY_STATUS_LABELS, POLICY_TYPE_LABELS, type Policy, type PolicyStatus } from "./types";
import { daysUntil, formatCurrency, formatDate } from "./utils";

const ICONS = { auto: Car, home: Home, health: HeartPulse, life: Shield, commercial: Briefcase, umbrella: Umbrella } as const;

const STATUS_TONE: Record<PolicyStatus, "success" | "warning" | "danger" | "neutral" | "info"> = {
  active: "success",
  pending_renewal: "warning",
  lapsed: "danger",
  cancelled: "neutral",
  in_review: "info",
};

export function PolicyHeader({ policy }: { policy: Policy }) {
  const Icon = ICONS[policy.type];
  const days = daysUntil(policy.renewalDate);
  const renewalSoon = days >= 0 && days <= 60;
  const highRisks = policy.riskFlags.filter((r) => r.severity === "high" || r.severity === "critical").length;

  return (
    <div className="border-b bg-card">
      <div className="px-6 pt-5">
        <Link
          to="/customers"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to customer
        </Link>
      </div>

      <div className="flex flex-col gap-5 px-6 py-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border bg-muted text-foreground">
            <Icon className="h-5 w-5" />
          </div>
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold tracking-tight">{POLICY_TYPE_LABELS[policy.type]} Policy</h1>
              <span className="font-mono text-sm text-muted-foreground">{policy.policyNumber}</span>
              <StatusBadge tone={STATUS_TONE[policy.status]}>{POLICY_STATUS_LABELS[policy.status]}</StatusBadge>
              {highRisks > 0 && (
                <StatusBadge tone="danger">
                  <AlertTriangle className="h-3 w-3" />
                  {highRisks} risk{highRisks > 1 ? "s" : ""}
                </StatusBadge>
              )}
              {renewalSoon && (
                <StatusBadge tone="warning">Renews in {days}d</StatusBadge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {policy.product} · {policy.carrier}
            </p>
            <p className="text-xs text-muted-foreground">
              Insured: <span className="text-foreground">{policy.insuredAsset}</span> · Policyholder:{" "}
              <span className="text-foreground">{policy.customer.name}</span> · Agent:{" "}
              <span className="text-foreground">{policy.assignedAgent}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm">
            <FileText className="mr-1.5 h-3.5 w-3.5" /> Documents
          </Button>
          <Button variant="outline" size="sm">
            <Sparkles className="mr-1.5 h-3.5 w-3.5" /> AI review
          </Button>
          <Button variant="outline" size="sm">
            <FilePlus2 className="mr-1.5 h-3.5 w-3.5" /> Request endorsement
          </Button>
          <Button size="sm">
            <RotateCw className="mr-1.5 h-3.5 w-3.5" /> Start renewal
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-px border-t bg-border md:grid-cols-3 lg:grid-cols-6">
        <KeyStat label="Effective" value={formatDate(policy.effectiveDate)} />
        <KeyStat label="Renewal" value={formatDate(policy.renewalDate)} hint={renewalSoon ? `in ${days}d` : undefined} hintTone={renewalSoon ? "warning" : undefined} />
        <KeyStat label="Coverage" value={formatCurrency(policy.coverageAmount, { compact: true })} />
        <KeyStat label="Annual premium" value={formatCurrency(policy.annualPremium)} />
        <KeyStat label="Deductible" value={formatCurrency(policy.deductible)} />
        <KeyStat label="Open claims" value={String(policy.claims.filter((c) => c.status !== "closed" && c.status !== "denied").length)} />
      </div>
    </div>
  );
}

function KeyStat({
  label, value, hint, hintTone,
}: { label: string; value: string; hint?: string; hintTone?: "warning" }) {
  return (
    <div className="bg-card px-4 py-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-sm font-semibold">{value}</span>
        {hint && (
          <span className={`text-xs ${hintTone === "warning" ? "text-warning-foreground" : "text-muted-foreground"}`}>
            {hint}
          </span>
        )}
      </div>
    </div>
  );
}
