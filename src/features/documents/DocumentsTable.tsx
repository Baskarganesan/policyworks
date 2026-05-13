import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, ArrowUpDown, Download, MoreHorizontal, Trash2, Eye } from "lucide-react";
import { FileTypeIcon } from "./FileTypeIcon";
import { DocumentStatusBadge } from "./DocumentStatusBadge";
import { formatDate, formatFileSize, type PolicyDocument } from "./types";
import { cn } from "@/lib/utils";

type SortKey = "fileName" | "policyType" | "uploadDate" | "status" | "fileSize";
type SortDir = "asc" | "desc";

interface DocumentsTableProps {
  documents: PolicyDocument[];
  onSelect: (doc: PolicyDocument) => void;
  onDelete?: (doc: PolicyDocument) => void;
}

const STATUS_ORDER: Record<PolicyDocument["status"], number> = {
  failed: 0,
  uploaded: 1,
  processing: 2,
  indexed: 3,
};

export function DocumentsTable({ documents, onSelect, onDelete }: DocumentsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("uploadDate");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sorted = [...documents].sort((a, b) => {
    const dir = sortDir === "asc" ? 1 : -1;
    if (sortKey === "uploadDate")
      return (new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime()) * dir;
    if (sortKey === "fileSize") return (a.fileSize - b.fileSize) * dir;
    if (sortKey === "status") return (STATUS_ORDER[a.status] - STATUS_ORDER[b.status]) * dir;
    return a[sortKey].localeCompare(b[sortKey]) * dir;
  });

  const SortHeader = ({ k, label, className }: { k: SortKey; label: string; className?: string }) => {
    const active = sortKey === k;
    const Icon = !active ? ArrowUpDown : sortDir === "asc" ? ArrowUp : ArrowDown;
    return (
      <TableHead className={className}>
        <button
          type="button"
          onClick={() => toggleSort(k)}
          className={cn(
            "inline-flex items-center gap-1.5 text-xs font-medium transition-colors",
            active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {label}
          <Icon className="h-3 w-3" />
        </button>
      </TableHead>
    );
  };

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <SortHeader k="fileName" label="Document" />
            <SortHeader k="policyType" label="Policy type" />
            <SortHeader k="uploadDate" label="Uploaded" />
            <SortHeader k="status" label="Status" />
            <SortHeader k="fileSize" label="Size" className="text-right" />
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((doc) => (
            <TableRow
              key={doc.id}
              className="group cursor-pointer transition-colors hover:bg-accent/40"
              onClick={() => onSelect(doc)}
            >
              <TableCell className="py-3">
                <div className="flex items-center gap-3">
                  <FileTypeIcon type={doc.fileType} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{doc.fileName}</p>
                    {doc.uploadedBy && (
                      <p className="text-xs text-muted-foreground">by {doc.uploadedBy}</p>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{doc.policyType}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(doc.uploadDate)}
              </TableCell>
              <TableCell>
                <DocumentStatusBadge status={doc.status} />
              </TableCell>
              <TableCell className="text-right text-sm tabular-nums text-muted-foreground">
                {formatFileSize(doc.fileSize)}
              </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100"
                      aria-label="Open actions"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onSelect(doc)}>
                      <Eye className="h-4 w-4" />
                      View details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="h-4 w-4" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => onDelete?.(doc)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
