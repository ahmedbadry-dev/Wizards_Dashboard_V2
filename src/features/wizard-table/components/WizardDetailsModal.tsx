
import { IconChevronRight, IconEdit, IconFlaskFilled, IconMagicWand } from "../../../components/icons";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { Modal } from "../../../components/ui/Modal";
import type { Wizard } from "../types/wizard";
import {
    createRegistryId,
    getWizardDisplayName,
    getWizardNameParts,
} from "../utils/wizardFormatters";

type WizardDetailsModalProps = {
    wizard: Wizard;
    isOpen: boolean;
    onClose: () => void;
};

const WizardDetailsModal = ({
    wizard,
    isOpen,
    onClose
}: WizardDetailsModalProps) => {
    const { firstName, lastName } = getWizardNameParts(wizard);
    const elixirs = wizard.elixirs ?? [];
    const fullName = getWizardDisplayName(wizard);
    const registryId = createRegistryId(wizard);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`${fullName} profile`}
        >
            <header className="flex shrink-0 flex-col gap-3 border-b border-border/30 px-4 pb-4 pt-3 sm:px-6 xl:flex-row xl:items-start xl:justify-between xl:px-8 xl:py-5">
                    <div className="min-w-0">
                        <p className="kpi-label font-normal text-primary">Member Profile</p>
                        <h2 className="mt-1 break-words text-2xl font-semibold leading-8 text-heading xl:text-3xl xl:leading-10">{fullName}</h2>
                    </div>

                    <div className="min-w-0 xl:text-right">
                        <p className="text-sm text-body-muted sm:text-base">Registry ID</p>
                        <p className="mt-1 break-all text-base font-semibold text-primary sm:text-2xl xl:text-2xl">{registryId}</p>
                    </div>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 scrollbar-themed sm:px-6 xl:px-8 xl:py-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-12 xl:gap-8">
                    <aside className="md:col-span-4">
                        <div className="relative mx-auto flex h-32 w-32 items-center justify-center xl:h-54 xl:w-54">
                            <div className="absolute inset-0 rounded-full  bg-linear-to-br from-primary/20 to-accent/20 opacity-50 blur-2xl" />
                            <div className="absolute inset-3 rounded-full border-2 border-primary/30" />
                            <div className="relative h-28 w-28 overflow-hidden rounded-full border border-primary/30 bg-canvas/70 xl:h-46 xl:w-46">
                                <img
                                    src="/images/member-demo-profile.jpg"
                                    alt={`${fullName} profile portrait`}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        </div>

                        <div className="mt-4 flex flex-wrap justify-center gap-2">
                            <Badge tone="neutral" className="text-[16px] font-normal">Class A Citizen</Badge>
                            <Badge tone="warning">High Council</Badge>
                        </div>
                    </aside>

                    <section className="min-w-0 md:col-span-8">
                        <div className="grid gap-4 rounded-lg bg-canvas/45 p-4 sm:grid-cols-2 xl:gap-6 xl:p-6">
                            <div>
                                <p className="text-sm text-body-muted">First Name</p>
                                <p className="mt-2 break-words font-semibold text-heading">{firstName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-body-muted">Last Name</p>
                                <p className="mt-2 break-words font-semibold text-heading">{lastName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-body-muted">Registry Status</p>
                                <p className="mt-2 flex items-center gap-2 font-semibold text-primary">
                                    <span className="h-2 w-2 rounded-full bg-primary" />
                                    Active
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-body-muted">Primary Specialty</p>
                                <p className="mt-2 break-words font-semibold text-heading">
                                    Domestic Alchemy & Cleaning Charms
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 xl:mt-7">
                            <h3 className="flex items-center gap-2 text-xl leading-8 text-heading ">
                                <IconFlaskFilled className="h-5 w-5 text-primary" />
                                Associated Elixirs
                            </h3>
                            <div className="mt-3 border-t border-border/30 pt-5">
                                {elixirs.length > 0 ? (
                                    <div className="space-y-3">
                                        {elixirs.map((elixir) => (
                                            <div
                                                key={elixir.id}
                                                className="flex min-h-11 items-center gap-3 rounded-lg bg-surface-raised/40 p-3 xl:gap-4"
                                            >
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-primary/20 bg-primary/10">
                                                    <IconMagicWand className="h-5 w-5 text-primary" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate font-medium text-heading" title={elixir.name}>
                                                        {elixir.name}
                                                    </p>
                                                    <p className="text-sm text-body-muted">Inventory: 142 Units</p>
                                                </div>
                                                <span className="text-2xl text-body-muted" aria-hidden="true"><IconChevronRight /></span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="rounded-lg bg-surface-raised/35 p-4 text-sm text-disabled">
                                        No elixirs registered.
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            <footer className="flex shrink-0 flex-col-reverse gap-3 border-t border-border/30 px-4 pt-4 sm:flex-row sm:items-center sm:justify-end sm:px-6 xl:gap-6 xl:px-8 xl:py-5" style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}>
                    <Button variant="ghost" onClick={onClose}>
                        Close
                    </Button>
                    <Button className="w-full gap-2 px-6 sm:w-auto" >
                        <IconEdit className="h-4 w-4" />
                        Edit Record
                    </Button>
            </footer>
        </Modal>
    );
};

export default WizardDetailsModal
