export interface User {
  id: number;
  name: string;
  email: string;
  isVerified?: boolean;
  createdAt?: string;
}

export interface Order {
  id: number;
  amount: number;
  orderDate: string;
  customerId: number;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  city?: string | null;
  totalSpend: number;
  createdAt: string;
  telegramChatId?: string | null;
  telegramUsername?: string | null;
  telegramConnected: boolean;
  telegramConnectedAt?: string | null;
  telegramInviteToken?: string | null;
  telegramInviteExpiresAt?: string | null;
  orders?: Order[];
  communicationLogs?: CommunicationLog[];
}

export interface CommunicationLog {
  id: number;
  campaignId: number;
  customerId: number;
  status: LogStatus;
  createdAt: string;
  customer?: Customer;
  campaign?: Campaign;
}

export type LogStatus =
  | "PENDING"
  | "DELIVERED"
  | "OPENED"
  | "CLICKED"
  | "FAILED";

export type CampaignStatus = "DRAFT" | "SCHEDULED" | "SENT";

export interface Campaign {
  id: number;
  name: string;
  message: string;
  channel: string;
  status: CampaignStatus | string;
  createdAt: string;
  scheduledAt?: string | null;
  userId?: number;
  communicationLogs?: CommunicationLog[];
}

export interface CampaignListItem {
  id: number;
  name: string;
  channel: string;
  status: string;
  createdAt: string;
  delivered: number;
  opened: number;
  clicked: number;
  failed: number;
  openRate: string | number;
  ctr: string | number;
}

export interface CampaignStats {
  campaignId: number;
  campaignName: string;
  channel: string;
  createdAt: string;
  createdBy: string;
  totalAudience: number;
  delivered: number;
  opened: number;
  clicked: number;
  failed: number;
  pending: number;
  openRate: string;
  ctr: string;
}

export interface DashboardStats {
  totalCustomers: number;
  totalCampaigns: number;
  totalMessages: number;
  delivered: number;
  opened: number;
  clicked: number;
  failed: number;
  pending: number;
  openRate: string | number;
  ctr: string | number;
}

export interface DashboardAnalytics {
  date: string;
  delivered: number;
  opened: number;
  clicked: number;
  failed: number;
}

export interface AudienceFilters {
  city?: string;
  minSpend?: number | string;
  segment?: string;
}

export interface AudiencePreview {
  audienceSize: number;
  customers: Customer[];
  prompt?: string;
  filters?: AudienceFilters;
}

export interface CampaignRecommendation {
  bestChannel?: string;
  recommendedAudience?: string;
  expectedOpenRate?: string;
  reason?: string;
  hasEnoughData?: boolean;
  success?: boolean;
  message?: string;
}

export interface GeneratedCampaign {
  name: string;
  message: string;
}

export interface AgentExecuteResponse {
  success: boolean;
  message: string;
  audience: AudienceFilters;
  matchedCustomers: number;
  campaign: GeneratedCampaign;
  recommendation: CampaignRecommendation;
  savedCampaign: Campaign;
}

export interface SendCampaignResponse {
  campaignId: number;
  campaignName: string;
  audienceSize: number;
  logsCreated: number;
}

export interface AuthResponse {
  token: string;
  user: User;
  message?: string;
}

export interface ApiMessage {
  message: string;
}