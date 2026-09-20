import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.ENV || 'qa'}` });

console.log(`🌐 Environment: ${process.env.ENV_NAME}`);
console.log(`🔗 Base URL: ${process.env.BASE_URL}`);

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    workers: process.env.CI ? 2 : 4,
    retries: process.env.CI ? 2 : 0,
    forbidOnly: !!process.env.CI,
    maxFailures: process.env.CI ? 10 : 0,
    timeout: 30_000,
    expect: { timeout: 5_000 },

    reporter: [
        ['list'],
        ['html', { open: 'never' }],
    ],

    use: {
        baseURL: process.env.BASE_URL,
        actionTimeout: 10_000,
        navigationTimeout: 30_000,
        headless: !!process.env.CI,
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        ignoreHTTPSErrors: true,
    },

   projects: [
    {
        name: 'setup',
        testDir: './auth',
        //       ^^^^^^^^^^
        //   Override testDir for THIS project only!
        testMatch: /.*\.setup\.ts/,
    },
    {
        name: 'chromium',
        use: {
            ...devices['Desktop Chrome'],
           storageState: 'auth/user.json',
        },
        dependencies: ['setup'],
    },
    {
        name: 'firefox',
        use: {
            ...devices['Desktop Firefox'],
            storageState: 'auth/user.json',
        },
        dependencies: ['setup'],
    },
],
});