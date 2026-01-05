import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAdmin } from "../../lib/auth";
import { getAllUsers, createUser, getEstablishmentsByUser, getClientConfig } from "../../lib/storage";
import { hashPassword } from "../../lib/auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const admin = await requireAdmin(req);
  if (!admin) {
    return res.status(403).json({ error: "Admin access required" });
  }

  try {
    if (req.method === "GET") {
      const users = await getAllUsers();
      
      // Enrich with establishments count and config
      const enrichedUsers = await Promise.all(
        users.map(async (user) => {
          const establishments = await getEstablishmentsByUser(user.id);
          const config = await getClientConfig(user.id);
          return {
            ...user,
            passwordHash: undefined, // Don't expose
            establishmentsCount: establishments.length,
            config,
          };
        })
      );

      return res.status(200).json(enrichedUsers);
    }

    if (req.method === "POST") {
      const { email, password, name, role } = req.body;

      if (!email || !password || !name) {
        return res.status(400).json({ error: "Email, password and name are required" });
      }

      const passwordHash = await hashPassword(password);
      const user = await createUser({
        email,
        passwordHash,
        name,
        role: role || "client",
        isActive: true,
      });

      return res.status(201).json({
        ...user,
        passwordHash: undefined,
      });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Admin clients error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
