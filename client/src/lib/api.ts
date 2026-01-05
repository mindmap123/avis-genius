const API_BASE = "/api";

function getToken(): string | null {
  return localStorage.getItem("token");
}

export function setToken(token: string): void {
  localStorage.setItem("token", token);
}

export function clearToken(): void {
  localStorage.removeItem("token");
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

// Auth
export interface AuthResponse {
  user: { id: string; email: string; name: string; role: string };
  token: string;
}

export const auth = {
  login: (email: string, password: string) =>
    request<AuthResponse>("/auth?action=login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (email: string, password: string, name: string) =>
    request<AuthResponse>("/auth?action=register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    }),

  me: () => request<{ user: AuthResponse["user"] }>("/auth?action=me"),
};

// Establishments
export interface Establishment {
  id: string;
  userId: string;
  googlePlaceId: string | null;
  name: string;
  address: string | null;
  phone: string | null;
  aiTone: "formal" | "friendly" | "professional" | null;
  signatureTemplate: string | null;
  createdAt: string;
}

export const establishments = {
  list: () => request<Establishment[]>("/establishments"),
  get: (id: string) => request<Establishment>(`/establishments?id=${id}`),
  create: (data: Partial<Establishment>) =>
    request<Establishment>("/establishments", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Establishment>) =>
    request<Establishment>(`/establishments?id=${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id: string) => request<void>(`/establishments?id=${id}`, { method: "DELETE" }),
};

// Reviews
export interface Review {
  id: string;
  establishmentId: string;
  googleReviewId: string | null;
  authorName: string;
  authorPhotoUrl: string | null;
  rating: number;
  content: string | null;
  publishedAt: string;
  sentiment: "urgent" | "positive" | "neutral" | null;
  status: "pending" | "responded" | "ignored" | null;
  createdAt: string;
}

export const reviews = {
  list: (params?: { establishmentId?: string; status?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.establishmentId) searchParams.set("establishmentId", params.establishmentId);
    if (params?.status) searchParams.set("status", params.status);
    const query = searchParams.toString();
    return request<Review[]>(`/reviews${query ? `?${query}` : ""}`);
  },
  generateResponse: (id: string) =>
    request<{ response: string; responseId: string }>(`/reviews?id=${id}&action=generate`, { method: "POST" }),
  respond: (id: string, finalText: string) =>
    request<{ id: string }>(`/reviews?id=${id}&action=respond`, { method: "POST", body: JSON.stringify({ finalText }) }),
};
