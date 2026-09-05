import { useEffect } from "react";

import { SidebarContent } from "./SidebarContent";

type MobileSidebarDrawerProps = {
    isOpen: boolean;
    onClose: () => void;
};

export function MobileSidebarDrawer({ isOpen, onClose }: MobileSidebarDrawerProps) {
    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    return (
        <div
            className="pointer-events-none fixed inset-0 top-topbar z-40 data-[open=true]:pointer-events-auto xl:hidden"
            data-open={isOpen}
            aria-hidden={!isOpen}
            inert={!isOpen}
        >
            <button
                className="absolute inset-0 h-full w-full bg-canvas/70 opacity-0 backdrop-blur-sm transition-opacity duration-300 data-[open=true]:opacity-100"
                data-open={isOpen}
                type="button"
                tabIndex={isOpen ? 0 : -1}
                aria-label="Close navigation menu"
                onClick={onClose}
            />

            <aside
                className="relative z-50 flex h-[calc(100dvh-4rem)] w-[min(20rem,85vw)] -translate-x-full flex-col overflow-y-auto border-r border-border/20 bg-surface px-4 py-5 shadow-sidebar backdrop-blur-sidebar transition-transform duration-300 ease-out data-[open=true]:translate-x-0"
                data-open={isOpen}
            >
                <SidebarContent
                    showDrawerHeader
                    onClose={onClose}
                    onNavigate={onClose}
                />
            </aside>
        </div>
    );
}
