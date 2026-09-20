import { test, expect } from '../fixtures/test-fixtures';

test.describe('Banking guardrails', () => {
  test('transfer requires a source account before review', async ({ transferPage, page }) => {
    await expect(transferPage.toAccount).toBeDisabled();
    await expect(transferPage.amount).toHaveAttribute('min', '0.01');
    await transferPage.reviewButton.click();
    await expect(page.getByRole('alert').filter({ hasText: 'Please select a From account.' })).toBeVisible();
  });

  test('bill payment prevents invalid amount and past-date entry', async ({ billPayPage, page }) => {
    await expect(billPayPage.amount).toHaveAttribute('min', '0.01');
    const minimumDate = await billPayPage.paymentDate.getAttribute('min');
    expect(minimumDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(minimumDate).not.toBeNull();
    await billPayPage.reviewButton.click();
    await expect(page.getByRole('alert').filter({ hasText: 'Please select an account.' })).toBeVisible();
  });

  test('transaction search returns only matching financial records', async ({ transactionsPage }) => {
    await transactionsPage.search('Whole Foods Market');
    await expect(transactionsPage.rows).toHaveCount(1);
    await expect(transactionsPage.rows.first()).toContainText('Whole Foods Market');
    await expect(transactionsPage.rows.first()).toContainText('-$87.43');
  });
});
