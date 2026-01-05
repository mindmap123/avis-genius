import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAdmin, hashPassword } from "./lib/auth";
import { 
  getGlobalStats, 
  // Organizations
  getAllOrganizations, getOrganization, createOrganization, updateOrganization, deleteOrganization,
  // Users
  getAllUsers, getUser, createUser, updateUser, deleteUser, getUsersByOrganization,
  // Establishments
  getAllEstablishments, getEstablishment, getEstablishmentsByOrganization,
  // Billing
  getBilling, createBilling, updateBilling,
  // AI Templates
  getAllAiTemplates, createAiTemplate, getAiTemplate, updateAiTemplate, deleteAiTemplate,
  // Activity Logs
  getActivityLogs,
} from "./lib/storage";

function generateSlug(name: string): string {
  return name.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    + "-" + Math.random().toString(36).substring(2, 6);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const admin = await requireAdmin(req);
  if (!admin) {
    return res.status(403).json({ error: "Admin access required" });
  }

  const { resource, id, action } = req.query;

  try {
    // ============ STATS ============
    if (req.method === "GET" && resource === "stats") {
      const stats = await getGlobalStats();
      return res.status(200).json(stats);
    }

    // ============ ORGANIZATIONS ============
    if (req.method === "GET" && resource === "organizations" && !id) {
      const orgs = await getAllOrganizations();
      const enriched = await Promise.all(orgs.map(async (org) => {
        const users = await getUsersByOrganization(org.id);
        const establishments = await getEstablishmentsByOrganization(org.id);
        const billing = await getBilling(org.id);
        return { 
          ...org, 
          usersCount: users.length,
          establishmentsCount: establishments.length, 
          billing,
        };
      }));
      return res.status(200).json(enriched);
    }

    if (req.method === "POST" && resource === "organizations") {
      const { name, maxUsers, maxEstablishments } = req.body;
      if (!name) {
        return res.status(400).json({ error: "Name required" });
      }
      const org = await createOrganization({ 
        name, 
        slug: generateSlug(name),
        maxUsers: maxUsers || 5,
        maxEstablishments: maxEstablishments || 10,
        isActive: true,
      });
      // Create trial billing
      const trialEndsAt = new Date();
      trialEndsAt.setDate(trialEndsAt.getDate() + 14);
      await createBilling({
        organizationId: org.id,
        status: "trial",
        planName: "trial",
        trialEndsAt,
      });
      return res.status(201).json(org);
    }

    if (req.method === "GET" && resource === "organizations" && id) {
      const org = await getOrganization(id as string);
      if (!org) return res.status(404).json({ error: "Not found" });
      const users = await getUsersByOrganization(id as string);
      const establishments = await getEstablishmentsByOrganization(id as string);
      const billing = await getBilling(id as string);
      return res.status(200).json({ 
        ...org, 
        users: users.map(u => ({ ...u, passwordHash: undefined })),
        establishments, 
        billing,
      });
    }

    if ((req.method === "PATCH" || req.method === "PUT") && resource === "organizations" && id) {
      const updated = await updateOrganization(id as string, req.body);
      return res.status(200).json(updated);
    }

    if (req.method === "DELETE" && resource === "organizations" && id) {
      await deleteOrganization(id as string);
      return res.status(204).end();
    }

    // ============ USERS (within organization) ============
    if (req.method === "GET" && resource === "users" && !id) {
      const orgId = req.query.organizationId as string | undefined;
      const users = orgId ? await getUsersByOrganization(orgId) : await getAllUsers();
      return res.status(200).json(users.map(u => ({ ...u, passwordHash: undefined })));
    }

    if (req.method === "POST" && resource === "users") {
      const { email, password, name, role, organizationId } = req.body;
      if (!email || !password || !name || !organizationId) {
        return res.status(400).json({ error: "Email, password, name and organizationId required" });
      }
      const passwordHash = await hashPassword(password);
      const user = await createUser({ 
        email, 
        passwordHash, 
        name, 
        role: role || "viewer",
        organizationId,
        isActive: true,
        isSuperAdmin: false,
      });
      return res.status(201).json({ ...user, passwordHash: undefined });
    }

    if (req.method === "GET" && resource === "users" && id) {
      const user = await getUser(id as string);
      if (!user) return res.status(404).json({ error: "Not found" });
      return res.status(200).json({ ...user, passwordHash: undefined });
    }

    if ((req.method === "PATCH" || req.method === "PUT") && resource === "users" && id) {
      const { name, email, role, isActive, isSuperAdmin } = req.body;
      const updated = await updateUser(id as string, { 
        ...(name && { name }), 
        ...(email && { email }), 
        ...(role && { role }), 
        ...(typeof isActive === "boolean" && { isActive }),
        ...(typeof isSuperAdmin === "boolean" && { isSuperAdmin }),
      });
      return res.status(200).json({ ...updated, passwordHash: undefined });
    }

    if (req.method === "DELETE" && resource === "users" && id) {
      await deleteUser(id as string);
      return res.status(204).end();
    }

    // ============ ESTABLISHMENTS ============
    if (req.method === "GET" && resource === "establishments") {
      const orgId = req.query.organizationId as string | undefined;
      const establishments = orgId 
        ? await getEstablishmentsByOrganization(orgId) 
        : await getAllEstablishments();
      const enriched = await Promise.all(establishments.map(async (est) => {
        const org = await getOrganization(est.organizationId);
        return { ...est, organizationName: org?.name || "Unknown" };
      }));
      return res.status(200).json(enriched);
    }

    // ============ BILLING ============
    if (req.method === "GET" && resource === "billing" && id) {
      const billing = await getBilling(id as string);
      return res.status(200).json(billing);
    }

    if ((req.method === "PATCH" || req.method === "PUT") && resource === "billing" && id) {
      const updated = await updateBilling(id as string, req.body);
      return res.status(200).json(updated);
    }

    // ============ AI TEMPLATES ============
    if (req.method === "GET" && resource === "ai-templates" && !id) {
      const templates = await getAllAiTemplates();
      return res.status(200).json(templates);
    }

    if (req.method === "POST" && resource === "ai-templates") {
      const { name, description, promptTemplate, category } = req.body;
      if (!name || !promptTemplate) return res.status(400).json({ error: "Name and promptTemplate required" });
      const template = await createAiTemplate({ name, description, promptTemplate, category: category || "general", isActive: true });
      return res.status(201).json(template);
    }

    if (req.method === "GET" && resource === "ai-templates" && id) {
      const template = await getAiTemplate(id as string);
      return res.status(200).json(template);
    }

    if ((req.method === "PATCH" || req.method === "PUT") && resource === "ai-templates" && id) {
      const updated = await updateAiTemplate(id as string, req.body);
      return res.status(200).json(updated);
    }

    if (req.method === "DELETE" && resource === "ai-templates" && id) {
      await deleteAiTemplate(id as string);
      return res.status(204).end();
    }

    // ============ ACTIVITY LOGS ============
    if (req.method === "GET" && resource === "activity-logs") {
      const limit = parseInt(req.query.limit as string) || 100;
      const logs = await getActivityLogs(limit);
      return res.status(200).json(logs);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Admin error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
