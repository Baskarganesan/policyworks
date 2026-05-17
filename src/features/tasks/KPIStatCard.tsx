import type { LucideIcon } from "lucide-react";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "info" | "warning" | "danger" | "success";

const TONE_STYLES: Record<Tone, string> = {
  neutral: "bg-muted text-muted-foreground",
  info: "bg-info/10 text-info",
  warning: "bg-warning/15 text-warning-foreground",
  danger: "bg-destructive/10 text-destructive",
  success: "bg-success/10 text-success",
};

interface KPIStatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  tone?: Tone;
  delta?: number;
  hint?: string;
  onClick?: () => void;
  active?: boolean;
}

export function KPIStatCard({
  label,
  value,
  icon: Icon,
  tone = "neutral",
  delta,
  hint,
  onClick,
  active,
}: KPIStatCardProps) {
  const TrendIcon = delta === undefined ? Minus : delta > 0 ? ArrowUp : delta < 0 ? ArrowDown : Minus;
  const trendTone =
    delta === undefined
      ? "text-muted-foreground"
      : delta > 0
        ? "text-destructive"
        : delta < 0
          ? "text-success"
          : "text-muted-foreground";

  return (
    <Card
      onClick={onClick}
      className={cn(
        "group flex flex-col gap-3 p-4 transition-all",
        onClick && "cursor-pointer hover:border-foreground/20 hover:shadow-sm",
        active && "border-primary/40 ring-1 ring-primary/20",
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        <span className={cn("flex h-7 w-7 items-center justify-center rounded-md", TONE_STYLES[tone])}>
          <Icon className="h-3.5 w-3.5" />
        </span>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-semibold tabular-nums">{value}</span>
        {delta !== undefined && (
          <span className={cn("inline-flex items-center gap-0.5 text-xs font-medium", trendTone)}>
            <TrendIcon className="h-3 w-3" />
            {Math.abs(delta)}%
          </span>
        )}
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </Card>
  );
}
