import type { Wizard } from "../types/wizard";
import { WizardTableHeader } from "./WizardTableHeader";
import { WizardTableRow } from "./WizardTableRow";
import { WizardTableSkeleton } from "./WizardTableSkeleton";

type WizardDesktopTableProps = {
  wizards: Wizard[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  onView: (wizard: Wizard) => void;
};

export function WizardDesktopTable({
  wizards,
  isLoading,
  isError,
  error,
  onView,
}: WizardDesktopTableProps) {
  return (
    <div className="hidden xl:block">
      <table className="w-full table-fixed border-collapse">
        <WizardTableHeader />
        <tbody>
          {isLoading ? <WizardTableSkeleton /> : null}

          {isError ? (
            <tr>
              <td className="px-6 py-14 text-center text-sm text-danger" colSpan={5}>
                {error?.message ?? "Unable to load wizard records"}
              </td>
            </tr>
          ) : null}

          {!isLoading && !isError && wizards.length === 0 ? (
            <tr>
              <td className="px-6 py-14 text-center text-sm text-disabled" colSpan={5}>
                No wizard records found.
              </td>
            </tr>
          ) : null}

          {!isLoading && !isError
            ? wizards.map((wizard) => (
              <WizardTableRow
                key={wizard.id}
                wizard={wizard}
                onView={() => onView(wizard)}
              />
            ))
            : null}
        </tbody>
      </table>
    </div>
  );
}
