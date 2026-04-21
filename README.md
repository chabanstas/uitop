# UITop – Playwright Test Automation Suite

Automated test suite built with **Playwright** and **TypeScript**, covering E2E and API testing.

---

## Project Structure

```
uitop/
├── api/
│   └── tests/
│       ├── createAccount.spec.ts   # POST /createAccount – register & lifecycle tests
│       └── verifyLogin.spec.ts     # POST /verifyLogin – auth validation tests
├── e2e/
│   ├── pages/                      # Page Object Models
│   └── tests/
│       ├── signIn.spec.ts          # Sign in flow
│       └── projects.spec.ts        # Projects flow
├── fixtures/
│   ├── apiUsers.ts                 # Factory functions for valid/invalid user payloads
│   └── fixtures.ts                 # Shared Playwright fixtures
├── utils/
│   └── apiHelpers.ts               # Shared response assertion helper
├── Dockerfile                      # API tests image (node:24-alpine)
├── Dockerfile.e2e                  # E2E tests image (mcr.microsoft.com/playwright)
├── docker-compose.yml
├── playwright.config.ts
└── .github/workflows/
    ├── playwright.yml              # Node-based CI (API + E2E)
    └── docker.yml                  # Docker-based CI (API + E2E)
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) v24+ (see `.nvmrc`)
- npm v9+
- Docker & Docker Compose (optional, for containerized runs)

---

## Setup

```bash
# Install dependencies
npm ci
```

```bash
# Copy .env.example and update values
cp .env.example .env
```

---

## Running Tests Locally

### E2E tests

```bash
npm run test:e2e
```

Requires `BASE_URL` to be set in `.env`.

### API tests

```bash
npm run test:api
```

### All tests

```bash
npm run test:all
```

### With HTML report

```bash
npx playwright show-report
```

---

## Mobile Testing

> **Status: in progress — currently unavailable.**

Mobile viewport coverage (Pixel 5, iPhone 13, iPad Mini) is planned but not yet active. The project configurations are scaffolded in `playwright.config.ts` and will be enabled once the required POMs and dual-locator support are in place.

---

## Docker

Run tests in an isolated, reproducible container without installing Node locally.

### API tests

```bash
docker compose up --build api-tests
```

### E2E tests

```bash
docker compose up --build e2e-tests
```

Requires `BASE_URL` to be set in your shell or a `.env` file:

```bash
BASE_URL=https://your-app.com docker compose up --build e2e-tests
```

### Rerun without rebuilding

```bash
docker compose run --rm e2e-tests
docker compose run --rm api-tests
```

The HTML report is written to `./playwright-report` on your machine via a volume mount.

---

## CI – GitHub Actions

### Docker workflow (primary)

**Workflow:** [.github/workflows/docker.yml](.github/workflows/docker.yml)

Runs on every push and pull request to `main`/`master`.

| Job | Description |
|-----|-------------|
| `api-tests` | Builds the API Docker image and runs `npm run test:api` inside the container |
| `e2e-tests` | Builds the E2E Docker image and runs `npm run test:e2e` inside the container |

### Node workflow

**Workflow:** [.github/workflows/playwright.yml](.github/workflows/playwright.yml)

Runs tests directly on the GitHub Actions runner (no Docker).

| Job | Description |
|-----|-------------|
| `api-tests` | Installs deps and runs API tests |
| `e2e` | Installs Chromium and runs E2E tests |

Both workflows upload the Playwright HTML report as a workflow artifact retained for 30 days. `BASE_URL` must be configured as a repository secret for E2E jobs.

---

## Utilities

### `fixtures/apiUsers.ts`

- `generateValidUser()` — produces a full `ValidUser` object with all fields required by `POST /createAccount`, using `@faker-js/faker`
- `generateInvalidUser()` — produces a random email/password pair for negative tests

### `utils/apiHelpers.ts`

- `assertApiResponse(response, expectedCode, expectedMessage?)` — asserts HTTP `200` status (API always returns 200 at transport level) and validates `responseCode` + `message` fields in the JSON body
