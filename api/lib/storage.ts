import { eq, desc, and, inArray, count } from "drizzle-orm";
import { db } from "./db";
import {
  organizations, users, establishments, reviews, responses, 
  userEstablishmentPermissions, activityLogs, billing, aiTemplates,
  type Organization, type InsertOrganization,
  type User, type InsertUser,
  type Establishment, type InsertEstablishment,
  type Review, type InsertReview,
  type Response, type InsertResponse,
  type UserEstablishmentPermission, type InsertUserEstablishmentPermission,
  type ActivityLog, type InsertActivityLog,
  type Billing, type InsertBilling,
  type AiTemplate, type InsertAiTemplate,
} from "../../shared/schema";

export type { Organization, User, Establishment, Review, Response, UserEstablishmentPermission, ActivityLog, Billing, AiTemplate };

// ============ ORGANIZATIONS ============
export async function getOrganization(id: string): Promise<Organization | undefined> {
  const [org] = await db.select().from(organizations).where(eq(organizations.id, id));
  return org;
}

export async function getOrganizationBySlug(slug: string): Promise<Organization | undefined> {
  const [org] = await db.select().from(organizations).where(eq(organizations.slug, slug));
  return org;
}

export async function getAllOrganizations(): Promise<Organization[]> {
  return db.select().from(organizations).orderBy(desc(organizations.createdAt));
}

export async function createOrganization(org: InsertOrganization): Promise<Organization> {
  const [created] = await db.insert(organizations).values(org).returning();
  return created;
}

export async function updateOrganization(id: string, data: Partial<InsertOrganization>): Promise<Organization | undefined> {
  const [updated] = await db.update(organizations).set(data).where(eq(organizations.id, id)).returning();
  return updated;
}

export async function deleteOrganization(id: string): Promise<boolean> {
  const result = await db.delete(organizations).where(eq(organizations.id, id));
  return (result.rowCount ?? 0) > 0;
}

export async function getOrganizationsCount(): Promise<number> {
  const [result] = await db.select({ count: count() }).from(organizations);
  return result.count;
}

// ============ USERS ============
export async function getUser(id: string): Promise<User | undefined> {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  return user;
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  return user;
}

export async function getUsersByOrganization(organizationId: string): Promise<User[]> {
  return db.select().from(users).where(eq(users.organizationId, organizationId)).orderBy(desc(users.createdAt));
}

export async function getAllUsers(): Promise<User[]> {
  return db.select().from(users).orderBy(desc(users.createdAt));
}

export async function createUser(user: InsertUser): Promise<User> {
  const [created] = await db.insert(users).values(user).returning();
  return created;
}

export async function updateUser(id: string, data: Partial<InsertUser>): Promise<User | undefined> {
  const [updated] = await db.update(users).set(data).where(eq(users.id, id)).returning();
  return updated;
}

export async function deleteUser(id: string): Promise<boolean> {
  const result = await db.delete(users).where(eq(users.id, id));
  return (result.rowCount ?? 0) > 0;
}

export async function getUsersCount(): Promise<number> {
  const [result] = await db.select({ count: count() }).from(users);
  return result.count;
}


// ============ USER PERMISSIONS ============
export async function getUserPermissions(userId: string): Promise<UserEstablishmentPermission[]> {
  return db.select().from(userEstablishmentPermissions).where(eq(userEstablishmentPermissions.userId, userId));
}

export async function getUserPermissionForEstablishment(userId: string, establishmentId: string): Promise<UserEstablishmentPermission | undefined> {
  const [perm] = await db.select().from(userEstablishmentPermissions)
    .where(and(eq(userEstablishmentPermissions.userId, userId), eq(userEstablishmentPermissions.establishmentId, establishmentId)));
  return perm;
}

export async function setUserPermission(perm: InsertUserEstablishmentPermission): Promise<UserEstablishmentPermission> {
  // Upsert logic
  const existing = await getUserPermissionForEstablishment(perm.userId, perm.establishmentId);
  if (existing) {
    const [updated] = await db.update(userEstablishmentPermissions)
      .set(perm)
      .where(eq(userEstablishmentPermissions.id, existing.id))
      .returning();
    return updated;
  }
  const [created] = await db.insert(userEstablishmentPermissions).values(perm).returning();
  return created;
}

export async function deleteUserPermission(userId: string, establishmentId: string): Promise<boolean> {
  const result = await db.delete(userEstablishmentPermissions)
    .where(and(eq(userEstablishmentPermissions.userId, userId), eq(userEstablishmentPermissions.establishmentId, establishmentId)));
  return (result.rowCount ?? 0) > 0;
}

export async function getEstablishmentIdsForUser(user: User): Promise<string[]> {
  // Owner/Admin of org can access all establishments
  if (user.role === "owner" || user.role === "admin") {
    if (!user.organizationId) return [];
    const ests = await getEstablishmentsByOrganization(user.organizationId);
    return ests.map(e => e.id);
  }
  // Manager/Viewer only access permitted establishments
  const perms = await getUserPermissions(user.id);
  return perms.filter(p => p.canView).map(p => p.establishmentId);
}

// ============ ESTABLISHMENTS ============
export async function getEstablishment(id: string): Promise<Establishment | undefined> {
  const [est] = await db.select().from(establishments).where(eq(establishments.id, id));
  return est;
}

export async function getEstablishmentsByOrganization(organizationId: string): Promise<Establishment[]> {
  return db.select().from(establishments).where(eq(establishments.organizationId, organizationId)).orderBy(establishments.name);
}

export async function getAllEstablishments(): Promise<Establishment[]> {
  return db.select().from(establishments).orderBy(desc(establishments.createdAt));
}

export async function createEstablishment(est: InsertEstablishment): Promise<Establishment> {
  const [created] = await db.insert(establishments).values(est).returning();
  return created;
}

export async function updateEstablishment(id: string, data: Partial<InsertEstablishment>): Promise<Establishment | undefined> {
  const [updated] = await db.update(establishments).set(data).where(eq(establishments.id, id)).returning();
  return updated;
}

export async function deleteEstablishment(id: string): Promise<boolean> {
  const result = await db.delete(establishments).where(eq(establishments.id, id));
  return (result.rowCount ?? 0) > 0;
}

export async function getEstablishmentsCount(): Promise<number> {
  const [result] = await db.select({ count: count() }).from(establishments);
  return result.count;
}

// ============ REVIEWS ============
export async function getReview(id: string): Promise<Review | undefined> {
  const [review] = await db.select().from(reviews).where(eq(reviews.id, id));
  return review;
}

export async function getReviewsByEstablishment(establishmentId: string): Promise<Review[]> {
  return db.select().from(reviews).where(eq(reviews.establishmentId, establishmentId)).orderBy(desc(reviews.publishedAt));
}

export async function getReviewsByEstablishments(establishmentIds: string[]): Promise<Review[]> {
  if (establishmentIds.length === 0) return [];
  return db.select().from(reviews).where(inArray(reviews.establishmentId, establishmentIds)).orderBy(desc(reviews.publishedAt));
}

export async function createReview(review: InsertReview): Promise<Review> {
  const [created] = await db.insert(reviews).values(review).returning();
  return created;
}

export async function updateReview(id: string, data: Partial<InsertReview>): Promise<Review | undefined> {
  const [updated] = await db.update(reviews).set(data).where(eq(reviews.id, id)).returning();
  return updated;
}

export async function getReviewsCount(): Promise<number> {
  const [result] = await db.select({ count: count() }).from(reviews);
  return result.count;
}

export async function getPendingReviewsCount(): Promise<number> {
  const [result] = await db.select({ count: count() }).from(reviews).where(eq(reviews.status, "pending"));
  return result.count;
}

export async function getUrgentReviewsCount(): Promise<number> {
  const [result] = await db.select({ count: count() }).from(reviews)
    .where(and(eq(reviews.status, "pending"), eq(reviews.sentiment, "urgent")));
  return result.count;
}

// ============ RESPONSES ============
export async function getResponse(id: string): Promise<Response | undefined> {
  const [resp] = await db.select().from(responses).where(eq(responses.id, id));
  return resp;
}

export async function getResponseByReview(reviewId: string): Promise<Response | undefined> {
  const [resp] = await db.select().from(responses).where(eq(responses.reviewId, reviewId));
  return resp;
}

export async function createResponse(resp: InsertResponse): Promise<Response> {
  const [created] = await db.insert(responses).values(resp).returning();
  return created;
}

export async function updateResponse(id: string, data: Partial<InsertResponse>): Promise<Response | undefined> {
  const [updated] = await db.update(responses).set(data).where(eq(responses.id, id)).returning();
  return updated;
}

export async function getResponsesCount(): Promise<number> {
  const [result] = await db.select({ count: count() }).from(responses);
  return result.count;
}

export async function getPostedResponsesCount(): Promise<number> {
  const [result] = await db.select({ count: count() }).from(responses).where(eq(responses.postedToGoogle, true));
  return result.count;
}

// ============ ACTIVITY LOGS ============
export async function createActivityLog(log: InsertActivityLog): Promise<ActivityLog> {
  const [created] = await db.insert(activityLogs).values(log).returning();
  return created;
}

export async function getActivityLogs(limit: number = 100): Promise<ActivityLog[]> {
  return db.select().from(activityLogs).orderBy(desc(activityLogs.createdAt)).limit(limit);
}

export async function getActivityLogsByOrganization(organizationId: string, limit: number = 100): Promise<ActivityLog[]> {
  return db.select().from(activityLogs)
    .where(eq(activityLogs.organizationId, organizationId))
    .orderBy(desc(activityLogs.createdAt))
    .limit(limit);
}

// ============ BILLING ============
export async function getBilling(organizationId: string): Promise<Billing | undefined> {
  const [bill] = await db.select().from(billing).where(eq(billing.organizationId, organizationId));
  return bill;
}

export async function createBilling(bill: InsertBilling): Promise<Billing> {
  const [created] = await db.insert(billing).values(bill).returning();
  return created;
}

export async function updateBilling(organizationId: string, data: Partial<InsertBilling>): Promise<Billing | undefined> {
  const [updated] = await db.update(billing).set({ ...data, updatedAt: new Date() })
    .where(eq(billing.organizationId, organizationId)).returning();
  return updated;
}

// ============ AI TEMPLATES ============
export async function getAiTemplate(id: string): Promise<AiTemplate | undefined> {
  const [tpl] = await db.select().from(aiTemplates).where(eq(aiTemplates.id, id));
  return tpl;
}

export async function getAllAiTemplates(): Promise<AiTemplate[]> {
  return db.select().from(aiTemplates).orderBy(aiTemplates.name);
}

export async function createAiTemplate(tpl: InsertAiTemplate): Promise<AiTemplate> {
  const [created] = await db.insert(aiTemplates).values(tpl).returning();
  return created;
}

export async function updateAiTemplate(id: string, data: Partial<InsertAiTemplate>): Promise<AiTemplate | undefined> {
  const [updated] = await db.update(aiTemplates).set({ ...data, updatedAt: new Date() })
    .where(eq(aiTemplates.id, id)).returning();
  return updated;
}

export async function deleteAiTemplate(id: string): Promise<boolean> {
  const result = await db.delete(aiTemplates).where(eq(aiTemplates.id, id));
  return (result.rowCount ?? 0) > 0;
}

// ============ GLOBAL STATS (ADMIN) ============
export async function getGlobalStats() {
  const [orgsCount, usersCount, establishmentsCount, reviewsCount, pendingCount, urgentCount, responsesCount] = await Promise.all([
    getOrganizationsCount(),
    getUsersCount(),
    getEstablishmentsCount(),
    getReviewsCount(),
    getPendingReviewsCount(),
    getUrgentReviewsCount(),
    getPostedResponsesCount(),
  ]);
  
  const responseRate = reviewsCount > 0 ? Math.round((responsesCount / reviewsCount) * 100) : 0;
  
  return {
    totalOrganizations: orgsCount,
    totalUsers: usersCount,
    totalEstablishments: establishmentsCount,
    totalReviews: reviewsCount,
    pendingReviews: pendingCount,
    urgentReviews: urgentCount,
    totalResponses: responsesCount,
    responseRate,
  };
}