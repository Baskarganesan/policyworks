import { useState } from "react";
import { FileText, Paperclip } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { OperationalInsightsPanel } from "@/features/insights/OperationalInsightsPanel";
import { getInsightsForClaim } from "@/features/insights/mockData";
import { ClaimStatusBadge } from "./ClaimStatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import { ClaimSummaryCard } from "./ClaimSummaryCard";
import { ActivityTimeline } from "./ActivityTimeline";
import { NotesPanel } from "./NotesPanel";
import {
  CLAIM_TYPE_LABELS,
  POLICY_TYPE_LABELS,
  type Claim,
  type ClaimComment,
  type TimelineEvent,
} from "./types";

interface ClaimDetailDrawerProps {
  claim: Claim | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  comments: ClaimComment[];
  timeline: TimelineEvent[];
  onAddComment: (claimId: string, message: string, internal: boolean) => void;
}

function formatAmount(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ClaimDetailDrawer({
  claim,
  open,
  onOpenChange,
  comments,
  timeline,
  onAddComment,
}: ClaimDetailDrawerProps) {
  const [tab, setTab] = useState("overview");

  if (!claim) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:max-w-xl lg:max-w-2xl"
      >
        <SheetHeader className="space-y-3 border-b p-6">
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            {claim.id}
          </div>
          <SheetTitle className="text-xl leading-tight">
            {CLAIM_TYPE_LABELS[claim.claimType]} — {claim.customerName}
          </SheetTitle>
          <SheetDescription className="text-sm">{claim.description}</SheetDescription>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <ClaimStatusBadge status={claim.status} />
            <PriorityBadge priority={claim.priority} />
            <span className="text-xs text-muted-foreground">
              Last updated {formatDate(claim.updatedAt)}
            </span>
          </div>
        </SheetHeader>

        <Tabs value={tab} onValueChange={setTab} className="flex min-h-0 flex-1 flex-col">
          <div className="border-b px-6">
            <TabsList className="h-10 bg-transparent p-0">
              <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none">
                Overview
              </TabsTrigger>
              <TabsTrigger value="activity" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none">
                Activity
              </TabsTrigger>
              <TabsTrigger value="notes" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none">
                Notes ({comments.length})
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="flex-1">
            <TabsContent value="overview" className="m-0 space-y-6 p-6">
              <OperationalInsightsPanel insights={getInsightsForClaim(claim.id)} compact />

              <section className="grid grid-cols-2 gap-3">
                <ClaimSummaryCard label="Amount" value={formatAmount(claim.amount)} />
                <ClaimSummaryCard label="Incident Date" value={formatDate(claim.incidentDate)} />
                <ClaimSummaryCard
                  label="Policy Type"
                  value={POLICY_TYPE_LABELS[claim.policyType]}
                  hint={claim.policyNumber}
                />
                <ClaimSummaryCard label="Assigned Adjuster" value={claim.assignedAgent} />
              </section>

              <section className="space-y-3">
                <h3 className="text-sm font-semibold">Customer</h3>
                <div className="rounded-lg border bg-card p-4">
                  <div className="text-sm font-medium">{claim.customerName}</div>
                  <div className="text-sm text-muted-foreground">{claim.customerEmail}</div>
                  <Separator className="my-3" />
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <div className="text-muted-foreground">Policy #</div>
                      <div className="font-mono">{claim.policyNumber}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Created</div>
                      <div>{formatDate(claim.createdAt)}</div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-3">
                <h3 className="text-sm font-semibold">
                  Attachments ({claim.attachments.length})
                </h3>
                {claim.attachments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No attachments uploaded yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {claim.attachments.map((att) => (
                      <li
                        key={att.id}
                        className="flex items-center justify-between rounded-lg border bg-card p-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                          <div className="min-w-0">
                            <div className="truncate text-sm font-medium">{att.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {att.sizeKb < 1024
                                ? `${att.sizeKb} KB`
                                : `${(att.sizeKb / 1024).toFixed(1)} MB`}
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          Download
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
                <Button variant="outline" size="sm" className="w-full">
                  <Paperclip className="mr-1.5 h-3.5 w-3.5" />
                  Attach file
                </Button>
              </section>
            </TabsContent>

            <TabsContent value="activity" className="m-0 p-6">
              <ActivityTimeline events={timeline} />
            </TabsContent>

            <TabsContent value="notes" className="m-0 p-6">
              <NotesPanel
                comments={comments}
                onAdd={(msg, internal) => onAddComment(claim.id, msg, internal)}
              />
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
