import type { VercelRequest, VercelResponse } from "@vercel/node";
import { loginSchema, registerSchema } from "../shared/schema";
import { getUserByEmail, createUser, getUser, createOrganization, getOrganization, updateUser, createBilling } from "./lib/storage";
import { hashPassword, verifyPassword, createToken, verifyToken } from "./lib/auth";

function generateSlug(name: string): string {
  return name.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    + "-" + Math.random().toString(36).substring(2, 6);
}

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
      
      // Update last login
      await updateUser(user.id, { lastLoginAt: new Date() });
      
      const token = await createToken(user.id);
      const org = user.organizationId ? await getOrganization(user.organizationId) : null;
      
      return res.status(200).json({
        user: { 
          id: user.id, 
          email: user.email, 
          name: user.name, 
          role: user.role,
          isSuperAdmin: user.isSuperAdmin,
          organizationId: user.organizationId,
          organizationName: org?.name,
        },
        token,
      });
    }

    // POST /api/auth?action=register
    if (req.method === "POST" && action === "register") {
      const parsed = registerSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid input" });
      }
      const { email, password, name, organizationName } = parsed.data;
      const existing = await getUserByEmail(email);
      if (existing) {
        return res.status(409).json({ error: "Email already registered" });
      }
      
      // Create organization first
      const orgName = organizationName || `${name}'s Organization`;
      const org = await createOrganization({
        name: orgName,
        slug: generateSlug(orgName),
        isActive: true,
      });
      
      // Create billing record with trial
      const trialEndsAt = new Date();
      trialEndsAt.setDate(trialEndsAt.getDate() + 14); // 14 day trial
      await createBilling({
        organizationId: org.id,
        status: "trial",
        planName: "trial",
        trialEndsAt,
      });
      
      // Create user as owner of the organization
      const passwordHash = await hashPassword(password);
      const user = await createUser({ 
        email, 
        passwordHash, 
        name, 
        organizationId: org.id,
        role: "owner",
        isActive: true,
        isSuperAdmin: false,
      });
      
      const token = await createToken(user.id);
      return res.status(201).json({
        user: { 
          id: user.id, 
          email: user.email, 
          name: user.name, 
          role: user.role,
          isSuperAdmin: user.isSuperAdmin,
          organizationId: user.organizationId,
          organizationName: org.name,
        },
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
      
      const org = user.organizationId ? await getOrganization(user.organizationId) : null;
      
      return res.status(200).json({
        user: { 
          id: user.id, 
          email: user.email, 
          name: user.name, 
          role: user.role,
          isSuperAdmin: user.isSuperAdmin,
          organizationId: user.organizationId,
          organizationName: org?.name,
        },
      });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
