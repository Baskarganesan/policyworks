import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { CUSTOMER_STATUS_LABELS, type CustomerStatus } from "./types";

const variants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
  {
    variants: {
      status: {
        active: "bg-success/10 text-success ring-success/20",
        needs_attention: "bg-destructive/10 text-destructive ring-destructive/20",
        high_value: "bg-info/10 text-info ring-info/20",
        in_review: "bg-warning/15 text-warning-foreground ring-warning/30",
      },
    },
  },
);

interface Props extends VariantProps<typeof variants> {
  status: CustomerStatus;
  className?: string;
}

export function CustomerStatusBadge({ status, className }: Props) {
  return (
    <span className={cn(variants({ status }), className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {CUSTOMER_STATUS_LABELS[status]}
    </span>
  );
}
