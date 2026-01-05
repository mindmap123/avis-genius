import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAdmin } from "../lib/auth";
import { getGlobalStats } from "../lib/storage";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const admin = await requireAdmin(req);
  if (!admin) {
    return res.status(403).json({ error: "Admin access required" });
  }

  try {
    const stats = await getGlobalStats();
    return res.status(200).json(stats);
  } catch (error) {
    console.error("Admin stats error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
