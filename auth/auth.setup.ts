import { mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

const STANDARD_USER_FILE = 'playwright/.auth/user.json';
const ADMIN_USER_FILE = 'playwright/.auth/admin.json';

function requiredEnv(name: 'STANDARD_USER' | 'STANDARD_PASS' | 'ADMIN_USER' | 'ADMIN_PASS'): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required for authentication setup`);
  return value;
}

async function ensureAuthDirectory(path: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
}

setup('authenticate as standard user', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(requiredEnv('STANDARD_USER'), requiredEnv('STANDARD_PASS'));
  await expect(page.getByTestId('dashboard-welcome-message')).toBeVisible();
  await ensureAuthDirectory(STANDARD_USER_FILE);
  await page.context().storageState({ path: STANDARD_USER_FILE });
});

setup('authenticate as admin user', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(requiredEnv('ADMIN_USER'), requiredEnv('ADMIN_PASS'));
  await expect(page.getByTestId('dashboard-welcome-message')).toBeVisible();
  await ensureAuthDirectory(ADMIN_USER_FILE);
  await page.context().storageState({ path: ADMIN_USER_FILE });
});
