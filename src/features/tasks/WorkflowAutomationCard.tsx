import { Sparkles, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { AutomationSuggestion } from "./types";

const CATEGORY_LABEL: Record<AutomationSuggestion["category"], string> = {
  claims: "Claims",
  policies: "Policies",
  renewals: "Renewals",
  documents: "Documents",
};

export function WorkflowAutomationCard({ suggestion }: { suggestion: AutomationSuggestion }) {
  return (
    <Card className="group flex flex-col gap-3 p-4 transition-colors hover:border-foreground/20">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {CATEGORY_LABEL[suggestion.category]}
          </span>
        </div>
      </div>
      <p className="text-sm font-medium leading-snug">{suggestion.title}</p>
      <div className="space-y-1 text-xs text-muted-foreground">
        <p>
          <span className="font-medium text-foreground">Trigger:</span> {suggestion.trigger}
        </p>
        <p>
          <span className="font-medium text-foreground">Action:</span> {suggestion.action}
        </p>
      </div>
      <div className="flex items-center justify-end gap-1 pt-1">
        <Button variant="ghost" size="sm" className="h-7 text-xs">
          Dismiss
        </Button>
        <Button size="sm" className="h-7 text-xs">
          Enable
          <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      </div>
    </Card>
  );
}
