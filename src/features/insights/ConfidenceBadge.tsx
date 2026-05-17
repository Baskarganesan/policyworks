import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function ConfidenceBadge({
  confidence,
  className,
}: {
  confidence: number;
  className?: string;
}) {
  const tone =
    confidence >= 80
      ? "bg-success/10 text-success"
      : confidence >= 55
      ? "bg-info/10 text-info"
      : "bg-muted text-muted-foreground";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium tabular-nums",
        tone,
        className,
      )}
    >
      <Sparkles className="h-2.5 w-2.5" />
      {confidence}%
    </span>
  );
}
