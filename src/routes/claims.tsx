import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ClipboardList, Download, Plus, SearchX } from "lucide-react";
import { ContentContainer } from "@/components/layout/ContentContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ClaimsFilters, type ClaimsFilterState } from "@/features/claims/ClaimsFilters";
import { ClaimsTable } from "@/features/claims/ClaimsTable";
import { ClaimDetailDrawer } from "@/features/claims/ClaimDetailDrawer";
import {
  MOCK_CLAIMS,
  MOCK_COMMENTS,
  MOCK_TIMELINE,
} from "@/features/claims/mockData";
import type { Claim, ClaimComment } from "@/features/claims/types";

export const Route = createFileRoute("/claims")({
  head: () => ({
    meta: [
      { title: "Claims — Policyworks" },
      { name: "description", content: "Track and manage the lifecycle of insurance claims." },
    ],
  }),
  component: ClaimsPage,
});

const PAGE_SIZE = 6;

function ClaimsPage() {
  const [filters, setFilters] = useState<ClaimsFilterState>({
    query: "",
    status: "all",
    priority: "all",
    agent: "all",
    claimType: "all",
  });
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeClaim, setActiveClaim] = useState<Claim | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [comments, setComments] = useState<ClaimComment[]>(MOCK_COMMENTS);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    return MOCK_CLAIMS.filter((c) => {
      if (filters.status !== "all" && c.status !== filters.status) return false;
      if (filters.priority !== "all" && c.priority !== filters.priority) return false;
      if (filters.agent !== "all" && c.assignedAgent !== filters.agent) return false;
      if (filters.claimType !== "all" && c.claimType !== filters.claimType) return false;
      if (
        q &&
        ![c.id, c.customerName, c.customerEmail, c.policyNumber]
          .join(" ")
          .toLowerCase()
          .includes(q)
      )
        return false;
      return true;
    });
  }, [filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const openClaim = (claim: Claim) => {
    setActiveClaim(claim);
    setDrawerOpen(true);
  };

  const addComment = (claimId: string, message: string, internal: boolean) => {
    const next: ClaimComment = {
      id: `c-${Date.now()}`,
      claimId,
      user: "You",
      message,
      internal,
      timestamp: new Date().toISOString(),
    };
    setComments((prev) => [...prev, next]);
  };

  const claimComments = activeClaim
    ? comments.filter((c) => c.claimId === activeClaim.id)
    : [];
  const claimTimeline = activeClaim
    ? MOCK_TIMELINE.filter((t) => t.claimId === activeClaim.id)
    : [];

  const hasResults = filtered.length > 0;
  const hasAnyClaims = MOCK_CLAIMS.length > 0;

  return (
    <ContentContainer>
      <div className="sticky top-14 z-10 -mx-4 -mt-6 border-b bg-background/95 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <PageHeader
          className="border-b-0 pb-0"
          title="Claims"
          description={
            selectedIds.size > 0
              ? `${selectedIds.size} selected`
              : `${filtered.length} of ${MOCK_CLAIMS.length} claims`
          }
          actions={
            <>
              {selectedIds.size > 0 && (
                <Button variant="outline" size="sm">
                  Bulk reassign
                </Button>
              )}
              <Button variant="outline" size="sm">
                <Download className="mr-1.5 h-3.5 w-3.5" />
                Export
              </Button>
              <Button size="sm">
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                New claim
              </Button>
            </>
          }
        />
      </div>

      <div className="mt-6 space-y-4">
        <ClaimsFilters
          value={filters}
          onChange={(next) => {
            setFilters(next);
            setPage(1);
          }}
        />

        {!hasAnyClaims ? (
          <EmptyState
            icon={<ClipboardList className="h-5 w-5" />}
            title="No claims to display"
            description="Open claims will appear here as they are filed by customers or imported from your carriers."
          />
        ) : !hasResults ? (
          <EmptyState
            icon={<SearchX className="h-5 w-5" />}
            title="No matching claims"
            description="Try adjusting your filters or search to find what you're looking for."
          />
        ) : (
          <>
            <ClaimsTable
              claims={pageItems}
              selectedIds={selectedIds}
              onSelectedIdsChange={setSelectedIds}
              onRowClick={openClaim}
            />

            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        isActive={currentPage === i + 1}
                        onClick={() => setPage(i + 1)}
                        className="cursor-pointer"
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      className={
                        currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </div>

      <ClaimDetailDrawer
        claim={activeClaim}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        comments={claimComments}
        timeline={claimTimeline}
        onAddComment={addComment}
      />
    </ContentContainer>
  );
}
