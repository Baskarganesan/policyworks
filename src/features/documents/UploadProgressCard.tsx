import { CheckCircle2, AlertCircle, X, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { FileTypeIcon } from "./FileTypeIcon";
import { formatFileSize } from "./types";
import { cn } from "@/lib/utils";

export interface UploadItem {
  id: string;
  file: File;
  progress: number; // 0-100
  status: "uploading" | "success" | "error";
  error?: string;
}

interface UploadProgressCardProps {
  item: UploadItem;
  onDismiss?: (id: string) => void;
  onRetry?: (id: string) => void;
}

export function UploadProgressCard({ item, onDismiss, onRetry }: UploadProgressCardProps) {
  const isPdf = item.file.name.toLowerCase().endsWith(".pdf");
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-card p-3">
      <FileTypeIcon type={isPdf ? "pdf" : "docx"} />
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex items-center justify-between gap-3">
          <p className="truncate text-sm font-medium">{item.file.name}</p>
          <span className="shrink-0 text-xs text-muted-foreground">
            {formatFileSize(item.file.size)}
          </span>
        </div>
        {item.status === "uploading" && (
          <div className="space-y-1">
            <Progress value={item.progress} className="h-1.5" />
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              Uploading… {Math.round(item.progress)}%
            </div>
          </div>
        )}
        {item.status === "success" && (
          <div className="flex items-center gap-1.5 text-xs text-success">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Upload complete · queued for processing
          </div>
        )}
        {item.status === "error" && (
          <div className="flex items-center gap-1.5 text-xs text-destructive">
            <AlertCircle className="h-3.5 w-3.5" />
            {item.error ?? "Upload failed"}
          </div>
        )}
      </div>
      <div className="flex items-center gap-1">
        {item.status === "error" && onRetry && (
          <Button size="sm" variant="ghost" onClick={() => onRetry(item.id)}>
            Retry
          </Button>
        )}
        {onDismiss && (
          <Button
            size="icon"
            variant="ghost"
            className={cn("h-7 w-7", item.status === "uploading" && "opacity-60")}
            onClick={() => onDismiss(item.id)}
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
