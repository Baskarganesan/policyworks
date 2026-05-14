import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ArrowUp, Paperclip, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  onSend: (value: string) => void;
  onStop?: () => void;
  isStreaming?: boolean;
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function ChatInputBar({
  onSend,
  onStop,
  isStreaming,
  value: controlledValue,
  onChange,
  placeholder = "Ask anything about your policy documents…",
  disabled,
}: Props) {
  const [internal, setInternal] = useState("");
  const value = controlledValue ?? internal;
  const setValue = (v: string) => {
    if (onChange) onChange(v);
    else setInternal(v);
  };
  const ref = useRef<HTMLTextAreaElement>(null);

  // autosize
  useEffect(() => {
    const ta = ref.current;
    if (!ta) return;
    ta.style.height = "0px";
    ta.style.height = Math.min(ta.scrollHeight, 200) + "px";
  }, [value]);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  const send = () => {
    const trimmed = value.trim();
    if (!trimmed || isStreaming) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="rounded-2xl border bg-card shadow-elevated focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/15">
      <textarea
        ref={ref}
        value={value}
        disabled={disabled}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKey}
        rows={1}
        placeholder={placeholder}
        className={cn(
          "block w-full resize-none rounded-2xl bg-transparent px-4 py-3 text-sm leading-relaxed outline-none placeholder:text-muted-foreground",
        )}
      />
      <div className="flex items-center justify-between gap-2 px-3 pb-2 pt-1">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-7 gap-1 text-muted-foreground" type="button">
            <Paperclip className="h-3.5 w-3.5" />
            Attach
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden text-[11px] text-muted-foreground sm:inline">
            <kbd className="rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium">Enter</kbd>
            {" "}to send,{" "}
            <kbd className="rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium">Shift</kbd>
            {" + "}
            <kbd className="rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium">Enter</kbd>
            {" "}for newline
          </span>
          {isStreaming ? (
            <Button size="icon" variant="secondary" onClick={onStop} className="h-8 w-8">
              <Square className="h-3.5 w-3.5 fill-current" />
            </Button>
          ) : (
            <Button
              size="icon"
              onClick={send}
              disabled={!value.trim() || disabled}
              className="h-8 w-8 rounded-full"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
