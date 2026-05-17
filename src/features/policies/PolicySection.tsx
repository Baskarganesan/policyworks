import type { ReactNode } from "react";
import { SectionHeader } from "@/components/shared/SectionHeader";

export function PolicySection({
  id, title, description, actions, children,
}: { id: string; title: string; description?: string; actions?: ReactNode; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-32 space-y-3">
      <SectionHeader title={title} description={description} actions={actions} />
      {children}
    </section>
  );
}
