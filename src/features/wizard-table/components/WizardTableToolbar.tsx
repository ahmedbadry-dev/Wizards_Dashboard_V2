
import { IconFilter } from "../../../components/icons";
import { SearchInput } from "../../../components/ui/SearchInput";

type WizardTableToolbarProps = {
  searchValue: string;
  isSearchPending: boolean;
  onSearchChange: (value: string) => void;
};

export const WizardTableToolbar = ({
  searchValue,
  isSearchPending,
  onSearchChange,
}: WizardTableToolbarProps) => {
  return (
    <div className="flex flex-col gap-4 p-4 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
      <h2 className="section-title">Master Wizard Registry</h2>

      <div className="w-full lg:max-w-md">
        <div className="flex w-full overflow-hidden rounded-lg border border-border/30 bg-surface">
          <SearchInput
            aria-label="Search wizards"
            autoComplete="off"
            className="min-w-0 flex-1 border-0 bg-transparent"
            placeholder="Search wizards..."
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
          />
          <span className="h-6 w-px shrink-0 self-center bg-border/30" />
          <button
            className="flex h-11 w-11 shrink-0 items-center justify-center text-body-muted transition-colors hover:bg-primary/10 hover:text-primary sm:w-auto sm:gap-2 sm:px-4"
            type="button"
            aria-label="Filter wizard records"
            title="Filter wizard records"
          >
            <IconFilter className="h-4 w-4" />
            <span className="hidden sm:inline">Filter</span>
          </button>
        </div>
        <p
          className="mt-2 min-h-4 text-xs text-body-muted"
          role="status"
          aria-live="polite"
        >
          {isSearchPending ? "Searching..." : null}
        </p>
      </div>
    </div>
  );
};
