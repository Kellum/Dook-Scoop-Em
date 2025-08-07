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
  phone: text("phone").notNull(),
  numberOfDogs: text("number_of_dogs").notNull(),
  submittedAt: text("submitted_at").default(sql`CURRENT_TIMESTAMP`),
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
  phone: z.string().min(10, "Please enter a valid phone number"),
  numberOfDogs: z.string().min(1, "Please select number of dogs"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertWaitlistSubmission = z.infer<typeof insertWaitlistSubmissionSchema>;
export type WaitlistSubmission = typeof waitlistSubmissions.$inferSelect;
