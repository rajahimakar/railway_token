# Zero-Cost Live App Blueprint

## Goal

Move the railway token dashboard from a browser-only prototype to a live, real-world demo using a free-tier architecture that can still evolve into a production workflow.

## Recommended stack

- Frontend: Vercel
- Database: Supabase Postgres
- Authentication: Supabase Auth
- API: Supabase Edge Functions or a tiny Node API
- Source control: GitHub

## Why this is the best first step

This route gives us:

- a live app URL
- persistent records instead of browser-local storage
- role-based login and access control
- real token history and audit tracking
- future-ready patterns without immediate infrastructure cost

It aligns with the current demo while letting the team grow into a fuller live operations app later.

## Architecture

### Frontend layer
- deploy the current dashboard UI to Vercel
- keep the same booking / token / overview flows
- connect to the database through API calls rather than browser-only state

### API layer
- create a small set of backend endpoints for:
  - login
  - fetch active tokens
  - create token
  - complete token
  - fetch history
  - fetch alerts
  - resolve notifications
  - read/update cost settings

### Persistence layer
- records are stored in Postgres tables instead of localStorage
- active and historical states are separated clearly
- every token action is recorded in an audit log

### Authorization layer
- roles are enforced server-side
- admin, site owner, site employee, and business users get different access scopes
- the UI should still hide controls, but the API must protect the data

## Free-tier constraints to respect

Keep the first release intentionally simple:

- no heavy analytics pipelines
- no realtime dashboard fanout yet
- no large file/media storage
- no SMS provider until the app needs it
- basic notification records rather than push notifications

## Database plan

Use the following core tables:

1. profiles
   - user identity and employee details
2. roles
   - role definitions
3. vehicles
   - vehicle metadata, if needed later
4. tokens
   - active and completed token entries
5. token_history
   - audit trail for lifecycle changes
6. notifications
   - overdue and follow-up alerts
7. cost_settings
   - hourly and monthly pricing, grace period
8. audit_logs
   - all create/update/delete events

## MVP data flow

1. User logs in with Supabase Auth.
2. Profile row is read to determine role.
3. Dashboard loads active tokens and current alerts from the database.
4. Token creation writes to tokens and creates a history row.
5. Token completion writes a final exit time and marks the record complete.
6. Overdue logic checks elapsed time against paid time + grace period.
7. The backend creates owner and employee notifications when the rule triggers.
8. Owner/employee review tables read alert rows from notifications.

## Notification rule

Use a central business rule:

- paid_minutes + grace_period_minutes < elapsed_minutes
- if true, create overdue alert records
- create one owner notification
- create one employee notification
- store review status and resolved timestamp

## Deployment workflow

1. Create GitHub repo and push code.
2. Create Supabase project.
3. Run schema SQL migration.
4. Create environment variables in Vercel.
5. Deploy frontend with Vercel.
6. Connect to Supabase API.
7. Validate login, token creation, and token history flow.
8. Verify owner and employee alert entries.

## Suggested milestones

### Milestone 1 — live demo
- login works
- token create works
- history tracked
- alerts visible

### Milestone 2 — operational realism
- owner review table
- employee queue table
- resolved/closed alert status
- role-based permission checks in API

### Milestone 3 — production-minded growth
- advanced filters
- reporting/export
- better audit workflow
- stronger security policy

## Recommended next action

Create the SQL schema and project environment setup first. Once that is in place, the frontend can be switched from browser-local storage to live API calls without changing the user flow.
