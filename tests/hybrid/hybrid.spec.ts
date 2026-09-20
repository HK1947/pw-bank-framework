import { test, expect } from '../../fixtures/test-fixtures';
import { DataFactory } from '../../helpers/data-factory';
import { Logger } from '../../helpers/logger';

const log = Logger.getInstance();

test.describe('Hybrid — API setup + API verify @hybrid', () => {

    test('create via API, verify via API, cleanup', async ({ apiClient }) => {
        const bookingData = DataFactory.createBooking({ firstname: 'Hybrid' });
        const { bookingid } = await apiClient.createBooking(bookingData);
        log.step(`API created booking #${bookingid}`);

        const saved = await apiClient.getBooking(bookingid) as any;
        expect(saved.firstname).toBe('Hybrid');
        expect(saved.totalprice).toBe(bookingData.totalprice);
        log.success('API verified data saved correctly');

        await apiClient.deleteBooking(bookingid);
        log.step('API cleaned up test data');
    });
});

test.describe('Hybrid — data setup + UI verify @hybrid', () => {

    test('inject transaction via storage, verify in UI table', async ({ page }) => {
        await page.goto('dashboard');

        const newTransaction = {
            date: '2026-09-20',
            description: 'HYBRID TEST TRANSACTION',
            category: 'Testing',
            amount: -999.99,
            type: 'debit',
            id: 'txn-hybrid-test-001',
            accountId: 'acc-checking-1'
        };

        await page.evaluate((txn) => {
            const key = 'bank-app-v4';
            const raw = localStorage.getItem(key);
            if (!raw) return;
            const store = JSON.parse(raw);
            store.state.transactions['standard_user'].unshift(txn);
            localStorage.setItem(key, JSON.stringify(store));
        }, newTransaction);

        log.step('Injected transaction into app storage');

        await page.reload();

        const row = page.locator('table tbody tr')
            .filter({ hasText: 'HYBRID TEST TRANSACTION' });
        await expect(row).toBeVisible({ timeout: 10000 });
        log.success('UI shows injected transaction — hybrid verified!');
    });
});

test.describe('Hybrid — UI action + data verify @hybrid', () => {

    test('UI logout clears session in storage', async ({ dashboardPage, page }) => {
        const before = await page.evaluate(() => {
            const raw = localStorage.getItem('bank-app-v4');
            return raw ? JSON.parse(raw).state.currentUsername : null;
        });
        expect(before).toBe('standard_user');
        log.step(`Storage shows logged in as: ${before}`);

        await dashboardPage.logout();
        await expect(page.getByTestId('login-username-input')).toBeVisible();
        log.step('UI logout performed');

        const after = await page.evaluate(() => {
            const raw = localStorage.getItem('bank-app-v4');
            return raw ? JSON.parse(raw).state.currentUsername : null;
        });

        log.info(`Storage after logout: ${after}`);
        expect(after).not.toBe('standard_user');
        log.success('UI action correctly updated backend state');
    });
});