import { useEffect, useMemo, useRef, useState } from "react";
import { Sparkles, History, PanelLeftClose, PanelLeft } from "lucide-react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ChatMessage } from "./ChatMessage";
import { ChatInputBar } from "./ChatInputBar";
import { CitationPanel } from "./CitationPanel";
import { ConversationHistoryList } from "./ConversationHistoryList";
import { SuggestedPromptChips } from "./SuggestedPromptChips";
import {
  MOCK_CITATIONS,
  MOCK_CONVERSATIONS,
  type ChatMessage as ChatMessageType,
  type Citation,
  type Conversation,
} from "./types";

const MOCK_ANSWER =
  "Based on the attached policy documents, **flood damage is excluded** under the base homeowners coverage. The policy applies only to direct physical loss to property and explicitly excludes flood, surface water, and water that backs up through sewers or drains.\n\nHowever, this policy includes **Endorsement HO-32 (Water Backup)**, which adds limited coverage for water backing up through sewers or drains, subject to a **$5,000 sub-limit**. True flood (rising surface water) remains excluded and would require a separate NFIP or private flood policy.";

function newConversation(): Conversation {
  const now = new Date().toISOString();
  return {
    id: `conv_${Date.now()}`,
    title: "New conversation",
    createdAt: now,
    updatedAt: now,
    messages: [],
  };
}

export function AIChatLayout() {
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [activeId, setActiveId] = useState<string>(MOCK_CONVERSATIONS[0].id);
  const [isStreaming, setIsStreaming] = useState(false);
  const [activeCitationId, setActiveCitationId] = useState<string | undefined>();
  const [historyCollapsed, setHistoryCollapsed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const streamTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const active = conversations.find((c) => c.id === activeId) ?? conversations[0];

  const allCitations = useMemo(() => {
    const seen = new Set<string>();
    const list: Citation[] = [];
    for (const m of active?.messages ?? []) {
      for (const c of m.citations ?? []) {
        if (!seen.has(c.id)) {
          seen.add(c.id);
          list.push(c);
        }
      }
    }
    return list;
  }, [active]);

  // autoscroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [active?.messages.length, isStreaming]);

  useEffect(() => {
    return () => {
      if (streamTimer.current) clearInterval(streamTimer.current);
    };
  }, []);

  const updateActive = (updater: (c: Conversation) => Conversation) => {
    setConversations((prev) => prev.map((c) => (c.id === activeId ? updater(c) : c)));
  };

  const handleSend = (text: string) => {
    const now = new Date().toISOString();
    const userMsg: ChatMessageType = {
      id: `m_${Date.now()}`,
      role: "user",
      content: text,
      timestamp: now,
    };
    const aiId = `m_${Date.now() + 1}`;
    const aiMsg: ChatMessageType = {
      id: aiId,
      role: "assistant",
      content: "",
      timestamp: new Date(Date.now() + 100).toISOString(),
      isStreaming: true,
    };

    updateActive((c) => ({
      ...c,
      title: c.messages.length === 0 ? text.slice(0, 60) : c.title,
      updatedAt: now,
      messages: [...c.messages, userMsg, aiMsg],
    }));

    setIsStreaming(true);

    // simulate streaming
    const chunks = MOCK_ANSWER.split(/(\s+)/);
    let i = 0;
    streamTimer.current = setInterval(() => {
      i += 2;
      const partial = chunks.slice(0, i).join("");
      const done = i >= chunks.length;

      setConversations((prev) =>
        prev.map((c) =>
          c.id !== activeId
            ? c
            : {
                ...c,
                messages: c.messages.map((m) =>
                  m.id !== aiId
                    ? m
                    : {
                        ...m,
                        content: partial,
                        isStreaming: !done,
                        confidence: done ? "high" : undefined,
                        citations: done ? [MOCK_CITATIONS[0], MOCK_CITATIONS[1]] : undefined,
                      },
                ),
              },
        ),
      );

      if (done) {
        if (streamTimer.current) clearInterval(streamTimer.current);
        streamTimer.current = null;
        setIsStreaming(false);
      }
    }, 35);
  };

  const handleStop = () => {
    if (streamTimer.current) clearInterval(streamTimer.current);
    streamTimer.current = null;
    setIsStreaming(false);
    updateActive((c) => ({
      ...c,
      messages: c.messages.map((m) =>
        m.isStreaming ? { ...m, isStreaming: false, confidence: "medium" } : m,
      ),
    }));
  };

  const handleNew = () => {
    const conv = newConversation();
    setConversations((p) => [conv, ...p]);
    setActiveId(conv.id);
  };

  const handleDelete = (id: string) => {
    setConversations((p) => {
      const next = p.filter((c) => c.id !== id);
      if (id === activeId) setActiveId(next[0]?.id ?? "");
      return next.length ? next : [newConversation()];
    });
  };

  const handleCitationClick = (c: Citation) => {
    setActiveCitationId(c.id);
  };

  const isEmpty = !active || active.messages.length === 0;

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b bg-background px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="hidden h-8 w-8 lg:flex"
            onClick={() => setHistoryCollapsed((v) => !v)}
          >
            {historyCollapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 lg:hidden">
                <History className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetHeader className="px-4 pt-4">
                <SheetTitle>History</SheetTitle>
              </SheetHeader>
              <ConversationHistoryList
                conversations={conversations}
                activeId={activeId}
                onSelect={setActiveId}
                onNew={handleNew}
                onDelete={handleDelete}
              />
            </SheetContent>
          </Sheet>

          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-primary to-primary/60 text-primary-foreground">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">{active?.title ?? "New conversation"}</div>
            <div className="text-[11px] text-muted-foreground">
              Grounded in your indexed policy documents
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex min-h-0 flex-1">
        {/* History sidebar (desktop) */}
        {!historyCollapsed && (
          <aside className="hidden w-64 shrink-0 border-r bg-sidebar/40 lg:block">
            <ConversationHistoryList
              conversations={conversations}
              activeId={activeId}
              onSelect={setActiveId}
              onNew={handleNew}
              onDelete={handleDelete}
            />
          </aside>
        )}

        <ResizablePanelGroup orientation="horizontal" className="min-w-0 flex-1">
          {/* Left: Citations */}
          <ResizablePanel defaultSize={32} minSize={22} maxSize={45} className="hidden md:block">
            <CitationPanel
              citations={allCitations}
              activeCitationId={activeCitationId}
              onSelect={handleCitationClick}
            />
          </ResizablePanel>
          <ResizableHandle className="hidden md:flex" />

          {/* Right: Chat */}
          <ResizablePanel defaultSize={68} minSize={45}>
            <div className="flex h-full flex-col bg-background">
              <div ref={scrollRef} className="flex-1 overflow-y-auto">
                {isEmpty ? (
                  <EmptyChat onPick={handleSend} />
                ) : (
                  <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-6">
                    {active.messages.map((m) => (
                      <ChatMessage
                        key={m.id}
                        message={m}
                        onCitationClick={handleCitationClick}
                        activeCitationId={activeCitationId}
                        onFollowUp={handleSend}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t bg-gradient-to-t from-background via-background to-background/80 px-4 pb-4 pt-3">
                <div className="mx-auto w-full max-w-3xl space-y-2">
                  <ChatInputBar
                    onSend={handleSend}
                    onStop={handleStop}
                    isStreaming={isStreaming}
                  />
                  <p className="text-center text-[11px] text-muted-foreground">
                    Answers are AI-generated from your indexed policies. Always verify against the
                    cited source.
                  </p>
                </div>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}

function EmptyChat({ onPick }: { onPick: (q: string) => void }) {
  return (
    <div className="mx-auto flex h-full w-full max-w-2xl flex-col items-center justify-center gap-6 px-6 py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/60 text-primary-foreground shadow-elevated">
        <Sparkles className="h-6 w-6" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Ask your policies anything</h2>
        <p className="mx-auto max-w-md text-sm text-muted-foreground">
          Get instant, cited answers about coverage, exclusions, deductibles, and endorsements —
          grounded in the documents you've uploaded.
        </p>
      </div>
      <SuggestedPromptChips variant="cards" onSelect={onPick} className="w-full" />
    </div>
  );
}
