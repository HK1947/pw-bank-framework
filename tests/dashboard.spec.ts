import { test, expect } from '../fixtures/test-fixtures';

test.describe('Dashboard @smoke', () => {
  test('loads the financial summary, actions, and transactions', async ({ dashboardPage }) => {
    await expect(dashboardPage.welcomeMessage).toBeVisible();
    await expect(dashboardPage.totalNetWorth).toBeVisible();
    await expect(dashboardPage.quickTransfer).toBeVisible();
    await expect(dashboardPage.transactionRows.first()).toBeVisible();
  });

  test('formats net worth as US currency', async ({ dashboardPage }) => {
    await expect.poll(() => dashboardPage.getNetWorth()).toMatch(/^\$[\d,]+\.\d{2}$/);
  });

  test('shows meaningful recent transaction data', async ({ dashboardPage }) => {
    const descriptions = await dashboardPage.getAllTransactionDescriptions();
    expect(descriptions.length).toBeGreaterThan(0);
    expect(descriptions).toContain('Whole Foods Market');
    expect(descriptions.every((description) => description.trim().length > 0)).toBe(true);
  });
});

test.describe('Dashboard navigation', () => {
  test('quick transfer opens the transfer workflow', async ({ dashboardPage, page }) => {
    await dashboardPage.quickTransfer.click();
    await expect(page).toHaveURL(/\/transfer$/);
    await expect(page.getByTestId('transfer-form')).toBeVisible();
  });

  test('logout clears the authenticated UI state', async ({ dashboardPage, page }) => {
    await dashboardPage.logout();
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByTestId('login-username-input')).toBeVisible();
  });
});
