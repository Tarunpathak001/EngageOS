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
    city?: string;
    totalSpend: number;
  }) => apiClient.post<Customer>("/customers", data),

  delete: (id: number) =>
    apiClient.delete<ApiMessage>(`/customers/${id}`),
};