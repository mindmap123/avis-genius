import type { VercelRequest, VercelResponse } from "@vercel/node";
import { loginSchema, registerSchema } from "../shared/schema";
import { getUserByEmail, createUser, getUser } from "./lib/storage";
import { hashPassword, verifyPassword, createToken, verifyToken } from "./lib/auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { action } = req.query;

  try {
    // POST /api/auth?action=login
    if (req.method === "POST" && action === "login") {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid input" });
      }
      const { email, password } = parsed.data;
      const user = await getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      const valid = await verifyPassword(password, user.passwordHash);
      if (!valid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      const token = await createToken(user.id);
      return res.status(200).json({
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
        token,
      });
    }

    // POST /api/auth?action=register
    if (req.method === "POST" && action === "register") {
      const parsed = registerSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid input" });
      }
      const { email, password, name } = parsed.data;
      const existing = await getUserByEmail(email);
      if (existing) {
        return res.status(409).json({ error: "Email already registered" });
      }
      const passwordHash = await hashPassword(password);
      const user = await createUser({ email, passwordHash, name, role: "client", isActive: true });
      const token = await createToken(user.id);
      return res.status(201).json({
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
        token,
      });
    }

    // GET /api/auth?action=me
    if (req.method === "GET" && action === "me") {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const token = authHeader.slice(7);
      const payload = await verifyToken(token);
      if (!payload) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const user = await getUser(payload.userId);
      if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      return res.status(200).json({
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
      });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
