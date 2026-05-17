import { FileText, FileBadge, FilePlus2, FileCheck2, FileSignature, Eye, Sparkles, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PolicyDocumentRef } from "./types";
import { formatDate } from "./utils";

const KIND_ICON = {
  policy: FileText,
  rider: FileBadge,
  amendment: FileSignature,
  endorsement: FilePlus2,
  renewal: FileCheck2,
  certificate: FileSignature,
} as const;

const KIND_LABEL = {
  policy: "Master policy",
  rider: "Rider",
  amendment: "Amendment",
  endorsement: "Endorsement",
  renewal: "Renewal",
  certificate: "Certificate",
} as const;

export function PolicyDocumentsPanel({ documents }: { documents: PolicyDocumentRef[] }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {documents.map((d) => {
        const Icon = KIND_ICON[d.kind];
        return (
          <div
            key={d.id}
            className="group flex items-start gap-3 rounded-lg border bg-card p-3 transition-colors hover:border-foreground/20"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{d.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {KIND_LABEL[d.kind]} · {(d.sizeKb / 1024).toFixed(2)} MB · {formatDate(d.uploadedAt)}
                  </div>
                </div>
                <IndexedBadge status={d.aiIndexed} />
              </div>
              <div className="mt-2 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                  <Eye className="mr-1 h-3 w-3" /> Preview
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function IndexedBadge({ status }: { status: PolicyDocumentRef["aiIndexed"] }) {
  if (status === "indexed") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">
        <Sparkles className="h-3 w-3" /> AI indexed
      </span>
    );
  }
  if (status === "processing") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-info/10 px-2 py-0.5 text-[10px] font-medium text-info">
        <Loader2 className="h-3 w-3 animate-spin" /> Processing
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-medium text-destructive">
      <AlertCircle className="h-3 w-3" /> Failed
    </span>
  );
}
