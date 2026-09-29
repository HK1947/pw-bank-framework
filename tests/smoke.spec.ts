import { test, expect } from '../fixtures/test-fixtures';

test('standard user can log in @smoke', async ({ loginPage, page }) => {
  const username = process.env.STANDARD_USER;
  const password = process.env.STANDARD_PASS;
  if (!username || !password) throw new Error('STANDARD_USER and STANDARD_PASS are required');

  await loginPage.login(username, password);
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByTestId('dashboard-welcome-message')).toBeVisible();
});

test('invalid credentials show an error @smoke', async ({ loginPage }) => {
  await loginPage.login('wrong_user', 'wrong_pass');
  await expect(loginPage.errorMessage).toBeVisible();
  await expect(loginPage.errorMessage).not.toBeEmpty();
});
