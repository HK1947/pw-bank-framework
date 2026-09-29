import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class TransferPage extends BasePage {
  readonly form: Locator;
  readonly fromAccount: Locator;
  readonly toAccount: Locator;
  readonly amount: Locator;
  readonly reviewButton: Locator;

  constructor(page: Page) {
    super(page);
    this.form = page.getByTestId('transfer-form');
    this.fromAccount = page.getByTestId('transfer-from-select');
    this.toAccount = page.getByTestId('transfer-to-select');
    this.amount = page.getByTestId('transfer-amount-input');
    this.reviewButton = page.getByTestId('review-transfer-btn');
  }

  async goto(): Promise<void> {
    await this.navigate('transfer');
    await this.form.waitFor({ state: 'visible' });
  }
}
