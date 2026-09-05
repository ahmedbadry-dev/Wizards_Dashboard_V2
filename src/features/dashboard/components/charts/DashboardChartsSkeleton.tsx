import { Card } from "../../../../components/ui/Card";

export const DashboardChartsSkeleton = () => {
  return (
    <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">
      <Card className="h-[320px] animate-pulse lg:col-span-2 lg:h-[398px]">
        <div className="h-full rounded-lg bg-primary/10" />
      </Card>
      <Card className="h-[340px] animate-pulse lg:h-[398px]">
        <div className="h-full rounded-lg bg-primary/10" />
      </Card>
    </div>
  );
};
