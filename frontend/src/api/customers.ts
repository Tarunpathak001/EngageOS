import { apiClient } from "@/lib/axios";
import type { ApiMessage, Customer } from "@/types";

export const customersApi = {
  getAll: () => apiClient.get<Customer[]>("/customers"),

  getById: (id: number) => apiClient.get<Customer>(`/customers/${id}`),

  getHighSpenders: () =>
    apiClient.get<Customer[]>("/customers/high-spenders"),

  filter: (params: { city?: string; minSpend?: number }) =>
    apiClient.get<Customer[]>("/customers/filter", { params }),

  create: (data: {
    name: string;
    email: string;
    phone?: string;
    city: string;
    totalSpend: number;
  }) => apiClient.post<Customer>("/customers", data),

  delete: (id: number) =>
    apiClient.delete<ApiMessage>(`/customers/${id}`),

  getTelegramStatus: (id: number) =>
    apiClient.get<{
      connected: boolean;
      connectedAt: string | null;
      username: string | null;
    }>(`/customers/${id}/telegram/status`),

  connectTelegram: (id: number) =>
    apiClient.post<{
      inviteLink: string;
      expiresAt: string;
    }>(`/customers/${id}/telegram/connect`),

  disconnectTelegram: (id: number) =>
    apiClient.post<{
      success: boolean;
      message: string;
    }>(`/customers/${id}/telegram/disconnect`),
};