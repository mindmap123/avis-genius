import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAdmin } from "../lib/auth";
import { getActivityLogs } from "../lib/storage";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const admin = await requireAdmin(req);
  if (!admin) {
    return res.status(403).json({ error: "Admin access required" });
  }

  try {
    const limit = parseInt(req.query.limit as string) || 100;
    const logs = await getActivityLogs(limit);
    return res.status(200).json(logs);
  } catch (error) {
    console.error("Admin activity logs error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
