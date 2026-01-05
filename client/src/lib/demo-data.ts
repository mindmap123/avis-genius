// Demo data for admin mode when no backend is connected

export const demoClients = [
  {
    id: "client-1",
    email: "contact@france-canape.fr",
    name: "France Canapé",
    role: "client" as const,
    isActive: true,
    lastLoginAt: "2026-01-05T10:30:00Z",
    createdAt: "2025-09-15T08:00:00Z",
    establishmentsCount: 4,
    status: "active" as const,
    plan: "Pro",
    config: {
      defaultAiTone: "professional" as const,
      defaultSignature: "Cordialement, L'équipe France Canapé",
      maxEstablishments: 10,
      autoRespondEnabled: true,
    },
  },
  {
    id: "client-2",
    email: "marc@lepetitbistro.fr",
    name: "Le Petit Bistro",
    role: "client" as const,
    isActive: true,
    lastLoginAt: "2026-01-04T18:45:00Z",
    createdAt: "2025-11-02T14:30:00Z",
    establishmentsCount: 3,
    status: "trial" as const,
    plan: "Trial",
    config: {
      defaultAiTone: "friendly" as const,
      defaultSignature: "À très bientôt ! Marc, Le Petit Bistro",
      maxEstablishments: 3,
      autoRespondEnabled: false,
    },
  },
  {
    id: "client-3",
    email: "yuki@sushibar-paris.com",
    name: "Sushi Bar Paris",
    role: "client" as const,
    isActive: false,
    lastLoginAt: "2025-12-20T09:15:00Z",
    createdAt: "2025-10-10T11:00:00Z",
    establishmentsCount: 2,
    status: "suspended" as const,
    plan: "Starter",
    config: {
      defaultAiTone: "formal" as const,
      defaultSignature: "L'équipe Sushi Bar Paris",
      maxEstablishments: 5,
      autoRespondEnabled: false,
    },
  },
];

export const demoEstablishments = [
  // France Canapé (4)
  { id: "est-1", userId: "client-1", name: "France Canapé Marseille", address: "45 Rue de Rome, 13001 Marseille", phone: "04 91 XX XX XX", isActive: true, createdAt: "2025-09-15T08:00:00Z", ownerName: "France Canapé", ownerEmail: "contact@france-canape.fr", reviewsCount: 45, avgRating: 4.6 },
  { id: "est-2", userId: "client-1", name: "France Canapé Lyon", address: "12 Place Bellecour, 69002 Lyon", phone: "04 72 XX XX XX", isActive: true, createdAt: "2025-09-20T10:00:00Z", ownerName: "France Canapé", ownerEmail: "contact@france-canape.fr", reviewsCount: 38, avgRating: 4.8 },
  { id: "est-3", userId: "client-1", name: "France Canapé Paris 15", address: "78 Rue de Vaugirard, 75015 Paris", phone: "01 45 XX XX XX", isActive: true, createdAt: "2025-10-01T09:00:00Z", ownerName: "France Canapé", ownerEmail: "contact@france-canape.fr", reviewsCount: 52, avgRating: 4.5 },
  { id: "est-4", userId: "client-1", name: "France Canapé Bordeaux", address: "25 Cours de l'Intendance, 33000 Bordeaux", phone: "05 56 XX XX XX", isActive: false, createdAt: "2025-11-15T14:00:00Z", ownerName: "France Canapé", ownerEmail: "contact@france-canape.fr", reviewsCount: 12, avgRating: 4.2 },
  // Le Petit Bistro (3)
  { id: "est-5", userId: "client-2", name: "Le Petit Bistro Montmartre", address: "18 Rue Lepic, 75018 Paris", phone: "01 42 XX XX XX", isActive: true, createdAt: "2025-11-02T14:30:00Z", ownerName: "Le Petit Bistro", ownerEmail: "marc@lepetitbistro.fr", reviewsCount: 28, avgRating: 4.7 },
  { id: "est-6", userId: "client-2", name: "Le Petit Bistro Marais", address: "5 Rue des Rosiers, 75004 Paris", phone: "01 48 XX XX XX", isActive: true, createdAt: "2025-11-10T11:00:00Z", ownerName: "Le Petit Bistro", ownerEmail: "marc@lepetitbistro.fr", reviewsCount: 22, avgRating: 4.9 },
  { id: "est-7", userId: "client-2", name: "Le Petit Bistro Saint-Germain", address: "42 Rue de Seine, 75006 Paris", phone: "01 43 XX XX XX", isActive: true, createdAt: "2025-12-01T16:00:00Z", ownerName: "Le Petit Bistro", ownerEmail: "marc@lepetitbistro.fr", reviewsCount: 15, avgRating: 4.6 },
  // Sushi Bar (2)
  { id: "est-8", userId: "client-3", name: "Sushi Bar Opéra", address: "8 Boulevard des Capucines, 75009 Paris", phone: "01 47 XX XX XX", isActive: false, createdAt: "2025-10-10T11:00:00Z", ownerName: "Sushi Bar Paris", ownerEmail: "yuki@sushibar-paris.com", reviewsCount: 18, avgRating: 4.3 },
  { id: "est-9", userId: "client-3", name: "Sushi Bar Bastille", address: "15 Rue de la Roquette, 75011 Paris", phone: "01 43 XX XX XX", isActive: false, createdAt: "2025-10-15T13:00:00Z", ownerName: "Sushi Bar Paris", ownerEmail: "yuki@sushibar-paris.com", reviewsCount: 17, avgRating: 4.4 },
];


export const demoStats = {
  totalUsers: 3,
  totalEstablishments: 9,
  totalReviews: 147,
  pendingReviews: 12,
  urgentReviews: 2,
  totalResponses: 135,
  responseRate: 92,
};

export const demoActivityLogs = [
  { id: "log-1", userId: "client-1", activityType: "review_responded", description: "France Canapé Marseille a répondu à un avis 5 étoiles", createdAt: "2026-01-05T14:32:00Z", ipAddress: "92.184.xxx.xxx" },
  { id: "log-2", userId: "client-2", activityType: "login", description: "Le Petit Bistro s'est connecté", createdAt: "2026-01-05T14:15:00Z", ipAddress: "86.247.xxx.xxx" },
  { id: "log-3", userId: "client-1", activityType: "ai_generated", description: "Réponse IA générée pour avis urgent (1 étoile)", createdAt: "2026-01-05T13:45:00Z", ipAddress: "92.184.xxx.xxx" },
  { id: "log-4", userId: "client-1", activityType: "settings_changed", description: "France Canapé a modifié sa signature par défaut", createdAt: "2026-01-05T11:20:00Z", ipAddress: "92.184.xxx.xxx" },
  { id: "log-5", userId: "client-2", activityType: "establishment_added", description: "Le Petit Bistro Saint-Germain ajouté", createdAt: "2026-01-04T16:30:00Z", ipAddress: "86.247.xxx.xxx" },
  { id: "log-6", userId: "client-1", activityType: "review_responded", description: "France Canapé Lyon a répondu à 3 avis", createdAt: "2026-01-04T15:10:00Z", ipAddress: "92.184.xxx.xxx" },
  { id: "log-7", userId: "client-3", activityType: "login", description: "Sushi Bar Paris s'est connecté (dernière connexion)", createdAt: "2025-12-20T09:15:00Z", ipAddress: "78.192.xxx.xxx" },
  { id: "log-8", userId: "client-1", activityType: "ai_generated", description: "5 réponses IA générées en batch", createdAt: "2026-01-04T10:00:00Z", ipAddress: "92.184.xxx.xxx" },
  { id: "log-9", userId: "client-2", activityType: "review_responded", description: "Le Petit Bistro Montmartre a publié une réponse", createdAt: "2026-01-03T19:45:00Z", ipAddress: "86.247.xxx.xxx" },
  { id: "log-10", userId: "client-1", activityType: "settings_changed", description: "Ton IA changé de 'formel' à 'professionnel'", createdAt: "2026-01-03T14:20:00Z", ipAddress: "92.184.xxx.xxx" },
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
