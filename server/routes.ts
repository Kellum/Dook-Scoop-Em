import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWaitlistSubmissionSchema } from "@shared/schema";
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure MailerSend
  const mailerSend = new MailerSend({
    apiKey: process.env.MAILERSEND_API_KEY || '',
  });

  // Waitlist submission endpoint
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

      // Send email notification via MailerSend (when trial restrictions are resolved)
      if (process.env.MAILERSEND_API_KEY) {
        try {
          const sentFrom = new Sender("noreply@dookscoopem.com", "Dook Scoop Em");
          const recipients = [new Recipient("kellum.ryan@gmail.com", "Ryan")];
          
          const emailParams = new EmailParams()
            .setFrom(sentFrom)
            .setTo(recipients)
            .setSubject("New Dook Scoop Em Waitlist Signup")
            .setHtml(`
              <h2>New Waitlist Signup</h2>
              <p><strong>Name:</strong> ${submission.name}</p>
              <p><strong>Email:</strong> ${submission.email}</p>
              <p><strong>Address:</strong> ${submission.address}</p>
              <p><strong>Zip Code:</strong> ${submission.zipCode}</p>
              <p><strong>Phone:</strong> ${submission.phone}</p>
              <p><strong>Number of Dogs:</strong> ${submission.numberOfDogs}</p>
              <p><strong>Submitted At:</strong> ${submission.submittedAt ? new Date(submission.submittedAt).toLocaleString() : 'Unknown'}</p>
            `);

          const result = await mailerSend.email.send(emailParams);
          console.log("Email sent successfully:", result);
        } catch (emailError) {
          console.log("Email sending failed (MailerSend trial restrictions) - submission logged above");
        }
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
