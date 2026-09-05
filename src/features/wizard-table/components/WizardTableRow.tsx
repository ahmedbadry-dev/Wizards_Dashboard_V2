
import { IconEye } from "../../../components/icons";
import { Badge } from "../../../components/ui/Badge";
import type { Wizard } from "../types/wizard";
import {
  formatWizardId,
  getWizardDisplayName,
  getWizardNameParts,
} from "../utils/wizardFormatters";

type WizardTableRowProps = {
  wizard: Wizard,
  onView: () => void;
};

export const WizardTableRow = ({ wizard, onView }: WizardTableRowProps) => {
  const { firstName, lastName } = getWizardNameParts(wizard);
  const displayName = getWizardDisplayName(wizard);
  const elixirs = wizard.elixirs ?? [];
  const hiddenElixirs = elixirs.slice(2);
  const hiddenElixirsTooltipId = `wizard-${wizard.id}-hidden-elixirs`;

  return (
    <tr className="border-b border-border/40 transition-colors hover:bg-primary/5">
      <td className="whitespace-nowrap px-6 py-5 text-sm font-medium text-primary">
        {formatWizardId(wizard.id)}
      </td>
      <td className="px-6 py-5 text-sm text-heading">{firstName}</td>
      <td className="px-6 py-5 text-sm font-semibold text-heading">{lastName}</td>
      <td className="px-6 py-5">
        {elixirs.length > 0 ? (
          <div className="flex max-w-xl flex-wrap gap-2">
            {elixirs.slice(0, 2).map((elixir) => (
              <Badge
                key={elixir.id}
                tone={elixirs.length > 1 ? "neutral" : "warning"}
                className="max-w-full truncate font-medium"
                title={elixir.name}
              >
                {elixir.name}
              </Badge>
            ))}
            {elixirs.length > 2 ? (
              <span className="group relative inline-flex">
                <Badge
                  tone="neutral"
                  className="cursor-help outline-none ring-primary/50 focus-visible:ring-2"
                  tabIndex={0}
                  aria-describedby={hiddenElixirsTooltipId}
                >
                  +{elixirs.length - 2} more
                </Badge>
                <span
                  id={hiddenElixirsTooltipId}
                  role="tooltip"
                  className="pointer-events-none absolute left-0 top-full z-20 mt-2 w-max max-w-72 rounded-lg border border-body-muted/20 bg-surface px-3 py-2 text-xs text-heading opacity-0  transition-opacity group-focus-within:opacity-100 group-hover:opacity-100"
                >
                  {hiddenElixirs.map((elixir) => (
                    <span key={elixir.id} className="block max-w-64 truncate">
                      {elixir.name}
                    </span>
                  ))}
                </span>
              </span>
            ) : null}
          </div>
        ) : (
          <span className="text-sm text-disabled">None registered</span>
        )}
      </td>
      <td className="px-6 py-5 text-right">
        <button
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-body-muted transition-colors hover:bg-primary/10 hover:text-heading"
          type="button"
          aria-label={`View ${displayName}`}
          onClick={onView}
        >
          <IconEye className="h-5 w-5" />
        </button>
      </td>
    </tr>
  );
};
