import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SUGGESTED_PROMPTS } from "./types";

interface Props {
  onSelect: (prompt: string) => void;
  variant?: "chips" | "cards";
  className?: string;
}

export function SuggestedPromptChips({ onSelect, variant = "chips", className }: Props) {
  if (variant === "cards") {
    return (
      <div className={cn("grid gap-2 sm:grid-cols-2", className)}>
        {SUGGESTED_PROMPTS.map((p) => (
          <button
            key={p.label}
            onClick={() => onSelect(p.prompt)}
            className="group flex items-start justify-between gap-3 rounded-lg border bg-card p-3 text-left transition-all hover:border-primary/50 hover:shadow-sm"
          >
            <div className="space-y-0.5">
              <div className="text-xs font-medium text-muted-foreground">{p.label}</div>
              <div className="text-sm">{p.prompt}</div>
            </div>
            <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {SUGGESTED_PROMPTS.map((p) => (
        <button
          key={p.label}
          onClick={() => onSelect(p.prompt)}
          className="rounded-full border bg-background px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:bg-accent hover:text-foreground"
        >
          {p.prompt}
        </button>
      ))}
    </div>
  );
}
