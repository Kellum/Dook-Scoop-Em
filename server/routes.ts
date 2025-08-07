import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWaitlistSubmissionSchema, insertServiceLocationSchema, insertUserSchema } from "@shared/schema";
import { hashPassword, verifyPassword, generateToken, requireAuth } from "./auth";
import nodemailer from "nodemailer";
import { writeFile, readFile, existsSync } from "fs";
import { promisify } from "util";

const writeFileAsync = promisify(writeFile);
const readFileAsync = promisify(readFile);

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure MailerSend SMTP
  const transporter = nodemailer.createTransport({
    host: 'smtp.mailersend.net',
    port: 587,
    secure: false, // use STARTTLS
    auth: {
      user: process.env.MAILERSEND_SMTP_USER || '',
      pass: process.env.MAILERSEND_SMTP_PASS || ''
    }
  });

  // Admin Authentication Endpoints
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }

      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValidPassword = await verifyPassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = generateToken({ userId: user.id, username: user.username });
      res.json({ token, user: { id: user.id, username: user.username } });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/admin/create-admin", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      const hashedPassword = await hashPassword(validatedData.password);
      
      const user = await storage.createUser({
        username: validatedData.username,
        password: hashedPassword
      });

      res.json({ 
        message: "Admin user created successfully", 
        user: { id: user.id, username: user.username } 
      });
    } catch (error) {
      console.error("Create admin error:", error);
      if (error instanceof Error && error.message.includes('unique')) {
        return res.status(400).json({ message: "Username already exists" });
      }
      res.status(500).json({ message: "Failed to create admin user" });
    }
  });

  // Admin-only endpoints
  app.get("/api/admin/locations", requireAuth, async (req, res) => {
    try {
      const locations = await storage.getAllServiceLocations();
      res.json({ locations });
    } catch (error) {
      console.error("Error fetching admin locations:", error);
      res.status(500).json({ error: "Failed to fetch locations" });
    }
  });

  app.post("/api/admin/locations", requireAuth, async (req, res) => {
    try {
      const validatedData = insertServiceLocationSchema.parse(req.body);
      const location = await storage.createServiceLocation(validatedData);
      res.json({ location });
    } catch (error) {
      console.error("Error creating location:", error);
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: (error as any).errors 
        });
      }
      res.status(500).json({ message: "Failed to create location" });
    }
  });

  app.delete("/api/admin/locations/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteServiceLocation(id);
      res.json({ message: "Location deleted successfully" });
    } catch (error) {
      console.error("Error deleting location:", error);
      res.status(500).json({ message: "Failed to delete location" });
    }
  });

  app.get("/api/admin/waitlist", requireAuth, async (req, res) => {
    try {
      const submissions = await storage.getAllWaitlistSubmissions();
      res.json({ submissions });
    } catch (error) {
      console.error("Error fetching waitlist:", error);
      res.status(500).json({ error: "Failed to fetch waitlist" });
    }
  });

  // Public endpoints
  // Get service locations endpoint
  app.get("/api/locations", async (req, res) => {
    try {
      const locations = await storage.getAllServiceLocations();
      res.json({ locations });
    } catch (error) {
      console.error("Error fetching locations:", error);
      res.status(500).json({ error: "Failed to fetch locations" });
    }
  });

  // Get waitlist notifications endpoint
  app.get("/api/notifications", async (req, res) => {
    try {
      const filePath = './waitlist-notifications.json';
      if (existsSync(filePath)) {
        const fileData = await readFileAsync(filePath, 'utf-8');
        const notifications = JSON.parse(fileData);
        res.json({ notifications });
      } else {
        res.json({ notifications: [] });
      }
    } catch (error) {
      console.error("Error reading notifications:", error);
      res.status(500).json({ error: "Failed to read notifications" });
    }
  });

  app.post("/api/waitlist", async (req, res) => {
    try {
      // Validate request body
      const validatedData = insertWaitlistSubmissionSchema.parse(req.body);
      
      // Store submission
      const submission = await storage.createWaitlistSubmission(validatedData);
      
      // Log submission details to console for now (since MailerSend trial has restrictions)
      console.log("=== NEW WAITLIST SUBMISSION ===");
      console.log("Name:", submission.name);
      console.log("Email:", submission.email);
      console.log("Address:", submission.address);
      console.log("Zip Code:", submission.zipCode);
      console.log("Phone:", submission.phone);
      console.log("Number of Dogs:", submission.numberOfDogs);
      console.log("Submitted At:", submission.submittedAt);
      console.log("================================");

      // Save notification to file (backup while MailerSend trial restrictions are active)
      try {
        const notificationData = {
          id: submission.id,
          name: submission.name,
          email: submission.email,
          address: submission.address,
          zipCode: submission.zipCode,
          phone: submission.phone,
          numberOfDogs: submission.numberOfDogs,
          submittedAt: submission.submittedAt,
          timestamp: new Date().toISOString()
        };

        // Read existing notifications or create empty array
        let notifications = [];
        const filePath = './waitlist-notifications.json';
        if (existsSync(filePath)) {
          const fileData = await readFileAsync(filePath, 'utf-8');
          notifications = JSON.parse(fileData);
        }

        // Add new notification
        notifications.push(notificationData);

        // Save back to file
        await writeFileAsync(filePath, JSON.stringify(notifications, null, 2));
        console.log("Notification saved to file successfully");

        // Also try to send email via SMTP if credentials are available
        if (process.env.MAILERSEND_SMTP_USER && process.env.MAILERSEND_SMTP_PASS) {
          try {
            const mailOptions = {
              from: '"Dook Scoop Em" <noreply@dookscoopem.com>',
              to: 'kellum.ryan@gmail.com',
              subject: 'New Dook Scoop Em Waitlist Signup',
              html: `
                <h2>New Waitlist Signup</h2>
                <p><strong>Name:</strong> ${submission.name}</p>
                <p><strong>Email:</strong> ${submission.email}</p>
                <p><strong>Address:</strong> ${submission.address}</p>
                <p><strong>Zip Code:</strong> ${submission.zipCode}</p>
                <p><strong>Phone:</strong> ${submission.phone}</p>
                <p><strong>Number of Dogs:</strong> ${submission.numberOfDogs}</p>
                <p><strong>Submitted At:</strong> ${submission.submittedAt ? new Date(submission.submittedAt).toLocaleString() : 'Unknown'}</p>
              `,
              text: `
                New Waitlist Signup
                
                Name: ${submission.name}
                Email: ${submission.email}
                Address: ${submission.address}
                Zip Code: ${submission.zipCode}
                Phone: ${submission.phone}
                Number of Dogs: ${submission.numberOfDogs}
                Submitted At: ${submission.submittedAt ? new Date(submission.submittedAt).toLocaleString() : 'Unknown'}
              `
            };

            const result = await transporter.sendMail(mailOptions);
            console.log("Email sent successfully via SMTP:", result);
          } catch (emailError) {
            console.log("SMTP email failed (using file backup):", emailError.response || emailError.message);
          }
        }
      } catch (fileError) {
        console.error("Failed to save notification to file:", fileError);
      }
      
      res.json({ 
        message: "Successfully joined waitlist!", 
        id: submission.id 
      });
    } catch (error) {
      console.error("Waitlist submission error:", error);
      
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: (error as any).errors 
        });
      }
      
      res.status(500).json({ 
        message: "Failed to process waitlist submission" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
