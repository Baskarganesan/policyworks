import { ShieldAlert, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DecisionScenario } from "./types";

const LABEL: Record<NonNullable<DecisionScenario["reviewLevel"]>, string> = {
  supervisor: "Requires supervisor review",
  underwriter: "Requires underwriter review",
  legal: "Requires legal review",
  compliance: "Requires compliance review",
  claims_lead: "Requires claims lead review",
};

export function HumanReviewBanner({
  scenario,
  className,
}: {
  scenario: DecisionScenario;
  className?: string;
}) {
  if (!scenario.requiresHumanReview) {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md border border-success/30 bg-success/5 px-2 py-1 text-[11px] text-foreground/80",
          className,
        )}
      >
        <UserCheck className="h-3 w-3 text-success" />
        Human verification recommended before execution
      </div>
    );
  }
  const text = scenario.reviewLevel ? LABEL[scenario.reviewLevel] : "Escalation required before execution";
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-warning/40 bg-warning/10 px-2 py-1 text-[11px] font-medium text-foreground",
        className,
      )}
    >
      <ShieldAlert className="h-3 w-3 text-warning" />
      {text}
    </div>
  );
}

export function GlobalHumanReviewNotice() {
  return (
    <div className="flex items-start gap-2 rounded-md border border-dashed bg-muted/40 p-2.5 text-[11px] text-muted-foreground">
      <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      <p>
        Decision support is assistive. Humans remain the decision-makers — recommendations
        do not execute automatically and must be reviewed before action.
      </p>
    </div>
  );
}
