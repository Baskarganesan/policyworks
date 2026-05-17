import { ArrowUpRight, ClipboardList, FileText, Users, FileBox, ListChecks } from "lucide-react";
import type { CrossEntityRef, RelatedEntityType } from "./types";

const ICON = {
  claim: ClipboardList,
  policy: FileText,
  customer: Users,
  document: FileBox,
  task: ListChecks,
} satisfies Record<RelatedEntityType, typeof ClipboardList>;

const LABEL: Record<RelatedEntityType, string> = {
  claim: "Claim",
  policy: "Policy",
  customer: "Customer",
  document: "Document",
  task: "Task",
};

export function CrossEntityLink({ ref }: { ref: CrossEntityRef }) {
  const Icon = ICON[ref.type];
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1 rounded-md border bg-card px-1.5 py-0.5 text-[11px] font-medium text-foreground transition-colors hover:bg-accent"
    >
      <Icon className="h-3 w-3 text-muted-foreground" />
      <span className="text-muted-foreground">{LABEL[ref.type]}</span>
      <span className="font-mono">{ref.label}</span>
      <ArrowUpRight className="h-2.5 w-2.5 text-muted-foreground" />
    </button>
  );
}
