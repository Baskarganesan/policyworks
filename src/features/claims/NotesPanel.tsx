import { useState } from "react";
import { Lock, Send } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import type { ClaimComment } from "./types";

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

interface NotesPanelProps {
  comments: ClaimComment[];
  onAdd: (message: string, internal: boolean) => void;
}

export function NotesPanel({ comments, onAdd }: NotesPanelProps) {
  const [message, setMessage] = useState("");
  const [internal, setInternal] = useState(true);

  const submit = () => {
    if (!message.trim()) return;
    onAdd(message.trim(), internal);
    setMessage("");
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {comments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No notes yet. Add the first one below.</p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">{initials(c.user)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-medium text-foreground">{c.user}</span>
                  <span className="text-muted-foreground">{formatDateTime(c.timestamp)}</span>
                  {c.internal && (
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-warning/15 px-1.5 py-0.5 text-[10px] font-medium text-warning-foreground">
                      <Lock className="h-2.5 w-2.5" />
                      Internal
                    </span>
                  )}
                </div>
                <p className="text-sm leading-relaxed text-foreground">{c.message}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="space-y-2 rounded-lg border bg-muted/30 p-3">
        <Textarea
          placeholder="Add a note or comment…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className="resize-none border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Switch id="internal" checked={internal} onCheckedChange={setInternal} />
            <Label htmlFor="internal" className="text-xs text-muted-foreground">
              Internal only
            </Label>
          </div>
          <Button size="sm" onClick={submit} disabled={!message.trim()}>
            <Send className="mr-1.5 h-3.5 w-3.5" />
            Post note
          </Button>
        </div>
      </div>
    </div>
  );
}
