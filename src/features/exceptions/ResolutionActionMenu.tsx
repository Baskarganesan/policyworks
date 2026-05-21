import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { ResolutionAction } from "./types";

export function ResolutionActionMenu({
  actions,
  buttonLabel = "Actions",
  align = "end",
}: {
  actions: ResolutionAction[];
  buttonLabel?: string;
  align?: "start" | "end";
}) {
  if (actions.length === 0) return null;
  const primary = actions.find((a) => a.priority === "primary");
  const rest = actions.filter((a) => a !== primary);

  return (
    <div className="flex items-center gap-1.5">
      {primary && (
        <Button size="sm" className="h-7 px-2.5 text-xs">
          {primary.label}
        </Button>
      )}
      {rest.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline" className="h-7 gap-1 px-2 text-xs">
              {primary ? <MoreHorizontal className="h-3.5 w-3.5" /> : buttonLabel}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={align} className="w-56">
            <DropdownMenuLabel className="text-[11px] uppercase tracking-wide text-muted-foreground">
              Resolution actions
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {rest.map((a) => (
              <DropdownMenuItem
                key={a.id}
                className={cn("text-xs", a.destructive && "text-destructive focus:text-destructive")}
              >
                {a.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
