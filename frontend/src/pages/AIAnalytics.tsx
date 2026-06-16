import { useMutation } from "@tanstack/react-query";
import { analyticsApi } from "@/api/analytics";
import { AnalyticsChat } from "@/components/ai/AnalyticsChat";
import { PageHeader } from "@/components/common/PageHeader";

export function AIAnalytics() {
  const askMutation = useMutation({
    mutationFn: (question: string) =>
      analyticsApi.ask({ question }).then((res) => res.data),
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="AI Analytics"
        description="Ask questions about your campaign performance and get strategic recommendations"
      />

      <AnalyticsChat
        onAsk={(question) => askMutation.mutateAsync(question)}
        isLoading={askMutation.isPending}
      />
    </div>
  );
}