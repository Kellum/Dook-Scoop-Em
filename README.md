# Dook Scoop 'Em - Dog Waste Removal Service Platform

A comprehensive full-stack web application for managing a professional dog waste removal service business.

## Features

### Customer-Facing
- 🏠 **Landing Page** - Professional marketing site with waitlist signup
- 💳 **Online Booking** - Quote requests and customer onboarding with Stripe payments
- 📱 **Customer Dashboard** - Manage subscriptions, view service history (via Supabase Auth)
- 📍 **Service Area Validation** - Zip code verification for service availability

### Admin Dashboard
- 👥 **Customer Management** - CRM with full customer profiles
- 📋 **Waitlist Management** - Track and convert pre-launch signups
- 💰 **Quote Tracking** - Manage quote requests and follow-ups
- 📊 **Business Analytics** - Stats on customers, subscriptions, and revenue
- 🌐 **Content Management System** - Edit website content without code changes
- 📍 **Service Locations** - Manage serviceable cities and zip codes

### Technical Features
- 🔐 **Dual Authentication** - Admin (JWT) + Customer (Supabase Auth)
- 💳 **Stripe Integration** - Subscription payments and one-time charges
- 📧 **Email Automation** - Transactional emails via MailerSend
- 🔗 **Sweep&Go API Integration** - Optional third-party service integration
- 📱 **Responsive Design** - Mobile-first UI with Tailwind CSS + shadcn/ui
- 🗄️ **PostgreSQL Database** - Type-safe ORM with Drizzle

## Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS
- **shadcn/ui** - High-quality React components
- **Wouter** - Lightweight routing
- **React Query** - Data fetching and caching

### Backend
- **Node.js 20** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **Drizzle ORM** - Database toolkit
- **PostgreSQL** - Database

### Services
- **Supabase** - Authentication and user management
- **Stripe** - Payment processing
- **MailerSend** - Email delivery
- **Neon Database** - Serverless PostgreSQL (recommended)

## Quick Start

See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) for detailed setup instructions.

### 1. Clone and Install

```bash
git clone https://github.com/Kellum/Dook-Scoop-Em.git
cd Dook-Scoop-Em
npm install
```

### 2. Setup Environment Variables

```bash
cp .env.example .env
# Edit .env with your credentials
```

Required variables:
- `DATABASE_URL` - PostgreSQL connection string
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `MAILERSEND_API_KEY` - MailerSend API key

### 3. Initialize Database

```bash
npm run db:push
```

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:5000`

## Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Run production server
npm run check      # Type check
npm run db:push    # Push schema changes to database
```

## Project Structure

```
├── client/              # Frontend React application
│   └── src/
│       ├── components/  # React components
│       ├── pages/       # Page components
│       └── lib/         # Utilities and hooks
├── server/              # Backend Express application
│   ├── index.ts        # Entry point
│   ├── routes.ts       # API routes
│   ├── db.ts           # Database connection
│   ├── storage.ts      # Database operations
│   ├── auth.ts         # Authentication logic
│   └── stripe.ts       # Stripe integration
├── shared/              # Shared code between frontend/backend
│   └── schema.ts       # Database schema and types
└── attached_assets/     # Static assets
```

## Database Schema

The application uses PostgreSQL with the following main tables:

- **users** - Admin authentication
- **customers** - Customer CRM data
- **subscriptions** - Stripe subscription tracking
- **visits** - Service visit scheduling
- **charges** - Payment history
- **waitlist_submissions** - Pre-launch signups
- **quote_requests** - Service quote tracking
- **onboarding_submissions** - Customer onboarding data
- **service_locations** - Serviceable areas
- **pages** - CMS pages
- **page_content** - CMS content blocks
- **seo_settings** - SEO metadata
- **media_assets** - Media library

See `shared/schema.ts` for complete schema definitions.

## API Documentation

### Public Endpoints
- `POST /api/waitlist` - Join waitlist
- `POST /api/quote` - Request service quote
- `POST /api/onboard` - Customer onboarding
- `POST /api/contact` - Contact form
- `POST /api/validate-zip` - Check service area
- `GET /api/locations` - Get service locations

### Admin Endpoints (require admin auth)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/stats` - Business statistics
- `GET /api/admin/customers` - Customer list
- `GET /api/admin/waitlist` - Waitlist submissions
- `GET /api/admin/quotes` - Quote requests
- CMS endpoints (`/api/cms/*`)

### Customer Endpoints (require customer auth)
- `GET /api/customer/subscription` - Get subscription details

### Stripe Webhooks
- `POST /api/stripe/webhook` - Stripe event handler

## Environment Variables Reference

See `.env.example` for all required and optional environment variables.

## Deployment

### Prerequisites
- Node.js 20+
- PostgreSQL database
- Supabase project
- Stripe account
- MailerSend account

### Build for Production

```bash
npm run build
npm run start
```

### Recommended Hosting
- **Backend**: Railway, Render, Fly.io
- **Database**: Neon, Supabase, Railway
- **Frontend**: Included in backend (static serving)

## Contributing

This is a private business application. Contact the owner for contribution guidelines.

## License

MIT License - See LICENSE file for details

## Support

For issues or questions:
- Check [CHECKPOINT.md](./CHECKPOINT.md) for current project status
- Check [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) for setup instructions
- Review code documentation in source files
- Contact: ryan@dookscoop.com
