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
  totalOrganizations: number;
  totalUsers: number;
  totalEstablishments: number;
  totalReviews: number;
  pendingReviews: number;
  urgentReviews: number;
  totalResponses: number;
  responseRate: number;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  defaultAiTone: "formal" | "friendly" | "professional" | null;
  defaultSignature: string | null;
  customPromptInstructions: string | null;
  maxUsers: number;
  maxEstablishments: number;
  isActive: boolean;
  createdAt: string;
  usersCount?: number;
  establishmentsCount?: number;
  billing?: Billing;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  organizationId: string | null;
  role: "owner" | "admin" | "manager" | "viewer";
  isSuperAdmin: boolean;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

export interface Billing {
  id: string;
  organizationId: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  status: "trial" | "active" | "past_due" | "cancelled";
  planName: string | null;
  trialEndsAt: string | null;
  currentPeriodEnd: string | null;
}

export interface AdminEstablishment {
  id: string;
  organizationId: string;
  name: string;
  address: string | null;
  phone: string | null;
  aiTone: "formal" | "friendly" | "professional" | null;
  isActive: boolean;
  createdAt: string;
  organizationName?: string;
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
  organizationId: string | null;
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
  getStats: () => request<AdminStats>("?resource=stats"),
  
  // Organizations
  getOrganizations: () => request<Organization[]>("?resource=organizations"),
  getOrganization: (id: string) => request<Organization & { users: User[]; establishments: AdminEstablishment[] }>(`?resource=organizations&id=${id}`),
  createOrganization: (data: { name: string; maxUsers?: number; maxEstablishments?: number }) =>
    request<Organization>("?resource=organizations", { method: "POST", body: JSON.stringify(data) }),
  updateOrganization: (id: string, data: Partial<Organization>) =>
    request<Organization>(`?resource=organizations&id=${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteOrganization: (id: string) => request<void>(`?resource=organizations&id=${id}`, { method: "DELETE" }),
  
  // Users
  getUsers: (organizationId?: string) => 
    request<User[]>(organizationId ? `?resource=users&organizationId=${organizationId}` : "?resource=users"),
  getUser: (id: string) => request<User>(`?resource=users&id=${id}`),
  createUser: (data: { email: string; password: string; name: string; role?: string; organizationId: string }) =>
    request<User>("?resource=users", { method: "POST", body: JSON.stringify(data) }),
  updateUser: (id: string, data: Partial<User>) =>
    request<User>(`?resource=users&id=${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteUser: (id: string) => request<void>(`?resource=users&id=${id}`, { method: "DELETE" }),
  
  // Establishments
  getEstablishments: (organizationId?: string) => 
    request<AdminEstablishment[]>(organizationId ? `?resource=establishments&organizationId=${organizationId}` : "?resource=establishments"),
  
  // Billing
  getBilling: (organizationId: string) => request<Billing>(`?resource=billing&id=${organizationId}`),
  updateBilling: (organizationId: string, data: Partial<Billing>) =>
    request<Billing>(`?resource=billing&id=${organizationId}`, { method: "PATCH", body: JSON.stringify(data) }),
  
  // AI Templates
  getAiTemplates: () => request<AiTemplate[]>("?resource=ai-templates"),
  createAiTemplate: (data: { name: string; description?: string; promptTemplate: string; category?: string }) =>
    request<AiTemplate>("?resource=ai-templates", { method: "POST", body: JSON.stringify(data) }),
  updateAiTemplate: (id: string, data: Partial<AiTemplate>) =>
    request<AiTemplate>(`?resource=ai-templates&id=${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteAiTemplate: (id: string) => request<void>(`?resource=ai-templates&id=${id}`, { method: "DELETE" }),
  
  // Activity Logs
  getActivityLogs: (limit = 100) => request<ActivityLog[]>(`?resource=activity-logs&limit=${limit}`),
};
