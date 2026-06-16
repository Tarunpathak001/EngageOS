import { apiClient } from "@/lib/axios";
import type { ApiMessage, AuthResponse } from "@/types";

export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    apiClient.post<ApiMessage>("/auth/register", data),

  login: (data: { email: string; password: string }) =>
    apiClient.post<AuthResponse>("/auth/login", data),

  verifyOtp: (data: { email: string; otp: string }) =>
    apiClient.post<AuthResponse>("/auth/verify-otp", data),

  forgotPassword: (data: { email: string }) =>
    apiClient.post<ApiMessage>("/auth/forgot-password", data),

  resetPassword: (data: {
    email: string;
    otp: string;
    newPassword: string;
  }) => apiClient.post<ApiMessage>("/auth/reset-password", data),

  resendOtp: (data: { email: string }) =>
    apiClient.post<ApiMessage>("/auth/resend-otp", data),
};