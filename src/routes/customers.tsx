import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download, Plus, SearchX, Users } from "lucide-react";
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
import { CustomersFilters, type CustomersFilterState } from "@/features/customers/CustomersFilters";
import { CustomersTable } from "@/features/customers/CustomersTable";
import { CustomerDetailDrawer } from "@/features/customers/CustomerDetailDrawer";
import { MOCK_CUSTOMERS } from "@/features/customers/mockData";
import type { Customer, CustomerNote } from "@/features/customers/types";

export const Route = createFileRoute("/customers")({
  head: () => ({
    meta: [
      { title: "Customers — Policyworks" },
      { name: "description", content: "Manage policyholders, contacts, and household relationships." },
    ],
  }),
  component: CustomersPage,
});

const PAGE_SIZE = 8;

function CustomersPage() {
  const [filters, setFilters] = useState<CustomersFilterState>({
    query: "",
    status: "all",
    agent: "all",
  });
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);

  const filtered = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    return customers.filter((c) => {
      if (filters.status !== "all" && c.status !== filters.status) return false;
      if (filters.agent !== "all" && c.assignedAgent !== filters.agent) return false;
      if (
        q &&
        ![c.fullName, c.email, c.phone, c.id, ...c.policies.map((p) => p.policyNumber)]
          .join(" ")
          .toLowerCase()
          .includes(q)
      )
        return false;
      return true;
    });
  }, [customers, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const activeCustomer = customers.find((c) => c.id === activeId) ?? null;

  const openCustomer = (c: Customer) => {
    setActiveId(c.id);
    setDrawerOpen(true);
  };

  const handleAddNote = (customerId: string, message: string) => {
    const note: CustomerNote = {
      id: `N-${Date.now()}`,
      author: "You",
      message,
      timestamp: new Date().toISOString(),
    };
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, notes: [note, ...c.notes] } : c)),
    );
  };

  const hasAny = customers.length > 0;
  const hasResults = filtered.length > 0;

  return (
    <ContentContainer>
      <div className="sticky top-14 z-10 -mx-4 -mt-6 border-b bg-background/95 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <PageHeader
          className="border-b-0 pb-0"
          title="Customers"
          description={
            selectedIds.size > 0
              ? `${selectedIds.size} selected`
              : `${filtered.length} of ${customers.length} policyholders`
          }
          actions={
            <>
              {selectedIds.size > 0 && (
                <Button variant="outline" size="sm">
                  Assign agent
                </Button>
              )}
              <Button variant="outline" size="sm">
                <Download className="mr-1.5 h-3.5 w-3.5" />
                Export
              </Button>
              <Button size="sm">
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Add customer
              </Button>
            </>
          }
        />
      </div>

      <div className="mt-6 space-y-4">
        <CustomersFilters
          value={filters}
          onChange={(next) => {
            setFilters(next);
            setPage(1);
          }}
        />

        {!hasAny ? (
          <EmptyState
            icon={<Users className="h-5 w-5" />}
            title="No customers yet"
            description="Import your customer list or create a profile to start tracking policies and interactions."
          />
        ) : !hasResults ? (
          <EmptyState
            icon={<SearchX className="h-5 w-5" />}
            title="No matching customers"
            description="Try adjusting your filters or search."
          />
        ) : (
          <>
            <CustomersTable
              customers={pageItems}
              selectedIds={selectedIds}
              onSelectedIdsChange={setSelectedIds}
              onRowClick={openCustomer}
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

      <CustomerDetailDrawer
        customer={activeCustomer}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onAddNote={handleAddNote}
      />
    </ContentContainer>
  );
}
