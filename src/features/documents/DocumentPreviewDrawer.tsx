import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sparkles, Download, FileSearch, Lock } from "lucide-react";
import { FileTypeIcon } from "./FileTypeIcon";
import { DocumentStatusBadge } from "./DocumentStatusBadge";
import { formatDateTime, formatFileSize, type PolicyDocument } from "./types";

interface DocumentPreviewDrawerProps {
  document: PolicyDocument | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function MetaRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

export function DocumentPreviewDrawer({ document, open, onOpenChange }: DocumentPreviewDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-xl">
        {document && (
          <>
            <SheetHeader className="space-y-3 border-b px-6 py-5">
              <div className="flex items-start gap-3">
                <FileTypeIcon type={document.fileType} className="h-11 w-11" />
                <div className="min-w-0 flex-1">
                  <SheetTitle className="truncate text-base">{document.fileName}</SheetTitle>
                  <SheetDescription className="mt-1 flex items-center gap-2">
                    <DocumentStatusBadge status={document.status} />
                    <span className="text-xs text-muted-foreground">
                      {document.policyType} policy
                    </span>
                  </SheetDescription>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button
                  size="sm"
                  className="flex-1"
                  disabled={document.status !== "indexed"}
                >
                  <Sparkles className="h-4 w-4" />
                  Ask AI
                </Button>
              </div>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              <section>
                <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  File details
                </h3>
                <div className="mt-2 divide-y">
                  <MetaRow label="Policy type" value={document.policyType} />
                  <MetaRow label="File type" value={document.fileType.toUpperCase()} />
                  <MetaRow label="Size" value={formatFileSize(document.fileSize)} />
                  {document.pages && <MetaRow label="Pages" value={document.pages} />}
                  <MetaRow label="Uploaded" value={formatDateTime(document.uploadDate)} />
                  {document.uploadedBy && <MetaRow label="Uploaded by" value={document.uploadedBy} />}
                </div>
              </section>

              <Separator className="my-6" />

              <section>
                <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Document preview
                </h3>
                <div className="mt-3 flex h-56 flex-col items-center justify-center gap-2 rounded-xl border border-dashed bg-muted/30 text-center">
                  <FileSearch className="h-6 w-6 text-muted-foreground" />
                  <p className="text-sm font-medium">Inline preview coming soon</p>
                  <p className="max-w-xs text-xs text-muted-foreground">
                    PDF and DOCX rendering will appear here. Download the file to view it now.
                  </p>
                </div>
              </section>

              <Separator className="my-6" />

              <section>
                <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  AI search readiness
                </h3>
                <div className="mt-3 rounded-xl border bg-card p-4">
                  {document.status === "indexed" ? (
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/10 text-success">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Ready for AI search</p>
                        <p className="text-xs text-muted-foreground">
                          This document has been indexed and is available in Policy Q&A.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <Lock className="h-4 w-4" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Not yet available for AI search</p>
                        <p className="text-xs text-muted-foreground">
                          {document.status === "processing"
                            ? "We're indexing this document. It will appear in Policy Q&A shortly."
                            : document.status === "failed"
                              ? "Processing failed. Re-upload the document to try again."
                              : "Document is queued for processing."}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
