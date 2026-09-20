import { test, expect } from '@playwright/test';

test('standard authenticated state opens the dashboard @smoke', async ({ page }) => {
  await page.goto('dashboard');
  await expect(page.getByTestId('dashboard-welcome-message')).toBeVisible();
  await expect(page.getByTestId('sidebar-user-info')).toContainText(process.env.STANDARD_USER ?? 'standard_user');
});

test.describe('admin authorization', () => {
  test.use({ storageState: 'playwright/.auth/admin.json' });

  test('admin authenticated state identifies the admin user', async ({ page }) => {
    await page.goto('dashboard');
    await expect(page.getByTestId('dashboard-welcome-message')).toBeVisible();
    await expect(page.getByTestId('sidebar-user-info')).toContainText(process.env.ADMIN_USER ?? 'admin_user');
  });
});
