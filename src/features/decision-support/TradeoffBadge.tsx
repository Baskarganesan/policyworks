import {
  Gauge,
  ShieldCheck,
  Scale,
  Smile,
  DollarSign,
  Users,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Tradeoff, TradeoffCategory } from "./types";

const ICON: Record<TradeoffCategory, typeof Gauge> = {
  speed: Gauge,
  risk: ShieldCheck,
  compliance: Scale,
  customer_satisfaction: Smile,
  financial_exposure: DollarSign,
  workload: Users,
  reputation: Sparkles,
};

const CAT_LABEL: Record<TradeoffCategory, string> = {
  speed: "Speed",
  risk: "Risk",
  compliance: "Compliance",
  customer_satisfaction: "Customer",
  financial_exposure: "Exposure",
  workload: "Workload",
  reputation: "Reputation",
};

export function TradeoffBadge({ tradeoff }: { tradeoff: Tradeoff }) {
  const Icon = ICON[tradeoff.category];
  const ImpactIcon =
    tradeoff.impact === "positive"
      ? ArrowUpRight
      : tradeoff.impact === "negative"
      ? ArrowDownRight
      : Minus;
  const tone =
    tradeoff.impact === "positive"
      ? "border-success/30 bg-success/10 text-success-foreground"
      : tradeoff.impact === "negative"
      ? "border-destructive/30 bg-destructive/10 text-destructive-foreground"
      : "border-border bg-muted text-foreground";
  return (
    <span
      title={tradeoff.note}
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px]",
        tone,
      )}
    >
      <Icon className="h-3 w-3" />
      <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
        {CAT_LABEL[tradeoff.category]}
      </span>
      <span className="font-medium">{tradeoff.label}</span>
      <ImpactIcon className="h-3 w-3" />
    </span>
  );
}
