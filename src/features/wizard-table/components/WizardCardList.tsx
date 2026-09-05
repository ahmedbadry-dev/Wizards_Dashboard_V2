import type { Wizard } from "../types/wizard";
import { WizardCard } from "./WizardCard";

type WizardCardListProps = {
  wizards: Wizard[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  onView: (wizard: Wizard) => void;
};

const skeletonCards = Array.from({ length: 4 }, (_, index) => index);

export function WizardCardList({
  wizards,
  isLoading,
  isError,
  error,
  onView,
}: WizardCardListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 xl:hidden">
        {skeletonCards.map((card) => (
          <div
            key={card}
            className="h-48 animate-pulse rounded-card border border-primary/10 bg-surface-raised/30 p-4 shadow-card"
          >
            <div className="h-5 w-2/3 rounded bg-primary/15" />
            <div className="mt-2 h-3 w-1/2 rounded bg-primary/10" />
            <div className="my-4 h-px bg-border/20" />
            <div className="space-y-3">
              <div className="h-4 rounded bg-primary/10" />
              <div className="h-4 rounded bg-primary/10" />
              <div className="h-7 w-3/4 rounded-full bg-primary/10" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="px-4 py-14 text-center text-sm text-danger xl:hidden">
        {error?.message ?? "Unable to load wizard records"}
      </div>
    );
  }

  if (wizards.length === 0) {
    return (
      <div className="px-4 py-14 text-center text-sm text-disabled xl:hidden">
        No wizard records found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 xl:hidden">
      {wizards.map((wizard) => (
        <WizardCard
          key={wizard.id}
          wizard={wizard}
          onView={() => onView(wizard)}
        />
      ))}
    </div>
  );
}
