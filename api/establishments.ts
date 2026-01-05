import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAuthUser } from "./lib/auth";
import { getEstablishmentsByUser, createEstablishment, getEstablishment, updateEstablishment, deleteEstablishment } from "./lib/storage";
import { insertEstablishmentSchema } from "../shared/schema";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const user = await getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { id } = req.query;

  try {
    // GET /api/establishments - List all
    if (req.method === "GET" && !id) {
      const establishments = await getEstablishmentsByUser(user.id);
      return res.status(200).json(establishments);
    }

    // POST /api/establishments - Create
    if (req.method === "POST" && !id) {
      const parsed = insertEstablishmentSchema.safeParse({ ...req.body, userId: user.id });
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid input" });
      }
      const establishment = await createEstablishment(parsed.data);
      return res.status(201).json(establishment);
    }

    // GET /api/establishments?id=xxx - Get one
    if (req.method === "GET" && id) {
      const establishment = await getEstablishment(id as string);
      if (!establishment || establishment.userId !== user.id) {
        return res.status(404).json({ error: "Not found" });
      }
      return res.status(200).json(establishment);
    }

    // PATCH /api/establishments?id=xxx - Update
    if ((req.method === "PATCH" || req.method === "PUT") && id) {
      const establishment = await getEstablishment(id as string);
      if (!establishment || establishment.userId !== user.id) {
        return res.status(404).json({ error: "Not found" });
      }
      const updated = await updateEstablishment(id as string, req.body);
      return res.status(200).json(updated);
    }

    // DELETE /api/establishments?id=xxx
    if (req.method === "DELETE" && id) {
      const establishment = await getEstablishment(id as string);
      if (!establishment || establishment.userId !== user.id) {
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
