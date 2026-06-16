import { apiClient } from "@/lib/axios";
import type {
  ApiMessage,
  Campaign,
  CampaignListItem,
  CampaignStats,
  CommunicationLog,
  GeneratedCampaign,
  SendCampaignResponse,
} from "@/types";
import type { AudienceFilters } from "@/types";

export const campaignsApi = {
  getAll: () => apiClient.get<CampaignListItem[]>("/campaigns"),

  getById: (id: number) => apiClient.get<Campaign>(`/campaigns/${id}`),

  getLogs: (id: number) =>
    apiClient.get<CommunicationLog[]>(`/campaigns/${id}/logs`),

  getStats: (id: number) =>
    apiClient.get<CampaignStats>(`/campaigns/${id}/stats`),

  create: (data: {
    name: string;
    message: string;
    channel: string;
    scheduledAt?: string;
  }) => apiClient.post<Campaign>("/campaigns", data),

  send: (
    id: number,
    data?: AudienceFilters & { customerIds?: number[] }
  ) => apiClient.post<SendCampaignResponse>(`/campaigns/${id}/send`, data ?? {}),

  aiGenerate: (data: { goal: string }) =>
    apiClient.post<GeneratedCampaign>("/campaigns/ai-generate", data),

  delete: (id: number) =>
    apiClient.delete<ApiMessage>(`/campaigns/${id}`),
};