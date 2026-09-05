import type { ComponentType, SVGProps } from "react"

import { IconAlert, IconFlask, IconTrendUp } from "../../../components/icons"
import { Card } from "../../../components/ui/Card"
import { cn } from "../../../lib/cn"

type KpiTone = "primary" | "accent" | "danger";

type KpiCardProps = {
    label: string;
    value: string;
    statusText: string;
    icon: ComponentType<SVGProps<SVGSVGElement>>;
    tone: KpiTone;
    className?: string;
};

const toneClassNames: Record<KpiTone, string> = {
    primary: "text-primary",
    accent: "text-accent",
    danger: "text-danger",
};

const kpiCards: KpiCardProps[] = [
    {
        label: "TOTAL REGISTERED WIZARDS",
        value: "1,248",
        statusText: "+4% from last moon",
        icon: IconTrendUp,
        tone: "primary",
    },
    {
        label: "ACTIVE ELIXIRS",
        value: "856",
        statusText: "24 new formulas registered",
        icon: IconFlask,
        tone: "accent",
    },
    {
        label: "PENDING VERIFICATIONS",
        value: "12",
        statusText: "Requires High-Council approval",
        icon: IconAlert,
        tone: "danger",
        className: "sm:col-span-2 lg:col-span-1",
    },
];

function KpiCard({
    label,
    value,
    statusText,
    icon: Icon,
    tone,
    className,
}: KpiCardProps) {
    const toneClassName = toneClassNames[tone];

    return (
        <Card className={className}>
            <p className="kpi-label">{label}</p>
            <p className={cn("kpi-value pt-2", toneClassName)}>{value}</p>
            <div className="flex items-center gap-2 pt-6">
                <Icon className={cn("h-3 w-3", toneClassName)} />
                <p className={cn("text-[12px] font-medium leading-4 tracking-wide", toneClassName)}>
                    {statusText}
                </p>
            </div>
        </Card>
    );
}

export const KpiCards = () => {
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {kpiCards.map((card) => (
                <KpiCard key={card.label} {...card} />
            ))}
        </div>
    )
}
