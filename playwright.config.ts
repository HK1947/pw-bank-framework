import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import { getEnvironment } from './config/environment';

const targetEnvironment = process.env.ENV ?? 'qa';
dotenv.config({ path: `.env.${targetEnvironment}`, quiet: true });

const environment = getEnvironment();

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    workers: process.env.CI ? 2 : 4,
    retries: process.env.CI ? 2 : 0,
    forbidOnly: Boolean(process.env.CI),
    maxFailures: process.env.CI ? 10 : 0,
    timeout: 30_000,
    expect: { timeout: 5_000 },
    outputDir: 'test-results',

    reporter: process.env.CI
        ? [['line'], ['html', { open: 'never' }], ['junit', { outputFile: 'test-results/junit.xml' }]]
        : [['list'], ['html', { open: 'never' }]],

    use: {
        baseURL: environment.BASE_URL,
        actionTimeout: 10_000,
        navigationTimeout: 30_000,
        headless: Boolean(process.env.CI),
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        ignoreHTTPSErrors: false,
        testIdAttribute: 'data-testid',
    },

    projects: [
        {
            name: 'setup',
            testDir: './auth',
            testMatch: /.*\.setup\.ts/,
        },
        {
            name: 'chromium',
            testIgnore: /tests\/api\//,
            use: {
                ...devices['Desktop Chrome'],
                storageState: 'auth/user.json',
            },
            dependencies: ['setup'],
        },
        {
            name: 'firefox',
            testIgnore: /tests\/api\//,
            use: {
                ...devices['Desktop Firefox'],
                storageState: 'auth/user.json',
            },
            dependencies: ['setup'],
        },
        {
            name: 'api',
            testMatch: /tests\/api\/.*\.spec\.ts/,
        },
    ],
});
