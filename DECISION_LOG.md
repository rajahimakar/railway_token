# Decision Log

## Decision 1: Use a single-page front-end prototype

### Why
The main goal was to validate station operations workflows quickly without requiring a full backend stack.

### Reasoning
- Rapid iteration is easier in a single HTML + JavaScript prototype.
- The app can be run locally with a simple web server.
- Stakeholders can review the workflow end-to-end without environment setup overhead.

### Trade-off
This approach does not provide persistence, security, or scalability beyond the demo scenario.

## Decision 2: Keep logic in browser-local state

### Why
The project needed to behave like an operational dashboard while staying self-contained.

### Reasoning
- `localStorage` makes session state visible and easy to test.
- The data model can evolve into a real API contract later.
- It reduces the risk of a broken build during early prototype evaluation.

### Trade-off
This is not suitable for production because browser data can be manipulated and is not secure.

## Decision 3: Model role-based permissions in the client

### Why
The app needs to resemble a station environment with different access categories.

### Reasoning
- Site owners, employees, business users, and master admins each need different levels of visibility.
- The role map clarifies access boundaries in the demo.
- This mirrors how real ops teams separate responsibilities.

### Trade-off
Client-side permission checks are not a security boundary; they should be enforced by the backend in a production implementation.

## Decision 4: Prioritize demo realism over backend complexity

### Why
The priority was authenticity of the workflow and the user experience in the front end.

### Reasoning
- The portal feels more credible when pricing, token generation, and station operations are all visible.
- Realistic visual structure creates better stakeholder feedback.
- It supports feature validation before deciding on backend architecture.

### Trade-off
The validation process is not yet complete from a production engineering standpoint.

## Decision 5: Move from browser-local storage to a persisted relational model

### Why
The project is ready to become a real operational system with traceable records and an audit trail.

### Reasoning
- Tokens, parking records, notifications, and user actions need to survive browser refreshes and multiple users.
- Historical tracking becomes reliable only when the state is stored in a server-side database.
- A real system needs accountability for who created or reviewed a record.

### Trade-off
This introduces more implementation complexity, but it is the correct foundation for a live web app.

## Decision 6: Use PostgreSQL with a backend API as the default production path

### Why
The app needs strong data integrity, queryability, and future growth.

### Reasoning
- PostgreSQL handles relational data well for tokens, users, costs, notifications, and audit history.
- An API layer gives us centralized validation and consistent authorization logic.
- It allows the UI to remain focused on workflow and presentation rather than business rules.

### Trade-off
It requires more infrastructure than a static prototype, but it scales correctly.

## Decision 7: Separate operational history from current live view

### Why
The app must maintain both current active records and historical records without losing context.

### Reasoning
- Current live tokens represent ongoing operations.
- Historical records are needed for audit, reporting, and review.
- A clear separation prevents accidental overwriting of operational evidence.

### Trade-off
The data model becomes slightly more complex, but it is the correct pattern for production systems.

## Decision 8: Use notification rules as a centralized service, not UI-only logic

### Why
The overdue vehicle process must be consistent and accountable for both owner and employee views.

### Reasoning
- Overdue logic belongs in the backend so that no user can bypass the rule in the browser.
- Notifications should be stored and tracked as records, not just displayed in the UI.
- A review queue becomes much more valuable when it is backed by persisted notification data.

### Trade-off
This introduces more development work and required validations, but it creates a trustworthy workflow.

## Decision 9: Use a free-tier live architecture first

### Why
The project needs to move to a live environment without starting with a high-cost infrastructure stack.

### Reasoning
- Vercel and Supabase provide a workable path to a real online app at very low cost.
- A free-tier approach is sufficient for a demo, stakeholder review, and early live usage.
- It allows the team to validate the live workflow before committing to paid infrastructure.

### Trade-off
The project will have free-tier limits and less flexibility than a custom production stack, but it is the correct first step for a realistic live prototype.

## Conclusion

The prototype successfully validated the workflow and business model. The next decision is to convert the demo into a real web app with persistent storage, API-based business logic, audit history, and notification tracking. This keeps the operational design intact while moving the solution toward a live production-ready system, starting with a zero-cost deployment path.
