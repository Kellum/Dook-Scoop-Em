import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertWaitlistSubmissionSchema, 
  insertServiceLocationSchema, 
  insertUserSchema,
  insertPageSchema,
  insertPageContentSchema,
  insertSeoSettingsSchema,
  insertMediaAssetSchema
} from "@shared/schema";
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
      console.log("Last Cleanup:", submission.lastCleanup);
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
          lastCleanup: submission.lastCleanup,
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
                subject: `New Waitlist Signup - ${submission.name} (${new Date().toLocaleDateString()})`,
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
                  ${submission.lastCleanup ? `<p><strong>Last cleanup:</strong> ${submission.lastCleanup}</p>` : ''}
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
                  ${submission.lastCleanup ? `Last cleanup: ${submission.lastCleanup}` : ''}
                  Can Text Updates: ${submission.canText ? 'YES' : 'NO'}
                  Submitted At: ${submission.submittedAt ? new Date(submission.submittedAt).toLocaleString() : 'Unknown'}
                `
              })
            });

            if (mailersendResponse.ok) {
              console.log("Email sent successfully via MailerSend API");
              
              // Now send confirmation email to customer
              try {
                const customerEmailResponse = await fetch('https://api.mailersend.com/v1/email', {
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
                        email: submission.email,
                        name: submission.name
                      }
                    ],
                    subject: `🚀 Nice Scoop! You're officially in the pack`,
                    html: `
                      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
                        
                        <!-- Header -->
                        <div style="background: linear-gradient(135deg, #ff7b00, #ff9500); padding: 30px; text-align: center; border-radius: 20px 20px 0 0; margin-bottom: 0;">
                          <h1 style="color: white; font-size: 32px; font-weight: 900; margin: 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
                            🚀 NICE SCOOP!
                          </h1>
                          <h2 style="color: white; font-size: 24px; font-weight: 800; margin: 10px 0 0 0;">
                            You're In.
                          </h2>
                        </div>

                        <!-- Main Content -->
                        <div style="background: white; padding: 40px 30px; border-radius: 0 0 20px 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                          
                          <p style="font-size: 18px; line-height: 1.6; color: #333; margin-bottom: 25px;">
                            <strong>Hey ${submission.name.split(' ')[0]}!</strong> 👋
                          </p>
                          
                          <p style="font-size: 16px; line-height: 1.6; color: #555; margin-bottom: 25px;">
                            This email just landed in your inbox like a perfectly aimed poop scoop — with precision and purpose! 
                            We'll be reaching out soon to confirm your details and get you set up.
                          </p>

                          <!-- Founding Member Benefits -->
                          <div style="background: #e8f4fd; padding: 25px; border-radius: 15px; margin: 25px 0; border-left: 5px solid #2563eb;">
                            <h3 style="color: #1d4ed8; font-size: 20px; font-weight: 800; margin: 0 0 15px 0;">
                              🎉 Founding Member Perks Unlocked:
                            </h3>
                            <ul style="margin: 0; padding-left: 20px; color: #374151;">
                              <li style="margin-bottom: 8px;"><strong>✓ Special perks built for early supporters</strong></li>
                              <li style="margin-bottom: 8px;"><strong>✓ Locked-in pricing ($85/mo) for your first 12 months</strong></li>
                              <li style="margin-bottom: 8px;"><strong>✓ Priority onboarding when routes open in your area</strong></li>
                              <li style="margin-bottom: 8px;"><strong>✓ Free month credit after 3 consecutive paid months</strong></li>
                              <li style="margin-bottom: 8px;"><strong>✓ FREE sanitization add-on (normally paid)</strong></li>
                              <li><strong>✓ Always free waste haul-away</strong></li>
                            </ul>
                          </div>

                          <!-- Your Submitted Info -->
                          <div style="background: #f9f9f9; padding: 25px; border-radius: 15px; margin: 25px 0;">
                            <h3 style="color: #374151; font-size: 18px; font-weight: 800; margin: 0 0 15px 0;">
                              📋 Your Submission Details:
                            </h3>
                            <table style="width: 100%; color: #555;">
                              <tr><td style="padding: 5px 0; font-weight: 600;">Name:</td><td style="padding: 5px 0;">${submission.name}</td></tr>
                              <tr><td style="padding: 5px 0; font-weight: 600;">Email:</td><td style="padding: 5px 0;">${submission.email}</td></tr>
                              <tr><td style="padding: 5px 0; font-weight: 600;">Phone:</td><td style="padding: 5px 0;">${submission.phone}</td></tr>
                              <tr><td style="padding: 5px 0; font-weight: 600;">Zip Code:</td><td style="padding: 5px 0;">${submission.zipCode}</td></tr>
                              <tr><td style="padding: 5px 0; font-weight: 600;">Number of Dogs:</td><td style="padding: 5px 0;">${submission.numberOfDogs}</td></tr>
                              ${submission.referralSource ? `<tr><td style="padding: 5px 0; font-weight: 600;">How you heard about us:</td><td style="padding: 5px 0;">${submission.referralSource}</td></tr>` : ''}
                              ${submission.urgency ? `<tr><td style="padding: 5px 0; font-weight: 600;">Service urgency:</td><td style="padding: 5px 0;">${submission.urgency}</td></tr>` : ''}
                              ${submission.lastCleanup ? `<tr><td style="padding: 5px 0; font-weight: 600;">Last cleanup:</td><td style="padding: 5px 0;">${submission.lastCleanup}</td></tr>` : ''}
                              <tr><td style="padding: 5px 0; font-weight: 600;">Can text updates:</td><td style="padding: 5px 0;">${submission.canText ? 'YES ✓' : 'NO'}</td></tr>
                            </table>
                          </div>

                          <!-- Elite Squad Message -->
                          <div style="text-align: center; background: linear-gradient(135deg, #ff7b00, #ff9500); color: white; padding: 20px; border-radius: 15px; margin-top: 30px;">
                            <p style="font-size: 18px; font-weight: 700; margin: 0; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">
                              Consider yourself part of the elite squad that fears no pile. 🐾
                            </p>
                          </div>

                          <!-- Footer -->
                          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e5e5;">
                            <p style="color: #888; font-size: 14px; margin: 0;">
                              Questions? Just reply to this email — we're here to help!<br>
                              <strong>Dook Scoop 'Em</strong> | Professional Pet Waste Removal
                            </p>
                          </div>

                        </div>
                      </div>
                    `,
                    text: `
🚀 NICE SCOOP! You're In.

Hey ${submission.name.split(' ')[0]}! 

This email just landed in your inbox like a perfectly aimed poop scoop — with precision and purpose! 
We'll be reaching out soon to confirm your details and get you set up.

🎉 FOUNDING MEMBER PERKS UNLOCKED:
✓ Special perks built for early supporters
✓ Locked-in pricing ($85/mo) for your first 12 months  
✓ Priority onboarding when routes open in your area
✓ Free month credit after 3 consecutive paid months
✓ FREE sanitization add-on (normally paid)
✓ Always free waste haul-away

📋 YOUR SUBMISSION DETAILS:
Name: ${submission.name}
Email: ${submission.email}
Phone: ${submission.phone}
Zip Code: ${submission.zipCode}
Number of Dogs: ${submission.numberOfDogs}
${submission.referralSource ? `How you heard about us: ${submission.referralSource}` : ''}
${submission.urgency ? `Service urgency: ${submission.urgency}` : ''}
${submission.lastCleanup ? `Last cleanup: ${submission.lastCleanup}` : ''}
Can text updates: ${submission.canText ? 'YES' : 'NO'}

Consider yourself part of the elite squad that fears no pile. 🐾

Questions? Just reply to this email — we're here to help!
Dook Scoop 'Em | Professional Pet Waste Removal
                    `
                  })
                });

                if (customerEmailResponse.ok) {
                  console.log("Customer confirmation email sent successfully");
                } else {
                  console.log("Customer confirmation email failed:", await customerEmailResponse.text());
                }
              } catch (customerEmailError) {
                console.log("Failed to send customer confirmation email:", customerEmailError.message);
              }
              
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
                subject: `New Waitlist Signup - ${submission.name} (${new Date().toLocaleDateString()})`,
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
                  ${submission.lastCleanup ? `<p><strong>Last cleanup:</strong> ${submission.lastCleanup}</p>` : ''}
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
                  ${submission.lastCleanup ? `Last cleanup: ${submission.lastCleanup}` : ''}
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

  // ===== CMS API ROUTES =====
  
  // Page Management Routes
  app.get("/api/cms/pages", requireAuth, async (req, res) => {
    try {
      const pages = await storage.getAllPages();
      res.json({ pages });
    } catch (error) {
      console.error("Error fetching pages:", error);
      res.status(500).json({ error: "Failed to fetch pages" });
    }
  });

  app.get("/api/cms/pages/:slug", requireAuth, async (req, res) => {
    try {
      const { slug } = req.params;
      const page = await storage.getPage(slug);
      if (!page) {
        return res.status(404).json({ error: "Page not found" });
      }
      const content = await storage.getPageContent(page.id);
      const seoSettings = await storage.getPageSeoSettings(page.id);
      res.json({ page, content, seoSettings });
    } catch (error) {
      console.error("Error fetching page:", error);
      res.status(500).json({ error: "Failed to fetch page" });
    }
  });

  app.post("/api/cms/pages", requireAuth, async (req, res) => {
    try {
      const validatedData = insertPageSchema.parse(req.body);
      const page = await storage.createPage(validatedData);
      res.json({ page });
    } catch (error) {
      console.error("Error creating page:", error);
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: (error as any).errors 
        });
      }
      res.status(500).json({ message: "Failed to create page" });
    }
  });

  app.patch("/api/cms/pages/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertPageSchema.partial().parse(req.body);
      const page = await storage.updatePage(id, validatedData);
      if (!page) {
        return res.status(404).json({ error: "Page not found" });
      }
      res.json({ page });
    } catch (error) {
      console.error("Error updating page:", error);
      res.status(500).json({ message: "Failed to update page" });
    }
  });

  app.delete("/api/cms/pages/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deletePage(id);
      res.json({ message: "Page deleted successfully" });
    } catch (error) {
      console.error("Error deleting page:", error);
      res.status(500).json({ message: "Failed to delete page" });
    }
  });

  // Content Management Routes
  app.post("/api/cms/content", requireAuth, async (req, res) => {
    try {
      const validatedData = insertPageContentSchema.parse(req.body);
      const content = await storage.updatePageContent(validatedData);
      res.json({ content });
    } catch (error) {
      console.error("Error updating content:", error);
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: (error as any).errors 
        });
      }
      res.status(500).json({ message: "Failed to update content" });
    }
  });

  app.get("/api/cms/content/:pageId", requireAuth, async (req, res) => {
    try {
      const { pageId } = req.params;
      const content = await storage.getPageContent(pageId);
      res.json({ content });
    } catch (error) {
      console.error("Error fetching page content:", error);
      res.status(500).json({ error: "Failed to fetch content" });
    }
  });

  app.delete("/api/cms/content/:pageId/:elementId", requireAuth, async (req, res) => {
    try {
      const { pageId, elementId } = req.params;
      await storage.deletePageContent(pageId, elementId);
      res.json({ message: "Content deleted successfully" });
    } catch (error) {
      console.error("Error deleting content:", error);
      res.status(500).json({ message: "Failed to delete content" });
    }
  });

  // SEO Management Routes
  app.post("/api/cms/seo", requireAuth, async (req, res) => {
    try {
      const validatedData = insertSeoSettingsSchema.parse(req.body);
      const settings = await storage.updatePageSeoSettings(validatedData);
      res.json({ settings });
    } catch (error) {
      console.error("Error updating SEO settings:", error);
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: (error as any).errors 
        });
      }
      res.status(500).json({ message: "Failed to update SEO settings" });
    }
  });

  app.get("/api/cms/seo/:pageId", requireAuth, async (req, res) => {
    try {
      const { pageId } = req.params;
      const settings = await storage.getPageSeoSettings(pageId);
      res.json({ settings });
    } catch (error) {
      console.error("Error fetching SEO settings:", error);
      res.status(500).json({ error: "Failed to fetch SEO settings" });
    }
  });

  // Get page content by slug for public access
  app.get("/api/cms/content/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const page = await storage.getPageBySlug(slug);
      const content = await storage.getPageContentByPage(page.id);
      
      // Format content for easy lookup
      const contentMap: Record<string, any> = {};
      content.forEach(block => {
        contentMap[block.elementId] = {
          id: block.id,
          content: block.content,
          contentType: block.contentType,
          metadata: block.metadata
        };
      });

      res.json({ page, content: contentMap });
    } catch (error) {
      console.error("Error fetching page content:", error);
      res.status(404).json({ error: "Page not found" });
    }
  });

  // Update content block by element
  app.put("/api/cms/content/element/:pageId/:elementId", requireAuth, async (req, res) => {
    try {
      const { pageId, elementId } = req.params;
      const { content } = req.body;
      
      await storage.updatePageContent({
        pageId,
        elementId,
        content,
        contentType: "text" // Default, can be expanded
      });
      
      res.json({ message: "Content updated successfully" });
    } catch (error) {
      console.error("Error updating content:", error);
      res.status(500).json({ error: "Failed to update content" });
    }
  });

  // Initialize sample CMS data
  app.post("/api/cms/initialize", requireAuth, async (req, res) => {
    try {
      // Check if homepage already exists
      let homepage;
      try {
        homepage = await storage.getPageBySlug("home");
      } catch (error) {
        // Create homepage if it doesn't exist
        homepage = await storage.createPage({
          slug: "home",
          title: "Dook Scoop 'Em - Homepage",
          status: "published"
        });
      }

      // Create sample content for homepage editable elements
      const sampleContent = [
        {
          pageId: homepage.id,
          elementId: "hero-title",
          contentType: "text" as const,
          content: "DOOK SCOOP 'EM",
        },
        {
          pageId: homepage.id,
          elementId: "hero-subtitle", 
          contentType: "text" as const,
          content: "Professional Pet Waste Removal Service",
        },
        {
          pageId: homepage.id,
          elementId: "service-description",
          contentType: "html" as const,
          content: 'Starting in Yulee, Fernandina, Oceanway & Nassau County. Founding members <a href="#perks" class="text-orange-600 hover:text-orange-700 font-bold transition-colors">get perks</a>.',
          content: "$85",
        }
      ];

      // Insert sample content
      for (const content of sampleContent) {
        await storage.updatePageContent(content);
      }

      // Create SEO settings
      await storage.updatePageSeoSettings({
        pageId: homepage.id,
        metaTitle: "Dook Scoop 'Em - Professional Pet Waste Removal Service",
        metaDescription: "Professional dog poop cleanup service in Nassau County. Starting in Yulee, Fernandina Beach, and Oceanway. We fear no pile!",
        ogTitle: "Dook Scoop 'Em - We Fear No Pile",
        ogDescription: "Professional pet waste removal service coming to Northeast Florida in 2025.",
        structuredData: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "Dook Scoop 'Em",
          "description": "Professional pet waste removal service",
          "address": {
            "@type": "PostalAddress",
            "addressRegion": "FL",
            "addressCountry": "US"
          },
          "serviceArea": ["Nassau County", "Yulee", "Fernandina Beach", "Oceanway"]
        })
      });

      res.json({ message: "CMS data initialized successfully", page: homepage });
    } catch (error) {
      console.error("Error initializing CMS data:", error);
      res.status(500).json({ message: "Failed to initialize CMS data" });
    }
  });

  // Media Management Routes
  app.get("/api/cms/media", requireAuth, async (req, res) => {
    try {
      const assets = await storage.getAllMediaAssets();
      res.json({ assets });
    } catch (error) {
      console.error("Error fetching media assets:", error);
      res.status(500).json({ error: "Failed to fetch media assets" });
    }
  });

  app.post("/api/cms/media", requireAuth, async (req, res) => {
    try {
      const validatedData = insertMediaAssetSchema.parse(req.body);
      const asset = await storage.createMediaAsset(validatedData);
      res.json({ asset });
    } catch (error) {
      console.error("Error creating media asset:", error);
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: (error as any).errors 
        });
      }
      res.status(500).json({ message: "Failed to create media asset" });
    }
  });

  app.delete("/api/cms/media/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteMediaAsset(id);
      res.json({ message: "Media asset deleted successfully" });
    } catch (error) {
      console.error("Error deleting media asset:", error);
      res.status(500).json({ message: "Failed to delete media asset" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
