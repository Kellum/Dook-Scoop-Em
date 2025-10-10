import type { Express } from "express";
import express from "express";
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
import { hashPassword, verifyPassword, generateToken, requireAuth, requireAdmin } from "./auth";
import { stripe, STRIPE_PRICES } from "./stripe";
import { createClient } from '@supabase/supabase-js';
import nodemailer from "nodemailer";
import { writeFile, readFile, existsSync } from "fs";
import { promisify } from "util";

const writeFileAsync = promisify(writeFile);
const readFileAsync = promisify(readFile);

// Supabase Admin Client for user management
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

  // Supabase Admin User Creation
  app.post("/api/admin/create-supabase-admin", async (req, res) => {
    try {
      const { email, password, firstName, lastName } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      // Create admin user in Supabase with admin role
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          firstName: firstName || "Admin",
          lastName: lastName || "User",
          role: "admin"
        }
      });

      if (error) {
        console.error("Failed to create Supabase admin:", error);
        return res.status(400).json({ message: error.message });
      }

      res.json({
        message: "Supabase admin user created successfully",
        user: {
          id: data.user.id,
          email: data.user.email,
          role: "admin"
        }
      });
    } catch (error) {
      console.error("Create Supabase admin error:", error);
      res.status(500).json({ message: "Failed to create Supabase admin user" });
    }
  });

  // Admin-only endpoints
  app.get("/api/admin/stats", requireAdmin, async (req, res) => {
    try {
      const allCustomers = await storage.getAllCustomers();
      
      // Only count customers with role='customer' (exclude admins)
      const customers = allCustomers.filter(c => c.role === 'customer');
      
      const stats = {
        totalCustomers: customers.length,
        activeSubscriptions: customers.length, // All customers have subscriptions after migration
        todaysVisits: 0, // TODO: implement when visits are tracked
        monthlyRevenue: 0, // TODO: calculate from subscriptions
      };
      
      console.log('[Admin Stats]', stats);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  app.get("/api/admin/customers", requireAdmin, async (req, res) => {
    try {
      const allCustomers = await storage.getAllCustomers();
      
      // Filter to only show customers (not admins)
      const customers = allCustomers.filter(c => c.role === 'customer');
      
      // Get subscription data for each customer
      const customersWithSubscriptions = await Promise.all(
        customers.map(async (customer) => {
          const subscription = await storage.getSubscriptionByCustomerId(customer.id);
          return {
            ...customer,
            subscription: subscription || null,
          };
        })
      );
      
      res.json({ customers: customersWithSubscriptions });
    } catch (error) {
      console.error("Error fetching customers:", error);
      res.status(500).json({ error: "Failed to fetch customers" });
    }
  });

  app.get("/api/admin/locations", requireAdmin, async (req, res) => {
    try {
      const locations = await storage.getAllServiceLocations();
      res.json({ locations });
    } catch (error) {
      console.error("Error fetching admin locations:", error);
      res.status(500).json({ error: "Failed to fetch locations" });
    }
  });

  app.post("/api/admin/locations", requireAdmin, async (req, res) => {
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

  app.patch("/api/admin/locations/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const location = await storage.updateServiceLocation(id, req.body);
      if (!location) {
        return res.status(404).json({ message: "Location not found" });
      }
      res.json({ location });
    } catch (error) {
      console.error("Error updating location:", error);
      res.status(500).json({ message: "Failed to update location" });
    }
  });

  app.delete("/api/admin/locations/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteServiceLocation(id);
      res.json({ message: "Location deleted successfully" });
    } catch (error) {
      console.error("Error deleting location:", error);
      res.status(500).json({ message: "Failed to delete location" });
    }
  });

  app.get("/api/admin/waitlist", requireAdmin, async (req, res) => {
    try {
      const submissions = await storage.getAllWaitlistSubmissions();
      res.json({ submissions });
    } catch (error) {
      console.error("Error fetching waitlist:", error);
      res.status(500).json({ error: "Failed to fetch waitlist" });
    }
  });

  app.get("/api/admin/waitlist/archived", requireAdmin, async (req, res) => {
    try {
      const submissions = await storage.getArchivedWaitlistSubmissions();
      res.json({ submissions });
    } catch (error) {
      console.error("Error fetching archived waitlist:", error);
      res.status(500).json({ error: "Failed to fetch archived waitlist" });
    }
  });

  // Admin Quote Management Endpoints
  app.get("/api/admin/quotes", requireAdmin, async (req, res) => {
    try {
      const quotes = await storage.getAllQuoteRequests();
      res.json({ quotes });
    } catch (error) {
      console.error("Error fetching quotes:", error);
      res.status(500).json({ error: "Failed to fetch quotes" });
    }
  });

  app.patch("/api/admin/quotes/:id/status", requireAdmin, async (req, res) => {
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

  app.patch("/api/admin/quotes/:id/notes", requireAdmin, async (req, res) => {
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

  app.delete("/api/admin/quotes/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteQuoteRequest(id);
      res.json({ message: "Quote deleted successfully" });
    } catch (error) {
      console.error("Error deleting quote:", error);
      res.status(500).json({ error: "Failed to delete quote" });
    }
  });

  app.patch("/api/admin/waitlist/:id/archive", requireAdmin, async (req, res) => {
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

  app.delete("/api/admin/waitlist/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteWaitlistSubmission(id);
      res.json({ message: "Submission deleted successfully" });
    } catch (error) {
      console.error("Error deleting submission:", error);
      res.status(500).json({ error: "Failed to delete submission" });
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
            email: "noreply@dookscoopem.com",
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

        // MailerSend format
        const mailerSendPayload = {
          from: {
            email: "noreply@dookscoopem.com", 
            name: "Dook Scoop Em Contact Form"
          },
          to: [
            {
              email: "ryan@dookscoop.com",
              name: "Ryan"
            }
          ],
          subject: emailContent.subject,
          html: emailContent.html,
          text: emailContent.text
        };

        if (process.env.MAILERSEND_API_KEY) {
          // Use MailerSend API
          const emailResponse = await fetch('https://api.mailersend.com/v1/email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.MAILERSEND_API_KEY}`
            },
            body: JSON.stringify(mailerSendPayload)
          });

          if (emailResponse.ok) {
            console.log("Contact form email sent successfully via MailerSend API");
          } else {
            const errorText = await emailResponse.text();
            console.error("MailerSend API failed:", emailResponse.status, emailResponse.statusText, errorText);
            console.log("API failed, trying SMTP fallback");
            await transporter.sendMail({
              from: '"Dook Scoop Em Contact Form" <noreply@dookscoopem.com>',
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
            from: '"Dook Scoop Em Contact Form" <noreply@dookscoopem.com>',
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
      const activeCoupons: Record<string, { discount: number; type: string; description: string }> = {
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

  // Quote request endpoint - saves to CRM for admin follow-up
  app.post("/api/quote", async (req, res) => {
    try {
      console.log("=== QUOTE REQUEST RECEIVED ===");
      console.log("Request body:", JSON.stringify(req.body, null, 2));

      // Validate request body
      const validatedData = insertQuoteRequestSchema.parse(req.body);
      console.log("Validated data:", validatedData);

      // Store quote request in database for admin to follow up
      const quoteData = {
        ...validatedData,
        sweepAndGoEmailExists: false, // No longer checking Sweep&Go
        sweepAndGoPricing: null,
        estimatedPrice: null // Admin will provide pricing
      };

      const quoteRequest = await storage.createQuoteRequest(quoteData);

      console.log("Quote request created:", quoteRequest.id);

      // Prepare response
      const responseData = {
        success: true,
        quoteId: quoteRequest.id,
        message: "Quote request received successfully",
        nextSteps: "We'll contact you within 24 hours with a custom quote and to schedule your service."
      };

      console.log("Quote response:", responseData);

      // Track quote submission for analytics
      console.log("=== QUOTE ANALYTICS ===");
      console.log("Event: quote_request");
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
  
  // Customer onboarding endpoint - saves to CRM for admin follow-up
  app.post("/api/onboard", async (req, res) => {
    try {
      console.log("=== CUSTOMER ONBOARDING REQUEST ===");
      console.log("Request body:", JSON.stringify(req.body, null, 2));

      // Validate request body
      const validatedData = insertOnboardingSubmissionSchema.parse(req.body);
      console.log("Validated onboarding data:", validatedData);

      // Generate a temporary password for the customer
      const temporaryPassword = `Dook${Math.random().toString(36).slice(-8)}!`;

      // Create Supabase auth user
      let supabaseUserId: string | null = null;
      try {
        const { data, error } = await supabase.auth.admin.createUser({
          email: validatedData.email,
          password: temporaryPassword,
          email_confirm: true, // Auto-confirm email
          user_metadata: {
            firstName: validatedData.firstName,
            lastName: validatedData.lastName,
            phone: validatedData.cellPhone || validatedData.homePhone,
            role: 'customer'
          }
        });

        if (error) {
          console.error("Failed to create Supabase user:", error);
          throw new Error(`Auth user creation failed: ${error.message}`);
        }

        supabaseUserId = data.user.id;
        console.log("Supabase user created:", supabaseUserId);
      } catch (authError) {
        console.error("Supabase auth error:", authError);
        // Continue with onboarding even if auth fails - admin can create account later
      }

      // Create onboarding record in database
      const onboardingRecord = await storage.createOnboardingSubmission({
        ...validatedData,
        status: "completed"
      });

      console.log("Onboarding record created:", onboardingRecord.id);

      // Send welcome email with login credentials
      try {
        const welcomeEmail = {
          from: {
            email: "noreply@dookscoopem.com",
            name: "Dook Scoop 'Em"
          },
          to: [
            {
              email: validatedData.email,
              name: `${validatedData.firstName} ${validatedData.lastName}`
            }
          ],
          subject: "🎉 Welcome to Dook Scoop 'Em!",
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
              <div style="background: linear-gradient(135deg, #ff7b00, #ff9500); padding: 30px; text-align: center; border-radius: 20px 20px 0 0;">
                <h1 style="color: white; font-size: 32px; font-weight: 900; margin: 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
                  🎉 WELCOME TO THE PACK!
                </h1>
              </div>

              <div style="background: white; padding: 40px 30px; border-radius: 0 0 20px 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                <p style="font-size: 18px; line-height: 1.6; color: #333; margin-bottom: 25px;">
                  <strong>Hey ${validatedData.firstName}!</strong> 👋
                </p>

                <p style="font-size: 16px; line-height: 1.6; color: #555; margin-bottom: 25px;">
                  Thanks for signing up with Dook Scoop 'Em! We've created your customer account and our team will be reaching out shortly to finalize your service details.
                </p>

                <div style="background: #e8f4fd; padding: 25px; border-radius: 15px; margin: 25px 0; border-left: 5px solid #2563eb;">
                  <h3 style="color: #1d4ed8; font-size: 20px; font-weight: 800; margin: 0 0 15px 0;">
                    🔐 Your Customer Portal Login
                  </h3>
                  <p style="margin: 10px 0; color: #374151;"><strong>Email:</strong> ${validatedData.email}</p>
                  <p style="margin: 10px 0; color: #374151;"><strong>Temporary Password:</strong> <code style="background: white; padding: 5px 10px; border-radius: 5px; font-family: monospace;">${temporaryPassword}</code></p>
                  <p style="margin: 15px 0 0 0; color: #374151; font-size: 14px;"><em>Please change your password after logging in.</em></p>
                </div>

                <div style="text-align: center; margin: 30px 0;">
                  <a href="${process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : 'http://localhost:5001'}/auth/sign-in" style="display: inline-block; background: #ff7b00; color: white; text-decoration: none; padding: 15px 40px; border-radius: 10px; font-weight: bold; font-size: 16px;">
                    Login to Your Dashboard
                  </a>
                </div>

                <div style="background: #f9f9f9; padding: 25px; border-radius: 15px; margin: 25px 0;">
                  <h3 style="color: #374151; font-size: 18px; font-weight: 800; margin: 0 0 15px 0;">
                    📋 Your Service Details:
                  </h3>
                  <table style="width: 100%; color: #555;">
                    <tr><td style="padding: 5px 0; font-weight: 600;">Service Address:</td><td style="padding: 5px 0;">${validatedData.homeAddress}, ${validatedData.city}, ${validatedData.state} ${validatedData.zipCode}</td></tr>
                    <tr><td style="padding: 5px 0; font-weight: 600;">Number of Dogs:</td><td style="padding: 5px 0;">${validatedData.numberOfDogs}</td></tr>
                    <tr><td style="padding: 5px 0; font-weight: 600;">Service Frequency:</td><td style="padding: 5px 0;">${validatedData.serviceFrequency}</td></tr>
                    <tr><td style="padding: 5px 0; font-weight: 600;">Phone:</td><td style="padding: 5px 0;">${validatedData.cellPhone}</td></tr>
                  </table>
                </div>

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
Welcome to Dook Scoop 'Em!

Hey ${validatedData.firstName}!

Thanks for signing up! We've created your customer account and our team will be reaching out shortly to finalize your service details.

YOUR CUSTOMER PORTAL LOGIN:
Email: ${validatedData.email}
Temporary Password: ${temporaryPassword}

Please change your password after logging in.

Login at: ${process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : 'http://localhost:5001'}/auth/sign-in

YOUR SERVICE DETAILS:
Service Address: ${validatedData.homeAddress}, ${validatedData.city}, ${validatedData.state} ${validatedData.zipCode}
Number of Dogs: ${validatedData.numberOfDogs}
Service Frequency: ${validatedData.serviceFrequency}
Phone: ${validatedData.cellPhone}

Questions? Just reply to this email — we're here to help!
Dook Scoop 'Em | Professional Pet Waste Removal
          `
        };

        if (process.env.MAILERSEND_API_KEY) {
          const emailResponse = await fetch('https://api.mailersend.com/v1/email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.MAILERSEND_API_KEY}`
            },
            body: JSON.stringify(welcomeEmail)
          });

          if (emailResponse.ok) {
            console.log("Welcome email sent successfully");
          } else {
            console.error("Failed to send welcome email:", await emailResponse.text());
          }
        }
      } catch (emailError) {
        console.error("Error sending welcome email:", emailError);
        // Continue - don't fail onboarding if email fails
      }

      // Prepare response
      const responseData = {
        success: true,
        onboardingId: onboardingRecord.id,
        message: "Welcome to Dook Scoop 'Em! Your information has been received.",
        nextSteps: "Check your email for your dashboard login credentials. Our team will contact you within 24 hours to finalize your service details and schedule."
      };

      console.log("Onboarding response:", responseData);

      // Track onboarding for analytics
      console.log("=== ONBOARDING ANALYTICS ===");
      console.log("Event: customer_onboarding");
      console.log("Status: completed");
      console.log("Service frequency:", validatedData.serviceFrequency);
      console.log("Number of dogs:", validatedData.numberOfDogs);
      console.log("Zip code:", validatedData.zipCode);
      console.log("Supabase user created:", !!supabaseUserId);
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

  // Validate zip code in service area
  app.post("/api/validate-zip", async (req, res) => {
    try {
      const { zipCode } = req.body;
      
      if (!zipCode) {
        return res.status(400).json({ error: "Zip code is required" });
      }

      const isInServiceArea = await storage.isZipCodeInServiceArea(zipCode);
      res.json({ 
        isValid: isInServiceArea,
        message: isInServiceArea 
          ? "Great! We service your area." 
          : "Sorry, we don't currently service this zip code."
      });
    } catch (error) {
      console.error("Error validating zip code:", error);
      res.status(500).json({ error: "Failed to validate zip code" });
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
  app.get("/api/cms/pages", requireAdmin, async (req, res) => {
    try {
      const pages = await storage.getAllPages();
      res.json({ pages });
    } catch (error) {
      console.error("Error fetching pages:", error);
      res.status(500).json({ error: "Failed to fetch pages" });
    }
  });

  app.get("/api/cms/pages/:slug", requireAdmin, async (req, res) => {
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

  app.post("/api/cms/pages", requireAdmin, async (req, res) => {
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

  app.patch("/api/cms/pages/:id", requireAdmin, async (req, res) => {
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

  app.delete("/api/cms/pages/:id", requireAdmin, async (req, res) => {
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
  app.post("/api/cms/content", requireAdmin, async (req, res) => {
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

  app.get("/api/cms/content/:pageId", requireAdmin, async (req, res) => {
    try {
      const { pageId } = req.params;
      const content = await storage.getPageContent(pageId);
      res.json({ content });
    } catch (error) {
      console.error("Error fetching page content:", error);
      res.status(500).json({ error: "Failed to fetch content" });
    }
  });

  app.delete("/api/cms/content/:pageId/:elementId", requireAdmin, async (req, res) => {
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
  app.post("/api/cms/seo", requireAdmin, async (req, res) => {
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

  app.get("/api/cms/seo/:pageId", requireAdmin, async (req, res) => {
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
  app.put("/api/cms/content/element/:pageId/:elementId", requireAdmin, async (req, res) => {
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
  app.post("/api/cms/initialize", requireAdmin, async (req, res) => {
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
  app.get("/api/cms/media", requireAdmin, async (req, res) => {
    try {
      const assets = await storage.getAllMediaAssets();
      res.json({ assets });
    } catch (error) {
      console.error("Error fetching media assets:", error);
      res.status(500).json({ error: "Failed to fetch media assets" });
    }
  });

  app.post("/api/cms/media", requireAdmin, async (req, res) => {
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

  app.delete("/api/cms/media/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteMediaAsset(id);
      res.json({ message: "Media asset deleted successfully" });
    } catch (error) {
      console.error("Error deleting media asset:", error);
      res.status(500).json({ message: "Failed to delete media asset" });
    }
  });

  // Stripe Checkout Routes
  app.post("/api/stripe/create-checkout-session", async (req, res) => {
    try {
      const { 
        supabaseUserId,
        email, 
        plan, 
        dogCount = 1,
        customerData 
      } = req.body;

      if (!supabaseUserId || !email || !plan) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Map plan to Stripe price ID
      const priceIdMap: { [key: string]: string } = {
        weekly: STRIPE_PRICES.WEEKLY,
        biweekly: STRIPE_PRICES.BIWEEKLY,
        twice_weekly: STRIPE_PRICES.TWICE_WEEKLY,
      };

      const priceId = priceIdMap[plan];
      if (!priceId) {
        return res.status(400).json({ error: "Invalid plan selected" });
      }

      // Create or retrieve Stripe customer
      let stripeCustomerId;
      const existingCustomer = await storage.getCustomerBySupabaseId(supabaseUserId);
      
      if (existingCustomer?.stripeCustomerId) {
        stripeCustomerId = existingCustomer.stripeCustomerId;
      } else {
        const stripeCustomer = await stripe.customers.create({
          email,
          metadata: {
            supabaseUserId,
          },
        });
        stripeCustomerId = stripeCustomer.id;
      }

      // Create line items for checkout
      const lineItems = [
        {
          price: priceId,
          quantity: 1,
        },
      ];

      // Add extra dog charges if needed
      if (dogCount > 1) {
        lineItems.push({
          price: STRIPE_PRICES.EXTRA_DOG,
          quantity: dogCount - 1,
        });
      }

      // Construct base URL with HTTPS scheme for Stripe
      const baseUrl = process.env.RAILWAY_PUBLIC_DOMAIN
        ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
        : 'http://localhost:5001';

      // Create Stripe Checkout Session
      const session = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: lineItems,
        success_url: `${baseUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/onboard`,
        metadata: {
          supabaseUserId,
          plan,
          dogCount: dogCount.toString(),
          customerData: JSON.stringify(customerData),
        },
      });

      res.json({ sessionUrl: session.url, sessionId: session.id });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  });

  // Get customer subscription data
  app.get("/api/customer/subscription", requireAuth, async (req, res) => {
    try {
      const supabaseUser = (req as any).supabaseUser;
      
      if (!supabaseUser) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const customer = await storage.getCustomerBySupabaseId(supabaseUser.id);
      
      if (!customer) {
        return res.json({ hasSubscription: false });
      }

      const subscription = await storage.getSubscriptionByCustomerId(customer.id);
      
      res.json({
        hasSubscription: !!subscription,
        customer,
        subscription,
      });
    } catch (error) {
      console.error("Error fetching subscription:", error);
      res.status(500).json({ error: "Failed to fetch subscription" });
    }
  });

  // Complete checkout after Stripe success
  app.post("/api/stripe/complete-checkout", async (req, res) => {
    try {
      console.log('[Complete Checkout] Received request with body:', req.body);
      const { sessionId } = req.body;
      
      if (!sessionId) {
        console.log('[Complete Checkout] ERROR: No session ID provided');
        return res.status(400).json({ error: "Session ID required" });
      }

      console.log('[Complete Checkout] Retrieving session from Stripe:', sessionId);
      // Retrieve the session from Stripe
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      console.log('[Complete Checkout] Session retrieved:', {
        id: session.id,
        payment_status: session.payment_status,
        customer: session.customer,
        subscription: session.subscription,
        metadata: session.metadata
      });
      
      if (session.payment_status !== 'paid') {
        console.log('[Complete Checkout] ERROR: Payment not completed, status:', session.payment_status);
        return res.status(400).json({ error: "Payment not completed" });
      }

      const { supabaseUserId, plan, dogCount, customerData } = session.metadata as any;
      const parsedCustomerData = customerData ? JSON.parse(customerData) : {};

      console.log('[Complete Checkout] Metadata:', { supabaseUserId, plan, dogCount, parsedCustomerData });

      // Create or update customer in CRM
      let customer = await storage.getCustomerBySupabaseId(supabaseUserId);
      console.log('[Complete Checkout] Existing customer:', customer ? 'found' : 'not found');
      
      if (!customer) {
        console.log('[Complete Checkout] Creating new customer...');
        customer = await storage.createCustomer({
          supabaseUserId,
          stripeCustomerId: session.customer as string,
          email: parsedCustomerData.email || session.customer_details?.email,
          firstName: parsedCustomerData.firstName,
          lastName: parsedCustomerData.lastName,
          phone: parsedCustomerData.phone,
          address: parsedCustomerData.address,
          city: parsedCustomerData.city,
          state: parsedCustomerData.state,
          zipCode: parsedCustomerData.zipCode,
          gateCode: parsedCustomerData.gateCode,
          gatedCommunity: parsedCustomerData.gatedCommunity,
          gateLocation: parsedCustomerData.gateLocation,
          dogNames: parsedCustomerData.dogNames,
          numberOfDogs: parseInt(dogCount),
          notes: parsedCustomerData.propertyNotes,
          role: 'customer',
          notificationPreference: 'email',
        });
        console.log('[Complete Checkout] Customer created with ID:', customer.id);

        // Create subscription record
        console.log('[Complete Checkout] Creating subscription...');
        await storage.createSubscription({
          customerId: customer.id,
          stripeSubscriptionId: session.subscription as string,
          plan,
          status: 'active',
          dogCount: parseInt(dogCount),
        });
        console.log('[Complete Checkout] Subscription created successfully');
      }

      console.log('[Complete Checkout] Success! Returning customer:', customer.id);
      res.json({ success: true, customer });
    } catch (error) {
      console.error("[Complete Checkout] ERROR:", error);
      res.status(500).json({ error: "Failed to complete checkout", details: (error as Error).message });
    }
  });

  // ADMIN: Migrate existing Stripe customers to CRM database
  app.post("/api/admin/migrate-stripe-customers", requireAdmin, async (req, res) => {
    try {
      console.log('[Migration] Starting Stripe customer migration...');
      
      const results = {
        processed: 0,
        created: 0,
        updated: 0,
        skipped: 0,
        errors: [] as any[],
      };

      // Fetch all Supabase users for email matching
      const supabaseUsers = new Map();
      const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
      
      if (usersError) {
        throw new Error(`Failed to fetch Supabase users: ${usersError.message}`);
      }

      users.forEach(user => {
        if (user.email) {
          supabaseUsers.set(user.email.toLowerCase(), user);
        }
      });

      console.log(`[Migration] Found ${supabaseUsers.size} Supabase users`);

      // Fetch all Stripe subscriptions
      let hasMore = true;
      let startingAfter: string | undefined;

      while (hasMore) {
        const subscriptions = await stripe.subscriptions.list({
          limit: 100,
          starting_after: startingAfter,
          status: 'active',
          expand: ['data.customer'],
        });

        for (const subscription of subscriptions.data) {
          results.processed++;
          
          try {
            const stripeCustomer = subscription.customer as any;
            const email = stripeCustomer.email?.toLowerCase();

            if (!email) {
              results.errors.push({
                subscriptionId: subscription.id,
                error: 'No email found for Stripe customer',
              });
              continue;
            }

            // Match to Supabase user
            const supabaseUser = supabaseUsers.get(email);

            if (!supabaseUser) {
              results.errors.push({
                subscriptionId: subscription.id,
                email,
                error: 'No matching Supabase user found',
              });
              continue;
            }

            // Check if customer already exists
            let customer = await storage.getCustomerByStripeId(stripeCustomer.id);

            if (!customer) {
              customer = await storage.getCustomerBySupabaseId(supabaseUser.id);
            }

            if (!customer) {
              // Create new customer
              customer = await storage.createCustomer({
                supabaseUserId: supabaseUser.id,
                stripeCustomerId: stripeCustomer.id,
                email: email,
                firstName: stripeCustomer.name?.split(' ')[0] || supabaseUser.user_metadata?.firstName || '',
                lastName: stripeCustomer.name?.split(' ').slice(1).join(' ') || supabaseUser.user_metadata?.lastName || '',
                phone: stripeCustomer.phone || supabaseUser.user_metadata?.phone || '',
                address: stripeCustomer.address?.line1 || supabaseUser.user_metadata?.address || '',
                city: stripeCustomer.address?.city || supabaseUser.user_metadata?.city || '',
                state: stripeCustomer.address?.state || supabaseUser.user_metadata?.state || '',
                zipCode: stripeCustomer.address?.postal_code || supabaseUser.user_metadata?.zipCode || '',
                numberOfDogs: parseInt(subscription.metadata?.dogCount || '1'),
                role: 'customer',
                notificationPreference: 'email',
              });

              console.log(`[Migration] Created customer ${customer.id} for ${email}`);
              results.created++;
            } else {
              console.log(`[Migration] Customer ${customer.id} already exists for ${email}`);
              results.skipped++;
            }

            // Check if subscription record exists
            const existingSubscription = await storage.getSubscriptionByCustomerId(customer.id);

            if (!existingSubscription) {
              // Determine plan from price ID
              let plan = 'weekly';
              const priceId = subscription.items.data[0]?.price.id;
              
              if (priceId === process.env.STRIPE_PRICE_BIWEEKLY) plan = 'biweekly';
              else if (priceId === process.env.STRIPE_PRICE_TWICE_WEEKLY) plan = 'twice_weekly';

              await storage.createSubscription({
                customerId: customer.id,
                stripeSubscriptionId: subscription.id,
                plan,
                status: subscription.status as 'active' | 'past_due' | 'paused' | 'canceled',
                dogCount: parseInt(subscription.metadata?.dogCount || '1'),
              });

              console.log(`[Migration] Created subscription for customer ${customer.id}`);
            } else {
              console.log(`[Migration] Subscription already exists for customer ${customer.id}`);
            }

          } catch (error) {
            results.errors.push({
              subscriptionId: subscription.id,
              error: (error as Error).message,
            });
          }
        }

        hasMore = subscriptions.has_more;
        if (hasMore && subscriptions.data.length > 0) {
          startingAfter = subscriptions.data[subscriptions.data.length - 1].id;
        }
      }

      console.log('[Migration] Complete:', results);
      res.json({
        success: true,
        message: 'Migration completed',
        results,
      });

    } catch (error) {
      console.error('[Migration] Fatal error:', error);
      res.status(500).json({ 
        error: 'Migration failed', 
        details: (error as Error).message 
      });
    }
  });

  // Stripe Webhook - Handle successful payments
  app.post("/api/stripe/webhook", express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!sig || !webhookSecret) {
      return res.status(400).send('Webhook signature or secret missing');
    }

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
    }

    // Handle different event types
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;
      
      const { supabaseUserId, plan, dogCount, customerData } = session.metadata;
      const parsedCustomerData = customerData ? JSON.parse(customerData) : {};

      // Create or update customer in CRM
      let customer = await storage.getCustomerBySupabaseId(supabaseUserId);
      
      if (!customer) {
        customer = await storage.createCustomer({
          supabaseUserId,
          stripeCustomerId: session.customer,
          email: parsedCustomerData.email || session.customer_details?.email,
          firstName: parsedCustomerData.firstName,
          lastName: parsedCustomerData.lastName,
          phone: parsedCustomerData.phone,
          address: parsedCustomerData.address,
          city: parsedCustomerData.city,
          state: parsedCustomerData.state,
          zipCode: parsedCustomerData.zipCode,
          gateCode: parsedCustomerData.gateCode,
          gatedCommunity: parsedCustomerData.gatedCommunity,
          gateLocation: parsedCustomerData.gateLocation,
          numberOfDogs: parseInt(dogCount) || 1,
          dogNames: Array.isArray(parsedCustomerData.dogNames) ? parsedCustomerData.dogNames : undefined,
          notificationPreference: parsedCustomerData.notificationPreference || 'email',
          role: 'customer',
        });
      } else if (!customer.stripeCustomerId) {
        await storage.updateCustomer(customer.id, {
          stripeCustomerId: session.customer,
        });
      }

      // Create subscription record
      try {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        
        await storage.createSubscription({
          customerId: customer.id,
          stripeSubscriptionId: subscription.id,
          plan,
          dogCount: parseInt(dogCount) || 1,
          status: 'active',
          currentPeriodStart: subscription.current_period_start 
            ? new Date(subscription.current_period_start * 1000).toISOString() 
            : new Date().toISOString(),
          currentPeriodEnd: subscription.current_period_end 
            ? new Date(subscription.current_period_end * 1000).toISOString() 
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        });

        console.log('Customer and subscription created successfully');
      } catch (subError) {
        console.error('Error creating subscription:', subError);
        throw subError;
      }
    }

    res.json({ received: true });
  });

  const httpServer = createServer(app);
  return httpServer;
}
