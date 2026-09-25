# Architecture Process Documentation

## Purpose

This project is a front-end railway token dashboard designed to simulate a station operations workflow for token issuance, parking tracking, fee configuration, and historical review. The goal was to build a realistic demo interface with operational logic that is easy to understand and validate without needing a backend.

## Current architecture

### 1. UI shell
- The app is rendered from a single HTML page in [index.html](index.html).
- All key screens are toggled by JavaScript based on a tab and modal pattern.
- The main layout is structured for fast access to overview, parking, token, cost, and history views.

### 2. State management
- The application maintains a single in-browser `database` object.
- This contains current user state, sample token records, cost configuration, and transaction history.
- Session data is persisted in `localStorage` so a user remains signed in across reloads in the demo environment.

### 3. Role-based access
- Permissions are determined by predefined role maps.
- Different roles can access different sections such as overview, parking, tokens, costs, and revenue views.
- This keeps the demo aligned with real-world operational separation while remaining lightweight.

### 4. Business logic
- Cost calculation is handled in JavaScript functions.
- Hourly fees, daily caps, and monthly pass pricing are centrally managed.
- Token lifecycle functions update active, completed, and historical records in a single flow.

## Why this route was chosen

### Single-page front-end
The project used a single-page architecture because the requirement was operational demonstration rather than full backend deployment. This route reduces complexity, speeds up iteration, and makes the prototype easy to host with a static file server.

### Vanilla JavaScript instead of a framework
A framework would add setup overhead and unnecessary complexity for a small mockup. Vanilla JavaScript keeps the app portable, transparent, and easier for stakeholders to inspect and modify during early evaluation.

### Browser-local persistence
Using browser state and `localStorage` was chosen so the prototype does not require a database or API during design validation. It is enough to simulate login flow, token updates, and calculations while keeping the demo self-contained.

## Constraints and trade-offs

- No real authentication provider is implemented.
- No server-side storage or audit trail exists yet.
- Pricing and records are sample data, not production-grade data.

## Target live architecture

### 1. Presentation layer
- A modern frontend framework such as React or Next.js will replace the static HTML shell.
- Views remain aligned to current flows: overview, parking, tokens, costs, alerts, history, owner review, and employee queue.

### 2. Application layer
- A backend API will own business rules such as token creation, exit completion, overdue evaluation, and access control.
- The API will validate rules before data is written, preventing browser manipulation.

### 3. Persistence layer
- A relational database will store all system state.
- Recommended database: PostgreSQL for production readiness.
- Entities should include users, vehicles, parking sessions, tokens, costs, audit logs, notifications, and review actions.

### 4. Authentication and authorization
- Logins should be backed by secure authentication.
- Role permissions should be enforced on the server, not only in the client.
- Owner and employee review windows should be permission-scoped and logged for accountability.

### 5. Auditing and history
- Every token creation, exit, payment adjustment, overdue alert, and review action should create a row in the audit log.
- This preserves the full operational timeline even if the current record is later changed.

### 6. Notifications
- The system should evaluate overdue state based on paid duration plus the grace period.
- Owner alerts and employee notifications should be generated from a central rule engine and stored in a notification table.

## Recommended data model

### Core tables
- users
- roles
- vehicles
- parking_tokens
- token_history
- payments
- site_settings
- notifications
- audit_logs

### Example transaction flow
1. Staff creates a parking token.
2. The backend validates vehicle, spot, and role permissions.
3. The token is persisted in the database with a created timestamp and paid time window.
4. The system computes elapsed time against the active token.
5. When the stay exceeds the paid window plus grace period, the overdue rule triggers owner and employee notifications.
6. The history and audit tables preserve every state change for later review.

## Recommended next step

The next step is to move the current prototype into a full-stack version with a persistent database and API. This keeps the same operational logic while replacing browser-local state with a secure, auditable, and extensible platform.

## Phase 1: zero-cost live app architecture

### Deployment plan
- Use Vercel to host the frontend
- Use Supabase as the database and auth provider
- Keep the application logic in a minimal API layer
- Preserve the same operations flow while moving records from local storage to database tables

### Why this route is chosen
This is the fastest practical path to a real live application without paying for infrastructure upfront. It keeps the current operational model intact while introducing real persistence and role-based authorization.

### Phase 1 scope
- login and user role lookup
- token creation and completion
- audit record storage
- history retrieval for token lifecycle
- overdue detection using paid time + grace period
- owner and employee notifications stored in a notification table

### Phase 1 exclusions
- large-scale analytics
- SMS or email delivery at production scale
- advanced queueing infrastructure
- high-volume realtime sync

This phased approach keeps the project lightweight, cost-conscious, and easy to extend.
