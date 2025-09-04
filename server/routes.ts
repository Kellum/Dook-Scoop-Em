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
  insertMediaAssetSchema,
  insertQuoteRequestSchema,
  insertOnboardingSubmissionSchema
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

  // Admin Quote Management Endpoints
  app.get("/api/admin/quotes", requireAuth, async (req, res) => {
    try {
      const quotes = await storage.getAllQuoteRequests();
      res.json({ quotes });
    } catch (error) {
      console.error("Error fetching quotes:", error);
      res.status(500).json({ error: "Failed to fetch quotes" });
    }
  });

  app.patch("/api/admin/quotes/:id/status", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!["new", "contacted", "quoted", "converted", "lost"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      
      const quote = await storage.updateQuoteRequestStatus(id, status);
      if (!quote) {
        return res.status(404).json({ error: "Quote not found" });
      }
      res.json({ message: "Quote status updated successfully", quote });
    } catch (error) {
      console.error("Error updating quote status:", error);
      res.status(500).json({ error: "Failed to update quote status" });
    }
  });

  app.patch("/api/admin/quotes/:id/notes", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { notes } = req.body;
      
      const quote = await storage.addQuoteRequestNote(id, notes);
      if (!quote) {
        return res.status(404).json({ error: "Quote not found" });
      }
      res.json({ message: "Quote notes updated successfully", quote });
    } catch (error) {
      console.error("Error updating quote notes:", error);
      res.status(500).json({ error: "Failed to update quote notes" });
    }
  });

  app.delete("/api/admin/quotes/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteQuoteRequest(id);
      res.json({ message: "Quote deleted successfully" });
    } catch (error) {
      console.error("Error deleting quote:", error);
      res.status(500).json({ error: "Failed to delete quote" });
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
  // Simple contact form endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      console.log("=== CONTACT FORM RECEIVED ===");
      console.log("Contact data:", req.body);
      
      const { name, email, phone, subject, message } = req.body;
      
      // Send email notification to ryan@dookscoop.com
      try {
        const emailContent = {
          from: {
            email: "noreply@dookscoop.com",
            name: "Dook Scoop Em Contact Form"
          },
          to: [
            {
              email: "ryan@dookscoop.com",
              name: "Ryan"
            }
          ],
          subject: `Contact Form: ${subject || 'New Message'}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>Subject:</strong> ${subject || 'Not provided'}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
            <hr>
            <p><em>Submitted at ${new Date().toLocaleString()}</em></p>
          `,
          text: `
            New Contact Form Submission
            
            Name: ${name}
            Email: ${email}
            Phone: ${phone || 'Not provided'}
            Subject: ${subject || 'Not provided'}
            
            Message:
            ${message}
            
            Submitted at ${new Date().toLocaleString()}
          `
        };

        if (process.env.MAILERSEND_API_KEY) {
          // Use MailerSend API
          const emailResponse = await fetch('https://api.mailersend.com/v1/email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.MAILERSEND_API_KEY}`
            },
            body: JSON.stringify(emailContent)
          });

          if (emailResponse.ok) {
            console.log("Contact form email sent successfully via API");
          } else {
            console.log("API failed, trying SMTP fallback");
            await transporter.sendMail({
              from: '"Dook Scoop Em Contact Form" <noreply@dookscoop.com>',
              to: 'ryan@dookscoop.com',
              subject: emailContent.subject,
              html: emailContent.html,
              text: emailContent.text
            });
            console.log("Contact form email sent successfully via SMTP");
          }
        } else {
          // Fallback to SMTP
          await transporter.sendMail({
            from: '"Dook Scoop Em Contact Form" <noreply@dookscoop.com>',
            to: 'ryan@dookscoop.com',
            subject: emailContent.subject,
            html: emailContent.html,
            text: emailContent.text
          });
          console.log("Contact form email sent successfully via SMTP");
        }
      } catch (emailError) {
        console.error("Failed to send contact form email:", emailError);
        // Continue anyway - don't fail the form submission if email fails
      }
      
      res.json({
        success: true,
        message: "Thank you for your message! We'll get back to you within 24 hours.",
      });
      
    } catch (error) {
      console.error("Contact form error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to send message. Please try again later.",
      });
    }
  });

  // Coupon validation endpoint
  app.post("/api/validate-coupon", async (req, res) => {
    console.log("=== COUPON VALIDATION REQUEST ===");
    console.log("Request body:", JSON.stringify(req.body, null, 2));
    console.log("Request headers:", req.headers);
    
    // Set explicit JSON content type
    res.set('Content-Type', 'application/json');
    
    try {
      const { code } = req.body;
      
      if (!code || typeof code !== 'string') {
        const response = { 
          valid: false, 
          message: "Coupon code is required" 
        };
        console.log("Sending response:", response);
        return res.status(400).json(response);
      }

      // Check against your active Sweep&Go coupon codes
      const activeCoupons = {
        'TESTER': { discount: 100, type: 'percent', description: 'Free service for testing' }
      };

      const coupon = activeCoupons[code.toUpperCase()];
      
      if (coupon) {
        const response = {
          valid: true,
          code: code.toUpperCase(),
          discount: coupon.discount,
          type: coupon.type,
          description: coupon.description
        };
        console.log("Sending success response:", response);
        return res.json(response);
      } else {
        const response = {
          valid: false,
          message: "Invalid coupon code"
        };
        console.log("Sending invalid response:", response);
        return res.json(response);
      }
    } catch (error) {
      console.error("Coupon validation error:", error);
      const response = { 
        valid: false, 
        message: "Error validating coupon" 
      };
      console.log("Sending error response:", response);
      res.status(500).json(response);
    }
    console.log("=== END COUPON VALIDATION ===");
  });

  // Quote request endpoint - integrates with Sweep&Go
  app.post("/api/quote", async (req, res) => {
    try {
      console.log("=== QUOTE REQUEST RECEIVED ===");
      console.log("Request body:", JSON.stringify(req.body, null, 2));
      
      // Validate request body
      const validatedData = insertQuoteRequestSchema.parse(req.body);
      console.log("Validated data:", validatedData);
      
      // Check if email already exists in Sweep&Go
      const emailExists = await sweepAndGoAPI.checkClientEmailExists(validatedData.email);
      console.log(`Email ${validatedData.email} exists in Sweep&Go:`, emailExists);
      
      // Get pricing from Sweep&Go
      const sweepAndGoPricing = await sweepAndGoAPI.getPricing({
        zipCode: validatedData.zipCode,
        numberOfDogs: validatedData.numberOfDogs,
        frequency: validatedData.serviceFrequency,
        lastCleanedTimeframe: validatedData.lastCleanedTimeframe
      });
      
      console.log("Sweep&Go pricing response:", sweepAndGoPricing);
      
      // Extract estimated price from Sweep&Go response if available
      let estimatedPrice = null;
      if (sweepAndGoPricing && !sweepAndGoPricing.error && sweepAndGoPricing.price) {
        // Extract the actual price value from the price object
        estimatedPrice = typeof sweepAndGoPricing.price === 'object' 
          ? sweepAndGoPricing.price.value 
          : sweepAndGoPricing.price.toString();
      }
      
      // Store quote request in database
      const quoteData = {
        ...validatedData,
        sweepAndGoEmailExists: emailExists,
        sweepAndGoPricing: JSON.stringify(sweepAndGoPricing),
        estimatedPrice: estimatedPrice
      };
      
      const quoteRequest = await storage.createQuoteRequest(quoteData);
      
      console.log("Quote request created:", quoteRequest.id);
      
      // Prepare response with pricing information
      const responseData = {
        success: true,
        quoteId: quoteRequest.id,
        message: "Quote request received successfully",
        emailExistsInSystem: emailExists,
        pricing: sweepAndGoPricing && !sweepAndGoPricing.error ? {
          estimatedPrice: estimatedPrice,
          frequency: validatedData.serviceFrequency,
          details: sweepAndGoPricing
        } : null,
        nextSteps: emailExists 
          ? "We found your information in our system. We'll contact you within 24 hours to confirm pricing and schedule."
          : "We'll contact you within 24 hours with a custom quote and to schedule your service."
      };
      
      console.log("Quote response:", responseData);
      
      // Track quote submission for analytics
      console.log("=== QUOTE ANALYTICS ===");
      console.log("Event: quote_request");
      console.log("Email exists:", emailExists);
      console.log("Pricing available:", !!estimatedPrice);
      console.log("Service frequency:", validatedData.serviceFrequency);
      console.log("Number of dogs:", validatedData.numberOfDogs);
      console.log("Zip code:", validatedData.zipCode);
      console.log("========================");
      
      res.json(responseData);
      
    } catch (error) {
      console.error("Quote request error:", error);
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ 
          success: false,
          message: "Please check your form data", 
          errors: (error as any).errors 
        });
      }
      res.status(500).json({ 
        success: false,
        message: "Failed to process quote request. Please try again later." 
      });
    }
  });
  
  // Customer onboarding endpoint - complete signup with payment through Sweep&Go
  app.post("/api/onboard", async (req, res) => {
    try {
      console.log("=== CUSTOMER ONBOARDING REQUEST ===");
      console.log("Request body:", JSON.stringify(req.body, null, 2));
      
      // Validate request body
      const validatedData = insertOnboardingSubmissionSchema.parse(req.body);
      console.log("Validated onboarding data:", validatedData);
      
      // Create initial onboarding record
      const onboardingRecord = await storage.createOnboardingSubmission({
        ...validatedData,
        status: "pending"
      });
      
      console.log("Onboarding record created:", onboardingRecord.id);
      
      // Use Sweep&Go onboarding API with credit card info from form
      // Note: In a real implementation, you'd integrate with Stripe Elements to get the card token
      // For now, we'll simulate the process
      const sweepAndGoResponse = await sweepAndGoAPI.onboardCustomer({
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        homeAddress: validatedData.homeAddress,
        city: validatedData.city,
        state: validatedData.state,
        zipCode: validatedData.zipCode,
        homePhone: validatedData.homePhone,
        cellPhone: validatedData.cellPhone,
        numberOfDogs: validatedData.numberOfDogs,
        serviceFrequency: validatedData.serviceFrequency,
        lastCleanedTimeframe: validatedData.lastCleanedTimeframe,
        initialCleanupRequired: validatedData.initialCleanupRequired,
        notificationType: validatedData.notificationType,
        notificationChannel: validatedData.notificationChannel,
        howHeardAboutUs: validatedData.howHeardAboutUs,
        additionalComments: validatedData.additionalComments,
        nameOnCard: validatedData.nameOnCard,
        // These would come from Stripe Elements in a real implementation
        creditCardToken: "tok_placeholder", // Would be generated by Stripe Elements
        cvv: "123", // Would be from secure form
        postal: validatedData.zipCode, // Using zip code as postal for now
        expiry: "1225" // Placeholder - would be from secure form
      });
      
      console.log("Sweep&Go onboarding response:", sweepAndGoResponse);
      
      // Update onboarding record with Sweep&Go response
      let finalStatus = "completed";
      let errorMessage = undefined;
      let clientId = undefined;
      
      if (sweepAndGoResponse.error) {
        finalStatus = "failed";
        errorMessage = sweepAndGoResponse.error;
        console.error("Sweep&Go onboarding failed:", sweepAndGoResponse.error);
      } else {
        clientId = sweepAndGoResponse.client_id || sweepAndGoResponse.id;
        console.log("Sweep&Go onboarding successful, client ID:", clientId);
      }
      
      // Update the onboarding record with final status
      const updatedRecord = await storage.updateOnboardingStatus(
        onboardingRecord.id,
        finalStatus,
        JSON.stringify(sweepAndGoResponse),
        clientId,
        errorMessage
      );
      
      console.log("Final onboarding status:", finalStatus);
      
      // Prepare response
      const responseData = {
        success: finalStatus === "completed",
        onboardingId: onboardingRecord.id,
        message: finalStatus === "completed" 
          ? "Welcome to Dook Scoop 'Em! Your service has been set up successfully."
          : "There was an issue setting up your service. We'll contact you to resolve this.",
        sweepAndGoClientId: clientId,
        nextSteps: finalStatus === "completed"
          ? "You'll receive a confirmation email with your service schedule. We'll be in touch before your first visit!"
          : "Our team will contact you within 24 hours to complete your setup and process payment.",
        error: errorMessage
      };
      
      console.log("Onboarding response:", responseData);
      
      // Track onboarding for analytics
      console.log("=== ONBOARDING ANALYTICS ===");
      console.log("Event: customer_onboarding");
      console.log("Status:", finalStatus);
      console.log("Service frequency:", validatedData.serviceFrequency);
      console.log("Number of dogs:", validatedData.numberOfDogs);
      console.log("Zip code:", validatedData.zipCode);
      console.log("Sweep&Go integration:", !sweepAndGoResponse.error);
      console.log("=============================");
      
      res.json(responseData);
      
    } catch (error) {
      console.error("Onboarding error:", error);
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ 
          success: false,
          message: "Please check your form data", 
          errors: (error as any).errors 
        });
      }
      res.status(500).json({ 
        success: false,
        message: "Failed to process onboarding. Please try again later." 
      });
    }
  });
  
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
      console.log("Preferred Plan:", submission.preferredPlan);
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
          preferredPlan: submission.preferredPlan,
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
                  email: "noreply@dookscoop.com",
                  name: "Dook Scoop Em Waitlist"
                },
                to: [
                  {
                    email: "ryan@dookscoop.com",
                    name: "Ryan"
                  }
                ],
                subject: `🐾 New Waitlist: ${submission.name} (${submission.zipCode})`,
                html: `
                  <h2>🐾 New Waitlist Signup</h2>
                  <p><strong>Name:</strong> ${submission.name}</p>
                  <p><strong>Email:</strong> ${submission.email}</p>
                  <p><strong>Phone:</strong> ${submission.phone}</p>
                  <p><strong>Address:</strong> ${submission.address}</p>
                  <p><strong>Zip Code:</strong> ${submission.zipCode}</p>
                  <p><strong>Dogs:</strong> ${submission.numberOfDogs}</p>
                  ${submission.referralSource ? `<p><strong>Heard about us:</strong> ${submission.referralSource}</p>` : ''}
                  ${submission.urgency ? `<p><strong>Urgency:</strong> ${submission.urgency}</p>` : ''}
                  ${submission.lastCleanup ? `<p><strong>Last cleanup:</strong> ${submission.lastCleanup}</p>` : ''}
                  ${submission.preferredPlan ? `<p><strong>Preferred plan:</strong> ${submission.preferredPlan}</p>` : ''}
                  <p><strong>Can text:</strong> ${submission.canText ? 'YES ✅' : 'NO'}</p>
                  <hr>
                  <p><em>Submitted: ${new Date().toLocaleString()}</em></p>
                `,
                text: `
New Waitlist Signup

Name: ${submission.name}
Email: ${submission.email}
Phone: ${submission.phone}
Address: ${submission.address}
Zip Code: ${submission.zipCode}
Dogs: ${submission.numberOfDogs}
${submission.referralSource ? `Heard about us: ${submission.referralSource}` : ''}
${submission.urgency ? `Urgency: ${submission.urgency}` : ''}
${submission.lastCleanup ? `Last cleanup: ${submission.lastCleanup}` : ''}
${submission.preferredPlan ? `Preferred plan: ${submission.preferredPlan}` : ''}
Can text: ${submission.canText ? 'YES' : 'NO'}

Submitted: ${new Date().toLocaleString()}
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
                from: '"Dook Scoop Em Waitlist" <noreply@dookscoop.com>',
                to: 'ryan@dookscoop.com',
                subject: `🐾 New Waitlist: ${submission.name} (${submission.zipCode})`,
                html: `
                  <h2>🐾 New Waitlist Signup</h2>
                  <p><strong>Name:</strong> ${submission.name}</p>
                  <p><strong>Email:</strong> ${submission.email}</p>
                  <p><strong>Phone:</strong> ${submission.phone}</p>
                  <p><strong>Address:</strong> ${submission.address}</p>
                  <p><strong>Zip Code:</strong> ${submission.zipCode}</p>
                  <p><strong>Dogs:</strong> ${submission.numberOfDogs}</p>
                  ${submission.referralSource ? `<p><strong>Heard about us:</strong> ${submission.referralSource}</p>` : ''}
                  ${submission.urgency ? `<p><strong>Urgency:</strong> ${submission.urgency}</p>` : ''}
                  ${submission.lastCleanup ? `<p><strong>Last cleanup:</strong> ${submission.lastCleanup}</p>` : ''}
                  ${submission.preferredPlan ? `<p><strong>Preferred plan:</strong> ${submission.preferredPlan}</p>` : ''}
                  <p><strong>Can text:</strong> ${submission.canText ? 'YES ✅' : 'NO'}</p>
                  <hr>
                  <p><em>Submitted: ${new Date().toLocaleString()}</em></p>
                `,
                text: `
New Waitlist Signup

Name: ${submission.name}
Email: ${submission.email}
Phone: ${submission.phone}
Address: ${submission.address}
Zip Code: ${submission.zipCode}
Dogs: ${submission.numberOfDogs}
${submission.referralSource ? `Heard about us: ${submission.referralSource}` : ''}
${submission.urgency ? `Urgency: ${submission.urgency}` : ''}
${submission.lastCleanup ? `Last cleanup: ${submission.lastCleanup}` : ''}
${submission.preferredPlan ? `Preferred plan: ${submission.preferredPlan}` : ''}
Can text: ${submission.canText ? 'YES' : 'NO'}

Submitted: ${new Date().toLocaleString()}
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
        },
        {
          pageId: homepage.id,
          elementId: "service-price",
          contentType: "text" as const,
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
