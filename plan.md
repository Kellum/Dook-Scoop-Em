# Dook Scoop 'Em - Next Steps Plan

**Goal:** Fully test and verify all features before connecting custom domain from Porkbun

**Current Status:** ✅ Site deployed to Railway and basic functionality working

---

## Phase 1: Data Migration & Verification (Priority: HIGH)

### 1.1 Import Remaining Production Data
- [ ] Import all waitlist submissions from backup
- [ ] Import all quote requests from backup
- [ ] Import all onboarding submissions
- [ ] Import customer data (if any exists)
- [ ] Verify data integrity after import

**Why:** Need real data to properly test all features and admin workflows

**How:**
- Use the `import-data.js` script as template
- Add more INSERT statements for each table
- Run: `node import-data.js`

---

## Phase 2: Feature Testing (Priority: HIGH)

### 2.1 Test Customer-Facing Features
- [ ] Test zip code validation (already working ✓)
- [ ] Test waitlist signup form
- [ ] Test quote request form
- [ ] Test onboarding/signup flow
- [ ] Test customer login (Supabase auth)
- [ ] Test customer dashboard (if they can access subscription info)

### 2.2 Test Admin Features
- [ ] Login to admin dashboard (credentials: admin / admin123)
- [ ] View waitlist submissions
- [ ] View quote requests
- [ ] View customers
- [ ] Test admin CRUD operations (create, read, update, delete)
- [ ] Test service location management
- [ ] Test CMS features (if used)

### 2.3 Test Payment Flow (CRITICAL)
- [ ] Test Stripe checkout process
- [ ] Verify all 6 price IDs work correctly:
  - Weekly subscription
  - Bi-weekly subscription
  - Twice-weekly subscription
  - Extra dog add-on
  - Initial standard cleanup
  - Initial heavy cleanup
- [ ] Test subscription creation
- [ ] Test webhook handling (stripe webhook endpoint)
- [ ] Verify payments show in Stripe dashboard

**Note:** Use Stripe test mode for testing!

### 2.4 Test Email Delivery
- [ ] Test welcome emails (MailerSend)
- [ ] Test quote request confirmation emails
- [ ] Test waitlist confirmation emails
- [ ] Verify email templates render correctly

### 2.5 Test Sweep&Go Integration (if applicable)
- [ ] Test API connection to Sweep&Go
- [ ] Test customer creation in Sweep&Go
- [ ] Verify data sync between systems

---

## Phase 3: Bug Fixes & Polish (Priority: MEDIUM)

### 3.1 Fix Any Errors Found During Testing
- [ ] Document all errors/issues found
- [ ] Prioritize by severity
- [ ] Fix critical bugs first
- [ ] Re-test after fixes

### 3.2 Performance & UX Improvements
- [ ] Test site speed/performance
- [ ] Check mobile responsiveness
- [ ] Verify all forms validate correctly
- [ ] Check error messages are user-friendly
- [ ] Test browser compatibility (Chrome, Safari, Firefox)

### 3.3 Security Check
- [ ] Verify admin routes require authentication
- [ ] Check customer data is protected
- [ ] Ensure sensitive data not exposed in logs
- [ ] Verify Stripe webhook signature validation

---

## Phase 4: Production Readiness (Priority: MEDIUM)

### 4.1 Environment Verification
- [ ] Verify all Railway environment variables are correct
- [ ] Check production vs test API keys (Stripe, MailerSend)
- [ ] Ensure proper error handling/logging
- [ ] Set up monitoring/alerts (optional)

### 4.2 Documentation
- [ ] Document any custom admin workflows
- [ ] Create user guide for admin features (if needed)
- [ ] Update README with deployment info
- [ ] Document any known limitations

### 4.3 Backup & Recovery
- [ ] Set up automated database backups (Supabase handles this)
- [ ] Document recovery procedures
- [ ] Test database restore process

---

## Phase 5: Domain Connection (Priority: LOW - Do Last)

**Only proceed when all above phases complete!**

### 5.1 Railway Domain Setup
- [ ] Go to Railway → Service → Settings → Networking
- [ ] Click "Add Domain"
- [ ] Enter your Porkbun domain (e.g., `dookscoop.com`)
- [ ] Note the DNS records Railway provides

### 5.2 Porkbun DNS Configuration
- [ ] Login to Porkbun
- [ ] Go to domain DNS settings
- [ ] Add CNAME or A records from Railway
- [ ] Wait for DNS propagation (can take 24-48 hours)

### 5.3 SSL Certificate
- [ ] Verify Railway auto-generates SSL certificate
- [ ] Test HTTPS works on custom domain
- [ ] Redirect HTTP to HTTPS

### 5.4 Final Testing on Custom Domain
- [ ] Test all features again on custom domain
- [ ] Update any hardcoded URLs (if any)
- [ ] Test Stripe webhooks with new domain
- [ ] Update Stripe webhook URL if needed

---

## Quick Command Reference

```bash
# Start local dev server
npm run dev

# Push schema changes to database
npm run db:push

# Import data
node import-data.js

# Check Railway logs
# Go to Railway dashboard → Deployments → View logs

# View local site
http://localhost:5001

# View Railway site
https://dook-scoop-em-production.up.railway.app
```

---

## Important Notes

- **Admin Login:** Username `admin`, Password `admin123`
- **Database:** Supabase PostgreSQL (pooler connection)
- **Stripe:** Currently using TEST mode - switch to LIVE when ready
- **Railway:** Auto-deploys on GitHub push to main branch
- **Service Areas:** Currently active for zip codes: 32218, 32226, 32256, 32257, 32258, 33101, 33102, 32097

---

## When to Connect Domain

✅ **Connect domain when:**
- All features tested and working
- All critical bugs fixed
- Payment flow verified end-to-end
- Email delivery confirmed
- You're confident in production readiness

❌ **Don't connect domain if:**
- Major features aren't working
- Critical bugs exist
- Payment processing not verified
- Email system not tested

---

## Questions to Answer Before Going Live

1. Are all Stripe price IDs for LIVE mode (not test mode)?
2. Is MailerSend configured for production sending (not sandbox)?
3. Have you tested the full customer journey end-to-end?
4. Do you have a support email/phone ready for customer inquiries?
5. Is the admin dashboard fully functional?

---

**Last Updated:** 2025-10-08
**Status:** Phase 1 & 2 Ready to Begin
