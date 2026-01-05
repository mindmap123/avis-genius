import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import type { VercelRequest } from "@vercel/node";
import { getUser } from "./storage";
import type { User } from "../../shared/schema";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "avis-genius-secret-key-change-in-prod");

// Admin emails from env (comma-separated)
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim().toLowerCase()).filter(Boolean);

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createToken(userId: string): Promise<string> {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<{ userId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return { userId: payload.userId as string };
  } catch {
    return null;
  }
}

export async function getAuthUser(req: VercelRequest): Promise<User | null> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }
  
  const token = authHeader.slice(7);
  const payload = await verifyToken(token);
  if (!payload) {
    return null;
  }
  
  const user = await getUser(payload.userId);
  return user || null;
}

export function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

export async function requireAdmin(req: VercelRequest): Promise<User | null> {
  const user = await getAuthUser(req);
  if (!user) return null;
  
  // Check if user is admin by role OR by hardcoded email
  if (user.role === "admin" || isAdminEmail(user.email)) {
    return user;
  }
  
  return null;
}

export function unauthorized() {
  return { error: "Unauthorized", status: 401 };
}

export function forbidden() {
  return { error: "Forbidden - Admin access required", status: 403 };
}
