import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DashboardSectionProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function DashboardSection({
  title,
  description,
  actions,
  children,
  className,
  contentClassName,
}: DashboardSectionProps) {
  return (
    <section
      className={cn(
        "flex flex-col rounded-xl border bg-card shadow-[var(--shadow-soft)]",
        className,
      )}
    >
      <header className="flex items-start justify-between gap-3 border-b px-4 py-3">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
          {description && (
            <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-1.5">{actions}</div>}
      </header>
      <div className={cn("flex-1 p-4", contentClassName)}>{children}</div>
    </section>
  );
}
