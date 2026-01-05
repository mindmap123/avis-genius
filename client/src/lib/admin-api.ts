const API_BASE = "/api/admin";

function getToken(): string | null {
  return localStorage.getItem("token");
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || "Request failed");
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

// Types
export interface AdminStats {
  totalUsers: number;
  totalEstablishments: number;
  totalReviews: number;
  pendingReviews: number;
  totalResponses: number;
  responseRate: number;
}

export interface Client {
  id: string;
  email: string;
  name: string;
  role: "admin" | "client";
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  establishmentsCount: number;
  config?: ClientConfig;
}

export interface ClientConfig {
  id: string;
  userId: string;
  defaultAiTone: "formal" | "friendly" | "professional" | null;
  defaultSignature: string | null;
  customPromptInstructions: string | null;
  autoRespondEnabled: boolean;
  autoRespondMinRating: number;
  notifyOnUrgent: boolean;
  notifyEmail: string | null;
  maxEstablishments: number;
}

export interface AdminEstablishment {
  id: string;
  userId: string;
  name: string;
  address: string | null;
  phone: string | null;
  isActive: boolean;
  createdAt: string;
  ownerName: string;
  ownerEmail: string;
}

export interface AiTemplate {
  id: string;
  name: string;
  description: string | null;
  promptTemplate: string;
  category: string;
  isActive: boolean;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  userId: string | null;
  activityType: string;
  description: string;
  metadata: Record<string, unknown> | null;
  ipAddress: string | null;
  createdAt: string;
}

// API Functions
export const adminApi = {
  // Stats
  getStats: () => request<AdminStats>("/stats"),

  // Clients
  getClients: () => request<Client[]>("/clients"),
  getClient: (id: string) => request<Client & { establishments: AdminEstablishment[] }>(`/clients/${id}`),
  createClient: (data: { email: string; password: string; name: string; role?: string }) =>
    request<Client>("/clients", { method: "POST", body: JSON.stringify(data) }),
  updateClient: (id: string, data: Partial<Client & { config: Partial<ClientConfig> }>) =>
    request<Client>(`/clients/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteClient: (id: string) => request<void>(`/clients/${id}`, { method: "DELETE" }),

  // Establishments
  getEstablishments: () => request<AdminEstablishment[]>("/establishments"),

  // AI Templates
  getAiTemplates: () => request<AiTemplate[]>("/ai-templates"),
  createAiTemplate: (data: { name: string; description?: string; promptTemplate: string; category?: string }) =>
    request<AiTemplate>("/ai-templates", { method: "POST", body: JSON.stringify(data) }),
  updateAiTemplate: (id: string, data: Partial<AiTemplate>) =>
    request<AiTemplate>(`/ai-templates/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteAiTemplate: (id: string) => request<void>(`/ai-templates/${id}`, { method: "DELETE" }),

  // Activity Logs
  getActivityLogs: (limit = 100) => request<ActivityLog[]>(`/activity-logs?limit=${limit}`),
};
