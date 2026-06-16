import { apiClient } from "@/lib/axios";
import type {
  CampaignRecommendation,
  DashboardAnalytics,
  DashboardStats,
} from "@/types";

export const dashboardApi = {
  getStats: () => apiClient.get<DashboardStats>("/dashboard/stats"),

  getAnalytics: () =>
    apiClient.get<DashboardAnalytics[]>("/dashboard/analytics"),

  getRecommendation: () =>
    apiClient.get<CampaignRecommendation>("/dashboard/recommendation"),
};