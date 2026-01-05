import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, pgEnum, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Enums
export const reviewStatusEnum = pgEnum("review_status", ["pending", "responded", "ignored"]);
export const sentimentEnum = pgEnum("sentiment", ["urgent", "positive", "neutral"]);
export const aiToneEnum = pgEnum("ai_tone", ["formal", "friendly", "professional"]);
export const userRoleEnum = pgEnum("user_role", ["admin", "client"]);
export const billingStatusEnum = pgEnum("billing_status", ["trial", "active", "past_due", "cancelled"]);
export const activityTypeEnum = pgEnum("activity_type", ["login", "review_responded", "ai_generated", "settings_changed", "establishment_added"]);

// Users
export const users = pgTable("users", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  role: userRoleEnum("role").default("client").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Client Config (AI settings per client)
export const clientsConfig = pgTable("clients_config", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }).unique(),
  defaultAiTone: aiToneEnum("default_ai_tone").default("professional"),
  defaultSignature: text("default_signature"),
  customPromptInstructions: text("custom_prompt_instructions"),
  autoRespondEnabled: boolean("auto_respond_enabled").default(false),
  autoRespondMinRating: integer("auto_respond_min_rating").default(4),
  notifyOnUrgent: boolean("notify_on_urgent").default(true),
  notifyEmail: text("notify_email"),
  maxEstablishments: integer("max_establishments").default(5),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Establishments (Google My Business locations)
export const establishments = pgTable("establishments", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }),
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

// Reviews from Google My Business
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

// AI-generated responses
export const responses = pgTable("responses", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  reviewId: varchar("review_id", { length: 36 }).notNull().references(() => reviews.id, { onDelete: "cascade" }),
  aiGeneratedText: text("ai_generated_text").notNull(),
  finalText: text("final_text"),
  postedToGoogle: boolean("posted_to_google").default(false),
  postedAt: timestamp("posted_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Activity Logs (Audit Trail)
export const activityLogs = pgTable("activity_logs", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 36 }).references(() => users.id, { onDelete: "set null" }),
  activityType: activityTypeEnum("activity_type").notNull(),
  description: text("description").notNull(),
  metadata: jsonb("metadata"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Billing (Stripe - prepared for later)
export const billing = pgTable("billing", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }).unique(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  status: billingStatusEnum("status").default("trial").notNull(),
  planName: text("plan_name").default("trial"),
  trialEndsAt: timestamp("trial_ends_at"),
  currentPeriodEnd: timestamp("current_period_end"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// AI Templates (Global admin-managed)
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


// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  establishments: many(establishments),
  config: one(clientsConfig, { fields: [users.id], references: [clientsConfig.userId] }),
  billing: one(billing, { fields: [users.id], references: [billing.userId] }),
  activityLogs: many(activityLogs),
}));

export const clientsConfigRelations = relations(clientsConfig, ({ one }) => ({
  user: one(users, { fields: [clientsConfig.userId], references: [users.id] }),
}));

export const establishmentsRelations = relations(establishments, ({ one, many }) => ({
  user: one(users, { fields: [establishments.userId], references: [users.id] }),
  reviews: many(reviews),
}));

export const reviewsRelations = relations(reviews, ({ one, many }) => ({
  establishment: one(establishments, { fields: [reviews.establishmentId], references: [establishments.id] }),
  responses: many(responses),
}));

export const responsesRelations = relations(responses, ({ one }) => ({
  review: one(reviews, { fields: [responses.reviewId], references: [reviews.id] }),
}));

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  user: one(users, { fields: [activityLogs.userId], references: [users.id] }),
}));

export const billingRelations = relations(billing, ({ one }) => ({
  user: one(users, { fields: [billing.userId], references: [users.id] }),
}));

// Zod Schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const selectUserSchema = createSelectSchema(users);
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const insertClientsConfigSchema = createInsertSchema(clientsConfig).omit({ id: true, createdAt: true, updatedAt: true });
export const selectClientsConfigSchema = createSelectSchema(clientsConfig);
export type InsertClientsConfig = z.infer<typeof insertClientsConfigSchema>;
export type ClientsConfig = typeof clientsConfig.$inferSelect;

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
export const selectActivityLogSchema = createSelectSchema(activityLogs);
export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
export type ActivityLog = typeof activityLogs.$inferSelect;

export const insertBillingSchema = createInsertSchema(billing).omit({ id: true, createdAt: true, updatedAt: true });
export const selectBillingSchema = createSelectSchema(billing);
export type InsertBilling = z.infer<typeof insertBillingSchema>;
export type Billing = typeof billing.$inferSelect;

export const insertAiTemplateSchema = createInsertSchema(aiTemplates).omit({ id: true, createdAt: true, updatedAt: true });
export const selectAiTemplateSchema = createSelectSchema(aiTemplates);
export type InsertAiTemplate = z.infer<typeof insertAiTemplateSchema>;
export type AiTemplate = typeof aiTemplates.$inferSelect;

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
});
