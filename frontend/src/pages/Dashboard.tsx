import { useQuery } from "@tanstack/react-query";
import { AnalyticsChart } from "@/components/dashboard/AnalyticsChart";
import { RecommendationCard } from "@/components/dashboard/RecommendationCard";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { ErrorAlert } from "@/components/common/ErrorAlert";
import { PageHeader } from "@/components/common/PageHeader";
import { dashboardApi } from "@/api/dashboard";
import { getErrorMessage } from "@/lib/utils";

export function Dashboard() {
  const statsQuery = useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: async () => (await dashboardApi.getStats()).data,
  });

  const analyticsQuery = useQuery({
    queryKey: ["dashboard", "analytics"],
    queryFn: async () => (await dashboardApi.getAnalytics()).data,
  });

  const recommendationQuery = useQuery({
    queryKey: ["dashboard", "recommendation"],
    queryFn: async () => (await dashboardApi.getRecommendation()).data,
  });

  const error =
    statsQuery.error || analyticsQuery.error || recommendationQuery.error;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Overview of your customers, campaigns, and engagement metrics"
      />

      {error && <ErrorAlert message={getErrorMessage(error)} />}

      <StatsCards stats={statsQuery.data} isLoading={statsQuery.isLoading} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AnalyticsChart
            data={analyticsQuery.data}
            isLoading={analyticsQuery.isLoading}
          />
        </div>
        <RecommendationCard
          recommendation={recommendationQuery.data}
          isLoading={recommendationQuery.isLoading}
        />
      </div>
    </div>
  );
}