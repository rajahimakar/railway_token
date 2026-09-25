# Architecture Process Documentation

## Purpose

This project was designed to simulate a real railway token operations workflow while staying lightweight enough for stakeholder review, live demo validation, and a low-cost production-like rollout. The architecture balances a convincing user experience with a practical path to a lived database-backed app.

## Current architecture

### 1. Frontend structure
The app is implemented as a Next.js application with a role-aware operations interface.

Core frontend pages include:
- [app/login/page.js](app/login/page.js) — secure access flow and demo identity selection
- [app/dashboard/page.js](app/dashboard/page.js) — overview dashboard and operational summary
- [app/parking/page.js](app/parking/page.js) — site-based parking board with occupancy and status indicators
- [app/tokens/page.js](app/tokens/page.js) — active token management table with issue/complete actions
- [app/history/page.js](app/history/page.js) — complete transaction history with search and payment status
- [app/costs/page.js](app/costs/page.js) — owner pricing and grace-period configuration
- [app/overdue/page.js](app/overdue/page.js) — owner and employee overdue queues
- [app/notifications/page.js](app/notifications/page.js) — open alert and resolved/closed history

This layout keeps the original railway operations feel while splitting the user flow into the same operational layers a real station team would use: overview, parking, tokening, cost management, and review.

### 2. Routing and access model
The app uses a protected-route flow in [middleware.js](middleware.js) to redirect unauthenticated users to the login page.

Protected screens include:
- dashboard
- parking
- tokens
- history
- costs
- overdue
- notifications

This helps maintain a realistic access model where only valid sessions can use the operational pages.

### 3. API and database integration
The live application can read and write vehicle and token data through [app/api/tokens/route.js](app/api/tokens/route.js).

The persistence model is defined in [supabase_schema.sql](supabase_schema.sql), with live DB access managed through [lib/server-supabase.js](lib/server-supabase.js). Core tables include:
- profiles
- roles
- tokens
- token_history
- costs
- notifications
- audit_logs

This provides a realistic base for live operational data while still keeping the solution lightweight for stakeholder demos.

### 4. Business flow model
The app is structured around the actual business workflow expected by a railway operations team:
1. issue a token
2. track the site occupancy and zone status
3. review active token conditions
4. assess grace-window and overdue risk
5. resolve or close alerts
6. review ticket history and payment records

That structure is what makes the product feel authentic rather than like a generic dashboard mock.

### 5. Role separation
The current demo includes owner and employee paths:
- owner: costs, policy settings, historical review, operation oversight
- employee: operational queue, parking monitoring, token status follow-up

The design supports a realistic separation of duties without requiring a heavy enterprise system at this stage.

## Why this route was chosen

### Low-friction live demo
A Vercel + Supabase approach was chosen because it gives the app a real web app feel without introducing major infrastructure cost or setup complexity.

### Realistic stakeholder validation
The app needed to look and behave like a live station operations tool, not just a static mock. That reduces risk and helps confirm the business model before investing deeper in production architecture.

### Progressive maturity
The current build is not a final production system, but it follows the correct path for a live demo: UI realism, DB-backed persistence, role-aware flows, and operational logic.

## Constraints and trade-offs

- The login flow remains a demo-oriented session model rather than full production authentication.
- The data access layer is live but still intentionally lightweight.
- Security is more permissive than production-grade and should be hardened before external business rollout.
- The visual design is operationally realistic, but still built for stakeholder review and product validation.

## Current architecture summary

### Presentation layer
- Next.js app router pages for dashboard and operational views
- realistic station and parking dashboard design
- owner and employee role views

### Application layer
- Next.js route handlers and demo session logic
- business logic for pricing, overdue, notifications, and resolved history

### Persistence layer
- Supabase/PostgreSQL database structure
- live tokens, costs, notifications, and history model

### Security stage
- demo session route protection for live validation
- future improvement: Supabase Auth with stronger role enforcement and production RLS

## Recommended next step

The next milestone is to tighten the access model and move from demo-auth to production-grade identity management.

Planned steps:
1. replace demo session logic with Supabase Auth
2. enforce role-based access more strictly across backend APIs
3. harden RLS rules for production use
4. add audit trail and full token lifecycle tracking
5. prepare a public deployment checklist and release notes

## Completed state

The project now includes:
- authentic railway operations UI
- live routing and protected pages
- token management and history views
- parking occupancy board with site status colors and layout indicators
- cost and overdue logic
- database-backed data flow for demo validation

The architecture is therefore suitable for stakeholder demo, validation, and next-step production hardening.
