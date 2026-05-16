import { useState } from "react";
import { Pin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { CustomerNote } from "./types";

interface Props {
  notes: CustomerNote[];
  onAdd?: (message: string) => void;
}

function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

export function NotesTimeline({ notes, onAdd }: Props) {
  const [draft, setDraft] = useState("");

  const submit = () => {
    if (!draft.trim() || !onAdd) return;
    onAdd(draft.trim());
    setDraft("");
  };

  const sorted = [...notes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  return (
    <div className="space-y-3">
      <div className="rounded-lg border bg-card p-3">
        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Add an internal note about this customer…"
          className="min-h-[72px] resize-none border-0 p-0 shadow-none focus-visible:ring-0"
        />
        <div className="flex justify-end pt-2">
          <Button size="sm" onClick={submit} disabled={!draft.trim()}>
            Add note
          </Button>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-card/50 p-6 text-center text-sm text-muted-foreground">
          No notes yet.
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map((n) => (
            <div key={n.id} className="rounded-lg border bg-card p-3">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                  {initials(n.author)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-medium text-foreground">{n.author}</span>
                    <span className="text-muted-foreground">{formatRelative(n.timestamp)}</span>
                    {n.pinned && (
                      <span className="inline-flex items-center gap-1 text-warning-foreground">
                        <Pin className="h-3 w-3" /> Pinned
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm">{n.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
