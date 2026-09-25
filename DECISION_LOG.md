# Decision Log

## Decision 1: Keep the operations workflow realistic from the start

### Why
The product needed to feel like a working station operations tool, not a generic CRUD screen.

### Reasoning
- Stakeholders judge the design by operational realism.
- A credible login flow, parking overview, token table, cost controls, and history review create trust quickly.
- The app needed to resemble a real railway command board rather than a static mock.

### Trade-off
This required more screen design and route planning upfront, but it shortens the path to demo confidence and business validation.

## Decision 2: Add a proper operational structure instead of packaging everything into a single dashboard

### Why
The workflow needed distinct views for overview, parking, token management, cost review, and history tracking.

### Reasoning
- A single screen becomes noisy and harder to read for active operational tasks.
- Real station teams separate task types into focused boards and tables.
- Splitting the app into meaningful screens improves clarity and realism.

### Trade-off
This increases page count and navigation complexity, but it makes the interface much more believable and easier to use.

## Decision 3: Make the parking view a site operations board

### Why
Parking is a core business function and should not be treated as a simple count.

### Reasoning
- Occupancy by site is more useful than a generic vehicle total.
- Site status colors help operators spot pressure quickly.
- A small layout grid makes the board feel operational rather than informational.

### Trade-off
This introduces more front-end structure than a basic list, but it better matches the railway use case.

## Decision 4: Use a token management screen modeled after real operating tables

### Why
Token activity is a central operational workflow and should look like a control table.

### Reasoning
- Operators review token IDs, vehicles, entry times, current status, and actions in one place.
- This is closer to how actual station control desks work.
- The screen helps reflect both live activity and completion actions.

### Trade-off
We accept a more table-heavy UI, but it is much more actionable than a dashboard-card-only view.

## Decision 5: Keep history as a searchable operational archive

### Why
This project needs to show not only live activity but also completed records.

### Reasoning
- Historical record review is essential for reconciliations and stakeholder trust.
- A searchable archive supports operational follow-up without forcing users to scan the entire token log.
- It matches real admin workflows for audit and review.

### Trade-off
The history page is intentionally more structured than a flat feed, which is the right trade-off for operational clarity.

## Decision 6: Use a low-cost live architecture first

### Why
The team needed a usable live app while keeping costs low.

### Reasoning
- Vercel + Supabase gives a real app path with minimal setup friction.
- It allowed token records, costs, and alert data to be tested live.
- This makes the project move beyond static prototype behavior without committing to a large production stack too early.

### Trade-off
It is still a lightweight system and not yet a hardened public production deployment.

## Decision 7: Separate owner and employee flows

### Why
The business has different responsibilities across roles.

### Reasoning
- The owner requires control over pricing, policy, and review.
- The employee needs operational access to parking and relevant queues.
- Role-aware navigation improves credibility and reduces confusion.

### Trade-off
This creates a few extra condition-based UI branches, but it is the more realistic system design.

## Decision 8: Keep business logic and UI aligned with real operations rules

### Why
The project should not just look realistic; it must behave like a station operations system.

### Reasoning
- Grace period logic, overdue thresholds, token completion, and resolved queue management all matter to the business flow.
- The UI is therefore not just cosmetic; it reflects actual operating policy.

### Trade-off
This makes the app more decision-driven and slightly more complex, but it brings it closer to true operational readiness.

## Conclusion

The product has evolved from a basic mockup into a realistic railway operations system prototype. The architecture now includes a live app structure, role-based screens, parking control views, token management, history review, and database-backed data flow. These decisions were intentionally made to improve business trust, product realism, and the likelihood of a successful next-phase production hardening effort.
