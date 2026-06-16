import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardAnalytics } from "@/types";

interface AnalyticsChartProps {
  data?: DashboardAnalytics[];
  isLoading: boolean;
}

export function AnalyticsChart({ data, isLoading }: AnalyticsChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Campaign Performance Over Time
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!data?.length ? (
          <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
            No analytics data available yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: "#64748b" }}
                tickLine={false}
                axisLine={{ stroke: "#e2e8f0" }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#64748b" }}
                tickLine={false}
                axisLine={{ stroke: "#e2e8f0" }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="delivered"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
                name="Delivered"
              />
              <Line
                type="monotone"
                dataKey="opened"
                stroke="#059669"
                strokeWidth={2}
                dot={false}
                name="Opened"
              />
              <Line
                type="monotone"
                dataKey="clicked"
                stroke="#7c3aed"
                strokeWidth={2}
                dot={false}
                name="Clicked"
              />
              <Line
                type="monotone"
                dataKey="failed"
                stroke="#dc2626"
                strokeWidth={2}
                dot={false}
                name="Failed"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}