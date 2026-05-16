import { Sparkles, AlertTriangle, AlertOctagon, Lightbulb, Info } from "lucide-react";
import type { CustomerInsight } from "./types";

const META: Record<
  CustomerInsight["severity"],
  { icon: React.ComponentType<{ className?: string }>; tone: string; label: string }
> = {
  info: { icon: Info, tone: "bg-info/10 text-info ring-info/20", label: "Insight" },
  warning: { icon: AlertTriangle, tone: "bg-warning/15 text-warning-foreground ring-warning/30", label: "Attention" },
  critical: { icon: AlertOctagon, tone: "bg-destructive/10 text-destructive ring-destructive/20", label: "Critical" },
  opportunity: { icon: Lightbulb, tone: "bg-success/10 text-success ring-success/20", label: "Opportunity" },
};

export function CustomerInsightCard({ insight }: { insight: CustomerInsight }) {
  const { icon: Icon, tone, label } = META[insight.severity];
  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="flex items-start gap-3">
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ring-1 ring-inset ${tone}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
          </div>
          <div className="mt-0.5 text-sm font-medium">{insight.title}</div>
          <p className="mt-1 text-xs text-muted-foreground">{insight.detail}</p>
        </div>
      </div>
    </div>
  );
}

export function CustomerInsightsPanel({ insights }: { insights: CustomerInsight[] }) {
  return (
    <div className="rounded-lg border bg-gradient-to-br from-primary/5 to-transparent p-3">
      <div className="mb-3 flex items-center gap-2 px-1">
        <Sparkles className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold">AI Insights</span>
        <span className="ml-auto text-xs text-muted-foreground">{insights.length} signals</span>
      </div>
      {insights.length === 0 ? (
        <div className="rounded-md border border-dashed bg-background/50 p-4 text-center text-xs text-muted-foreground">
          No insights for this customer.
        </div>
      ) : (
        <div className="space-y-2">
          {insights.map((i) => (
            <CustomerInsightCard key={i.id} insight={i} />
          ))}
        </div>
      )}
    </div>
  );
}
