import { test, expect } from '../../fixtures/test-fixtures';

test.describe('Browser state and UI integration @hybrid', () => {
  test('injected transaction is rendered and test state is restored', async ({ page }) => {
    await page.goto('dashboard');
    const storageKey = 'bank-app-v4';
    const original = await page.evaluate((key) => localStorage.getItem(key), storageKey);
    expect(original).not.toBeNull();

    try {
      await page.evaluate(({ key, raw }) => {
        if (!raw) throw new Error(`Missing ${key} application state`);
        const store = JSON.parse(raw) as { state: { transactions: Record<string, unknown[]> } };
        const transactions = store.state.transactions.standard_user;
        if (!transactions) throw new Error('Missing standard_user transactions');
        transactions.unshift({
          date: '2026-09-20',
          description: 'HYBRID TEST TRANSACTION',
          category: 'Testing',
          amount: -999.99,
          type: 'debit',
          id: 'txn-hybrid-test-001',
          accountId: 'acc-checking-1',
        });
        localStorage.setItem(key, JSON.stringify(store));
      }, { key: storageKey, raw: original });

      await page.reload();
      await expect(page.locator('table tbody tr').filter({ hasText: 'HYBRID TEST TRANSACTION' })).toBeVisible();
    } finally {
      await page.evaluate(({ key, raw }) => {
        if (raw === null) localStorage.removeItem(key);
        else localStorage.setItem(key, raw);
      }, { key: storageKey, raw: original });
    }
  });

  test('logout clears the current authenticated username', async ({ dashboardPage, page }) => {
    const before = await page.evaluate(() => {
      const raw = localStorage.getItem('bank-app-v4');
      return raw ? (JSON.parse(raw) as { state: { currentUsername: string | null } }).state.currentUsername : null;
    });
    expect(before).toBe('standard_user');

    await dashboardPage.logout();
    await expect(page.getByTestId('login-username-input')).toBeVisible();

    const after = await page.evaluate(() => {
      const raw = localStorage.getItem('bank-app-v4');
      return raw ? (JSON.parse(raw) as { state: { currentUsername: string | null } }).state.currentUsername : null;
    });
    expect(after).toBeNull();
  });
});
