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

## Conclusion

The chosen route balances speed, clarity, and realism for a prototype. It intentionally keeps the architecture lightweight now so the team can confirm the operational model before investing in a secure, backend-backed implementation.
