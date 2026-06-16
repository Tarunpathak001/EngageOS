import { Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { CampaignRecommendation } from "@/types";

interface RecommendationCardProps {
  recommendation?: CampaignRecommendation;
  isLoading: boolean;
}

export function RecommendationCard({
  recommendation,
  isLoading,
}: RecommendationCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-48" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-100 bg-blue-50/30">
      <CardHeader className="flex flex-row items-center gap-3 space-y-0">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10">
          <Lightbulb className="h-4 w-4 text-primary" />
        </div>
        <CardTitle className="text-base font-semibold">
          AI Recommendation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendation ? (
          <>
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Best Channel
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {recommendation.bestChannel}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Audience
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {recommendation.recommendedAudience}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Expected Open Rate
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {recommendation.expectedOpenRate}
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {recommendation.reason}
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            No recommendations available yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}