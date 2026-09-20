# SecureBank Playwright Framework

Production-oriented Playwright framework covering browser, API, and browser-state integration tests for the SecureBank demo application.

## Setup

1. Install dependencies with `npm ci`.
2. Install browsers with `npx playwright install chromium firefox`.
3. Copy `.env.example` to `.env.qa` and provide the QA credentials.
4. Run `npm run check`, then `npm test`.

Local environment files and generated authentication states are intentionally excluded from Git. CI prefers GitHub Actions secrets and falls back only to the public demo accounts documented by the sandbox applications. Real environment credentials must always be stored as secrets.

## Commands

| Command | Purpose |
| --- | --- |
| `npm test` | Full UI, API, and hybrid suite |
| `npm run test:smoke` | Fast release-confidence scenarios |
| `npm run test:regression` | Tests not tagged `@smoke` |
| `npm run test:api` | API project only |
| `npm run test:flake` | Repeat each test three times for flake detection |
| `npm run check` | Type-check, lint, and validate test discovery |
| `npm run report` | Open the latest HTML report |

## Architecture

- `auth/`: creates fresh standard and admin storage states.
- `pages/`: page objects and governed locators.
- `fixtures/`: typed dependency injection for pages and API clients.
- `helpers/`: API contracts, data factories, and utilities.
- `tests/api/`: browser-independent API tests, executed only by the `api` project.
- `tests/hybrid/`: browser-state/UI integration with explicit state restoration.
- `playwright/.auth/`: generated locally or in CI; never committed.

Login tests run in dedicated unauthenticated browser projects. Authenticated browser projects depend on setup and never execute login or API-only specs.

## Test strategy

The suite prioritizes observable business outcomes:

- Authentication and role identity.
- Dashboard financial summaries and navigation.
- Transfer and bill-payment validation guardrails.
- Transaction search and displayed amounts.
- Full API create/read/update/delete lifecycle with guaranteed cleanup.
- Logout and client-state integration.

Use `@smoke` for the smallest set required to establish that authentication and critical navigation work. Use `@api`, `@hybrid`, `@login`, and `@negative` for focused execution and reporting. New tests must use stable semantic locators or `data-testid`, avoid fixed sleeps, clean up created data in `finally`, and assert a business result rather than only element presence.

## CI diagnostics

CI runs static quality gates before tests, emits HTML and JUnit reports, and uploads `playwright-report/` plus `test-results/` on every run. Traces are recorded on the first retry. A failing setup project blocks authenticated projects by design; inspect its screenshot and trace first.
