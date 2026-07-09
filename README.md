# OpenCart Web + API Playwright Framework

## Overview

This is a Playwright + TypeScript automation framework for OpenCart application, supporting both UI and API testing with modern practices like POM, Fixtures, CI/CD, and Data-Driven Testing.

It runs both locally and in GitHub Actions, with Allure reports auto-published to GitHub Pages.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Environment Configuration](#environment-configuration)
- [Running Tests](#running-tests)
- [Reports](#reports)
- [Screenshots](#screenshots)
- [Project Structure](#project-structure)
- [Writing Tests](#writing-tests)
- [Data-Driven Testing](#data-driven-testing)
- [API Testing](#api-testing)
- [CI/CD Pipeline](#cicd-pipeline)
- [Code Style](#code-style)
- [Troubleshooting](#troubleshooting)

---

## Features

- **Playwright + TypeScript** — strongly typed test automation
- **Page Object Model** — reusable page classes extending a common `BasePage`
- **Custom Fixtures** — pre-instantiated page objects and API helpers injected into tests
- **Multi-environment support** — `qa`, `dev`, `stage` via dotenv
- **Data-driven tests** — parametrized runs from CSV, Excel, and JSON sources
- **API Testing** — REST helper wrapping GET/POST/PUT/DELETE with JSON schema validation via Ajv
- **Reporting** — Playwright HTML report + Allure report with historical trend graphs
- **CI/CD** — GitHub Actions pipeline with secrets, artifact uploads, and GitHub Pages deployment

---

## Prerequisites

- **Node.js** 20 or higher
- **npm** (bundled with Node.js)
- Git

---

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/sasims07-spec/OpenCartWebAPIPlayWrightFramework.git
cd OpenCartWebAPIPlayWrightFramework

# 2. Install dependencies
npm ci

# 3. Install Playwright browsers
npx playwright install --with-deps chromium

# 4. Create your local env file (see next section)
cp config/.env.qa.example config/.env.qa   # or create manually

# 5. Run the tests
npm test
```

---

## Environment Configuration

The framework loads environment variables from `config/.env.<ENV>` at startup. The `ENV` variable selects which file — defaults to `qa`.

Create the appropriate env file inside `config/`:

**`config/.env.qa`** (example):

```env
BASE_URL=https://naveenautomationlabs.com/
OC_USERNAME=your-username@example.com
OC_PASSWORD=your-password

API_BASE_URL=https://gorest.co.in
API_Token=your-gorest-api-token

OAUTH_CLIENT_ID=your-spotify-client-id
OAUTH_CLIENT_SECRET=your-spotify-client-secret
GRANT_TYPE=client_credentials
```

Env files are gitignored — never commit real credentials. For CI, store these values in GitHub repository secrets (see [CI/CD Pipeline](#cicd-pipeline)).

Available env variants:

| File                | Purpose                  |
| ------------------- | ------------------------ |
| `config/.env.qa`    | QA environment (default) |
| `config/.env.dev`   | Development environment  |
| `config/.env.stage` | Staging environment      |

Select an environment by setting `ENV`:

```bash
ENV=stage npx playwright test     # bash / zsh
$env:ENV="stage"; npx playwright test   # PowerShell
```

---

## Running Tests

All scripts are defined in [package.json](package.json):

| Command               | Description                               |
| --------------------- | ----------------------------------------- |
| `npm test`            | Run all tests headless                    |
| `npm run test:headed` | Run all tests with a visible browser      |
| `npm run test:chrome` | Run only the Chromium project             |
| `npm run test:stage`  | Run against staging (`ENV=stage`)         |
| `npm run format`      | Format all TS/JS/JSON files with Prettier |

### Run a specific test file

```bash
npx playwright test tests/loginpage.spec.ts
```

### Run in debug/UI mode

```bash
npx playwright test --debug
npx playwright test --ui
```

### View the last HTML report

```bash
npx playwright show-report reports/my-html-report
```

---

## Reports

### 1. Playwright HTML Report

Generated automatically after every run at `reports/my-html-report/`. View with:

```bash
npx playwright show-report reports/my-html-report
```

### 2. Allure Report

Rich report with suite grouping, trend graphs, and full test history.

```bash
# Full workflow: clean, run, generate, open
npm run allure:clean
npm test
npm run allure:report
```

Individual scripts:

| Command                   | Purpose                                           |
| ------------------------- | ------------------------------------------------- |
| `npm run allure:generate` | Build `allure-report/` from `allure-results/`     |
| `npm run allure:open`     | Open the generated report in a browser            |
| `npm run allure:report`   | Runs generate + open                              |
| `npm run allure:clean`    | Wipes both `allure-results/` and `allure-report/` |

### 3. Live Allure Report (CI)

Every push to `main` publishes an updated Allure report to GitHub Pages, complete with historical trend graphs.

**Live URL:** https://sasims07-spec.github.io/OpenCartWebAPIPlayWrightFramework/

---

## Screenshots

### Playwright HTML Report

![Playwright HTML Report](docs/screenshots/playwright-report.png)

### Allure Report

![Allure Report Overview](docs/screenshots/allure-report.png)

### Allure Trend Graph (CI history)

![Allure Trends](docs/screenshots/allure-trends.png)

> Screenshots live in `docs/screenshots/`. Update them by capturing the local report views and dropping the PNGs into that folder using the exact filenames above.

---

## Project Structure

```
.
├── .github/
│   └── workflows/
│       └── playwright.yml       # CI/CD pipeline
├── config/
│   ├── .env.qa                  # Environment vars (gitignored)
│   ├── .env.dev
│   └── .env.stage
├── src/
│   ├── api/
│   │   └── ApiHelper.ts         # REST client wrapper (GET/POST/PUT/DELETE)
│   ├── data/
│   │   ├── *.csv                # CSV test data
│   │   ├── *.json               # JSON test data
│   │   └── *.xlsx               # Excel test data
│   ├── fixtures/
│   │   ├── pagefixtures.ts      # Injects page objects into tests
│   │   └── apifixtures.ts       # Injects API helper into tests
│   ├── pages/
│   │   ├── basePage.ts          # Common page actions
│   │   ├── homePage.ts
│   │   ├── loginPage.ts
│   │   ├── registrationPage.ts
│   │   ├── searchResultsPage.ts
│   │   └── ProductInfoPage.ts
│   └── utils/
│       ├── CsvHelper.ts         # CSV parsing utilities
│       ├── ExcelHelper.ts       # Excel parsing utilities
│       └── JsonHelper.ts        # JSON parsing utilities
├── tests/
│   ├── api/                     # API test specs
│   │   ├── users.api.spec.ts
│   │   ├── users.api.sep.spec.ts
│   │   ├── users.api.indi.spec.ts
│   │   ├── users.api.schema.spec.ts
│   │   ├── spotify.oauth2.spec.ts
│   │   └── intercept.spec.ts
│   ├── homepage.spec.ts         # UI test specs
│   ├── homepagefixture.spec.ts
│   ├── loginpage.spec.ts
│   ├── loginpagefixture.spec.ts
│   ├── productpage.spec.ts
│   ├── registrationpagefixture.spec.ts
│   └── search.spec.ts
├── playwright.config.ts         # Playwright config (projects, reporters, timeouts)
├── package.json
├── tsconfig.json
├── .gitattributes               # Enforces LF line endings
└── .prettierrc                  # Prettier config
```

---

## Writing Tests

### Plain test (no fixture)

```ts
import { test, expect } from "@playwright/test";
import { LoginPage } from "../src/pages/loginPage";

test("login page has expected title", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await page.goto("/index.php?route=account/login");
  expect(await loginPage.getLoginPageTitle()).toBe("Account Login");
});
```

### Test using fixtures (preferred)

Fixtures in `src/fixtures/pagefixtures.ts` pre-construct common page objects so specs stay focused on the assertion:

```ts
import { test, expect } from "../src/fixtures/pagefixtures";

test("logout link exists after login", async ({ homePage }) => {
  expect(await homePage.isLogoutLinkExist()).toBeTruthy();
});
```

---

## Data-Driven Testing

Tests are parametrized from external data sources. Each row/entry becomes an independent test run — visible individually in the report.

### CSV

```ts
import { test } from "../src/fixtures/pagefixtures";
import { CsvHelper } from "../src/utils/CsvHelper";

const rows = CsvHelper.readCsv("src/data/loginData.csv");

for (const row of rows) {
  test(`invalid login test with ${row.username} using csv data`, async ({ loginPage }) => {
    await loginPage.doLogin(row.username, row.password);
    // ...assertions
  });
}
```

### Excel

Use [ExcelHelper.ts](src/utils/ExcelHelper.ts) — wraps `xlsx` for `.xlsx` files.

### JSON

Use [JsonHelper.ts](src/utils/JsonHelper.ts) — straightforward import for `.json` files under `src/data/`.

---

## API Testing

The framework provides two API-testing styles:

### 1. Fixture-based (recommended)

Injects a pre-configured `ApiHelper` bound to `API_BASE_URL`:

```ts
import { test, expect } from "../../src/fixtures/apifixtures";

const AUTH_HEADER = { Authorization: `Bearer ${process.env.API_Token}` };

test("Get all users", async ({ apiHelper }) => {
  const response = await apiHelper.get("/public/v2/users", AUTH_HEADER);
  expect(response.status).toBe(200);
});
```

### 2. Direct Playwright request context

```ts
import { test, expect } from "@playwright/test";

test("Get user test", async ({ request }) => {
  const response = await request.get("https://gorest.co.in/public/v2/users/");
  expect(response.status()).toBe(200);
});
```

### JSON Schema Validation

Response payloads can be validated against Ajv schemas — see [users.api.schema.spec.ts](tests/api/users.api.schema.spec.ts).

---

## CI/CD Pipeline

The pipeline is defined in [.github/workflows/playwright.yml](.github/workflows/playwright.yml). It runs on:

- Every push to `main`
- Every pull request targeting `main`
- Manual trigger via **Actions → Playwright Tests → Run workflow**

### Pipeline steps

1. Checkout code
2. Setup Node.js 20
3. `npm ci` + install Playwright browsers
4. Run tests against `ENV=qa`
5. Upload Playwright HTML report as an artifact
6. Upload raw Allure results as an artifact
7. Build Allure report and merge with previous history
8. Publish to the `gh-pages` branch → served via GitHub Pages

### Required GitHub Secrets

Configure these under **Settings → Secrets and variables → Actions**:

| Secret Name           | Purpose                                           |
| --------------------- | ------------------------------------------------- |
| `BASE_URL`            | Base URL for the OpenCart app                     |
| `OC_USERNAME`         | OpenCart login username                           |
| `OC_PASSWORD`         | OpenCart login password                           |
| `API_BASE_URL`        | Base URL for API tests (e.g. gorest.co.in)        |
| `API_TOKEN`           | Bearer token for gorest API                       |
| `OAUTH_CLIENT_ID`     | Spotify OAuth client ID                           |
| `OAUTH_CLIENT_SECRET` | Spotify OAuth client secret                       |
| `GRANT_TYPE`          | OAuth grant type (typically `client_credentials`) |

### Viewing pipeline output

- **Live report:** https://sasims07-spec.github.io/OpenCartWebAPIPlayWrightFramework/
- **Run history:** repo **Actions** tab
- **Per-run artifacts:** click a run → scroll to **Artifacts** section
  - `playwright-html-report` — for trace viewer / videos / screenshots
  - `allure-results` — raw JSON if you want to regenerate locally

---

## Code Style

- **Prettier** — run `npm run format` before committing
- **Line endings** — enforced to LF via [.gitattributes](.gitattributes)
- **TypeScript strict mode** — see [tsconfig.json](tsconfig.json)

---

## Troubleshooting

**"src refspec main does not match any"**
Your local branch is named `master`, not `main`. Rename it:

```bash
git branch -m master main
git push -u origin main
```

**"LF will be replaced by CRLF" warnings on `git add`**
Handled by [.gitattributes](.gitattributes) — the repo enforces LF everywhere. The warning is harmless.

**API tests failing with 401 Unauthorized in CI**
`API_TOKEN` secret missing or misnamed. Check that the workflow env block maps `API_Token: ${{ secrets.API_TOKEN }}` (note the mixed-case env var name expected by the tests).

**UI tests failing with `locator.fill: value: expected string, got undefined`**
`OC_USERNAME` / `OC_PASSWORD` env vars are not loaded. Verify your `config/.env.<ENV>` file exists, or that the CI secrets are set.

**Allure report shows no history/trends**
The first pipeline run has no prior `gh-pages` branch to pull history from — trends populate from run #2 onwards.

---

## Contributing

1. Create a feature branch from `main`
2. Make your changes and run `npm test` locally
3. Run `npm run format` before committing
4. Push and open a pull request against `main`
5. Wait for the pipeline to pass — the Allure report on `gh-pages` will update with your run's results

---

## License

ISC — see [package.json](package.json).
