import { SidebarContent } from "./SidebarContent";

export function Sidebar() {
    return (
        <aside className="fixed bottom-0 left-0 top-topbar z-30 hidden w-sidebar flex-col overflow-y-auto border-r border-border/20 bg-surface px-4 py-6 shadow-sidebar backdrop-blur-sidebar xl:flex">
            <SidebarContent />
        </aside>
    )
}
