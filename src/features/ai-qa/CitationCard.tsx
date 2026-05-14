import { FileText, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Citation } from "./types";

interface Props {
  citation: Citation;
  index?: number;
  active?: boolean;
  onSelect?: (c: Citation) => void;
  compact?: boolean;
}

export function CitationCard({ citation, index, active, onSelect, compact }: Props) {
  const relevance = Math.round(citation.relevanceScore * 100);

  return (
    <button
      type="button"
      onClick={() => onSelect?.(citation)}
      className={cn(
        "group w-full rounded-lg border bg-card p-3 text-left shadow-sm transition-all hover:border-primary/40 hover:shadow",
        active && "border-primary ring-2 ring-primary/20",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          {typeof index === "number" && (
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-primary/10 text-[11px] font-semibold text-primary">
              {index + 1}
            </span>
          )}
          <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <span className="truncate text-xs font-medium">{citation.documentName}</span>
        </div>
        <span className="shrink-0 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
          {relevance}%
        </span>
      </div>

      <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
        <span>Page {citation.page}</span>
        {citation.section && (
          <>
            <span>•</span>
            <span className="truncate">{citation.section}</span>
          </>
        )}
      </div>

      {!compact && (
        <p className="mt-2 line-clamp-3 border-l-2 border-primary/30 pl-2 text-xs leading-relaxed text-muted-foreground">
          “{citation.snippet}”
        </p>
      )}

      {!compact && (
        <div className="mt-2 flex justify-end opacity-0 transition-opacity group-hover:opacity-100">
          <Button size="sm" variant="ghost" className="h-6 gap-1 px-2 text-[11px]">
            View source <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      )}
    </button>
  );
}
