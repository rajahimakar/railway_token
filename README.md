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

## Project Files

- [railway_token_dashboard.html](railway_token_dashboard.html) — main dashboard UI and interaction logic
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
http://localhost:8000/railway_token_dashboard.html
```

## Notes

- This is a static front-end prototype.
- The dashboard stores sample data in the browser and updates the UI dynamically.
- It is suitable for demo purposes and can later be connected to a real database or API backend.

## Suggested Next Step

If you want to extend this into a real production system, the next upgrades would be:
- database integration (SQLite, MySQL, or Postgres)
- login for admin and staff
- real-time gate scanner integration
- exportable reports and analytics
- API support for gate hardware or QR scanners
