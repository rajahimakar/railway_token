# Decision Log

## Decision 1: Start with a realistic demo workflow instead of a raw prototype

### Why
The project needed to validate a railway operations flow in a way that felt credible to stakeholders.

### Reasoning
- The original interface needed strong business realism.
- The login, token, cost, and summary views create confidence in the operational model.
- A realistic UI helps the team validate assumptions before deeper engineering work.

### Trade-off
This design was intentionally stronger than a pure technical prototype, but not yet a full production system.

## Decision 2: Keep the original demo feel while moving toward live data

### Why
The product should preserve its recognizable railway dashboard identity even while becoming a live app.

### Reasoning
- The blue-gray railway portal tone and login layout are part of the business value.
- The same workflow can be preserved while moving from browser-only state to actual database-backed records.
- This reduces friction for stakeholder confidence and demo delivery.

### Trade-off
The visual style stays intentionally familiar, even while the architecture becomes more serious.

## Decision 3: Use a zero-cost live architecture first

### Why
The project needed a real live app without committing to a paid production stack immediately.

### Reasoning
- Vercel plus Supabase gives a fast public path.
- It supports live data testing without a complex backend setup.
- The solution is good enough for demo and early business validation.

### Trade-off
This is a lightweight architecture and not yet a hardened production platform.

## Decision 4: Move from browser-local state to a persisted relational model

### Why
The app needed records that survive reloads and support real operational review.

### Reasoning
- Static browser data is not suitable for a live business workflow.
- A relational model allows tokens, costs, notifications, and history to be tracked in a meaningful way.
- Database-backed records also make API testing and audit review possible.

### Trade-off
This introduces more complexity than the prototype, but it is necessary for a realistic live app.

## Decision 5: Use Supabase for persistence and live testing

### Why
The project needed a simple database and API layer that can run quickly.

### Reasoning
- Supabase gives PostgreSQL access with low setup friction.
- It allows a live token API and policy-based database security to be tested without an external backend service.
- It is a good fit for a zero-cost demo-to-live transition.

### Trade-off
Supabase is highly practical for this phase, but it still needs production hardening before full business-user rollout.

## Decision 6: Keep demo-stage security permissive while validating the app

### Why
The team needed the app to run live quickly while the DB and API path were still being validated.

### Reasoning
- The app needed the ability to create and query tokens live.
- RLS and grants were initially blocking access, and a controlled demo stage was the fastest route to unblock the workflow.
- This allowed validation of the end-to-end flow before tightening access rules.

### Trade-off
This is not production-safe security. It should be tightened before public business access is expanded.

## Decision 7: Treat the login and cost management pages as part of the live demo experience

### Why
The live app should retain the user experience expected by stakeholders and owners.

### Reasoning
- The login screen gives the app a credible operations interface.
- The cost management page lets the owner review and adjust pricing directly.
- These views support a business-facing demo and are aligned with the original design goals.

### Trade-off
They are still demo-oriented and need a real auth layer before being used in a production environment.

## Decision 8: Validate live data flow before treating the release as complete

### Why
The app should not be considered production-ready unless the full operational flow is proven.

### Reasoning
- Real token create and read checks were performed through the API.
- This confirms the path from app to database is functioning end-to-end.
- It gives confidence that the current live architecture works even if the auth layer is still being tightened.

### Trade-off
The data path is proven, but the business-user access model still needs production-level hardening.

## Conclusion

The project has now moved beyond the original browser-only prototype. It is operating in a live demo state using Next.js, Supabase, Vercel, and a real token API layer. The design still retains the original railway operations feel, but the architecture has evolved to a database-backed app that can be tested end-to-end. The next step is not to discard this direction, but to replace the demo auth and policy permissiveness with a production-grade owner/employee access model before broader public release.
