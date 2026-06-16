import { apiClient } from "@/lib/axios";
import type { CampaignRecommendation } from "@/types";

export const analyticsApi = {
  ask: (data: { question: string }) =>
    apiClient.post<CampaignRecommendation>("/analytics-agent/ask", data),
};