# Migration Guide: Replit to Local Development

This guide will help you migrate your Dook Scoop 'Em application from Replit to run locally on Claude Code.

## Overview

Your application is a full-stack dog waste removal service platform with:
- **Frontend**: React + Vite + TailwindCSS + shadcn/ui components
- **Backend**: Express.js + Node.js
- **Database**: PostgreSQL (currently Neon Database via Replit)
- **ORM**: Drizzle ORM
- **Authentication**: Supabase Auth + JWT
- **Payment Processing**: Stripe
- **Email**: MailerSend
- **External API**: Sweep&Go integration

## Prerequisites

1. **Node.js** (v20 or higher)
2. **PostgreSQL** database (local or hosted)
3. **Supabase account** (for authentication)
4. **Stripe account** (for payments)
5. **MailerSend account** (for emails)

## Step 1: Database Setup

### Option A: Use Neon Database (Easiest - Same as Replit)

1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project
3. Copy the connection string (looks like: `postgresql://username:password@host/database`)
4. This will be your `DATABASE_URL`

### Option B: Use Supabase Database

1. In your Supabase project, go to Settings → Database
2. Copy the connection string (Connection Pooling recommended)
3. This will be your `DATABASE_URL`

### Option C: Local PostgreSQL

1. Install PostgreSQL locally
2. Create a new database: `createdb dookscoopem`
3. Your connection string: `postgresql://localhost:5432/dookscoopem`

## Step 2: Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your environment variables:

### Required Variables:

**Database:**
```env
DATABASE_URL=postgresql://username:password@host:5432/database_name
```

**Supabase (Authentication):**
- Go to your Supabase project → Settings → API
- Copy the URL and service role key:
```env
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-role-key
```

**JWT Secret (for admin authentication):**
```env
JWT_SECRET=your-random-secret-key-here
```

**Stripe (Payment Processing):**
- Go to Stripe Dashboard → Developers → API Keys
- Copy your secret key:
```env
STRIPE_SECRET_KEY=sk_test_xxxxx
```
- Create pricing products in Stripe and copy their price IDs:
```env
STRIPE_PRICE_WEEKLY=price_xxxxx
STRIPE_PRICE_BIWEEKLY=price_xxxxx
STRIPE_PRICE_TWICE_WEEKLY=price_xxxxx
STRIPE_PRICE_EXTRA_DOG=price_xxxxx
STRIPE_PRICE_INITIAL_STANDARD=price_xxxxx
STRIPE_PRICE_INITIAL_HEAVY=price_xxxxx
```
- For webhooks (after deploying):
```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

**MailerSend (Email):**
- Go to MailerSend Dashboard → API Tokens
```env
MAILERSEND_API_KEY=mlsn.xxxxx
MAILERSEND_SMTP_USER=MS_xxxxx
MAILERSEND_SMTP_PASS=xxxxx
```

**Server:**
```env
PORT=5000
NODE_ENV=development
```

## Step 3: Database Schema Migration

Once your `DATABASE_URL` is set, push the schema to your database:

```bash
npm install
npm run db:push
```

This will create all the necessary tables:
- users (admin authentication)
- customers (CRM)
- subscriptions
- visits
- charges
- waitlist_submissions
- quote_requests
- onboarding_submissions
- service_locations
- pages (CMS)
- page_content
- seo_settings
- media_assets

## Step 4: Remove Replit-Specific Dependencies

The following Replit-specific packages are in `devDependencies` and only used during development. They won't affect production but can be removed if desired:

```bash
npm uninstall @replit/vite-plugin-cartographer @replit/vite-plugin-runtime-error-modal
```

Then update `vite.config.ts` to remove the Replit plugin imports (lines 4, 9-17).

## Step 5: Install Dependencies & Run

```bash
# Install all dependencies
npm install

# Run development server
npm run dev
```

The server will start on `http://localhost:5000`

## Step 6: Create Admin User

Once the server is running, create your first admin user:

```bash
curl -X POST http://localhost:5000/api/admin/create-admin \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your-secure-password"}'
```

## Step 7: Initialize CMS (Optional)

If you want to use the built-in CMS features:

```bash
curl -X POST http://localhost:5000/api/cms/initialize \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

## Database Schema Overview

### Core Tables:
- **users**: Admin authentication
- **customers**: Customer records with Supabase user linking
- **subscriptions**: Stripe subscription tracking
- **visits**: Service visit scheduling
- **charges**: Payment history

### Lead Management:
- **waitlist_submissions**: Pre-launch signups
- **quote_requests**: Service quote requests
- **onboarding_submissions**: New customer onboarding data

### Business Logic:
- **service_locations**: Serviceable zip codes by city/state

### CMS Tables:
- **pages**: Page definitions
- **page_content**: Editable content blocks
- **seo_settings**: SEO metadata per page
- **media_assets**: Media library

## Key Differences from Replit

1. **No automatic environment variables**: You must create `.env` file
2. **No built-in PostgreSQL**: You need to provision your own database
3. **Port 5000**: The app runs on port 5000 by default (configurable via `PORT` env var)
4. **No auto-restart**: Use `npm run dev` which uses `tsx` for hot reloading

## Troubleshooting

### Database connection fails
- Verify your `DATABASE_URL` is correct
- Ensure your database server is running
- Check firewall rules if using remote database

### Supabase auth fails
- Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
- Ensure you're using the service role key, not the anon key

### Stripe webhooks not working locally
- Use Stripe CLI to forward webhooks: `stripe listen --forward-to localhost:5000/api/stripe/webhook`
- Update `STRIPE_WEBHOOK_SECRET` with the webhook signing secret from CLI

### Email sending fails
- Verify MailerSend API key is active
- Check domain verification in MailerSend dashboard
- For local dev, emails go to ryan@dookscoop.com by default

## Production Deployment

When ready to deploy to production:

1. Set `NODE_ENV=production`
2. Build the application: `npm run build`
3. Run the production server: `npm run start`
4. Configure Stripe webhooks to point to your production URL
5. Update Supabase redirect URLs for authentication
6. Set up proper SSL/TLS certificates

## Support

For questions about the codebase or migration, refer to:
- Database schema: `shared/schema.ts`
- API routes: `server/routes.ts`
- Database operations: `server/storage.ts`

## Progress Tracking

See `CHECKPOINT.md` for a working history of setup progress and current status. This file is updated at key milestones and helps you pick up where you left off in future sessions.
