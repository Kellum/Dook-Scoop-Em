# Next Session: Stripe Live Mode Activation

## Current Status

We have **prepared** everything for switching to Stripe live mode, but have **NOT yet updated any environment variables**.

### What's Been Completed:
- ✅ Created comprehensive guide: `STRIPE_LIVE_MODE_SETUP.md`
- ✅ Created post-launch audit checklist: `POST_LAUNCH_AUDIT.md`
- ✅ Set up Stripe live webhook in Stripe Dashboard
  - Name: "Production"
  - URL: `https://dookscoopem.com/api/stripe/webhook`
  - Events: 5 selected (checkout.session.completed, customer.subscription.updated, customer.subscription.deleted, invoice.payment_succeeded, invoice.payment_failed)
  - Description: Documents current handler implementation status
- ✅ Documented all live mode products and pricing in Stripe
- ✅ Identified missing webhook handlers (only checkout.session.completed is currently implemented)

### What Still Needs to Be Done:

#### 1. Update Local Environment Variables (.env file)
Replace test mode keys with live mode keys:
- [ ] `STRIPE_SECRET_KEY` - Change from `sk_test_...` to `sk_live_...`
- [ ] `STRIPE_PUBLISHABLE_KEY` - Change from `pk_test_...` to `pk_live_...`
- [ ] `VITE_STRIPE_PUBLISHABLE_KEY` - Change from `pk_test_...` to `pk_live_...`
- [ ] `STRIPE_WEBHOOK_SECRET` - Change to live webhook secret from Stripe Dashboard
- [ ] `STRIPE_PRICE_WEEKLY` - Update to live price ID
- [ ] `STRIPE_PRICE_BIWEEKLY` - Update to live price ID
- [ ] `STRIPE_PRICE_TWICE_WEEKLY` - Update to live price ID
- [ ] `STRIPE_PRICE_EXTRA_DOG` - Update to live price ID
- [ ] `STRIPE_PRICE_INITIAL_STANDARD` - Update to live price ID
- [ ] `STRIPE_PRICE_INITIAL_HEAVY` - Update to live price ID
- [ ] Restart local dev server after updating

#### 2. Update Railway Production Environment Variables
Same variables as above, plus:
- [ ] `RAILWAY_PUBLIC_DOMAIN=dookscoopem.com`
- [ ] Wait for Railway to redeploy

#### 3. Test Live Mode
- [ ] Verify Stripe checkout shows "Live mode" (not "Test mode")
- [ ] Complete a real transaction (will charge real money!)
- [ ] Verify webhook receives events in Stripe Dashboard logs
- [ ] Check database for customer and subscription creation

#### 4. Post-Launch Audit
Follow the checklist in `POST_LAUNCH_AUDIT.md`

---

## Important Notes

⚠️ **Test cards (4242 4242 4242 4242) will NOT work in live mode**
- Only real payment methods will work
- You will be charged real money for test transactions
- Consider using a small amount product or immediately refunding test transactions

⚠️ **Missing Webhook Handlers (URGENT)**
Currently only `checkout.session.completed` is implemented. Need to add:
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

Location: `server/routes.ts:1787`

⚠️ **Webhook Secret**
The live webhook signing secret is in Stripe Dashboard → Webhooks → Production webhook → "Signing secret (whsec_...)"

---

## Files Created This Session

1. **`STRIPE_LIVE_MODE_SETUP.md`** - Complete step-by-step guide for going live
2. **`POST_LAUNCH_AUDIT.md`** - Comprehensive audit checklist for after launch

---

## Quick Start for Next Session

**User should say:**
> "Ready to update environment variables for Stripe live mode. I have all the live keys from Stripe ready."

**Claude should:**
1. Ask user to confirm they have all live keys ready (secret key, publishable key, webhook secret, all 6 price IDs)
2. Guide user through updating `.env` file
3. Guide user through updating Railway environment variables
4. Help test the live mode setup
5. Begin post-launch audit if time permits

---

## Reference Links

- Stripe Dashboard (Live Mode): https://dashboard.stripe.com
- Stripe API Keys: https://dashboard.stripe.com/apikeys
- Stripe Products: https://dashboard.stripe.com/products
- Stripe Webhooks: https://dashboard.stripe.com/webhooks
- Railway Project: https://railway.app

---

**Session Date:** January 8, 2026
**Next Action:** Update environment variables with live Stripe keys
