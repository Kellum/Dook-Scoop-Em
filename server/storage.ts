import { type User, type InsertUser, type WaitlistSubmission, type InsertWaitlistSubmission, type ServiceLocation, type InsertServiceLocation } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createWaitlistSubmission(submission: InsertWaitlistSubmission): Promise<WaitlistSubmission>;
  getAllWaitlistSubmissions(): Promise<WaitlistSubmission[]>;
  getAllServiceLocations(): Promise<ServiceLocation[]>;
  createServiceLocation(location: InsertServiceLocation): Promise<ServiceLocation>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private waitlistSubmissions: Map<string, WaitlistSubmission>;
  private serviceLocations: Map<string, ServiceLocation>;

  constructor() {
    this.users = new Map();
    this.waitlistSubmissions = new Map();
    this.serviceLocations = new Map();
    
    // Initialize with some sample locations
    this.initializeServiceLocations();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createWaitlistSubmission(insertSubmission: InsertWaitlistSubmission): Promise<WaitlistSubmission> {
    const id = randomUUID();
    const submittedAt = new Date().toISOString();
    const submission: WaitlistSubmission = { 
      ...insertSubmission, 
      id, 
      submittedAt 
    };
    this.waitlistSubmissions.set(id, submission);
    return submission;
  }

  async getAllWaitlistSubmissions(): Promise<WaitlistSubmission[]> {
    return Array.from(this.waitlistSubmissions.values());
  }

  async getAllServiceLocations(): Promise<ServiceLocation[]> {
    return Array.from(this.serviceLocations.values());
  }

  async createServiceLocation(insertLocation: InsertServiceLocation): Promise<ServiceLocation> {
    const id = randomUUID();
    const location: ServiceLocation = { 
      ...insertLocation, 
      id,
      launchDate: insertLocation.launchDate || null
    };
    this.serviceLocations.set(id, location);
    return location;
  }

  private initializeServiceLocations() {
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

    sampleLocations.forEach(location => {
      const id = randomUUID();
      const serviceLocation: ServiceLocation = { 
        ...location, 
        id,
        launchDate: location.launchDate || null
      };
      this.serviceLocations.set(id, serviceLocation);
    });
  }
}

export const storage = new MemStorage();
