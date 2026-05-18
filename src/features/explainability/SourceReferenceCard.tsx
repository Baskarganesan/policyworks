import { FileText, ClipboardList, Users, FileBox, Scale, Database } from "lucide-react";
import type { SourceReference } from "./types";

const ICON = {
  document: FileBox,
  policy: ClipboardList,
  claim: FileText,
  customer: Users,
  rule: Scale,
  dataset: Database,
} as const;

function formatRelative(iso?: string) {
  if (!iso) return null;
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

export function SourceReferenceCard({ sources }: { sources: SourceReference[] }) {
  if (sources.length === 0) return null;
  return (
    <ul className="grid gap-1.5 sm:grid-cols-2">
      {sources.map((s) => {
        const Icon = ICON[s.kind];
        const rel = formatRelative(s.updatedAt);
        return (
          <li
            key={s.id}
            className="flex items-start gap-2 rounded-md border bg-card px-2.5 py-2"
          >
            <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium">{s.label}</p>
              <p className="truncate text-[11px] text-muted-foreground">
                <span className="font-mono">{s.reference}</span>
                {rel ? ` · updated ${rel}` : ""}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
