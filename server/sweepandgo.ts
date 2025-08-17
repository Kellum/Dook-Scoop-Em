import { Request, Response } from "express";

// Sweep&Go API configuration
const SWEEPANDGO_BASE_URL = "https://openapi.sweepandgo.com/api";

interface WebhookPayload {
  event: string;
  data: any;
  timestamp: string;
  organization_id: string;
}

// Webhook endpoint to receive events from Sweep&Go
export const handleSweepAndGoWebhook = async (req: Request, res: Response) => {
  try {
    const payload: WebhookPayload = req.body;
    
    console.log("=== SWEEP&GO WEBHOOK RECEIVED ===");
    console.log("Event:", payload.event);
    console.log("Organization ID:", payload.organization_id);
    console.log("Timestamp:", payload.timestamp);
    console.log("Data:", JSON.stringify(payload.data, null, 2));
    console.log("=================================");

    // Process different webhook events
    switch (payload.event) {
      case "client.created":
        await handleClientCreated(payload.data);
        break;
      case "client.updated":
        await handleClientUpdated(payload.data);
        break;
      case "job.completed":
        await handleJobCompleted(payload.data);
        break;
      case "job.scheduled":
        await handleJobScheduled(payload.data);
        break;
      default:
        console.log(`Unhandled webhook event: ${payload.event}`);
    }

    // Always respond with 200 to acknowledge receipt
    res.status(200).json({ message: "Webhook received successfully" });
  } catch (error) {
    console.error("Webhook processing error:", error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
};

// Handle new client creation
async function handleClientCreated(clientData: any) {
  console.log("New client created:", clientData);
  // You can add logic here to sync with your local database
  // or trigger notifications to your team
}

// Handle client updates
async function handleClientUpdated(clientData: any) {
  console.log("Client updated:", clientData);
  // Handle client information changes
}

// Handle job completion
async function handleJobCompleted(jobData: any) {
  console.log("Job completed:", jobData);
  // You can trigger customer notifications or update billing
}

// Handle job scheduling
async function handleJobScheduled(jobData: any) {
  console.log("Job scheduled:", jobData);
  // Handle new job scheduling events
}

// Sweep&Go API helper functions
export class SweepAndGoAPI {
  private apiToken: string | undefined;
  private organizationId: string | undefined;
  private organizationSlug: string | undefined;

  constructor() {
    this.apiToken = process.env.SWEEPANDGO_API_TOKEN;
    this.organizationId = process.env.SWEEPANDGO_ORGANIZATION_ID;
    this.organizationSlug = process.env.SWEEPANDGO_ORGANIZATION_SLUG;
  }

  private getHeaders() {
    return {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...(this.apiToken && { "Authorization": `Bearer ${this.apiToken}` }),
    };
  }

  // Check if client email exists in Sweep&Go
  async checkClientEmailExists(email: string): Promise<boolean> {
    if (!this.apiToken || !this.organizationSlug) {
      console.log("Sweep&Go API not configured - skipping email check");
      return false;
    }

    try {
      const url = `${SWEEPANDGO_BASE_URL}/v2/client_on_boarding/check_client_email_exists`;
      const response = await fetch(url, {
        method: "GET",
        headers: this.getHeaders(),
        body: JSON.stringify({
          organization: this.organizationSlug,
          email: email,
        }),
      });

      if (!response.ok) {
        console.error("Sweep&Go email check failed:", response.statusText);
        return false;
      }

      const data = await response.json();
      return data.exists || false;
    } catch (error) {
      console.error("Error checking client email:", error);
      return false;
    }
  }

  // Get pricing for client onboarding
  async getPricing(params: {
    lastCleanedTimeframe: string;
    frequency: string;
    numberOfDogs: number;
    zipCode: string;
  }): Promise<any> {
    if (!this.apiToken || !this.organizationSlug) {
      console.log("Sweep&Go API not configured - skipping pricing");
      return null;
    }

    try {
      const queryParams = new URLSearchParams({
        organization: this.organizationSlug,
        last_time_yard_was_thoroughly_cleaned: params.lastCleanedTimeframe,
        clean_up_frequency: params.frequency,
        number_of_dogs: params.numberOfDogs.toString(),
        zip_code: params.zipCode,
      });

      const url = `${SWEEPANDGO_BASE_URL}/v2/client_on_boarding/price_registration_form?${queryParams}`;
      const response = await fetch(url, {
        method: "GET",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        console.error("Sweep&Go pricing failed:", response.statusText);
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error("Error getting pricing:", error);
      return null;
    }
  }

  // Create a new client in Sweep&Go (when API allows)
  async createClient(clientData: any): Promise<any> {
    if (!this.apiToken) {
      console.log("Sweep&Go API not configured - skipping client creation");
      return null;
    }

    try {
      // This endpoint may vary based on Sweep&Go's API documentation
      const url = `${SWEEPANDGO_BASE_URL}/v2/clients`;
      const response = await fetch(url, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(clientData),
      });

      if (!response.ok) {
        console.error("Sweep&Go client creation failed:", response.statusText);
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating client:", error);
      return null;
    }
  }
}

export const sweepAndGoAPI = new SweepAndGoAPI();