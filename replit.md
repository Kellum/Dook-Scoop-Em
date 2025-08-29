# Overview

Dook Scoop 'Em is a professional pet waste removal service featuring a premium Apple-style neumorphic web interface with subtle retro gaming accents. The brand combines sleek modern design with playful pixel art elements, creating a unique identity that balances professionalism with approachable personality. The slogan "We fear no pile" captures both confidence and humor.

## Recent Changes (January 2025)

- **Full Website Structure Built**: Expanded from single waitlist page to complete business website
- **Waitlist as Homepage**: Kept current waitlist functionality as main landing page while building full site
- **Complete Page Architecture**: Added Residential, Commercial, How We Scoop, Products We Use, Blog, About Us, and Contact pages
- **Professional Navigation**: Built responsive navigation component with mobile-first design
- **Global Footer**: Added footer with social media links (Facebook/Instagram), contact info, and business details
- **Consistent Design System**: All pages maintain Apple-style neumorphic design with humor and professional tone
- **Sweep & Go Integration Ready**: Prepared integration points for future checkout and signup system
- **Mobile Optimized**: Full responsive design across all new pages with clickable mobile interfaces

# User Preferences

Preferred communication style: Simple, everyday language.
Design preference: Apple-style neumorphic design with subtle retro gaming accents, premium feel with playful touches.
Brand identity: Professional pet waste removal service that's approachable and friendly, not overly corporate.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent, professional UI components
- **Routing**: Wouter for lightweight client-side routing with full website navigation
- **Components**: Modular Navigation and Footer components used across all pages
- **Page Structure**: Complete business website with service pages, blog, about, and contact sections
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
- **Service Locations Table**: Geographic service areas with zip codes and launch dates
- **Pages Table**: CMS page management (id, slug, title, status, timestamps)
- **Page Content Table**: Editable content blocks (id, pageId, elementId, contentType, content, metadata)
- **SEO Settings Table**: Complete SEO management (meta tags, Open Graph, structured data, custom meta)
- **Media Assets Table**: File upload and asset management with metadata
- **Validation**: Zod schemas ensure data integrity across all tables

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

# Website Structure

## Current Page Architecture
- **Home (/)**: Waitlist landing page (LandingMinimal component) - primary customer entry point
- **Residential (/residential)**: Home service offerings and pricing
- **Commercial (/commercial)**: Business and property management services  
- **How We Scoop (/how-we-scoop)**: Process explanation and methodology
- **Products We Use (/products-we-use)**: Equipment and cleaning product details
- **Blog (/blog)**: Content marketing and educational articles
- **About Us (/about-us)**: Company story, values, and team information
- **Contact (/contact)**: Contact form and business information
- **Admin Routes**: Dashboard and login for business management

## Design Consistency
- **Neumorphic Design**: All pages use consistent Apple-style neumorphic elements
- **Color Scheme**: Orange accent colors (#ea580c, #c2410c) with gray neutrals
- **Typography**: Bold, black font weights maintaining professional yet approachable tone
- **Humor Integration**: Maintains "We fear no pile" personality across all content
- **Mobile-First**: Responsive design with enhanced mobile interactions

## Future Integration Points

### Sweep & Go API Integration
- **Customer Onboarding**: Convert waitlist submissions to Sweep & Go client records
- **Service Scheduling**: Direct integration with Sweep & Go routing and scheduling system
- **Payment Processing**: Integrate Sweep & Go's billing and payment workflows
- **Service Management**: Real-time service updates and customer communication
- **Route Optimization**: Leverage Sweep & Go's territory and route planning tools

### Planned Features
- **Online Signup**: Replace waitlist with direct service signup using Sweep & Go API
- **Customer Portal**: Account management and service history via Sweep & Go integration
- **Payment Gateway**: Secure payment processing through existing Sweep & Go infrastructure
- **Service Tracking**: Real-time updates and notifications for service visits
- **Automated Billing**: Subscription management and automated invoicing