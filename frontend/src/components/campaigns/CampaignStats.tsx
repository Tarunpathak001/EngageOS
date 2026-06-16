import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { CampaignStats as CampaignStatsType } from "@/types";

interface CampaignStatsProps {
  stats: CampaignStatsType;
}

export function CampaignStats({ stats }: CampaignStatsProps) {
  const deliveryRate =
    stats.totalAudience > 0
      ? (stats.delivered / stats.totalAudience) * 100
      : 0;

  const metrics = [
    { label: "Total Audience", value: stats.totalAudience },
    { label: "Delivered", value: stats.delivered },
    { label: "Opened", value: stats.opened },
    { label: "Clicked", value: stats.clicked },
    { label: "Failed", value: stats.failed },
    { label: "Pending", value: stats.pending },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {metrics.map(({ label, value }) => (
          <Card key={label}>
            <CardContent className="p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {label}
              </p>
              <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Open Rate</p>
              <p className="text-lg font-semibold">{stats.openRate}</p>
            </div>
            <Progress
              className="mt-3"
              value={parseFloat(stats.openRate) || 0}
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Click-Through Rate</p>
              <p className="text-lg font-semibold">{stats.ctr}</p>
            </div>
            <Progress className="mt-3" value={parseFloat(stats.ctr) || 0} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Delivery Progress</p>
            <p className="text-sm text-muted-foreground">
              {deliveryRate.toFixed(1)}% of audience
            </p>
          </div>
          <Progress className="mt-3" value={deliveryRate} />
        </CardContent>
      </Card>
    </div>
  );
}