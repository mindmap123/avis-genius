import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAdmin } from "../lib/auth";
import { getAllEstablishments, getUser } from "../lib/storage";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const admin = await requireAdmin(req);
  if (!admin) {
    return res.status(403).json({ error: "Admin access required" });
  }

  try {
    const establishments = await getAllEstablishments();
    
    // Enrich with owner info
    const enriched = await Promise.all(
      establishments.map(async (est) => {
        const owner = await getUser(est.userId);
        return {
          ...est,
          ownerName: owner?.name || "Unknown",
          ownerEmail: owner?.email || "Unknown",
        };
      })
    );

    return res.status(200).json(enriched);
  } catch (error) {
    console.error("Admin establishments error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
