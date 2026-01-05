import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAuthUser } from "./lib/auth";
import { 
  getEstablishmentsByOrganization, createEstablishment, getEstablishment, 
  updateEstablishment, deleteEstablishment, getEstablishmentIdsForUser, getUser
} from "./lib/storage";
import { insertEstablishmentSchema } from "../shared/schema";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const user = await getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { id } = req.query;

  try {
    // GET /api/establishments - List all accessible establishments
    if (req.method === "GET" && !id) {
      const accessibleIds = await getEstablishmentIdsForUser(user);
      if (!user.organizationId) {
        return res.status(200).json([]);
      }
      const allEstablishments = await getEstablishmentsByOrganization(user.organizationId);
      // Filter by permissions for manager/viewer
      const establishments = user.role === "owner" || user.role === "admin"
        ? allEstablishments
        : allEstablishments.filter(e => accessibleIds.includes(e.id));
      return res.status(200).json(establishments);
    }

    // POST /api/establishments - Create (owner/admin only)
    if (req.method === "POST" && !id) {
      if (user.role !== "owner" && user.role !== "admin") {
        return res.status(403).json({ error: "Only owners and admins can create establishments" });
      }
      if (!user.organizationId) {
        return res.status(400).json({ error: "User must belong to an organization" });
      }
      const parsed = insertEstablishmentSchema.safeParse({ ...req.body, organizationId: user.organizationId });
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
      }
      const establishment = await createEstablishment(parsed.data);
      return res.status(201).json(establishment);
    }

    // GET /api/establishments?id=xxx - Get one
    if (req.method === "GET" && id) {
      const establishment = await getEstablishment(id as string);
      if (!establishment) {
        return res.status(404).json({ error: "Not found" });
      }
      // Check access
      const accessibleIds = await getEstablishmentIdsForUser(user);
      if (!accessibleIds.includes(establishment.id)) {
        return res.status(403).json({ error: "Access denied" });
      }
      return res.status(200).json(establishment);
    }

    // PATCH /api/establishments?id=xxx - Update (owner/admin or manager with canManage)
    if ((req.method === "PATCH" || req.method === "PUT") && id) {
      const establishment = await getEstablishment(id as string);
      if (!establishment) {
        return res.status(404).json({ error: "Not found" });
      }
      // Check permission
      if (user.role !== "owner" && user.role !== "admin") {
        const { getUserPermissionForEstablishment } = await import("./lib/storage");
        const perm = await getUserPermissionForEstablishment(user.id, id as string);
        if (!perm?.canManage) {
          return res.status(403).json({ error: "Access denied" });
        }
      } else if (establishment.organizationId !== user.organizationId) {
        return res.status(403).json({ error: "Access denied" });
      }
      const updated = await updateEstablishment(id as string, req.body);
      return res.status(200).json(updated);
    }

    // DELETE /api/establishments?id=xxx (owner/admin only)
    if (req.method === "DELETE" && id) {
      if (user.role !== "owner" && user.role !== "admin") {
        return res.status(403).json({ error: "Only owners and admins can delete establishments" });
      }
      const establishment = await getEstablishment(id as string);
      if (!establishment || establishment.organizationId !== user.organizationId) {
        return res.status(404).json({ error: "Not found" });
      }
      await deleteEstablishment(id as string);
      return res.status(204).end();
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Establishments error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
