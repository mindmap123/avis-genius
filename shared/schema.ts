import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, pgEnum, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// ============ ENUMS ============
export const reviewStatusEnum = pgEnum("review_status", ["pending", "responded", "ignored"]);
export const sentimentEnum = pgEnum("sentiment", ["urgent", "positive", "neutral"]);
export const aiToneEnum = pgEnum("ai_tone", ["formal", "friendly", "professional"]);
export const orgRoleEnum = pgEnum("org_role", ["owner", "admin", "manager", "viewer"]);
export const billingStatusEnum = pgEnum("billing_status", ["trial", "active", "past_due", "cancelled"]);
export const activityTypeEnum = pgEnum("activity_type", ["login", "review_responded", "ai_generated", "settings_changed", "establishment_added", "user_invited"]);

// ============ ORGANIZATIONS ============
export const organizations = pgTable("organizations", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  logo: text("logo"),
  defaultAiTone: aiToneEnum("default_ai_tone").default("professional"),
  defaultSignature: text("default_signature"),
  customPromptInstructions: text("custom_prompt_instructions"),
  maxUsers: integer("max_users").default(5),
  maxEstablishments: integer("max_establishments").default(10),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============ USERS ============
export const users = pgTable("users", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  avatar: text("avatar"),
  organizationId: varchar("organization_id", { length: 36 }).references(() => organizations.id, { onDelete: "cascade" }),
  role: orgRoleEnum("role").default("viewer").notNull(),
  isSuperAdmin: boolean("is_super_admin").default(false).notNull(), // Platform admin
  isActive: boolean("is_active").default(true).notNull(),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============ USER ESTABLISHMENT PERMISSIONS ============
export const userEstablishmentPermissions = pgTable("user_establishment_permissions", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }),
  establishmentId: varchar("establishment_id", { length: 36 }).notNull().references(() => establishments.id, { onDelete: "cascade" }),
  canView: boolean("can_view").default(true).notNull(),
  canRespond: boolean("can_respond").default(false).notNull(),
  canManage: boolean("can_manage").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============ ESTABLISHMENTS ============
export const establishments = pgTable("establishments", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  organizationId: varchar("organization_id", { length: 36 }).notNull().references(() => organizations.id, { onDelete: "cascade" }),
  googlePlaceId: text("google_place_id"),
  googleAccountId: text("google_account_id"),
  googleLocationId: text("google_location_id"),
  googleAccessToken: text("google_access_token"),
  googleRefreshToken: text("google_refresh_token"),
  name: text("name").notNull(),
  address: text("address"),
  phone: text("phone"),
  aiTone: aiToneEnum("ai_tone").default("professional"),
  signatureTemplate: text("signature_template"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============ REVIEWS ============
export const reviews = pgTable("reviews", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  establishmentId: varchar("establishment_id", { length: 36 }).notNull().references(() => establishments.id, { onDelete: "cascade" }),
  googleReviewId: text("google_review_id").unique(),
  authorName: text("author_name").notNull(),
  authorPhotoUrl: text("author_photo_url"),
  rating: integer("rating").notNull(),
  content: text("content"),
  publishedAt: timestamp("published_at").notNull(),
  sentiment: sentimentEnum("sentiment").default("neutral"),
  status: reviewStatusEnum("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============ RESPONSES ============
export const responses = pgTable("responses", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  reviewId: varchar("review_id", { length: 36 }).notNull().references(() => reviews.id, { onDelete: "cascade" }),
  userId: varchar("user_id", { length: 36 }).references(() => users.id, { onDelete: "set null" }),
  aiGeneratedText: text("ai_generated_text").notNull(),
  finalText: text("final_text"),
  postedToGoogle: boolean("posted_to_google").default(false),
  postedAt: timestamp("posted_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});


// ============ ACTIVITY LOGS ============
export const activityLogs = pgTable("activity_logs", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  organizationId: varchar("organization_id", { length: 36 }).references(() => organizations.id, { onDelete: "cascade" }),
  userId: varchar("user_id", { length: 36 }).references(() => users.id, { onDelete: "set null" }),
  activityType: activityTypeEnum("activity_type").notNull(),
  description: text("description").notNull(),
  metadata: jsonb("metadata"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============ BILLING ============
export const billing = pgTable("billing", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  organizationId: varchar("organization_id", { length: 36 }).notNull().references(() => organizations.id, { onDelete: "cascade" }).unique(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  status: billingStatusEnum("status").default("trial").notNull(),
  planName: text("plan_name").default("trial"),
  trialEndsAt: timestamp("trial_ends_at"),
  currentPeriodEnd: timestamp("current_period_end"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ============ AI TEMPLATES ============
export const aiTemplates = pgTable("ai_templates", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  promptTemplate: text("prompt_template").notNull(),
  category: text("category").default("general"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ============ RELATIONS ============
export const organizationsRelations = relations(organizations, ({ many, one }) => ({
  users: many(users),
  establishments: many(establishments),
  billing: one(billing, { fields: [organizations.id], references: [billing.organizationId] }),
  activityLogs: many(activityLogs),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  organization: one(organizations, { fields: [users.organizationId], references: [organizations.id] }),
  permissions: many(userEstablishmentPermissions),
  responses: many(responses),
  activityLogs: many(activityLogs),
}));

export const userEstablishmentPermissionsRelations = relations(userEstablishmentPermissions, ({ one }) => ({
  user: one(users, { fields: [userEstablishmentPermissions.userId], references: [users.id] }),
  establishment: one(establishments, { fields: [userEstablishmentPermissions.establishmentId], references: [establishments.id] }),
}));

export const establishmentsRelations = relations(establishments, ({ one, many }) => ({
  organization: one(organizations, { fields: [establishments.organizationId], references: [organizations.id] }),
  reviews: many(reviews),
  permissions: many(userEstablishmentPermissions),
}));

export const reviewsRelations = relations(reviews, ({ one, many }) => ({
  establishment: one(establishments, { fields: [reviews.establishmentId], references: [establishments.id] }),
  responses: many(responses),
}));

export const responsesRelations = relations(responses, ({ one }) => ({
  review: one(reviews, { fields: [responses.reviewId], references: [reviews.id] }),
  user: one(users, { fields: [responses.userId], references: [users.id] }),
}));

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  organization: one(organizations, { fields: [activityLogs.organizationId], references: [organizations.id] }),
  user: one(users, { fields: [activityLogs.userId], references: [users.id] }),
}));

export const billingRelations = relations(billing, ({ one }) => ({
  organization: one(organizations, { fields: [billing.organizationId], references: [organizations.id] }),
}));


// ============ ZOD SCHEMAS ============
export const insertOrganizationSchema = createInsertSchema(organizations).omit({ id: true, createdAt: true });
export const selectOrganizationSchema = createSelectSchema(organizations);
export type InsertOrganization = z.infer<typeof insertOrganizationSchema>;
export type Organization = typeof organizations.$inferSelect;

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const selectUserSchema = createSelectSchema(users);
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const insertUserEstablishmentPermissionSchema = createInsertSchema(userEstablishmentPermissions).omit({ id: true, createdAt: true });
export type InsertUserEstablishmentPermission = z.infer<typeof insertUserEstablishmentPermissionSchema>;
export type UserEstablishmentPermission = typeof userEstablishmentPermissions.$inferSelect;

export const insertEstablishmentSchema = createInsertSchema(establishments).omit({ id: true, createdAt: true });
export const selectEstablishmentSchema = createSelectSchema(establishments);
export type InsertEstablishment = z.infer<typeof insertEstablishmentSchema>;
export type Establishment = typeof establishments.$inferSelect;

export const insertReviewSchema = createInsertSchema(reviews).omit({ id: true, createdAt: true });
export const selectReviewSchema = createSelectSchema(reviews);
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;

export const insertResponseSchema = createInsertSchema(responses).omit({ id: true, createdAt: true });
export const selectResponseSchema = createSelectSchema(responses);
export type InsertResponse = z.infer<typeof insertResponseSchema>;
export type Response = typeof responses.$inferSelect;

export const insertActivityLogSchema = createInsertSchema(activityLogs).omit({ id: true, createdAt: true });
export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
export type ActivityLog = typeof activityLogs.$inferSelect;

export const insertBillingSchema = createInsertSchema(billing).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertBilling = z.infer<typeof insertBillingSchema>;
export type Billing = typeof billing.$inferSelect;

export const insertAiTemplateSchema = createInsertSchema(aiTemplates).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertAiTemplate = z.infer<typeof insertAiTemplateSchema>;
export type AiTemplate = typeof aiTemplates.$inferSelect;

// ============ AUTH SCHEMAS ============
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  organizationName: z.string().min(2).optional(),
});

export const inviteUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  role: z.enum(["admin", "manager", "viewer"]),
  establishmentIds: z.array(z.string()).optional(),
});
