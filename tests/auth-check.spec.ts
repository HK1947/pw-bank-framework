import { test, expect } from '@playwright/test';

test('already logged in — no login code needed', async ({ page }) => {
    // storageState loaded cookies automatically!
    await page.goto('dashboard');
    
    await expect(page.getByTestId('dashboard-welcome-message')).toBeVisible();
    console.log('✅ storageState works! Already authenticated.');
});

test.describe('Admin tests', () => {
    test.use({ storageState: 'auth/admin.json' });
    //         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    //   Override: this describe block uses ADMIN cookies!

    test('logged in as admin', async ({ page }) => {
        await page.goto('dashboard');
        await expect(page.getByTestId('dashboard-welcome-message')).toBeVisible();
        console.log('✅ Admin storageState works!');
    });
});