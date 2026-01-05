import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAdmin } from "../../lib/auth";
import { getAiTemplate, updateAiTemplate, deleteAiTemplate } from "../../lib/storage";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const admin = await requireAdmin(req);
  if (!admin) {
    return res.status(403).json({ error: "Admin access required" });
  }

  const { id } = req.query;
  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    const template = await getAiTemplate(id);
    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }

    if (req.method === "GET") {
      return res.status(200).json(template);
    }

    if (req.method === "PUT" || req.method === "PATCH") {
      const updated = await updateAiTemplate(id, req.body);
      return res.status(200).json(updated);
    }

    if (req.method === "DELETE") {
      await deleteAiTemplate(id);
      return res.status(204).end();
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Admin AI template error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
