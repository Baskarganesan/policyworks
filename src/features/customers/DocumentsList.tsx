import { FileText, FileImage, FileArchive, FileSpreadsheet, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { FileText as Empty } from "lucide-react";
import type { CustomerDocument } from "./types";

function iconFor(name: string) {
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext === "zip" || ext === "rar") return FileArchive;
  if (ext === "xlsx" || ext === "csv") return FileSpreadsheet;
  if (ext === "jpg" || ext === "jpeg" || ext === "png") return FileImage;
  return FileText;
}

const CATEGORY_LABELS: Record<CustomerDocument["category"], string> = {
  policy: "Policy",
  endorsement: "Endorsement",
  claim: "Claim",
  id: "ID",
  other: "Other",
};

const STATUS_TONE: Record<CustomerDocument["status"], string> = {
  indexed: "bg-success/10 text-success",
  processing: "bg-warning/15 text-warning-foreground",
  failed: "bg-destructive/10 text-destructive",
};

function formatSize(kb: number) {
  if (kb < 1024) return `${kb} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function DocumentsList({ documents }: { documents: CustomerDocument[] }) {
  if (documents.length === 0) {
    return (
      <EmptyState
        icon={<Empty className="h-5 w-5" />}
        title="No documents uploaded"
        description="Policy documents, endorsements, and claim attachments will appear here."
        className="bg-card"
      />
    );
  }

  return (
    <div className="divide-y rounded-lg border bg-card">
      {documents.map((d) => {
        const Icon = iconFor(d.name);
        return (
          <div key={d.id} className="flex items-center gap-3 p-3 hover:bg-muted/40">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-medium">{d.name}</span>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${STATUS_TONE[d.status]}`}>
                  {d.status}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                {CATEGORY_LABELS[d.category]} · {formatSize(d.sizeKb)} · {formatDate(d.uploadedAt)}
              </div>
            </div>
            <div className="hidden gap-1 sm:flex">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
