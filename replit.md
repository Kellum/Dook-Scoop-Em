# Overview

Dook Scoop Em is a professional pet waste removal service with a React-based landing page, waitlist functionality, and admin panel. This is a coming-soon website that allows potential customers to join a waitlist while the service prepares to launch. The application features a modern, responsive design built with React, TypeScript, and Tailwind CSS, backed by a Node.js/Express server with PostgreSQL database integration.

## Recent Changes (January 2025)

- **Admin Authentication System**: Added JWT-based admin login system with bcrypt password hashing
- **Admin Dashboard**: Created comprehensive admin panel to manage service locations and view waitlist submissions  
- **Database Migration**: Migrated from in-memory storage to PostgreSQL database using Drizzle ORM
- **Service Locations Management**: Admin can now manually add new service areas with zip codes and launch dates
- **Admin Access**: Login at `/admin/login` with username: `admin` and password: `DookScoop2025!`

# User Preferences

Preferred communication style: Simple, everyday language.

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