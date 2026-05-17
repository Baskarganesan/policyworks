import { TrendingUp, ShieldAlert, Activity, Lightbulb, Sparkles, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AIInsight, InsightCategory } from "./types";

const META: Record<InsightCategory, { icon: LucideIcon; tone: string; label: string }> = {
  trend: { icon: TrendingUp, tone: "bg-info/10 text-info ring-info/20", label: "Trend" },
  risk: { icon: ShieldAlert, tone: "bg-destructive/10 text-destructive ring-destructive/20", label: "Risk" },
  anomaly: { icon: Activity, tone: "bg-warning/15 text-warning-foreground ring-warning/30", label: "Anomaly" },
  opportunity: { icon: Lightbulb, tone: "bg-success/10 text-success ring-success/20", label: "Opportunity" },
};

export function AIInsightCard({ insight }: { insight: AIInsight }) {
  const m = META[insight.category];
  const Icon = m.icon;
  return (
    <div className="rounded-lg border bg-card p-3 transition-colors hover:bg-accent/30">
      <div className="flex items-start gap-2.5">
        <span
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-md ring-1 ring-inset",
            m.tone,
          )}
        >
          <Icon className="h-3.5 w-3.5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              {m.label}
            </span>
            <span className="text-[10px] tabular-nums text-muted-foreground">
              {insight.confidence}% confidence
            </span>
          </div>
          <p className="mt-0.5 text-sm font-medium leading-snug">{insight.title}</p>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{insight.message}</p>
          {insight.source && (
            <p className="mt-1.5 text-[10px] text-muted-foreground/80">{insight.source}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export function AIInsightsPanel({ insights }: { insights: AIInsight[] }) {
  if (insights.length === 0) {
    return <p className="text-sm text-muted-foreground">No AI insights yet.</p>;
  }
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Sparkles className="h-3 w-3 text-primary" />
        <span>Updated 4m ago · {insights.length} signals</span>
      </div>
      <div className="space-y-2">
        {insights.map((i) => (
          <AIInsightCard key={i.id} insight={i} />
        ))}
      </div>
    </div>
  );
}
