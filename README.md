# UITop – Playwright Test Automation Suite

Automated test suite built with **Playwright** and **TypeScript**, covering API testing scenarios against [AutomationExercise](https://automationexercise.com/api_list).

---

## Project Structure

```
uitop/
├── tests/
│   └── api/
│       ├── createAccount.spec.ts   # POST /createAccount – register & lifecycle tests
│       └── verifyLogin.spec.ts     # POST /verifyLogin – auth validation tests
├── fixtures/
│   └── apiUsers.ts                 # Factory functions for valid/invalid user payloads
├── utils/
│   └── apiHelpers.ts               # Shared response assertion helper
├── playwright.config.ts
└── .github/workflows/playwright.yml
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) v20+ (see `.nvmrc`)
- npm v9+

---

## Setup

```bash
# Install dependencies
npm ci
```

No browser binaries are needed — API tests use Playwright's `request` context only.

---

## Running Tests Locally

### API tests only (recommended)

```bash
npm run test:api
```

### All tests

```bash
npm run test:all
```

### With HTML report

```bash
npm run test:api
npx playwright show-report
```

---

## Test Coverage

### `POST /createAccount` — [createAccount.spec.ts](tests/api/createAccount.spec.ts)

| TC | Description | Expected |
|----|-------------|----------|
| TC-1 | Register a new user, verify login, delete account, confirm deletion | `201 User created!` → `200 User exists!` → `200 Account deleted!` → `404 not found` |
| TC-2 | Create account with missing required fields (only `name` provided) | `400 Bad request` |

Each test generates a unique user via `generateValidUser()` (faker-based). An `afterEach` hook deletes the test user to keep the environment clean.

---

### `POST /verifyLogin` — [verifyLogin.spec.ts](tests/api/verifyLogin.spec.ts)

| TC | Description | Expected |
|----|-------------|----------|
| TC-3 | POST with missing `email` parameter | `400 Bad request, email or password parameter is missing in POST request.` |
| TC-4 | DELETE method on `/verifyLogin` endpoint | `405 This request method is not supported.` |
| TC-5 | POST with invalid (random) email and password | `404 User not found!` |

---

## Docker

Run tests in an isolated, reproducible container without installing Node locally.

```bash
# Build image and run tests
docker compose up --build

# View the HTML report after tests finish
npx playwright show-report
```

The container installs dependencies, runs `npm run test:api`, and exits. The HTML report is written to `./playwright-report` on your machine via a volume mount.

---

## CI – GitHub Actions

Tests run automatically on every push and pull request to `main`/`master`.

**Workflow:** [.github/workflows/playwright.yml](.github/workflows/playwright.yml)

- Job: `api-tests`
- Runs: `npm run test:api`
- Uploads the HTML report as an artifact (`api-test-report`, retained 30 days)

The E2E browser job is scaffolded in the workflow but currently disabled — the staging environment is not available for automated UI testing at this time.

---

## Utilities

### `fixtures/apiUsers.ts`

- `generateValidUser()` — produces a full `ValidUser` object with all fields required by `POST /createAccount`, using `@faker-js/faker`
- `generateInvalidUser()` — produces a random email/password pair for negative tests

### `utils/apiHelpers.ts`

- `assertApiResponse(response, expectedCode, expectedMessage?)` — asserts HTTP `200` status (API always returns 200 at transport level) and validates `responseCode` + `message` fields in the JSON body
