import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import { getEnvironment } from './config/environment';

dotenv.config({ path: `.env.${process.env.ENV ?? 'qa'}`, quiet: true });

const environment = getEnvironment();

// Relative navigation such as page.goto('login') requires a directory-style base URL.
const baseURL = environment.BASE_URL.endsWith('/') ? environment.BASE_URL : `${environment.BASE_URL}/`;
const unauthenticatedTests = ['**/login.spec.ts', '**/smoke.spec.ts'];
const apiTests = '**/api/**/*.spec.ts';

console.log(`Environment: ${environment.ENV_NAME}`);
console.log(`Base URL: ${baseURL}`);

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  retries: process.env.CI ? 1 : 0,
  forbidOnly: Boolean(process.env.CI),
  maxFailures: process.env.CI ? 10 : 0,
  timeout: 30_000,
  expect: { timeout: 7_500 },
  outputDir: 'test-results',

  reporter: process.env.CI
    ? [['line'], ['html', { open: 'never' }], ['junit', { outputFile: 'test-results/junit.xml' }]]
    : [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL,
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
    headless: true,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'setup',
      testDir: './auth',
      testMatch: /.*\.setup\.ts/,
      use: { storageState: { cookies: [], origins: [] } },
    },
    {
      name: 'chromium',
      testIgnore: [...unauthenticatedTests, apiTests],
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      testIgnore: [...unauthenticatedTests, apiTests],
      use: {
        ...devices['Desktop Firefox'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'login-chromium',
      testMatch: unauthenticatedTests,
      testIgnore: apiTests,
      use: { ...devices['Desktop Chrome'], storageState: { cookies: [], origins: [] } },
    },
    {
      name: 'login-firefox',
      testMatch: unauthenticatedTests,
      testIgnore: apiTests,
      use: { ...devices['Desktop Firefox'], storageState: { cookies: [], origins: [] } },
    },
    {
      name: 'api',
      testMatch: apiTests,
      use: { baseURL: environment.API_BASE_URL },
    },
  ],
});
