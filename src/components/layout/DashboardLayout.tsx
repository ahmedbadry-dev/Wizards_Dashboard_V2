import { useState } from "react"

import { MobileSidebarDrawer } from "./MobileSidebarDrawer"
import { Sidebar } from "./Sidebar"
import { Topbar } from "./Topbar"


type TDashboardLayoutProps = {
    children: React.ReactNode
}

export function DashboardLayout({ children }: TDashboardLayoutProps) {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

    return (
        <div className="app-main">
            <Topbar onMenuClick={() => setIsMobileSidebarOpen(true)} />
            <MobileSidebarDrawer
                isOpen={isMobileSidebarOpen}
                onClose={() => setIsMobileSidebarOpen(false)}
            />
            <Sidebar />
            <main className="page-content">
                {children}
            </main>
        </div>
    )
}
