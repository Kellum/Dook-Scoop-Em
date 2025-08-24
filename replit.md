# Overview

Dook Scoop 'Em is a professional pet waste removal service featuring a premium Apple-style neumorphic web interface with subtle retro gaming accents. The brand combines sleek modern design with playful pixel art elements, creating a unique identity that balances professionalism with approachable personality. The slogan "We fear no pile" captures both confidence and humor.

## Recent Changes (January 2025)

- **Comprehensive CMS System**: Built full content management system with visual editor, click-to-edit functionality, and live preview
- **Database Schema Expansion**: Added pages, pageContent, seoSettings, and mediaAssets tables for complete CMS functionality
- **Visual Editor Interface**: Implemented drag-and-drop visual editor with inline editing, color picker, and real-time content updates
- **Admin Dashboard Enhancement**: Added "Content Manager" button linking to `/admin/cms` with full page management capabilities
- **SEO Management**: Built comprehensive SEO settings with meta tags, Open Graph, structured data, and custom meta management
- **Editable Landing Page**: Added data-editable attributes to key elements enabling click-to-edit functionality
- **Page Management**: Created system to create, edit, delete pages with draft/published status management
- **Media Management**: Established foundation for asset management and image upload functionality
- **Content Versioning**: Built content update system with automatic timestamping and change tracking
- **Authentication Integration**: All CMS endpoints protected with JWT authentication and admin role requirements

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