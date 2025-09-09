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
    
    // Log configuration status (without exposing sensitive data)
    console.log("Sweep&Go API Configuration:");
    console.log("- API Token:", this.apiToken ? "✓ Configured" : "✗ Missing");
    console.log("- Organization ID:", this.organizationId ? "✓ Configured" : "✗ Missing");
    console.log("- Organization Slug:", this.organizationSlug ? "✓ Configured" : "✗ Missing");
  }

  isConfigured(): boolean {
    return !!(this.apiToken && this.organizationId && this.organizationSlug);
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
      // Try multiple possible endpoint formats
      const endpoints = [
        // Original format
        {
          url: `${SWEEPANDGO_BASE_URL}/v2/client_on_boarding/check_client_email_exists`,
          params: { organization: this.organizationSlug, email: email }
        },
        // Alternative format 1
        {
          url: `${SWEEPANDGO_BASE_URL}/v2/clients/check_email`,
          params: { organization: this.organizationSlug, email: email }
        },
        // Alternative format 2  
        {
          url: `${SWEEPANDGO_BASE_URL}/v1/clients/email_exists`,
          params: { organization_slug: this.organizationSlug, email: email }
        }
      ];

      for (const endpoint of endpoints) {
        try {
          const queryParams = new URLSearchParams(endpoint.params);
          const url = `${endpoint.url}?${queryParams}`;
          
          console.log(`Trying email check endpoint: ${url}`);
          
          const response = await fetch(url, {
            method: "GET",
            headers: this.getHeaders(),
          });

          if (response.ok) {
            const data = await response.json();
            console.log(`Email check successful: ${email} exists:`, data.exists || false);
            return data.exists || false;
          } else {
            const errorText = await response.text();
            console.log(`Endpoint ${endpoint.url} failed: ${response.status} ${response.statusText}`, errorText);
          }
        } catch (endpointError) {
          console.log(`Endpoint ${endpoint.url} error:`, endpointError);
          continue;
        }
      }

      console.error("All email check endpoints failed for:", email);
      return false;
    } catch (error) {
      console.error("Error checking client email:", error);
      return false;
    }
  }

  // Get pricing for client onboarding
  async getPricing(params: {
    frequency: string;
    numberOfDogs: number;
    zipCode: string;
    lastCleanedTimeframe: string;
  }): Promise<any> {
    if (!this.apiToken || !this.organizationSlug) {
      console.log("Sweep&Go API not configured - skipping pricing");
      return null;
    }

    try {
      // Map frequency values to match Sweep&Go API expectations (from official docs)
      const frequencyMap: Record<string, string> = {
        "weekly": "once_a_week",
        "twice_weekly": "two_times_a_week", // ✅ Correct API value from docs
        "one_time": "one_time"
      };

      const queryParams = new URLSearchParams({
        organization: this.organizationSlug,
        clean_up_frequency: frequencyMap[params.frequency] || params.frequency,
        number_of_dogs: params.numberOfDogs.toString(),
        zip_code: params.zipCode,
        // Use the actual user input for when yard was last cleaned
        last_time_yard_was_thoroughly_cleaned: params.lastCleanedTimeframe
      });

      const url = `${SWEEPANDGO_BASE_URL}/v2/client_on_boarding/price_registration_form?${queryParams}`;
      
      console.log("Sweep&Go pricing request URL:", url);
      console.log("Pricing parameters:", {
        organization: this.organizationSlug,
        clean_up_frequency: frequencyMap[params.frequency] || params.frequency,
        number_of_dogs: params.numberOfDogs.toString(),
        zip_code: params.zipCode,
        last_time_yard_was_thoroughly_cleaned: params.lastCleanedTimeframe
      });

      const response = await fetch(url, {
        method: "GET",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Sweep&Go pricing failed:", response.status, response.statusText, errorText);
        return { error: `API Error ${response.status}: ${response.statusText}`, details: errorText };
      }

      const data = await response.json();
      console.log("Sweep&Go pricing response:", data);
      return data;
    } catch (error) {
      console.error("Error getting pricing:", error);
      return { error: error instanceof Error ? error.message : "Unknown error" };
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

  // Full customer onboarding with payment through Sweep&Go
  async onboardCustomer(onboardingData: {
    firstName: string;
    lastName: string;
    email: string;
    homeAddress: string;
    city: string;
    state: string;
    zipCode: string;
    homePhone?: string;
    cellPhone: string;
    numberOfDogs: number;
    serviceFrequency: string;
    lastCleanedTimeframe: string;
    initialCleanupRequired: boolean;
    
    // New Sweep&Go specific fields
    cleanupNotificationType?: string;
    cleanupNotificationChannel?: string;
    gatedCommunity?: string;
    gateLocation?: string;
    dogNames?: string[];
    
    // Legacy fields for compatibility
    notificationType: string;
    notificationChannel: string;
    howHeardAboutUs?: string;
    additionalComments?: string;
    nameOnCard: string;
    creditCardToken: string;
    cvv: string;
    postal: string;
    expiry: string;
  }): Promise<any> {
    if (!this.apiToken) {
      console.log("Sweep&Go API not configured - skipping onboarding");
      return { error: "API not configured" };
    }

    try {
      const url = `${SWEEPANDGO_BASE_URL}/v1/residential/onboarding`;
      
      console.log("=== DEBUGGING SWEEP&GO DATA MAPPING ===");
      console.log("Received cleanupNotificationType:", onboardingData.cleanupNotificationType);
      console.log("Received cleanupNotificationChannel:", onboardingData.cleanupNotificationChannel);
      console.log("Received gatedCommunity:", onboardingData.gatedCommunity);
      console.log("Received gateLocation:", onboardingData.gateLocation);
      console.log("Received dogNames:", onboardingData.dogNames);
      console.log("=======================================");
      
      const payload = {
        zip_code: onboardingData.zipCode,
        number_of_dogs: onboardingData.numberOfDogs,
        last_time_yard_was_thoroughly_cleaned: onboardingData.lastCleanedTimeframe,
        clean_up_frequency: onboardingData.serviceFrequency,
        first_name: onboardingData.firstName,
        last_name: onboardingData.lastName,
        email: onboardingData.email,
        city: onboardingData.city,
        home_address: onboardingData.homeAddress,
        state: onboardingData.state,
        home_phone_number: onboardingData.homePhone || "",
        cell_phone_number: onboardingData.cellPhone,
        initial_cleanup_required: onboardingData.initialCleanupRequired ? "true" : "false",
        
        // Use new Sweep&Go API fields when available, fallback to legacy fields
        cleanup_notification_type: onboardingData.cleanupNotificationType || onboardingData.notificationType,
        cleanup_notification_channel: onboardingData.cleanupNotificationChannel || onboardingData.notificationChannel,
        gated_community: onboardingData.gatedCommunity || "",
        gate_location: onboardingData.gateLocation || "",
        dog_name: onboardingData.dogNames || [], // Array field for dog names
        
        how_heard_about_us: onboardingData.howHeardAboutUs || "Website",
        additional_comment: onboardingData.additionalComments || "",
        credit_card_token: onboardingData.creditCardToken,
        name_on_card: onboardingData.nameOnCard,
        cvv: onboardingData.cvv,
        postal: onboardingData.postal,
        expiry: onboardingData.expiry,
      };

      console.log("Sweep&Go onboarding request:", JSON.stringify(payload, null, 2));

      const response = await fetch(url, {
        method: "PUT",
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        console.error("Sweep&Go onboarding failed:", response.status, response.statusText, responseData);
        return { 
          error: `Onboarding failed: ${response.status} ${response.statusText}`, 
          details: responseData 
        };
      }

      console.log("Sweep&Go onboarding successful:", responseData);
      return responseData;
    } catch (error) {
      console.error("Error during onboarding:", error);
      return { error: error instanceof Error ? error.message : "Unknown error" };
    }
  }
}

export const sweepAndGoAPI = new SweepAndGoAPI();