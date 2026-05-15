import { ArrowDown, ArrowUp, Equal, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { PRIORITY_LABELS, type ClaimPriority } from "./types";

const STYLES: Record<ClaimPriority, { className: string; Icon: typeof ArrowDown }> = {
  low: {
    className: "text-muted-foreground",
    Icon: ArrowDown,
  },
  medium: {
    className: "text-info",
    Icon: Equal,
  },
  high: {
    className: "text-warning-foreground",
    Icon: ArrowUp,
  },
  urgent: {
    className: "text-destructive",
    Icon: AlertTriangle,
  },
};

export function PriorityBadge({ priority }: { priority: ClaimPriority }) {
  const { className, Icon } = STYLES[priority];
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium", className)}>
      <Icon className="h-3.5 w-3.5" />
      {PRIORITY_LABELS[priority]}
    </span>
  );
}
