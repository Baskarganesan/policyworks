import { Lightbulb, TrendingUp, AlertTriangle, Eye, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PolicyInsight } from "./types";

const KIND = {
  recommendation: { icon: Lightbulb, tone: "text-info", chip: "bg-info/10 text-info", label: "Recommendation" },
  observation: { icon: Eye, tone: "text-muted-foreground", chip: "bg-muted text-muted-foreground", label: "Observation" },
  warning: { icon: AlertTriangle, tone: "text-warning-foreground", chip: "bg-warning/15 text-warning-foreground", label: "Warning" },
  trend: { icon: TrendingUp, tone: "text-foreground", chip: "bg-accent text-accent-foreground", label: "Trend" },
} as const;

export function PolicyInsightCard({ insight }: { insight: PolicyInsight }) {
  const k = KIND[insight.kind];
  const Icon = k.icon;
  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="flex items-start gap-3">
        <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted", k.tone)}>
          <Icon className="h-3.5 w-3.5" />
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium leading-snug">{insight.title}</p>
            <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium", k.chip)}>{k.label}</span>
          </div>
          <p className="text-xs text-muted-foreground">{insight.detail}</p>
          <div className="flex items-center justify-between pt-1 text-[10px] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> {insight.source}
            </span>
            <div className="flex items-center gap-2">
              <span>{insight.confidence}% confidence</span>
              <ExplainButton
                subject={{
                  subjectId: insight.id,
                  title: insight.title,
                  kind: "policy_insight",
                  category: insight.source,
                  confidence: insight.confidence,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
