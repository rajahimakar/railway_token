# Architecture Process Documentation

## Purpose

This project evolved from a static railway token prototype into a live demo web application. The goal is to preserve the original operational workflow while moving it into a real data-backed system that can be tested in a zero-cost production-like environment.

## Current architecture

### 1. Frontend application
- The app is currently implemented as a Next.js frontend in [app/page.js](app/page.js), [app/login/page.js](app/login/page.js), [app/dashboard/page.js](app/dashboard/page.js), and [app/costs/page.js](app/costs/page.js).
- The design retains the original railway operations look and feel while making the app act like a demo business dashboard rather than a purely static mock.
- The root route redirects to the login page, and the dashboard flow is grouped around overview, costs, and operational monitoring views.

### 2. API layer
- The app uses server-side route handlers under [app/api/tokens/route.js](app/api/tokens/route.js) for live token reads and writes.
- This API is the bridge between the frontend and the database and acts as the point where validation and persistence happen.
- The API path is designed to support a future business-user workflow while staying lightweight for the current live demo stage.

### 3. Data layer
- The persistent data model is defined in [supabase_schema.sql](supabase_schema.sql).
- Core tables include:
  - roles
  - profiles
  - cost_settings
  - tokens
  - token_history
  - notifications
  - audit_logs
- This gives the project a real operational structure rather than browser-only sample state.

### 4. Database access and security
- The project uses Supabase as the live database provider.
- The connection logic is centralized in [lib/server-supabase.js](lib/server-supabase.js).
- RLS and policy setup are handled in [supabase_policies.sql](supabase_policies.sql).
- The policy layer is intentionally permissive for the current demo stage, so the app can be tested live without blocking database access while the workflow is still being validated.

### 5. Authentication approach
- The current app uses a demo login flow in [app/login/page.js](app/login/page.js) for front-end validation and stakeholder walkthroughs.
- This is not yet the final production auth design; it is a placeholder to preserve the original operational feel while the app is being moved toward a live system.
- The business-ready next step is a proper Supabase Auth implementation with role-based access and route protection.

### 6. Business logic and live rules
- Cost tracking is represented in the pricing page at [app/costs/page.js](app/costs/page.js).
- Token and alert data can be created and read through the live API.
- The operations model preserves the original workflow of:
  - creating a token
  - tracking active vehicles
  - reviewing costs
  - checking overdue conditions
  - showing operational summaries

## Why this route was chosen

### Zero-cost live demo path
This project selected a low-friction live architecture using Vercel + Supabase because it allows the app to behave like a real web app without incurring heavy infrastructure costs.

### Fast validation of real workflow
The main purpose was to validate the business model in a live environment with real database reads and writes before committing to deeper production work.

### Preservation of original demo design
The app keeps the station operations UI, blue-gray design language, and login portal feel so the experience remains familiar and authentic for stakeholder review.

## Constraints and trade-offs

- The login flow is still demo-oriented and not production-authenticated.
- The project currently depends on permissive demo policies; these should be tightened later.
- The code is structurally aligned to live deployment, but not yet hardened for broad public business-user access.
- Some pages remain demonstration-style rather than full operational admin screens.

## Current live architecture summary

### Presentation layer
- Next.js pages for login, dashboard, and cost management
- Vercel-hosted frontend deployment

### Application layer
- Next.js API routes for token operations
- Server-side Supabase client

### Persistence layer
- PostgreSQL tables in Supabase
- live token and notifications records

### Authorization stage
- Demo login and flow simulation for stakeholder testing
- Production auth should be added next with Supabase Auth and risk-based route guards

## Current deployment path

### Production-like release path
- Use Vercel to host the frontend
- Use Supabase as the live database layer
- Keep the app lightweight while the workflow is validated

### Current state
- Live deployment is already active in Vercel
- Supabase tables are seeded and accessible through the API
- The app can be tested end-to-end with live token creation and retrieval

## Recommended next step

The next major step is to move from demo-safe access to real business-user authentication and role separation.

Planned progression:
1. replace demo login with Supabase Auth
2. enforce role-based access for owner vs employee flows
3. add backend-side overdue logic and notification generation
4. tighten RLS for production safety
5. finalize a public release checklist

## Phase 1 completed state

### Included
- Vercel-hosted live app path
- Supabase schema and database-backed operations
- token API access and live records
- dashboard and cost review screens
- demo login and operational UI flow

### Not yet complete
- secure production auth
- real role enforcement across all endpoints
- complete owner/employee workflow separation
- production-grade security policy hardening

This is a valid live demo architecture, but not yet a full production authorization model.
