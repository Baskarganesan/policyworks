import {
  FileText,
  FileImage,
  FileCheck2,
  FileWarning,
  FileBox,
  Sparkles,
  Eye,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { CaseDocument, CaseDocumentStatus } from "./types";

const KIND_ICON: Record<CaseDocument["kind"], LucideIcon> = {
  contract: FileText,
  endorsement: FileCheck2,
  photo: FileImage,
  report: FileText,
  correspondence: FileText,
  evidence: FileBox,
};

const STATUS_META: Record<
  CaseDocumentStatus,
  { label: string; tone: string }
> = {
  indexed: { label: "Indexed", tone: "bg-muted text-muted-foreground" },
  pending_review: { label: "Pending review", tone: "bg-warning/15 text-warning-foreground" },
  missing: { label: "Missing", tone: "bg-destructive/10 text-destructive" },
  ai_reviewed: { label: "AI reviewed", tone: "bg-info/10 text-info" },
};

function formatRelative(iso?: string) {
  if (!iso) return null;
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

export function EvidencePanel({ documents }: { documents: CaseDocument[] }) {
  if (documents.length === 0) {
    return <p className="text-sm text-muted-foreground">No documents on this case yet.</p>;
  }

  return (
    <div className="grid gap-2 md:grid-cols-2">
      {documents.map((d) => {
        const Icon = KIND_ICON[d.kind];
        const status = STATUS_META[d.status];
        const isMissing = d.status === "missing";
        const rel = formatRelative(d.uploadedAt);

        return (
          <div
            key={d.id}
            className={cn(
              "flex flex-col gap-2 rounded-lg border bg-card p-3",
              isMissing && "border-destructive/40 bg-destructive/5",
            )}
          >
            <div className="flex items-start gap-2.5">
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
                  isMissing ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground",
                )}
              >
                {isMissing ? <FileWarning className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </span>
              <div className="min-w-0 flex-1 space-y-0.5">
                <p className="truncate text-sm font-medium">{d.name}</p>
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span className="capitalize">{d.kind}</span>
                  {d.uploadedBy && (
                    <>
                      <span>·</span>
                      <span>{d.uploadedBy}</span>
                    </>
                  )}
                  {rel && (
                    <>
                      <span>·</span>
                      <span>{rel}</span>
                    </>
                  )}
                  {d.relatedEntity && (
                    <>
                      <span>·</span>
                      <span className="font-mono">
                        {d.relatedEntity.type}:{d.relatedEntity.label}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                  status.tone,
                )}
              >
                {status.label}
              </span>
            </div>

            {d.aiSummary && (
              <p className="flex items-start gap-1.5 rounded-md bg-info/5 px-2 py-1.5 text-[11px] text-foreground/80">
                <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-info" />
                <span>{d.aiSummary}</span>
              </p>
            )}

            <div className="flex items-center gap-1.5">
              {isMissing ? (
                <Button size="sm" variant="default" className="h-7 px-2 text-xs">
                  Request document
                </Button>
              ) : (
                <Button size="sm" variant="outline" className="h-7 gap-1 px-2 text-xs">
                  <Eye className="h-3 w-3" /> Preview
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
