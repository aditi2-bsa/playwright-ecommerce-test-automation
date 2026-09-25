import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for the SauceDemo test suite.
 * Docs: https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',

  // Run test files in parallel for speed
  fullyParallel: true,

  // Fail the CI build if someone accidentally leaves test.only in the code
  forbidOnly: !!process.env.CI,

  // Retry failed tests on CI only (helps with occasional network flakiness)
  retries: process.env.CI ? 2 : 0,

  // Use fewer workers on CI to keep runs stable
  workers: process.env.CI ? 1 : undefined,

  // HTML report (open with: npx playwright show-report) + readable console output
  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    // page.goto('/') opens this site
    baseURL: 'https://www.saucedemo.com',

    // SauceDemo tags its elements with data-test="...", so getByTestId() uses that
    testIdAttribute: 'data-test',

    // Evidence for debugging failures
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },

  // Cross-browser testing: Chrome, Firefox and Safari's engine (WebKit)
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
