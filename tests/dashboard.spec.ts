import { test, expect } from '../fixtures/test-fixtures';
import { Logger } from '../helpers/logger';

const log = Logger.getInstance();

test.describe('Dashboard @smoke', () => {

    test('dashboard loads with all sections', async ({ dashboardPage }) => {
        
        await expect(dashboardPage.welcomeMessage).toBeVisible();
        await expect(dashboardPage.totalNetWorth).toBeVisible();
        await expect(dashboardPage.quickTransfer).toBeVisible();
        await expect(dashboardPage.transactionRows.first()).toBeVisible();
        log.success('All dashboard sections visible');
    });

    test('net worth displays correct format', async ({ dashboardPage }) => {
        await dashboardPage.goto();
        const netWorth = await dashboardPage.getNetWorth();
        log.info(`Net Worth: ${netWorth}`);
        expect(netWorth).toMatch(/^\$[\d,]+\.\d{2}$/);
        log.success(`Net worth format valid: ${netWorth}`);
    });

    test('transactions table has rows', async ({ dashboardPage }) => {
        await dashboardPage.goto();
        const count = await dashboardPage.getTransactionCount();
        expect(count).toBeGreaterThan(0);
        log.success(`Transaction table has ${count} rows`);
    });
});

test.describe('Dynamic Table Search @table', () => {

    test('find transaction by description — any row', async ({ dashboardPage, page }) => {
        await dashboardPage.goto();
        const searchFor = 'Whole Foods Market';

        const row = page.locator('table tbody tr').filter({ hasText: searchFor });
        await expect(row).toBeVisible();

        const date = await row.locator('td').nth(0).textContent();
        const description = await row.locator('td').nth(1).textContent();
        const category = await row.locator('td').nth(2).textContent();
        const amount = await row.locator('td').nth(3).textContent();

        log.info(`Found: ${date} | ${description} | ${category} | ${amount}`);
        expect(description).toContain(searchFor);
        log.success(`Dynamic table search worked`);
    });

    test('loop through ALL rows and collect data', async ({ dashboardPage, page }) => {
        await dashboardPage.goto();
        const rows = page.locator('table tbody tr');
        const count = await rows.count();
        const transactions: string[] = [];

        for (let i = 0; i < count; i++) {
            const description = await rows.nth(i).locator('td').nth(1).textContent();
            transactions.push(description ?? '');
        }

        log.info(`All transactions: ${transactions.join(', ')}`);
        expect(transactions.length).toBe(count);
        log.success(`Collected ${transactions.length} descriptions`);
    });
});

test.describe('Dashboard Navigation @navigation', () => {

    test('quick action navigates to transfer', async ({ dashboardPage, page }) => {
        await dashboardPage.goto();
        await dashboardPage.quickTransfer.click();
        await expect(page).toHaveURL(/transfer/);
        log.success('Quick transfer navigation works');
    });

    test('logout works', async ({ dashboardPage, page }) => {
        await dashboardPage.goto();
        await dashboardPage.logout();
        await expect(page.getByTestId('login-username-input')).toBeVisible();
        log.success('Logout returned to login page');
    });
});