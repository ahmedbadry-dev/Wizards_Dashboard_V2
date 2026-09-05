import { Button } from "./Button";

type PaginationProps = {
  currentPage: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  pageStartIndex?: number;
  pageEndIndex?: number;
};

export function Pagination({
  currentPage,
  pageCount,
  onPageChange,
  totalItems,
  pageStartIndex,
  pageEndIndex,
}: PaginationProps) {
  const goToPage = (page: number) => {
    onPageChange(Math.min(Math.max(page, 1), pageCount));
  };
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(pageCount, currentPage + 2);
  const visiblePages = Array.from(
    { length: end - start + 1 },
    (_, index) => start + index,
  );
  const showFirstPage = !visiblePages.includes(1);
  const showLastPage = !visiblePages.includes(pageCount);
  const showStartDots = start > 2;
  const showEndDots = end < pageCount - 1;
  const summary =
    typeof totalItems === "number" &&
    typeof pageStartIndex === "number" &&
    typeof pageEndIndex === "number"
      ? `Showing ${totalItems > 0 ? `${pageStartIndex + 1}-${pageEndIndex} of ${totalItems}` : "0"} records`
      : `Page ${currentPage} of ${pageCount}`;

  return (
    <div className="flex flex-col gap-3 border-t border-border/20 bg-surface-raised/30 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <p className="text-sm text-body-muted">
        {summary}
      </p>
      <div className="flex items-center justify-between gap-2 sm:justify-end">
        <Button
          variant="ghost"
          className="h-11 min-w-0 flex-1 px-2 sm:min-w-11 sm:flex-none sm:px-3"
          aria-label="Go to previous page"
          disabled={currentPage <= 1}
          onClick={() => goToPage(currentPage - 1)}
        >
          Previous
        </Button>
        <span className="shrink-0 px-1 text-center text-xs font-semibold text-body sm:hidden">
          Page {currentPage} of {pageCount}
        </span>
        <div className="hidden items-center gap-2 sm:flex">
          {showFirstPage ? (
            <Button
              variant={currentPage === 1 ? "secondary" : "ghost"}
              className="h-11 min-w-11 px-3"
              aria-label="Go to page 1"
              aria-current={currentPage === 1 ? "page" : undefined}
              onClick={() => goToPage(1)}
            >
              1
            </Button>
          ) : null}
          {showStartDots ? <span className="text-body-muted">...</span> : null}
          {visiblePages.map((page) => (
            <Button
              key={page}
              variant={page === currentPage ? "secondary" : "ghost"}
              className="h-11 min-w-11 px-3"
              aria-label={`Go to page ${page}`}
              aria-current={page === currentPage ? "page" : undefined}
              onClick={() => goToPage(page)}
            >
              {page}
            </Button>
          ))}
          {showEndDots ? <span className="text-body-muted">...</span> : null}
          {showLastPage ? (
            <Button
              variant={currentPage === pageCount ? "secondary" : "ghost"}
              className="h-11 min-w-11 px-3"
              aria-label={`Go to page ${pageCount}`}
              aria-current={currentPage === pageCount ? "page" : undefined}
              onClick={() => goToPage(pageCount)}
            >
              {pageCount}
            </Button>
          ) : null}
        </div>
        <Button
          variant="ghost"
          className="h-11 min-w-0 flex-1 px-2 sm:min-w-11 sm:flex-none sm:px-3"
          aria-label="Go to next page"
          disabled={currentPage >= pageCount}
          onClick={() => goToPage(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
