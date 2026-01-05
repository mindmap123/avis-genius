// Demo data for admin mode when no backend is connected

export const demoOrganizations = [
  {
    id: "org-1",
    name: "France Canapé",
    slug: "france-canape",
    logo: null,
    defaultAiTone: "professional" as const,
    defaultSignature: "Cordialement, L'équipe France Canapé",
    maxUsers: 10,
    maxEstablishments: 15,
    isActive: true,
    createdAt: "2025-09-15T08:00:00Z",
    usersCount: 3,
    establishmentsCount: 4,
    billing: {
      status: "active" as const,
      planName: "Pro",
      currentPeriodEnd: "2026-02-15T00:00:00Z",
    },
  },
  {
    id: "org-2",
    name: "Le Petit Bistro",
    slug: "le-petit-bistro",
    logo: null,
    defaultAiTone: "friendly" as const,
    defaultSignature: "À très bientôt ! L'équipe Le Petit Bistro",
    maxUsers: 5,
    maxEstablishments: 5,
    isActive: true,
    createdAt: "2025-11-02T14:30:00Z",
    usersCount: 2,
    establishmentsCount: 3,
    billing: {
      status: "trial" as const,
      planName: "Trial",
      trialEndsAt: "2026-01-20T00:00:00Z",
    },
  },
  {
    id: "org-3",
    name: "Sushi Bar Paris",
    slug: "sushi-bar-paris",
    logo: null,
    defaultAiTone: "formal" as const,
    defaultSignature: "L'équipe Sushi Bar Paris",
    maxUsers: 3,
    maxEstablishments: 5,
    isActive: false,
    createdAt: "2025-10-10T11:00:00Z",
    usersCount: 1,
    establishmentsCount: 2,
    billing: {
      status: "cancelled" as const,
      planName: "Starter",
    },
  },
];

export const demoUsers = [
  // France Canapé users
  {
    id: "user-1",
    email: "eric@france-canape.fr",
    name: "Éric Dupont",
    organizationId: "org-1",
    role: "owner" as const,
    isSuperAdmin: false,
    isActive: true,
    lastLoginAt: "2026-01-05T10:30:00Z",
    createdAt: "2025-09-15T08:00:00Z",
  },
  {
    id: "user-2",
    email: "sophie@france-canape.fr",
    name: "Sophie Martin",
    organizationId: "org-1",
    role: "manager" as const,
    isSuperAdmin: false,
    isActive: true,
    lastLoginAt: "2026-01-04T14:20:00Z",
    createdAt: "2025-10-01T09:00:00Z",
    permissions: [{ establishmentId: "est-1", canView: true, canRespond: true, canManage: false }], // Marseille only
  },
  {
    id: "user-3",
    email: "jules@france-canape.fr",
    name: "Jules Bernard",
    organizationId: "org-1",
    role: "manager" as const,
    isSuperAdmin: false,
    isActive: true,
    lastLoginAt: "2026-01-03T16:45:00Z",
    createdAt: "2025-10-15T11:00:00Z",
    permissions: [{ establishmentId: "est-2", canView: true, canRespond: true, canManage: false }], // Lyon only
  },
  // Le Petit Bistro users
  {
    id: "user-4",
    email: "marc@lepetitbistro.fr",
    name: "Marc Leroy",
    organizationId: "org-2",
    role: "owner" as const,
    isSuperAdmin: false,
    isActive: true,
    lastLoginAt: "2026-01-04T18:45:00Z",
    createdAt: "2025-11-02T14:30:00Z",
  },
  {
    id: "user-5",
    email: "claire@lepetitbistro.fr",
    name: "Claire Dubois",
    organizationId: "org-2",
    role: "admin" as const,
    isSuperAdmin: false,
    isActive: true,
    lastLoginAt: "2026-01-05T09:15:00Z",
    createdAt: "2025-11-10T10:00:00Z",
  },
  // Sushi Bar user
  {
    id: "user-6",
    email: "yuki@sushibar-paris.com",
    name: "Yuki Tanaka",
    organizationId: "org-3",
    role: "owner" as const,
    isSuperAdmin: false,
    isActive: false,
    lastLoginAt: "2025-12-20T09:15:00Z",
    createdAt: "2025-10-10T11:00:00Z",
  },
];

export const demoEstablishments = [
  // France Canapé (4)
  { id: "est-1", organizationId: "org-1", name: "France Canapé Marseille", address: "45 Rue de Rome, 13001 Marseille", phone: "04 91 XX XX XX", aiTone: "professional" as const, isActive: true, createdAt: "2025-09-15T08:00:00Z", reviewsCount: 45, avgRating: 4.6 },
  { id: "est-2", organizationId: "org-1", name: "France Canapé Lyon", address: "12 Place Bellecour, 69002 Lyon", phone: "04 72 XX XX XX", aiTone: "professional" as const, isActive: true, createdAt: "2025-09-20T10:00:00Z", reviewsCount: 38, avgRating: 4.8 },
  { id: "est-3", organizationId: "org-1", name: "France Canapé Paris 15", address: "78 Rue de Vaugirard, 75015 Paris", phone: "01 45 XX XX XX", aiTone: "professional" as const, isActive: true, createdAt: "2025-10-01T09:00:00Z", reviewsCount: 52, avgRating: 4.5 },
  { id: "est-4", organizationId: "org-1", name: "France Canapé Bordeaux", address: "25 Cours de l'Intendance, 33000 Bordeaux", phone: "05 56 XX XX XX", aiTone: "professional" as const, isActive: false, createdAt: "2025-11-15T14:00:00Z", reviewsCount: 12, avgRating: 4.2 },
  // Le Petit Bistro (3)
  { id: "est-5", organizationId: "org-2", name: "Le Petit Bistro Montmartre", address: "18 Rue Lepic, 75018 Paris", phone: "01 42 XX XX XX", aiTone: "friendly" as const, isActive: true, createdAt: "2025-11-02T14:30:00Z", reviewsCount: 28, avgRating: 4.7 },
  { id: "est-6", organizationId: "org-2", name: "Le Petit Bistro Marais", address: "5 Rue des Rosiers, 75004 Paris", phone: "01 48 XX XX XX", aiTone: "friendly" as const, isActive: true, createdAt: "2025-11-10T11:00:00Z", reviewsCount: 22, avgRating: 4.9 },
  { id: "est-7", organizationId: "org-2", name: "Le Petit Bistro Saint-Germain", address: "42 Rue de Seine, 75006 Paris", phone: "01 43 XX XX XX", aiTone: "friendly" as const, isActive: true, createdAt: "2025-12-01T16:00:00Z", reviewsCount: 15, avgRating: 4.6 },
  // Sushi Bar (2)
  { id: "est-8", organizationId: "org-3", name: "Sushi Bar Opéra", address: "8 Boulevard des Capucines, 75009 Paris", phone: "01 47 XX XX XX", aiTone: "formal" as const, isActive: false, createdAt: "2025-10-10T11:00:00Z", reviewsCount: 18, avgRating: 4.3 },
  { id: "est-9", organizationId: "org-3", name: "Sushi Bar Bastille", address: "15 Rue de la Roquette, 75011 Paris", phone: "01 43 XX XX XX", aiTone: "formal" as const, isActive: false, createdAt: "2025-10-15T13:00:00Z", reviewsCount: 17, avgRating: 4.4 },
];

export const demoStats = {
  totalOrganizations: 3,
  totalUsers: 6,
  totalEstablishments: 9,
  totalReviews: 147,
  pendingReviews: 12,
  urgentReviews: 2,
  totalResponses: 135,
  responseRate: 92,
};

export const demoActivityLogs = [
  { id: "log-1", organizationId: "org-1", userId: "user-1", activityType: "review_responded", description: "France Canapé Marseille a répondu à un avis 5 étoiles", createdAt: "2026-01-05T14:32:00Z", ipAddress: "92.184.xxx.xxx" },
  { id: "log-2", organizationId: "org-2", userId: "user-4", activityType: "login", description: "Marc Leroy s'est connecté", createdAt: "2026-01-05T14:15:00Z", ipAddress: "86.247.xxx.xxx" },
  { id: "log-3", organizationId: "org-1", userId: "user-2", activityType: "ai_generated", description: "Réponse IA générée pour avis urgent (1 étoile)", createdAt: "2026-01-05T13:45:00Z", ipAddress: "92.184.xxx.xxx" },
  { id: "log-4", organizationId: "org-1", userId: "user-1", activityType: "settings_changed", description: "Éric Dupont a modifié la signature par défaut", createdAt: "2026-01-05T11:20:00Z", ipAddress: "92.184.xxx.xxx" },
  { id: "log-5", organizationId: "org-2", userId: "user-5", activityType: "establishment_added", description: "Le Petit Bistro Saint-Germain ajouté", createdAt: "2026-01-04T16:30:00Z", ipAddress: "86.247.xxx.xxx" },
  { id: "log-6", organizationId: "org-1", userId: "user-3", activityType: "review_responded", description: "France Canapé Lyon a répondu à 3 avis", createdAt: "2026-01-04T15:10:00Z", ipAddress: "92.184.xxx.xxx" },
  { id: "log-7", organizationId: "org-3", userId: "user-6", activityType: "login", description: "Yuki Tanaka s'est connecté (dernière connexion)", createdAt: "2025-12-20T09:15:00Z", ipAddress: "78.192.xxx.xxx" },
  { id: "log-8", organizationId: "org-1", userId: "user-1", activityType: "ai_generated", description: "5 réponses IA générées en batch", createdAt: "2026-01-04T10:00:00Z", ipAddress: "92.184.xxx.xxx" },
  { id: "log-9", organizationId: "org-2", userId: "user-4", activityType: "review_responded", description: "Le Petit Bistro Montmartre a publié une réponse", createdAt: "2026-01-03T19:45:00Z", ipAddress: "86.247.xxx.xxx" },
  { id: "log-10", organizationId: "org-1", userId: "user-1", activityType: "user_invited", description: "Jules Bernard invité comme manager", createdAt: "2025-10-15T11:00:00Z", ipAddress: "92.184.xxx.xxx" },
];

export const demoAiTemplates = [
  {
    id: "tpl-1",
    name: "Réponse Positive (4-5 ⭐)",
    description: "Template pour les avis positifs, ton chaleureux et reconnaissant",
    category: "positive",
    isActive: true,
    createdAt: "2025-09-01T10:00:00Z",
    promptTemplate: `Tu es un assistant qui rédige des réponses aux avis Google My Business positifs.

Règles:
- Ton chaleureux et reconnaissant
- Remercie sincèrement le client par son prénom
- Mentionne un détail spécifique de son avis
- Invite à revenir
- 2-3 phrases maximum
- Termine par la signature fournie

Avis: {review_content}
Note: {rating}/5
Client: {author_name}
Établissement: {establishment_name}
Signature: {signature}`,
  },
  {
    id: "tpl-2",
    name: "Réponse Neutre (3 ⭐)",
    description: "Template pour les avis mitigés, ton constructif",
    category: "neutral",
    isActive: true,
    createdAt: "2025-09-01T10:00:00Z",
    promptTemplate: `Tu es un assistant qui rédige des réponses aux avis Google My Business neutres (3 étoiles).

Règles:
- Ton professionnel et constructif
- Remercie pour le retour honnête
- Demande des précisions pour s'améliorer
- Propose de revenir pour une meilleure expérience
- 2-3 phrases maximum
- Termine par la signature fournie

Avis: {review_content}
Note: {rating}/5
Client: {author_name}
Établissement: {establishment_name}
Signature: {signature}`,
  },
  {
    id: "tpl-3",
    name: "Réponse Urgente (1-2 ⭐)",
    description: "Template pour les avis négatifs, ton empathique et solution-oriented",
    category: "urgent",
    isActive: true,
    createdAt: "2025-09-01T10:00:00Z",
    promptTemplate: `Tu es un assistant qui rédige des réponses aux avis Google My Business négatifs (1-2 étoiles).

Règles:
- Ton empathique et professionnel
- Présente des excuses sincères
- Ne jamais être défensif
- Propose une solution concrète (contact direct, compensation)
- Invite à recontacter en privé
- 3-4 phrases maximum
- Termine par la signature fournie

Avis: {review_content}
Note: {rating}/5
Client: {author_name}
Établissement: {establishment_name}
Signature: {signature}`,
  },
];

export const demoHealthChecks = {
  api: { status: "operational", latency: 45, uptime: 99.98 },
  database: { status: "operational", latency: 12, connections: 3, maxConnections: 100 },
  gemini: { status: "operational", latency: 890, tokensUsed: 125000, tokensLimit: 1000000, requestsToday: 247 },
  googleMyBusiness: { status: "pending", message: "Configuration requise" },
};

// Helper to get organization name by ID
export function getOrganizationName(orgId: string): string {
  const org = demoOrganizations.find(o => o.id === orgId);
  return org?.name || "Unknown";
}

// Helper to get user name by ID
export function getUserName(userId: string): string {
  const user = demoUsers.find(u => u.id === userId);
  return user?.name || "Unknown";
}

// Legacy aliases for backward compatibility
export const demoClients = demoOrganizations;
