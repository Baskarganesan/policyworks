import { Sparkles, User, Copy, ThumbsUp, ThumbsDown, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ConfidenceBadge } from "./ConfidenceBadge";
import { CitationCard } from "./CitationCard";
import type { ChatMessage as ChatMessageType, Citation } from "./types";
import { formatTime } from "./types";

interface Props {
  message: ChatMessageType;
  onCitationClick?: (c: Citation) => void;
  activeCitationId?: string;
  onFollowUp?: (q: string) => void;
}

const FOLLOW_UPS = [
  "What are the related exclusions?",
  "Is there a sub-limit?",
  "Show me the endorsement details.",
];

function renderInlineMarkdown(text: string) {
  // Minimal: **bold** support
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith("**") && p.endsWith("**") ? (
      <strong key={i} className="font-semibold text-foreground">
        {p.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{p}</span>
    ),
  );
}

export function ChatMessage({ message, onCitationClick, activeCitationId, onFollowUp }: Props) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end gap-3 px-1">
        <div className="max-w-[80%] space-y-1">
          <div className="rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground shadow-sm">
            {message.content}
          </div>
          <div className="text-right text-[11px] text-muted-foreground">
            {formatTime(message.timestamp)}
          </div>
        </div>
        <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <User className="h-3.5 w-3.5" />
        </div>
      </div>
    );
  }

  return (
    <div className="group flex gap-3 px-1">
      <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/60 text-primary-foreground shadow-sm">
        <Sparkles className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0 flex-1 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium">Policyworks AI</span>
          {message.confidence && <ConfidenceBadge confidence={message.confidence} />}
          <span className="text-[11px] text-muted-foreground">
            {formatTime(message.timestamp)}
          </span>
        </div>

        <div className="space-y-3 text-sm leading-relaxed text-foreground">
          {message.content.split("\n\n").map((para, i) => (
            <p key={i}>{renderInlineMarkdown(para)}</p>
          ))}
          {message.isStreaming && (
            <span className="inline-block h-4 w-1.5 animate-pulse rounded-sm bg-primary align-middle" />
          )}
        </div>

        {message.citations && message.citations.length > 0 && (
          <div className="space-y-2 pt-1">
            <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Sources ({message.citations.length})
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {message.citations.map((c, idx) => (
                <CitationCard
                  key={c.id}
                  citation={c}
                  index={idx}
                  active={activeCitationId === c.id}
                  onSelect={onCitationClick}
                  compact
                />
              ))}
            </div>
          </div>
        )}

        {!message.isStreaming && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                <Copy className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                <ThumbsUp className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                <ThumbsDown className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}

        {!message.isStreaming && message.citations && onFollowUp && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {FOLLOW_UPS.map((q) => (
              <button
                key={q}
                onClick={() => onFollowUp(q)}
                className={cn(
                  "rounded-full border bg-background px-2.5 py-1 text-xs text-muted-foreground",
                  "transition-colors hover:border-primary/40 hover:bg-accent hover:text-foreground",
                )}
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
