import { RegistryActivityChart } from "./RegistryActivityChart"
import { SpecialtyDonutChart } from "./SpecialtyDonutChart"

const DashboardCharts = () => {
    return (
        <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">
            <RegistryActivityChart />
            <SpecialtyDonutChart />
        </div>
    )
}

export default DashboardCharts
