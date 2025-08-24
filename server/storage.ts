import { 
  users, 
  waitlistSubmissions, 
  serviceLocations,
  pages,
  pageContent,
  seoSettings,
  mediaAssets,
  type User, 
  type InsertUser, 
  type WaitlistSubmission, 
  type InsertWaitlistSubmission, 
  type ServiceLocation, 
  type InsertServiceLocation,
  type Page,
  type InsertPage,
  type PageContent,
  type InsertPageContent,
  type SeoSettings,
  type InsertSeoSettings,
  type MediaAsset,
  type InsertMediaAsset,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Waitlist operations
  createWaitlistSubmission(submission: InsertWaitlistSubmission): Promise<WaitlistSubmission>;
  getAllWaitlistSubmissions(): Promise<WaitlistSubmission[]>;
  getArchivedWaitlistSubmissions(): Promise<WaitlistSubmission[]>;
  updateWaitlistSubmissionStatus(id: string, status: string): Promise<WaitlistSubmission | undefined>;
  deleteWaitlistSubmission(id: string): Promise<void>;
  
  // Service location operations
  getAllServiceLocations(): Promise<ServiceLocation[]>;
  createServiceLocation(location: InsertServiceLocation): Promise<ServiceLocation>;
  deleteServiceLocation(id: string): Promise<void>;
  
  // CMS Page operations
  getAllPages(): Promise<Page[]>;
  getPage(slug: string): Promise<Page | undefined>;
  getPageById(id: string): Promise<Page | undefined>;
  createPage(page: InsertPage): Promise<Page>;
  updatePage(id: string, page: Partial<InsertPage>): Promise<Page | undefined>;
  deletePage(id: string): Promise<void>;
  
  // CMS Content operations
  getPageContent(pageId: string): Promise<PageContent[]>;
  getContentByElement(pageId: string, elementId: string): Promise<PageContent | undefined>;
  updatePageContent(content: InsertPageContent): Promise<PageContent>;
  deletePageContent(pageId: string, elementId: string): Promise<void>;
  
  // SEO operations
  getPageSeoSettings(pageId: string): Promise<SeoSettings | undefined>;
  updatePageSeoSettings(settings: InsertSeoSettings): Promise<SeoSettings>;
  
  // Media operations
  getAllMediaAssets(): Promise<MediaAsset[]>;
  getMediaAsset(id: string): Promise<MediaAsset | undefined>;
  createMediaAsset(asset: InsertMediaAsset): Promise<MediaAsset>;
  deleteMediaAsset(id: string): Promise<void>;
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
    return await db.select().from(waitlistSubmissions).where(eq(waitlistSubmissions.status, "active"));
  }

  async getArchivedWaitlistSubmissions(): Promise<WaitlistSubmission[]> {
    return await db.select().from(waitlistSubmissions).where(eq(waitlistSubmissions.status, "archived"));
  }

  async updateWaitlistSubmissionStatus(id: string, status: string): Promise<WaitlistSubmission | undefined> {
    const [submission] = await db
      .update(waitlistSubmissions)
      .set({ status })
      .where(eq(waitlistSubmissions.id, id))
      .returning();
    return submission;
  }

  async deleteWaitlistSubmission(id: string): Promise<void> {
    await db.delete(waitlistSubmissions).where(eq(waitlistSubmissions.id, id));
  }

  async deleteServiceLocation(id: string): Promise<void> {
    await db.delete(serviceLocations).where(eq(serviceLocations.id, id));
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

  // CMS Page operations
  async getAllPages(): Promise<Page[]> {
    return await db.select().from(pages).orderBy(desc(pages.updatedAt));
  }

  async getPage(slug: string): Promise<Page | undefined> {
    const [page] = await db.select().from(pages).where(eq(pages.slug, slug));
    return page;
  }

  async getPageById(id: string): Promise<Page | undefined> {
    const [page] = await db.select().from(pages).where(eq(pages.id, id));
    return page;
  }

  async createPage(insertPage: InsertPage): Promise<Page> {
    const [page] = await db
      .insert(pages)
      .values(insertPage)
      .returning();
    return page;
  }

  async updatePage(id: string, updateData: Partial<InsertPage>): Promise<Page | undefined> {
    const [page] = await db
      .update(pages)
      .set({ ...updateData, updatedAt: new Date().toISOString() })
      .where(eq(pages.id, id))
      .returning();
    return page;
  }

  async deletePage(id: string): Promise<void> {
    await db.delete(pages).where(eq(pages.id, id));
  }

  // CMS Content operations
  async getPageContent(pageId: string): Promise<PageContent[]> {
    return await db.select().from(pageContent).where(eq(pageContent.pageId, pageId));
  }

  async getContentByElement(pageId: string, elementId: string): Promise<PageContent | undefined> {
    const [content] = await db
      .select()
      .from(pageContent)
      .where(and(eq(pageContent.pageId, pageId), eq(pageContent.elementId, elementId)));
    return content;
  }

  async updatePageContent(insertContent: InsertPageContent): Promise<PageContent> {
    const existing = await this.getContentByElement(insertContent.pageId, insertContent.elementId);
    
    if (existing) {
      const [content] = await db
        .update(pageContent)
        .set({ 
          content: insertContent.content,
          contentType: insertContent.contentType,
          metadata: insertContent.metadata,
          updatedAt: new Date().toISOString()
        })
        .where(and(
          eq(pageContent.pageId, insertContent.pageId), 
          eq(pageContent.elementId, insertContent.elementId)
        ))
        .returning();
      return content;
    } else {
      const [content] = await db
        .insert(pageContent)
        .values(insertContent)
        .returning();
      return content;
    }
  }

  async deletePageContent(pageId: string, elementId: string): Promise<void> {
    await db.delete(pageContent).where(
      and(eq(pageContent.pageId, pageId), eq(pageContent.elementId, elementId))
    );
  }

  // SEO operations
  async getPageSeoSettings(pageId: string): Promise<SeoSettings | undefined> {
    const [settings] = await db.select().from(seoSettings).where(eq(seoSettings.pageId, pageId));
    return settings;
  }

  async updatePageSeoSettings(insertSettings: InsertSeoSettings): Promise<SeoSettings> {
    const existing = await this.getPageSeoSettings(insertSettings.pageId);
    
    if (existing) {
      const [settings] = await db
        .update(seoSettings)
        .set({ 
          ...insertSettings,
          updatedAt: new Date().toISOString()
        })
        .where(eq(seoSettings.pageId, insertSettings.pageId))
        .returning();
      return settings;
    } else {
      const [settings] = await db
        .insert(seoSettings)
        .values(insertSettings)
        .returning();
      return settings;
    }
  }

  // Media operations
  async getAllMediaAssets(): Promise<MediaAsset[]> {
    return await db.select().from(mediaAssets).orderBy(desc(mediaAssets.uploadedAt));
  }

  async getMediaAsset(id: string): Promise<MediaAsset | undefined> {
    const [asset] = await db.select().from(mediaAssets).where(eq(mediaAssets.id, id));
    return asset;
  }

  async createMediaAsset(insertAsset: InsertMediaAsset): Promise<MediaAsset> {
    const [asset] = await db
      .insert(mediaAssets)
      .values(insertAsset)
      .returning();
    return asset;
  }

  async deleteMediaAsset(id: string): Promise<void> {
    await db.delete(mediaAssets).where(eq(mediaAssets.id, id));
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
