import { Sparkles, Clock, Users, DollarSign, Briefcase, CheckCircle2, CircleDashed, CircleX } from "lucide-react";
import { cn } from "@/lib/utils";
import { TradeoffBadge } from "./TradeoffBadge";
import { UncertaintyIndicator } from "./UncertaintyIndicator";
import { OutcomeProjectionCard } from "./OutcomeProjectionCard";
import { RecommendationReasoningCard } from "./RecommendationReasoningCard";
import { HumanReviewBanner } from "./HumanReviewBanner";
import type { DecisionScenario, ScenarioDependency } from "./types";

function ConfidenceBar({ value }: { value: number }) {
  const tone =
    value >= 70 ? "bg-success" : value >= 50 ? "bg-info" : "bg-muted-foreground/60";
  const label = value >= 70 ? "High" : value >= 50 ? "Medium" : "Low";
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[10px] uppercase tracking-wide text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Sparkles className="h-3 w-3" /> {label} confidence
        </span>
        <span className="tabular-nums">{value}%</span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-muted">
        <div className={cn("h-full", tone)} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function DepIcon({ status }: { status: ScenarioDependency["status"] }) {
  if (status === "ready") return <CheckCircle2 className="h-3 w-3 text-success" />;
  if (status === "blocked") return <CircleX className="h-3 w-3 text-destructive" />;
  return <CircleDashed className="h-3 w-3 text-warning" />;
}

export function ScenarioComparisonCard({
  scenario,
  highlighted = false,
}: {
  scenario: DecisionScenario;
  highlighted?: boolean;
}) {
  return (
    <article
      className={cn(
        "flex h-full flex-col gap-3 rounded-lg border bg-card p-3",
        highlighted && "border-primary/40 ring-1 ring-primary/20",
      )}
    >
      <header className="space-y-1.5">
        <div className="flex items-center gap-1.5">
          {scenario.recommended && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
              <Sparkles className="h-3 w-3" /> Recommended
            </span>
          )}
        </div>
        <h4 className="text-sm font-semibold leading-snug">{scenario.title}</h4>
        <p className="text-xs leading-relaxed text-muted-foreground">{scenario.summary}</p>
      </header>

      <ConfidenceBar value={scenario.confidence} />

      <dl className="grid grid-cols-1 gap-1.5 rounded-md bg-muted/40 p-2 text-[11px]">
        <div className="flex items-start gap-1.5">
          <Clock className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />
          <div>
            <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">SLA</dt>
            <dd>{scenario.slaImpact}</dd>
          </div>
        </div>
        <div className="flex items-start gap-1.5">
          <Users className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />
          <div>
            <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">Customer</dt>
            <dd>{scenario.customerImpact}</dd>
          </div>
        </div>
        <div className="flex items-start gap-1.5">
          <DollarSign className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />
          <div>
            <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">Exposure</dt>
            <dd>{scenario.financialExposure}</dd>
          </div>
        </div>
        <div className="flex items-start gap-1.5">
          <Briefcase className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />
          <div>
            <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">Operations</dt>
            <dd>{scenario.operationalImpact}</dd>
          </div>
        </div>
      </dl>

      <section className="space-y-1.5">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          Tradeoffs
        </p>
        <div className="flex flex-wrap gap-1">
          {scenario.tradeoffs.map((t) => (
            <TradeoffBadge key={t.id} tradeoff={t} />
          ))}
        </div>
      </section>

      {scenario.dependencies.length > 0 && (
        <section className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Dependencies
          </p>
          <ul className="space-y-1 text-[11px]">
            {scenario.dependencies.map((d) => (
              <li key={d.id} className="flex items-start gap-1.5">
                <DepIcon status={d.status} />
                <div className="min-w-0">
                  <span className="text-foreground/90">{d.label}</span>
                  {d.note && (
                    <span className="ml-1 text-muted-foreground">· {d.note}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="space-y-1">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          Projected outcomes
        </p>
        <OutcomeProjectionCard outcomes={scenario.projectedOutcomes} />
      </section>

      <section className="space-y-1">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          Uncertainty
        </p>
        <UncertaintyIndicator signals={scenario.uncertainties} />
      </section>

      <RecommendationReasoningCard
        reasoning={scenario.reasoning}
        assumptions={scenario.assumptions}
        unresolvedRisks={scenario.unresolvedRisks}
      />

      {scenario.nextSteps.length > 0 && (
        <section className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Suggested next steps
          </p>
          <ol className="space-y-0.5 text-[11px] text-foreground/85">
            {scenario.nextSteps.map((s, i) => (
              <li key={i}>
                <span className="mr-1 tabular-nums text-muted-foreground">{i + 1}.</span>
                {s}
              </li>
            ))}
          </ol>
        </section>
      )}

      <HumanReviewBanner scenario={scenario} className="mt-auto self-start" />
    </article>
  );
}
