import { useMemo } from "react";
import { ShieldCheck, Info } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { getDecisionTrace } from "./mockData";
import { ConfidenceIndicator } from "./ConfidenceIndicator";
import { TriggerConditionList } from "./TriggerConditionList";
import { DecisionTraceCard } from "./DecisionTraceCard";
import { SourceReferenceCard } from "./SourceReferenceCard";
import { AuditTimeline } from "./AuditTimeline";
import { ChangeHistoryCard } from "./ChangeHistoryCard";
import type { ExplainabilitySubject } from "./types";

const SEV_BAR: Record<NonNullable<ExplainabilitySubject["severity"]>, string> = {
  low: "bg-muted-foreground/60",
  medium: "bg-info",
  high: "bg-warning",
  critical: "bg-destructive",
};

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-2">
      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

export function ExplainabilityDrawer({
  subject,
  open,
  onOpenChange,
}: {
  subject: ExplainabilitySubject | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const trace = useMemo(() => (subject ? getDecisionTrace(subject) : null), [subject]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:max-w-lg lg:max-w-xl"
      >
        {subject && trace && (
          <>
            <SheetHeader className="space-y-3 border-b p-6">
              <div className="flex items-center gap-2">
                <span
                  aria-hidden
                  className={cn(
                    "h-2 w-2 rounded-full",
                    subject.severity ? SEV_BAR[subject.severity] : "bg-muted-foreground/60",
                  )}
                />
                <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Why am I seeing this?
                </span>
                {subject.category && (
                  <span className="rounded-full bg-accent/60 px-1.5 py-0.5 text-[10px] font-medium text-accent-foreground">
                    {subject.category}
                  </span>
                )}
              </div>
              <SheetTitle className="text-lg leading-tight">{subject.title}</SheetTitle>
              <SheetDescription className="text-sm leading-relaxed">
                {trace.rationale}
              </SheetDescription>
              <div className="pt-1">
                <ConfidenceIndicator confidence={trace.confidence} />
              </div>
            </SheetHeader>

            <ScrollArea className="flex-1">
              <div className="space-y-6 p-6">
                <Section
                  title="Trigger conditions"
                  description="The signals that had to be true for this to surface."
                >
                  <TriggerConditionList triggers={trace.triggers} />
                </Section>

                <Separator />

                <Section
                  title="Decision trace"
                  description="What contributed to this recommendation and how much."
                >
                  <DecisionTraceCard
                    title={`Trigger: ${trace.trigger}`}
                    rationale={`Originated from ${trace.triggerSource}. Contributing signals are weighted relative to each other — not absolute risk scores.`}
                    signals={trace.signals}
                  />
                </Section>

                <Section
                  title="Source references"
                  description="Documents, policies, and rules used to evaluate this signal."
                >
                  <SourceReferenceCard sources={trace.sources} />
                </Section>

                {trace.relatedEntities && trace.relatedEntities.length > 0 && (
                  <Section title="Linked entities">
                    <ul className="flex flex-wrap gap-1.5">
                      {trace.relatedEntities.map((r) => (
                        <li
                          key={`${r.type}-${r.id}`}
                          className="inline-flex items-center gap-1 rounded-md border bg-card px-1.5 py-0.5 text-[11px]"
                        >
                          <span className="text-muted-foreground capitalize">{r.type}</span>
                          <span className="font-mono">{r.label}</span>
                        </li>
                      ))}
                    </ul>
                  </Section>
                )}

                <Separator />

                <Section
                  title="Audit timeline"
                  description="Events that led to this signal, grouped by day."
                >
                  <AuditTimeline events={trace.events} />
                </Section>

                {trace.changes && trace.changes.length > 0 && (
                  <Section
                    title="Recent changes"
                    description="Tracked field changes on linked entities."
                  >
                    <ChangeHistoryCard changes={trace.changes} />
                  </Section>
                )}

                <div className="flex items-start gap-2 rounded-md border border-dashed bg-muted/40 p-3 text-xs text-muted-foreground">
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <p>
                    This explanation reflects the signals available at the time. It supports
                    decision-making but does not replace human review.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-1 pt-2 text-[11px] text-muted-foreground">
                  <ShieldCheck className="h-3 w-3" />
                  Generated{" "}
                  {new Date(trace.createdAt).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}{" "}
                  · trace id <span className="font-mono">{trace.id}</span>
                </div>
              </div>
            </ScrollArea>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
