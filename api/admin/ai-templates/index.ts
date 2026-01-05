import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAdmin } from "../../lib/auth";
import { getAllAiTemplates, createAiTemplate } from "../../lib/storage";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const admin = await requireAdmin(req);
  if (!admin) {
    return res.status(403).json({ error: "Admin access required" });
  }

  try {
    if (req.method === "GET") {
      const templates = await getAllAiTemplates();
      return res.status(200).json(templates);
    }

    if (req.method === "POST") {
      const { name, description, promptTemplate, category } = req.body;

      if (!name || !promptTemplate) {
        return res.status(400).json({ error: "Name and promptTemplate are required" });
      }

      const template = await createAiTemplate({
        name,
        description,
        promptTemplate,
        category: category || "general",
        isActive: true,
      });

      return res.status(201).json(template);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Admin AI templates error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
