import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useExplainability } from "./context";
import type { ExplainabilitySubject } from "./types";

interface Props {
  subject: ExplainabilitySubject;
  label?: string;
  variant?: "ghost" | "outline" | "link";
  size?: "xs" | "sm";
  className?: string;
}

export function ExplainButton({
  subject,
  label = "Why am I seeing this?",
  variant = "ghost",
  size = "xs",
  className,
}: Props) {
  const { open } = useExplainability();
  const isXs = size === "xs";
  return (
    <Button
      type="button"
      size="sm"
      variant={variant}
      onClick={(e) => {
        e.stopPropagation();
        open(subject);
      }}
      className={cn(
        "gap-1 text-muted-foreground hover:text-foreground",
        isXs ? "h-6 px-1.5 text-[11px]" : "h-7 px-2 text-xs",
        className,
      )}
    >
      <HelpCircle className={isXs ? "h-3 w-3" : "h-3.5 w-3.5"} />
      {label}
    </Button>
  );
}
