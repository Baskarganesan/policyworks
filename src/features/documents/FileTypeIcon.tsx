import { FileText, FileType2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileTypeIconProps {
  type: "pdf" | "docx";
  className?: string;
}

export function FileTypeIcon({ type, className }: FileTypeIconProps) {
  const isPdf = type === "pdf";
  return (
    <div
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border",
        isPdf
          ? "border-destructive/20 bg-destructive/5 text-destructive"
          : "border-info/20 bg-info/5 text-info",
        className,
      )}
      aria-hidden
    >
      {isPdf ? <FileText className="h-4 w-4" /> : <FileType2 className="h-4 w-4" />}
    </div>
  );
}
