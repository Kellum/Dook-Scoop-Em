import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, decimal, timestamp } from "drizzle-orm/pg-core";
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
  preferredPlan: text("preferred_plan").default("unknown"),
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

// Quote Requests - separate from waitlist for business quotes
export const quoteRequests = pgTable("quote_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  zipCode: text("zip_code").notNull(),
  numberOfDogs: integer("number_of_dogs").notNull(),
  serviceFrequency: text("service_frequency").notNull(), // weekly, bi_weekly, monthly
  urgency: text("urgency").notNull(),
  preferredContactMethod: text("preferred_contact_method").default("email"), // email, phone, text
  message: text("message"),
  
  // Sweep&Go integration data
  sweepAndGoEmailExists: boolean("sweepandgo_email_exists").default(false),
  sweepAndGoPricing: text("sweepandgo_pricing"), // JSON string of pricing response
  
  // Quote status and follow-up
  status: text("status").default("new"), // new, contacted, quoted, converted, lost
  estimatedPrice: decimal("estimated_price", { precision: 10, scale: 2 }),
  notes: text("notes"), // Admin notes for follow-up
  
  // Timestamps
  submittedAt: text("submitted_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
  contactedAt: text("contacted_at"),
  quotedAt: text("quoted_at"),
});

// Customer onboarding through Sweep&Go with payment processing
export const onboardingSubmissions = pgTable("onboarding_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  homeAddress: text("home_address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  homePhone: text("home_phone"),
  cellPhone: text("cell_phone").notNull(),
  numberOfDogs: integer("number_of_dogs").notNull(),
  serviceFrequency: text("service_frequency").notNull(), // once_a_week, every_two_weeks, etc
  lastCleanedTimeframe: text("last_cleaned_timeframe").notNull().default("one_month"), // never, one_week, one_month, three_months, six_months, one_year
  initialCleanupRequired: boolean("initial_cleanup_required").default(true),
  
  // Notification preferences (Sweep&Go API fields)
  cleanupNotificationType: text("cleanup_notification_type").default("completed,on_the_way"), // completed, on_the_way, etc.
  cleanupNotificationChannel: text("cleanup_notification_channel").default("sms"), // sms, email, call
  
  // Property access information  
  gatedCommunity: text("gated_community"), // Name of gated community if applicable
  gateLocation: text("gate_location"), // left, right, alley, no_gate, other
  
  // Dog information
  dogNames: text("dog_names").array(), // Array of dog names
  
  // Legacy fields (keeping for compatibility)
  notificationType: text("notification_type").default("completed,on_the_way"), // notification preferences
  notificationChannel: text("notification_channel").default("sms"), // sms, email, call
  howHeardAboutUs: text("how_heard_about_us"),
  additionalComments: text("additional_comments"),
  sweepAndGoResponse: text("sweepandgo_response"), // JSON response from Sweep&Go onboarding
  sweepAndGoClientId: text("sweepandgo_client_id"), // Client ID from Sweep&Go if successful
  status: text("status").default("pending"), // pending, completed, failed
  errorMessage: text("error_message"), // If onboarding failed
  submittedAt: text("submitted_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
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
  preferredPlan: z.string().min(1, "Please select your preferred plan"),
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

// Quote Request Schema
export const insertQuoteRequestSchema = createInsertSchema(quoteRequests).omit({
  id: true,
  submittedAt: true,
  updatedAt: true,
  contactedAt: true,
  quotedAt: true,
  sweepAndGoEmailExists: true,
  sweepAndGoPricing: true,
  status: true,
  estimatedPrice: true,
  notes: true,
}).extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  address: z.string().min(5, "Please enter your service address"),
  zipCode: z.string().min(5, "Please enter a valid zip code"),
  numberOfDogs: z.number().min(1, "Please select number of dogs").max(10, "Please contact us for 10+ dogs"),
  serviceFrequency: z.enum(["weekly", "twice_weekly", "one_time"], { required_error: "Please select service frequency" }),
  urgency: z.enum(["asap", "this_week", "next_week", "within_month", "planning_ahead"], { required_error: "Please select your timing preference" }),
  preferredContactMethod: z.enum(["email", "phone", "text"]).default("email"),
  message: z.string().optional(),
});

export type InsertQuoteRequest = z.infer<typeof insertQuoteRequestSchema>;
export type QuoteRequest = typeof quoteRequests.$inferSelect;

// Onboarding Schema Validation
export const insertOnboardingSubmissionSchema = createInsertSchema(onboardingSubmissions).omit({
  id: true,
  submittedAt: true,
  updatedAt: true,
  sweepAndGoResponse: true,
  sweepAndGoClientId: true,
  status: true,
  errorMessage: true,
}).extend({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  homeAddress: z.string().min(5, "Please enter your full home address"),
  city: z.string().min(2, "City is required"),
  state: z.string().length(2, "Please enter state abbreviation (e.g., FL)"),
  zipCode: z.string().min(5, "Please enter a valid zip code"),
  homePhone: z.string().optional(),
  cellPhone: z.string().min(10, "Please enter a valid cell phone number"),
  numberOfDogs: z.number().min(1, "Please select number of dogs").max(10, "Maximum 10 dogs allowed"),
  serviceFrequency: z.enum(["once_a_week", "twice_a_week", "one_time"], {
    errorMap: () => ({ message: "Please select a service frequency" })
  }),
  lastCleanedTimeframe: z.enum(["never", "one_week", "one_month", "three_months", "six_months", "one_year"], {
    errorMap: () => ({ message: "Please select when your yard was last cleaned" })
  }),
  initialCleanupRequired: z.boolean().default(true),
  
  // New Sweep&Go specific fields
  cleanupNotificationType: z.string().default("completed,on_the_way"),
  cleanupNotificationChannel: z.enum(["sms", "email", "call"]).default("sms"),
  gatedCommunity: z.string().optional(),
  gateLocation: z.enum(["left", "right", "alley", "no_gate", "other"]).optional().or(z.literal("")).transform(val => val === "" ? "no_gate" : val),
  dogNames: z.array(z.string()).optional(),
  
  // Legacy fields (keeping for compatibility)
  notificationType: z.string().default("completed,on_the_way"),
  notificationChannel: z.enum(["sms", "email", "call"]).default("sms"),
  howHeardAboutUs: z.string().optional(),
  additionalComments: z.string().optional(),
});

export type InsertOnboardingSubmission = z.infer<typeof insertOnboardingSubmissionSchema>;
export type OnboardingSubmission = typeof onboardingSubmissions.$inferSelect;

// CRM Tables for Clerk + Stripe Integration
export const customers = pgTable("customers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clerkUserId: text("clerk_user_id").notNull().unique(),
  stripeCustomerId: text("stripe_customer_id").unique(),
  email: text("email").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  phone: text("phone"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  gateCode: text("gate_code"),
  dogNames: text("dog_names").array(),
  notificationPreference: text("notification_preference").default("email"), // email, sms, both
  notes: text("notes"),
  role: text("role").default("customer"), // customer, admin
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const subscriptions = pgTable("subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").notNull().references(() => customers.id, { onDelete: 'cascade' }),
  stripeSubscriptionId: text("stripe_subscription_id").unique(),
  plan: text("plan").notNull(), // weekly, biweekly, twice_weekly
  dogCount: integer("dog_count").notNull().default(1),
  status: text("status").notNull().default("active"), // active, past_due, paused, canceled
  currentPeriodStart: text("current_period_start"),
  currentPeriodEnd: text("current_period_end"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const visits = pgTable("visits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  subscriptionId: varchar("subscription_id").notNull().references(() => subscriptions.id, { onDelete: 'cascade' }),
  customerId: varchar("customer_id").notNull().references(() => customers.id, { onDelete: 'cascade' }),
  scheduledFor: text("scheduled_for").notNull(),
  status: text("status").notNull().default("scheduled"), // scheduled, completed, skipped, canceled
  techNotes: text("tech_notes"),
  completedAt: text("completed_at"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const charges = pgTable("charges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").notNull().references(() => customers.id, { onDelete: 'cascade' }),
  stripeInvoiceId: text("stripe_invoice_id"),
  type: text("type").notNull(), // recurring, one_time, initial_cleanup
  amountCents: integer("amount_cents").notNull(),
  status: text("status").notNull(), // succeeded, failed, refunded, pending
  description: text("description"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// CRM Schema Validators
export const insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  clerkUserId: z.string().min(1, "Clerk user ID is required"),
  email: z.string().email("Please enter a valid email address"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  role: z.enum(["customer", "admin"]).default("customer"),
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  customerId: z.string().min(1, "Customer ID is required"),
  plan: z.enum(["weekly", "biweekly", "twice_weekly"], { required_error: "Plan is required" }),
  dogCount: z.number().min(1, "Must have at least 1 dog").default(1),
  status: z.enum(["active", "past_due", "paused", "canceled"]).default("active"),
});

export const insertVisitSchema = createInsertSchema(visits).omit({
  id: true,
  createdAt: true,
}).extend({
  subscriptionId: z.string().min(1, "Subscription ID is required"),
  customerId: z.string().min(1, "Customer ID is required"),
  scheduledFor: z.string().min(1, "Scheduled date is required"),
  status: z.enum(["scheduled", "completed", "skipped", "canceled"]).default("scheduled"),
});

export const insertChargeSchema = createInsertSchema(charges).omit({
  id: true,
  createdAt: true,
}).extend({
  customerId: z.string().min(1, "Customer ID is required"),
  type: z.enum(["recurring", "one_time", "initial_cleanup"]),
  amountCents: z.number().min(0, "Amount must be positive"),
  status: z.enum(["succeeded", "failed", "refunded", "pending"]),
});

// CRM Types
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Customer = typeof customers.$inferSelect;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Subscription = typeof subscriptions.$inferSelect;
export type InsertVisit = z.infer<typeof insertVisitSchema>;
export type Visit = typeof visits.$inferSelect;
export type InsertCharge = z.infer<typeof insertChargeSchema>;
export type Charge = typeof charges.$inferSelect;
