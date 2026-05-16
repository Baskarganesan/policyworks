import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CustomerProfileHeader } from "./CustomerProfileHeader";
import { PolicyCard } from "./PolicyCard";
import { ClaimsHistoryList } from "./ClaimsHistoryList";
import { DocumentsList } from "./DocumentsList";
import { NotesTimeline } from "./NotesTimeline";
import { InteractionFeed } from "./InteractionFeed";
import { CustomerInsightsPanel } from "./CustomerInsightCard";
import type { Customer } from "./types";

interface Props {
  customer: Customer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddNote: (customerId: string, message: string) => void;
}

function SectionTitle({ title, count }: { title: string; count?: number }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h3 className="text-sm font-semibold">{title}</h3>
      {typeof count === "number" && (
        <span className="text-xs text-muted-foreground">{count}</span>
      )}
    </div>
  );
}

export function CustomerDetailDrawer({ customer, open, onOpenChange, onAddNote }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:max-w-2xl lg:max-w-3xl"
      >
        {customer && (
          <>
            <SheetHeader className="sr-only">
              <SheetTitle>{customer.fullName}</SheetTitle>
            </SheetHeader>

            <div className="border-b px-6 pb-2 pt-6">
              <CustomerProfileHeader customer={customer} />
            </div>

            <Tabs defaultValue="overview" className="flex min-h-0 flex-1 flex-col">
              <div className="border-b px-6">
                <TabsList className="h-10 bg-transparent p-0">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="policies" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                    Policies
                  </TabsTrigger>
                  <TabsTrigger value="claims" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                    Claims
                  </TabsTrigger>
                  <TabsTrigger value="documents" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                    Documents
                  </TabsTrigger>
                  <TabsTrigger value="activity" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                    Activity
                  </TabsTrigger>
                </TabsList>
              </div>

              <ScrollArea className="flex-1">
                <div className="px-6 py-5">
                  <TabsContent value="overview" className="mt-0 space-y-6">
                    <CustomerInsightsPanel insights={customer.insights} />

                    <div>
                      <SectionTitle title="Active policies" count={customer.policies.length} />
                      <div className="grid gap-3 sm:grid-cols-2">
                        {customer.policies.slice(0, 4).map((p) => (
                          <PolicyCard key={p.id} policy={p} />
                        ))}
                      </div>
                    </div>

                    <div>
                      <SectionTitle title="Recent claims" count={customer.claims.length} />
                      <ClaimsHistoryList claims={customer.claims.slice(0, 3)} />
                    </div>

                    <div>
                      <SectionTitle title="Recent interactions" />
                      <InteractionFeed interactions={customer.interactions.slice(0, 4)} />
                    </div>
                  </TabsContent>

                  <TabsContent value="policies" className="mt-0">
                    <SectionTitle title="All policies" count={customer.policies.length} />
                    <div className="grid gap-3 sm:grid-cols-2">
                      {customer.policies.map((p) => (
                        <PolicyCard key={p.id} policy={p} />
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="claims" className="mt-0">
                    <SectionTitle title="Claim history" count={customer.claims.length} />
                    <ClaimsHistoryList claims={customer.claims} />
                  </TabsContent>

                  <TabsContent value="documents" className="mt-0">
                    <SectionTitle title="Documents" count={customer.documents.length} />
                    <DocumentsList documents={customer.documents} />
                  </TabsContent>

                  <TabsContent value="activity" className="mt-0 space-y-6">
                    <div>
                      <SectionTitle title="Notes" count={customer.notes.length} />
                      <NotesTimeline
                        notes={customer.notes}
                        onAdd={(message) => onAddNote(customer.id, message)}
                      />
                    </div>
                    <div>
                      <SectionTitle title="Interaction history" count={customer.interactions.length} />
                      <InteractionFeed interactions={customer.interactions} />
                    </div>
                  </TabsContent>
                </div>
              </ScrollArea>
            </Tabs>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

