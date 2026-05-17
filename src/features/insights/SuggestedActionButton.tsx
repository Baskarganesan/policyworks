import {
  ArrowRight,
  FileUp,
  ShieldAlert,
  UserPlus,
  RefreshCw,
  Send,
  CalendarClock,
  Flag,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SuggestedAction, SuggestedActionType } from "./types";

const ICON: Record<SuggestedActionType, LucideIcon> = {
  request_document: FileUp,
  escalate_review: ShieldAlert,
  assign_adjuster: UserPlus,
  start_renewal_review: RefreshCw,
  notify_underwriting: Send,
  open_related: ArrowRight,
  schedule_followup: CalendarClock,
  flag_compliance: Flag,
};

export function SuggestedActionButton({
  action,
  onTrigger,
}: {
  action: SuggestedAction;
  onTrigger?: (action: SuggestedAction) => void;
}) {
  const Icon = ICON[action.actionType];
  return (
    <Button
      size="sm"
      variant={action.priority === "primary" ? "default" : "outline"}
      className="h-7 gap-1.5 px-2 text-xs"
      onClick={() => onTrigger?.(action)}
    >
      <Icon className="h-3 w-3" />
      {action.label}
    </Button>
  );
}
