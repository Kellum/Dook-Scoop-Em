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

## Phase 6: Subscription Management Implementation (Priority: HIGH)

### Overview
Customers need a way to manage their subscriptions (cancel, update payment, change plan). Two approaches available:

### Option A: Stripe Customer Portal (RECOMMENDED ✅)

**What it provides:**
- Cancel subscription
- Update payment method
- View billing history
- Download invoices
- Change subscription plan (if configured)
- Update quantity (number of dogs)

**Implementation Steps:**
1. [ ] Create portal session endpoint in `server/routes.ts`:
   ```typescript
   app.post("/api/customer/portal-session", requireAuth, async (req, res) => {
     const customer = await storage.getCustomerBySupabaseId(req.user.id);
     const session = await stripe.billingPortal.sessions.create({
       customer: customer.stripeCustomerId,
       return_url: `${baseUrl}/dashboard`,
     });
     res.json({ url: session.url });
   });
   ```

2. [ ] Add "Manage Subscription" button in customer dashboard
3. [ ] Configure Customer Portal in Stripe Dashboard:
   - Go to: Settings → Customer Portal
   - Enable features: Cancel, update payment, change plan
   - Set branding (logo, colors)
   - Configure cancellation flow (immediate vs end of period)

**Pros:**
- ✅ Quick implementation (15 minutes)
- ✅ PCI compliant (Stripe handles payment details)
- ✅ Professional UI (Stripe-designed)
- ✅ Handles all edge cases
- ✅ No ongoing maintenance

**Cons:**
- ❌ Leaves your site (Stripe branding)
- ❌ Less customization

### Option B: Custom Dashboard Management

**What you can build:**
- Custom cancel subscription UI
- Custom plan change UI
- Pause/resume functionality
- Custom logic and validations

**Implementation:**
- Requires multiple endpoints: cancel, pause, change plan, update quantity
- Requires Stripe Elements for payment method updates (PCI compliance)
- Requires webhook handling for all state changes
- More code to maintain

**When to use:**
- You need highly customized UX
- You want to stay on-brand throughout
- You have specific business logic requirements

### Recommended Hybrid Approach

**Use Stripe Portal for:**
- Cancel subscription
- Update payment method
- View billing history

**Build custom UI for:**
- Viewing current subscription details (already done)
- Viewing service schedule
- Updating service details (gate code, dog names, property notes)
- Upgrading/downgrading plans (can be custom if desired)

**Customer Email Notifications:**

Stripe automatically sends:
- ✅ Payment succeeded
- ✅ Payment failed
- ✅ Upcoming invoice (3 days before renewal)
- ✅ Receipt for each charge

Stripe does NOT automatically send:
- ❌ Subscription canceled notification (you should send this)
- ❌ Link to manage subscription (add to welcome email)

**Configuration needed:**
- Dashboard → Settings → Emails → Customer emails
- Enable desired notifications
- Customize branding (logo, colors, from address)

---

## Phase 7: Customer Dashboard Enhancement (Priority: HIGH)

### Current State Analysis

**Currently displayed (4 fields):**
- Plan type
- Number of dogs
- Subscription status
- Service address (combined)

**Available but not shown (9+ fields):**
- First name
- Last name
- Email (shown in header, not details)
- Phone number
- Gate code
- Gate location
- Gated community (yes/no)
- Dog names (optional)
- Property notes (optional)

### Data Sync Architecture

**Understanding the data flow:**

1. **Database (source of truth for service details):**
   - Stores ALL customer information
   - firstName, lastName, phone, address, gateCode, dogNames, propertyNotes, etc.
   - Updated via custom endpoints you build

2. **Stripe (source of truth for billing):**
   - Stores: email, name, stripeCustomerId, subscriptionId
   - Stores metadata: phone (optional), any custom fields
   - Updated via Stripe API or Customer Portal

3. **Supabase Auth (source of truth for login):**
   - Stores: email, password, user_metadata
   - Updated via Supabase API

**Update strategy by field type:**

| Field | Update Location | Sync Required |
|-------|----------------|---------------|
| firstName, lastName | Database → Stripe metadata | Yes (helpful for support) |
| Email | Supabase Auth → Stripe → Database | Yes (critical for billing) |
| Phone | Database → Stripe metadata | Yes (helpful for support) |
| Address, city, state, zip | Database only | No |
| Gate code, gate location, gated community | Database only | No |
| Dog names, property notes | Database only | No |
| Plan, numberOfDogs | Stripe only | Use Customer Portal |
| Payment method | Stripe only | Use Customer Portal |

### Implementation Plan

#### Step 1: Display All Customer Information
- [ ] Update `client/src/pages/dashboard/index.tsx`
- [ ] Create organized sections:
  - **Personal Information:** firstName, lastName, email, phone
  - **Service Address:** address, city, state, zipCode
  - **Access Information:** gatedCommunity, gateCode, gateLocation
  - **Pet Information:** numberOfDogs, dogNames
  - **Additional Notes:** propertyNotes
- [ ] Show "Not provided" for optional fields that are empty
- [ ] Add "Add" button for empty optional fields

#### Step 2: Create Profile Edit Functionality
- [ ] Add "Edit Profile" button to dashboard
- [ ] Create edit modal or inline editing form
- [ ] Define editable vs read-only fields:

**Editable fields:**
- ✏️ firstName, lastName
- ✏️ phone
- ✏️ address, city, state, zipCode
- ✏️ gateCode, gateLocation, gatedCommunity
- ✏️ dogNames, propertyNotes

**Read-only fields (require special handling):**
- 🔒 email (requires Supabase auth email change + verification)
- 🔒 numberOfDogs (affects pricing, use Stripe Portal)
- 🔒 plan (affects pricing, use Stripe Portal)
- 🔒 subscription status (controlled by Stripe)

#### Step 3: Create Update Endpoint
- [ ] Add `PATCH /api/customer/profile` endpoint in `server/routes.ts`:
  ```typescript
  app.patch("/api/customer/profile", requireAuth, async (req, res) => {
    const customerId = req.user.customerId;
    const allowedFields = [
      'firstName', 'lastName', 'phone', 'address', 'city', 'state',
      'zipCode', 'gateCode', 'gateLocation', 'gatedCommunity',
      'dogNames', 'propertyNotes'
    ];

    // Validate and update database
    const updatedCustomer = await storage.updateCustomer(customerId, req.body);

    // Sync name and phone to Stripe metadata
    if (req.body.firstName || req.body.lastName || req.body.phone) {
      await stripe.customers.update(updatedCustomer.stripeCustomerId, {
        name: `${updatedCustomer.firstName} ${updatedCustomer.lastName}`,
        metadata: { phone: updatedCustomer.phone }
      });
    }

    res.json({ customer: updatedCustomer });
  });
  ```

#### Step 4: Email Update Flow (Special Case)
- [ ] Create separate endpoint for email changes: `PATCH /api/customer/email`
- [ ] Requires:
  1. Update Supabase auth email (triggers verification email)
  2. Update Stripe customer email
  3. Update database customer record
- [ ] User must verify new email before it becomes active

#### Step 5: Add Missing Fields After Signup
- [ ] Allow customers to add dogNames if they skipped it
- [ ] Allow customers to add propertyNotes later
- [ ] Show "Add dog names" / "Add notes" buttons when fields are empty

### UI/UX Considerations

**Layout suggestion:**
```
┌─────────────────────────────────────────┐
│ Your Subscription                       │
│ Plan: WEEKLY | Status: ACTIVE          │
│ [Manage Subscription] (Stripe Portal)   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Personal Information         [Edit]     │
│ Name: Ryan Kellum                       │
│ Email: ryan@example.com                 │
│ Phone: (555) 123-4567                   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Service Address              [Edit]     │
│ 123 Main St                             │
│ Jacksonville, FL 32218                  │
│ Gated: Yes                              │
│ Gate Code: #1234                        │
│ Gate Location: Front entrance           │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Pet Information              [Edit]     │
│ Number of Dogs: 2                       │
│ Dog Names: Max, Bella                   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Additional Notes             [Edit]     │
│ Backyard on left side, watch for...    │
└─────────────────────────────────────────┘
```

**Validation rules:**
- Phone: Format validation (10 digits)
- Email: Format validation + uniqueness check
- Address: Required fields (street, city, state, zip)
- Gate code: Only if gatedCommunity is true
- Dog names: Optional text field

**Success feedback:**
- Show toast notification: "Profile updated successfully"
- Update UI immediately (optimistic update)
- Handle errors gracefully with specific messages

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
