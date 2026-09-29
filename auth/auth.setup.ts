import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { Logger } from '../helpers/logger';
import { getEnvironment } from '../config/environment';

const log = Logger.getInstance();
const environment = getEnvironment();

const STANDARD_USER_FILE = 'auth/user.json';
const ADMIN_USER_FILE = 'auth/admin.json';

setup('authenticate as standard user', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(environment.STANDARD_USER, environment.STANDARD_PASS);

    await expect(page.getByTestId('dashboard-welcome-message')).toBeVisible({ timeout: 10000 });

    await page.context().storageState({ path: STANDARD_USER_FILE });
    log.success(`Standard user auth saved to ${STANDARD_USER_FILE}`);
});

setup('authenticate as admin user', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(environment.ADMIN_USER, environment.ADMIN_PASS);

    await expect(page.getByTestId('dashboard-welcome-message')).toBeVisible({ timeout: 10000 });

    await page.context().storageState({ path: ADMIN_USER_FILE });
    log.success(`Admin user auth saved to ${ADMIN_USER_FILE}`);
});
