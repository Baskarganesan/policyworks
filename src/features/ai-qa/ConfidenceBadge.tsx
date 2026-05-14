import { ShieldCheck, ShieldAlert, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Confidence } from "./types";

const config: Record<Confidence, { label: string; icon: typeof Shield; className: string }> = {
  high: {
    label: "High confidence",
    icon: ShieldCheck,
    className: "bg-success/10 text-success",
  },
  medium: {
    label: "Medium confidence",
    icon: Shield,
    className: "bg-info/10 text-info",
  },
  low: {
    label: "Low confidence",
    icon: ShieldAlert,
    className: "bg-warning/15 text-warning-foreground",
  },
};

export function ConfidenceBadge({ confidence, className }: { confidence: Confidence; className?: string }) {
  const { label, icon: Icon, className: tone } = config[confidence];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium",
        tone,
        className,
      )}
    >
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}
