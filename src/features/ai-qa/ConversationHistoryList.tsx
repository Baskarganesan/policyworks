import { MessageSquare, MoreHorizontal, Pencil, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Conversation } from "./types";
import { formatRelative } from "./types";

interface Props {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onRename?: (id: string) => void;
  onDelete?: (id: string) => void;
}

function groupByDay(items: Conversation[]) {
  const groups: Record<string, Conversation[]> = { Today: [], Yesterday: [], Earlier: [] };
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yest = today - 86400000;
  for (const c of items) {
    const t = new Date(c.updatedAt).getTime();
    if (t >= today) groups.Today.push(c);
    else if (t >= yest) groups.Yesterday.push(c);
    else groups.Earlier.push(c);
  }
  return groups;
}

export function ConversationHistoryList({
  conversations,
  activeId,
  onSelect,
  onNew,
  onRename,
  onDelete,
}: Props) {
  const groups = groupByDay(conversations);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between p-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Conversations
        </span>
        <Button size="sm" variant="outline" className="h-7 gap-1 text-xs" onClick={onNew}>
          <Plus className="h-3.5 w-3.5" />
          New
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto px-2 pb-3">
        {Object.entries(groups).map(([label, items]) =>
          items.length === 0 ? null : (
            <div key={label} className="mb-3">
              <div className="px-2 pb-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                {label}
              </div>
              <div className="space-y-0.5">
                {items.map((c) => (
                  <div
                    key={c.id}
                    className={cn(
                      "group flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent",
                      activeId === c.id && "bg-accent",
                    )}
                    onClick={() => onSelect(c.id)}
                  >
                    <MessageSquare className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-xs font-medium">{c.title}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {formatRelative(c.updatedAt)}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onRename?.(c.id)}>
                          <Pencil className="mr-2 h-3.5 w-3.5" /> Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete?.(c.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
