import {
  ClipboardList,
  FileText,
  Users,
  FileBox,
  ListChecks,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { CaseEntityRef, CaseEntityType, CaseRecord } from "./types";

const ICON: Record<CaseEntityType, LucideIcon> = {
  claim: ClipboardList,
  policy: FileText,
  customer: Users,
  document: FileBox,
  task: ListChecks,
};

const TYPE_LABEL: Record<CaseEntityType, string> = {
  claim: "Claim",
  policy: "Policy",
  customer: "Customer",
  document: "Document",
  task: "Task",
};

function EntityRow({ entity }: { entity: CaseEntityRef }) {
  const Icon = ICON[entity.type];

  const inner = (
    <div className="group flex items-center gap-2.5 rounded-md border bg-card px-2.5 py-2 transition-colors hover:bg-accent/40">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
            {TYPE_LABEL[entity.type]}
          </span>
          <span className="font-mono text-xs">{entity.label}</span>
        </div>
        {entity.sublabel && (
          <p className="truncate text-[11px] text-muted-foreground">{entity.sublabel}</p>
        )}
      </div>
      <ArrowUpRight className="h-3 w-3 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
  );

  if (entity.type === "policy") {
    return (
      <Link to="/policies/$policyId" params={{ policyId: entity.id }}>
        {inner}
      </Link>
    );
  }
  return <div>{inner}</div>;
}

function Group({ title, items }: { title: string; items: CaseEntityRef[] }) {
  if (items.length === 0) return null;
  return (
    <div className="space-y-1.5">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {title} · {items.length}
      </p>
      <div className="space-y-1.5">
        {items.map((e) => (
          <EntityRow key={`${e.type}-${e.id}`} entity={e} />
        ))}
      </div>
    </div>
  );
}

export function LinkedEntitiesPanel({ record }: { record: CaseRecord }) {
  const documents: CaseEntityRef[] = record.documents.map((d) => ({
    type: "document",
    id: d.id,
    label: d.name,
    sublabel: `${d.kind} · ${d.status.replace("_", " ")}`,
  }));
  const taskRefs: CaseEntityRef[] = record.tasks.map((t) => ({
    type: "task",
    id: t.id,
    label: t.title,
    sublabel: `${t.status.replace("_", " ")}${t.assignee ? ` · ${t.assignee}` : ""}`,
  }));

  return (
    <div className="space-y-4">
      <Group title="Customer" items={[record.relatedCustomer]} />
      <Group title="Policies" items={record.relatedPolicies} />
      <Group title="Claims" items={record.relatedClaims} />
      <Group title="Documents" items={documents} />
      <Group title="Tasks" items={taskRefs} />
    </div>
  );
}
