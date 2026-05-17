import {
  ArrowDown,
  ArrowUp,
  Minus,
  ClipboardList,
  ShieldAlert,
  CalendarClock,
  FileSearch,
  AlarmClock,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { DashboardMetric, MetricStatus } from "./types";

const ICONS: Record<DashboardMetric["iconKey"], LucideIcon> = {
  claims: ClipboardList,
  review: ShieldAlert,
  expiring: CalendarClock,
  indexing: FileSearch,
  overdue: AlarmClock,
  ai: Sparkles,
};

const STATUS_TONE: Record<MetricStatus, string> = {
  neutral: "bg-muted text-muted-foreground",
  info: "bg-info/10 text-info",
  success: "bg-success/10 text-success",
  warning: "bg-warning/15 text-warning-foreground",
  danger: "bg-destructive/10 text-destructive",
};

const STATUS_BAR: Record<MetricStatus, string> = {
  neutral: "bg-border",
  info: "bg-info/60",
  success: "bg-success/60",
  warning: "bg-warning/70",
  danger: "bg-destructive/70",
};

// Higher trend is bad for most operational metrics (overdue, waiting).
// Caller can pass invertTrend=true when up is good (e.g. AI questions, throughput).
interface Props {
  metric: DashboardMetric;
  invertTrend?: boolean;
  onClick?: () => void;
}

export function KPIStatCard({ metric, invertTrend, onClick }: Props) {
  const Icon = ICONS[metric.iconKey];
  const t = metric.trend;
  const Trend = t === undefined ? Minus : t > 0 ? ArrowUp : t < 0 ? ArrowDown : Minus;
  const positive = invertTrend ? (t ?? 0) > 0 : (t ?? 0) < 0;
  const negative = invertTrend ? (t ?? 0) < 0 : (t ?? 0) > 0;
  const trendTone =
    t === undefined || t === 0
      ? "text-muted-foreground"
      : positive
        ? "text-success"
        : negative
          ? "text-destructive"
          : "text-muted-foreground";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative flex flex-col gap-2.5 overflow-hidden rounded-xl border bg-card p-4 text-left transition-all",
        "hover:border-foreground/20 hover:shadow-[var(--shadow-elevated)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      )}
    >
      <span
        aria-hidden
        className={cn("absolute left-0 top-0 h-full w-0.5", STATUS_BAR[metric.status])}
      />
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {metric.label}
        </span>
        <span
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-md",
            STATUS_TONE[metric.status],
          )}
        >
          <Icon className="h-3.5 w-3.5" />
        </span>
      </div>
      <div className="flex items-end justify-between gap-2">
        <span className="text-2xl font-semibold tabular-nums leading-none">
          {metric.value}
        </span>
        {t !== undefined && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-xs font-medium tabular-nums",
              trendTone,
            )}
          >
            <Trend className="h-3 w-3" />
            {Math.abs(t)}%
          </span>
        )}
      </div>
      {metric.hint && (
        <p className="text-xs text-muted-foreground">{metric.hint}</p>
      )}
    </button>
  );
}
