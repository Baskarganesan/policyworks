import { FileText, BookOpen, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { CitationCard } from "./CitationCard";
import type { Citation } from "./types";
import { EmptyState } from "@/components/shared/EmptyState";

interface Props {
  citations: Citation[];
  activeCitationId?: string;
  onSelect?: (c: Citation) => void;
}

export function CitationPanel({ citations, activeCitationId, onSelect }: Props) {
  // group by document
  const byDoc = citations.reduce<Record<string, Citation[]>>((acc, c) => {
    (acc[c.documentName] ||= []).push(c);
    return acc;
  }, {});

  return (
    <div className="flex h-full flex-col bg-muted/30">
      <div className="flex items-center justify-between border-b bg-background/60 px-4 py-3">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Sources & citations</span>
        </div>
        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
          {citations.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {citations.length === 0 ? (
          <div className="pt-8">
            <EmptyState
              icon={<Filter className="h-5 w-5" />}
              title="No citations yet"
              description="Ask a question and the supporting policy excerpts will appear here."
            />
          </div>
        ) : (
          <div className="space-y-5">
            {Object.entries(byDoc).map(([docName, items]) => (
              <div key={docName} className="space-y-2">
                <div className="flex items-center gap-2 px-1">
                  <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="truncate text-xs font-medium">{docName}</span>
                  <span className="ml-auto text-[10px] text-muted-foreground">
                    {items.length} ref{items.length === 1 ? "" : "s"}
                  </span>
                </div>
                <div
                  className={cn(
                    "space-y-2 border-l-2 border-primary/20 pl-2",
                  )}
                >
                  {items.map((c, idx) => (
                    <CitationCard
                      key={c.id}
                      citation={c}
                      index={idx}
                      active={activeCitationId === c.id}
                      onSelect={onSelect}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
