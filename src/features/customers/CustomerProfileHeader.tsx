import { Mail, Phone, MapPin, UserCog } from "lucide-react";
import { CustomerStatusBadge } from "./CustomerStatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Customer } from "./types";

interface Props {
  customer: Customer;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

const OPEN_CLAIMS = new Set(["new", "under_review", "pending_documents"]);

export function CustomerProfileHeader({ customer }: Props) {
  const openClaims = customer.claims.filter((c) => OPEN_CLAIMS.has(c.status)).length;

  return (
    <div className="space-y-4 border-b pb-5">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-base font-semibold text-primary">
          {initials(customer.fullName)}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold">{customer.fullName}</h2>
            <CustomerStatusBadge status={customer.status} />
            <span className="font-mono text-xs text-muted-foreground">{customer.id}</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />{customer.email}</span>
            <span className="inline-flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />{customer.phone}</span>
          </div>
          <div className="flex items-start gap-1.5 text-sm text-muted-foreground">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{customer.address}</span>
          </div>
        </div>
        <div className="hidden shrink-0 gap-2 sm:flex">
          <Button size="sm" variant="outline">Log interaction</Button>
          <Button size="sm">Edit profile</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Policies" value={customer.policies.length.toString()} />
        <Stat label="Open claims" value={openClaims.toString()} tone={openClaims > 0 ? "warn" : "default"} />
        <Stat label="Lifetime value" value={formatCurrency(customer.lifetimeValue)} />
        <Stat
          label="Agent"
          value={customer.assignedAgent}
          icon={<UserCog className="h-3.5 w-3.5" />}
        />
      </div>

      {customer.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {customer.tags.map((t) => (
            <Badge key={t} variant="secondary" className="font-normal">
              {t}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  tone = "default",
  icon,
}: {
  label: string;
  value: string;
  tone?: "default" | "warn";
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
      <div
        className={`mt-1 truncate text-sm font-semibold ${
          tone === "warn" ? "text-destructive" : "text-foreground"
        }`}
      >
        {icon ? (
          <span className="inline-flex items-center gap-1.5">
            {icon}
            {value}
          </span>
        ) : (
          value
        )}
      </div>
    </div>
  );
}
