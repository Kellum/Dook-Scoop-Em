# Dook Scoop 'Em - Testing Summary Quick Reference

## Project Stack
- **Frontend**: React 18.3, TypeScript, Tailwind CSS, Wouter routing
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **Auth**: Supabase Auth with JWT
- **Payments**: Stripe (subscriptions, checkout, webhooks)
- **Email**: MailerSend API + SMTP fallback
- **Analytics**: Google Analytics, Facebook Pixel

---

## Routes Summary

### Public Routes (24 total)
```
Home Page               /
Sign In               /sign-in
Sign Up               /sign-up
Residential           /residential
Commercial            /commercial
About Us              /about-us
Blog                  /blog
Products We Use       /products-we-use
Contact Form          /contact
Service Locations     /locations, /locations-neu, /locations-duke
Waitlist Hub          /waitlist
Waitlist Regions      /waitlist/northJax-yulee-dina
                      /waitlist/eastJax-beaches
Onboarding            /onboard, /onboard-survey, /onboard-new, /onboard-original
Landing Variants      /landing, /landing-minimal, /landing-minimal-eastjax, /landing-duke
Legacy Pages          /home
Not Found             (catch-all route)
```

### Protected Customer Routes (5 total)
```
Dashboard Home        /dashboard (requireAuth)
Subscription          /dashboard/subscription (requireAuth)
Schedule              /dashboard/schedule (requireAuth)
Billing               /dashboard/billing (requireAuth)
Settings              /dashboard/settings (requireAuth)
```

### Protected Admin Routes (7 total)
```
Admin Home            /admin (requireAdmin)
Service Areas         /admin/service-areas (requireAdmin)
Customers             /admin/customers (requireAdmin)
Schedule              /admin/schedule (requireAdmin)
Settings              /admin/settings (requireAdmin)
Migrate Customers     /admin/migrate-customers (requireAdmin)
CMS Dashboard         /admin/cms-dashboard (mentioned, requireAdmin)
```

---

## API Endpoints Summary (40+ total)

### Public Endpoints (6)
```
POST   /api/contact                      Contact form submission
POST   /api/quote                        Quote request
POST   /api/waitlist                     Waitlist signup
POST   /api/onboard                      Customer onboarding
POST   /api/validate-coupon              Coupon validation
POST   /api/validate-zip                 Zip code service area check
GET    /api/locations                    Get service locations
GET    /api/notifications                Get waitlist notifications
```

### Authenticated Endpoints (1)
```
GET    /api/customer/subscription        Get customer subscription data
```

### Stripe Payment Endpoints (3)
```
POST   /api/stripe/create-checkout-session    Create Stripe checkout
POST   /api/stripe/complete-checkout         Complete payment
POST   /api/stripe/webhook                   Stripe webhook handler
```

### Admin Endpoints (30+)
```
Management:
GET    /api/admin/stats                  Dashboard statistics
GET    /api/admin/customers              List all customers
GET    /api/admin/locations              List service areas
POST   /api/admin/locations              Create service area
PATCH  /api/admin/locations/:id          Update service area
DELETE /api/admin/locations/:id          Delete service area

Waitlist:
GET    /api/admin/waitlist               Active waitlist entries
GET    /api/admin/waitlist/archived      Archived waitlist
PATCH  /api/admin/waitlist/:id/archive   Archive entry
DELETE /api/admin/waitlist/:id           Delete entry

Quotes:
GET    /api/admin/quotes                 List quotes
PATCH  /api/admin/quotes/:id/status      Update quote status
PATCH  /api/admin/quotes/:id/notes       Add quote notes
DELETE /api/admin/quotes/:id             Delete quote

Admin Users:
POST   /api/admin/create-supabase-admin  Create admin user

Stripe Migration:
POST   /api/admin/migrate-stripe-customers   Migrate Stripe customers

CMS Pages:
GET    /api/cms/pages                    List pages
GET    /api/cms/pages/:slug              Get page with content/SEO
POST   /api/cms/pages                    Create page
PATCH  /api/cms/pages/:id                Update page
DELETE /api/cms/pages/:id                Delete page

CMS Content:
POST   /api/cms/content                  Update content block
GET    /api/cms/content/:pageId          Get page content
DELETE /api/cms/content/:pageId/:elementId   Delete content block
PUT    /api/cms/content/element/:pageId/:elementId   Update element
GET    /api/cms/content/:slug            Get public page content

SEO:
POST   /api/cms/seo                      Update SEO settings
GET    /api/cms/seo/:pageId              Get SEO settings

Media:
GET    /api/cms/media                    List media assets
POST   /api/cms/media                    Create media asset
DELETE /api/cms/media/:id                Delete media asset

CMS Init:
POST   /api/cms/initialize               Initialize CMS with defaults
```

---

## Database Tables (13 total)

### Authentication & User Management
- **users** - Legacy user table (username/password)
- **customers** - CRM customer records (Supabase user ID, Stripe customer ID, contact info)

### Subscription Management
- **subscriptions** - Active subscriptions (plan, dog count, status)
- **visits** - Scheduled service visits
- **charges** - Payment transactions

### Content Management
- **pages** - CMS pages (slug, title, status)
- **page_content** - Page content blocks (elementId, contentType)
- **seo_settings** - SEO metadata per page
- **media_assets** - Uploaded images/media

### Forms & Requests
- **waitlist_submissions** - Waitlist signups (status: active/archived)
- **quote_requests** - Quote requests (status: new/contacted/quoted/converted/lost)
- **onboarding_submissions** - Customer onboarding records (status: pending/completed/failed)
- **service_locations** - Service areas with zip codes

---

## Key Features to Test (35+ features)

### Authentication & Access Control
- Customer login/signup
- Admin login with role verification
- Protected route enforcement
- Role-based access (customer vs admin)
- Session persistence
- Logout functionality

### Onboarding & Quote Flow
- Quote form submission & validation
- Waitlist form submission & validation
- Customer onboarding survey
- Supabase user creation during onboarding
- Welcome email with temp password
- Zip code validation against service areas
- Service frequency selection
- Dog information collection
- Property access details (gated communities)

### Payment Processing
- Stripe checkout session creation
- Plan selection (weekly, biweekly, twice_weekly)
- Extra dog charge calculation
- Successful payment handling
- Stripe webhook processing
- Customer/subscription record creation
- Payment failure handling
- Coupon code validation

### Dashboard Features (Customer)
- View subscription status
- View scheduled services
- Update profile information
- Change subscription plan
- View billing history
- Manage notification preferences

### Dashboard Features (Admin)
- View all customers
- View customer statistics
- Manage service locations
- Manage quotes (status, notes)
- Manage waitlist
- Migrate Stripe customers
- Manage CMS pages/content
- Manage SEO settings
- Manage media assets

### Email Notifications
- Contact form notification to admin
- Quote submission confirmation
- Waitlist confirmation to customer
- Waitlist admin notification
- Onboarding welcome email
- MailerSend API + SMTP fallback
- Plain text + HTML versions

### Analytics Integration
- Google Analytics page views
- Event tracking (quotes, waitlist, onboarding, payments)
- Facebook Pixel initialization
- Custom event properties

### Service Area Management
- Add new service locations
- Support multiple zip codes per location
- Activate/deactivate service areas
- Validate customer zip codes
- Show service area on landing pages
- Filter by active status

### CMS (Content Management)
- Create/edit/delete pages
- Edit page content by element ID
- SEO settings per page (meta tags, OG tags, structured data)
- Media asset management
- Page publish/draft/archive status
- Initialize CMS with defaults

---

## Critical User Journeys (6 main flows)

1. **New Customer Signup → Payment → Dashboard**
   - Survey form → Validation → User creation → Payment → Dashboard access

2. **Quote Request → Admin Review → Conversion**
   - Form submission → Admin receives → Status updates → Customer follow-up

3. **Waitlist Signup → Service Launch → Conversion**
   - Waitlist entry → Admin archival → Customer onboarding → Payment

4. **Admin Customer Migration from Stripe**
   - Initiate migration → Match emails → Create records → Verify results

5. **Admin Service Area Expansion**
   - Add location → Set zip codes → Activate → Availability updated

6. **Payment Plan Changes**
   - Select new plan → Process payment → Update subscription → Confirm

---

## Important Configuration Values

### Stripe Plans
- Weekly: `$STRIPE_PRICE_WEEKLY`
- Biweekly: `$STRIPE_PRICE_BIWEEKLY`
- Twice Weekly: `$STRIPE_PRICE_TWICE_WEEKLY`
- Extra Dog: `$STRIPE_PRICE_EXTRA_DOG`
- Initial Cleanup: Standard/Heavy options

### Active Coupons
- `TESTER` → 100% discount (free service for testing)

### Service Frequency Options
- once_a_week
- twice_a_week
- one_time

### Quote Status Flow
- new → contacted → quoted → converted (or lost)

### Waitlist Status
- active (default)
- archived
- deleted

### Subscription Status
- active
- past_due
- paused
- canceled

### Gated Community Options
- left
- right
- alley
- no_gate
- other

---

## Testing Priorities

### High Priority (Core Business Logic)
1. Customer onboarding → Stripe payment flow
2. Quote request submission & admin management
3. Stripe webhook processing
4. Authentication & authorization
5. Email notifications (especially payment confirmations)
6. Zip code validation
7. Service area management

### Medium Priority (User Experience)
1. Dashboard functionality
2. Form validation & error messages
3. Mobile responsiveness
4. Analytics tracking
5. Plan changes
6. Profile updates

### Lower Priority (Nice-to-Have)
1. CMS page editing
2. Media asset management
3. Legacy page variants
4. Theme switching
5. Navigation optimizations

---

## Test Data Checklist

### For Quote Testing
- Valid zip code in service area
- Invalid zip code outside service area
- Different service frequencies
- Various dog counts
- All urgency levels

### For Onboarding Testing
- Complete customer profile
- Gated community variations
- Multiple dog names
- Different notification preferences
- Incomplete vs complete forms

### For Payment Testing
- Test Stripe card: 4242 4242 4242 4242
- Declined card: 4000 0000 0000 0002
- Invalid card: 4000 0000 0000 0069
- Valid expiry, any future date
- Valid CVC: any 3 digits

### For Email Testing
- Valid email addresses
- Undeliverable addresses
- MailerSend API key validity
- SMTP fallback configuration

### For Zip Code Testing
- Yulee: 32097
- Fernandina Beach: 32034
- Oceanway: 32218
- Nassau County variations
- Out-of-area zip codes

---

## Environment Setup

### Required Environment Variables
```
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_ANON_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_PRICE_WEEKLY
STRIPE_PRICE_BIWEEKLY
STRIPE_PRICE_TWICE_WEEKLY
STRIPE_PRICE_EXTRA_DOG
MAILERSEND_API_KEY
MAILERSEND_SMTP_USER
MAILERSEND_SMTP_PASS
JWT_SECRET
RAILWAY_PUBLIC_DOMAIN (for production)
DATABASE_URL
PORT (default 5000)
NODE_ENV
```

---

## Documentation References
- Full testing plan: `/TESTING_PLAN.md`
- Database schema: `/shared/schema.ts`
- Routes: `/server/routes.ts`
- Auth: `/server/auth.ts`
- App routing: `/client/src/App.tsx`

---

This summary provides a quick reference for all major components, routes, features, and testing scenarios for the Dook Scoop 'Em application.
