import type { ReactNode } from "react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { SectionNav, type SectionNavItem } from "@/features/policies/SectionNav";
import { CaseSummaryHeader } from "./CaseSummaryHeader";
import type { CaseRecord } from "./types";

export function CaseWorkspaceSection({
  id,
  title,
  description,
  actions,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-32 space-y-3">
      <SectionHeader title={title} description={description} actions={actions} />
      {children}
    </section>
  );
}

export function CaseWorkspaceLayout({
  record,
  navItems,
  main,
  side,
}: {
  record: CaseRecord;
  navItems: SectionNavItem[];
  main: ReactNode;
  side: ReactNode;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="sticky top-14 z-20 bg-background">
        <CaseSummaryHeader record={record} />
      </div>

      <div className="flex-1">
        <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[200px_1fr_320px] lg:px-8 lg:py-8">
          <aside className="hidden lg:block">
            <div className="sticky top-[280px]">
              <p className="px-2.5 pb-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                On this page
              </p>
              <SectionNav items={navItems} />
            </div>
          </aside>

          <div className="min-w-0 space-y-8">{main}</div>

          <aside className="space-y-6 lg:sticky lg:top-[280px] lg:self-start">{side}</aside>
        </div>
      </div>
    </div>
  );
}
