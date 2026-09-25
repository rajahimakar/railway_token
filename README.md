# Railway Station Token Dashboard

A lightweight railway station dashboard for tracking parking usage, active tokens, vehicle occupancy, and cost management. This project is a front-end prototype built in a single HTML file and designed for admin monitoring of gate activity and parking operations.

## Overview

The dashboard helps staff and admins:
- monitor live active tokens
- track parked vehicles and station occupancy
- review parking costs and charge configuration
- issue new tokens from the admin UI
- complete token sessions when vehicles exit
- search and review token and history records

## Live web app direction

The current app is still a prototype, but the next product phase should move from browser-local state to a real persisted system. The most practical live architecture is a web application with:

- a frontend app for dashboard and operations views
- a backend API for token, vehicle, and audit operations
- a relational database for persistence and historical tracking
- secure user authentication and role-based access
- notification services for overdue vehicles and owner/employee review tasks

This allows the project to keep the current operational workflow while adding real records, accountability, and reporting.

## Recommended solution

### Preferred architecture
Use a lightweight full-stack stack:

- Frontend: React or Next.js
- Backend: Node.js with Express or Next.js API routes
- Database: PostgreSQL (or SQLite for early local development)
- ORM: Prisma
- Auth: secure session auth or Auth.js
- Hosting: Vercel + managed Postgres or Railway + managed DB

### Why this route
This gives the team a production path without jumping straight into a heavyweight enterprise system. It keeps the app easy to build and extend while also supporting audit trails, token history, payment tracking, and operational dashboards.

### Data to persist
At minimum, the live system should store:
- users and roles
- vehicle records
- parking or token sessions
- payment and grace-period logic
- token history and audit logs
- notifications and review status
- owner/employee follow-up actions

## Architecture and process notes

The product started as a single-page front-end with browser-local state to validate operations quickly. That was the correct demo route. The next step is to transition the model into a real web app while preserving the same business flow and role structure.

For the full process and rationale, see:
- [ARCHITECTURE.md](ARCHITECTURE.md) — architecture process and design choices
- [DECISION_LOG.md](DECISION_LOG.md) — decision log and reasons for the chosen route

## Project Files

- [index.html](index.html) — main dashboard UI, styling, and interaction logic
- [ARCHITECTURE.md](ARCHITECTURE.md) — architecture process documentation
- [DECISION_LOG.md](DECISION_LOG.md) — decision log
- [README.md](README.md) — project instructions and usage guide

## Features

- Overview summary cards for active tokens, parking, total vehicles, and revenue
- Tab-based layout for Overview, Parking, Tokens, Costs, and History
- Create-token modal for issuing new parking entries
- Search by vehicle, token, or spot
- Exit/complete flow for active tokens
- Cost configuration panel with editable hourly and fixed charges
- Responsive layout for desktop use

## Run Locally

From the project folder, start a local web server:

```bash
cd /workspaces/railway_token
python3 -m http.server 8000
```

Then open the app in your browser:

```text
http://localhost:8000/index.html
```

## Notes

- This is a static front-end prototype.
- The dashboard stores sample data in the browser and updates the UI dynamically.
- It is suitable for demo purposes and can later be connected to a real database or API backend.

## Suggested Next Step

If you want to extend this into a real production system, the next upgrades would be:
- database integration (SQLite, MySQL, or Postgres)
- role-based authentication and secure session handling
- real-time gate scanner integration
- exportable reports and analytics
- API support for gate hardware or QR scanners
