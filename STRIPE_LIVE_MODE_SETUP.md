# Stripe Live Mode Setup Guide

This guide walks you through switching your Dook Scoop Em application from Stripe **Test Mode** to **Live Mode** (Production).

---

## Table of Contents
1. [Overview](#overview)
2. [Get Live Keys from Stripe](#step-1-get-live-keys-from-stripe)
3. [Update Local Environment](#step-2-update-local-environment)
4. [Update Railway Production](#step-3-update-railway-production)
5. [Testing Live Mode](#step-4-testing-live-mode)
6. [Troubleshooting](#troubleshooting)

---

## Overview

**Current Status:** Test Mode (using `sk_test_...` and `pk_test_...` keys)

**Goal:** Switch to Live Mode (using `sk_live_...` and `pk_live_...` keys)

**Important:**
- ⚠️ **Test cards (4242 4242 4242 4242) CANNOT be used in live mode**
- In live mode, only REAL payment methods will work
- You will be charged real money for live transactions
- Always test thoroughly in test mode before going live

---

## Step 1: Get Live Keys from Stripe

### 1.1 Switch to Live Mode
1. Go to your Stripe Dashboard: https://dashboard.stripe.com
2. In the **top right corner**, find the toggle switch
3. Switch from **"Test mode"** to **"Live mode"**
4. The interface should now show you're in live mode (no test badge)

### 1.2 Get Live API Keys
1. Navigate to: https://dashboard.stripe.com/apikeys
2. **Verify you're in Live mode** (check top right)
3. Copy your **Publishable key** (starts with `pk_live_...`)
   - Save this as: `STRIPE_PUBLISHABLE_KEY` and `VITE_STRIPE_PUBLISHABLE_KEY`
4. Click **"Reveal test key"** on the Secret key
5. Copy your **Secret key** (starts with `sk_live_...`)
   - Save this as: `STRIPE_SECRET_KEY`
6. Store these keys securely (you'll need them in the next steps)

### 1.3 Get Live Price IDs

Your products are already created in live mode. Now get each price ID:

1. Go to: https://dashboard.stripe.com/products
2. **Verify you're in Live mode**
3. Click on each product and copy its Price ID:

| Product Name | Variable Name | Price ID Format |
|-------------|---------------|-----------------|
| Weekly Poop Scooping | `STRIPE_PRICE_WEEKLY` | `price_...` |
| Bi-Weekly Poop Scooping | `STRIPE_PRICE_BIWEEKLY` | `price_...` |
| Twice-Weekly Poop Scooping | `STRIPE_PRICE_TWICE_WEEKLY` | `price_...` |
| Extra Dog | `STRIPE_PRICE_EXTRA_DOG` | `price_...` |
| Initial Cleanup - Standard | `STRIPE_PRICE_INITIAL_STANDARD` | `price_...` |
| Initial Cleanup - Heavy | `STRIPE_PRICE_INITIAL_HEAVY` | `price_...` |

**How to find Price IDs:**
- Click on each product in the list
- Scroll down to the "Pricing" section
- The price ID will be displayed (starts with `price_`)
- Copy and save each one

### 1.4 Create Live Webhook

1. Go to: https://dashboard.stripe.com/webhooks
2. **Verify you're in Live mode**
3. Click **"Add endpoint"**
4. Enter your **production domain** as the endpoint:
   ```
   https://dookscoopem.com/api/stripe/webhook
   ```
   ⚠️ **Use your custom domain (dookscoopem.com), NOT the Railway URL**

5. Click **"Select events"** and choose:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`

6. Click **"Add endpoint"**
7. On the webhook detail page, click **"Reveal"** under "Signing secret"
8. Copy the **Signing secret** (starts with `whsec_...`)
   - Save this as: `STRIPE_WEBHOOK_SECRET`

---

## Step 2: Update Local Environment

### 2.1 Backup Your Test Keys (Optional but Recommended)

Before replacing your test keys, consider saving them to a separate file like `.env.test`:

```bash
cp .env .env.test
```

### 2.2 Update .env File

Open `/Users/ryankellum/claude-proj/001/Dook-Scoop-Em/.env` and replace these values:

```env
# Stripe Configuration - LIVE MODE
STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_SECRET_KEY
STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_LIVE_WEBHOOK_SECRET
STRIPE_PRICE_WEEKLY=price_YOUR_LIVE_WEEKLY_ID
STRIPE_PRICE_BIWEEKLY=price_YOUR_LIVE_BIWEEKLY_ID
STRIPE_PRICE_TWICE_WEEKLY=price_YOUR_LIVE_TWICE_WEEKLY_ID
STRIPE_PRICE_EXTRA_DOG=price_YOUR_LIVE_EXTRA_DOG_ID
STRIPE_PRICE_INITIAL_STANDARD=price_YOUR_LIVE_INITIAL_STANDARD_ID
STRIPE_PRICE_INITIAL_HEAVY=price_YOUR_LIVE_INITIAL_HEAVY_ID

# Vite Frontend Environment Variables
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_PUBLISHABLE_KEY
```

**Replace:**
- `YOUR_LIVE_SECRET_KEY` with the `sk_live_...` key from Step 1.2
- `YOUR_LIVE_PUBLISHABLE_KEY` with the `pk_live_...` key from Step 1.2
- `YOUR_LIVE_WEBHOOK_SECRET` with the `whsec_...` secret from Step 1.4
- `YOUR_LIVE_WEEKLY_ID` etc. with the price IDs from Step 1.3

### 2.3 Restart Local Dev Server

After updating `.env`, restart your development server to load the new environment variables:

```bash
# Kill the current dev server (Ctrl+C)
# Then restart:
npm run dev
```

---

## Step 3: Update Railway Production

### 3.1 Access Railway Dashboard

1. Go to: https://railway.app
2. Navigate to your **Dook Scoop Em** project
3. Click on your **service/deployment**
4. Click on the **"Variables"** tab

### 3.2 Update Environment Variables

Add or update these environment variables in Railway:

```
STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_SECRET_KEY
STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_LIVE_WEBHOOK_SECRET
STRIPE_PRICE_WEEKLY=price_YOUR_LIVE_WEEKLY_ID
STRIPE_PRICE_BIWEEKLY=price_YOUR_LIVE_BIWEEKLY_ID
STRIPE_PRICE_TWICE_WEEKLY=price_YOUR_LIVE_TWICE_WEEKLY_ID
STRIPE_PRICE_EXTRA_DOG=price_YOUR_LIVE_EXTRA_DOG_ID
STRIPE_PRICE_INITIAL_STANDARD=price_YOUR_LIVE_INITIAL_STANDARD_ID
STRIPE_PRICE_INITIAL_HEAVY=price_YOUR_LIVE_INITIAL_HEAVY_ID
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_PUBLISHABLE_KEY
RAILWAY_PUBLIC_DOMAIN=dookscoopem.com
```

**Important:** Make sure `RAILWAY_PUBLIC_DOMAIN` is set to your custom domain (`dookscoopem.com`), not the Railway URL. This is used for checkout redirects and email links.

**Important:**
- Click **"Add Variable"** for each new variable or edit existing ones
- Double-check each value for typos
- Make sure there are no extra spaces before or after the values

### 3.3 Deploy Changes

1. Click **"Save"** in Railway
2. Railway will **automatically redeploy** with the new environment variables
3. Wait for the deployment to complete (watch the deployment logs)
4. Deployment usually takes 2-5 minutes

---

## Step 4: Testing Live Mode

### 4.1 Verify Live Mode is Active

**Local Testing:**
1. Go to `http://localhost:5001` (or your local dev URL)
2. Start the onboarding/checkout flow
3. On the Stripe Checkout page, verify:
   - ✅ **No "Test mode" badge** should appear
   - ✅ OR it should say **"Live mode"** explicitly

**Production Testing:**
1. Go to `https://dookscoopem.com`
2. Start the onboarding/checkout flow
3. Verify the same as above

### 4.2 Important: Test Cards DO NOT Work in Live Mode

⚠️ **CRITICAL INFORMATION:**

**Test cards like `4242 4242 4242 4242` WILL NOT WORK in live mode.**

In live mode:
- Only REAL credit/debit cards will work
- You WILL be charged real money
- Transactions will appear in your bank account

**To test without real charges:**
- Keep a test mode environment separate
- Use test mode keys for testing
- Only use live mode for actual customer transactions

### 4.3 Safe Testing Method

If you want to verify the checkout works without real charges:

1. **Create a $0.00 test product** in Stripe (live mode)
2. Test with that product
3. Delete it when done

OR:

1. Complete a real transaction with your own card
2. Immediately **refund it** in the Stripe dashboard
3. You'll pay Stripe fees (~2.9% + $0.30) but get the rest back

### 4.4 Verify Webhook is Working

1. Complete a test transaction (real payment)
2. Go to Stripe Dashboard → Webhooks
3. Click on your live webhook
4. Check the **"Logs"** section
5. Verify events are being received successfully

---

## Troubleshooting

### Issue: Still seeing "Test mode" on Stripe checkout

**Possible causes:**
1. Environment variables not loaded
2. Wrong keys copied
3. Server not restarted

**Solutions:**
- Verify the keys in `.env` start with `sk_live_` and `pk_live_`
- Restart your local dev server
- Check Railway deployment logs for errors
- Clear browser cache and try again

### Issue: "No such price: price_xxx" error

**Cause:** Price ID from test mode being used, or typo in price ID

**Solution:**
- Go back to Stripe Dashboard (live mode)
- Verify all price IDs are correct
- Make sure you copied price IDs from LIVE mode, not test mode
- Check for extra spaces in the environment variables

### Issue: Webhook not receiving events

**Possible causes:**
1. Webhook URL is incorrect
2. Webhook is pointing to localhost
3. Wrong webhook secret

**Solutions:**
- Verify webhook URL in Stripe matches your Railway domain
- Make sure webhook is created in LIVE mode, not test mode
- Verify `STRIPE_WEBHOOK_SECRET` matches the live webhook secret
- Check Railway logs for webhook errors

### Issue: Need to switch back to test mode

**Solution:**
1. Restore `.env.test` file (if you backed it up):
   ```bash
   cp .env.test .env
   ```
2. OR manually replace all `sk_live_` with `sk_test_` keys
3. Restart dev server
4. In Railway, switch back to test keys

---

## Checklist

Before going live, verify:

- [ ] All Stripe keys are LIVE keys (`sk_live_`, `pk_live_`)
- [ ] All 6 price IDs are from LIVE mode
- [ ] Webhook is created in LIVE mode pointing to Railway URL
- [ ] Local `.env` file updated with live keys
- [ ] Railway environment variables updated with live keys
- [ ] Railway deployment completed successfully
- [ ] Local dev server restarted
- [ ] Tested checkout flow shows NO test mode badge
- [ ] Webhook is receiving events (check Stripe logs)
- [ ] Ready to accept REAL payments

---

## Support

If you encounter issues:
1. Check Stripe Dashboard → Logs for error details
2. Check Railway deployment logs
3. Review this guide's troubleshooting section
4. Contact Stripe support: https://support.stripe.com

---

**Last Updated:** January 2026
