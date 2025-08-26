import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const waitlistSubmissions = pgTable("waitlist_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  address: text("address").notNull(),
  zipCode: text("zip_code").notNull(),
  phone: text("phone").notNull(),
  numberOfDogs: text("number_of_dogs").notNull(),
  referralSource: text("referral_source").notNull(),
  urgency: text("urgency").notNull(),
  lastCleanup: text("last_cleanup").default("unknown"),
  canText: boolean("can_text").default(false).notNull(),
  status: text("status").default("active"), // active, archived, deleted
  submittedAt: text("submitted_at").default(sql`CURRENT_TIMESTAMP`),
});

export const serviceLocations = pgTable("service_locations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCodes: text("zip_codes").array().notNull(),
  launchDate: text("launch_date"),
  isActive: text("is_active").default("false"),
});

// Content Management System Tables
export const pages = pgTable("pages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: text("slug").notNull().unique(), // URL path like "/", "/about", "/services"
  title: text("title").notNull(),
  status: text("status").default("published"), // published, draft, archived
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const pageContent = pgTable("page_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  pageId: varchar("page_id").notNull().references(() => pages.id, { onDelete: 'cascade' }),
  elementId: text("element_id").notNull(), // CSS selector or unique identifier
  contentType: text("content_type").notNull(), // text, html, image, color, style
  content: text("content").notNull(),
  metadata: text("metadata"), // JSON string for additional properties
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const seoSettings = pgTable("seo_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  pageId: varchar("page_id").notNull().references(() => pages.id, { onDelete: 'cascade' }),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  ogTitle: text("og_title"),
  ogDescription: text("og_description"),
  ogImage: text("og_image"),
  twitterTitle: text("twitter_title"),
  twitterDescription: text("twitter_description"),
  twitterImage: text("twitter_image"),
  structuredData: text("structured_data"), // JSON string
  customMeta: text("custom_meta"), // JSON string for additional meta tags
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const mediaAssets = pgTable("media_assets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  url: text("url").notNull(),
  altText: text("alt_text"),
  caption: text("caption"),
  uploadedAt: text("uploaded_at").default(sql`CURRENT_TIMESTAMP`),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertWaitlistSubmissionSchema = createInsertSchema(waitlistSubmissions).omit({
  id: true,
  submittedAt: true,
  status: true,
}).extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  address: z.string().min(5, "Please enter an address or zip code"),
  zipCode: z.string().min(5, "Please enter a valid zip code"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  numberOfDogs: z.string().min(1, "Please select number of dogs"),
  referralSource: z.string().min(1, "Please select how you heard about us"),
  urgency: z.string().min(1, "Please select your preferred timeline"),
  lastCleanup: z.string().min(1, "Please let us know when your last cleanup was"),
  canText: z.boolean().default(false),
});

export const insertServiceLocationSchema = createInsertSchema(serviceLocations).omit({
  id: true,
}).extend({
  city: z.string().min(2, "City name is required"),
  state: z.string().min(2, "State is required"),
  zipCodes: z.array(z.string()).min(1, "At least one zip code is required"),
  launchDate: z.string().optional(),
  isActive: z.string().default("false"),
});

// CMS Schema Validators
export const insertPageSchema = createInsertSchema(pages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  slug: z.string().min(1, "Slug is required").regex(/^\/[a-z0-9\-\/]*$/, "Invalid URL format"),
  title: z.string().min(1, "Title is required"),
  status: z.enum(["published", "draft", "archived"]).default("published"),
});

export const insertPageContentSchema = createInsertSchema(pageContent).omit({
  id: true,
  updatedAt: true,
}).extend({
  pageId: z.string().min(1, "Page ID is required"),
  elementId: z.string().min(1, "Element ID is required"),
  contentType: z.enum(["text", "html", "image", "color", "style"]),
  content: z.string(),
  metadata: z.string().optional(),
});

export const insertSeoSettingsSchema = createInsertSchema(seoSettings).omit({
  id: true,
  updatedAt: true,
}).extend({
  pageId: z.string().min(1, "Page ID is required"),
  metaTitle: z.string().max(60, "Meta title should be under 60 characters").optional(),
  metaDescription: z.string().max(160, "Meta description should be under 160 characters").optional(),
  structuredData: z.string().optional(),
  customMeta: z.string().optional(),
});

export const insertMediaAssetSchema = createInsertSchema(mediaAssets).omit({
  id: true,
  uploadedAt: true,
}).extend({
  filename: z.string().min(1, "Filename is required"),
  originalName: z.string().min(1, "Original name is required"),
  mimeType: z.string().min(1, "MIME type is required"),
  size: z.number().positive("Size must be positive"),
  url: z.string().url("Must be a valid URL"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertWaitlistSubmission = z.infer<typeof insertWaitlistSubmissionSchema>;
export type WaitlistSubmission = typeof waitlistSubmissions.$inferSelect;
export type InsertServiceLocation = z.infer<typeof insertServiceLocationSchema>;
export type ServiceLocation = typeof serviceLocations.$inferSelect;

// CMS Types
export type InsertPage = z.infer<typeof insertPageSchema>;
export type Page = typeof pages.$inferSelect;
export type InsertPageContent = z.infer<typeof insertPageContentSchema>;
export type PageContent = typeof pageContent.$inferSelect;
export type InsertSeoSettings = z.infer<typeof insertSeoSettingsSchema>;
export type SeoSettings = typeof seoSettings.$inferSelect;
export type InsertMediaAsset = z.infer<typeof insertMediaAssetSchema>;
export type MediaAsset = typeof mediaAssets.$inferSelect;
