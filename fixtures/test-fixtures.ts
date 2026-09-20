import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { TransferPage } from '../pages/TransferPage';
import { BillPayPage } from '../pages/BillPayPage';
import { TransactionsPage } from '../pages/TransactionsPage';
import { ApiClient } from '../helpers/api-client';

interface FrameworkFixtures {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  transferPage: TransferPage;
  billPayPage: BillPayPage;
  transactionsPage: TransactionsPage;
  apiClient: ApiClient;
}

export const test = base.extend<FrameworkFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },

  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.goto();
    await use(dashboardPage);
  },

  transferPage: async ({ page }, use) => {
    const transferPage = new TransferPage(page);
    await transferPage.goto();
    await use(transferPage);
  },

  billPayPage: async ({ page }, use) => {
    const billPayPage = new BillPayPage(page);
    await billPayPage.goto();
    await use(billPayPage);
  },

  transactionsPage: async ({ page }, use) => {
    const transactionsPage = new TransactionsPage(page);
    await transactionsPage.goto();
    await use(transactionsPage);
  },

  apiClient: async ({ request }, use) => {
    const client = new ApiClient(request);
    await client.authenticate();
    await use(client);
  },
});

export { expect };
