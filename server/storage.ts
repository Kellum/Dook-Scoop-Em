import { 
  users, 
  waitlistSubmissions, 
  serviceLocations, 
  type User, 
  type InsertUser, 
  type WaitlistSubmission, 
  type InsertWaitlistSubmission, 
  type ServiceLocation, 
  type InsertServiceLocation 
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createWaitlistSubmission(submission: InsertWaitlistSubmission): Promise<WaitlistSubmission>;
  getAllWaitlistSubmissions(): Promise<WaitlistSubmission[]>;
  getAllServiceLocations(): Promise<ServiceLocation[]>;
  createServiceLocation(location: InsertServiceLocation): Promise<ServiceLocation>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createWaitlistSubmission(insertSubmission: InsertWaitlistSubmission): Promise<WaitlistSubmission> {
    const [submission] = await db
      .insert(waitlistSubmissions)
      .values(insertSubmission)
      .returning();
    return submission;
  }

  async getAllWaitlistSubmissions(): Promise<WaitlistSubmission[]> {
    return await db.select().from(waitlistSubmissions);
  }

  async getAllServiceLocations(): Promise<ServiceLocation[]> {
    const locations = await db.select().from(serviceLocations);
    
    // Initialize with sample data if empty
    if (locations.length === 0) {
      await this.initializeServiceLocations();
      return await db.select().from(serviceLocations);
    }
    
    return locations;
  }

  async createServiceLocation(insertLocation: InsertServiceLocation): Promise<ServiceLocation> {
    const [location] = await db
      .insert(serviceLocations)
      .values(insertLocation)
      .returning();
    return location;
  }

  private async initializeServiceLocations() {
    const sampleLocations: InsertServiceLocation[] = [
      {
        city: "Austin",
        state: "TX",
        zipCodes: ["78701", "78702", "78703", "78704", "78705"],
        launchDate: "March 2025",
        isActive: "false"
      },
      {
        city: "Round Rock",
        state: "TX", 
        zipCodes: ["78664", "78665", "78681"],
        launchDate: "April 2025",
        isActive: "false"
      },
      {
        city: "Cedar Park",
        state: "TX",
        zipCodes: ["78613", "78630"],
        launchDate: "April 2025", 
        isActive: "false"
      },
      {
        city: "Pflugerville",
        state: "TX",
        zipCodes: ["78660", "78691"],
        launchDate: "May 2025",
        isActive: "false"
      },
      {
        city: "Georgetown",
        state: "TX",
        zipCodes: ["78626", "78628"],
        launchDate: "May 2025",
        isActive: "false"
      }
    ];

    await db.insert(serviceLocations).values(sampleLocations);
  }
}

export const storage = new DatabaseStorage();
