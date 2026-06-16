import {
  Mail,
  Megaphone,
  MousePointerClick,
  Percent,
  Users,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPercent } from "@/lib/utils";
import type { DashboardStats } from "@/types";

interface StatsCardsProps {
  stats?: DashboardStats;
  isLoading: boolean;
}

const cards = [
  {
    key: "totalCustomers",
    label: "Total Customers",
    icon: Users,
    format: (v: number) => v.toLocaleString(),
  },
  {
    key: "totalCampaigns",
    label: "Campaigns",
    icon: Megaphone,
    format: (v: number) => v.toLocaleString(),
  },
  {
    key: "delivered",
    label: "Delivered",
    icon: Mail,
    format: (v: number) => v.toLocaleString(),
  },
  {
    key: "openRate",
    label: "Open Rate",
    icon: MousePointerClick,
    format: (v: string | number) => formatPercent(v),
  },
  {
    key: "ctr",
    label: "Click Rate",
    icon: Percent,
    format: (v: string | number) => formatPercent(v),
  },
] as const;

export function StatsCards({ stats, isLoading }: StatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-3 h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map(({ key, label, icon: Icon, format }) => (
        <Card key={key}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                {label}
              </p>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="mt-2 text-2xl font-semibold tabular-nums">
              {stats ? format(stats[key] as number & string) : "—"}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}