import type { Wizard } from "../types/wizard";

export const getWizardNameParts = (wizard: Wizard) => ({
  firstName: wizard.firstName?.trim() || "(None)",
  lastName: wizard.lastName?.trim() || "Unknown",
});

export const getWizardDisplayName = (wizard: Wizard) => {
  const name = [wizard.firstName?.trim(), wizard.lastName?.trim()]
    .filter(Boolean)
    .join(" ");

  return name || "Unknown";
};

export const formatWizardId = (id: string) => {
  if (id.length <= 16) {
    return id;
  }

  return `${id.slice(0, 8)}...${id.slice(-6)}`;
};

export const createRegistryId = (wizard: Wizard) => {
  const { lastName } = getWizardNameParts(wizard);

  return wizard.id
    ? `WR-${wizard.id.slice(0, 4).toUpperCase()}-${lastName.slice(0, 2).toUpperCase()}`
    : "WR-0000-UN";
};
