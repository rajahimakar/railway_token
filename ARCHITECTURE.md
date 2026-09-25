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

## Recommended next step

The next step should be a backend migration to a real API with a database, secure session handling, and role-based authentication. That will turn the current prototype into a production-ready operational system.
