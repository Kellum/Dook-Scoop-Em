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
      
      // Send email notification via MailerSend
      if (process.env.MAILERSEND_API_KEY) {
        try {
          console.log("Attempting to send email to:", "kellum.ryan@gmail.com");
          
          // Use the trial domain that should work with your account
          const sentFrom = new Sender("trial@trial-pxkjn41rz7z4z781.mlsender.net", "Dook Scoop Em");
          const recipients = [new Recipient("kellum.ryan@gmail.com", "Ryan Kellum")];
          
          const emailParams = new EmailParams()
            .setFrom(sentFrom)
            .setTo(recipients)
            .setSubject("New Dook Scoop Em Waitlist Signup")
            .setHtml(`
              <h2>New Waitlist Signup</h2>
              <p><strong>Name:</strong> ${submission.name}</p>
              <p><strong>Email:</strong> ${submission.email}</p>
              <p><strong>Address:</strong> ${submission.address}</p>
              <p><strong>Phone:</strong> ${submission.phone}</p>
              <p><strong>Number of Dogs:</strong> ${submission.numberOfDogs}</p>
              <p><strong>Submitted At:</strong> ${submission.submittedAt ? new Date(submission.submittedAt).toLocaleString() : 'Unknown'}</p>
            `)
            .setText(`
              New Waitlist Signup
              
              Name: ${submission.name}
              Email: ${submission.email}
              Address: ${submission.address}
              Phone: ${submission.phone}
              Number of Dogs: ${submission.numberOfDogs}
              Submitted At: ${submission.submittedAt ? new Date(submission.submittedAt).toLocaleString() : 'Unknown'}
            `);

          const result = await mailerSend.email.send(emailParams);
          console.log("Email sent successfully:", result);
        } catch (emailError) {
          console.error("Email sending failed:", emailError);
          // Continue without failing the request - submission is still saved
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
