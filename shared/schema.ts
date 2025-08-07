import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer } from "drizzle-orm/pg-core";
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

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertWaitlistSubmissionSchema = createInsertSchema(waitlistSubmissions).omit({
  id: true,
  submittedAt: true,
}).extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  address: z.string().min(10, "Please enter a complete address"),
  zipCode: z.string().min(5, "Please enter a valid zip code"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  numberOfDogs: z.string().min(1, "Please select number of dogs"),
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

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertWaitlistSubmission = z.infer<typeof insertWaitlistSubmissionSchema>;
export type WaitlistSubmission = typeof waitlistSubmissions.$inferSelect;
export type InsertServiceLocation = z.infer<typeof insertServiceLocationSchema>;
export type ServiceLocation = typeof serviceLocations.$inferSelect;
