import { CheckCircle2, AlertOctagon, Workflow, OctagonAlert, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { KnowledgeInsight, KnowledgeInsightType } from "./types";

const TYPE_META: Record<
  KnowledgeInsightType,
  { label: string; tone: string; Icon: typeof CheckCircle2 }
> = {
  best_practice: { label: "Best practice", tone: "border-success/40 bg-success/5", Icon: CheckCircle2 },
  operational_pattern: { label: "Operational pattern", tone: "border-info/40 bg-info/5", Icon: Workflow },
  known_risk: { label: "Known risk", tone: "border-warning/40 bg-warning/5", Icon: AlertOctagon },
  frequent_blocker: { label: "Frequent blocker", tone: "border-warning/40 bg-warning/5", Icon: OctagonAlert },
  compliance_note: { label: "Compliance note", tone: "border-primary/40 bg-primary/5", Icon: ShieldCheck },
};

export function KnowledgeReferenceCard({ insight }: { insight: KnowledgeInsight }) {
  const meta = TYPE_META[insight.type];
  const Icon = meta.Icon;
  return (
    <article className={cn("space-y-1.5 rounded-md border p-2.5", meta.tone)}>
      <div className="flex items-start justify-between gap-2">
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          <Icon className="h-3 w-3" />
          {meta.label}
        </span>
        <div className="flex items-center gap-2 text-[10px] tabular-nums text-muted-foreground">
          <span title="Confidence">conf {insight.confidence}%</span>
          <span title="Relevance">rel {insight.relevance}%</span>
        </div>
      </div>
      <h4 className="text-sm font-medium leading-snug">{insight.title}</h4>
      <p className="text-xs leading-relaxed text-muted-foreground">{insight.description}</p>
      {insight.sourceCases.length > 0 && (
        <p className="font-mono text-[10px] text-muted-foreground">
          Source: {insight.sourceCases.map((s) => s.reference).join(", ")}
        </p>
      )}
    </article>
  );
}
