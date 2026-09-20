import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class BillPayPage extends BasePage {
  readonly form: Locator;
  readonly fromAccount: Locator;
  readonly amount: Locator;
  readonly paymentDate: Locator;
  readonly reviewButton: Locator;

  constructor(page: Page) {
    super(page);
    this.form = page.getByTestId('bill-pay-form');
    this.fromAccount = page.getByTestId('bill-pay-from-select');
    this.amount = page.getByTestId('bill-amount-input');
    this.paymentDate = page.getByTestId('bill-payment-date-input');
    this.reviewButton = page.getByTestId('review-bill-btn');
  }

  async goto(): Promise<void> {
    await this.navigate('bill-pay');
    await this.form.waitFor({ state: 'visible' });
  }
}
