import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAuthUser } from "../lib/auth";
import { getEstablishmentsByUser, createEstablishment } from "../lib/storage";
import { insertEstablishmentSchema } from "../../shared/schema";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const user = await getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    if (req.method === "GET") {
      const establishments = await getEstablishmentsByUser(user.id);
      return res.status(200).json(establishments);
    }

    if (req.method === "POST") {
      const parsed = insertEstablishmentSchema.safeParse({ ...req.body, userId: user.id });
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
      }

      const establishment = await createEstablishment(parsed.data);
      return res.status(201).json(establishment);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Establishments error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
