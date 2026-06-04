// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Points to your tests directory inside the project subfolder
  testDir: './tests',

  /* FIX 1: Turn off global full parallelism on CI when using matrix sharding.
     This ensures consistent test tracking across your 3 GitHub shards. */
  fullyParallel: process.env.CI ? false : true,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  /* Retry configurations—optimized to match your workflow overrides */
  retries: process.env.CI ? 1 : 0,

  /* Keep workers strictly locked to 1 on CI to prevent race conditions on the slow target site */
  workers: process.env.CI ? 1 : undefined,

  /* FIX 2: Explicitly format and anchor the allure-results folder paths relative 
     to the current working directory so the GitHub Actions uploader can find them. */
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['allure-playwright', { resultsDir: 'allure-results' }]
  ],

  /* Shared settings for all the projects below. */
  use: {
    // Target base URL to shorten your test navigation paths safely
    baseURL: 'https://automationexercise.com',

    /* Hardened timeout options to handle sluggish application responses on the backend */
    actionTimeout: 20000,
    navigationTimeout: 45000,

    /* Collect trace for deep debugging if an entry falls over */
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Firefox and WebKit are kept here but ignored on CI since your scripts target '--project=chromium'
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});