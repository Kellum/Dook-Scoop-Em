# Overview

Dook Scoop 'Em is a professional pet waste removal service featuring a premium Apple-style neumorphic web interface with subtle retro gaming accents. The brand combines sleek modern design with playful pixel art elements, creating a unique identity that balances professionalism with approachable personality. The slogan "We fear no pile" captures both confidence and humor.

## Recent Changes (January 2025)

- **Minimal Go-Live Landing Page**: Created streamlined landing page with "WE FEAR NO PILE" pixel font header
- **Font System Update**: Switched to Roboto Black as primary font family with pixel fonts for headers
- **New Pixel Art Logo**: Integrated custom brown pixel art logo with proper rendering
- **Enhanced Waitlist Form**: Added comprehensive form with first/last name, phone, zip, dog slider (1-4+), referral source, and comical urgency options
- **Social Media Integration**: Added Facebook and Instagram links
- **Database Schema**: Extended waitlist table with referralSource and urgency fields
- **Simplified Navigation**: Hidden complex site features for clean go-live experience
- **Admin Access**: Login at `/admin/login` with username: `admin` and password: `DookScoop2025!`

# User Preferences

Preferred communication style: Simple, everyday language.
Design preference: Apple-style neumorphic design with subtle retro gaming accents, premium feel with playful touches.
Brand identity: Professional pet waste removal service that's approachable and friendly, not overly corporate.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent, professional UI components
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and API caching
- **Form Handling**: React Hook Form with Zod validation for type-safe form validation
- **Build Tool**: Vite for fast development and optimized production builds

## Backend Architecture
- **Runtime**: Node.js with Express.js web framework
- **Language**: TypeScript for full-stack type safety
- **API Design**: RESTful API endpoints with JSON responses
- **Database Integration**: Drizzle ORM for type-safe database operations
- **Email Service**: Nodemailer for sending notification emails when users join the waitlist

## Data Storage
- **Database**: PostgreSQL as the primary database
- **ORM**: Drizzle ORM with schema-first approach for type safety
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Fallback Storage**: In-memory storage implementation for development/testing

## Database Schema
- **Users Table**: Basic user authentication structure (id, username, password)
- **Waitlist Submissions Table**: Customer information (id, name, email, address, phone, numberOfDogs, submittedAt)
- **Validation**: Zod schemas ensure data integrity and provide client/server validation

## Authentication & Security
- **Session Management**: Uses connect-pg-simple for PostgreSQL-backed sessions
- **Form Validation**: Client-side validation with React Hook Form and server-side validation with Zod
- **Environment Variables**: Secure configuration for database connections and email credentials

## Development & Deployment
- **Development Server**: Vite dev server with HMR for frontend, tsx for backend development
- **Build Process**: Vite for frontend bundling, esbuild for backend compilation
- **Code Quality**: TypeScript strict mode, ESLint configuration
- **Responsive Design**: Mobile-first approach with Tailwind CSS breakpoints

# External Dependencies

## Database & Storage
- **Neon Database**: Serverless PostgreSQL hosting platform
- **Drizzle ORM**: Type-safe database toolkit and query builder
- **connect-pg-simple**: PostgreSQL session store for Express sessions

## Email Services
- **Nodemailer**: Email sending capability for waitlist notifications
- **Gmail SMTP**: Email service provider (configurable via environment variables)

## UI & Design System
- **shadcn/ui**: Comprehensive React component library built on Radix UI
- **Radix UI**: Unstyled, accessible UI primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Modern icon library
- **Google Fonts**: Inter font family for typography

## Development Tools
- **Vite**: Build tool and development server
- **TanStack Query**: Data fetching and caching library
- **React Hook Form**: Form state management and validation
- **Wouter**: Lightweight routing library
- **Date-fns**: Date utility library

## Replit Integration
- **Replit Vite Plugins**: Runtime error modal and cartographer for development
- **Replit Development Banner**: Automatic banner injection for external development access