# Comprehensive Testing Plan - Dook Scoop 'Em Application

## Project Overview
Dook Scoop 'Em is a pet waste removal service platform built with:
- **Frontend**: React with Wouter routing, TypeScript, Tailwind CSS
- **Backend**: Express.js API
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Supabase Auth
- **Payments**: Stripe
- **Email**: MailerSend
- **Analytics**: Google Analytics, Facebook Pixel

---

## 1. PUBLIC PAGES/ROUTES

### 1.1 Landing & Marketing Pages
- **Route: `/`** - Home Page
  - Hero section with "We Fear No Pile" tagline
  - Trust indicators section
  - Call-to-action button to Get Quote
  - Navigation menu
  - Footer
  
- **Route: `/residential`** - Residential Services Page
  - Service offerings for homeowners
  - Pricing information
  - Service area details
  
- **Route: `/commercial`** - Commercial Services Page
  - Business/commercial service offerings
  - Fleet management information
  - B2B pricing
  
- **Route: `/about-us`** - Company Information Page
  - Company story and mission
  - Team information
  - Company values
  
- **Route: `/blog`** - Blog/Content Page
  - Blog posts and articles
  - Content management
  
- **Route: `/products-we-use`** - Products Page
  - Tools and products used by service team
  - Product recommendations
  
- **Route: `/contact`** - Contact Form Page
  - Contact form submission
  - Maps/location information
  - Support contact methods
  
- **Route: `/locations`** or `/locations-neu`** - Service Locations Page
  - Service area map
  - Zip code coverage information
  - Launch dates for different regions
  
- **Route: `/locations-duke`** - Duke-specific locations variant
- **Route: `/waitlist-map`** - Interactive waitlist selection map

### 1.2 Waitlist Pages
- **Route: `/waitlist`** - Waitlist selection hub
  - Area selector for different regions
  - Links to regional waitlists
  
- **Route: `/waitlist/northJax-yulee-dina`** - North Jacksonville Waitlist
  - Waitlist form specific to this region
  - Landing page variant
  
- **Route: `/waitlist/eastJax-beaches`** - East Jacksonville Waitlist
  - Waitlist form specific to this region
  - Alternative landing page design

### 1.3 Onboarding Pages
- **Route: `/onboard`** or `/onboard-survey`** - Customer Onboarding Survey
  - Initial qualification form
  - Service preference selection
  - Contact information collection
  - Address and service area validation
  - Service frequency selection (weekly, bi-weekly, twice weekly)
  - Dog count selection
  - Last cleanup timeline
  - Gated community information
  - Dog names input
  - Notification preferences
  - Quote request trigger

- **Route: `/onboard-new`** - Alternative onboarding design (New)
- **Route: `/onboard-original`** - Original onboarding design

### 1.4 Authentication Pages
- **Route: `/sign-in`** - Customer Login Page
  - Email/password login
  - Supabase authentication
  - Error handling
  - "Forgot password" link
  - Link to sign-up page
  
- **Route: `/sign-up`** - Account Registration Page
  - Email registration
  - Password setup
  - Form validation

### 1.5 Legacy/Demo Pages
- **Route: `/home`** - Home page alias
- **Route: `/landing`** - Alternative landing variant
- **Route: `/landing-minimal`** - Minimal landing design
- **Route: `/landing-minimal-eastjax`** - East Jax minimal variant
- **Route: `/landing-duke`** - Duke variant landing
- **Route: `/locations-duke`** - Duke-specific locations

---

## 2. PROTECTED CUSTOMER DASHBOARD ROUTES

All routes under `/dashboard` require authentication (protected by ProtectedRoute component)

### 2.1 Main Dashboard
- **Route: `/dashboard`** - Customer Dashboard Home
  - User profile display
  - Subscription status overview
  - Next scheduled service
  - Account summary
  - Navigation to other dashboard sections
  - Logout button

### 2.2 Subscription Management
- **Route: `/dashboard/subscription`** - Subscription Management
  - Current plan display (weekly, biweekly, twice-weekly)
  - Plan change options
  - Pricing information
  - Add extra dog charges
  - Cancel subscription option
  - Subscription history

### 2.3 Schedule Management
- **Route: `/dashboard/schedule`** - Service Schedule
  - View scheduled service appointments
  - Service calendar
  - Upcoming visits
  - Reschedule service requests
  - Service history
  - Notification preferences for specific visits

### 2.4 Billing
- **Route: `/dashboard/billing`** - Billing & Invoices
  - Invoice history
  - Payment method management
  - Billing address
  - Download/view receipts
  - Refund requests

### 2.5 Account Settings
- **Route: `/dashboard/settings`** - Customer Settings
  - Profile information edit
  - Password change
  - Email preferences
  - Notification settings (SMS, email, phone)
  - Address updates
  - Dog information updates
  - Gated community details update
  - Account deletion option

---

## 3. PROTECTED ADMIN DASHBOARD ROUTES

All routes under `/admin` require authentication AND admin role

### 3.1 Admin Dashboard Home
- **Route: `/admin`** - Admin Dashboard Main
  - Statistics (total customers, active subscriptions, revenue)
  - Recent activity
  - Quick actions
  - Admin navigation menu

### 3.2 Customer Management
- **Route: `/admin/customers`** - Customer List
  - View all customers
  - Customer search/filter
  - Customer details view
  - Edit customer information
  - View customer subscriptions
  - Customer status management
  - Filter by role (customer vs admin)

### 3.3 Service Area Management
- **Route: `/admin/service-areas`** - Service Locations Management
  - View all service areas
  - Add new service area/zip code
  - Edit service area details (city, state, zip codes)
  - Set launch dates
  - Activate/deactivate service areas
  - Delete service areas
  - Service area filtering

### 3.4 Waitlist Management
- Admin view of waitlist submissions (accessed via routes.ts)
  - View all active waitlist entries
  - Archive waitlist entries
  - Delete waitlist entries
  - View archived waitlist
  - Filter by region, zip code, urgency

### 3.5 Quote Request Management
- Admin quote management (accessed via routes.ts)
  - View all quote requests
  - Filter quotes by status (new, contacted, quoted, converted, lost)
  - Update quote status
  - Add notes to quotes
  - View pricing and estimated values
  - Delete quotes
  - Contact tracking

### 3.6 Scheduling/Calendar
- **Route: `/admin/schedule`** - Service Schedule Management
  - View all scheduled services
  - Schedule new services
  - Edit scheduled visits
  - Cancel services
  - Route optimization view
  - Technician assignment
  - Service completion tracking

### 3.7 Admin Settings
- **Route: `/admin/settings`** - Admin Configuration
  - System settings
  - Email configuration
  - Stripe settings display
  - CMS content management access
  - User role management
  - System maintenance options

### 3.8 Customer Migration
- **Route: `/admin/migrate-customers`** - Stripe Customer Migration
  - Migrate existing Stripe customers to database
  - Match Supabase users with Stripe customers
  - Create customer records from Stripe
  - Create subscription records
  - Error handling and reporting

### 3.9 CMS Dashboard
- **Route: `/admin/cms-dashboard`** (mentioned in pages) - Content Management
  - Page management (create, edit, delete)
  - Page content editor
  - SEO settings management
  - Media asset management
  - Site settings

---

## 4. API ROUTES & ENDPOINTS

### 4.1 Public API Endpoints

#### Contact Form
- **POST `/api/contact`**
  - Request: `{ name, email, phone, subject, message }`
  - Response: Success message or error
  - Sends email to ryan@dookscoop.com
  - Email service: MailerSend API or SMTP fallback

#### Quote Request
- **POST `/api/quote`**
  - Request: Quote form data (name, email, phone, address, zipCode, numberOfDogs, serviceFrequency, urgency, preferredContactMethod, message)
  - Response: Quote ID and confirmation message
  - Validates against `insertQuoteRequestSchema`
  - Saves to quote_requests table for admin follow-up
  - Tracks analytics event

#### Waitlist Submission
- **POST `/api/waitlist`**
  - Request: Waitlist form data (name, email, address, zipCode, phone, numberOfDogs, referralSource, urgency, lastCleanup, preferredPlan, canText)
  - Response: Submission ID and success message
  - Sends confirmation email to customer
  - Sends notification to admin (ryan@dookscoop.com)
  - Saves to waitlist_submissions table
  - Tracks analytics

#### Customer Onboarding
- **POST `/api/onboard`**
  - Request: Comprehensive customer data (firstName, lastName, email, homeAddress, city, state, zipCode, cellPhone, numberOfDogs, serviceFrequency, etc.)
  - Response: Onboarding ID and next steps
  - Creates Supabase auth user with temporary password
  - Sends welcome email with login credentials
  - Saves onboarding record
  - Tracks analytics

#### Coupon Validation
- **POST `/api/validate-coupon`**
  - Request: `{ code }`
  - Response: Validation result with discount info
  - Supported coupons: 'TESTER' (100% discount)
  - Returns discount type and description

#### Service Location Endpoints
- **GET `/api/locations`**
  - Response: All active service locations
  - Returns: `{ locations }`

#### Zip Code Validation
- **POST `/api/validate-zip`**
  - Request: `{ zipCode }`
  - Response: `{ isValid: boolean, message: string }`
  - Checks if zip code is in service area

#### Notifications
- **GET `/api/notifications`**
  - Response: Waitlist notification history
  - Returns JSON file backup of notifications

### 4.2 Authenticated Customer API Endpoints

#### Subscription Information
- **GET `/api/customer/subscription`** (requireAuth)
  - Response: Customer subscription data
  - Returns: `{ hasSubscription, customer, subscription }`
  - Retrieves from customers and subscriptions tables

### 4.3 Admin-Only API Endpoints

#### Admin Stats
- **GET `/api/admin/stats`** (requireAdmin)
  - Response: `{ totalCustomers, activeSubscriptions, todaysVisits, monthlyRevenue }`

#### Customer Management
- **GET `/api/admin/customers`** (requireAdmin)
  - Response: All customers with subscription details
  - Filters to show only customers (role='customer')

- **POST `/api/admin/migrate-stripe-customers`** (requireAdmin)
  - Migrates Stripe customers to CRM database
  - Creates customer and subscription records
  - Response: Migration results and error log

#### Location Management
- **GET `/api/admin/locations`** (requireAdmin)
  - Response: All service locations

- **POST `/api/admin/locations`** (requireAdmin)
  - Request: Service location data (city, state, zipCodes, launchDate, isActive)
  - Response: Created location object

- **PATCH `/api/admin/locations/:id`** (requireAdmin)
  - Request: Updated location data
  - Response: Updated location object

- **DELETE `/api/admin/locations/:id`** (requireAdmin)
  - Response: Success message

#### Waitlist Management
- **GET `/api/admin/waitlist`** (requireAdmin)
  - Response: All active waitlist submissions

- **GET `/api/admin/waitlist/archived`** (requireAdmin)
  - Response: All archived waitlist submissions

- **PATCH `/api/admin/waitlist/:id/archive`** (requireAdmin)
  - Archives a waitlist submission

- **DELETE `/api/admin/waitlist/:id`** (requireAdmin)
  - Permanently deletes waitlist submission

#### Quote Management
- **GET `/api/admin/quotes`** (requireAdmin)
  - Response: All quote requests with status filtering

- **PATCH `/api/admin/quotes/:id/status`** (requireAdmin)
  - Request: `{ status }` (new, contacted, quoted, converted, lost)
  - Updates quote status

- **PATCH `/api/admin/quotes/:id/notes`** (requireAdmin)
  - Request: `{ notes }`
  - Adds admin notes to quote

- **DELETE `/api/admin/quotes/:id`** (requireAdmin)
  - Permanently deletes quote request

#### Supabase Admin User Creation
- **POST `/api/admin/create-supabase-admin`**
  - Request: `{ email, password, firstName, lastName }`
  - Creates new admin user in Supabase
  - Sets admin role in user metadata

### 4.4 Payment & Stripe Integration

#### Checkout Session Creation
- **POST `/api/stripe/create-checkout-session`**
  - Request: `{ supabaseUserId, email, plan, dogCount, customerData }`
  - Response: `{ sessionUrl, sessionId }`
  - Plans: weekly, biweekly, twice_weekly
  - Uses Stripe environment variables for price IDs
  - Handles extra dog charges
  - Creates or retrieves Stripe customer

#### Complete Checkout
- **POST `/api/stripe/complete-checkout`**
  - Request: `{ sessionId }`
  - Response: Success confirmation with customer ID
  - Creates customer record in database
  - Creates subscription record
  - Called after Stripe payment success

#### Stripe Webhook
- **POST `/api/stripe/webhook`**
  - Raw body middleware (preserves signature)
  - Event: `checkout.session.completed`
  - Creates customer and subscription records
  - Handles payment confirmation

### 4.5 CMS API Endpoints (Admin Only)

#### Page Management
- **GET `/api/cms/pages`** (requireAdmin)
  - Response: All pages

- **GET `/api/cms/pages/:slug`** (requireAdmin)
  - Response: Page with content and SEO settings

- **POST `/api/cms/pages`** (requireAdmin)
  - Request: Page data (slug, title, status)
  - Response: Created page

- **PATCH `/api/cms/pages/:id`** (requireAdmin)
  - Updates page properties

- **DELETE `/api/cms/pages/:id`** (requireAdmin)
  - Deletes page

#### Content Management
- **POST `/api/cms/content`** (requireAdmin)
  - Request: Page content (pageId, elementId, contentType, content)
  - Response: Updated content

- **GET `/api/cms/content/:pageId`** (requireAdmin)
  - Response: All content blocks for page

- **DELETE `/api/cms/content/:pageId/:elementId`** (requireAdmin)
  - Deletes specific content block

- **PUT `/api/cms/content/element/:pageId/:elementId`** (requireAdmin)
  - Updates content for specific element

- **GET `/api/cms/content/:slug`** (Public)
  - Response: Page content formatted for display

#### SEO Management
- **POST `/api/cms/seo`** (requireAdmin)
  - Request: SEO settings (metaTitle, metaDescription, structuredData, etc.)
  - Response: Updated SEO settings

- **GET `/api/cms/seo/:pageId`** (requireAdmin)
  - Response: Page SEO settings

#### Media Management
- **GET `/api/cms/media`** (requireAdmin)
  - Response: All media assets

- **POST `/api/cms/media`** (requireAdmin)
  - Request: Media asset data (filename, mimeType, size, url, altText)
  - Response: Created asset

- **DELETE `/api/cms/media/:id`** (requireAdmin)
  - Deletes media asset

#### CMS Initialization
- **POST `/api/cms/initialize`** (requireAdmin)
  - Creates default homepage with sample content
  - Creates SEO settings for homepage

---

## 5. CORE FEATURES & FUNCTIONALITY

### 5.1 User Authentication

#### Sign Up Flow
- **Tests:**
  - Form validation (email format, password strength)
  - Password confirmation matching
  - Email uniqueness check
  - Successful user creation in Supabase
  - Redirect to sign-in after successful signup
  - Error handling for duplicate emails
  - Error messages display correctly

#### Sign In Flow
- **Tests:**
  - Email/password validation
  - Successful authentication with Supabase
  - JWT token retrieval and storage
  - Redirect to dashboard after login
  - Remember me functionality (if implemented)
  - Error messages for invalid credentials
  - Session persistence

#### Password Reset (if implemented)
- **Tests:**
  - Password reset email delivery
  - Reset link expiration
  - New password validation
  - Redirect after successful reset

#### Role-Based Access Control
- **Tests:**
  - Customer users access customer dashboard only
  - Admin users access admin dashboard
  - Regular users cannot access /admin routes
  - Protected route component prevents unauthorized access
  - Role metadata stored in Supabase user metadata

### 5.2 Waitlist Management

#### Waitlist Form Submission
- **Tests:**
  - Form validation (all required fields)
  - Email format validation
  - Phone number validation
  - Zip code format validation
  - Number of dogs selection
  - Address input and validation
  - Referral source selection (multiple options)
  - Urgency level selection
  - Last cleanup timeline selection
  - Preferred plan selection
  - "Can text" checkbox functionality
  - Form submission success message
  - Confirmation email to customer
  - Admin notification email
  - Database record creation
  - Error handling for validation failures
  - Error handling for email sending failures

#### Waitlist Management Admin View
- **Tests:**
  - View all active waitlist entries
  - View archived entries
  - Filter by status (active/archived)
  - Search/filter by name, email, zip code
  - Archive individual entries
  - Delete entries permanently
  - View submission details
  - Timestamp display for submissions
  - Bulk actions (if implemented)

### 5.3 Quote Request System

#### Quote Request Submission
- **Tests:**
  - Form validation for all fields
  - Email and phone validation
  - Zip code validation
  - Service frequency selection (weekly, twice_weekly, one_time)
  - Urgency level selection (asap, this_week, next_week, within_month, planning_ahead)
  - Dog count selection (1-10)
  - Message/notes optional field
  - Preferred contact method (email, phone, text)
  - Form submission success
  - Database record creation
  - Analytics tracking
  - Error handling
  - CRM save for admin follow-up (no Sweep&Go integration)

#### Quote Management Admin View
- **Tests:**
  - View all quotes with different statuses
  - Filter by status (new, contacted, quoted, converted, lost)
  - Update quote status
  - Add/update admin notes
  - View estimated pricing
  - Edit quote details
  - Delete quotes
  - View submission timestamp
  - Contact history tracking
  - Analytics on quote conversion rates

### 5.4 Customer Onboarding Flow

#### Pre-Payment Onboarding
- **Tests:**
  - Customer survey/form submission
  - All required fields validation
  - Contact information collection (name, email, phone)
  - Address and service area validation
  - Service frequency selection
  - Number of dogs input
  - Last cleanup timeline
  - Initial cleanup required checkbox
  - Notification preferences (SMS, email, call)
  - Gated community information
  - Gate location selection (left, right, alley, no_gate, other)
  - Dog names input
  - Additional comments optional field
  - How customer heard about us selection
  - Form submission confirmation

#### Account Creation During Onboarding
- **Tests:**
  - Supabase auth user creation
  - Temporary password generation
  - Email confirmation auto-enabled
  - User metadata population (firstName, lastName, phone, role='customer')
  - Onboarding record creation in database
  - Status tracking (pending, completed, failed)
  - Error handling if auth creation fails

#### Welcome Email
- **Tests:**
  - Email delivery to customer
  - Temporary password included
  - Login link provided
  - Service details displayed correctly
  - Founder benefits mentioned
  - Contact information included
  - Professional HTML formatting
  - Text version included
  - MailerSend API or SMTP fallback working

#### Onboarding Record Persistence
- **Tests:**
  - All customer data saved to onboarding_submissions table
  - Status field updates (pending → completed)
  - Timestamps recorded
  - Dog names array stored correctly
  - Gated community information stored
  - Notification preferences stored

### 5.5 Payment Processing (Stripe)

#### Checkout Session Creation
- **Tests:**
  - Plan selection and validation
  - Plan pricing ID mapping
  - Dog count calculation for charges
  - Extra dog pricing applied correctly
  - Success URL construction
  - Cancel URL construction
  - Metadata passing (supabaseUserId, plan, dogCount, customerData)
  - Stripe customer creation or retrieval
  - Line items populated correctly
  - Session URL returned successfully

#### Stripe Checkout Page
- **Tests:**
  - Redirect to Stripe Checkout
  - Plan details display
  - Pricing calculation correct
  - Extra dog charges included
  - Payment method selection (cards)
  - Form validation
  - Billing address optional
  - Card validation
  - Payment submission

#### Payment Success Flow
- **Tests:**
  - Return to dashboard after successful payment
  - Session ID in URL query parameter
  - Stripe webhook fires
  - Customer record created if new
  - Subscription record created with correct plan
  - Status set to "active"
  - Current period dates calculated
  - Dog count stored correctly
  - Email confirmation sent
  - Analytics tracking

#### Subscription Data Retrieval
- **Tests:**
  - GET /api/customer/subscription returns correct data
  - hasSubscription flag accurate
  - Plan details accessible
  - Dog count accurate
  - Status displayed correctly
  - Billing period information available

#### Payment Failure Handling
- **Tests:**
  - User returned to checkout on payment decline
  - Error message displayed
  - Retry option available
  - No customer record created on failure
  - No subscription created on failure

#### Coupon Validation
- **Tests:**
  - Valid coupon code returns discount info
  - Invalid coupon returns error
  - Discount type and amount returned
  - Case-insensitive code matching
  - 'TESTER' coupon returns 100% discount
  - Error handling for API errors

### 5.6 Service Area Validation

#### Zip Code Validation
- **Tests:**
  - Valid zip codes in service area accepted
  - Invalid/out-of-service zip codes rejected
  - Appropriate message displayed
  - Works in quote form
  - Works in onboarding form
  - Works in waitlist form
  - Multiple zip codes per location supported
  - Service area filtering by active status

#### Service Location Management (Admin)
- **Tests:**
  - Create new service location
  - Edit existing location
  - Delete location
  - Add multiple zip codes to location
  - Set launch date
  - Activate/deactivate location
  - View all locations with details
  - Search/filter locations

### 5.7 Contact Form

#### Contact Form Submission
- **Tests:**
  - Form field validation
  - Name required and validated
  - Email required and validated
  - Phone optional but validated if provided
  - Subject field required
  - Message field required
  - Form submission success message
  - Email sent to ryan@dookscoop.com
  - Email includes all submitted information
  - Professional formatting
  - Both HTML and text versions
  - Error handling for email service failures
  - Form still submits if email fails
  - CSRF protection (if implemented)

#### Contact Email Details
- **Tests:**
  - From address: noreply@dookscoopem.com
  - To address: ryan@dookscoop.com
  - Subject includes "Contact Form" prefix
  - All submitted data included
  - Timestamp included
  - HTML formatting professional
  - Mobile responsive
  - MailerSend API used (with SMTP fallback)

### 5.8 Email Notifications

#### Email Service Configuration
- **Tests:**
  - MailerSend API key configured
  - SMTP fallback configured
  - API endpoint accessible
  - Authentication working
  - Fallback working when API fails

#### Transactional Emails
- **Tests:**
  - Welcome email (onboarding)
  - Waitlist confirmation email
  - Waitlist admin notification
  - Contact form notification
  - Email delivery tracking
  - Undeliverable handling

#### Email Template Quality
- **Tests:**
  - Professional HTML templates
  - Brand colors/logos included
  - Mobile responsive design
  - Clear call-to-action buttons
  - Plain text versions included
  - All variables populated correctly
  - No broken links
  - Consistent branding

### 5.9 Analytics Integration

#### Google Analytics
- **Tests:**
  - Page view tracking on route changes
  - Event tracking for quote submissions
  - Event tracking for waitlist submissions
  - Event tracking for onboarding submissions
  - Event tracking for successful payments
  - Custom event properties passed
  - No tracking errors
  - Session tracking

#### Facebook Pixel
- **Tests:**
  - Pixel code initialization
  - Page view events tracked
  - Conversion events tracked
  - Custom events triggered
  - No script errors

#### Analytics Hooks
- **Tests:**
  - useAnalytics hook functional
  - Route change detection working
  - Event dispatch working
  - Custom properties passed correctly

### 5.10 Admin Dashboard Features

#### Statistics Display
- **Tests:**
  - Total customers count accurate
  - Active subscriptions count accurate
  - Revenue calculation (if implemented)
  - Today's visits tracking (if implemented)
  - Real-time updates
  - Error handling for failed data fetch

#### Customer Management
- **Tests:**
  - View customer list
  - Search customers
  - Filter by status
  - View detailed customer info
  - Edit customer details
  - Update phone number
  - Update address
  - Update notification preferences
  - View subscription information
  - View payment history

#### Content Management System (CMS)
- **Tests:**
  - Page management (list, create, edit, delete)
  - Page slug validation
  - Content editor for page elements
  - Content type selection (text, html, image, color, style)
  - SEO settings per page
  - Meta title/description editing
  - Open Graph tags
  - Structured data (JSON-LD)
  - Media asset management
  - Image upload and URL management
  - Alt text and captions
  - Publish/draft/archive status
  - Page preview

#### CMS Sample Data Initialization
- **Tests:**
  - Initialize endpoint creates homepage
  - Sample content created
  - SEO settings created with defaults
  - Structured data populated correctly

---

## 6. DATABASE OPERATIONS

### 6.1 Customer Records

#### Customer Creation
- **Tests:**
  - Create customer on successful payment
  - Link to Supabase user ID
  - Link to Stripe customer ID
  - All contact fields saved
  - Address information saved
  - Property access details (gated community)
  - Dog information (names, count)
  - Notification preference saved
  - Role set to 'customer'
  - Timestamp recorded
  - Unique email constraint enforced

#### Customer Retrieval
- **Tests:**
  - Get customer by ID
  - Get customer by Supabase user ID
  - Get customer by Stripe customer ID
  - Get all customers (filter by role)
  - Customer data complete and accurate
  - Soft deletes handled (if implemented)

#### Customer Updates
- **Tests:**
  - Update customer profile
  - Update phone number
  - Update address information
  - Update dog information
  - Update gated community details
  - Update notification preferences
  - Timestamp updated
  - Historical data preserved

#### Customer Deletion
- **Tests:**
  - Cascade delete on customer deletion
  - Subscriptions deleted
  - Visits deleted
  - Charges deleted
  - Related data cleaned up

### 6.2 Subscription Management

#### Subscription Creation
- **Tests:**
  - Link to customer ID
  - Link to Stripe subscription ID
  - Plan stored correctly (weekly, biweekly, twice_weekly)
  - Dog count recorded
  - Status set to 'active'
  - Billing period dates calculated
  - Timestamp recorded
  - Unique constraint on Stripe subscription ID

#### Subscription Retrieval
- **Tests:**
  - Get subscription by ID
  - Get subscription by customer ID
  - Get subscription by Stripe subscription ID
  - Get all subscriptions for customer
  - Subscription status accurate
  - Plan information correct

#### Subscription Updates
- **Tests:**
  - Update plan (weekly → biweekly)
  - Update dog count
  - Update status (active → paused → canceled)
  - Update billing period information
  - Set cancel_at_period_end flag
  - Timestamp updated

#### Subscription Status Tracking
- **Tests:**
  - Active subscriptions display correctly
  - Paused subscriptions handled
  - Canceled subscriptions show end date
  - Past due status handled
  - Status change history (if tracked)

### 6.3 Visit/Service Scheduling

#### Visit Creation
- **Tests:**
  - Create visit record
  - Link to subscription
  - Link to customer
  - Schedule date/time stored
  - Initial status set to 'scheduled'
  - Tech notes field available
  - Timestamp recorded

#### Visit Retrieval
- **Tests:**
  - Get visit by ID
  - Get customer visits
  - Get visits by date
  - Filter by status (scheduled, completed, skipped, canceled)
  - Visit history accessible

#### Visit Updates
- **Tests:**
  - Update visit status
  - Add tech notes
  - Mark as completed with timestamp
  - Cancel visit
  - Reschedule visit date/time

### 6.4 Billing & Charges

#### Charge Recording
- **Tests:**
  - Create charge record on payment
  - Link to customer ID
  - Link to Stripe invoice ID
  - Charge type recorded (recurring, one_time, initial_cleanup)
  - Amount stored in cents
  - Status recorded (succeeded, failed, refunded, pending)
  - Description included
  - Timestamp recorded

#### Charge Retrieval
- **Tests:**
  - Get customer charges
  - Get charges by status
  - Get charges by type
  - Charge history accessible

### 6.5 Waitlist Submissions

#### Waitlist Record Creation
- **Tests:**
  - All form fields stored
  - Status set to 'active'
  - Timestamp recorded
  - Duplicate handling (same email)
  - Data validation before save

#### Waitlist Record Management
- **Tests:**
  - Retrieve active submissions
  - Retrieve archived submissions
  - Update status (active → archived)
  - Delete submission
  - Filter by zip code
  - Filter by urgency
  - Search by name/email

### 6.6 Quote Requests

#### Quote Record Creation
- **Tests:**
  - All form fields stored
  - Status set to 'new'
  - Timestamp recorded
  - No integration with Sweep&Go (removed)
  - Message field optional
  - All service frequency options supported

#### Quote Record Management
- **Tests:**
  - Retrieve all quotes
  - Filter by status
  - Update status transitions
  - Add admin notes
  - Update pricing information
  - View contact history
  - Delete quote

### 6.7 Onboarding Submissions

#### Onboarding Record Creation
- **Tests:**
  - All customer data stored
  - Status tracking (pending → completed)
  - Timestamp recorded
  - Dog names array stored
  - Notification preferences stored
  - Gated community information stored
  - Optional fields handled correctly

#### Onboarding Record Management
- **Tests:**
  - Retrieve all submissions
  - Filter by status
  - View submission details
  - Update status
  - Store error messages if creation fails
  - Track Supabase user ID if created

### 6.8 Service Locations

#### Service Location Creation
- **Tests:**
  - City and state stored
  - Multiple zip codes per location
  - Launch date optional
  - Active status tracking
  - Duplicate prevention

#### Service Location Management
- **Tests:**
  - Retrieve all locations
  - Retrieve active locations only
  - Edit location details
  - Add/remove zip codes
  - Set launch date
  - Activate/deactivate
  - Delete location

### 6.9 CMS Tables

#### Page Management
- **Tests:**
  - Page creation with slug validation
  - Status tracking (published, draft, archived)
  - Update page properties
  - Delete page (cascade to content/SEO)
  - Unique slug constraint
  - Timestamp tracking

#### Page Content Management
- **Tests:**
  - Create/update content blocks
  - Element ID for CSS selector matching
  - Content type selection
  - Metadata storage
  - Cascade delete with page
  - Upsert functionality (create or update)

#### SEO Settings
- **Tests:**
  - Meta title (max 60 chars)
  - Meta description (max 160 chars)
  - OG tags (title, description, image)
  - Twitter card tags
  - Structured data (JSON-LD)
  - Custom meta tags
  - Cascade delete with page

#### Media Assets
- **Tests:**
  - Store media metadata
  - File URL storage
  - MIME type recording
  - File size in bytes
  - Alt text and caption
  - Upload timestamp
  - Retrieval for CMS

---

## 7. CRITICAL USER FLOWS

### 7.1 New Customer Onboarding (End-to-End)

**Flow Steps:**
1. User lands on home page
2. Clicks "Get Quote" button
3. Navigates to onboarding survey
4. Fills out customer information
   - Personal details (name, email, phone)
   - Service address
   - Service frequency preference
   - Dog information
   - Property access details
5. Form validation passes
6. Submission sent to `/api/onboard`
7. Supabase user created with temporary password
8. Welcome email sent with login credentials
9. Customer can login with email/password
10. Dashboard shows subscription pending status
11. Customer proceeds to payment (if not already paid)

**Test Points:**
- Each form field validates
- Email uniqueness checked
- Service area validation works
- Supabase user creation succeeds
- Welcome email delivers
- Login works with credentials
- User can access dashboard
- User can proceed to payment

### 7.2 Payment Submission & Subscription Activation

**Flow Steps:**
1. Customer in onboarding or dashboard
2. Selects service plan (weekly, biweekly, twice weekly)
3. Enters number of dogs (affects pricing)
4. Reviews pricing breakdown
5. Clicks "Subscribe" or "Checkout"
6. Redirected to Stripe Checkout
7. Selects payment method
8. Enters card details
9. Completes payment
10. Redirected to dashboard
11. Stripe webhook fires
12. Customer record created in database
13. Subscription record created
14. Dashboard updated with active subscription
15. Confirmation email sent

**Test Points:**
- Plan selection works
- Pricing calculation correct
- Extra dog charges apply
- Stripe checkout loads
- Payment processes
- Webhook fires
- Customer created
- Subscription created with correct plan/dog count
- Dashboard updates
- Email sent
- User can view subscription status

### 7.3 Admin Quote Follow-Up Workflow

**Flow Steps:**
1. Customer submits quote request from form
2. Admin receives notification
3. Admin logs into admin dashboard
4. Views quote in admin/quotes
5. Admin filters by "new" status
6. Clicks on quote to view details
7. Updates status to "contacted"
8. Adds notes about conversation
9. Updates status to "quoted"
10. Adds estimated price
11. Saves quote
12. Quote shows in "quoted" filter
13. Customer converts → admin updates to "converted"
14. Quote removed from active list or marked closed

**Test Points:**
- Quote received via API
- Admin access granted
- Quote visible in admin view
- Status updates work
- Notes save correctly
- Pricing updates work
- Filters work
- Status transitions logical

### 7.4 Service Area Expansion

**Flow Steps:**
1. Admin adds new service location via API/admin panel
2. Specifies city, state, zip codes
3. Sets launch date (optional)
4. Marks as inactive initially
5. When ready to launch, activates location
6. Zip code validation updated
7. Customers in new area can get quotes
8. Waitlist customers notified (if implemented)

**Test Points:**
- Location created via API
- Multiple zip codes supported
- Inactive locations excluded from validation
- Activation enables zip code validation
- Zip validation updated immediately
- Quote/onboarding forms reflect new service area

### 7.5 Waitlist Signup to Customer Conversion

**Flow Steps:**
1. User submits waitlist form
2. Confirmation email sent
3. Admin receives notification
4. User receives confirmation with next steps
5. User joins waitlist
6. Admin can view waitlist
7. When area opens, admin emails customer
8. Customer receives "Your area is now open" email
9. Customer clicks link
10. Customer completes onboarding
11. Customer makes payment
12. Admin archives waitlist entry
13. Customer now active

**Test Points:**
- Waitlist form submits
- Confirmation email sent
- Admin notification received
- Record in database
- Admin can view and archive
- Email sent on archival (if implemented)
- Customer can re-signup via onboarding

### 7.6 Admin Stripe Customer Migration

**Flow Steps:**
1. Admin initiates migration
2. Fetches all Stripe subscriptions
3. Fetches all Supabase users
4. Matches by email address
5. For each match:
   - Creates customer record if not exists
   - Creates subscription record
   - Maps plan from Stripe
   - Maps dog count from metadata
6. Migration completes
7. Admin views results
8. Error report available
9. Customers now visible in admin customer list

**Test Points:**
- API endpoint accessible
- Stripe customers fetched
- Supabase users fetched
- Email matching works
- Customer records created
- Subscription records created
- Plan mapping correct
- Error handling for mismatches
- Results report accurate

---

## 8. THIRD-PARTY INTEGRATIONS

### 8.1 Stripe Integration

#### Configuration
- **Environment Variables:**
  - `STRIPE_SECRET_KEY` - Secret key for API calls
  - `STRIPE_WEBHOOK_SECRET` - Webhook signature verification
  - `STRIPE_PRICE_WEEKLY` - Weekly plan price ID
  - `STRIPE_PRICE_BIWEEKLY` - Biweekly plan price ID
  - `STRIPE_PRICE_TWICE_WEEKLY` - Twice weekly plan price ID
  - `STRIPE_PRICE_EXTRA_DOG` - Extra dog charge price ID

#### Test Coverage
- **Checkout Flow:**
  - Session creation
  - URL construction
  - Metadata passing
  - Price ID validation
  - Line items calculation
  - Quantity handling for extra dogs

- **Webhook Handling:**
  - Signature verification
  - Event parsing
  - Customer creation
  - Subscription creation
  - Status updates
  - Error handling

- **Customer Management:**
  - Stripe customer creation
  - Metadata storage
  - Lookup by email
  - Updates to customer records

### 8.2 Supabase Auth Integration

#### Configuration
- **Environment Variables:**
  - `SUPABASE_URL` - Project URL
  - `SUPABASE_SERVICE_ROLE_KEY` - Admin key for user management
  - `SUPABASE_ANON_KEY` - Public key for client

#### Test Coverage
- **User Creation:**
  - Email validation
  - Password setup
  - Email confirmation
  - Metadata population
  - Role assignment (admin/customer)

- **User Authentication:**
  - JWT token verification
  - Token storage
  - Token refresh
  - Session persistence
  - Logout handling

- **Token Verification:**
  - Bearer token parsing
  - Signature validation
  - Expiration checking
  - Role metadata reading
  - Admin role enforcement

### 8.3 MailerSend Email Service

#### Configuration
- **Environment Variables:**
  - `MAILERSEND_API_KEY` - API key for HTTP requests
  - `MAILERSEND_SMTP_USER` - SMTP username
  - `MAILERSEND_SMTP_PASS` - SMTP password

#### Test Coverage
- **Email Sending:**
  - API endpoint accessibility
  - Request formatting
  - Authorization headers
  - Response handling
  - SMTP fallback working

- **Email Templates:**
  - Contact form notification
  - Waitlist confirmation (customer)
  - Waitlist notification (admin)
  - Onboarding welcome email
  - HTML and text versions
  - Variable substitution

- **Error Handling:**
  - API failures trigger SMTP fallback
  - SMTP failures logged
  - Service continues if email fails
  - Error messages logged

### 8.4 Google Analytics Integration

#### Configuration
- **Implementation:**
  - useAnalytics hook
  - Page view tracking
  - Event tracking
  - Custom properties

#### Test Coverage
- **Page View Tracking:**
  - Route changes trigger events
  - URL path recorded
  - Timestamp recorded

- **Event Tracking:**
  - Quote submission
  - Waitlist submission
  - Onboarding completion
  - Payment success
  - Service selection

### 8.5 Facebook Pixel Integration

#### Configuration
- **Implementation:**
  - Pixel initialization
  - Page view tracking
  - Conversion tracking
  - Custom events

#### Test Coverage
- **Script Loading:**
  - Pixel code loads
  - No script errors
  - Tracking fires

- **Event Tracking:**
  - Page views tracked
  - Conversions tracked
  - Custom events sent

---

## 9. SECURITY & VALIDATION

### 9.1 Authentication & Authorization
- Login flow protects customer routes
- Admin routes require admin role
- Protected route component enforces access
- JWT token validation on API calls
- Supabase auth user verification
- Role metadata checking

### 9.2 Form Validation
- Client-side Zod schema validation
- Server-side re-validation
- Email format validation
- Phone number validation
- Zip code format checking
- Required field enforcement
- Field length limits
- Type safety with TypeScript

### 9.3 Database Security
- Parameterized queries (Drizzle ORM)
- Foreign key constraints
- Cascade deletes
- Data type validation
- Unique constraints
- Required fields

### 9.4 API Security
- HTTPS only (in production)
- CORS configuration
- Rate limiting (if implemented)
- Stripe webhook signature verification
- Raw body preservation for webhooks
- Authorization headers required for protected endpoints

### 9.5 Data Protection
- Password hashing with bcrypt
- PII not logged to console
- Email configuration not exposed
- API keys in environment variables
- Temporary passwords generated securely
- Session tokens expire

---

## 10. ERROR HANDLING & EDGE CASES

### 10.1 Network Errors
- API call failures
- Email service downtime
- Stripe API timeouts
- Database connection errors
- Webhook delivery failures
- Fallback mechanisms

### 10.2 Validation Errors
- Invalid email format
- Missing required fields
- Zip code not in service area
- Phone number format invalid
- Duplicate email accounts
- Invalid coupon codes

### 10.3 Business Logic Errors
- Customer not found
- Subscription not found
- Quote request not found
- Service area not active
- Insufficient dog count
- Invalid service frequency

### 10.4 Integration Errors
- Stripe customer creation failure
- Supabase user creation failure
- Email sending failures
- Webhook signature mismatch
- Customer migration failures
- Media upload failures

### 10.5 User Experience Edge Cases
- Rapid form submission
- Browser back button behavior
- Session timeout during payment
- Payment interruption
- Network loss during submission
- Multiple tab/window behavior
- Mobile vs desktop differences

---

## 11. TESTING CHECKLIST

### Unit Tests
- [ ] Form validation schemas (Zod)
- [ ] Storage functions
- [ ] Auth middleware
- [ ] Utility functions
- [ ] Type safety checks

### Integration Tests
- [ ] API endpoint flows
- [ ] Database operations
- [ ] Authentication flows
- [ ] Email sending
- [ ] Stripe integration
- [ ] Supabase integration

### End-to-End Tests
- [ ] Customer signup → payment → dashboard
- [ ] Admin quote management workflow
- [ ] Waitlist → conversion → service
- [ ] Service area expansion
- [ ] Customer profile updates
- [ ] Subscription plan changes

### Manual Testing
- [ ] UI/UX across devices
- [ ] Form validation errors
- [ ] Email delivery
- [ ] Payment flows
- [ ] Admin dashboard functionality
- [ ] Protected route access
- [ ] Analytics tracking

### Performance Testing
- [ ] Page load times
- [ ] API response times
- [ ] Database query performance
- [ ] Email sending latency
- [ ] Stripe API integration latency

### Security Testing
- [ ] Authentication bypass attempts
- [ ] Authorization checks
- [ ] XSS prevention
- [ ] CSRF protection (if implemented)
- [ ] SQL injection prevention
- [ ] Rate limiting

### Accessibility Testing
- [ ] Keyboard navigation
- [ ] Screen reader compatibility
- [ ] Color contrast
- [ ] Form labels
- [ ] ARIA attributes

---

## 12. ENVIRONMENT & CONFIGURATION

### Required Environment Variables
```
# Supabase
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_ANON_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_WEEKLY=
STRIPE_PRICE_BIWEEKLY=
STRIPE_PRICE_TWICE_WEEKLY=
STRIPE_PRICE_EXTRA_DOG=
STRIPE_PRICE_INITIAL_STANDARD=
STRIPE_PRICE_INITIAL_HEAVY=

# Email
MAILERSEND_API_KEY=
MAILERSEND_SMTP_USER=
MAILERSEND_SMTP_PASS=

# Admin Email
ADMIN_EMAIL=ryan@dookscoop.com

# Deployment
RAILWAY_PUBLIC_DOMAIN=
JWT_SECRET=
PORT=5000
NODE_ENV=production

# Database
DATABASE_URL=
```

---

## 13. DEPLOYMENT CONSIDERATIONS

### Pre-Deployment Checklist
- [ ] All environment variables configured
- [ ] Database migrations run
- [ ] Stripe products/prices created
- [ ] Supabase authentication configured
- [ ] MailerSend credentials verified
- [ ] Google Analytics code added
- [ ] Facebook Pixel code added
- [ ] SSL certificate configured
- [ ] Domain DNS configured
- [ ] www redirect configured

### Post-Deployment Verification
- [ ] Health check endpoint responding
- [ ] Authentication working
- [ ] Stripe webhooks configured
- [ ] Email sending working
- [ ] Database connected
- [ ] Analytics tracking firing
- [ ] Admin dashboard accessible
- [ ] Payment flow tested with test card
- [ ] Email notifications received

---

## 14. PERFORMANCE & OPTIMIZATION

### Frontend Optimization
- Route-based code splitting
- Image optimization
- CSS/JS minification
- Lazy loading of components
- React Query caching
- Analytics debouncing

### Backend Optimization
- Database query optimization
- Connection pooling
- Response caching
- Error handling efficiency
- Email sending asynchronously
- Webhook processing reliability

### Database Optimization
- Index creation on frequently queried fields
- Query optimization
- Connection limits
- Backup procedures

---

## 15. MONITORING & LOGGING

### Application Logging
- API request/response logging
- Error logging with stack traces
- Authentication attempt logging
- Payment transaction logging
- Email sending status logging
- Webhook processing logging

### Analytics Monitoring
- Page view tracking
- Event conversion tracking
- User flow monitoring
- Error rate monitoring
- Performance metrics

### Uptime Monitoring
- API endpoint health checks
- Database connectivity
- Email service status
- Third-party integration status

---

This comprehensive testing plan covers all major features, integrations, and user flows of the Dook Scoop 'Em application. Each section provides detailed test points to ensure thorough coverage during development and deployment.
