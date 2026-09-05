
import { lazy, Suspense, useState } from "react";

import { WizardTableToolbar } from "./WizardTableToolbar";
import { useWizards } from "../hooks/useWizards";
import { Pagination } from "../../../components/ui/Pagination";
import { usePagination } from "../../../hooks/usePagination";
import type { Wizard } from "../types/wizard";
import { WizardCardList } from "./WizardCardList";
import { WizardDesktopTable } from "./WizardDesktopTable";

const WizardDetailsModal = lazy(() => import("./WizardDetailsModal"));

export const WizardsTable = () => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedWizard, setSelectedWizard] = useState<Wizard | null>(null)
  const {
    wizards,
    isLoading,
    isFetching,
    isError,
    error,
    debouncedSearch,
  } = useWizards(searchValue)

  const {
    pageCount,
    pageEndIndex,
    pageStartIndex,
    safeCurrentPage,
    setCurrentPage,
    visibleItems
  } = usePagination(wizards, 4)


  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setCurrentPage(1);
  };

  return (
    <section className="mt-8 overflow-hidden rounded-card border border-primary/10 bg-canvas/80 shadow-card backdrop-blur-card">
      <WizardTableToolbar
        searchValue={searchValue}
        isSearchPending={searchValue.trim() !== debouncedSearch.trim()}
        onSearchChange={handleSearchChange}
      />

      <WizardCardList
        wizards={visibleItems}
        isLoading={isLoading}
        isError={isError}
        error={error instanceof Error ? error : null}
        onView={setSelectedWizard}
      />

      <WizardDesktopTable
        wizards={visibleItems}
        isLoading={isLoading}
        isError={isError}
        error={error instanceof Error ? error : null}
        onView={setSelectedWizard}
      />

      <div className="relative">
        {isFetching && !isLoading ? (
          <p className="px-4 pt-3 text-sm text-disabled sm:px-6">Updating...</p>
        ) : null}
        <Pagination
          currentPage={safeCurrentPage}
          pageCount={pageCount}
          onPageChange={setCurrentPage}
          totalItems={wizards.length}
          pageStartIndex={pageStartIndex}
          pageEndIndex={pageEndIndex}
        />
      </div>

      {selectedWizard && (
        <Suspense fallback={null}>
          <WizardDetailsModal
            wizard={selectedWizard}
            isOpen={true}
            onClose={() => setSelectedWizard(null)}
          />
        </Suspense>
      )}
    </section>
  );
};
