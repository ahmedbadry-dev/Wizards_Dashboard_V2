
import {
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from "recharts"

import { Card } from "../../../../components/ui/Card"

type SpecialtyDataPoint = {
    name: string
    value: number
    color: string
}

type SpecialtyTooltipProps = {
    active?: boolean
    payload?: Array<{
        payload: SpecialtyDataPoint
    }>
}

const specialtyData: SpecialtyDataPoint[] = [
    { name: "Alchemists", value: 45, color: "var(--color-primary)" },
    { name: "Transmuters", value: 30, color: "var(--color-accent)" },
    { name: "Conjurers", value: 25, color: "var(--color-body-muted)" },
]

const totalSpecialists = '1.2k'

function SpecialtyTooltip({ active, payload }: SpecialtyTooltipProps) {
    if (!active || !payload?.length) {
        return null
    }

    const item = payload[0].payload

    return (
        <div className="rounded-lg border border-body-muted/20 bg-surface px-3 py-2 shadow-primary">
            <p className="text-xs font-semibold text-heading">{item.name}</p>
            <p className="text-xs text-body-muted">{item.value}% of registry</p>
        </div>
    )
}

export const SpecialtyDonutChart = () => {
    return (
        <Card className="h-[340px] min-w-0 lg:h-[398px]">
            <div className="mb-4 lg:mb-6">
                <h2 className="section-title">Wizard by Specialties</h2>
            </div>

            <div className="relative h-[160px] min-w-0 lg:h-[190px]">
                <ResponsiveContainer width="100%" height="100%" debounce={100}>
                    <PieChart>
                        <Tooltip
                            content={<SpecialtyTooltip />}
                            cursor={{ fill: "transparent" }}
                        />
                        <Pie
                            data={specialtyData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius="62%"
                            outerRadius="74%"
                            stroke="none"
                            fill="var(--color-surface-input)"
                            isAnimationActive={false}
                        >
                            {specialtyData.map((item) => (
                                <Cell key={item.name} fill={item.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="section-title">
                        {totalSpecialists}
                    </span>
                    <span className="text-xs font-medium uppercase tracking-wide text-disabled">
                        Total
                    </span>
                </div>
            </div>

            <div className="mt-5 space-y-1.75 lg:mt-6">
                {specialtyData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-3">
                            <span
                                className="h-3 w-3 shrink-0 rounded-full"
                                style={{ backgroundColor: item.color }}
                            />
                            <span className="truncate text-sm font-semibold text-heading">
                                {item.name}
                            </span>
                        </div>
                        <span className="text-sm font-semibold text-body-muted">
                            {item.value}%
                        </span>
                    </div>
                ))}
            </div>
        </Card>
    )
}
