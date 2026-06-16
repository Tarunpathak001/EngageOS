import { apiClient } from "@/lib/axios";
import type { AgentExecuteResponse } from "@/types";

export const agentsApi = {
  execute: (data: { goal: string }) =>
    apiClient.post<AgentExecuteResponse>("/agents/execute", data),
};