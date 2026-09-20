import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { ApiClient } from '../helpers/api-client';
import { Logger } from '../helpers/logger';

const log = Logger.getInstance();

type MyFixtures = {
    loginPage: LoginPage;
    dashboardPage: DashboardPage;
    apiClient: ApiClient;
};

export const test = base.extend<MyFixtures>({

    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        log.step('Fixture: loginPage ready on login screen');
        await use(loginPage);
    },

    dashboardPage: async ({ page }, use) => {
    // storageState already logged us in — just navigate!
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.goto();
    await expect(dashboardPage.welcomeMessage).toBeVisible({ timeout: 15000 });
    log.step('Fixture: dashboardPage ready');
    await use(dashboardPage);
},

    apiClient: async ({ request }, use) => {
        const client = new ApiClient(request);
        await client.authenticate();
        log.step('Fixture: apiClient ready - authenticated');
        await use(client);
    },
});

export { expect };