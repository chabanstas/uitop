import { defineConfig, devices } from '@playwright/test';
import assert from 'assert';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const baseURL = process.env.BASE_URL;
assert(
  baseURL,
  'BASE_URL environment variable is not set. Please set it in your .env file or environment variables.'
);
const timeout = 30000;
export default defineConfig({
  testDir: '.',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.WORKERS ? parseInt(process.env.WORKERS, 10) : 3,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['line'], ['html', { open: 'never' }]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'e2e',
      testMatch: 'e2e/**/*.spec.ts',
      testIgnore: '**/api/**',
      use: {
        baseURL,
        screenshot: 'only-on-failure',
        actionTimeout: timeout / 4,
        ...devices['Desktop Chrome'],
      },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // Commented as require additional POMs or double locators to handle mobile elements
    // {
    //   name: 'Mobile Chrome - Pixel 5',
    //   testMatch: 'e2e/**/*.spec.ts',
    //   use: {
    //     baseURL,
    //     screenshot: 'only-on-failure',
    //     ...devices['Pixel 5'],
    //   },
    // },
    // {
    //   name: 'Mobile Safari - iPhone 13',
    //   testMatch: 'e2e/**/*.spec.ts',
    //   use: {
    //     baseURL,
    //     screenshot: 'only-on-failure',
    //     ...devices['iPhone 13'],
    //   },
    // },
    // {
    //   name: 'Tablet Safari - iPad Mini',
    //   testMatch: 'e2e/**/*.spec.ts',
    //   use: {
    //     baseURL,
    //     screenshot: 'only-on-failure',
    //     ...devices['iPad Mini'],
    //   },
    // },

    {
      name: 'api',
      testMatch: '**/api/**/*.spec.ts',
      use: {
        baseURL: 'https://automationexercise.com',
      },
    },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
