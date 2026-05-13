import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FileText, Search, SlidersHorizontal, Upload, X } from "lucide-react";
import { ContentContainer } from "@/components/layout/ContentContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { UploadDropzone } from "@/features/documents/UploadDropzone";
import {
  UploadProgressCard,
  type UploadItem,
} from "@/features/documents/UploadProgressCard";
import { DocumentsTable } from "@/features/documents/DocumentsTable";
import { DocumentPreviewDrawer } from "@/features/documents/DocumentPreviewDrawer";
import {
  MOCK_DOCUMENTS,
  POLICY_TYPES,
  type DocumentStatus,
  type PolicyDocument,
  type PolicyType,
} from "@/features/documents/types";

export const Route = createFileRoute("/documents")({
  head: () => ({
    meta: [
      { title: "Policy Documents — Policyworks" },
      {
        name: "description",
        content: "Upload, organize, and search insurance policy documents.",
      },
    ],
  }),
  component: DocumentsPage,
});

const STATUS_OPTIONS: { value: "all" | DocumentStatus; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "uploaded", label: "Uploaded" },
  { value: "processing", label: "Processing" },
  { value: "indexed", label: "Indexed" },
  { value: "failed", label: "Failed" },
];

function inferPolicyType(name: string): PolicyType {
  const n = name.toLowerCase();
  if (n.includes("auto")) return "Auto";
  if (n.includes("home")) return "Home";
  if (n.includes("life")) return "Life";
  if (n.includes("health")) return "Health";
  if (n.includes("umbrella")) return "Umbrella";
  return "Commercial";
}

function DocumentsPage() {
  const [documents, setDocuments] = useState<PolicyDocument[]>(MOCK_DOCUMENTS);
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [search, setSearch] = useState("");
  const [policyFilter, setPolicyFilter] = useState<"all" | PolicyType>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | DocumentStatus>("all");
  const [selected, setSelected] = useState<PolicyDocument | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filtered = useMemo(() => {
    return documents.filter((d) => {
      if (policyFilter !== "all" && d.policyType !== policyFilter) return false;
      if (statusFilter !== "all" && d.status !== statusFilter) return false;
      if (search && !d.fileName.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [documents, search, policyFilter, statusFilter]);

  const filtersActive = policyFilter !== "all" || statusFilter !== "all" || search.length > 0;
  const hasNoDocs = documents.length === 0;
  const noResults = !hasNoDocs && filtered.length === 0;

  const handleSelect = (doc: PolicyDocument) => {
    setSelected(doc);
    setDrawerOpen(true);
  };

  const handleDelete = (doc: PolicyDocument) => {
    setDocuments((prev) => prev.filter((d) => d.id !== doc.id));
  };

  const simulateUpload = (file: File) => {
    const id = `u_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    setUploads((prev) => [
      ...prev,
      { id, file, progress: 0, status: "uploading" },
    ]);

    const interval = setInterval(() => {
      setUploads((prev) => {
        const item = prev.find((u) => u.id === id);
        if (!item || item.status !== "uploading") {
          clearInterval(interval);
          return prev;
        }
        const next = Math.min(100, item.progress + Math.random() * 18 + 6);
        if (next >= 100) {
          clearInterval(interval);
          // 12% chance of simulated failure for demo realism
          const failed = Math.random() < 0.12;
          // Add to docs on success
          if (!failed) {
            const isPdf = file.name.toLowerCase().endsWith(".pdf");
            const newDoc: PolicyDocument = {
              id: `doc_${id}`,
              fileName: file.name,
              fileType: isPdf ? "pdf" : "docx",
              uploadDate: new Date().toISOString(),
              status: "processing",
              fileSize: file.size,
              policyType: inferPolicyType(file.name),
              uploadedBy: "You",
            };
            setDocuments((d) => [newDoc, ...d]);
          }
          return prev.map((u) =>
            u.id === id
              ? failed
                ? { ...u, progress: 100, status: "error", error: "Upload failed. Please retry." }
                : { ...u, progress: 100, status: "success" }
              : u,
          );
        }
        return prev.map((u) => (u.id === id ? { ...u, progress: next } : u));
      });
    }, 220);
  };

  const handleFiles = (files: File[]) => files.forEach(simulateUpload);

  const dismissUpload = (id: string) => setUploads((prev) => prev.filter((u) => u.id !== id));
  const retryUpload = (id: string) => {
    const item = uploads.find((u) => u.id === id);
    if (!item) return;
    dismissUpload(id);
    simulateUpload(item.file);
  };

  const clearFilters = () => {
    setSearch("");
    setPolicyFilter("all");
    setStatusFilter("all");
  };

  return (
    <ContentContainer>
      <PageHeader
        title="Policy Documents"
        description="Upload, organize, and search policies, endorsements, and certificates."
      />

      <div className="mt-8 space-y-6">
        {/* Upload section */}
        <section className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <UploadDropzone onFiles={handleFiles} />
          <Card className="flex flex-col gap-3 p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Upload className="h-3.5 w-3.5" />
              </div>
              <h3 className="text-sm font-semibold">Supported formats</h3>
            </div>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>• PDF — scanned or digital policies</li>
              <li>• DOCX — endorsements, riders, ACORDs</li>
              <li>• Up to 25 MB per file</li>
            </ul>
            <p className="mt-auto text-xs text-muted-foreground">
              Files are processed and indexed automatically once uploaded.
            </p>
          </Card>
        </section>

        {uploads.length > 0 && (
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Recent uploads</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setUploads((prev) => prev.filter((u) => u.status === "uploading"))
                }
              >
                Clear completed
              </Button>
            </div>
            <div className="space-y-2">
              {uploads.map((item) => (
                <UploadProgressCard
                  key={item.id}
                  item={item}
                  onDismiss={dismissUpload}
                  onRetry={retryUpload}
                />
              ))}
            </div>
          </section>
        )}

        {/* Filters + table */}
        <section className="space-y-4">
          <div className="sticky top-14 z-10 -mx-4 flex flex-wrap items-center gap-2 border-b bg-background/80 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <div className="relative min-w-0 flex-1 sm:max-w-sm">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by file name…"
                className="h-9 pl-8"
              />
            </div>
            <Select
              value={policyFilter}
              onValueChange={(v) => setPolicyFilter(v as "all" | PolicyType)}
            >
              <SelectTrigger className="h-9 w-[150px]">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All policies</SelectItem>
                {POLICY_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as "all" | DocumentStatus)}
            >
              <SelectTrigger className="h-9 w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {filtersActive && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-3.5 w-3.5" />
                Clear
              </Button>
            )}
            <div className="ml-auto text-xs text-muted-foreground">
              {filtered.length} of {documents.length} documents
            </div>
          </div>

          {hasNoDocs ? (
            <EmptyState
              icon={<FileText className="h-5 w-5" />}
              title="No documents uploaded"
              description="Drop a PDF or DOCX above to begin building your policy library."
            />
          ) : noResults ? (
            <EmptyState
              icon={<Search className="h-5 w-5" />}
              title="No documents match your filters"
              description="Try a different search term or clear active filters to see everything."
              action={
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear filters
                </Button>
              }
            />
          ) : (
            <DocumentsTable
              documents={filtered}
              onSelect={handleSelect}
              onDelete={handleDelete}
            />
          )}
        </section>
      </div>

      <DocumentPreviewDrawer
        document={selected}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </ContentContainer>
  );
}
