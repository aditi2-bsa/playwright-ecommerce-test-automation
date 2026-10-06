# E-Commerce Test Automation with Playwright

![Playwright Tests](https://github.com/aditi2-bsa/playwright-ecommerce-test-automation/actions/workflows/playwright.yml/badge.svg)

An automated end-to-end test suite for [SauceDemo](https://www.saucedemo.com), a demo online store, built with **Playwright** and **TypeScript**.
The tests run in **Chrome, Firefox and WebKit (Safari)** on every push with **GitHub Actions**.

## What is tested

| Area | Tests |
|---|---|
| **Login** | valid login, wrong password, locked-out user, empty username/password, blocked access without login |
| **Products** | sorting by name (A–Z, Z–A) and price (low→high, high→low) |
| **Cart** | add/remove items, cart badge count, cart contents, cart persists while shopping |
| **Checkout** | full purchase flow, subtotal + 8% tax + total calculation, required-field validation |

## Project structure

```
├── pages/                # Page Object Model: one class per page
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
├── tests/                # Test specs grouped by feature
│   ├── login.spec.ts
│   ├── products.spec.ts
│   ├── cart.spec.ts
│   └── checkout.spec.ts
├── test-data/users.ts    # Users, error messages and products kept out of the tests
├── playwright.config.ts  # Browsers, base URL, screenshots/videos on failure
└── .github/workflows/    # CI pipeline
```

## Design decisions

- **Page Object Model:** tests describe *what* a user does; page classes handle *how* (selectors). If the UI changes, only one file needs updating.
- **Stable selectors:** elements are found by their `data-test` attributes, not by CSS classes that change with styling.
- **Separate test data:** usernames, error messages and product names live in one file.
- **Failure evidence:** screenshots and videos are saved automatically when a test fails, and traces are recorded on retries.
- **Price checks use `toBeCloseTo`** to avoid false failures from decimal rounding.

## Run it locally

```bash
npm install
npx playwright install
npm test               # all browsers
npm run test:chrome    # Chrome only
npm run test:headed    # watch the browser run
npm run test:ui        # Playwright's interactive UI mode
npm run report         # open the HTML report
```

## Tech stack

Playwright · TypeScript · Node.js · GitHub Actions

## Test documentation
- [Test plan](docs/test-plan.md): scope, approach and all 27 test cases
- [Bug reports](docs/bug-reports.md): 5 defects found, including 1 critical checkout blocker