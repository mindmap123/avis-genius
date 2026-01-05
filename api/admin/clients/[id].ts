import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAdmin } from "../../lib/auth";
import { getUser, updateUser, deleteUser, getEstablishmentsByUser, getClientConfig, updateClientConfig, createClientConfig } from "../../lib/storage";

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
    const user = await getUser(id);
    if (!user) {
      return res.status(404).json({ error: "Client not found" });
    }

    if (req.method === "GET") {
      const establishments = await getEstablishmentsByUser(id);
      const config = await getClientConfig(id);

      return res.status(200).json({
        ...user,
        passwordHash: undefined,
        establishments,
        config,
      });
    }

    if (req.method === "PUT" || req.method === "PATCH") {
      const { name, email, role, isActive, config } = req.body;

      // Update user
      const updatedUser = await updateUser(id, {
        ...(name && { name }),
        ...(email && { email }),
        ...(role && { role }),
        ...(typeof isActive === "boolean" && { isActive }),
      });

      // Update or create config if provided
      if (config) {
        const existingConfig = await getClientConfig(id);
        if (existingConfig) {
          await updateClientConfig(id, config);
        } else {
          await createClientConfig({ userId: id, ...config });
        }
      }

      const finalConfig = await getClientConfig(id);

      return res.status(200).json({
        ...updatedUser,
        passwordHash: undefined,
        config: finalConfig,
      });
    }

    if (req.method === "DELETE") {
      await deleteUser(id);
      return res.status(204).end();
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Admin client error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
