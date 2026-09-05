import { IconBell, IconMenu, IconSettings } from "../icons";
import { SearchInput } from "../ui/SearchInput";

type TopbarProps = {
    onMenuClick?: () => void
}

export function Topbar({ onMenuClick }: TopbarProps) {
    return (
        <header className="fixed inset-x-0 top-0 z-40 flex h-topbar items-center justify-between border-b border-border/30 bg-canvas/80 pr-4 shadow-navigation backdrop-blur-navigation xl:px-6">
            <div className="flex min-w-0 items-center gap-6">
                <button
                    className="flex h-topbar w-16 items-center justify-center border-r border-border/30 text-body-muted transition-colors hover:bg-primary/10 hover:text-primary xl:hidden"
                    type="button"
                    aria-label="Open navigation menu"
                    onClick={onMenuClick}
                >
                    <IconMenu className="h-4 w-5" />
                </button>

                <div className="section-title hidden font-bold text-accent-strong xl:block">
                    Wizarding Registry
                </div>

                <div className="ml-10 hidden xl:flex">
                    <SearchInput className="w-72 rounded-full" placeholder="Scrying records..." />
                </div>
            </div>



            <div className="flex items-center gap-3 text-body-muted xl:gap-5">
                <button className="rounded-full p-2 hover:bg-primary/10" aria-label="Notifications">
                    <IconBell className="h-5 w-5 text-body-muted" />
                </button>
                <button className="hidden rounded-full p-2 hover:bg-primary/10 xl:inline-flex" aria-label="Settings">
                    <IconSettings className="h-5 w-5 text-body-muted" />
                </button>
                <div className="hidden h-10 w-10 overflow-hidden rounded-full border border-primary/50 bg-surface-raised xl:block">
                    <img
                        src="/images/user-avatar.jpg"
                        alt="User avatar"
                        className="h-10 w-10 object-cover"
                    />
                </div>
            </div>
        </header>
    );
}
