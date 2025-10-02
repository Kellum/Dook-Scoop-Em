import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY environment variable is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil",
  typescript: true,
});

// Price IDs from environment
export const STRIPE_PRICES = {
  WEEKLY: process.env.STRIPE_PRICE_WEEKLY!,
  BIWEEKLY: process.env.STRIPE_PRICE_BIWEEKLY!,
  TWICE_WEEKLY: process.env.STRIPE_PRICE_TWICE_WEEKLY!,
  EXTRA_DOG: process.env.STRIPE_PRICE_EXTRA_DOG!,
  INITIAL_STANDARD: process.env.STRIPE_PRICE_INITIAL_STANDARD!,
  INITIAL_HEAVY: process.env.STRIPE_PRICE_INITIAL_HEAVY!,
};

// Validate all price IDs are set
Object.entries(STRIPE_PRICES).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`STRIPE_PRICE_${key} environment variable is not set`);
  }
});
