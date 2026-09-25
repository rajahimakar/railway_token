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

## Architecture and process notes

This project intentionally uses a single-page front-end with browser-local state to keep the operational workflow easy to demo and validate. The central idea is to model station operations in a way that is understandable to staff while still supporting role-based permissions and pricing logic.

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
