import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const newsItems = pgTable("news_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content"),
  imageUrl: text("image_url"),
  sourceUrl: text("source_url"),
  company: text("company").notNull(),
  implementationType: text("implementation_type").notNull(), // Released, Research, Beta, Pilot
  relevanceCategories: text("relevance_categories").array().notNull(), // Education, Coding, Healthcare, Finance, etc.
  industry: text("industry").notNull(),
  technology: text("technology").notNull(),
  gravityScore: integer("gravity_score").notNull().default(0), // For breakthrough determination
  isBreakthrough: boolean("is_breakthrough").notNull().default(false),
  publishedAt: timestamp("published_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const pmResources = pgTable("pm_resources", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content"),
  resourceType: text("resource_type").notNull(), // Template, Case Study, Product Teardown, Interview Questions, Tools, Frameworks, Study Guides, AI Prompts
  pmStage: text("pm_stage").notNull(), // Discovery, Planning, Execution, Launch, Growth, Optimization
  company: text("company"), // For interview questions
  tags: text("tags").array().notNull(),
  difficulty: text("difficulty").notNull(), // Beginner, Intermediate, Advanced
  resourceUrl: text("resource_url"),
  downloadUrl: text("download_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertNewsItemSchema = createInsertSchema(newsItems).omit({
  id: true,
  createdAt: true,
});

export const insertPmResourceSchema = createInsertSchema(pmResources).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type NewsItem = typeof newsItems.$inferSelect;
export type InsertNewsItem = z.infer<typeof insertNewsItemSchema>;

export type PmResource = typeof pmResources.$inferSelect;
export type InsertPmResource = z.infer<typeof insertPmResourceSchema>;
