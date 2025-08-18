import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWaitlistSubmissionSchema, insertServiceLocationSchema, insertUserSchema } from "@shared/schema";
import { hashPassword, verifyPassword, generateToken, requireAuth } from "./auth";
import { handleSweepAndGoWebhook, sweepAndGoAPI } from "./sweepandgo";
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

  app.get("/api/admin/waitlist/archived", requireAuth, async (req, res) => {
    try {
      const submissions = await storage.getArchivedWaitlistSubmissions();
      res.json({ submissions });
    } catch (error) {
      console.error("Error fetching archived waitlist:", error);
      res.status(500).json({ error: "Failed to fetch archived waitlist" });
    }
  });

  app.patch("/api/admin/waitlist/:id/archive", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const submission = await storage.updateWaitlistSubmissionStatus(id, "archived");
      if (!submission) {
        return res.status(404).json({ error: "Submission not found" });
      }
      res.json({ message: "Submission archived successfully" });
    } catch (error) {
      console.error("Error archiving submission:", error);
      res.status(500).json({ error: "Failed to archive submission" });
    }
  });

  app.delete("/api/admin/waitlist/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteWaitlistSubmission(id);
      res.json({ message: "Submission deleted successfully" });
    } catch (error) {
      console.error("Error deleting submission:", error);
      res.status(500).json({ error: "Failed to delete submission" });
    }
  });

  // Sweep&Go webhook endpoint
  app.post("/api/webhooks/sweepandgo", handleSweepAndGoWebhook);

  // Test Sweep&Go API connection (admin only)
  app.get("/api/admin/sweepandgo/test", requireAuth, async (req, res) => {
    try {
      // Test basic API connectivity
      const testEmail = "test@example.com";
      const emailExists = await sweepAndGoAPI.checkClientEmailExists(testEmail);
      
      res.json({ 
        success: true,
        message: "Sweep&Go API connection successful",
        test_result: {
          email_check: emailExists,
          api_configured: sweepAndGoAPI.isConfigured()
        }
      });
    } catch (error) {
      console.error("Sweep&Go API test failed:", error);
      res.status(500).json({ 
        success: false,
        message: "Sweep&Go API connection failed",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get pricing from Sweep&Go API (admin only)
  app.post("/api/admin/sweepandgo/pricing", requireAuth, async (req, res) => {
    try {
      const { zipCode, numberOfDogs, frequency, lastCleaned } = req.body;
      
      const pricing = await sweepAndGoAPI.getPricing({
        zipCode,
        numberOfDogs: parseInt(numberOfDogs),
        frequency: frequency || "weekly",
        lastCleanedTimeframe: lastCleaned || "one_week"
      });

      res.json({ success: true, pricing });
    } catch (error) {
      console.error("Pricing lookup failed:", error);
      res.status(500).json({ 
        success: false,
        error: error instanceof Error ? error.message : "Pricing lookup failed"
      });
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
      
      // Check if email already exists in Sweep&Go before storing
      const emailExists = await sweepAndGoAPI.checkClientEmailExists(validatedData.email);
      if (emailExists) {
        console.log(`Email ${validatedData.email} already exists in Sweep&Go`);
      }

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
      console.log("Referral Source:", submission.referralSource);
      console.log("Urgency:", submission.urgency);
      console.log("Can Text:", submission.canText ? "YES" : "NO");
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
          referralSource: submission.referralSource,
          urgency: submission.urgency,
          canText: submission.canText,
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

        // Try to send email via MailerSend API first, then fallback to SMTP
        try {
          if (process.env.MAILERSEND_API_KEY) {
            // Use MailerSend API
            const mailersendResponse = await fetch('https://api.mailersend.com/v1/email', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.MAILERSEND_API_KEY}`
              },
              body: JSON.stringify({
                from: {
                  email: "noreply@dookscoopem.com",
                  name: "Dook Scoop Em"
                },
                to: [
                  {
                    email: "ryan@dookscoop.com",
                    name: "Ryan"
                  }
                ],
                subject: "New Dook Scoop Em Waitlist Signup",
                html: `
                  <h2>New Waitlist Signup</h2>
                  <p><strong>Name:</strong> ${submission.name}</p>
                  <p><strong>Email:</strong> ${submission.email}</p>
                  <p><strong>Phone:</strong> ${submission.phone}</p>
                  <p><strong>Address:</strong> ${submission.address}</p>
                  <p><strong>Zip Code:</strong> ${submission.zipCode}</p>
                  <p><strong>Number of Dogs:</strong> ${submission.numberOfDogs}</p>
                  ${submission.referralSource ? `<p><strong>How they heard about us:</strong> ${submission.referralSource}</p>` : ''}
                  ${submission.urgency ? `<p><strong>Service urgency:</strong> ${submission.urgency}</p>` : ''}
                  <p><strong>Can Text Updates:</strong> ${submission.canText ? 'YES ✓' : 'NO'}</p>
                  <p><strong>Submitted At:</strong> ${submission.submittedAt ? new Date(submission.submittedAt).toLocaleString() : 'Unknown'}</p>
                `,
                text: `
                  New Waitlist Signup
                  
                  Name: ${submission.name}
                  Email: ${submission.email}
                  Phone: ${submission.phone}
                  Address: ${submission.address}
                  Zip Code: ${submission.zipCode}
                  Number of Dogs: ${submission.numberOfDogs}
                  ${submission.referralSource ? `How they heard about us: ${submission.referralSource}` : ''}
                  ${submission.urgency ? `Service urgency: ${submission.urgency}` : ''}
                  Can Text Updates: ${submission.canText ? 'YES' : 'NO'}
                  Submitted At: ${submission.submittedAt ? new Date(submission.submittedAt).toLocaleString() : 'Unknown'}
                `
              })
            });

            if (mailersendResponse.ok) {
              console.log("Email sent successfully via MailerSend API");
            } else {
              const errorData = await mailersendResponse.text();
              console.log("MailerSend API failed:", errorData);
              throw new Error(`MailerSend API failed: ${mailersendResponse.status}`);
            }
          } else {
            throw new Error("No MailerSend API key available");
          }
        } catch (apiError) {
          console.log("MailerSend API failed, trying SMTP fallback:", apiError.message);
          
          // Fallback to SMTP
          if (process.env.MAILERSEND_SMTP_USER && process.env.MAILERSEND_SMTP_PASS) {
            try {
              const mailOptions = {
                from: '"Dook Scoop Em" <noreply@dookscoopem.com>',
                to: 'ryan@dookscoop.com',
                subject: 'New Dook Scoop Em Waitlist Signup',
                html: `
                  <h2>New Waitlist Signup</h2>
                  <p><strong>Name:</strong> ${submission.name}</p>
                  <p><strong>Email:</strong> ${submission.email}</p>
                  <p><strong>Phone:</strong> ${submission.phone}</p>
                  <p><strong>Address:</strong> ${submission.address}</p>
                  <p><strong>Zip Code:</strong> ${submission.zipCode}</p>
                  <p><strong>Number of Dogs:</strong> ${submission.numberOfDogs}</p>
                  ${submission.referralSource ? `<p><strong>How they heard about us:</strong> ${submission.referralSource}</p>` : ''}
                  ${submission.urgency ? `<p><strong>Service urgency:</strong> ${submission.urgency}</p>` : ''}
                  <p><strong>Can Text Updates:</strong> ${submission.canText ? 'YES ✓' : 'NO'}</p>
                  <p><strong>Submitted At:</strong> ${submission.submittedAt ? new Date(submission.submittedAt).toLocaleString() : 'Unknown'}</p>
                `,
                text: `
                  New Waitlist Signup
                  
                  Name: ${submission.name}
                  Email: ${submission.email}
                  Phone: ${submission.phone}
                  Address: ${submission.address}
                  Zip Code: ${submission.zipCode}
                  Number of Dogs: ${submission.numberOfDogs}
                  ${submission.referralSource ? `How they heard about us: ${submission.referralSource}` : ''}
                  ${submission.urgency ? `Service urgency: ${submission.urgency}` : ''}
                  Can Text Updates: ${submission.canText ? 'YES' : 'NO'}
                  Submitted At: ${submission.submittedAt ? new Date(submission.submittedAt).toLocaleString() : 'Unknown'}
                `
              };

              const result = await transporter.sendMail(mailOptions);
              console.log("Email sent successfully via SMTP fallback:", result);
            } catch (smtpError) {
              console.log("Both MailerSend API and SMTP failed (using file backup):", smtpError.response || smtpError.message);
            }
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
