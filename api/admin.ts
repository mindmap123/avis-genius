import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAdmin, hashPassword } from "./lib/auth";
import { 
  getGlobalStats, getAllUsers, getUser, createUser, updateUser, deleteUser,
  getEstablishmentsByUser, getClientConfig, updateClientConfig, createClientConfig,
  getAllEstablishments, getAllAiTemplates, createAiTemplate, getAiTemplate, 
  updateAiTemplate, deleteAiTemplate, getActivityLogs
} from "./lib/storage";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const admin = await requireAdmin(req);
  if (!admin) {
    return res.status(403).json({ error: "Admin access required" });
  }

  const { resource, id, action } = req.query;

  try {
    // GET /api/admin?resource=stats
    if (req.method === "GET" && resource === "stats") {
      const stats = await getGlobalStats();
      return res.status(200).json(stats);
    }

    // GET /api/admin?resource=clients
    if (req.method === "GET" && resource === "clients" && !id) {
      const users = await getAllUsers();
      const enriched = await Promise.all(users.map(async (user) => {
        const establishments = await getEstablishmentsByUser(user.id);
        const config = await getClientConfig(user.id);
        return { ...user, passwordHash: undefined, establishmentsCount: establishments.length, config };
      }));
      return res.status(200).json(enriched);
    }

    // POST /api/admin?resource=clients
    if (req.method === "POST" && resource === "clients") {
      const { email, password, name, role } = req.body;
      if (!email || !password || !name) {
        return res.status(400).json({ error: "Email, password and name required" });
      }
      const passwordHash = await hashPassword(password);
      const user = await createUser({ email, passwordHash, name, role: role || "client", isActive: true });
      return res.status(201).json({ ...user, passwordHash: undefined });
    }

    // GET /api/admin?resource=clients&id=xxx
    if (req.method === "GET" && resource === "clients" && id) {
      const user = await getUser(id as string);
      if (!user) return res.status(404).json({ error: "Not found" });
      const establishments = await getEstablishmentsByUser(id as string);
      const config = await getClientConfig(id as string);
      return res.status(200).json({ ...user, passwordHash: undefined, establishments, config });
    }

    // PATCH /api/admin?resource=clients&id=xxx
    if ((req.method === "PATCH" || req.method === "PUT") && resource === "clients" && id) {
      const { name, email, role, isActive, config } = req.body;
      await updateUser(id as string, { ...(name && { name }), ...(email && { email }), ...(role && { role }), ...(typeof isActive === "boolean" && { isActive }) });
      if (config) {
        const existing = await getClientConfig(id as string);
        if (existing) await updateClientConfig(id as string, config);
        else await createClientConfig({ userId: id as string, ...config });
      }
      const updated = await getUser(id as string);
      const finalConfig = await getClientConfig(id as string);
      return res.status(200).json({ ...updated, passwordHash: undefined, config: finalConfig });
    }

    // DELETE /api/admin?resource=clients&id=xxx
    if (req.method === "DELETE" && resource === "clients" && id) {
      await deleteUser(id as string);
      return res.status(204).end();
    }

    // GET /api/admin?resource=establishments
    if (req.method === "GET" && resource === "establishments") {
      const establishments = await getAllEstablishments();
      const enriched = await Promise.all(establishments.map(async (est) => {
        const owner = await getUser(est.userId);
        return { ...est, ownerName: owner?.name || "Unknown", ownerEmail: owner?.email || "Unknown" };
      }));
      return res.status(200).json(enriched);
    }

    // GET /api/admin?resource=ai-templates
    if (req.method === "GET" && resource === "ai-templates" && !id) {
      const templates = await getAllAiTemplates();
      return res.status(200).json(templates);
    }

    // POST /api/admin?resource=ai-templates
    if (req.method === "POST" && resource === "ai-templates") {
      const { name, description, promptTemplate, category } = req.body;
      if (!name || !promptTemplate) return res.status(400).json({ error: "Name and promptTemplate required" });
      const template = await createAiTemplate({ name, description, promptTemplate, category: category || "general", isActive: true });
      return res.status(201).json(template);
    }

    // PATCH /api/admin?resource=ai-templates&id=xxx
    if ((req.method === "PATCH" || req.method === "PUT") && resource === "ai-templates" && id) {
      const updated = await updateAiTemplate(id as string, req.body);
      return res.status(200).json(updated);
    }

    // DELETE /api/admin?resource=ai-templates&id=xxx
    if (req.method === "DELETE" && resource === "ai-templates" && id) {
      await deleteAiTemplate(id as string);
      return res.status(204).end();
    }

    // GET /api/admin?resource=activity-logs
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
