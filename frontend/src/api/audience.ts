import { apiClient } from "@/lib/axios";
import type { AudienceFilters, AudiencePreview } from "@/types";

export const audienceApi = {
  preview: (params: AudienceFilters) =>
    apiClient.get<AudiencePreview>("/audience/preview", { params }),

  aiPreview: (data: { prompt: string }) =>
    apiClient.post<AudiencePreview>("/audience/ai-preview", data),
};