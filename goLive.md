# Go Live Checklist - Switch from Test to Live Mode

This guide will help you switch from Stripe TEST mode to LIVE mode to accept real payments.

## Current Status
- ✅ Production site deployed: https://dook-scoop-em-production.up.railway.app
- ✅ TEST mode webhooks working
- ✅ Customer onboarding functional
- ✅ Admin dashboard operational

---

## Step 1: Get Live Stripe Keys

1. Go to **Stripe Dashboard**: https://dashboard.stripe.com
2. **Switch to LIVE mode** (toggle in top right corner)
3. Navigate to: **Developers → API Keys**
4. Copy these keys:
   - ✅ **Publishable key** (starts with `pk_live_`)
   - ✅ **Secret key** (starts with `sk_live_`)

**Save these somewhere safe - you'll need them for Railway.**

---

## Step 2: Create Live Stripe Products & Prices

You need to recreate your subscription products in LIVE mode:

1. Go to: **Dashboard → Products** (make sure you're in LIVE mode)
2. Click **"+ Add product"** for each plan:

### Product 1: Weekly Service
- Name: `Weekly Dog Waste Removal`
- Description: `Once a week professional pet waste removal`
- Pricing: `$110/month` recurring
- **Copy the price ID** (starts with `price_`) → Save as `STRIPE_PRICE_WEEKLY`

### Product 2: Bi-Weekly Service
- Name: `Bi-Weekly Dog Waste Removal`
- Description: `Every other week professional pet waste removal`
- Pricing: `$90/month` recurring
- **Copy the price ID** → Save as `STRIPE_PRICE_BIWEEKLY`

### Product 3: Twice Weekly Service
- Name: `Twice Weekly Dog Waste Removal`
- Description: `Twice a week professional pet waste removal`
- Pricing: `$136/month` recurring
- **Copy the price ID** → Save as `STRIPE_PRICE_TWICE_WEEKLY`

### Product 4: Extra Dog Add-on
- Name: `Extra Dog Add-on`
- Description: `Additional charge per extra dog`
- Pricing: `$10/month` recurring (or your preferred price)
- **Copy the price ID** → Save as `STRIPE_PRICE_EXTRA_DOG`

### Product 5: Initial Standard Cleanup
- Name: `Initial Standard Cleanup`
- Description: `One-time standard initial cleanup`
- Pricing: One-time charge (set your price)
- **Copy the price ID** → Save as `STRIPE_PRICE_INITIAL_STANDARD`

### Product 6: Initial Heavy Cleanup
- Name: `Initial Heavy Cleanup`
- Description: `One-time heavy initial cleanup`
- Pricing: One-time charge (set your price)
- **Copy the price ID** → Save as `STRIPE_PRICE_INITIAL_HEAVY`

---

## Step 3: Create Live Webhook

1. Go to: **Dashboard → Developers → Webhooks** (LIVE mode)
2. Click **"+ Add endpoint"**
3. **Endpoint URL:**
   ```
   https://dook-scoop-em-production.up.railway.app/api/stripe/webhook
   ```
4. **Description:** `Production webhook (live mode)`
5. **Events to send:** Select these:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
6. Click **"Add endpoint"**
7. Click on the new endpoint → **"Signing secret"** → **"Reveal"**
8. **Copy the webhook secret** (starts with `whsec_`) → Save as `STRIPE_WEBHOOK_SECRET`

---

## Step 4: Update Railway Environment Variables

1. Go to: **Railway Dashboard** → Your Project → **Variables**
2. Update/add these variables with your LIVE values:

### Stripe Live Keys
```bash
STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_SECRET_KEY
STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_LIVE_WEBHOOK_SECRET
```

### Stripe Live Price IDs
```bash
STRIPE_PRICE_WEEKLY=price_YOUR_LIVE_WEEKLY_PRICE_ID
STRIPE_PRICE_BIWEEKLY=price_YOUR_LIVE_BIWEEKLY_PRICE_ID
STRIPE_PRICE_TWICE_WEEKLY=price_YOUR_LIVE_TWICE_WEEKLY_PRICE_ID
STRIPE_PRICE_EXTRA_DOG=price_YOUR_LIVE_EXTRA_DOG_PRICE_ID
STRIPE_PRICE_INITIAL_STANDARD=price_YOUR_LIVE_INITIAL_STANDARD_PRICE_ID
STRIPE_PRICE_INITIAL_HEAVY=price_YOUR_LIVE_INITIAL_HEAVY_PRICE_ID
```

### Frontend Live Key (Vite requires VITE_ prefix)
```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_PUBLISHABLE_KEY
```

---

## Step 5: Verify Other Environment Variables

Make sure these are still correct in Railway:

```bash
# Database
DATABASE_URL=postgresql://postgres.aslrkvulkxzwlmjlipfd:...@aws-1-us-east-2.pooler.supabase.com:6543/postgres

# Supabase (make sure these are FULL keys, not truncated)
SUPABASE_URL=https://aslrkvulkxzwlmjlipfd.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzbHJrdnVsa3h6d2xtamxpcGZkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTQ5NTA5MywiZXhwIjoyMDc1MDcxMDkzfQ.lknDq8qUa1NeVO52HkLbKgbETbUqISZ-rWP8fUDMUnk
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzbHJrdnVsa3h6d2xtamxpcGZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0OTUwOTMsImV4cCI6MjA3NTA3MTA5M30.hQO-qZLY32lBSPE5u5V3pJYiCy6hj9ZiZT_sQpLFGO8

# Frontend Supabase
VITE_SUPABASE_URL=https://aslrkvulkxzwlmjlipfd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzbHJrdnVsa3h6d2xtamxpcGZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0OTUwOTMsImV4cCI6MjA3NTA3MTA5M30.hQO-qZLY32lBSPE5u5V3pJYiCy6hj9ZiZT_sQpLFGO8

# Email
MAILERSEND_API_KEY=mlsn.95d517e34fd4743f3bed87733500baf38c11f568091c02794d1c541
MAILERSEND_SMTP_USER=MS_25sLn9@test-xkjn41mjy1p4z781.mlsender.net
MAILERSEND_SMTP_PASS=mssp.OHaRyQq.351ndgw91154zqx8.lxnO0Re

# Auth
JWT_SECRET=ykD8A7UoG+3tW7Cyp4tMK9KQPWrdVfO3dG+dI29hynflZV5paotmi0VLsRPwg4R8vmcI
SESSION_SECRET=ykD8A7UoG+3tW7Cyp4tMK9KQPWrdVfO3dG+dI29hynflZV5paotmi0VLsRPwg4R8

# Environment
NODE_ENV=production
```

---

## Step 6: Deploy Changes

Railway will auto-redeploy when you update environment variables.

**Check deployment status:**
1. Go to Railway → Deployments tab
2. Wait for "Active" status (green)
3. Check logs for any errors

**OR manually trigger redeploy:**
```bash
cd /Users/ryankellum/claude-proj/001/Dook-Scoop-Em
git commit --allow-empty -m "Trigger redeploy for live mode"
git push
```

---

## Step 7: Test with Real Payment

⚠️ **IMPORTANT: This will charge a REAL credit card!**

1. Go to: https://dook-scoop-em-production.up.railway.app/onboard
2. Fill out the form with **real information**
3. Use a **REAL credit card** (not test card 4242...)
4. Complete checkout
5. **Verify in Stripe Dashboard (LIVE mode):**
   - Customer created
   - Subscription active
   - Payment succeeded
6. **Verify in your database:**
   - Customer record created
   - Subscription record created
7. **Login to customer dashboard:**
   - Should see subscription details
8. **Login to admin dashboard:**
   - Should see the customer

---

## Step 8: Monitor Live Webhooks

After going live, monitor your webhooks:

1. Go to: https://dashboard.stripe.com/webhooks (LIVE mode)
2. Click on your webhook endpoint
3. Check that events are being delivered successfully (green checkmarks)
4. If any fail, check Railway logs for errors

---

## Rollback Plan (If Something Goes Wrong)

If you need to rollback to TEST mode:

1. Go to Railway → Variables
2. Change all Stripe keys back to TEST mode:
   - `STRIPE_SECRET_KEY=sk_test_...`
   - `STRIPE_PUBLISHABLE_KEY=pk_test_...`
   - `VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...`
   - `STRIPE_WEBHOOK_SECRET=whsec_...` (test webhook secret)
   - All price IDs back to test mode
3. Railway will auto-redeploy
4. Site returns to test mode

---

## Post-Launch Checklist

After going live:

- ✅ Test a real customer signup
- ✅ Verify webhook is working (check Stripe events)
- ✅ Monitor Railway logs for errors
- ✅ Test admin dashboard access
- ✅ Verify customer can log in and see subscription
- ✅ Set up Stripe email receipts (Dashboard → Settings → Emails)
- ✅ Set up Stripe billing portal (Dashboard → Settings → Customer portal)
- ✅ Monitor first few days for any issues

---

## Common Issues & Fixes

### Issue: "Invalid API Key"
- **Fix:** Verify `STRIPE_SECRET_KEY` in Railway is correct live key
- Make sure it starts with `sk_live_` (not `sk_test_`)

### Issue: Webhook not firing
- **Fix:** Check Stripe Dashboard → Webhooks → Your endpoint → Webhook attempts
- Verify endpoint URL is correct
- Check Railway logs for errors

### Issue: Customer sees "Pick a plan" after payment
- **Fix:** Webhook didn't create subscription record
- Check Stripe webhook delivery status
- Check Railway logs for database errors

### Issue: Can't create Stripe checkout
- **Fix:** Price IDs are wrong
- Verify all 6 price IDs in Railway match your LIVE products

---

## Support

If you run into issues:
1. Check Railway logs: Railway → Deployments → View Logs
2. Check Stripe events: https://dashboard.stripe.com/events
3. Check webhook delivery: https://dashboard.stripe.com/webhooks

---

## Summary: What Changes

| Setting | Test Mode | Live Mode |
|---------|-----------|-----------|
| Secret Key | `sk_test_...` | `sk_live_...` |
| Publishable Key | `pk_test_...` | `pk_live_...` |
| Webhook Secret | Test webhook secret | Live webhook secret |
| Price IDs | Test prices | Live prices |
| Payments | Fake (test cards) | Real (real cards) |
| Customers | Test data | Real customers |

---

**That's it!** Once you update the keys, you're live and ready to accept real customers! 🎉
