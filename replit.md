# Overview

SignalStack is a modern web application that tracks and curates AI-related news and product management resources. The platform provides a comprehensive daily AI tracker with filtering capabilities and a dedicated PM resources section. It's built as a full-stack web application designed to help Product Managers and AI enthusiasts stay up-to-date with the latest AI developments and access relevant PM resources.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The frontend is built with **React 18** and **TypeScript**, utilizing modern React patterns and hooks. The application uses **Vite** as the build tool and development server, providing fast hot module replacement and optimized builds.

**UI Framework**: The application implements **shadcn/ui** components built on top of **Radix UI primitives**, providing a consistent and accessible design system. **Tailwind CSS** is used for styling with custom CSS variables for theming.

**State Management**: The application uses **TanStack Query (React Query)** for server state management, handling data fetching, caching, and synchronization. Local state is managed with React's built-in `useState` and `useContext` hooks.

**Routing**: Client-side routing is handled by **wouter**, a lightweight routing library that provides a simple API for navigation.

## Backend Architecture

The backend is built with **Node.js** and **Express.js**, following RESTful API principles. The server provides endpoints for news items, PM resources, and filtering options.

**API Structure**: The application exposes REST endpoints under the `/api` prefix, with dedicated routes for news items (`/api/news`) and PM resources (`/api/pm-resources`). Each endpoint supports comprehensive filtering, pagination, and CRUD operations.

**Request Handling**: Custom middleware is implemented for request logging and error handling, providing detailed API interaction logs and standardized error responses.

## Data Storage Solutions

The application uses **Drizzle ORM** with **PostgreSQL** as the primary database solution. The database is configured to work with **Neon Database** as the serverless PostgreSQL provider.

**Schema Design**: The database schema includes three main tables:
- `users` - User authentication and management
- `news_items` - AI news articles with categorization and breakthrough scoring
- `pm_resources` - Product management resources with type and stage classification

**Data Validation**: **Zod** schemas are used in conjunction with Drizzle for runtime type validation and data sanitization.

**Development Storage**: A memory-based storage implementation (`MemStorage`) is provided for development and testing purposes, implementing the same interface as the database storage layer.

## Authentication and Authorization

The application includes a basic authentication system with user management capabilities. Session handling is implemented using **connect-pg-simple** for PostgreSQL-backed session storage.

**Security**: The system includes basic password-based authentication with plans for more robust security measures.

## Development and Build System

**Build Process**: The application uses a dual-build setup where Vite builds the frontend client and esbuild compiles the backend server for production deployment.

**Development Experience**: Hot module replacement is enabled for both frontend and backend development. The development server includes runtime error overlays and debugging capabilities through Replit-specific plugins.

**Type Safety**: Full TypeScript coverage across the entire codebase with shared type definitions between frontend and backend through a dedicated `shared` directory.

# External Dependencies

## Database Services
- **Neon Database** - Serverless PostgreSQL database hosting
- **Drizzle ORM** - TypeScript ORM for database operations
- **Drizzle Kit** - Database migration and schema management tools

## UI and Design System
- **Radix UI** - Comprehensive suite of accessible UI components
- **shadcn/ui** - Pre-built component library built on Radix UI
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library for consistent iconography

## Development and Build Tools
- **Vite** - Frontend build tool and development server
- **esbuild** - Fast JavaScript bundler for backend compilation
- **TypeScript** - Static type checking and development tooling
- **React** - Frontend JavaScript library

## Data and State Management
- **TanStack Query** - Server state management and data fetching
- **React Hook Form** - Form handling and validation
- **Zod** - Runtime schema validation
- **date-fns** - Date manipulation and formatting utilities

## Routing and Navigation
- **wouter** - Lightweight client-side routing library

## Session and Authentication
- **connect-pg-simple** - PostgreSQL session store for Express sessions

## Development Platform Integration
- **Replit** - Development platform integration with specialized Vite plugins for enhanced development experience