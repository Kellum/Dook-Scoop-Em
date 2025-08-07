import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWaitlistSubmissionSchema } from "@shared/schema";
import nodemailer from "nodemailer";

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure nodemailer
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASS || 'your-app-password'
    }
  });

  // Waitlist submission endpoint
  app.post("/api/waitlist", async (req, res) => {
    try {
      // Validate request body
      const validatedData = insertWaitlistSubmissionSchema.parse(req.body);
      
      // Store submission
      const submission = await storage.createWaitlistSubmission(validatedData);
      
      // Send email notification
      const mailOptions = {
        from: process.env.EMAIL_USER || 'noreply@dookscoopem.com',
        to: 'kellum.ryan@gmail.com',
        subject: 'New Dook Scoop Em Waitlist Signup',
        html: `
          <h2>New Waitlist Signup</h2>
          <p><strong>Name:</strong> ${submission.name}</p>
          <p><strong>Email:</strong> ${submission.email}</p>
          <p><strong>Address:</strong> ${submission.address}</p>
          <p><strong>Phone:</strong> ${submission.phone}</p>
          <p><strong>Number of Dogs:</strong> ${submission.numberOfDogs}</p>
          <p><strong>Submitted At:</strong> ${new Date(submission.submittedAt).toLocaleString()}</p>
        `
      };

      await transporter.sendMail(mailOptions);
      
      res.json({ 
        message: "Successfully joined waitlist!", 
        id: submission.id 
      });
    } catch (error) {
      console.error("Waitlist submission error:", error);
      
      if (error.name === 'ZodError') {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
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
