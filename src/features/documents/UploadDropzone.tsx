import { useCallback, useRef, useState, type DragEvent } from "react";
import { Upload, FilePlus2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UploadDropzoneProps {
  onFiles: (files: File[]) => void;
  accept?: string;
}

const ACCEPTED = [".pdf", ".docx"];

function isAccepted(file: File) {
  const name = file.name.toLowerCase();
  return ACCEPTED.some((ext) => name.endsWith(ext));
}

export function UploadDropzone({ onFiles, accept = ".pdf,.docx" }: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (list: FileList | null) => {
      if (!list) return;
      const accepted = Array.from(list).filter(isAccepted);
      if (accepted.length) onFiles(accepted);
    },
    [onFiles],
  );

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      className={cn(
        "group relative flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-card p-8 text-center transition-all",
        isDragging
          ? "border-primary bg-primary/5 ring-4 ring-primary/10"
          : "hover:border-primary/40 hover:bg-accent/40",
      )}
    >
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-muted-foreground transition-colors",
          isDragging && "bg-primary/10 text-primary",
        )}
      >
        <Upload className="h-5 w-5" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium">
          {isDragging ? "Drop to upload" : "Drag & drop policy documents here"}
        </p>
        <p className="text-xs text-muted-foreground">
          PDF or DOCX, up to 25 MB each. Multiple files supported.
        </p>
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => inputRef.current?.click()}
        className="mt-1"
      >
        <FilePlus2 className="h-4 w-4" />
        Browse files
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        className="sr-only"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
