import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAuthUser } from "../lib/auth";
import { getEstablishment, updateEstablishment, deleteEstablishment } from "../lib/storage";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const user = await getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { id } = req.query;
  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    const establishment = await getEstablishment(id);
    if (!establishment || establishment.userId !== user.id) {
      return res.status(404).json({ error: "Establishment not found" });
    }

    if (req.method === "GET") {
      return res.status(200).json(establishment);
    }

    if (req.method === "PUT" || req.method === "PATCH") {
      const updated = await updateEstablishment(id, req.body);
      return res.status(200).json(updated);
    }

    if (req.method === "DELETE") {
      await deleteEstablishment(id);
      return res.status(204).end();
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Establishment error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
