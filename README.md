# MoroSystems_TA_task

Playwright test repository for e2e and integration testing.

## Prerequisites

- Node.js 22+
- npm 10+

## Repository structure

```text
.
├── tests/
│   ├── e2e/                    # End-to-end scenarios
│   ├── integration/            # API integration scenarios
│   ├── fixtures/               # Shared Playwright fixtures
│   ├── pages/                  # Page objects
│   └── services/               # API client, services and generated OpenAPI types
├── todo-be/                    # Backend app used by integration tests
├── playwright.config.ts        # Playwright configuration
├── eslint.config.mjs           # ESLint flat config
└── package.json                # Root scripts and dependencies
```

## Installation

```bash
npm install
npx playwright install chromium
```

## Run backend locally (required for integration tests)

In a separate terminal:

```bash
cd todo-be
npm install
npm start
```

Backend endpoints:

- API base URL: http://localhost:8080
- Swagger UI: http://localhost:8080/api-docs
- OpenAPI JSON: http://localhost:8080/v3/api-docs

## Run tests

Run all tests:

```bash
npm test
```

Run integration tests only (backend must be running):

```bash
npx playwright test tests/integration
```

Run e2e tests only:

```bash
npx playwright test tests/e2e
```

Run one e2e spec:

```bash
npx playwright test tests/e2e/morosystems.spec.ts
```

Run only visual tests (tagged with `@visual`):

```bash
npm run test:visual
```

## Visual snapshot testing

E2e tests use `toHaveScreenshot` for visual regression. Baseline snapshots are stored under `tests/e2e/morosystems.spec.ts-snapshots/`.

Generate or update baseline snapshots:

```bash
npx playwright test tests/e2e --update-snapshots
```

Update snapshots for a single spec:

```bash
npx playwright test tests/e2e/morosystems.spec.ts --update-snapshots
```

After updating, review the diff in the Playwright HTML report before committing the new baselines:

```bash
npx playwright show-report
```

## Useful scripts

- `npm run test:ui` starts Playwright UI mode
- `npm run test:headed` runs tests in headed browser mode
- `npm run test:debug` runs tests in debug mode
- `npm run test:visual` runs only tests tagged with `@visual`
- `npm run lint` runs ESLint static analysis
- `npm run lint:fix` runs ESLint and applies fixes
- `npm run codegen` opens Playwright codegen
- `npm run api:codegen` regenerates OpenAPI types for test services

## Challenges and selected approach
Testing Google search via Playwright or any other test automation framework is fragile because Google aggressively injects CAPTCHA when it detects automation bots. It can be possible to reduce the risk of triggering captcha, scraping or avoiding it altogether. The best approach though is always avoid captcha, either by using some sort of feature flag or similar pattern to disable captcha in tests or mock the response. Possible approaches:
- stub / mock the google search (for testing search logic without hitting google) - I chose this approach as it was the easiest for purpose of the test - I mocked the response and fetched static html with results
- mock the google-style search API response or use the google custom search API and fetch results (good if the app integrates google search and then shows results inside the app)
- make playwright behavior look more like a human - add delays between steps, randomize, slow down the tests, use stable IPs and user profiles (not preffered as it will be flaky and still randomly fail)
- use captcha-solving services - services like 2Captcha , anti-Captcha or proxy-based APIs can be integrated with plawright to solve the captcha (can be used if we really need to beat the captcha in the tests)

