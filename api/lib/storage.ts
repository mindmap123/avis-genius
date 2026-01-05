import { eq, desc, sql, count } from "drizzle-orm";
import { db } from "./db";
import {
  users, establishments, reviews, responses, clientsConfig, activityLogs, billing, aiTemplates,
  type User, type InsertUser,
  type Establishment, type InsertEstablishment,
  type Review, type InsertReview,
  type Response, type InsertResponse,
  type ClientsConfig, type InsertClientsConfig,
  type ActivityLog, type InsertActivityLog,
  type Billing, type InsertBilling,
  type AiTemplate, type InsertAiTemplate,
} from "../../shared/schema";

// ============ USERS ============
export async function getUser(id: string): Promise<User | undefined> {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  return user;
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  return user;
}

export async function createUser(user: InsertUser): Promise<User> {
  const [created] = await db.insert(users).values(user).returning();
  return created;
}

export async function updateUser(id: string, data: Partial<InsertUser>): Promise<User | undefined> {
  const [updated] = await db.update(users).set(data).where(eq(users.id, id)).returning();
  return updated;
}

export async function getAllUsers(): Promise<User[]> {
  return db.select().from(users).orderBy(desc(users.createdAt));
}

export async function getUsersCount(): Promise<number> {
  const [result] = await db.select({ count: count() }).from(users);
  return result.count;
}

export async function deleteUser(id: string): Promise<boolean> {
  const result = await db.delete(users).where(eq(users.id, id));
  return (result.rowCount ?? 0) > 0;
}

// ============ CLIENTS CONFIG ============
export async function getClientConfig(userId: string): Promise<ClientsConfig | undefined> {
  const [config] = await db.select().from(clientsConfig).where(eq(clientsConfig.userId, userId));
  return config;
}

export async function createClientConfig(config: InsertClientsConfig): Promise<ClientsConfig> {
  const [created] = await db.insert(clientsConfig).values(config).returning();
  return created;
}

export async function updateClientConfig(userId: string, data: Partial<InsertClientsConfig>): Promise<ClientsConfig | undefined> {
  const [updated] = await db.update(clientsConfig)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(clientsConfig.userId, userId))
    .returning();
  return updated;
}

// ============ ESTABLISHMENTS ============
export async function getEstablishment(id: string): Promise<Establishment | undefined> {
  const [establishment] = await db.select().from(establishments).where(eq(establishments.id, id));
  return establishment;
}

export async function getEstablishmentsByUser(userId: string): Promise<Establishment[]> {
  return db.select().from(establishments).where(eq(establishments.userId, userId));
}

export async function getAllEstablishments(): Promise<Establishment[]> {
  return db.select().from(establishments).orderBy(desc(establishments.createdAt));
}

export async function getEstablishmentsCount(): Promise<number> {
  const [result] = await db.select({ count: count() }).from(establishments);
  return result.count;
}

export async function createEstablishment(establishment: InsertEstablishment): Promise<Establishment> {
  const [created] = await db.insert(establishments).values(establishment).returning();
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

// ============ REVIEWS ============
export async function getReview(id: string): Promise<Review | undefined> {
  const [review] = await db.select().from(reviews).where(eq(reviews.id, id));
  return review;
}

export async function getReviewsByEstablishment(establishmentId: string): Promise<Review[]> {
  return db.select().from(reviews).where(eq(reviews.establishmentId, establishmentId)).orderBy(desc(reviews.publishedAt));
}

export async function getAllReviews(): Promise<Review[]> {
  return db.select().from(reviews).orderBy(desc(reviews.publishedAt));
}

export async function getReviewsCount(): Promise<number> {
  const [result] = await db.select({ count: count() }).from(reviews);
  return result.count;
}

export async function getPendingReviewsCount(): Promise<number> {
  const [result] = await db.select({ count: count() }).from(reviews).where(eq(reviews.status, "pending"));
  return result.count;
}

export async function createReview(review: InsertReview): Promise<Review> {
  const [created] = await db.insert(reviews).values(review).returning();
  return created;
}

export async function updateReview(id: string, data: Partial<InsertReview>): Promise<Review | undefined> {
  const [updated] = await db.update(reviews).set(data).where(eq(reviews.id, id)).returning();
  return updated;
}

export async function getReviewByGoogleId(googleReviewId: string): Promise<Review | undefined> {
  const [review] = await db.select().from(reviews).where(eq(reviews.googleReviewId, googleReviewId));
  return review;
}

// ============ RESPONSES ============
export async function getResponse(id: string): Promise<Response | undefined> {
  const [response] = await db.select().from(responses).where(eq(responses.id, id));
  return response;
}

export async function getResponseByReview(reviewId: string): Promise<Response | undefined> {
  const [response] = await db.select().from(responses).where(eq(responses.reviewId, reviewId));
  return response;
}

export async function getResponsesCount(): Promise<number> {
  const [result] = await db.select({ count: count() }).from(responses).where(eq(responses.postedToGoogle, true));
  return result.count;
}

export async function createResponse(response: InsertResponse): Promise<Response> {
  const [created] = await db.insert(responses).values(response).returning();
  return created;
}

export async function updateResponse(id: string, data: Partial<InsertResponse>): Promise<Response | undefined> {
  const [updated] = await db.update(responses).set(data).where(eq(responses.id, id)).returning();
  return updated;
}


// ============ ACTIVITY LOGS ============
export async function createActivityLog(log: InsertActivityLog): Promise<ActivityLog> {
  const [created] = await db.insert(activityLogs).values(log).returning();
  return created;
}

export async function getActivityLogs(limit = 100): Promise<ActivityLog[]> {
  return db.select().from(activityLogs).orderBy(desc(activityLogs.createdAt)).limit(limit);
}

export async function getActivityLogsByUser(userId: string, limit = 50): Promise<ActivityLog[]> {
  return db.select().from(activityLogs).where(eq(activityLogs.userId, userId)).orderBy(desc(activityLogs.createdAt)).limit(limit);
}

// ============ BILLING ============
export async function getBilling(userId: string): Promise<Billing | undefined> {
  const [bill] = await db.select().from(billing).where(eq(billing.userId, userId));
  return bill;
}

export async function createBilling(bill: InsertBilling): Promise<Billing> {
  const [created] = await db.insert(billing).values(bill).returning();
  return created;
}

export async function updateBilling(userId: string, data: Partial<InsertBilling>): Promise<Billing | undefined> {
  const [updated] = await db.update(billing)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(billing.userId, userId))
    .returning();
  return updated;
}

// ============ AI TEMPLATES ============
export async function getAiTemplate(id: string): Promise<AiTemplate | undefined> {
  const [template] = await db.select().from(aiTemplates).where(eq(aiTemplates.id, id));
  return template;
}

export async function getAllAiTemplates(): Promise<AiTemplate[]> {
  return db.select().from(aiTemplates).orderBy(desc(aiTemplates.createdAt));
}

export async function getActiveAiTemplates(): Promise<AiTemplate[]> {
  return db.select().from(aiTemplates).where(eq(aiTemplates.isActive, true)).orderBy(aiTemplates.name);
}

export async function createAiTemplate(template: InsertAiTemplate): Promise<AiTemplate> {
  const [created] = await db.insert(aiTemplates).values(template).returning();
  return created;
}

export async function updateAiTemplate(id: string, data: Partial<InsertAiTemplate>): Promise<AiTemplate | undefined> {
  const [updated] = await db.update(aiTemplates)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(aiTemplates.id, id))
    .returning();
  return updated;
}

export async function deleteAiTemplate(id: string): Promise<boolean> {
  const result = await db.delete(aiTemplates).where(eq(aiTemplates.id, id));
  return (result.rowCount ?? 0) > 0;
}

// ============ ADMIN STATS ============
export async function getGlobalStats() {
  const [usersCount, establishmentsCount, reviewsCount, pendingCount, responsesCount] = await Promise.all([
    getUsersCount(),
    getEstablishmentsCount(),
    getReviewsCount(),
    getPendingReviewsCount(),
    getResponsesCount(),
  ]);

  return {
    totalUsers: usersCount,
    totalEstablishments: establishmentsCount,
    totalReviews: reviewsCount,
    pendingReviews: pendingCount,
    totalResponses: responsesCount,
    responseRate: reviewsCount > 0 ? Math.round((responsesCount / reviewsCount) * 100) : 0,
  };
}
