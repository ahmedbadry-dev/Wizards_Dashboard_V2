import { IconEye } from "../../../components/icons";
import { Badge } from "../../../components/ui/Badge";
import type { Wizard } from "../types/wizard";
import {
  formatWizardId,
  getWizardDisplayName,
  getWizardNameParts,
} from "../utils/wizardFormatters";

type WizardCardProps = {
  wizard: Wizard;
  onView: () => void;
};

export function WizardCard({ wizard, onView }: WizardCardProps) {
  const { firstName, lastName } = getWizardNameParts(wizard);
  const displayName = getWizardDisplayName(wizard);
  const elixirs = wizard.elixirs ?? [];

  return (
    <article className="rounded-card border border-primary/10 bg-surface-raised/30 p-4 shadow-card">
      <div className="flex items-start justify-between gap-3 border-b border-border/20 pb-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold leading-6 text-heading" title={displayName}>
            {displayName}
          </h3>
          <p className="mt-0.5 truncate font-mono text-xs text-body/60" title={wizard.id}>
            {formatWizardId(wizard.id)}
          </p>
        </div>
        <button
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-body-muted transition-colors hover:bg-primary/10 hover:text-heading"
          type="button"
          aria-label={`View ${displayName}`}
          onClick={onView}
        >
          <IconEye className="h-5 w-5" />
        </button>
      </div>

      <div className="grid gap-3 pt-3 text-sm leading-5">
        <div className="grid grid-cols-[6rem_minmax(0,1fr)] items-start gap-3">
          <span className="font-medium text-body/60">First name</span>
          <span className="min-w-0 break-words text-right text-body">{firstName}</span>
        </div>
        <div className="grid grid-cols-[6rem_minmax(0,1fr)] items-start gap-3">
          <span className="font-medium text-body/60">Last name</span>
          <span className="min-w-0 break-words text-right font-semibold text-heading">{lastName}</span>
        </div>

        <div className="pt-1">
          {elixirs.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {elixirs.slice(0, 2).map((elixir) => (
                <Badge
                  key={elixir.id}
                  tone={elixirs.length > 1 ? "neutral" : "warning"}
                  className="max-w-full truncate"
                  title={elixir.name}
                >
                  {elixir.name}
                </Badge>
              ))}
              {elixirs.length > 2 ? (
                <Badge tone="neutral">+{elixirs.length - 2} more</Badge>
              ) : null}
            </div>
          ) : (
            <span className="text-sm text-disabled">None registered</span>
          )}
        </div>
      </div>
    </article>
  );
}
