import { test, expect } from '../fixtures/test-fixtures';
import { DataFactory } from '../helpers/data-factory';
import { UserRole } from '../types';

const successfulRoles = [
  UserRole.Standard,
  UserRole.Frozen,
  UserRole.Overdraft,
  UserRole.Slow,
  UserRole.Error,
  UserRole.Admin,
];

test.describe('Login role coverage', () => {
  for (const role of successfulRoles) {
    test(`logs in as ${role} @login`, async ({ loginPage, page }) => {
      const user = DataFactory.createUser(role);
      await loginPage.login(user.username, user.password);
      await expect(page).toHaveURL(/\/dashboard$/);
      await expect(page.getByTestId('dashboard-welcome-message')).toBeVisible({ timeout: role === UserRole.Slow ? 15_000 : 7_500 });
    });
  }

  test('rejects a locked account with an actionable error @login', async ({ loginPage }) => {
    const user = DataFactory.createUser(UserRole.Locked);
    await loginPage.login(user.username, user.password);
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).not.toBeEmpty();
  });
});

test.describe('Login validation @negative', () => {
  test('rejects a wrong password', async ({ loginPage }) => {
    await loginPage.login(process.env.STANDARD_USER ?? 'standard_user', 'definitely-wrong');
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).not.toBeEmpty();
  });

  test('rejects empty credentials', async ({ loginPage }) => {
    await loginPage.loginButton.click();
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).not.toBeEmpty();
  });

  test('rejects a non-existent user', async ({ loginPage }) => {
    await loginPage.login('non_existent_user', 'definitely-wrong');
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).not.toBeEmpty();
  });
});
